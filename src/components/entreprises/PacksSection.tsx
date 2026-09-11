/**
 * Packs — "Des exemples concrets pour vous inspirer" (live Z4): three ready-made
 * pack offers (La Journée Bien-Être Wenaya / Wenaya Présence / Leadership Wenaya).
 * Editorial hairline columns with big serif type — no card borders, no shadows.
 * Devise CTA → #contact. GSAP scroll-triggered entrance only.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type Pack = {
  level: string;
  name: string;
  pitch: string;
  features: string[];
  ideal: string;
};

export default function PacksSection() {
  const { t, tRaw } = useLocale();
  const packs = tRaw<Pack[]>("entreprises.packs.items");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pk-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".pk-col", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] py-14 sm:py-20 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="pk-head max-w-3xl mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.packs.title")}
          </span>
          <h2
            className="heading-serif text-[#0B1220] mt-4 leading-[1.06]"
            style={{ fontSize: "clamp(1.75rem, 3.15vw, 3rem)" }}
          >
            {t("entreprises.packs.subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-[#0B1220]/[0.08]">
          {packs.map((pack, i) => (
            <div
              key={i}
              className="pk-col flex flex-col py-6 lg:px-8 lg:first:pl-0 lg:last:pr-0 lg:py-4 border-t border-[#0B1220]/[0.08] first:border-t-0 lg:border-t-0"
            >
              <p className="text-[#B88A5A] text-[11px] font-bold tracking-[0.18em] uppercase">
                {pack.level}
              </p>
              <h3 className="heading-serif text-[#0B1220] text-2xl sm:text-[1.7rem] font-semibold leading-[1.15] mt-3">
                {pack.name}
              </h3>
              <p className="text-[#2B2F36]/70 text-sm leading-relaxed mt-3">{pack.pitch}</p>

              <ul className="mt-6 space-y-3 border-t border-[#0B1220]/[0.08] pt-6">
                {pack.features.slice(0, 3).map((feature, fi) => (
                  <li key={fi} className="flex gap-2.5 text-[#2B2F36]/70 text-sm leading-relaxed">
                    <span className="w-px self-stretch bg-[#B88A5A]/40 shrink-0" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-1.5 text-[#B88A5A] text-sm font-semibold underline decoration-[#B88A5A]/40 underline-offset-[6px] hover:decoration-[#B88A5A] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                {t("entreprises.packs.cta")}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" className="mt-px">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}