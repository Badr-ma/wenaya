"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Assess",
    subtitle: "Comprendre où vous en êtes.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <circle cx="100" cy="50" r="38" stroke="#159AA9" strokeWidth="0.6" opacity="0.2" />
        <circle cx="100" cy="50" r="26" stroke="#159AA9" strokeWidth="0.5" opacity="0.12" />
        <circle cx="100" cy="50" r="14" stroke="#159AA9" strokeWidth="0.5" opacity="0.12" />
        <circle cx="100" cy="50" r="2.5" fill="#159AA9" opacity="0.5" />
        <path data-gsap="assess-sweep" d="M100 12 A38 38 0 0 1 138 50" stroke="#159AA9" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
        <line data-gsap="assess-line" x1="100" y1="50" x2="100" y2="12" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
        <line data-gsap="assess-line" x1="100" y1="50" x2="138" y2="50" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Align",
    subtitle: "Construire un parcours qui vous ressemble.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <circle data-gsap="align-left" cx="86" cy="50" r="24" stroke="#159AA9" strokeWidth="0.6" opacity="0.25" />
        <circle data-gsap="align-right" cx="114" cy="50" r="24" stroke="#159AA9" strokeWidth="0.6" opacity="0.25" />
        <path data-gsap="align-overlap" d="M86 26 A24 24 0 0 1 114 26 A24 24 0 0 1 114 74 A24 24 0 0 1 86 74" stroke="#159AA9" strokeWidth="0.7" opacity="0" />
        <circle cx="100" cy="50" r="2" fill="#159AA9" opacity="0.4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Activate",
    subtitle: "Passer à l'action, ensemble.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <line data-gsap="act-line-1" x1="50" y1="63" x2="80" y2="63" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" />
        <line data-gsap="act-line-2" x1="50" y1="50" x2="100" y2="50" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" />
        <line data-gsap="act-line-3" x1="50" y1="37" x2="120" y2="37" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" />
        <circle data-gsap="act-dot" cx="140" cy="37" r="2" fill="#159AA9" opacity="0" />
        <line data-gsap="act-arrow" x1="130" y1="28" x2="145" y2="37" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
        <line data-gsap="act-arrow" x1="130" y1="46" x2="145" y2="37" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Sustain",
    subtitle: "Prévenir, performer, durer.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <circle cx="100" cy="50" r="30" stroke="#159AA9" strokeWidth="0.6" opacity="0.18" />
        <path data-gsap="sustain-wave" d="M74 50 C82 34, 92 34, 100 50 C108 66, 118 66, 126 50" stroke="#159AA9" strokeWidth="0.7" strokeLinecap="round" opacity="0" />
        <path data-gsap="sustain-wave-2" d="M74 50 C82 44, 92 44, 100 50 C108 56, 118 56, 126 50" stroke="#159AA9" strokeWidth="0.5" strokeLinecap="round" opacity="0" />
        <circle data-gsap="sustain-dot" cx="100" cy="30" r="2" fill="#159AA9" opacity="0" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  const setStepRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[i] = el;
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

      gsap.set('[data-gsap="assess-sweep"]', { strokeDasharray: 76, strokeDashoffset: 76 });
      gsap.set('[data-gsap="assess-line"]', { scaleY: 0, transformOrigin: "bottom" });

      gsap.set('[data-gsap="align-left"]', { x: -3, opacity: 0.15 });
      gsap.set('[data-gsap="align-right"]', { x: 3, opacity: 0.15 });
      gsap.set('[data-gsap="align-overlap"]', { opacity: 0 });

      gsap.set('[data-gsap="act-line-1"]', { scaleX: 0, transformOrigin: "left" });
      gsap.set('[data-gsap="act-line-2"]', { scaleX: 0, transformOrigin: "left" });
      gsap.set('[data-gsap="act-line-3"]', { scaleX: 0, transformOrigin: "left" });
      gsap.set('[data-gsap="act-dot"]', { opacity: 0, scale: 0 });
      gsap.set('[data-gsap="act-arrow"]', { opacity: 0, strokeDasharray: 10, strokeDashoffset: 10 });

      gsap.set('[data-gsap="sustain-wave"]', { opacity: 0, strokeDasharray: 56, strokeDashoffset: 56 });
      gsap.set('[data-gsap="sustain-wave-2"]', { opacity: 0, strokeDasharray: 56, strokeDashoffset: 56 });
      gsap.set('[data-gsap="sustain-dot"]', { opacity: 0, scale: 0 });

      const q0 = gsap.utils.selector(cards[0]);
      const q1 = gsap.utils.selector(cards[1]);
      const q2 = gsap.utils.selector(cards[2]);
      const q3 = gsap.utils.selector(cards[3]);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out", duration: 0.6 },
      });

      tl
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.35 })
        .to(subheadingRef.current, { opacity: 1, y: 0, duration: 0.25 }, "-=0.2")

        .to(cards[0], { opacity: 1, y: 0, scale: 1, boxShadow: "0 6px 40px rgba(21,154,169,0.06)", duration: 0.25 }, "-=0.05")
        .to(q0('[data-gsap="assess-sweep"]'), { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" }, "-=0.1")
        .to(q0('[data-gsap="assess-line"]'), { scaleY: 1, stagger: 0.05, duration: 0.15, ease: "power3.out" }, "-=0.25")

        .to(cards[1], { opacity: 1, y: 0, scale: 1, boxShadow: "0 6px 40px rgba(21,154,169,0.06)", duration: 0.25 }, "-=0.05")
        .to(q1('[data-gsap="align-left"]'), { x: 0, opacity: 0.25, duration: 0.2 }, "-=0.15")
        .to(q1('[data-gsap="align-right"]'), { x: 0, opacity: 0.25, duration: 0.2 }, "-=0.15")
        .to(q1('[data-gsap="align-overlap"]'), { opacity: 0.5, duration: 0.25 }, "-=0.1")

        .to(cards[2], { opacity: 1, y: 0, scale: 1, boxShadow: "0 6px 40px rgba(21,154,169,0.06)", duration: 0.25 }, "-=0.05")
        .to(q2('[data-gsap="act-line-1"]'), { scaleX: 1, duration: 0.12 }, "-=0.15")
        .to(q2('[data-gsap="act-line-2"]'), { scaleX: 1, duration: 0.12 }, "-=0.1")
        .to(q2('[data-gsap="act-line-3"]'), { scaleX: 1, duration: 0.12 }, "-=0.05")
        .to(q2('[data-gsap="act-dot"]'), { opacity: 1, scale: 1, duration: 0.08 }, "-=0.02")
        .to(q2('[data-gsap="act-arrow"]'), { opacity: 0.6, strokeDashoffset: 0, duration: 0.15 }, "-=0.05")

        .to(cards[3], { opacity: 1, y: 0, scale: 1, boxShadow: "0 6px 40px rgba(21,154,169,0.06)", duration: 0.25 }, "-=0.05")
        .to(q3('[data-gsap="sustain-wave"]'), { opacity: 0.5, strokeDashoffset: 0, duration: 0.35, ease: "power2.inOut" }, "-=0.15")
        .to(q3('[data-gsap="sustain-wave-2"]'), { opacity: 0.3, strokeDashoffset: 0, duration: 0.35, ease: "power2.inOut" }, "-=0.25")
        .to(q3('[data-gsap="sustain-dot"]'), { opacity: 1, scale: 1, duration: 0.1 }, "-=0.15");
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
              className="bg-white rounded-2xl overflow-hidden border border-[#0B1220]/[0.06] will-change-transform transition-all duration-300 hover:border-[#159AA9]/20"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.03)" }}
            >
              <div className="h-1 bg-gradient-to-r from-[#159AA9] to-[#159AA9]/20" />

              <div className="px-6 py-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
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

                <div className="mt-auto">
                  {step.icon}
                </div>
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
