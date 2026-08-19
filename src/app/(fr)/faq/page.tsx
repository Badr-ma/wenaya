/**
 * FAQ Page — frequently asked questions with JSON-LD FAQPage schema.
 * Renders the FaqSection component with GSAP-powered accordion.
 * Includes breadcrumbs and SEO metadata with keywords.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqSection from "@/components/faq/FaqSection";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "FAQ — Questions Fréquentes sur Wenaya",
  description:
    "Tout savoir sur Wenaya : kinésithérapie, psychologie, nutrition et bien-être corporate à Casablanca, Maroc.",
  keywords: [
    "FAQ Wenaya Casablanca",
    "questions fréquentes kinésithérapie",
    "consultation psychologue Maroc",
    "tarifs clinique Casablanca",
    "rendez-vous nutrition Maroc",
  ],
  alternates: {
    canonical: `${SITE_URL}/faq`,
    languages: languageAlternates("/faq"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "FAQ — Questions Fréquentes sur Wenaya",
    description:
      "Answers to the most common questions about Wenaya's integrated health platform and corporate wellness programs in Morocco.",
    url: `${SITE_URL}/faq`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "FAQ — Questions Fréquentes sur Wenaya",
    description:
      "Answers to the most common questions about Wenaya's integrated health platform and corporate wellness programs in Morocco.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quels types de soins sont proposés à la clinique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wenaya Clinic propose une large gamme de soins pluridisciplinaires : kinésithérapie, ostéopathie, psychologie clinique, neuropsychologie, nutrition, orthophonie, naturopathie, psychomotricité et thérapies complémentaires.",
      },
    },
    {
      "@type": "Question",
      name: "Comment les données collectées sont-elles protégées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wenaya respecte strictement les réglementations en vigueur (RGPD, loi 09-08 marocaine). Toutes les données de santé sont chiffrées, stockées sur des serveurs sécurisés au Maroc et accessibles uniquement aux praticiens autorisés.",
      },
    },
    {
      "@type": "Question",
      name: "Dois-je avoir une ordonnance pour consulter ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, une ordonnance n'est pas obligatoire pour consulter nos spécialistes. Cependant, pour certaines prises en charge spécifiques ou pour un remboursement par votre mutuelle, une ordonnance médicale peut être requise.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les délais pour obtenir un rendez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les délais varient selon la spécialité et l'urgence. En moyenne, un rendez-vous est disponible sous 24 à 72 heures pour une première consultation.",
      },
    },
    {
      "@type": "Question",
      name: "Est-ce que les consultations sont remboursées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De nombreuses mutuelles et assurances santé prennent en charge tout ou partie de nos consultations. Wenaya vous fournit toutes les pièces justificatives nécessaires pour faciliter votre remboursement.",
      },
    },
    {
      "@type": "Question",
      name: "Proposez-vous des consultations en ligne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, Wenaya propose des téléconsultations en psychologie, nutrition et suivi bien-être. Ces consultations se déroulent sur une plateforme sécurisée.",
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ErrorBoundary>
        <main>
          <Breadcrumbs />
          <div className="flex flex-col min-h-screen">
            <FaqSection />
          </div>
        </main>
        <div data-section-bg="dark"><Footer /></div>
      </ErrorBoundary>
    </>
  );
}
