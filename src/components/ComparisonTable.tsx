"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  { feature: "Approche thérapeutique", wenaya: "Pluridisciplinaire — kinésithérapie, ostéopathie, psychologie, nutrition", traditional: "Mono-spécialiste — un seul type de soin" },
  {
    feature: "Bilan initial",
    wenaya: "Évaluation physique, mentale et cognitive complète",
    traditional: "Examen partiel limité à la spécialité",
  },
  {
    feature: "Coordination des soins",
    wenaya: "Suivi coordonné entre spécialistes pour une continuité optimale",
    traditional: "Parcours de soins isolé sans échange inter-spécialiste",
  },
  {
    feature: "Équipements",
    wenaya: "TECAR, outils de rééducation cognitive, équipements modernes",
    traditional: "Équipements standards limités",
  },
  {
    feature: "Horaires d'ouverture",
    wenaya: "Lundi au samedi — 8h à 20h — 6 jours sur 7",
    traditional: "Horaires variables, souvent fermé le samedi",
  },
  {
    feature: "Prise en charge",
    wenaya: "Globale, personnalisée et évolutive dans le temps",
    traditional: "Segmentée par spécialité sans vision d'ensemble",
  },
  {
    feature: "Cadre d'accueil",
    wenaya: "Espace chaleureux et moderne au cœur de Casablanca",
    traditional: "Cabinet clinique standard",
  },
  {
    feature: "Prise de rendez-vous",
    wenaya: "Réservation en ligne en 2 clics — 7j/7",
    traditional: "Téléphone uniquement, disponibilités limitées",
  },
];

export default function ComparisonTable() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLTableRowElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const rows = rowsRef.current.filter(Boolean) as HTMLTableRowElement[];

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      gsap.fromTo(
        rows,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0B1220] py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            Comparaison
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-4 tracking-tight">
            Wenaya Clinic vs. cabinet traditionnel
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 pr-6 text-sm font-medium text-white/50">
                  &nbsp;
                </th>
                <th className="py-4 px-6 text-sm font-serif font-bold text-[#B88A5A]">
                  Wenaya Clinic
                </th>
                <th className="py-4 pl-6 text-sm font-serif font-bold text-white/40">
                  Traditionnel
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  ref={(el) => { rowsRef.current[i] = el; }}
                  className="border-b border-white/5 transition-all duration-200 hover:bg-[rgba(184,138,90,0.04)]"
                >
                  <td className="py-4 pr-6 text-sm text-white/70 font-medium">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 text-sm text-white font-semibold">
                    {row.wenaya}
                  </td>
                  <td className="py-4 pl-6 text-sm text-white/40">
                    {row.traditional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
