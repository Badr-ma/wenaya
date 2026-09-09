/**
 * Care Journey cinematic hero — full-bleed, navy, image-led opener for the
 * detail pages (FR + EN). Mirrors the site's Clinic/Corporate hero system
 * (`ch-*` initial states in globals.css + a GSAP reveal gated on
 * `useIntersectionDeferred`, fully disabled under `prefers-reduced-motion`).
 *
 * Exactly ONE `<h1>` (the journey title). The introductory copy is NOT dumped
 * here — a short derived dek is shown (first sentence of the existing intro,
 * or the hub teaser), and the full intro still appears in the two-column
 * article intro below, so no content is duplicated or lost.
 */
"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

/** First sentence of existing copy, capped at a comfort word-boundary (~170c). */
function deriveDek(source: string): string {
  const cleaned = source.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const cut = cleaned.length > 170 ? cleaned.slice(0, 170).split(" ").slice(0, -1).join(" ") + "…" : cleaned;
  return cut;
}

interface Props {
  title: string;
  dekSource: string;
  eyebrow: string;
  heroImage: string;
  /** Optional "back to the hub" link (shown above the eyebrow). */
  backHref?: string;
  backLabel?: string;
  /** Optional scroll CTA (e.g. "Découvrir les recommandations" → #recommandations). */
  ctaHref?: string;
  ctaLabel?: string;
  /** Optional editorial "associated practice" label pill. */
  relatedLabel?: string;
  relatedPracticeTitle?: string;
}

export default function CareJourneyHero({
  title,
  dekSource,
  eyebrow,
  heroImage,
  backHref,
  backLabel,
  ctaHref,
  ctaLabel,
  relatedLabel,
  relatedPracticeTitle,
}: Props) {
  const { elRef: sectionRef, ready } = useIntersectionDeferred();
  const bgWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ch-bg-wrap",
        { scale: 1.07 },
        { scale: 1.0, duration: 8.5, ease: "power1.out" }
      );
      gsap.fromTo(
        ".ch-bg-wrap",
        { yPercent: -2 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        }
      );

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".ch-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(".ch-line", { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.1 }, "-=0.25")
        .to(".ch-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".ch-back", { opacity: 1, y: 0, duration: 0.45 }, "-=0.6")
        .to(".ch-cta", { opacity: 1, y: 0, duration: 0.5 }, "-=0.45")
        .to(".ch-related", { opacity: 1, duration: 0.55 }, "-=0.4");
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const dek = deriveDek(dekSource);

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      aria-label={eyebrow}
      className="relative flex items-end overflow-hidden bg-[#0B1220] min-h-[62svh] sm:min-h-[68svh] lg:min-h-[74vh]"
    >
      {/* ── Background — full-bleed visual with layered navy overlay ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          ref={bgWrapRef}
          className="ch-bg-wrap absolute inset-x-0 -top-[6%] -bottom-[6%] will-change-transform"
        >
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Global darkening weighted toward the text zone (left) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,18,32,0.82) 0%, rgba(11,18,32,0.50) 40%, rgba(11,18,32,0.22) 70%, rgba(11,18,32,0.06) 100%)",
          }}
        />
        {/* Bottom depth — compact melt into the sand intro below (kept short so
            the hero fades without leaving a large empty ivory band) */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 sm:h-20 lg:h-24"
          style={{
            background:
              "linear-gradient(to top, rgba(242,239,233,0.98) 0%, rgba(242,239,233,0.6) 30%, rgba(242,239,233,0) 100%)",
          }}
        />
      </div>

      {/* ── Content — lower-left, no card ── */}
      <div className="relative z-10 w-full px-6 sm:px-10 pt-28 sm:pt-32 pb-12 sm:pb-14 lg:pt-40 lg:pb-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            {backHref && backLabel ? (
              <a
                href={backHref}
                className="ch-back ch-fade mb-7 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                {backLabel}
              </a>
            ) : null}

            <div className="ch-eyebrow ch-fade flex items-center gap-3 mb-6 lg:mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {eyebrow}
              </span>
            </div>

            <h1
              className="heading-serif text-white leading-[1.04] tracking-[-0.01em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
            >
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span className="ch-line block will-change-transform text-balance">{title}</span>
              </span>
            </h1>

            {dek ? (
              <p className="ch-sub ch-fade mt-6 sm:mt-7 max-w-[620px] text-white/75 text-base sm:text-lg leading-relaxed">
                {dek}
              </p>
            ) : null}

            {ctaHref && ctaLabel ? (
              <a
                href={ctaHref}
                className="ch-cta ch-fade mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-[2px] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                {ctaLabel}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            ) : null}

            {relatedLabel && relatedPracticeTitle ? (
              <div className="ch-related ch-fade mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 backdrop-blur-[2px]">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#B88A5A]">
                  {relatedLabel}
                </span>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <span className="heading-serif text-white/90 text-sm sm:text-base">
                  {relatedPracticeTitle}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
