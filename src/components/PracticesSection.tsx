/**
 * Practices & Specialties — cinematic square swipe gallery (homepage).
 *
 * A refined, image-led gallery (inspired by premium wellness swipers;
 * structure only — Wenaya content, photography and copy):
 *
 *   Header: eyebrow + large serif H2 on the left, ONE short supporting
 *           paragraph + "Voir toutes les pratiques" text-link on the right.
 *
 *   Gallery: 8 square practice panels (aspect 1/1) in a native horizontal
 *           scroll-snap track — exactly 3 fill the full gallery width on
 *           desktop, ~2 on tablet, ~1 + next-preview on mobile. Each panel is
 *           a square `object-cover` image with a navy bottom gradient and, in
 *           the lower overlay, the title / one-line teaser / two actions:
 *           a primary "Réserver / Book Now" CTA and a secondary "Découvrir →
 *           / Explore" link.
 *
 *   Booking (per-practice, via the shared `pratique-cta` logic):
 *           1 mapped specialist → /professional/[slug] (straight to booking)
 *           2+ specialists     → /pratiques/[slug]#specialists (choose)
 *           0 specialists      → /professional (listing / not directly mapped)
 *
 *   Interaction: native swipe on touch; mouse drag with instant follow on
 *           desktop (pointer-capture is NOT used so link/button clicks are
 *           never retargeted — movement beyond a threshold cancels the
 *           following click instead); arrow buttons glide the track with a
 *           slow premium ease (~850ms easeOutQuint) and disable at the ends.
 *
 *   Motion: active (snap-aligned) slide settles scale 1.05→1 (`.hp-img`/
 *           `.hp-img-active`); GSAP entrance (eyebrow fade → heading rise →
 *           paragraph fade → first three panels stagger) fires once; all
 *           transforms/transitions are disabled under prefers-reduced-motion.
 *
 * All practice data derives from the shared practices adapter
 * (`getAllPratiques`, locale-aware) so the EN homepage never inherits French
 * copy. Titles + links are present in the initial HTML (SSR / SEO); only the
 * first panel image is eager, the rest lazy — no CLS from a priority flood.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { getAllPratiques } from "@/lib/pratiques";
import { getSpecialistsForPractice } from "@/lib/pratique-specialists";
import { getPratiqueBookingCta } from "@/lib/pratique-cta";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import type { DiseaseMarqueeContent } from "@/lib/homepage-types";

/** Curated homepage selection — all must exist in the canonical dataset. */
const GALLERY_SLUGS: string[] = [
  "kinesitherapie",
  "osteopathie",
  "psychologie",
  "nutrition",
  "naturopathie",
  "sophrologie",
  "orthophonie",
  "yoga",
];

/** High-resolution visual for practices whose own image is low-res. */
const HIGH_RES_IMAGE: Record<string, string> = {
  psychologie: "/pratiques/psychotherapie.jpg",
};

/** Pointer movement above this cancels the following click (drag ≠ tap). */
const DRAG_THRESHOLD = 8;
/** Arrow glide duration — premium slow transition (~850ms). */
const GLIDE_DURATION = 850;
/** Ease-out quint ≈ cubic-bezier(0.22, 1, 0.36, 1): fast start, soft landing. */
const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);

interface GalleryItem {
  number: string;
  slug: string;
  title: string;
  teaser: string;
  image: string;
  /** Secondary action → practice detail page. */
  href: string;
  /** Primary action → practice-specific booking destination. */
  bookHref: string;
}

/** Collapse a practice description to a single sentence — derived from the
 *  current source, no new medical claims. */
function explorerTeaser(desc: string): string {
  if (!desc) return desc;
  const trimmed = desc.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^(.*?[.!?])(\s|$)/);
  let one = (match ? match[1] : trimmed).trim();
  if (one.length > 140) one = one.slice(0, 140).trim().replace(/[.,;:]+$/, "") + "…";
  return one;
}

const PANEL_SIZES = "(max-width: 767px) 85vw, (max-width: 1023px) 48vw, 33vw";

/** Bronze-filled Wenaya primary button (matches the practice-page CTA). */
const BOOK_LINK_CLASS =
  "pointer-events-auto inline-flex h-10 sm:h-11 items-center justify-center rounded-lg px-4 sm:px-5 " +
  "text-xs sm:text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-px " +
  "active:translate-y-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF7EB]";

/** Secondary "Discover" editorial text-link (on dark imagery). */
const EXPLORE_LINK_CLASS =
  "pointer-events-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C99B68] " +
  "cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99B68] " +
  "transition-opacity hover:opacity-90";

interface PracticesSectionProps {
  content?: DiseaseMarqueeContent;
}

export default function PracticesSection({ content }: PracticesSectionProps): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred("200px 0px");

  const all = getAllPratiques(locale);
  const items: GalleryItem[] = GALLERY_SLUGS.map((slug, i) => {
    const p = all.find((candidate) => candidate.slug === slug);
    if (!p) return null;
    const specialists = getSpecialistsForPractice(p.slug);
    const singleSlug = specialists.length === 1 ? specialists[0].slug : undefined;
    const primaryCta = getPratiqueBookingCta(locale, specialists.length, singleSlug);
    return {
      number: String(i + 1).padStart(2, "0"),
      slug,
      title: p.title,
      teaser: explorerTeaser(p.description),
      image: HIGH_RES_IMAGE[p.slug] ?? p.image,
      href: h(locale, `/pratiques/${p.slug}`),
      // 2+ specialists → the practice page's in-page specialist chooser.
      bookHref:
        primaryCta.label === "choose"
          ? h(locale, `/pratiques/${p.slug}#specialists`)
          : primaryCta.href,
    };
  }).filter((p): p is GalleryItem => p !== null);

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

  const clampIndex = (i: number): number => Math.max(0, Math.min(items.length - 1, i));

  const currentIndex = (): number => {
    const track = trackRef.current;
    if (!track || items.length === 0) return 0;
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
    if (activeIdxRef.current < items.length - 1) {
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
    // following click away from the book/discover link and kill navigation).
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

  // Entrance animation — eyebrow fade, heading rise, paragraph fade, then the
  // first three (initially visible) panels stagger in. Fires once.
  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    if (reduceMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
      });
      const slides = gsap.utils.toArray<HTMLElement>(".hp-slide", el).slice(0, 3);
      tl.fromTo(".hp-eyebrow", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, 0)
        .fromTo(".hp-head", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, 0.12)
        .fromTo(".hp-text", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.28);
      slides.forEach((slide, i) => {
        tl.fromTo(
          slide,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.35 + i * 0.1
        );
      });
    }, el);

    return () => ctx.revert();
  }, [ready, sectionRef]);

  if (items.length === 0) return <></>;

  const eyebrow = content?.badge ?? t("homePractices.eyebrow");
  const discover = t("homePractices.discover");
  const bookNow = t("homePractices.bookNow");
  const bookNowAria = t("homePractices.bookNowAria");
  const exploreAria = t("homePractices.exploreAria");
  const lastIndex = items.length - 1;

  return (
    <section
      ref={sectionRef}
      id="pratiques"
      aria-labelledby="home-practices-heading"
      className="relative overflow-hidden px-4 sm:px-10 py-14 lg:py-20 bg-[#FAF8F4]"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Editorial header: eyebrow + H2 left, one paragraph + CTA right ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10 mb-10 lg:mb-14">
          <div className="lg:max-w-xl">
            <span className="hp-eyebrow block text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase mb-5">
              {eyebrow}
            </span>
            <h2
              id="home-practices-heading"
              className="hp-head heading-serif text-[#0B1220] leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {content?.heading1 ?? t("homePractices.heading1")}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {content?.heading2 ?? t("homePractices.heading2")}
              </span>
            </h2>
          </div>
          <div className="hp-text lg:max-w-xs lg:text-right lg:flex lg:flex-col lg:items-end">
            <p className="text-[#0B1220]/55 text-[15px] sm:text-base leading-relaxed">
              {content?.sub ?? t("homePractices.sub")}
            </p>
            <Link
              href={h(locale, "/pratiques")}
              className="group/link mt-5 lg:mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]"
            >
              <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover/link:decoration-[#B88A5A] transition-colors">
                {content?.cta ?? t("homePractices.cta")}
              </span>
              <svg
                className="w-4 h-4 text-[#B88A5A] transition-transform group-hover/link:translate-x-1"
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

        {/* ── Cinematic square swipe gallery ── */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={t("homePractices.galleryLabel")}
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
            {items.map((it, i) => (
              <div
                key={it.slug}
                className="hp-slide shrink-0 snap-start w-[85vw] md:w-[calc((100%_-_24px)/2)] lg:w-[calc((100%_-_48px)/3)]"
              >
                <div className="relative overflow-hidden rounded-[24px] bg-[#0B1220] ring-1 ring-[#0B1220]/5">
                  <div className="relative aspect-square">
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      {...(i === 0 ? { priority: true } : { loading: "lazy" })}
                      sizes={PANEL_SIZES}
                      className={`hp-img object-cover ${i === activeIdx ? "hp-img-active" : ""}`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,18,32,0.82)] via-[rgba(11,18,32,0.34)] via-35% to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 pointer-events-none">
                    <span className="font-mono text-[11px] tracking-[0.18em] text-[#B88A5A]">
                      {it.number}
                    </span>
                    <h3
                      className="heading-serif text-white leading-tight mt-1 line-clamp-2"
                      style={{ fontSize: "clamp(1.15rem, 1.3vw, 1.6rem)" }}
                    >
                      {it.title}
                    </h3>
                    <p className="mt-1.5 text-white/75 text-[12px] sm:text-[13px] leading-snug sm:leading-relaxed line-clamp-2">
                      {it.teaser}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={it.bookHref}
                        aria-label={`${bookNowAria} — ${it.title}`}
                        className={BOOK_LINK_CLASS}
                        style={{
                          background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px rgba(184,138,90,0.28)",
                        }}
                      >
                        {bookNow}
                      </Link>
                      <Link
                        href={it.href}
                        aria-label={`${exploreAria} — ${it.title}`}
                        className={EXPLORE_LINK_CLASS}
                      >
                        {discover}
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Arrow controls (disabled at the ends — non-infinite) ── */}
          <div className="flex items-center justify-center gap-3 mt-8 lg:mt-10">
            <button
              type="button"
              aria-label={t("homePractices.prev")}
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
              aria-label={t("homePractices.next")}
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
      </div>
    </section>
  );
}