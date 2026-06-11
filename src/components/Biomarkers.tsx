"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    name: "Kinésithérapie",
    count: "6 soins",
    description:
      "Rééducation fonctionnelle post-opératoire, thérapie manuelle, TECAR (Transfert Énergétique Capacitif et Résistif), soins post-AVC et réadaptation neurologique pour retrouver mobilité et autonomie à Casablanca.",
  },
  {
    name: "Ostéopathie",
    count: "5 soins",
    description:
      "Traitement des douleurs musculo-squelettiques (lombalgies, cervicalgies), troubles fonctionnels digestifs et crâniens, accompagnement de la grossesse et du nourrisson par des techniques ostéopathiques structurelles et fasciales.",
  },
  {
    name: "Psychologie",
    count: "8 soins",
    description:
      "Suivi psychologique pour adultes et enfants, thérapies cognitives et comportementales (TCC), gestion du stress chronique, des troubles anxieux et des émotions par des psychologues cliniciennes diplômées à Casablanca.",
  },
  {
    name: "Neuropsychologie",
    count: "4 soins",
    description:
      "Évaluation des fonctions cognitives (mémoire, attention, langage), rééducation cognitive après lésion cérébrale, accompagnement des troubles de l'apprentissage (dyslexie, TDAH) et des pathologies neurodégénératives.",
  },
  {
    name: "Nutrition",
    count: "5 soins",
    description:
      "Consultations nutritionnelles personnalisées, rééquilibrage alimentaire, suivi du poids, gestion des intolérances alimentaires et accompagnement diététique pour pathologies métaboliques (diabète, cholestérol).",
  },
  {
    name: "Orthophonie",
    count: "4 soins",
    description:
      "Prise en charge des troubles du langage oral et écrit (dysphasie, dyslexie), de la voix (dysphonie), de la déglutition (dysphagie) et des apprentissages chez l'enfant et l'adulte orthophonique à Casablanca.",
  },
];

export default function Biomarkers() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] noise py-16 sm:py-32 px-4 sm:px-6" id="specialites">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-10 sm:mb-16">
          <span className="text-[#B88A5A] font-semibold text-[11px] sm:text-sm tracking-widest uppercase">
            Kinésithérapie &bull; Ostéopathie &bull; Psychologie &bull; Neuropsychologie &bull; Nutrition &bull; Orthophonie
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B1220] mt-3 sm:mt-4 tracking-tight">
            Une approche pluridisciplinaire <br className="hidden sm:block" />
             en 6 spécialités santé
          </h2>
          <p className="text-[#6B6B6B] text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Wenaya Clinic Casablanca réunit kinésithérapeutes, ostéopathes, psychologues, neuropsychologues, nutritionnistes et orthophonistes pour une prise en charge globale de votre santé physique, mentale et cognitive.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              ref={(el) => { cardsRef.current[i] = el; }}
               className="bg-white rounded-xl sm:rounded-2xl border border-[rgba(184,138,90,0.1)] p-4 sm:p-6 transition-all duration-300 hover:border-[rgba(184,138,90,0.25)] hover:shadow-md hover:shadow-[rgba(184,138,90,0.06)] hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="font-serif font-bold text-[#0B1220] text-[13px] sm:text-base">
                  {cat.name}
                </h3>
                <span className="text-[10px] sm:text-xs font-semibold text-[#B88A5A] bg-[rgba(184,138,90,0.08)] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  {cat.count}
                </span>
              </div>
              <p className="text-[#6B6B6B] text-[11px] sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
