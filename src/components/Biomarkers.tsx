"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    num: "01",
    name: "Prévention",
    label: "Prevent",
    subtitle: "Anticiper avant que les symptômes apparaissent.",
    desc: "Bilans complets, suivi des biomarqueurs, plans de prévention personnalisés selon votre profil de risque.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="1.2" />
        <path d="M24 13v11l7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="2.5" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
  {
    num: "02",
    name: "Performance",
    label: "Perform",
    subtitle: "Atteindre votre plein potentiel physique et mental.",
    desc: "Coaching kiné, préparation mentale, optimisation des performances — pour les actifs, les sportifs et les dirigeants.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M8 38L18 24l8 6 8-14 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="20" r="2.5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    num: "03",
    name: "Récupération",
    label: "Recover",
    subtitle: "Régénérer profondément, repartir plus fort.",
    desc: "Rééducation fonctionnelle, thérapies manuelles, protocoles de récupération post-effort ou post-blessure.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M32 10c5 4 8 10 8 16 0 9.94-8.06 18-18 18S4 35.94 4 26 12.06 8 22 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M32 10l-4-5M32 10l5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    name: "Équilibre",
    label: "Balance",
    subtitle: "Réguler le système nerveux, retrouver la clarté.",
    desc: "Psychologie clinique, gestion du stress chronique, thérapie cognitivo-comportementale et accompagnement holistique.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M24 9v6M24 33v6M9 24h6M33 24h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "05",
    name: "Longévité",
    label: "Longevity",
    subtitle: "Prolonger les années de santé, pas juste la vie.",
    desc: "Médecine anti-âge, nutrition de précision, micronutrition et programmes sur le long terme pour vieillir en forme.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M24 8C15.16 8 8 15.16 8 24s7.16 16 16 16 16-7.16 16-16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M40 8l-5 5M40 8l-5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 16v8l6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Biomarkers(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bio-reveal",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-20 sm:py-28 px-6" id="univers">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="bio-reveal mb-16 sm:mb-20 max-w-2xl">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
              L'écosystème Wenaya
            </span>
          </div>
          <h2
            className="text-[#0B1220]"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
            }}
          >
            Cinq piliers.<br />Une santé complète.
          </h2>
          <p className="text-[#2B2F36]/55 text-[15px] leading-relaxed mt-5 max-w-lg">
            Chaque pilier est pris en charge par des spécialistes certifiés — orchestrés par Yolo AI pour vous offrir un parcours cohérent et personnalisé.
          </p>
        </div>

        {/* Cards grid: 2 large + 3 smaller */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

          {/* First two cards span half-width on large screens → row of 2 */}
          {pillars.slice(0, 2).map((p) => (
            <div
              key={p.name}
              className="bio-reveal group bg-white border border-[#0B1220]/[0.05] rounded-2xl p-8 sm:p-9 relative overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(184,138,90,0.08)] hover:border-[#B88A5A]/25"
            >
              {/* Ghost number */}
              <span
                className="absolute top-5 right-6 font-heading font-bold leading-none select-none pointer-events-none"
                style={{
                  fontSize: "5rem",
                  color: "rgba(11,18,32,0.03)",
                  letterSpacing: "-0.04em",
                }}
              >
                {p.num}
              </span>

              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#B88A5A] transition-all duration-300 group-hover:bg-[#B88A5A]/8" style={{ background: "rgba(184,138,90,0.06)" }}>
                  {p.icon}
                </div>

                <h3 className="font-heading font-bold text-[#0B1220] text-lg mt-6 mb-2">
                  {p.name}
                </h3>
                <p className="text-[#0B1220]/55 text-[13.5px] font-medium mb-3 leading-snug">
                  {p.subtitle}
                </p>
                <p className="text-[#2B2F36]/45 text-[12.5px] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Third card in first row on lg, starts second row on md */}
          <div
            key={pillars[2].name}
            className="bio-reveal group bg-[#0B1220] border border-white/[0.07] rounded-2xl p-8 sm:p-9 relative overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:col-span-2 lg:col-span-1"
          >
            <span
              className="absolute top-5 right-6 font-heading font-bold leading-none select-none pointer-events-none"
              style={{ fontSize: "5rem", color: "rgba(255,255,255,0.03)", letterSpacing: "-0.04em" }}
            >
              {pillars[2].num}
            </span>
            <div className="relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#B88A5A]" style={{ background: "rgba(184,138,90,0.08)" }}>
                {pillars[2].icon}
              </div>
              <h3 className="font-heading font-bold text-white text-lg mt-6 mb-2">
                {pillars[2].name}
              </h3>
              <p className="text-white/55 text-[13.5px] font-medium mb-3 leading-snug">
                {pillars[2].subtitle}
              </p>
              <p className="text-white/30 text-[12.5px] leading-relaxed">
                {pillars[2].desc}
              </p>
            </div>
          </div>

          {/* Last two cards */}
          {pillars.slice(3).map((p) => (
            <div
              key={p.name}
              className="bio-reveal group bg-white border border-[#0B1220]/[0.05] rounded-2xl p-8 sm:p-9 relative overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(184,138,90,0.08)] hover:border-[#B88A5A]/25"
            >
              <span
                className="absolute top-5 right-6 font-heading font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: "5rem", color: "rgba(11,18,32,0.03)", letterSpacing: "-0.04em" }}
              >
                {p.num}
              </span>
              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#B88A5A] transition-all duration-300 group-hover:bg-[#B88A5A]/8" style={{ background: "rgba(184,138,90,0.06)" }}>
                  {p.icon}
                </div>
                <h3 className="font-heading font-bold text-[#0B1220] text-lg mt-6 mb-2">
                  {p.name}
                </h3>
                <p className="text-[#0B1220]/55 text-[13.5px] font-medium mb-3 leading-snug">
                  {p.subtitle}
                </p>
                <p className="text-[#2B2F36]/45 text-[12.5px] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="bio-reveal mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-10 border-t border-[#0B1220]/[0.06]">
          <p className="text-[#2B2F36]/50 text-sm max-w-md">
            Tous nos programmes sont conçus sur mesure après votre première évaluation pluridisciplinaire.
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 text-[#B88A5A] text-sm font-semibold hover:gap-3 transition-all duration-300"
          >
            Découvrir notre méthode
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
