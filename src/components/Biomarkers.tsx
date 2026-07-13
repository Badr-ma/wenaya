"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";


export default function Biomarkers(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const pillarKeys = ["prevention", "performance", "recuperation"];
  const pillars = pillarKeys.map((key, i) => {
    const p = tRaw<{ title: string; services: string[] }>(`biomarkers.pillars.${key}`);
    return { num: String(i + 1).padStart(2, "0"), name: p.title, services: p.services };
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
        <div className="bio-cell text-center mb-8 sm:mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
              {t("biomarkers.badge")}
            </span>
          </div>
          <h2
            className="text-[#0B1220] heading-serif"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
            }}
          >
            {t("biomarkers.heading1")}<br />
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("biomarkers.heading2")}
</span>
          </h2>
          <p className="text-[#2B2F36]/50 text-[14px] leading-relaxed max-w-md mx-auto mt-4">
            {t("biomarkers.sub")}
          </p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const borderRight = col < 2 ? "border-r border-r-[#0B1220]/[0.07]" : "";
            const borderBottom = row < 1 ? "border-b border-b-[#0B1220]/[0.07]" : "";

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

                {/* Category name — large Cormorant italic */}
                <h3
                  className="relative text-[#0B1220] leading-[1.05]"
                  style={{
                    fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(2rem, 3vw, 2.8rem)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.name}
                </h3>

                {/* Count with bronze rule */}
                <div className="flex items-center gap-3">
                  <div className="w-5 h-px bg-[#B88A5A]" />
                  <span
                    className="text-[#B88A5A]"
                    style={{
                      fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("biomarkers.soins")}
                  </span>
                </div>

                {/* Service list */}
                <ul className="space-y-2">
                  {p.services.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2.5 text-[#2B2F36]/70 leading-snug"
                      style={{
                        fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
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
            {t("biomarkers.bottom")}
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 text-[#B88A5A] text-sm font-semibold hover:gap-3 transition-all duration-300"
          >
            {t("biomarkers.cta")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
