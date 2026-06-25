"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

export default function ClinicsHero(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .set([".ch-eyebrow", ".ch-title", ".ch-desc", ".ch-cta", ".ch-stats"], { opacity: 0, y: 20 })
        .to(".ch-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(".ch-title", { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
        .to(".ch-desc", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(".ch-cta", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .to(".ch-stats", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0B1220]">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 30% 50%, rgba(184,138,90,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(184,138,90,0.05) 0%, transparent 50%)",
      }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-28 pb-20">
        <div className="max-w-3xl">
          <div className="ch-eyebrow inline-flex items-center gap-2.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
            <span className="text-[#B88A5A]/70 text-[11px] font-semibold tracking-[0.24em] uppercase">
              {t("clinics.hero.eyebrow")}
            </span>
          </div>

          <h1 className="ch-title heading-serif text-white text-[clamp(2.5rem,5vw,4.5rem)]">
            {t("clinics.hero.heading")}
          </h1>

          <p className="ch-desc mt-6 max-w-xl text-white/40 leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}
          >
            {t("clinics.hero.desc")}
          </p>

          <div className="ch-cta flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-10">
            <Link
              href="#"
              className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(21,154,169,0.3)",
              }}
            >
              {t("clinics.hero.cta1")}
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-white/45 text-[13.5px] font-medium border border-white/[0.1] transition-all duration-300 hover:text-white hover:border-white/[0.2]"
            >
              {t("clinics.hero.cta2")}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="ch-stats mt-16 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { v: "15+", l: t("clinics.hero.stats.cliniques") },
              { v: "12 000+", l: t("clinics.hero.stats.patients") },
              { v: "94%", l: t("clinics.hero.stats.satisfaction") },
              { v: "6", l: t("clinics.hero.stats.disciplines") },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-heading font-bold text-[22px] tracking-tight text-white/85">{s.v}</div>
                <div className="text-[11.5px] text-white/28 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #F2EFE9)" }}
      />
    </section>
  );
}
