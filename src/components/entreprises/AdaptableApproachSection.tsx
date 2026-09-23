/**
 * AdaptableApproach — operating-model hub for the offer (programs.*).
 * Center Wenaya hub node (bronze double-ring) → stem → desktop arms row
 * (3 bronze dots) → 6 offer nodes (bronze-dot mono rows, no boxes) →
 * bottom progression band built from the quote-form programme-level labels
 * (discovery → annual programme → transformation) with thin chevrons.
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

type Offer = { title: string; desc: string };
type ProgrammeLevel = { value: string; label: string };

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#B88A5A] shrink-0">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdaptableApproachSection() {
  const { t, tRaw } = useLocale();
  const offers = tRaw<Offer[]>("entreprises.programs.offers");
  const levels = tRaw<ProgrammeLevel[]>("entreprises.contactSection.programmeLevelOptions");
  const journey = levels.slice(1, 4);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".aa-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".aa-hub", { opacity: 0, scale: 0.9 }, {
        opacity: 1, scale: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".aa-node", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".aa-band", { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-9 sm:py-13 lg:py-16 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="aa-head mx-auto max-w-2xl text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.programs.badge")}
          </span>
          <h2 className="heading-serif text-[#0B1220] leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.programs.heading1")} <span className="text-[#B88A5A]">{t("entreprises.programs.heading2")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[15px] sm:text-base text-[#2B2F36]/55 leading-relaxed">{t("entreprises.programs.sub")}</p>
        </div>

        {/* Hub — center Wenaya node */}
        <div className="aa-hub flex justify-center">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40" role="img" aria-label="Wenaya">
            <span className="absolute inset-0 rounded-full border border-[#B88A5A]/30" aria-hidden />
            <span className="absolute inset-4 rounded-full border border-[#B88A5A]/50" aria-hidden />
            <span className="absolute inset-8 rounded-full bg-[#B88A5A] text-white flex items-center justify-center heading-serif text-base sm:text-lg font-semibold tracking-wide">
              Wenaya
            </span>
          </div>
        </div>

        {/* Stem */}
        <div className="mx-auto h-10 w-px bg-[#B88A5A]/40" aria-hidden />

        {/* Arms row (desktop) */}
        <div className="hidden lg:grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="mx-auto size-2.5 rounded-full bg-[#B88A5A]" aria-hidden />
          ))}
        </div>

        {/* Offer nodes 01–06 */}
        <div className="mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
          {offers.map((o, i) => (
            <div key={i} className="aa-node flex items-start gap-4">
              <span className="mt-2 size-2 rounded-full bg-[#B88A5A] shrink-0" aria-hidden />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[#B88A5A] text-xs tracking-[0.1em]">{`0${i + 1}`}</span>
                  <h3 className="heading-serif text-[#0B1220] text-lg font-semibold leading-snug">{o.title}</h3>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[#2B2F36]/55">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progression band */}
        {journey.length > 0 && (
          <div className="aa-band mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6">
            {journey.map((lv, i) => (
              <div key={lv.value} className="flex items-center gap-4 sm:gap-6">
                {i > 0 && <Chevron />}
                <span className="text-sm sm:text-[15px] font-semibold text-[#0B1220]">{lv.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}