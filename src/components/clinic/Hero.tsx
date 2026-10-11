/**
 * Clinic Hero — cinematic, full-bleed hero for the Clinic/B2C page (/about).
 *
 * Aligned to the HOMEPAGE hero design language (src/components/HeroSection.tsx):
 * same full-bleed presentation (min-h-[80vh] sm:min-h-screen, vertically
 * centered content, directional + top-fade overlay), same type scale (Manrope
 * 500 H1 clamp(2.2rem,4vw,3.9rem), 1.08 leading, bronze gradient last line),
 * same supporting-paragraph rhythm and the same rounded-xl `h-11 px-7` pill
 * CTAs. Wenaya branding, copy, images, CTA destinations, audience labels, the
 * bottom navy melt (into the navy Trust section) and the scroll hint are all
 * preserved — only the visual language changed.
 *
 * Animation mirrors the homepage: initial states live in CSS (`.ch-fade` in
 * globals.css) so content is hidden at first paint — no flash — then revealed
 * by GSAP `fromTo` tweens. Under `prefers-reduced-motion` everything renders
 * statically visible (JS also skips the tweens via `matchMedia`).
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function ClinicHero(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred();
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
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          ".hero-line",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(".hero-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .fromTo(".ch-aud", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.25"
        )
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
      className="relative flex items-center overflow-hidden bg-[#0B1220] min-h-[80vh] sm:min-h-screen"
    >
      {/* ── Background — full-bleed visual, homepage language ── */}
      <Image
        src="/images/about/about-hero.jpg"
        alt={locale === "en" ? "Wenaya Clinic in Casablanca" : "Wenaya Clinic à Casablanca"}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Directional overlay — dark-left for text, lighter-right for visual depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(108deg, rgba(11,18,32,0.94) 0%, rgba(11,18,32,0.88) 38%, rgba(11,18,32,0.65) 60%, rgba(11,18,32,0.50) 80%, rgba(11,18,32,0.58) 100%)",
        }}
      />
      {/* Top dark fade (hides image at nav level) */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to bottom, rgba(11,18,32,0.7) 0%, transparent 100%)" }}
      />
      {/* Bottom depth — melts into the navy Trust section, no white seam */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 sm:h-48 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.6) 38%, rgba(11,18,32,0) 100%)",
        }}
      />

      {/* ── Content — vertically centered, no card, no panel ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="hero-eyebrow ch-fade flex items-center gap-2.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" aria-hidden="true" />
            <span className="text-[#B88A5A] text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase">
              {t("clinic.hero.eyebrow")}
            </span>
          </p>

          {/* H1 — exactly one, three lines, gradient on the last line */}
          <h1
            className="text-white leading-[1.08]"
            style={{
              fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 4vw, 3.9rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="hero-line ch-fade block">{t("clinic.hero.word1")}</span>
            <span className="hero-line ch-fade block">{t("clinic.hero.word2")}</span>
            <span className="hero-line ch-fade block">
              <span
                style={{
                  background: "linear-gradient(135deg, #D4A870 0%, #B88A5A 45%, #E8C99A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("clinic.hero.word3")}
              </span>
            </span>
          </h1>

          {/* Single supporting paragraph */}
          <p
            className="hero-sub ch-fade mt-6 max-w-[560px] leading-[1.78]"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.93rem, 1.4vw, 1.05rem)" }}
          >
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

          {/* CTAs — homepage pills; primary solid bronze, secondary outline */}
          <div className="hero-cta ch-fade mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href={h(locale, "/search/all")}
              className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-px hover:brightness-110 active:translate-y-0"
              style={{ background: "#B88A5A" }}
            >
              {t("clinic.hero.ctaBook")}
            </Link>
            <Link
              href={h(locale, "/pratiques")}
              className="inline-flex items-center justify-center h-11 px-7 rounded-xl border border-white/25 text-[13.5px] font-semibold text-white/90 transition-all duration-300 hover:border-white/45 hover:bg-white/5"
            >
              {t("clinic.hero.ctaDiscover")}
            </Link>
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