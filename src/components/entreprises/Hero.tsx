/**
 * Corporate Hero — cinematic, full-bleed hero for the /corporate page.
 *
 * Same presentation system as the Clinic hero (near-full-viewport image hero,
 * copy layered over the visual in the lower-left, slow background settle,
 * subtle scroll parallax, masked line-by-line entrance) while keeping the
 * Corporate executive identity: serif H1 with tight tracking, bronze accent
 * line, pill CTAs, value-prop bullets. Wenaya copy and CTA destinations are
 * untouched.
 *
 * Animation initial-states live in the shared `.ch-*` CSS (globals.css) so the
 * content is hidden at first paint — no flash — then revealed by GSAP (scoped
 * to this section via gsap.context). Under `prefers-reduced-motion` everything
 * renders statically visible: no zoom, no parallax, no looping scroll hint.
 */
"use client";

import Image from "next/image";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function EntreprisesHero(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const bullets = tRaw<string[]>("entreprises.hero.bullets");
  const { elRef: sectionRef, ready } = useIntersectionDeferred();

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    // Reduced motion is fully handled by CSS (visible static content) — no tweens.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Background settles from scale(1.07) → 1.0 (initial scale set in CSS).
      gsap.fromTo(
        ".ch-bg-wrap",
        { scale: 1.07 },
        { scale: 1.0, duration: 8.5, ease: "power1.out" }
      );

      // 2. Slight parallax while the hero scrolls out (translate only).
      gsap.fromTo(
        ".ch-bg-wrap",
        { yPercent: -2 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        }
      );

      // 3. Layered entrance: eyebrow → H1 lines → paragraph → CTAs → bullets → hint.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".ch-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(
          ".ch-line",
          { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.1 },
          "-=0.25"
        )
        .to(".ch-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".ch-cta", { opacity: 1, y: 0, duration: 0.55 }, "-=0.4")
        .to(".ch-proof", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .to(".ch-scroll", { opacity: 1, duration: 0.5 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      aria-label={t("entreprises.hero.badge")}
      className="relative flex items-end overflow-hidden bg-[#0B1220] min-h-[82svh] sm:min-h-[86svh] lg:min-h-[90vh]"
    >
      {/* ── Background — full-bleed visual with layered navy + bronze melt ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="ch-bg-wrap absolute inset-x-0 -top-[6%] -bottom-[6%] will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=2400&q=100"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Global darkening, weighted toward the text zone (left) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,18,32,0.85) 0%, rgba(11,18,32,0.50) 38%, rgba(11,18,32,0.20) 68%, rgba(11,18,32,0.06) 100%)",
          }}
        />
        {/* Bottom depth — melts into the #D4A56A top edge of the Stats section
            that follows (bronze), so the hero-to-section transition is seamless. */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 sm:h-52 lg:h-64"
          style={{
            background:
              "linear-gradient(to top, #D4A56A 0%, #D4A56A 5%, rgba(212,165,106,0.55) 14%, rgba(212,165,106,0.22) 26%, rgba(11,18,32,0) 44%, rgba(11,18,32,0) 100%)",
          }}
        />
      </div>

      {/* ── Content — lower-left, no card, no panel ── */}
      <div className="relative z-10 w-full px-6 sm:px-10 pt-32 pb-14 sm:pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="ch-eyebrow ch-fade flex items-center gap-3 mb-6 lg:mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {t("entreprises.hero.badge")}
              </span>
            </div>

            {/* H1 — exactly one, revealed line by line through overflow-hidden masks */}
            <h1
              className="text-white leading-[1.08] tracking-[-0.03em] font-serif"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)", fontWeight: 500 }}
            >
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <span className="ch-line block will-change-transform">
                  {t("entreprises.hero.heading1")}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <span
                  className="ch-line block will-change-transform text-transparent bg-clip-text pb-[0.02em]"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 50%, #B88A5A 100%)",
                  }}
                >
                  {t("entreprises.hero.heading2")}
                </span>
              </span>
            </h1>

            {/* Single supporting paragraph */}
            <p className="ch-sub ch-fade mt-6 sm:mt-7 max-w-[560px] text-white/75 text-base sm:text-lg leading-relaxed">
              {t("entreprises.hero.desc")}
            </p>

            {/* CTAs — primary bronze, secondary outline; same row on desktop */}
            <div className="ch-cta ch-fade mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] sm:w-auto w-full"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {t("entreprises.hero.cta1")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#downloads"
                className="inline-flex items-center justify-center gap-2 h-13 px-6 rounded-full text-white/65 text-sm font-medium border border-white/[0.18] backdrop-blur-[2px] bg-white/[0.04] transition-all duration-300 hover:text-white hover:border-white/[0.32] hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] sm:w-auto w-full"
              >
                {t("entreprises.hero.cta2")}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v4h16v-4" />
                </svg>
              </a>
            </div>

            {/* Value props — subtle proof under the action row */}
            <ul className="ch-proof ch-fade mt-8 sm:mt-9 space-y-2.5 sm:space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-white/90 text-sm sm:text-base">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Scroll hint — subtle, bottom-right, desktop only ── */}
      <div className="ch-scroll ch-fade absolute bottom-10 right-10 z-10 hidden lg:flex flex-col items-center gap-3">
        <span className="text-white/35 text-[10px] font-semibold tracking-[0.22em] uppercase">
          {t("entreprises.hero.scrollHint")}
        </span>
        <span className="relative block w-px h-12 overflow-hidden bg-white/10">
          <span className="ch-scroll-dot absolute left-0 top-0 h-4 w-px bg-[#B88A5A]/80" />
        </span>
      </div>
    </section>
  );
}