import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SpecialistsList from "@/components/specialistes/SpecialistsList";
import Footer from "@/components/Footer";
import { getAllSpecialists } from "@/lib/specialistes";

export const metadata: Metadata = {
  title: "Nos Spécialistes — Wenaya Casablanca",
  description: "Découvrez l'équipe de spécialistes de Wenaya à Casablanca : kinésithérapeutes, ostéopathes, psychologues, nutritionnistes, orthophonistes et plus. Prenez rendez-vous en ligne.",
  keywords: ["spécialistes", "Casablanca", "kinésithérapie", "ostéopathie", "psychologie", "nutrition", "Wenaya", "rendez-vous médecin"],
  alternates: { canonical: "https://www.wenaya.com/specialistes" },
  openGraph: {
    title: "Nos Spécialistes — Wenaya Casablanca",
    description: "Découvrez l'équipe de spécialistes de Wenaya à Casablanca. Prenez rendez-vous en ligne.",
    url: "https://www.wenaya.com/specialistes",
    type: "website",
  },
};

export default function SpecialistsPage() {
  const specialists = getAllSpecialists();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Wenaya Clinic",
    url: "https://www.wenaya.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Casablanca",
      addressCountry: "MA",
    },
    medicalSpecialty: [...new Set(specialists.map((s) => s.specialty))],
    employee: specialists.map((s) => ({
      "@type": "Physician",
      name: s.name,
      jobTitle: s.role,
      medicalSpecialty: s.specialty,
      url: `https://www.wenaya.com/specialistes/${s.slug}`,
    })),
  };

  return (
    <ErrorBoundary>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col min-h-screen">
        <SpecialistsList specialists={specialists} />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
