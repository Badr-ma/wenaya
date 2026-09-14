/**
 * Bilans Wenaya Section — three-pillar assessment overview (Biologique / Physique / Cognitif).
 * Content-driven via i18n biomarkers block. GSAP scroll-triggered card reveal.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import type { BiomarkersContent } from "@/lib/homepage-types";
import SectionTitleAccent from "@/components/SectionTitleAccent";

interface BiomarkersProps {
  content?: BiomarkersContent;
}

export default function Biomarkers({ content }: BiomarkersProps): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const pillarKeys = ["prevention", "performance", "recuperation"];
  const pillars = pillarKeys.map((key, i) => {
    const p = tRaw<{ subheader: string; title: string; services: string[] }>(`biomarkers.pillars.${key}`);
    return { num: String(i + 1).padStart(2, "0"), subheader: p.subheader, name: p.title, services: p.services };
  });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bio-cell",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-12 sm:py-28 px-6" id="univers">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bio-cell mb-8 sm:mb-16 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <SectionTitleAccent compact />
          </div>
          <h2 className="font-display-nunito font-bold uppercase tracking-[0.04em] text-[#B88A5A] leading-[1.1] text-[2.25rem] sm:text-[2.375rem] lg:text-[3.25rem]">
            {content?.badge ?? t("biomarkers.badge")}
          </h2>
          <p className="font-heading font-medium text-[#0B1220] leading-[1.2] tracking-[-0.01em] mt-4 sm:mt-5 text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem]">
            {content?.heading1 ?? t("biomarkers.heading1")}{" "}
            {content?.heading2 ?? t("biomarkers.heading2")}
          </p>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-base lg:text-[17px] leading-relaxed text-[#2B2F36]/55 max-w-lg mx-auto">
            {content?.sub ?? t("biomarkers.sub")}
          </p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const borderRight = col < 2 ? "sm:border-r sm:border-r-[#0B1220]/[0.07]" : "";
            const borderBottom = row < 1 ? "border-b border-b-[#0B1220]/[0.07] sm:border-b" : "";

            return (
              <div
                key={p.name}
                className={`bio-cell relative p-5 sm:p-10 flex flex-col gap-4 sm:gap-6 overflow-hidden ${borderRight} ${borderBottom}`}
              >
                {/* Ghost number background */}
                <span
                  className="absolute -top-3 -right-2 font-heading font-black leading-none select-none pointer-events-none"
                  style={{
                    fontSize: "8rem",
                    color: "rgba(11,18,32,0.035)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {p.num}
                </span>

                {/* Per-pillar subheader — small gold, uppercase, tracked */}
                <span
                  className="relative text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase"
                  style={{
                    fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  {p.subheader}
                </span>

                {/* Category name — large Manrope heading */}
                <h3
                  className="relative text-[#0B1220] leading-[1.05]"
                  style={{
                    fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif",
                    fontSize: "clamp(2rem, 3vw, 2.8rem)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.name}
                </h3>

                {/* Service list */}
                <ul className="space-y-2">
                  {p.services.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2.5 text-[#2B2F36]/70 leading-snug"
                      style={{
                        fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif",
                        fontSize: "1.15rem",
                        fontWeight: 500,
                      }}
                    >
                      <span className="mt-[6px] w-1 h-1 rounded-full bg-[#B88A5A]/40 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bio-cell mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8 border-t border-[#0B1220]/[0.06]">
          <p className="text-[#2B2F36]/50 text-sm max-w-md">
            {content?.bottom ?? t("biomarkers.bottom")}
          </p>
          <a
            href="#method"
            className="inline-flex items-center gap-2 text-[#B88A5A] text-sm font-semibold hover:gap-3 transition-all duration-300"
          >
            {content?.cta ?? t("biomarkers.cta")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
