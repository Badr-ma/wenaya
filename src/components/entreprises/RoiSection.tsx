/**
 * Roi — navy ROI statement band: the "bien-être = investissement" pull-quote
 * (imageBreak.quote) over a three-stat evidence row (stats.items, sourced).
 * Restrained once-only GSAP entrance.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type ImpactStat = { value: string; label: string; source: string };

export default function RoiSection() {
  const { t, tRaw } = useLocale();
  const stats = tRaw<ImpactStat[]>("entreprises.stats.items");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".roi-quote", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".roi-stat", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] py-10 sm:py-14 lg:py-18 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <blockquote className="roi-quote mx-auto max-w-3xl text-center">
          <p className="heading-serif text-[#D4A56A] leading-[1.15]" style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.9rem)" }}>
            {t("entreprises.imageBreak.quote")}
          </p>
        </blockquote>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10 border-t border-white/15 pt-8">
          {stats.map((s, i) => (
            <div key={i} className="roi-stat">
              <span className="heading-serif text-white leading-none" style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}>
                {s.value}
              </span>
              <p className="mt-3 text-sm leading-snug text-white/70">{s.label}</p>
              <p className="mt-2 text-xs text-white/40 italic">{s.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}