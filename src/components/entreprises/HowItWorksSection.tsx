/**
 * How It Works — structured 4-step journey. Desktop: horizontal process line
 * with oversized numbered steps drawn left-to-right as you scroll; mobile:
 * vertical timeline. Content-driven heights throughout.
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
  const howSteps = tRaw<Array<{ title: string; desc: string }>>("entreprises.howItWorks.steps");
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      const st = {
        trigger: el, start: "top 55%", end: "bottom 80%", scrub: 1,
      } as const;

      gsap.fromTo(".hw-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });

      gsap.fromTo(".hw-num", { opacity: 0, scale: 0.85, y: 14 }, {
        opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".hw-body", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
      });

      const nums = gsap.utils.toArray<HTMLElement>(".hw-fill");
      const master = gsap.timeline({ scrollTrigger: st });

      if (lineRef.current) {
        master.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
      }
      nums.forEach((num, i) => {
        master.fromTo(
          num,
          { color: "rgba(184,138,90,0)" },
          { color: "#B88A5A", ease: "none", duration: 0.55 },
          (i / Math.max(nums.length, 1)) + 0.04,
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-14 sm:py-20 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="hw-head max-w-2xl mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            {t("entreprises.howItWorks.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] mt-4 leading-[1.06]" style={{ fontSize: "clamp(1.65rem, 3.15vw, 2.7rem)" }}>
            {t("entreprises.howItWorks.subtitle")}
          </h2>
        </div>

        {/* Desktop: horizontal journey */}
        <div className="hidden lg:block">
          <div className="relative pt-2">
            <div className="absolute left-0 right-0 top-12 h-px bg-[#0B1220]/10" />
            <div
              ref={lineRef}
              className="absolute left-0 top-12 h-[2px] will-change-transform scale-x-0"
              style={{ width: "100%", background: "#B88A5A" }}
            />
            <div className="relative grid grid-cols-4 gap-10">
              {howSteps.map((step, i) => (
                <div key={i} className="flex flex-col">
                  <div className="relative z-10 flex items-start justify-center">
                    <span
                      className="hw-num hw-fill font-heading font-bold leading-none select-none"
                      style={{
                        fontSize: "clamp(2.45rem, 4.1vw, 3.9rem)",
                        color: "rgba(184,138,90,0)",
                        WebkitTextStroke: "1px rgba(184,138,90,0.7)",
                      }}
                    >
                      {stepsMeta[i].number}
                    </span>
                  </div>
                  <div className="hw-body mt-6 flex flex-col items-center text-center">
                    <h3 className="text-[#0B1220] heading-serif text-xl font-semibold leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#2B2F36]/55 text-sm leading-relaxed mt-3 max-w-[15rem]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden">
          <div className="relative">
            <div className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-[#0B1220]/10" />
            <div
              className="absolute left-[1.15rem] top-2 bottom-2 w-[2px] origin-top will-change-transform"
              style={{ background: "#B88A5A", opacity: 0.35 }}
            />
            <div className="space-y-8">
              {howSteps.map((step, i) => (
                <div key={i} className="relative flex gap-5">
                  <div className="relative z-10 flex flex-col items-center">
                    <span
                      className="hw-num font-heading font-bold leading-none"
                      style={{
                        fontSize: "clamp(1.6rem, 4.1vw, 2rem)",
                        color: "#B88A5A",
                        background: "#F2EFE9",
                        padding: "0 0.25rem",
                      }}
                    >
                      {stepsMeta[i].number}
                    </span>
                  </div>
                  <div className="hw-body flex-1 pt-2">
                    <h3 className="text-[#0B1220] heading-serif text-lg font-semibold leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#2B2F36]/55 text-sm leading-relaxed mt-2">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
