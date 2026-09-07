/**
 * Clinic Group Sessions — image-led horizontal swipe gallery.
 *
 * An editorial, image-led presentation of the group sessions (distinct from
 * the numbered practice explorer and from the homepage's overlay-text square
 * gallery): each slide is a landscape photograph with the session type, title,
 * one-line summary, location and "Découvrir la séance" link BELOW the image —
 * no full-bleed overlay, no cards, no numbered vertical list.
 *
 *   Gallery: all sessions in a native horizontal scroll-snap track — exactly
 *           3 panels on desktop, ~2 on tablet, ~1 + next-preview on mobile.
 *           Each panel carries TWO actions: a primary "Book Now" link to the
 *           booking flow (contact form with the session preselected) and an
 *           "Explore" link to its session detail page (image, title and text
 *           link all navigate to the detail page).
 *
 *   Interaction: native swipe on touch; mouse drag with instant follow
 *           (pointer-capture is NOT used so link/button clicks are never
 *           retargeted — movement beyond a threshold cancels the following
 *           click instead); arrow buttons glide the track with a slow premium
 *           ease (~850ms easeOutQuint) and disable at the ends.
 *
 *   Motion: the active (snap-aligned) slide image settles scale 1.05→1 /
 *           opacity .9→1 (`.hp-img`/`.hp-img-active`). No GSAP — carousel
 *           movement only. Everything is disabled under prefers-reduced-motion.
 *
 * Content derives from the shared group-sessions adapter and is untouched.
 * Titles + links are present in the initial HTML (SSR / SEO); only the first
 * slide image is eager, the rest lazy.
 */
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface SessionItem {
  slug: string;
  title: string;
  type: string;
  summary: string;
  location?: string;
  image: string;
  /** Locale-aware session detail URL (/seance-de-groupe/<slug> or /en/…) — "Explore" destination */
  href: string;
  /** Locale-aware booking URL (contact form with the session preselected) — "Book Now" destination */
  bookingHref: string;
}

interface SessionsExplorerProps {
  sessions: SessionItem[];
  /** "Découvrir la séance" / "Explore session" — visible detail link label. */
  ctaDetail: string;
  /** "Réserver" / "Book Now" — visible primary action label. */
  bookNow: string;
  /** "Réserver — {title}" / "Book — {title}" — accessible Book Now name. */
  bookNowAria: string;
  /** "Découvrir — {title}" / "Explore — {title}" — accessible Explore name. */
  exploreAria: string;
  /** Accessible name of the carousel region. */
  galleryLabel: string;
  /** Accessible prev / next names. */
  prevLabel: string;
  nextLabel: string;
}

/** Pointer movement above this cancels the following click (drag ≠ tap). */
const DRAG_THRESHOLD = 8;
/** Arrow glide duration — premium slow transition (~850ms). */
const GLIDE_DURATION = 850;
/** Ease-out quint ≈ cubic-bezier(0.22, 1, 0.36, 1): fast start, soft landing. */
const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);

const PANEL_SIZES = "(max-width: 767px) 82vw, (max-width: 1023px) 48vw, 33vw";
const PANEL_WIDTH =
  "w-[85vw] md:w-[calc((100%_-_24px)/2)] lg:w-[calc((100%_-_48px)/3)]";

export default function SessionsExplorer({
  sessions,
  ctaDetail,
  bookNow,
  bookNowAria,
  exploreAria,
  galleryLabel,
  prevLabel,
  nextLabel,
}: SessionsExplorerProps): React.JSX.Element {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const scrollRafRef = useRef(0);
  const glideRafRef = useRef(0);
  const glideSnapRef = useRef(false);
  const dragRef = useRef<{
    id: number;
    lastX: number;
    startX: number;
    moved: boolean;
    winUp: (e: PointerEvent) => void;
    winBlur: () => void;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const reduceMotion = (): boolean =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stepSize = (): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.querySelector(".hp-slide") as HTMLElement | null;
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "12") || 12;
    return first.offsetWidth + gap;
  };

  const clampIndex = (i: number): number =>
    Math.max(0, Math.min(sessions.length - 1, i));

  const currentIndex = (): number => {
    const track = trackRef.current;
    if (!track || sessions.length === 0) return 0;
    const step = stepSize();
    if (!step) return 0;
    return clampIndex(Math.round(track.scrollLeft / step));
  };

  const syncActive = (): void => {
    const idx = currentIndex();
    if (idx !== activeIdxRef.current) {
      activeIdxRef.current = idx;
      setActiveIdx(idx);
    }
  };

  const cancelGlide = (): void => {
    if (glideRafRef.current) cancelAnimationFrame(glideRafRef.current);
    glideRafRef.current = 0;
    if (glideSnapRef.current) {
      glideSnapRef.current = false;
      const track = trackRef.current;
      if (track) track.style.scrollSnapType = "";
    }
  };

  const glideTo = (index: number, duration = GLIDE_DURATION): void => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepSize();
    if (!step) return;
    cancelGlide();
    const from = track.scrollLeft;
    const to = clampIndex(index) * step;
    if (Math.abs(to - from) < 1) {
      syncActive();
      return;
    }
    glideSnapRef.current = true;
    track.style.scrollSnapType = "none";
    const start = performance.now();
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / duration);
      track.scrollLeft = from + (to - from) * easeOutQuint(p);
      if (p < 1) {
        glideRafRef.current = requestAnimationFrame(tick);
      } else {
        glideRafRef.current = 0;
        glideSnapRef.current = false;
        track.style.scrollSnapType = "";
        syncActive();
      }
    };
    glideRafRef.current = requestAnimationFrame(tick);
  };

  const goPrev = (): void => {
    if (activeIdxRef.current > 0) {
      glideTo(activeIdxRef.current - 1, reduceMotion() ? 1 : GLIDE_DURATION);
    }
  };

  const goNext = (): void => {
    if (activeIdxRef.current < sessions.length - 1) {
      glideTo(activeIdxRef.current + 1, reduceMotion() ? 1 : GLIDE_DURATION);
    }
  };

  const onTrackScroll = (): void => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      syncActive();
    });
  };

  /** End a mouse drag: detach window listeners, restore snap, re-snap to nearest. */
  const endMouseDrag = (id: number): void => {
    const drag = dragRef.current;
    if (!drag || drag.id !== id) return;
    dragRef.current = null;
    window.removeEventListener("pointerup", drag.winUp);
    window.removeEventListener("pointercancel", drag.winUp);
    window.removeEventListener("blur", drag.winBlur);
    const track = trackRef.current;
    if (!track) return;
    track.style.cursor = "";
    if (drag.moved) {
      track.style.scrollSnapType = "";
      glideTo(currentIndex(), reduceMotion() ? 1 : 400);
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    } else {
      track.style.scrollSnapType = "";
    }
  };

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    cancelGlide();
    const track = trackRef.current;
    if (!track) return;
    // Window-level listeners (NOT pointer capture, which would retarget the
    // following click away from the slide link and kill navigation).
    const winUp = (ev: PointerEvent): void => endMouseDrag(ev.pointerId);
    const winBlur = (): void => {
      const d = dragRef.current;
      if (d) endMouseDrag(d.id);
    };
    window.addEventListener("pointerup", winUp);
    window.addEventListener("pointercancel", winUp);
    window.addEventListener("blur", winBlur);
    track.style.scrollSnapType = "none";
    track.style.cursor = "grabbing";
    dragRef.current = {
      id: e.pointerId,
      lastX: e.clientX,
      startX: e.clientX,
      moved: false,
      winUp,
      winBlur,
    };
  };

  const onTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - drag.lastX;
    track.scrollLeft -= dx;
    drag.lastX = e.clientX;
    if (Math.abs(e.clientX - drag.startX) > DRAG_THRESHOLD) drag.moved = true;
  };

  const onTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    endMouseDrag(e.pointerId);
  };

  const onTrackClickCapture = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  if (sessions.length === 0) return <></>;
  const lastIndex = sessions.length - 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={galleryLabel}
    >
      <div
        ref={trackRef}
        onScroll={onTrackScroll}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={onTrackPointerUp}
        onClickCapture={onTrackClickCapture}
        className="hp-track flex gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain cursor-grab select-none"
      >
{sessions.map((s, i) => (
          <div key={s.slug} className={`hp-slide shrink-0 snap-start ${PANEL_WIDTH}`}>
            <Link
              href={s.href}
              aria-label={exploreAria.replace("{title}", s.title)}
              className="group block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]"
            >
              <div className="relative overflow-hidden rounded-[20px] bg-[#0B1220]/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    {...(i === 0 ? { priority: true } : { loading: "lazy" })}
                    sizes={PANEL_SIZES}
                    className={`hp-img object-cover ${i === activeIdx ? "hp-img-active" : ""}`}
                  />
                </div>
              </div>
            </Link>

            <div className="mt-4 sm:mt-5 pr-1">
              <span className="flex items-center gap-2 flex-wrap">
                <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.2em] uppercase">
                  {s.type}
                </span>
                {s.location ? (
                  <span className="inline-flex items-center gap-1 text-xs text-[#0B1220]/45">
                    <svg
                      className="w-3.5 h-3.5 text-[#B88A5A]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {s.location}
                  </span>
                ) : null}
              </span>

              <Link
                href={s.href}
                className="group/title block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]"
              >
                <h3
                  className="heading-serif text-[#0B1220] leading-tight mt-1.5 transition-colors group-hover/title:text-[#B88A5A]"
                  style={{ fontSize: "clamp(1.2rem, 1.4vw, 1.65rem)" }}
                >
                  {s.title}
                </h3>
              </Link>

              <p className="mt-2 text-[#0B1220]/60 text-sm sm:text-[15px] leading-relaxed line-clamp-2">
                {s.summary}
              </p>

              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  href={s.bookingHref}
                  aria-label={bookNowAria.replace("{title}", s.title)}
                  className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-lg bg-gradient-to-b from-[#B88A5A] to-[#9A7242] px-5 text-sm font-semibold text-white shadow-sm whitespace-nowrap transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                >
                  {bookNow}
                </Link>
                <Link
                  href={s.href}
                  aria-label={exploreAria.replace("{title}", s.title)}
                  className="group/explore inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1220] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]"
                >
                  <span className="underline underline-offset-8 decoration-[#B88A5A]/40 transition-colors group-hover/explore:decoration-[#B88A5A]">
                    {ctaDetail}
                  </span>
                  <svg
                    className="w-4 h-4 text-[#B88A5A] transition-transform group-hover/explore:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Progress dots + arrow controls (disabled at the ends) ── */}
      <div className="mt-8 lg:mt-10 flex items-center justify-end gap-3">
        <span className="mr-auto flex items-center gap-2" aria-hidden="true">
          {sessions.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIdx ? "w-4 bg-[#B88A5A]" : "w-1.5 bg-[#0B1220]/20"
              }`}
            />
          ))}
        </span>
        <button
          type="button"
          aria-label={prevLabel}
          disabled={activeIdx === 0}
          onClick={goPrev}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B1220]/15 text-[#0B1220] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#0B1220]/15 disabled:hover:text-[#0B1220]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={activeIdx === lastIndex}
          onClick={goNext}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B1220]/15 text-[#0B1220] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#0B1220]/15 disabled:hover:text-[#0B1220]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}