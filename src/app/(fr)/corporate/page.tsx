import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import EntreprisesHero from "@/components/entreprises/Hero";
import TrustBandSection from "@/components/entreprises/TrustBandSection";
import ProblemSection from "@/components/entreprises/ProblemSection";
import AdaptableApproachSection from "@/components/entreprises/AdaptableApproachSection";
import LevelsSection from "@/components/entreprises/LevelsSection";
import PacksSection from "@/components/entreprises/PacksSection";
import SecuritySection from "@/components/entreprises/SecuritySection";
import HowItWorksSection from "@/components/entreprises/HowItWorksSection";
import RoiSection from "@/components/entreprises/RoiSection";
import TestimonialsSection from "@/components/entreprises/TestimonialsSection";
import ProgrammesSection from "@/components/entreprises/ProgrammesSection";
import ResourcesFaqSection from "@/components/entreprises/ResourcesFaqSection";
import RetreatSection from "@/components/entreprises/RetreatSection";
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
          <TrustBandSection />
          <ProblemSection />
          <AdaptableApproachSection />
          <LevelsSection />
          <PacksSection />
          <ProgrammesSection />
          <SecuritySection />
          <HowItWorksSection />
          <RoiSection />
          <TestimonialsSection />
          <ResourcesFaqSection />
          <RetreatSection />
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