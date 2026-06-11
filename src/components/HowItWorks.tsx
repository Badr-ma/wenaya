"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HiggsField from "./HiggsField";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Assess",
    subtitle: "Comprendre où vous en êtes.",
  },
  {
    number: "02",
    title: "Align",
    subtitle: "Construire un parcours qui vous ressemble.",
  },
  {
    number: "03",
    title: "Activate",
    subtitle: "Passer à l'action, ensemble.",
  },
  {
    number: "04",
    title: "Sustain",
    subtitle: "Prévenir, performer, durer.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const setStepRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[i] = el;
      (cardRefs[i] as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = stepRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(cards, { opacity: 0, y: 24, scale: 0.97 });
      gsap.set(headingRef.current, { opacity: 0, y: 16 });
      gsap.set(subheadingRef.current, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "back.out(1.7)", duration: 0.4 },
      });

      tl
        .to(headingRef.current, { opacity: 1, y: 0 })
        .to(subheadingRef.current, { opacity: 1, y: 0, duration: 0.3 }, "-=0.15")
        .to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.35 }, "-=0.05");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F2EFE9] relative overflow-hidden"
      id="method"
      style={{ padding: "120px 0" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-[#159AA9]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-[#159AA9]/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-16 max-md:px-6 relative">
        <div ref={headingRef} className="max-w-[640px] mx-auto text-center mb-5 will-change-transform">
          <span className="text-[#159AA9] font-semibold text-sm tracking-widest uppercase">
            Prévenir. Performer. Durer.
          </span>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] leading-[1.08] font-bold text-[#0B1220] tracking-[-0.03em]">
            La méthode Wenaya.
          </h2>
        </div>

        <div ref={subheadingRef} className="max-w-[520px] mx-auto text-center mb-16 will-change-transform">
          <p className="text-[15px] leading-relaxed text-[#2B2F36] font-light">
            Quatre étapes pour reprendre la main sur votre santé.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={setStepRef(i)}
              className="bg-white rounded-2xl overflow-hidden border border-[#0B1220]/[0.06] will-change-transform transition-all duration-300 hover:border-[#159AA9]/20 relative"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.03)" }}
            >
              <HiggsField parentRef={cardRefs[i]} />
              <div className="h-1 bg-gradient-to-r from-[#159AA9] to-[#159AA9]/20 relative z-10" />

              <div className="px-6 py-6 flex flex-col gap-4 items-center text-center relative z-10">
                <div className="flex items-center gap-3 justify-center">
                  <span className="w-7 h-7 rounded-full bg-[#159AA9]/10 flex items-center justify-center text-[10px] font-bold text-[#159AA9] tracking-wider">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-[#159AA9] uppercase">
                    Étape
                  </span>
                </div>

                <div className="space-y-0">
                  <h3 className="font-heading text-[17px] font-bold text-[#0B1220] tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="text-[12px] text-[#2B2F36] leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>

                <div className="mt-auto" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-5 mt-16">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 h-[50px] bg-[#0B1220] text-white rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#2B2F36] hover:shadow-lg"
          >
            Découvrir votre parcours
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-7 h-[50px] bg-transparent text-[#159AA9] border border-[#159AA9]/30 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:border-[#159AA9] hover:bg-[rgba(21,154,169,0.04)]"
          >
            Commencer votre évaluation
          </a>
        </div>
      </div>
    </section>
  );
}
