import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import EntreprisesHero from "@/components/entreprises/Hero";
import EntreprisesPrograms from "@/components/entreprises/Programs";
import EntreprisesApproach from "@/components/entreprises/Approach";
import EntreprisesCta from "@/components/entreprises/Cta";
import EntreprisesFooter from "@/components/entreprises/Footer";

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
  alternates: { canonical: "https://www.wenaya.com/solutions/entreprises" },
  openGraph: {
    title: "Bien-être en Entreprise — Programmes Santé & Prévention | Wenaya",
    description:
      "Wenaya designs evidence-based corporate wellness programs for Moroccan and international organizations. Mental health, physiotherapy, nutrition, prevention — measurable and tailored to your workforce.",
    url: "https://www.wenaya.com/solutions/entreprises",
    type: "website",
  },
};

export default function EntreprisesPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col">
        <div data-section-bg="dark"><EntreprisesHero /></div>
        <div data-section-bg="light"><EntreprisesApproach /></div>
        <div data-section-bg="light"><EntreprisesPrograms /></div>
        <div data-section-bg="dark"><EntreprisesCta /></div>
        <div data-section-bg="dark"><EntreprisesFooter /></div>
      </div>
    </ErrorBoundary>
  );
}
