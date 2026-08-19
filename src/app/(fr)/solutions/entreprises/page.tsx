import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import EntreprisesHero from "@/components/entreprises/Hero";
import HowItWorksSection from "@/components/entreprises/HowItWorksSection";
import ModularitySection from "@/components/entreprises/ModularitySection";
import ProgrammesSection from "@/components/entreprises/ProgrammesSection";
import ThematiquesSection from "@/components/entreprises/ThematiquesSection";
import ImageBreak from "@/components/entreprises/ImageBreak";
import StatsTestimonialsSection from "@/components/entreprises/StatsTestimonialsSection";
import DownloadsSection from "@/components/entreprises/DownloadsSection";
import FaqSection from "@/components/entreprises/FaqSection";
import ContactSection from "@/components/entreprises/ContactSection";
import StickyCta from "@/components/entreprises/StickyCta";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

const EntreprisesCta = dynamic(() => import("@/components/entreprises/Cta"), { ssr: true });
const EntreprisesFooter = dynamic(() => import("@/components/entreprises/Footer"), { ssr: true });

export const metadata: Metadata = {
  title: "Bien-être en Entreprise — Programmes Santé & Prévention | Wenaya",
  description:
    "Wenaya conçoit des programmes de bien-être en entreprise au Maroc : santé mentale, kinésithérapie, nutrition, prévention — sur site ou à distance. Mesurable, personnalisé, certifié.",
  keywords: [
    "bien-être entreprise Maroc",
    "programme santé entreprise Casablanca",
    "santé mentale employés Maroc",
    "prévention santé corporate",
    "kinésithérapie entreprise",
    "nutrition entreprise",
    "corporate wellness Morocco",
    "employee wellbeing program Casablanca",
    "burnout prevention Maroc",
  ],
  alternates: {
    canonical: `${SITE_URL}/solutions/entreprises`,
    languages: languageAlternates("/solutions/entreprises"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Bien-être en Entreprise — Programmes Santé & Prévention | Wenaya",
    description:
      "Wenaya designs evidence-based corporate wellness programs for Moroccan and international organizations. Mental health, physiotherapy, nutrition, prevention — measurable and tailored to your workforce.",
    url: `${SITE_URL}/solutions/entreprises`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Bien-être en Entreprise — Programmes Santé & Prévention | Wenaya",
    description:
      "Wenaya designs evidence-based corporate wellness programs for Moroccan and international organizations. Mental health, physiotherapy, nutrition, prevention — measurable and tailored to your workforce.",
  },
};

export default function EntreprisesPage() {
  return (
    <ErrorBoundary>
      <Breadcrumbs />
      <div className="flex flex-col min-h-dvh">
        <main>
          <EntreprisesHero />
          <StatsTestimonialsSection />
          <ModularitySection />
          <ProgrammesSection />
          <HowItWorksSection />
          <ThematiquesSection />
          <ImageBreak />
          <DownloadsSection />
          <FaqSection />
          <ContactSection />
          <EntreprisesCta />
        </main>
        <div className="mt-auto">
          <EntreprisesFooter />
        </div>
        <StickyCta />
      </div>
    </ErrorBoundary>
  );
}
