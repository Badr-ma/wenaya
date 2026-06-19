"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const offers = [
  {
    title: "Plateforme de Prévention",
    desc: "Un tableau de bord complet pour suivre les biomarqueurs, les habitudes et les risques de vos patients. Alertes personnalisées et recommandations automatiques.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect x="8" y="12" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 8v6M32 8v6M12 24h24M12 32h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="34" cy="32" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    gradient: "from-[#159AA9]/10 to-[#0D7A87]/5",
    border: "border-[#159AA9]/15",
    accent: "#159AA9",
  },
  {
    title: "Programmes Bien-être",
    desc: "Des parcours clé en main : gestion du stress, nutrition de précision, récupération physique et santé mentale — adaptés à la patientèle de votre clinique.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M24 6v36M6 24h36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 24l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: "from-[#B88A5A]/10 to-[#9A7242]/5",
    border: "border-[#B88A5A]/15",
    accent: "#B88A5A",
  },
  {
    title: "Orchestration Pluridisciplinaire",
    desc: "Coordination fluide entre kinésithérapeutes, psychologues, nutritionnistes et médecins de votre clinique. Référencements croisés et suivi unifié.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="16" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="32" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 20l-2 8M28 20l2 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    gradient: "from-[#159AA9]/10 to-[#B88A5A]/5",
    border: "border-[#159AA9]/15",
    accent: "#159AA9",
  },
  {
    title: "Outils Analytiques",
    desc: "Rapports agrégés, tendances de santé, indicateurs de performance et tableaux de bord comparatifs pour piloter la qualité de vos soins.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect x="8" y="28" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="18" width="8" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="32" y="8" width="8" height="32" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 44h36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    gradient: "from-[#0D7A87]/10 to-[#159AA9]/5",
    border: "border-[#0D7A87]/15",
    accent: "#0D7A87",
  },
];

export default function ClinicsPrograms(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cp-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-20 sm:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#159AA9]" />
            <span className="text-[#159AA9] text-[11px] font-semibold tracking-[0.22em] uppercase">
              Notre Offre
            </span>
          </div>
          <h2 className="text-[#0B1220] font-heading"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.015em" }}
          >
            Tout ce qu&apos;il faut pour<br />
            <span className="italic" style={{ color: "#159AA9" }}>élever votre clinique.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {offers.map((o, i) => (
            <div key={i}
              className={`cp-card relative rounded-2xl p-8 sm:p-10 border ${o.border} overflow-hidden transition-all duration-300 hover:-translate-y-0.5`}
              style={{ background: `linear-gradient(135deg, ${o.gradient})`, backdropFilter: "blur(4px)" }}
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${o.accent}12`, color: o.accent, border: `1px solid ${o.accent}20` }}
                >
                  {o.icon}
                </div>
                <h3 className="text-[#0B1220] font-heading font-semibold text-xl mb-3">{o.title}</h3>
                <p className="text-[#2B2F36]/60 text-sm leading-relaxed">{o.desc}</p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-[0.04]"
                style={{ background: `radial-gradient(circle, ${o.accent} 0%, transparent 70%)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
