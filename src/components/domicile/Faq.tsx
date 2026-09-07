/**
 * Homecare FAQ — "FAQ – Soins à domicile & garde malade à Casablanca"
 * Client component. Exact 5 Q/A pairs. Single-open accordion, calm editorial
 * styling. No cards, no numbering. Keyboard + aria accessible.
 */
"use client";

import { useState } from "react";
import HomecareSectionHeading from "./HomecareSectionHeading";

const faqs: { q: string; a: string }[] = [
  {
    q: "Quels sont les bénéfices concrets d'une prise en charge Wenaya ?",
    a: "Amélioration de la stabilité médicale, réduction des complications et organisation claire du plan de soins.",
  },
  {
    q: "Proposez-vous des kinésithérapeutes et orthophonistes à domicile ?",
    a: "Oui, selon les besoins identifiés lors de la visite d'évaluation.",
  },
  {
    q: "Comment l'infirmier est-il choisi ?",
    a: "Après une visite d'évaluation par notre chef d'équipe infirmier.",
  },
  {
    q: "La prise en charge peut-elle évoluer ?",
    a: "Oui, les équipes et la fréquence des visites sont ajustées selon l'évolution du patient.",
  },
  {
    q: "Existe-t-il un support d'urgence ?",
    a: "Nous assurons un support 24h/24 avec possibilité de mobilisation des professionnels adaptés.",
  },
];

export default function HomecareFaq(): React.JSX.Element {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <HomecareSectionHeading eyebrow="Questions fréquentes" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.9rem)" }}>
              FAQ – Soins à domicile &amp; garde malade à Casablanca
            </HomecareSectionHeading>
          </div>
          <div className="lg:col-span-7 border-t border-[#0B1220]/10">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const qId = `homecare-faq-q-${i}`;
              const aId = `homecare-faq-a-${i}`;
              return (
                <div key={f.q} className="border-b border-[#0B1220]/10">
                  <h3 className="m-0">
                    <button
                      type="button"
                      id={qId}
                      aria-expanded={isOpen}
                      aria-controls={aId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70"
                    >
                      <span
                        className="heading-serif text-[#0B1220] leading-snug transition-colors group-hover:text-[#B88A5A]"
                        style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)" }}
                      >
                        {f.q}
                      </span>
                      <svg
                        aria-hidden="true"
                        className={`w-5 h-5 shrink-0 text-[#B88A5A] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={aId}
                    role="region"
                    aria-labelledby={qId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-8 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
