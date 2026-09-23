/**
 * English Corporate Page — assembles the same sections as the French page.
 * All section components are i18n-driven (en.ts) and shared with the French route.
 */
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
  title: "Corporate Wellness — Health & Prevention Programs | Wenaya",
  description:
    "Wenaya designs evidence-based corporate wellness programs in Morocco: mental health, physiotherapy, nutrition, prevention — on-site or remote. Measurable, tailored, certified.",
  keywords: [
    "corporate wellness Morocco",
    "workplace health program Casablanca",
    "employee mental health Morocco",
    "corporate health prevention",
    "workplace physiotherapy",
    "workplace nutrition",
    "employee wellbeing program Casablanca",
    "burnout prevention Morocco",
  ],
  alternates: {
    canonical: `${SITE_URL}/en/corporate`,
    languages: languageAlternates("/corporate"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Corporate Wellness — Health & Prevention Programs | Wenaya",
    description:
      "Wenaya designs evidence-based corporate wellness programs for Moroccan and international organizations. Mental health, physiotherapy, nutrition, prevention — measurable and tailored to your workforce.",
    url: `${SITE_URL}/en/corporate`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Corporate Wellness — Health & Prevention Programs | Wenaya",
    description:
      "Wenaya designs evidence-based corporate wellness programs for Moroccan and international organizations. Mental health, physiotherapy, nutrition, prevention — measurable and tailored to your workforce.",
  },
};

export default function EnglishEntreprisesPage() {
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