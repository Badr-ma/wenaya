/**
 * Clinic Hero — full-screen hero for the Clinic/B2C page.
 * Matches live wenaya.com: "Soigner. Prévenir. Prolonger."
 * Non-interactive audience labels (Enfants, Adultes, Seniors) with booking CTA.
 * Editorial layout: large typography, no cards.
 */
"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
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

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .set([".ch-eyebrow", ".ch-title", ".ch-sub", ".ch-cta"], { opacity: 0, y: 20 })
        .to(".ch-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(".ch-title", { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
        .to(".ch-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(".ch-cta", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0B1220]"
    >
      {/* Subtle background gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 60%, rgba(184,138,90,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(21,154,169,0.04) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-3xl">
          <div className="ch-eyebrow inline-flex items-center gap-2.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
            <span className="text-[#B88A5A]/70 text-[11px] font-semibold tracking-[0.24em] uppercase">
              Wenaya Clinic — Casablanca
            </span>
          </div>

          <h1 className="ch-title heading-serif text-white leading-[0.95]" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
            {t("clinic.hero.word1")}{" "}
            <br className="hidden sm:block" />
            {t("clinic.hero.word2")}{" "}
            <br className="hidden sm:block" />
            <span
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("clinic.hero.word3")}
            </span>
          </h1>

          <p className="ch-sub mt-8 max-w-lg text-white/40 text-lg leading-relaxed">
            {t("clinic.hero.sub")}
          </p>

          {/* Audience labels — non-interactive editorial chips */}
          <div className="ch-cta mt-10 flex flex-wrap items-center gap-1.5">
            {audiences.map((a) => (
              <span
                key={a}
                className="px-5 py-2.5 text-sm font-medium rounded-full border border-white/[0.12] text-white/50 select-none"
              >
                {a}
              </span>
            ))}
          </div>

          <div className="ch-cta mt-6 text-white/30 text-sm leading-relaxed max-w-md">
            {t("clinic.hero.tagline")}
          </div>

          {/* CTAs */}
          <div className="ch-cta mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href={h(locale, "/specialistes")}
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
              }}
            >
              {t("clinic.hero.ctaBook")}
            </Link>
            <Link
              href={h(locale, "/pratiques")}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-white/45 text-sm font-medium border border-white/[0.1] transition-all duration-300 hover:text-white hover:border-white/[0.2]"
            >
              {t("clinic.hero.ctaDiscover")}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #F2EFE9)" }}
      />
    </section>
  );
}
