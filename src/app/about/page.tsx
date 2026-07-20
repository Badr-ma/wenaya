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
    canonical: "https://www.wenaya.com/about",
    languages: {
      "fr-MA": "https://www.wenaya.com/about",
      "en": "https://www.wenaya.com/about",
    },
  },
  openGraph: {
  title: "Cliniques — Wenaya, Première Plateforme de Santé Intégrée au Maroc",
    description:
      "Wenaya is Morocco's first integrated health and wellbeing platform — combining physiotherapy, clinical psychology, nutrition, prevention, and corporate wellness under one coordinated ecosystem.",
    url: "https://www.wenaya.com/about",
    type: "website",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Wenaya Clinic",
  url: "https://www.wenaya.com/about",
  medicalSpecialty: [
    { "@type": "MedicalSpecialty", name: "Kinésithérapie" },
    { "@type": "MedicalSpecialty", name: "Ostéopathie" },
    { "@type": "MedicalSpecialty", name: "Psychologie Clinique" },
    { "@type": "MedicalSpecialty", name: "Neuropsychologie" },
    { "@type": "MedicalSpecialty", name: "Nutrition" },
    { "@type": "MedicalSpecialty", name: "Orthophonie" },
    { "@type": "MedicalSpecialty", name: "Naturopathie" },
    { "@type": "MedicalSpecialty", name: "Psychomotricité" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ErrorBoundary>
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
        <Footer />
      </div>
      </ErrorBoundary>
    </>
  );
}
