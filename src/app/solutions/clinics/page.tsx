import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ClinicsHero from "@/components/clinics/Hero";
import ClinicsPrograms from "@/components/clinics/Programs";
import ClinicsWhy from "@/components/clinics/Why";
import ClinicsCta from "@/components/clinics/Cta";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cliniques — Solutions Santé Intégrée pour Établissements | Wenaya",
  description:
    "Wenaya propose une plateforme de santé intégrée pour cliniques au Maroc : outils de prévention, suivi patient, programmes bien-être et orchestration pluridisciplinaire.",
  keywords: [
    "solution clinique Maroc",
    "plateforme santé établissement",
    "outil prévention clinique",
    "suivi patient Maroc",
    "programme bien-être clinique",
    "santé intégrée clinique",
    "partenariat santé Casablanca",
  ],
  alternates: { canonical: "https://www.wenaya.com/solutions/clinics" },
  openGraph: {
    title: "Cliniques — Solutions Santé Intégrée pour Établissements | Wenaya",
    description:
      "Wenaya provides an integrated health platform for clinics across Morocco — prevention tools, patient tracking, wellness programs, and multidisciplinary orchestration.",
    url: "https://www.wenaya.com/solutions/clinics",
    type: "website",
  },
};

export default function ClinicsPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col">
        <div data-section-bg="dark"><ClinicsHero /></div>
        <div data-section-bg="light"><ClinicsPrograms /></div>
        <div data-section-bg="light"><ClinicsWhy /></div>
        <div data-section-bg="dark"><ClinicsCta /></div>
        <div data-section-bg="dark"><Footer /></div>
      </div>
    </ErrorBoundary>
  );
}
