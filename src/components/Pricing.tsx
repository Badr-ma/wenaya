"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Consultation découverte",
    price: "Dès 250 DH",
    description: "Première consultation avec bilan offert",
    features: [
      "Consultation avec le spécialiste de votre choix (kinésithérapie, ostéopathie, psychologie, nutrition)",
      "Bilan initial et évaluation personnalisée offerts",
      "Compte-rendu détaillé et plan de soins recommandé",
      "Accès à l'espace patient en ligne",
    ],
    popular: false,
  },
  {
    name: "Suivi & Forfait",
    price: "Dès 150 DH/séance",
    description: "Forfait 10 séances — le plus populaire",
    features: [
      "Suivi personnalisé avec votre praticien référent",
      "Forfait 10 séances — économisez 20%",
      "Coordination pluridisciplinaire entre spécialistes Wenaya",
      "Bilan d'étape intermédiaire gratuit",
      "Priorité de réservation et créneaux dédiés",
    ],
    popular: true,
  },
  {
    name: "Parcours Bien-être",
    price: "Sur devis",
    description: "Prise en charge globale sur mesure",
    features: [
      "Bilan complet santé physique, mentale et cognitive",
      "Suivi coordonné par 3 spécialistes (kiné, psy, nutrition)",
      "Programme personnalisé sur 3 mois avec objectifs mesurables",
      "Accès aux ateliers bien-être et cours collectifs",
      "Téléconsultation de suivi incluse",
    ],
    popular: false,
  },
];

export default function Pricing() {
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
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAF8F4] noise accent-top relative py-24 sm:py-32 px-6" id="tarifs">
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            Tarifs
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B1220] mt-4 tracking-tight">
            Des soins accessibles à tous
          </h2>
          <p className="text-[#6B6B6B] text-sm sm:text-base mt-4 max-w-lg mx-auto">
            Éligible aux mutuelles et assurances santé. Payable en plusieurs
            fois sans frais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`relative rounded-2xl p-8 border-2 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "bg-white border-[#B88A5A] shadow-xl shadow-[rgba(184,138,90,0.12)] hover:shadow-2xl hover:shadow-[rgba(184,138,90,0.18)]"
                  : "bg-white/80 border-[rgba(184,138,90,0.08)] shadow-sm hover:shadow-md hover:border-[rgba(184,138,90,0.2)] hover:-translate-y-0.5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#B88A5A] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Recommandé
                </div>
              )}
              <h3 className="text-xl font-serif font-bold text-[#0B1220]">
                {plan.name}
              </h3>
              <div className="mt-3 mb-1">
                <span className="text-4xl font-serif font-bold text-[#0B1220]">
                  {plan.price}
                </span>
              </div>
              <p className="text-sm text-[#6B6B6B] mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="text-sm text-[#6B6B6B] flex items-start gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 text-[#B88A5A] mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`block text-center text-sm font-semibold py-3.5 rounded-full transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#B88A5A] hover:bg-[#A07848] text-white hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
                    : "bg-[#0B1220] hover:bg-[#2F2F2F] text-white"
                }`}
              >
                Prendre RDV
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
