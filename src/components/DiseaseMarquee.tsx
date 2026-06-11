"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const servicesRow1 = [
  "Kinésithérapie",
  "Ostéopathie",
  "Psychologie",
  "Neuropsychologie",
  "Nutrition",
  "Orthophonie",
  "Naturopathie",
  "Psychomotricité",
  "Thérapies Complémentaires",
  "Kinésithérapie",
  "Ostéopathie",
  "Psychologie",
  "Neuropsychologie",
  "Nutrition",
  "Orthophonie",
  "Naturopathie",
  "Psychomotricité",
  "Thérapies Complémentaires",
];

const servicesRow2 = [
  "Rééducation Fonctionnelle",
  "Bilans Complets",
  "Suivi Personnalisé",
  "Soins à Domicile",
  "Téléconsultation",
  "Ateliers Bien-être",
  "Rééducation Fonctionnelle",
  "Bilans Complets",
  "Suivi Personnalisé",
  "Soins à Domicile",
  "Téléconsultation",
  "Ateliers Bien-être",
];

const servicesRow3 = [
  "Thérapie Manuelle",
  "Suivi Nutritionnel",
  "Accompagnement Psychologique",
  "Rééducation Cognitive",
  "Sophrologie",
  "Hypnose",
  "Thérapie Manuelle",
  "Suivi Nutritionnel",
  "Accompagnement Psychologique",
  "Rééducation Cognitive",
  "Sophrologie",
  "Hypnose",
];

export default function DiseaseMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const pillClass =
    "inline-block mx-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium transition-all duration-300 hover:bg-[rgba(184,138,90,0.12)] hover:border-[#B88A5A]/30 hover:text-white/90 hover:scale-105";

  return (
    <section ref={sectionRef} className="bg-[#0B1220] py-20 overflow-hidden">
      <div ref={headingRef} className="text-center mb-12 px-6">
        <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
          Kinésithérapie &bull; Ostéopathie &bull; Psychologie &bull; Nutrition &bull; Orthophonie
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-3 tracking-tight">
          9 spécialités, un seul centre de soins à Casablanca
        </h2>
        <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto">
          Wenaya Clinic réunit kinésithérapeutes, ostéopathes, psychologues, neuropsychologues, nutritionnistes, orthophonistes, naturopathes et psychomotriciens pour une prise en charge pluridisciplinaire adaptée à chaque patient, enfant comme adulte.
        </p>
      </div>

      <div className="relative">
        <div className="flex whitespace-nowrap animate-marquee mb-4">
          {servicesRow1.map((s, i) => (
            <span key={i} className={pillClass}>{s}</span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-reverse mb-4">
          {servicesRow2.map((s, i) => (
            <span key={i} className={pillClass}>{s}</span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee">
          {servicesRow3.map((s, i) => (
            <span key={i} className={pillClass}>{s}</span>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <a
          href="#"
          className="inline-flex items-center justify-center px-8 h-[50px] bg-[#B88A5A] text-white rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#A07848] hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
        >
          Voir Plus
        </a>
      </div>
    </section>
  );
}
