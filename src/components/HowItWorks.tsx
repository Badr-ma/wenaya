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
      <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
        <rect x="30" y="20" width="140" height="100" rx="12" stroke="#159AA9" strokeWidth="1.2" fill="rgba(21,154,169,0.03)" />
        <path data-gsap="vial-line" d="M55 55L75 55" stroke="#159AA9" strokeWidth="1" strokeLinecap="round" />
        <path data-gsap="vial-line" d="M55 70L90 70" stroke="#159AA9" strokeWidth="1" strokeLinecap="round" />
        <path data-gsap="vial-line" d="M55 85L80 85" stroke="#159AA9" strokeWidth="1" strokeLinecap="round" />
        <circle data-gsap="dot-1" cx="105" cy="55" r="4" fill="#159AA9" />
        <circle data-gsap="dot-2" cx="125" cy="70" r="4" fill="#159AA9" />
        <circle data-gsap="dot-3" cx="115" cy="85" r="4" fill="#159AA9" />
        <path data-gsap="dna" d="M140 40 C150 50, 130 60, 140 70 C150 80, 130 90, 140 100" stroke="#159AA9" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        <path data-gsap="check" d="M170 30 L175 35 L185 22" stroke="#159AA9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Align",
    subtitle: "Construire un parcours qui vous ressemble.",
    icon: (
      <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
        <circle data-gsap="left-person" cx="60" cy="48" r="18" stroke="#159AA9" strokeWidth="1.2" fill="rgba(21,154,169,0.04)" />
        <circle data-gsap="right-person" cx="140" cy="48" r="18" stroke="#159AA9" strokeWidth="1.2" fill="rgba(21,154,169,0.04)" />
        <path data-gsap="connect-line" d="M76 68C76 68 82 86 100 86C118 86 124 68 124 68" stroke="#159AA9" strokeWidth="1" strokeLinecap="round" />
        <path data-gsap="signal-l" d="M44 78L60 78" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <path data-gsap="signal-r" d="M140 78L156 78" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <path data-gsap="base-line" d="M30 115L170 115" stroke="#E8DDCE" strokeWidth="1" strokeLinecap="round" />
        <circle data-gsap="dot-1" cx="50" cy="108" r="2.5" fill="#159AA9" />
        <circle data-gsap="dot-2" cx="100" cy="108" r="2.5" fill="#159AA9" />
        <circle data-gsap="dot-3" cx="150" cy="108" r="2.5" fill="#159AA9" />
        <path data-gsap="steth" d="M100 86 L100 95" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Activate",
    subtitle: "Passer à l'action, ensemble.",
    icon: (
      <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
        <path data-gsap="grid-h" d="M30 125L170 125" stroke="#E8DDCE" strokeWidth="0.8" />
        <path data-gsap="grid-h" d="M30 105L170 105" stroke="#E8DDCE" strokeWidth="0.8" />
        <path data-gsap="grid-v" d="M80 40L80 125" stroke="#E8DDCE" strokeWidth="0.8" />
        <path data-gsap="trend" d="M40 110 C65 100, 85 70, 105 60 C125 50, 140 35, 165 28" stroke="#159AA9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle data-gsap="dot-trend" cx="165" cy="28" r="3.5" fill="#159AA9" />
        <rect data-gsap="bar-1" x="88" y="88" width="8" height="37" rx="2" fill="rgba(21,154,169,0.15)" stroke="#159AA9" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
        <rect data-gsap="bar-2" x="105" y="72" width="8" height="53" rx="2" fill="rgba(21,154,169,0.15)" stroke="#159AA9" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
        <rect data-gsap="bar-3" x="122" y="52" width="8" height="73" rx="2" fill="rgba(21,154,169,0.2)" stroke="#159AA9" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
        <rect data-gsap="bar-4" x="139" y="38" width="8" height="87" rx="2" fill="rgba(21,154,169,0.15)" stroke="#159AA9" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Sustain",
    subtitle: "Prévenir, performer, durer.",
    icon: (
      <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
        <circle cx="100" cy="70" r="45" stroke="#159AA9" strokeWidth="1" fill="rgba(21,154,169,0.03)" />
        <path d="M100 45 L100 70 L120 80" stroke="#159AA9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="100" cy="70" r="4" fill="#159AA9" />
        <path d="M55 70 L70 70" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <path d="M130 70 L145 70" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <path d="M100 25 L100 40" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <path d="M100 100 L100 115" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <path data-gsap="arc" d="M67 42 C82 27, 118 27, 133 42" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />
        <path data-gsap="arc" d="M67 98 C82 113, 118 113, 133 98" stroke="#159AA9" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />
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

      gsap.set('[data-gsap="vial-line"]', { scaleX: 0, transformOrigin: "left" });
      gsap.set('[data-gsap="dna"]', { strokeDasharray: 100, strokeDashoffset: 100 });
      gsap.set('[data-gsap="check"]', { strokeDasharray: 20, strokeDashoffset: 20 });
      gsap.set('[data-gsap="dot-1"],[data-gsap="dot-2"],[data-gsap="dot-3"]', { scale: 0, transformOrigin: "center" });

      gsap.set('[data-gsap="left-person"]', { x: -4, opacity: 0.5 });
      gsap.set('[data-gsap="right-person"]', { x: 4, opacity: 0.5 });
      gsap.set('[data-gsap="connect-line"]', { strokeDasharray: 60, strokeDashoffset: 60, opacity: 0.4 });
      gsap.set('[data-gsap="signal-l"],[data-gsap="signal-r"]', { strokeDasharray: 16, strokeDashoffset: 16 });
      gsap.set('[data-gsap="base-line"]', { strokeDasharray: 140, strokeDashoffset: 140 });
      gsap.set('[data-gsap="steth"]', { scaleY: 0, transformOrigin: "top" });

      gsap.set('[data-gsap="bar-1"]', { scaleY: 0.15, transformOrigin: "bottom" });
      gsap.set('[data-gsap="bar-2"]', { scaleY: 0.1, transformOrigin: "bottom" });
      gsap.set('[data-gsap="bar-3"]', { scaleY: 0.25, transformOrigin: "bottom" });
      gsap.set('[data-gsap="bar-4"]', { scaleY: 0.08, transformOrigin: "bottom" });
      gsap.set('[data-gsap="trend"]', { strokeDasharray: 180, strokeDashoffset: 180 });
      gsap.set('[data-gsap="dot-trend"]', { scale: 0, transformOrigin: "center", opacity: 0 });
      gsap.set('[data-gsap="grid-h"],[data-gsap="grid-v"]', { opacity: 0 });

      gsap.set('[data-gsap="arc"]', { strokeDasharray: 60, strokeDashoffset: 60 });

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
        .to(q0('[data-gsap="vial-line"]'), { scaleX: 1, stagger: 0.08, duration: 0.35, ease: "power3.out" }, "-=0.25")
        .to(q0('[data-gsap="dna"]'), { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .to(q0('[data-gsap="check"]'), { strokeDashoffset: 0, duration: 0.25 }, "-=0.15")
        .to(q0('[data-gsap="dot-1"],[data-gsap="dot-2"],[data-gsap="dot-3"]'), { scale: 1, stagger: 0.05, duration: 0.25 }, "-=0.2")

        .to(cards[1], { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 40px rgba(0,0,0,0.04)", duration: 0.5 }, "+=0.08")
        .to(q1('[data-gsap="left-person"]'), { x: 0, opacity: 1, duration: 0.35 }, "-=0.3")
        .to(q1('[data-gsap="right-person"]'), { x: 0, opacity: 1, duration: 0.35 }, "-=0.3")
        .to(q1('[data-gsap="connect-line"]'), { strokeDashoffset: 0, opacity: 1, duration: 0.4 }, "-=0.25")
        .to(q1('[data-gsap="signal-l"],[data-gsap="signal-r"]'), { strokeDashoffset: 0, duration: 0.25 }, "-=0.2")
        .to(q1('[data-gsap="base-line"]'), { strokeDashoffset: 0, duration: 0.3 }, "-=0.2")
        .to(q1('[data-gsap="steth"]'), { scaleY: 1, transformOrigin: "top", duration: 0.25 }, "-=0.15")
        .to(q1('[data-gsap="dot-1"],[data-gsap="dot-2"],[data-gsap="dot-3"]'), { scale: 1, stagger: 0.05, duration: 0.25 }, "-=0.15")

        .to(cards[2], { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 40px rgba(0,0,0,0.04)", duration: 0.5 }, "+=0.08")
        .to(q2('[data-gsap="grid-h"],[data-gsap="grid-v"]'), { opacity: 0.6, duration: 0.25 }, "-=0.3")
        .to(q2('[data-gsap="bar-1"]'), { scaleY: 0.55, duration: 0.3 }, "-=0.25")
        .to(q2('[data-gsap="bar-2"]'), { scaleY: 0.75, duration: 0.3 }, "-=0.25")
        .to(q2('[data-gsap="bar-3"]'), { scaleY: 1, duration: 0.3 }, "-=0.25")
        .to(q2('[data-gsap="bar-4"]'), { scaleY: 0.85, duration: 0.3 }, "-=0.25")
        .to(q2('[data-gsap="trend"]'), { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.35")
        .to(q2('[data-gsap="dot-trend"]'), { scale: 1, opacity: 1, duration: 0.25 }, "-=0.1")

        .to(cards[3], { opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 40px rgba(0,0,0,0.04)", duration: 0.5 }, "+=0.08")
        .to(q3('[data-gsap="arc"]'), { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
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
