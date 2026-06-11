"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const colors = {
  teal: "#159AA9",
  bronze: "#A67C52",
  navy: "#0B1220",
  graphite: "#2B2F36",
};

const steps = [
  {
    number: "01",
    title: "Assess",
    subtitle: "Comprendre où vous en êtes.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <circle cx="100" cy="50" r="40" stroke={colors.teal} strokeWidth="0.5" opacity="0.15" />
        <circle cx="100" cy="50" r="28" stroke={colors.teal} strokeWidth="0.5" opacity="0.12" />
        <circle cx="100" cy="50" r="16" stroke={colors.teal} strokeWidth="0.5" opacity="0.12" />
        <circle cx="100" cy="50" r="10" fill={colors.teal} opacity="0.06" />
        <circle cx="100" cy="50" r="3" fill={colors.bronze} />
        <circle cx="100" cy="50" r="5" fill={colors.bronze} opacity="0.2" />
        <line x1="100" y1="10" x2="100" y2="90" stroke={colors.teal} strokeWidth="0.3" strokeDasharray="2 4" opacity="0.15" />
        <line x1="10" y1="50" x2="190" y2="50" stroke={colors.teal} strokeWidth="0.3" strokeDasharray="2 4" opacity="0.15" />
        <path d="M100 10 L140 50 L100 90" stroke={colors.teal} strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.08" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Align",
    subtitle: "Construire un parcours qui vous ressemble.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <circle cx="80" cy="50" r="26" fill={colors.teal} opacity="0.08" />
        <circle cx="120" cy="50" r="26" fill={colors.bronze} opacity="0.08" />
        <circle cx="80" cy="50" r="26" stroke={colors.teal} strokeWidth="0.5" opacity="0.3" />
        <circle cx="120" cy="50" r="26" stroke={colors.bronze} strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="100" cy="50" rx="14" ry="26" fill={colors.navy} opacity="0.08" />
        <ellipse cx="100" cy="50" rx="14" ry="26" stroke={colors.navy} strokeWidth="0.5" opacity="0.25" />
        <circle cx="100" cy="50" r="3" fill={colors.teal} />
        <circle cx="100" cy="50" r="6" fill={colors.teal} opacity="0.15" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Activate",
    subtitle: "Passer à l'action, ensemble.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <rect x="30" y="58" width="20" height="28" rx="2" fill={colors.teal} opacity="0.15" />
        <rect x="30" y="58" width="20" height="28" rx="2" stroke={colors.teal} strokeWidth="0.5" opacity="0.3" />
        <rect x="58" y="46" width="20" height="40" rx="2" fill={colors.bronze} opacity="0.15" />
        <rect x="58" y="46" width="20" height="40" rx="2" stroke={colors.bronze} strokeWidth="0.5" opacity="0.3" />
        <rect x="86" y="34" width="20" height="52" rx="2" fill={colors.navy} opacity="0.12" />
        <rect x="86" y="34" width="20" height="52" rx="2" stroke={colors.navy} strokeWidth="0.5" opacity="0.2" />
        <rect x="114" y="22" width="20" height="64" rx="2" fill={colors.teal} opacity="0.2" />
        <rect x="114" y="22" width="20" height="64" rx="2" stroke={colors.teal} strokeWidth="0.5" opacity="0.35" />
        <rect x="142" y="10" width="20" height="76" rx="2" fill={colors.bronze} opacity="0.2" />
        <rect x="142" y="10" width="20" height="76" rx="2" stroke={colors.bronze} strokeWidth="0.5" opacity="0.35" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Sustain",
    subtitle: "Prévenir, performer, durer.",
    icon: (
      <svg viewBox="0 0 200 100" className="w-full h-auto" fill="none">
        <circle cx="100" cy="50" r="34" stroke={colors.teal} strokeWidth="0.5" opacity="0.12" />
        <path d="M34 50 C50 24, 64 24, 80 50 C96 76, 110 76, 126 50 C142 24, 156 24, 172 50" stroke={colors.teal} strokeWidth="0.6" strokeLinecap="round" opacity="0.15" />
        <path d="M44 50 C58 30, 72 30, 86 50 C100 70, 114 70, 128 50 C142 30, 156 30, 170 50" stroke={colors.bronze} strokeWidth="0.4" strokeLinecap="round" opacity="0.12" />
        <circle cx="100" cy="50" r="4" fill={colors.teal} opacity="0.25" />
        <circle cx="100" cy="50" r="2" fill={colors.bronze} />
        <circle cx="34" cy="50" r="3" fill={colors.teal} opacity="0.3" />
        <circle cx="172" cy="50" r="3" fill={colors.bronze} opacity="0.3" />
        <line x1="0" y1="50" x2="34" y2="50" stroke={colors.teal} strokeWidth="0.3" strokeDasharray="2 4" opacity="0.1" />
        <line x1="172" y1="50" x2="200" y2="50" stroke={colors.bronze} strokeWidth="0.3" strokeDasharray="2 4" opacity="0.1" />
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
              className="bg-white rounded-2xl overflow-hidden border border-[#0B1220]/[0.06] will-change-transform transition-all duration-300 hover:border-[#159AA9]/20"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.03)" }}
            >
              <div className="h-1 bg-gradient-to-r from-[#159AA9] to-[#159AA9]/20" />

              <div className="px-6 py-6 flex flex-col gap-4 items-center text-center">
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
