/**
 * Levels — guide visitors through the three engagement levels (levels.tiers)
 * as three editorial decision cards under the "Par où commencer ?" header.
 * Each card gets a distinct soft premium tint from the Wenaya palette:
 * Découverte (warm sand + bronze), Programme Annuel (light muted bronze +
 * deeper bronze — reads "ongoing"), Transformation (light navy-tinted +
 * navy accent). Structure per card: mono number → serif uppercase title →
 * subtitle → Idéal pour / Inclus / Durée (small uppercase label + compact
 * value) → italic soft pricing → CTA anchored to the bottom (mt-auto).
 * Equal heights via grid stretch + flex-col + mt-auto. Restrained once-only
 * GSAP.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type Tier = { title: string; subtitle: string; ideal: string; includes: string; duration: string };

const TIER_STYLES = [
  { card: "bg-[#F2EFE9]", bar: "border-t-[#B88A5A]", num: "text-[#B88A5A]" },
  { card: "bg-[#B88A5A]/[0.09]", bar: "border-t-[#9A7242]", num: "text-[#9A7242]" },
  { card: "bg-[#0B1220]/[0.045]", bar: "border-t-[#0B1220]", num: "text-[#0B1220]" },
] as const;

export default function LevelsSection() {
  const { t, tRaw } = useLocale();
  const tiers = tRaw<Tier[]>("entreprises.levels.tiers");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".lv-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".lv-card", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] py-10 sm:py-14 lg:py-18 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="lv-head mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.levels.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.levels.subtitle")}
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier, i) => {
          const st = TIER_STYLES[i] ?? TIER_STYLES[0];
          return (
            <article
              key={i}
              className={`lv-card flex flex-col overflow-hidden rounded-xl border border-t-[3px] border-[#0B1220]/[0.08] px-6 py-7 sm:px-7 sm:py-8 min-h-[360px] sm:min-h-[420px] lg:min-h-[450px] transition-shadow duration-300 ${st.card} ${st.bar}`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm tracking-[0.1em] ${st.num}`}>{`0${i + 1}`}</span>
                <span className="h-px flex-1 bg-[#0B1220]/[0.10]" aria-hidden />
              </div>
              <h3 className="mt-4 heading-serif uppercase tracking-[0.02em] text-[#0B1220]" style={{ fontSize: "clamp(1.15rem, 1.6vw, 1.4rem)" }}>
                {tier.title}
              </h3>
              <p className="mt-1.5 text-sm sm:text-base font-medium text-[#0B1220]/70 leading-snug">{tier.subtitle}</p>
              <dl className="mt-5 space-y-3">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#B88A5A]">{t("entreprises.levels.idealLabel")}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-[#2B2F36]/70">{tier.ideal}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#B88A5A]">{t("entreprises.levels.includesLabel")}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-[#2B2F36]/70">{tier.includes}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#B88A5A]">{t("entreprises.levels.durationLabel")}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-[#2B2F36]/70">{tier.duration}</dd>
                </div>
              </dl>
              <p className="mt-auto pt-5 text-sm italic text-[#2B2F36]/55">{t("entreprises.levels.pricing")}</p>
              <div className="mt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                >
                  {t("entreprises.levels.ctaQuote")}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#B88A5A] transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}