/**
 * About Page — server component assembling all about page sections.
 * Sections: Hero, Why We Exist, Wenaya Approach, Expertise, Future Vision,
 * Clinics overview (Hero + Programs), and Footer.
 * Includes MedicalBusiness/Service structured data for SEO.
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

export const metadata: Metadata = {
    title: "Cliniques — Wenaya, Première Plateforme de Santé Intégrée au Maroc",
  description:
    "Découvrez Wenaya : la première plateforme de santé intégrée au Maroc, fondée à Casablanca. Kinésithérapie, psychologie clinique, nutrition et bien-être corporate — coordonnés sous un seul écosystème.",
  keywords: [
    "Wenaya Casablanca",
    "plateforme santé Maroc",
    "clinique multidisciplinaire Casablanca",
    "santé intégrée Maroc",
    "équipe médicale Casablanca",
    "prévention santé Maroc",
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Cliniques — Wenaya, Première Plateforme de Santé Intégrée au Maroc",
    description:
      "Wenaya is Morocco's first integrated health and wellbeing platform — combining physiotherapy, clinical psychology, nutrition, prevention, and corporate wellness under one coordinated ecosystem.",
    url: `${SITE_URL}/about`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Cliniques — Wenaya, Première Plateforme de Santé Intégrée au Maroc",
    description:
      "Wenaya is Morocco's first integrated health and wellbeing platform — combining physiotherapy, clinical psychology, nutrition, prevention, and corporate wellness under one coordinated ecosystem.",
  },
};

export default function AboutPage() {
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
