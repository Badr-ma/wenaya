/**
 * English About Page — assembles the same about sections as the French page.
 * Sections: Hero, Why We Exist, Wenaya Approach, Expertise, Future Vision,
 * Clinics overview (Hero + Programs), and Footer.
 * Includes MedicalBusiness/Service structured data via shared components.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import AboutHero from "@/components/about/Hero";
import WhyWeExist from "@/components/about/WhyWeExist";
import WenayaApproach from "@/components/about/WenayaApproach";
import ExpertiseSection from "@/components/about/ExpertiseSection";
import FutureVision from "@/components/about/FutureVision";
import ClinicsHero from "@/components/clinics/Hero";
import ClinicsPrograms from "@/components/clinics/Programs";
import ClinicsWhy from "@/components/clinics/Why";
import ClinicsCta from "@/components/clinics/Cta";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
    title: "Clinics — Wenaya, Morocco's First Integrated Health Platform",
  description:
    "Discover Wenaya: Morocco's first integrated health platform, founded in Casablanca. Physiotherapy, clinical psychology, nutrition and corporate wellness — coordinated within a single ecosystem.",
  keywords: [
    "Wenaya Casablanca",
    "health platform Morocco",
    "multidisciplinary clinic Casablanca",
    "integrated health Morocco",
    "medical team Casablanca",
    "health prevention Morocco",
  ],
  alternates: {
    canonical: `${SITE_URL}/en/about`,
    languages: languageAlternates("/about"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Clinics — Wenaya, Morocco's First Integrated Health Platform",
    description:
      "Wenaya is Morocco's first integrated health and wellbeing platform — combining physiotherapy, clinical psychology, nutrition, prevention, and corporate wellness under one coordinated ecosystem.",
    url: `${SITE_URL}/en/about`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Clinics — Wenaya, Morocco's First Integrated Health Platform",
    description:
      "Wenaya is Morocco's first integrated health and wellbeing platform — combining physiotherapy, clinical psychology, nutrition, prevention, and corporate wellness under one coordinated ecosystem.",
  },
};

export default function EnglishAboutPage() {
  return (
    <>
      <ErrorBoundary>
        <main>
        <Breadcrumbs />
        <div className="flex flex-col">
        <AboutHero />
        <WhyWeExist />
        <WenayaApproach />
        <ExpertiseSection />
        <FutureVision />
        <div data-section-bg="dark"><ClinicsHero /></div>
        <div data-section-bg="light"><ClinicsPrograms /></div>
        <div data-section-bg="light"><ClinicsWhy /></div>
        <div data-section-bg="dark"><ClinicsCta /></div>
      </div>
      </main>
      <Footer />
      </ErrorBoundary>
    </>
  );
}
