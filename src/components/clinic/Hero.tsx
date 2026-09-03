/**
 * Clinic Hero — full-screen hero for the Clinic/B2C page.
 * Matches live wenaya.com: "Soigner. Prévenir. Prolonger."
 *
 * Redesigned as an editorial 55/45 split: typographic copy on the left and a
 * large dominant clinic photograph on the right. Non-interactive audience
 * labels (Enfants, Adultes, Seniors) rendered as an editorial audience line.
 *
 * Layout: split (desktop) → stacked (mobile). No cards.
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
      className="relative overflow-hidden bg-[#0B1220]"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55fr_45fr] lg:gap-16 px-6 sm:px-10 pt-24 pb-14 lg:pt-28 lg:pb-20">
        {/* Copy column */}
        <div className="flex flex-col justify-center lg:pr-6">
          <div className="ch-eyebrow flex items-center gap-3 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
            <span className="text-[#B88A5A]/80 text-[11px] font-semibold tracking-[0.24em] uppercase">
              {t("clinic.hero.eyebrow")}
            </span>
          </div>

          <h1 className="ch-title heading-serif text-white leading-[0.98]" style={{ fontSize: "clamp(2.8rem, 6vw, 5.4rem)" }}>
            {t("clinic.hero.word1")}{" "}
            <br />
            {t("clinic.hero.word2")}{" "}
            <br />
            <em style={{
              fontStyle: "normal",
              background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {t("clinic.hero.word3")}
            </em>
          </h1>

          <p className="ch-sub mt-7 max-w-md text-white/50 text-base lg:text-lg leading-relaxed">
            {t("clinic.hero.sub")}
          </p>

          {/* Audience line — non-interactive editorial labels */}
          <div className="ch-sub mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-white/25 text-[11px] font-mono uppercase tracking-[0.2em]">
              {locale === "en" ? "For" : "Pour"}
            </span>
            {audiences.map((a, i) => (
              <span key={a} className="flex items-center gap-x-6">
                {i > 0 && <span className="h-px w-4 bg-white/15" aria-hidden="true" />}
                <span className="heading-serif text-white/85 text-lg lg:text-xl">{a}</span>
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="ch-cta mt-8 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href={h(locale, "/specialistes")}
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
              className="inline-flex items-center gap-2 h-13 px-6 py-3.5 text-white/55 text-sm font-medium border border-white/[0.14] transition-all duration-300 hover:text-white hover:border-white/[0.28]"
            >
              {t("clinic.hero.ctaDiscover")}
            </Link>
          </div>
        </div>

        {/* Image column */}
        <div className="relative mt-12 lg:mt-0 lg:self-stretch">
          <div className="relative h-[70vw] sm:h-[60vw] lg:h-full min-h-[420px] lg:min-h-[560px] overflow-hidden rounded-t-[32px] lg:rounded-[32px]">
            <Image
              src="/images/about/about-hero.jpg"
              alt={locale === "en" ? "Wenaya Clinic in Casablanca" : "Wenaya Clinic à Casablanca"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent" />
            {/* floating caption */}
            <div className="absolute bottom-5 left-5 right-5 lg:bottom-6 lg:left-6 hidden sm:flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" />
              <span className="text-white/70 text-[11px] tracking-[0.18em] uppercase">
                {locale === "en" ? "Casablanca · Multidisciplinary centre" : "Casablanca · Centre multidisciplinaire"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0B1220)" }}
      />
    </section>
  );
}
