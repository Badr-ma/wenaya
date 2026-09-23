/**
 * Programmes Section — editorial programme grid from the shared data source
 * (src/lib/corporate-programmes.ts). A 4-card grid (index, badge, name, pitch,
 * format, "Découvrir" link) inside the max-w-5xl container: 4 across on
 * desktop (lg:grid-cols-4), 2 on tablet (sm:grid-cols-2), 1 on mobile.
 * Cards share the LevelsSection (Par où commencer) design language — rounded-xl,
 * 1px border + 3px top accent, soft palette tint per card, mono number →
 * serif title → compact pitch → format metadata → CTA anchored to the bottom
 * (flex-col + mt-auto). Four distinct subtle tints from the Wenaya palette,
 * no gradients, no images, low animation.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { getProgrammeHref, getAllProgrammeCards } from "@/lib/corporate-programmes";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const INDEX_FALLBACK = ["01", "02", "03", "04"];

const CARD_STYLES = [
  { card: "bg-[#F2EFE9]", bar: "border-t-[#B88A5A]", acc: "text-[#B88A5A]" },
  { card: "bg-[#B88A5A]/[0.09]", bar: "border-t-[#9A7242]", acc: "text-[#9A7242]" },
  { card: "bg-[#0B1220]/[0.045]", bar: "border-t-[#0B1220]", acc: "text-[#0B1220]" },
  { card: "bg-[#D4A56A]/[0.10]", bar: "border-t-[#B88A5A]", acc: "text-[#B88A5A]" },
] as const;

export default function ProgrammesSection() {
  const { t, locale } = useLocale();
  const programmes = getAllProgrammeCards(locale);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pg-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".pg-card", { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  if (!programmes.length) return null;

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] py-10 sm:py-14 lg:py-18 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="pg-head mx-auto max-w-2xl text-center mb-6 sm:mb-8">
          <span className="inline-flex items-center justify-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.programmes.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] mt-4 leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.programmes.subtitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[#2B2F36]/55 leading-relaxed text-sm sm:text-[15px]">{t("entreprises.programmes.ctaDesc")}</p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {programmes.map((program, i) => {
            const st = CARD_STYLES[i] ?? CARD_STYLES[0];
            return (
              <li key={program.slug} className="pg-card">
                <Link
                  href={getProgrammeHref(locale, program.slug)}
                  className={`group flex h-full flex-col overflow-hidden rounded-xl border border-t-[3px] border-[#0B1220]/[0.08] px-6 py-7 sm:px-7 sm:py-8 min-h-[300px] sm:min-h-[320px] transition-colors duration-300 hover:border-[#B88A5A]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] ${st.card} ${st.bar}`}
                >
                  <div className="flex items-center gap-3">
                    <span aria-hidden className={`font-mono text-sm tracking-[0.1em] ${st.acc}`}>
                      {i < INDEX_FALLBACK.length ? INDEX_FALLBACK[i] : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-[#0B1220]/[0.10]" aria-hidden />
                  </div>
                  <span className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] ${st.acc}`}>
                    {program.badge}
                  </span>
                  <h3 className="mt-2 heading-serif text-[#0B1220] leading-[1.15] tracking-[-0.01em]" style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)" }}>
                    {program.name}
                  </h3>
                  <p className="mt-3 text-[13px] leading-snug text-[#2B2F36]/60 line-clamp-3">{program.pitch}</p>
                  <div className="mt-auto pt-5">
                    {program.format ? (
                      <p className="text-[11px] leading-snug text-[#2B2F36]/45">{program.format}</p>
                    ) : null}
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                      {t("entreprises.programmes.discoverLabel")}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#B88A5A] transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}