/**
 * Clinic Hero — cinematic, full-bleed hero for the Clinic/B2C page (/about).
 *
 * Inspired by premium wellness sites (structure only — Wenaya branding, text
 * and photography are untouched): near-full-viewport image hero, copy layered
 * over the visual in the lower-left, a slow scale settle on the background,
 * subtle scroll parallax, and a controlled line-by-line entrance.
 *
 * Content (kept identical to the previous hero):
 *   - eyebrow  "Wenaya Clinic · Casablanca"
 *   - H1       "Soigner. / Prévenir. / Prolonger."  (one H1, three masked lines)
 *   - one supporting paragraph
 *   - non-interactive audience labels (Enfants · Adultes · Seniors)
 *   - primary CTA → /professional (booking/specialists), secondary → /pratiques
 *
 * Animation initial-states live in CSS (`.ch-*` classes in globals.css) so the
 * content is hidden at first paint — no flash — then revealed by GSAP.
 * Under `prefers-reduced-motion` the CSS shows everything statically: no zoom,
 * no parallax, no looping scroll hint.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function ClinicHero(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred();
  const bgWrapRef = useRef<HTMLDivElement | null>(null);
  const audiences = locale === "en"
    ? ["Children", "Adults", "Seniors"]
    : ["Enfants", "Adultes", "Seniors"];

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
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        }
      );

      // 3. Layered entrance: eyebrow → H1 lines → paragraph → audiences → CTAs → hint.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".ch-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(
          ".ch-line",
          { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.1 },
          "-=0.25"
        )
        .to(".ch-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".ch-aud", { opacity: 1, y: 0, duration: 0.55 }, "-=0.4")
        .to(".ch-cta", { opacity: 1, y: 0, duration: 0.55 }, "-=0.35")
        .to(".ch-scroll", { opacity: 1, duration: 0.5 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      aria-label={t("clinic.hero.eyebrow")}
      className="relative flex items-end overflow-hidden bg-[#0B1220] min-h-[82svh] sm:min-h-[86svh] lg:min-h-[90vh]"
    >
      {/* ── Background — full-bleed visual with layered navy overlay ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          ref={bgWrapRef}
          className="ch-bg-wrap absolute inset-x-0 -top-[6%] -bottom-[6%] will-change-transform"
        >
          <Image
            src="/images/about/about-hero.jpg"
            alt={locale === "en" ? "Wenaya Clinic in Casablanca" : "Wenaya Clinic à Casablanca"}
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
              "linear-gradient(to right, rgba(11,18,32,0.80) 0%, rgba(11,18,32,0.46) 38%, rgba(11,18,32,0.20) 68%, rgba(11,18,32,0.06) 100%)",
          }}
        />
        {/* Bottom depth — melts into the navy Trust section, no white seam */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 sm:h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.6) 38%, rgba(11,18,32,0) 100%)",
          }}
        />
      </div>

      {/* ── Content — lower-left, no card, no panel ── */}
      <div className="relative z-10 w-full px-6 sm:px-10 pt-32 pb-14 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="ch-eyebrow ch-fade flex items-center gap-3 mb-6 lg:mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {t("clinic.hero.eyebrow")}
              </span>
            </div>

            {/* H1 — exactly one, revealed line by line through overflow-hidden masks */}
            <h1
              className="heading-serif text-white leading-[0.95] tracking-[-0.01em]"
              style={{ fontSize: "clamp(2.9rem, 7vw, 6.875rem)" }}
            >
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span className="ch-line block will-change-transform">{t("clinic.hero.word1")}</span>
              </span>
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span className="ch-line block will-change-transform">{t("clinic.hero.word2")}</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span
                  className="ch-line block will-change-transform"
                  style={{
                    background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {t("clinic.hero.word3")}
                </span>
              </span>
            </h1>

            {/* Single supporting paragraph */}
            <p className="ch-sub ch-fade mt-6 sm:mt-7 max-w-[560px] text-white/75 text-base sm:text-lg leading-relaxed">
              {t("clinic.hero.sub")}
            </p>

            {/* Audience labels — purely editorial, NOT interactive */}
            <div className="ch-aud ch-fade mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-white/40 text-[10px] font-semibold tracking-[0.22em] uppercase">
                {locale === "en" ? "For" : "Pour"}
              </span>
              {audiences.map((a, i) => (
                <span key={a} className="flex items-center gap-x-4">
                  {i > 0 && <span className="h-px w-4 bg-white/15" aria-hidden="true" />}
                  <span className="heading-serif text-white/85 text-lg lg:text-xl">{a}</span>
                </span>
              ))}
            </div>

            {/* CTAs — primary bronze, secondary outline; same row on desktop */}
            <div className="ch-cta ch-fade mt-8 sm:mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href={h(locale, "/professional")}
                className="inline-flex items-center gap-2.5 h-13 px-8 py-3.5 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {t("clinic.hero.ctaBook")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={h(locale, "/pratiques")}
                className="inline-flex items-center gap-2 h-13 px-6 py-3.5 text-white/65 text-sm font-medium border border-white/[0.18] backdrop-blur-[2px] bg-white/[0.04] transition-all duration-300 hover:text-white hover:border-white/[0.32] hover:bg-white/[0.08]"
              >
                {t("clinic.hero.ctaDiscover")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll hint — subtle, bottom-right, desktop only ── */}
      <div className="ch-scroll ch-fade absolute bottom-10 right-10 z-10 hidden lg:flex flex-col items-center gap-3">
        <span className="text-white/35 text-[10px] font-semibold tracking-[0.22em] uppercase">
          {locale === "en" ? "Discover" : "Découvrir"}
        </span>
        <span className="relative block w-px h-12 overflow-hidden bg-white/10">
          <span className="ch-scroll-dot absolute left-0 top-0 h-4 w-px bg-[#B88A5A]/80" />
        </span>
      </div>
    </section>
  );
}