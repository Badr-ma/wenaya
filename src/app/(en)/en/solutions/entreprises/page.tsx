/**
 * English Corporate Solutions Page — assembles the same sections as the French page.
 * All section components are i18n-driven (en.ts) and shared with the French route.
 */
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
    canonical: `${SITE_URL}/en/solutions/entreprises`,
    languages: languageAlternates("/solutions/entreprises"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Corporate Wellness — Health & Prevention Programs | Wenaya",
    description:
      "Wenaya designs evidence-based corporate wellness programs for Moroccan and international organizations. Mental health, physiotherapy, nutrition, prevention — measurable and tailored to your workforce.",
    url: `${SITE_URL}/en/solutions/entreprises`,
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
