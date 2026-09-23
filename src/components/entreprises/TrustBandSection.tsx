/**
 * TrustBand — light proof band directly under the hero: the "Ils nous font
 * confiance" small-caps label, the six partner names as a wrapping editorial
 * row (no invented logos), and the Wenaya aggregate band line. Restrained
 * once-only GSAP fade.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export default function TrustBandSection() {
  const { t, tRaw } = useLocale();
  const partners = tRaw<string[]>("entreprises.programs.partners");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tb-band", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 94%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white px-6 py-8 sm:py-10 overflow-hidden scroll-mt-20">
      <div className="tb-band mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#B88A5A] text-center font-semibold">
          {t("entreprises.programs.ilsNousFontConfiance")}
        </p>
        <ul className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-2">
          {partners.map((name, i) => (
            <li key={`${i}-${name}`} className="flex items-baseline gap-2">
              <span className="heading-serif text-[#0B1220]/80 text-lg sm:text-xl">{name}</span>
              {i < partners.length - 1 && (
                <span className="text-[#B88A5A] text-sm" aria-hidden>·</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-[#2B2F36]/55">{t("entreprises.stats.band")}</p>
      </div>
    </section>
  );
}