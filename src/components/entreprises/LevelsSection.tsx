/**
 * Levels — "Par où commencer ?": an editorial split where a full-bleed image
 * pairs with a navy panel that overlaps it. The three tiers of accompaniment
 * (Découverte / Programme Annuel / Transformation) render as vertical hairline
 * rows inside the navy panel: bronze tag, serif title, duration, note, devis
 * CTA → #contact. Subtle GSAP reveals; reduced-motion safe.
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const LEVELS_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=100&auto=format&fit=crop";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type Tier = {
  tag: string;
  title: string;
  ideal: string;
  includes: string;
  duration: string;
  note: string;
};

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
      gsap.fromTo(".lv-img", { opacity: 0, scale: 1.03 }, {
        opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".lv-row", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 74%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] py-16 sm:py-24 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-[88rem] mx-auto">
        <div className="lv-head max-w-3xl mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.levels.title")}
          </span>
          <h2
            className="heading-serif text-[#0B1220] mt-4 leading-[1.06]"
            style={{ fontSize: "clamp(1.85rem, 3.4vw, 3.2rem)" }}
          >
            {t("entreprises.levels.subtitle")}
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:items-stretch gap-0">
          {/* Editorial image */}
          <div className="lg:col-span-5 relative rounded-t-[24px] lg:rounded-[24px] overflow-hidden min-h-[320px] sm:min-h-[420px]">
            <div className="lv-img absolute inset-0">
              <Image
                src={LEVELS_IMAGE}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/25 to-transparent" aria-hidden />
            </div>
          </div>

          {/* Overlapping navy panel */}
          <div className="lg:col-span-7 lg:-ml-16 lg:mt-14 relative mt-4 lg:mt-14 rounded-[24px] bg-[#0B1220] px-6 sm:px-10 lg:px-12 pt-10 pb-10 sm:pt-12 sm:pb-12 shadow-[0_30px_80px_rgba(11,18,32,0.28)]">
            <div className="divide-y divide-white/[0.08]">
              {tiers.map((tier, i) => (
                <div key={i} className="lv-row py-6 sm:py-7 lg:py-8 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-6">
                    <div className="min-w-0">
                      <span className="inline-flex items-center rounded-full bg-[#B88A5A]/15 px-3 py-1 text-[#B88A5A] text-[10px] font-bold tracking-[0.16em] uppercase">
                        {tier.tag}
                      </span>
                      <h3 className="heading-serif text-white text-xl sm:text-2xl font-semibold leading-tight mt-4">
                        {tier.title}
                      </h3>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-white/55 text-[13px] leading-snug font-medium">{tier.duration}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[#B88A5A]/80 text-xs leading-snug">{tier.note}</p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="lv-row mt-8 inline-flex items-center gap-2 text-white text-sm font-semibold tracking-wide hover:text-[#B88A5A] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
            >
              {t("entreprises.levels.ctaQuote")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}