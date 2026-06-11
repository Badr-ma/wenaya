"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { label: "Écouter", desc: "Nous prenons le temps de comprendre chaque dimension de votre santé — physique, mentale, nutritionnelle et lifestyle." },
  { label: "Analyser", desc: "Notre équipe collabore pour construire une vision complète de vos besoins, objectifs et des causes profondes de vos préoccupations." },
  { label: "Accompagner", desc: "Nous délivrons un plan coordonné et personnalisé, s'appuyant sur l'expertise de multiples disciplines working ensemble." },
  { label: "Évoluer", desc: "Un suivi continu, de la prévention et des conseils vous aident à maintenir vos résultats sur le long terme." },
];

export default function WenayaApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo("#wa-badge", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      gsap.fromTo("#wa-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 83%", toggleActions: "play none none none" } });
      const cards = el.querySelectorAll(".wa-card");
      gsap.fromTo(cards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" } });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-28 sm:py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="og1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B88A5A" />
              <stop offset="100%" stopColor="#159AA9" />
            </linearGradient>
            <linearGradient id="og2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#159AA9" />
              <stop offset="100%" stopColor="#B88A5A" />
            </linearGradient>
          </defs>
          <ellipse cx="720" cy="450" rx="520" ry="320" fill="url(#og1)" opacity="0.15" />
          <circle cx="360" cy="220" r="180" fill="url(#og2)" opacity="0.1" />
          <circle cx="1080" cy="680" r="140" fill="url(#og1)" opacity="0.08" />
          <path d="M0,450 Q360,300 720,450 Q1080,600 1440,450" stroke="url(#og1)" strokeWidth="1" fill="none" opacity="0.2" />
          <path d="M0,500 Q360,350 720,500 Q1080,650 1440,500" stroke="url(#og2)" strokeWidth="0.5" fill="none" opacity="0.15" />
          <circle cx="200" cy="700" r="60" fill="url(#og2)" opacity="0.06" />
          <circle cx="1240" cy="200" r="80" fill="url(#og1)" opacity="0.05" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div id="wa-badge">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/40" />
              Notre Approche
            </span>
          </div>

          <h2 id="wa-title" className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold text-[#0B1220] leading-[1.08] tracking-tight mt-5">
            L&apos;approche Wenaya
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div
              key={i}
              className="wa-card group relative bg-white rounded-2xl p-8 sm:p-10 border border-[rgba(184,138,90,0.06)] transition-all duration-500 hover:shadow-2xl hover:shadow-[rgba(184,138,90,0.08)] hover:-translate-y-1.5"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[clamp(2.5rem,3vw,3.5rem)] font-heading font-bold text-[#B88A5A]/15">0{i + 1}</span>
                <div className="w-10 h-px bg-gradient-to-r from-[#B88A5A]/30 to-transparent" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#0B1220] group-hover:text-[#B88A5A] transition-colors duration-300">{s.label}</h3>
              <p className="text-[#2B2F36] text-sm sm:text-base mt-4 leading-relaxed">{s.desc}</p>
              <div className="mt-8 pt-5 border-t border-gray-100">
                <span className="text-xs font-medium text-[#B88A5A] flex items-center gap-2">
                  <span className="w-4 h-px bg-[#B88A5A]/30" />
                  Étape {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
