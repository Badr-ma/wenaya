/**
 * How It Works — structured 4-step method (approach.steps) as an editorial
 * dot-timeline. Desktop: a horizontal bronze hairline with 4 bronze node
 * dots, each capped with a mono 01–04 marker above a serif title + description.
 * Mobile: vertical hairline list with dots on the rail. Restrained once-only
 * GSAP entrance.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const stepsMeta = [
  { number: "01" },
  { number: "02" },
  { number: "03" },
  { number: "04" },
];

export default function HowItWorksSection() {
  const { t, tRaw } = useLocale();
  const steps = tRaw<Array<{ title: string; desc: string }>>("entreprises.approach.steps");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hw-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });

      gsap.fromTo(".hw-node", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".hw-body", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white border-t border-[#0B1220]/10 py-9 sm:py-13 lg:py-16 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="hw-head mx-auto max-w-2xl text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center justify-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.approach.badge")}
          </span>
          <h2 className="heading-serif text-[#0B1220] mt-4 leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.approach.heading1")} <span className="text-[#B88A5A]">{t("entreprises.approach.heading2")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[15px] sm:text-base text-[#2B2F36]/55 leading-relaxed">{t("entreprises.approach.sub")}</p>
        </div>

        {/* Desktop: 4 dot-timeline columns */}
        <div className="relative hidden lg:block">
          <span className="absolute top-2 left-0 right-0 h-px bg-[#B88A5A]/40" aria-hidden />
          <div className="grid grid-cols-4 gap-x-8">
            {steps.map((step, i) => (
              <div key={i} className="relative pt-6">
                <span className="hw-node absolute top-2 -translate-y-1/2 size-4 rounded-full bg-[#B88A5A] border-[3px] border-white" aria-hidden />
                <span className="hw-node font-mono text-[#B88A5A] text-sm tracking-[0.1em]">{stepsMeta[i].number}</span>
                <h3 className="hw-body heading-serif text-[#0B1220] text-xl font-semibold leading-snug mt-3">{step.title}</h3>
                <p className="hw-body mt-3 text-sm leading-relaxed text-[#2B2F36]/55">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical hairline timeline */}
        <div className="lg:hidden relative border-l border-[#B88A5A]/40 pl-7">
          {steps.map((step, i) => (
            <div key={i} className="relative pb-8 last:pb-0">
              <span className="hw-node absolute -left-[33px] top-1 size-4 rounded-full bg-[#B88A5A] border-[3px] border-white" aria-hidden />
              <div className="flex items-baseline gap-2">
                <span className="hw-node font-mono text-[#B88A5A] text-sm tracking-[0.1em]">{stepsMeta[i].number}</span>
              </div>
              <h3 className="hw-body heading-serif text-[#0B1220] text-lg font-semibold leading-snug mt-1.5">{step.title}</h3>
              <p className="hw-body mt-2 text-sm leading-relaxed text-[#2B2F36]/55">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}