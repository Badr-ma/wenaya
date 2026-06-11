"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Consultation & évaluation",
    subtitle: "Bilan complet de vos besoins",
    icon: (
      <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
        <rect x="30" y="20" width="140" height="100" rx="12" stroke="#B88A5A" strokeWidth="1.2" fill="rgba(184,138,90,0.03)" />
        <path data-gsap="vial-line" d="M55 55L75 55" stroke="#B88A5A" strokeWidth="1" strokeLinecap="round" />
        <path data-gsap="vial-line" d="M55 70L90 70" stroke="#B88A5A" strokeWidth="1" strokeLinecap="round" />
        <path data-gsap="vial-line" d="M55 85L80 85" stroke="#B88A5A" strokeWidth="1" strokeLinecap="round" />
        <circle data-gsap="dot-1" cx="105" cy="55" r="4" fill="#B88A5A" />
        <circle data-gsap="dot-2" cx="125" cy="70" r="4" fill="#B88A5A" />
        <circle data-gsap="dot-3" cx="115" cy="85" r="4" fill="#B88A5A" />
        <path data-gsap="dna" d="M140 40 C150 50, 130 60, 140 70 C150 80, 130 90, 140 100" stroke="#B88A5A" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        <path data-gsap="check" d="M170 30 L175 35 L185 22" stroke="#B88A5A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Diagnostic & plan de soins",
    subtitle: "Accompagnement personnalisé",
    icon: (
      <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
        <circle data-gsap="left-person" cx="60" cy="48" r="18" stroke="#B88A5A" strokeWidth="1.2" fill="rgba(184,138,90,0.04)" />
        <circle data-gsap="right-person" cx="140" cy="48" r="18" stroke="#B88A5A" strokeWidth="1.2" fill="rgba(184,138,90,0.04)" />
        <path data-gsap="connect-line" d="M76 68C76 68 82 86 100 86C118 86 124 68 124 68" stroke="#B88A5A" strokeWidth="1" strokeLinecap="round" />
        <path data-gsap="signal-l" d="M44 78L60 78" stroke="#B88A5A" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <path data-gsap="signal-r" d="M140 78L156 78" stroke="#B88A5A" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <path data-gsap="base-line" d="M30 115L170 115" stroke="#E8DDCE" strokeWidth="1" strokeLinecap="round" />
        <circle data-gsap="dot-1" cx="50" cy="108" r="2.5" fill="#B88A5A" />
        <circle data-gsap="dot-2" cx="100" cy="108" r="2.5" fill="#B88A5A" />
        <circle data-gsap="dot-3" cx="150" cy="108" r="2.5" fill="#B88A5A" />
        <path data-gsap="steth" d="M100 86 L100 95" stroke="#B88A5A" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Suivi & accompagnement",
    subtitle: "Optimisation continue",
    icon: (
      <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
        <path data-gsap="grid-h" d="M30 125L170 125" stroke="#E8DDCE" strokeWidth="0.8" />
        <path data-gsap="grid-h" d="M30 105L170 105" stroke="#E8DDCE" strokeWidth="0.8" />
        <path data-gsap="grid-v" d="M80 40L80 125" stroke="#E8DDCE" strokeWidth="0.8" />
        <path data-gsap="trend" d="M40 110 C65 100, 85 70, 105 60 C125 50, 140 35, 165 28" stroke="#B88A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle data-gsap="dot-trend" cx="165" cy="28" r="3.5" fill="#B88A5A" />
        <rect data-gsap="bar-1" x="88" y="88" width="8" height="37" rx="2" fill="rgba(184,138,90,0.15)" stroke="#B88A5A" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
        <rect data-gsap="bar-2" x="105" y="72" width="8" height="53" rx="2" fill="rgba(184,138,90,0.15)" stroke="#B88A5A" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
        <rect data-gsap="bar-3" x="122" y="52" width="8" height="73" rx="2" fill="rgba(184,138,90,0.2)" stroke="#B88A5A" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
        <rect data-gsap="bar-4" x="139" y="38" width="8" height="87" rx="2" fill="rgba(184,138,90,0.15)" stroke="#B88A5A" strokeWidth="0.8" style={{ transformOrigin: "bottom" }} />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

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

      const q0 = gsap.utils.selector(cards[0]);
      const q1 = gsap.utils.selector(cards[1]);
      const q2 = gsap.utils.selector(cards[2]);

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
        .to(q2('[data-gsap="dot-trend"]'), { scale: 1, opacity: 1, duration: 0.25 }, "-=0.1");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F2EFE9] noise accent-top relative overflow-hidden"
      id="how-it-works"
      style={{ padding: "120px 0" }}
    >
      <div className="max-w-[1440px] mx-auto px-16 max-md:px-6 relative">
        <div ref={headingRef} className="max-w-[640px] mx-auto text-center mb-5 will-change-transform">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            Votre santé, notre priorité
          </span>
          <h2 className="font-serif text-[52px] leading-[1.15] font-medium text-[#0B1220] max-md:text-4xl max-md:leading-tight tracking-tight">
            Trois étapes vers une{" "}
            <span className="text-[#B88A5A] italic">meilleure santé</span>
          </h2>
        </div>

        <div ref={subheadingRef} className="max-w-[520px] mx-auto text-center mb-16 will-change-transform">
          <p className="font-sans text-[15px] leading-relaxed text-[#6B6B6B] font-light">
            De l&apos;évaluation initiale à l&apos;accompagnement sur la durée, notre approche intégrée réunit kinésithérapeutes, ostéopathes, psychologues et nutritionnistes à Casablanca pour une prise en charge qui vous ressemble.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={setStepRef(i)}
              className="bg-white rounded-2xl px-8 py-14 flex flex-col gap-10 border border-[rgba(184,138,90,0.1)] will-change-transform"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.03)" }}
            >
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[11px] font-semibold tracking-[0.15em] text-[#B88A5A] uppercase">
                  Étape {step.number}
                </span>
                <h3 className="font-serif text-[26px] leading-tight font-medium text-[#0B1220]">
                  {step.title}
                </h3>
                <span className="font-sans text-[14px] leading-relaxed text-[#6B6B6B] font-light">
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
            className="inline-flex items-center justify-center px-8 h-[50px] bg-[#B88A5A] text-white rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#A07848] hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
          >
            Réserver votre soin en 2 clics
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-7 h-[50px] bg-transparent text-[#B88A5A] border border-[rgba(184,138,90,0.25)] rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-300 hover:border-[#B88A5A] hover:bg-[rgba(184,138,90,0.04)]"
          >
            Découvrir les pratiques
          </a>
        </div>
      </div>
    </section>
  );
}
