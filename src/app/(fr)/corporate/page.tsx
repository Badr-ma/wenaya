import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import EntreprisesHero from "@/components/entreprises/Hero";
import TrustLogosSection from "@/components/entreprises/TrustLogosSection";
import StatsTestimonialsSection from "@/components/entreprises/StatsTestimonialsSection";
import LevelsSection from "@/components/entreprises/LevelsSection";
import ModularitySection from "@/components/entreprises/ModularitySection";
import ProgrammesSection from "@/components/entreprises/ProgrammesSection";
import RetreatSection from "@/components/entreprises/RetreatSection";
import PacksSection from "@/components/entreprises/PacksSection";
import HowItWorksSection from "@/components/entreprises/HowItWorksSection";
import ThematiquesSection from "@/components/entreprises/ThematiquesSection";
import ImageBreak from "@/components/entreprises/ImageBreak";
import ResourcesFaqSection from "@/components/entreprises/ResourcesFaqSection";
import ContactSection from "@/components/entreprises/ContactSection";
import StickyCta from "@/components/entreprises/StickyCta";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

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
    canonical: `${SITE_URL}/corporate`,
    languages: languageAlternates("/corporate"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Bien-être en Entreprise — Programmes Santé & Prévention | Wenaya",
    description:
      "Wenaya conçoit des programmes de bien-être en entreprise fondés sur des données probantes, pour organisations marocaines et internationales. Santé mentale, kinésithérapie, nutrition, prévention — mesurables et adaptés à vos équipes.",
    url: `${SITE_URL}/corporate`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Bien-être en Entreprise — Programmes Santé & Prévention | Wenaya",
    description:
      "Wenaya conçoit des programmes de bien-être en entreprise fondés sur des données probantes, pour organisations marocaines et internationales. Santé mentale, kinésithérapie, nutrition, prévention — mesurables et adaptés à vos équipes.",
  },
};

export default function EntreprisesPage() {
  return (
    <ErrorBoundary>
      <Breadcrumbs />
      <div className="corp-typeset flex flex-col min-h-dvh">
        <main>
          <EntreprisesHero />
          <TrustLogosSection />
          <StatsTestimonialsSection />
          <LevelsSection />
          <ModularitySection />
          <ProgrammesSection />
          <RetreatSection />
          <PacksSection />
          <HowItWorksSection />
          <ThematiquesSection />
          <ImageBreak />
          <ResourcesFaqSection />
          <ContactSection />
        </main>
        <div className="mt-auto">
          <EntreprisesFooter />
        </div>
        <StickyCta />
      </div>
    </ErrorBoundary>
  );
}