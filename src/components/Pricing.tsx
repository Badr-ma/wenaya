"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const plans = [
  {
    name: "Bilan de prévention",
    price: "Sur devis",
    description: "60 min avec un gestionnaire de cas Wenaya",
    features: [
      "Anamnèse complète et historique santé",
      "Bilan postural et évaluation fonctionnelle",
      "Étude de cas pluridisciplinaire",
      "Recommandations personnalisées et prise en charge",
    ],
    popular: true,
  },
  {
    name: "Consultation spécialiste",
    price: "Sur devis",
    description: "Kinésithérapie, ostéopathie, psychologie, nutrition",
    features: [
      "Consultation avec le spécialiste de votre choix",
      "Bilan initial et évaluation personnalisée",
      "Compte-rendu détaillé et plan de soins",
      "Accès à l'espace patient en ligne",
    ],
    popular: false,
  },
  {
    name: "Parcours Bien-être",
    price: "Sur devis",
    description: "Prise en charge globale coordonnée",
    features: [
      "Suivi coordonné par plusieurs spécialistes",
      "Programme personnalisé avec objectifs mesurables",
      "Accès aux ateliers et cours collectifs",
      "Téléconsultation de suivi incluse",
    ],
    popular: false,
  },
];

export default function Pricing(): React.JSX.Element {
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
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-16 sm:py-20 px-6" id="tarifs">
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            Prévenir. Performer. Durer.
          </span>
          <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-4">
            Des soins accessibles à tous
          </h2>
          <p className="text-[#2B2F36] text-sm sm:text-base mt-4 max-w-lg mx-auto">
            Éligible aux mutuelles et assurances santé.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-6 xl:gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`relative rounded-2xl p-8 border-2 flex flex-col transition-all duration-300 flex-1 ${
                plan.popular
                  ? "bg-white border-[#B88A5A] shadow-xl shadow-[rgba(184,138,90,0.10)] hover:shadow-2xl hover:shadow-[rgba(184,138,90,0.16)]"
                  : "bg-white border-[#0B1220]/[0.06] shadow-sm hover:shadow-md hover:border-[#B88A5A]/30 hover:-translate-y-0.5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#B88A5A] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Recommandé
                </div>
              )}
              <h3 className="text-xl font-heading font-bold text-[#0B1220]">
                {plan.name}
              </h3>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-heading font-bold text-[#0B1220]">
                  {plan.price}
                </span>
              </div>
              <p className="text-sm text-[#2B2F36] mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="text-sm text-[#2B2F36] flex items-start gap-2.5"
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
                onClick={(e) => e.preventDefault()}
                className={`block text-center text-sm font-semibold py-3.5 rounded-full transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#B88A5A] hover:bg-[#A07848] text-white hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
                    : "bg-[#0B1220] hover:bg-[#2B2F36] text-white"
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
