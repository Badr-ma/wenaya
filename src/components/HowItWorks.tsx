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
      <svg viewBox="0 0 200 120" className="w-full h-auto" fill="none">
        <circle cx="100" cy="60" r="44" stroke="#159AA9" strokeWidth="0.6" opacity="0.25" />
        <circle cx="100" cy="60" r="32" stroke="#159AA9" strokeWidth="0.5" opacity="0.15" />
        <circle cx="100" cy="60" r="20" stroke="#159AA9" strokeWidth="0.5" opacity="0.15" />
        <circle cx="100" cy="60" r="3" fill="#159AA9" opacity="0.4" />
        <path data-gsap="assess-sweep" d="M100 16 A44 44 0 0 1 144 60" stroke="#159AA9" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
        <line data-gsap="assess-line" x1="100" y1="60" x2="100" y2="16" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
        <line data-gsap="assess-line" x1="100" y1="60" x2="144" y2="60" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Align",
    subtitle: "Construire un parcours qui vous ressemble.",
    icon: (
      <svg viewBox="0 0 200 120" className="w-full h-auto" fill="none">
        <circle data-gsap="align-left" cx="88" cy="60" r="30" stroke="#159AA9" strokeWidth="0.6" opacity="0.3" />
        <circle data-gsap="align-right" cx="112" cy="60" r="30" stroke="#159AA9" strokeWidth="0.6" opacity="0.3" />
        <path data-gsap="align-overlap" d="M88 30 A30 30 0 0 1 112 30 A30 30 0 0 1 112 90 A30 30 0 0 1 88 90" stroke="#159AA9" strokeWidth="0.7" opacity="0" />
        <line data-gsap="align-center-h" x1="88" y1="60" x2="112" y2="60" stroke="#159AA9" strokeWidth="0.5" opacity="0.15" />
        <line data-gsap="align-center-v" x1="100" y1="30" x2="100" y2="90" stroke="#159AA9" strokeWidth="0.5" opacity="0.15" />
        <circle cx="100" cy="60" r="2" fill="#159AA9" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Activate",
    subtitle: "Passer à l'action, ensemble.",
    icon: (
      <svg viewBox="0 0 200 120" className="w-full h-auto" fill="none">
        <line data-gsap="act-line-1" x1="50" y1="75" x2="85" y2="75" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" />
        <line data-gsap="act-line-2" x1="50" y1="60" x2="105" y2="60" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" />
        <line data-gsap="act-line-3" x1="50" y1="45" x2="125" y2="45" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" />
        <circle data-gsap="act-dot" cx="145" cy="45" r="2.5" fill="#159AA9" opacity="0" />
        <line data-gsap="act-arrow" x1="135" y1="35" x2="150" y2="45" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
        <line data-gsap="act-arrow" x1="135" y1="55" x2="150" y2="45" stroke="#159AA9" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Sustain",
    subtitle: "Prévenir, performer, durer.",
    icon: (
      <svg viewBox="0 0 200 120" className="w-full h-auto" fill="none">
        <circle cx="100" cy="60" r="36" stroke="#159AA9" strokeWidth="0.6" opacity="0.2" />
        <path data-gsap="sustain-wave" d="M72 60 C80 42, 90 42, 100 60 C110 78, 120 78, 128 60" stroke="#159AA9" strokeWidth="0.7" strokeLinecap="round" opacity="0" />
        <path data-gsap="sustain-wave-2" d="M72 60 C80 52, 90 52, 100 60 C110 68, 120 68, 128 60" stroke="#159AA9" strokeWidth="0.5" strokeLinecap="round" opacity="0" />
        <circle data-gsap="sustain-dot" cx="100" cy="36" r="2" fill="#159AA9" opacity="0" />
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

      gsap.set('[data-gsap="assess-sweep"]', { strokeDasharray: 88, strokeDashoffset: 88 });
      gsap.set('[data-gsap="assess-line"]', { scaleY: 0, transformOrigin: "bottom" });

      gsap.set('[data-gsap="align-left"]', { x: -4, opacity: 0.2 });
      gsap.set('[data-gsap="align-right"]', { x: 4, opacity: 0.2 });
      gsap.set('[data-gsap="align-overlap"]', { opacity: 0 });

      gsap.set('[data-gsap="act-line-1"]', { scaleX: 0, transformOrigin: "left" });
      gsap.set('[data-gsap="act-line-2"]', { scaleX: 0, transformOrigin: "left" });
      gsap.set('[data-gsap="act-line-3"]', { scaleX: 0, transformOrigin: "left" });
      gsap.set('[data-gsap="act-dot"]', { opacity: 0, scale: 0 });
      gsap.set('[data-gsap="act-arrow"]', { opacity: 0, strokeDasharray: 12, strokeDashoffset: 12 });

      gsap.set('[data-gsap="sustain-wave"]', { opacity: 0, strokeDasharray: 60, strokeDashoffset: 60 });
      gsap.set('[data-gsap="sustain-wave-2"]', { opacity: 0, strokeDasharray: 60, strokeDashoffset: 60 });
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
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 })
        .to(subheadingRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")

        .to(cards[0], { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 40px rgba(0,0,0,0.04)", duration: 0.5 }, "-=0.1")
        .to(q0('[data-gsap="assess-sweep"]'), { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.2")
        .to(q0('[data-gsap="assess-line"]'), { scaleY: 1, stagger: 0.1, duration: 0.3, ease: "power3.out" }, "-=0.5")

        .to(cards[1], { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 40px rgba(0,0,0,0.04)", duration: 0.5 }, "+=0.08")
        .to(q1('[data-gsap="align-left"]'), { x: 0, opacity: 0.3, duration: 0.4 }, "-=0.3")
        .to(q1('[data-gsap="align-right"]'), { x: 0, opacity: 0.3, duration: 0.4 }, "-=0.3")
        .to(q1('[data-gsap="align-overlap"]'), { opacity: 0.5, duration: 0.5 }, "-=0.2")

        .to(cards[2], { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 40px rgba(0,0,0,0.04)", duration: 0.5 }, "+=0.08")
        .to(q2('[data-gsap="act-line-1"]'), { scaleX: 1, duration: 0.25 }, "-=0.3")
        .to(q2('[data-gsap="act-line-2"]'), { scaleX: 1, duration: 0.25 }, "-=0.2")
        .to(q2('[data-gsap="act-line-3"]'), { scaleX: 1, duration: 0.25 }, "-=0.1")
        .to(q2('[data-gsap="act-dot"]'), { opacity: 1, scale: 1, duration: 0.2 }, "-=0.05")
        .to(q2('[data-gsap="act-arrow"]'), { opacity: 0.6, strokeDashoffset: 0, duration: 0.3 }, "-=0.1")

        .to(cards[3], { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 40px rgba(0,0,0,0.04)", duration: 0.5 }, "+=0.08")
        .to(q3('[data-gsap="sustain-wave"]'), { opacity: 0.5, strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.3")
        .to(q3('[data-gsap="sustain-wave-2"]'), { opacity: 0.3, strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.5")
        .to(q3('[data-gsap="sustain-dot"]'), { opacity: 1, scale: 1, duration: 0.2 }, "-=0.3");
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
              className="bg-white rounded-2xl px-6 py-10 flex flex-col gap-8 border border-[#0B1220]/[0.06] will-change-transform"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.03)" }}
            >
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[#159AA9] uppercase">
                  Étape {step.number}
                </span>
                <h3 className="font-heading text-[26px] leading-tight font-bold text-[#0B1220] tracking-[-0.02em]">
                  {step.title}
                </h3>
                <span className="text-[14px] leading-relaxed text-[#2B2F36] font-light">
                  {step.subtitle}
                </span>
              </div>

              <div className="mt-auto">{step.icon}</div>
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
