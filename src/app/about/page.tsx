import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AboutHero from "@/components/AboutHero";
import WhyWeExist from "@/components/WhyWeExist";
import WenayaApproach from "@/components/WenayaApproach";
import ExpertiseSection from "@/components/ExpertiseSection";
import FutureVision from "@/components/FutureVision";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "À Propos — Wenaya, Première Plateforme de Santé Intégrée au Maroc",
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
  alternates: { canonical: "https://www.wenaya.com/about" },
  openGraph: {
    title: "À Propos — Wenaya, Première Plateforme de Santé Intégrée au Maroc",
    description:
      "Wenaya is Morocco's first integrated health and wellbeing platform — combining physiotherapy, clinical psychology, nutrition, prevention, corporate wellness, and Yolo AI under one coordinated ecosystem.",
    url: "https://www.wenaya.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col">
        <AboutHero />
        <WhyWeExist />
        <WenayaApproach />
        <ExpertiseSection />
        <FutureVision />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
