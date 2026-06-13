"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import HiggsField from "./HiggsField";

interface FaqItem {
  q: string;
  a: string;
}

const faqData: FaqItem[] = [
  {
    q: "Quels types de soins sont proposés à la clinique ?",
    a: "Wenaya Clinic regroupe 9 spécialités sous un même toit : kinésithérapie (TECAR, thérapie manuelle, rééducation post-opératoire), ostéopathie, psychologie clinique, nutrition fonctionnelle, préparation physique, rééducation post-AVC, remédiation cognitive (TDAH, dyslexie), bilans de prévention personnalisés et programmes bien-être entreprise. Chaque parcours est coordonné par une équipe de 15 professionnels de santé.",
  },
  {
    q: "Comment les données collectées sont-elles protégées ?",
    a: "Toutes les données médicales et personnelles sont stockées sur des serveurs sécurisés conformes au RGPD et à la loi marocaine 09-08. Nous utilisons un chiffrement de bout en bout, des protocoles d'accès strictement contrôlés et des audits réguliers. Wenaya ne partage jamais vos données sans votre consentement explicite.",
  },
  {
    q: "Dois-je avoir une ordonnance pour consulter ?",
    a: "Pour la kinésithérapie, une prescription médicale est recommandée pour le remboursement CNSS ou assurance. Pour l'ostéopathie, la psychologie et la nutrition fonctionnelle, aucune ordonnance n'est nécessaire. Notre équipe d'accueil vous conseille sur la meilleure démarche selon votre situation et votre mutuelle.",
  },
  {
    q: "Quels sont les délais pour obtenir un rendez-vous ?",
    a: "Les délais varient selon la spécialité : 24 à 48 heures pour la kinésithérapie et l'ostéopathie, 48 à 72 heures pour un premier bilan nutritionnel, environ 1 semaine pour la psychologie. Les urgences et douleurs aiguës sont prises en charge sous 24 heures. Réservez en ligne, par téléphone au 0666-124035 ou sur place au 88 Rue De Jabal Azourki, Casablanca 20930.",
  },
  {
    q: "Est-ce que les consultations sont remboursées ?",
    a: "Les séances de kinésithérapie sur prescription médicale sont remboursées par la CNSS et la plupart des assurances complémentaires. L'ostéopathie et la psychologie peuvent être couvertes selon votre mutuelle (consultez votre contrat). Nous fournissons toutes les factures et feuilles de soins nécessaires à vos remboursements.",
  },
  {
    q: "Proposez-vous des consultations en ligne ?",
    a: "Oui, nous proposons des téléconsultations en psychologie clinique et nutrition fonctionnelle. Ces sessions permettent un suivi régulier sans déplacement, idéal pour les patients à mobilité réduite, les employés en télétravail ou les collaborateurs d'entreprises partenaires en région. Les séances se font via une plateforme sécurisée.",
  },
  {
    q: "Comment se déroule une première consultation ?",
    a: "La première consultation commence par un bilan complet : anamnèse, évaluation fonctionnelle et définition de vos objectifs. Pour la kinésithérapie, cela inclut un test de mobilité et de force. En ostéopathie, un bilan postural global. En nutrition, une analyse des habitudes alimentaires. Durée : 45 à 60 minutes selon la spécialité.",
  },
  {
    q: "Quels résultats puis-je attendre des soins, et en combien de temps ?",
    a: "En kinésithérapie, une amélioration notable est souvent ressentie dès 3 à 4 séances. En ostéopathie, les effets sont généralement immédiats mais consolidés sur 2 à 3 semaines. En psychologie, les premiers progrès apparaissent après 4 à 6 séances. Chaque plan de traitement est personnalisé et réévalué régulièrement.",
  },
  {
    q: "Comment garantir l'adhésion des collaborateurs en entreprise ?",
    a: "Nous proposons un accompagnement sur mesure avec un diagnostic personnalisé, des ateliers interactifs en présentiel ou visio, des challenges d'équipe, et un suivi continu via l'application Wenaya. Les programmes sont coconstruits avec les RH pour maximiser l'engagement : ateliers gestion du stress, nutrition, sommeil, et préparation physique.",
  },
  {
    q: "Comment s'articule l'intervention avec mon SIRH existant ?",
    a: "Wenaya s'intègre facilement à votre SIRH via des API sécurisées ou des exports CSV. Nous travaillons avec votre équipe IT pour une mise en place fluide, sans disruption de vos outils existants. Un tableau de bord RH permet de suivre les indicateurs clés : taux d'engagement, absentéisme, satisfaction collaborateurs.",
  },
  {
    q: "Pouvez-vous intervenir hors Casablanca ?",
    a: "Oui, nous intervenons dans tout le Maroc. Nos programmes entreprise sont conçus pour être déployés en hybride : sessions en visioconférence pour le suivi individuel et ateliers présentiels organisés selon vos implantations géographiques. Pour les soins cliniques, le rendez-vous s'effectue à notre centre de Casablanca.",
  },
  {
    q: "Quelle est la flexibilité si nos besoins évoluent ?",
    a: "Nos programmes entreprise sont totalement modulables : ajustez le nombre de collaborateurs engagés, ajoutez des modules (santé mentale, nutrition, préparation physique, prévention des TMS) ou modifiez la fréquence des sessions à tout moment, sans pénalité. Un bilan trimestriel permet de réorienter le programme selon vos priorités.",
  },
  {
    q: "Quelles sont les modalités de facturation pour les entreprises ?",
    a: "Nous proposons un abonnement mensuel basé sur le nombre de collaborateurs engagés, avec des paliers dégressifs. Un audit initial gratuit permet de définir le programme adapté à votre structure avant toute souscription. Facturation mensuelle ou trimestrielle, avec reporting détaillé pour la direction financière.",
  },
  {
    q: "Où se situe Wenaya Clinic et quels sont les horaires ?",
    a: "Wenaya Clinic est située au 88 Rue De Jabal Azourki, Casablanca 20930. Ouvert du lundi au vendredi de 8h à 19h et le samedi de 9h à 14h. Un parking est disponible à proximité. Contact : 0666-124035 ou via WhatsApp au même numéro.",
  },
];

export default function FaqSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl
        .fromTo(headingRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      if (listRef.current) {
        const items = listRef.current.querySelectorAll(".faq-item");
        gsap.fromTo(items, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, scrollTrigger: { trigger: listRef.current, start: "top 80%" } });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const toggle = (i: number): void => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#F2EFE9]">
      <HiggsField />

      <div className="relative z-10 pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 ref={headingRef} className="text-[clamp(2.5rem,6vw,4.5rem)] font-heading font-bold text-[#0B1220] tracking-[-0.04em] leading-[1.1]">
            Foire Aux Questions
          </h1>
          <p ref={subRef} className="mt-4 sm:mt-5 text-[clamp(0.95rem,2vw,1.15rem)] text-[#0B1220]/60 leading-relaxed max-w-xl mx-auto">
            Tout ce que vous devez savoir sur Wenaya Clinic, nos soins, nos programmes bien-être et nos services aux entreprises.
          </p>
        </div>

        <div ref={listRef} className="max-w-2xl mx-auto mt-14 space-y-3">
          {faqData.map((item, i) => (
            <div key={i} className="faq-item">
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6 rounded-xl bg-white border border-[#0B1220]/[0.06] hover:border-[#B88A5A]/30 transition-all duration-300 group"
              >
                <span className="text-[#0B1220] font-heading font-semibold text-[clamp(0.9rem,1.5vw,1rem)] leading-snug">
                  {item.q}
                </span>
                <svg
                  className={`w-4 h-4 shrink-0 text-[#B88A5A] transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 text-[#0B1220]/70 text-sm sm:text-base leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
