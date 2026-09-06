import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SpecialistsPageBody from "@/components/specialistes/SpecialistsPage";
import Footer from "@/components/Footer";
import { getAllSpecialistsAsync } from "@/lib/specialistes";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Nos Spécialistes — Wenaya Casablanca",
  description: "Découvrez l'équipe de spécialistes de Wenaya à Casablanca : kinésithérapeutes, ostéopathes, psychologues, nutritionnistes, orthophonistes et plus. Prenez rendez-vous en ligne.",
  keywords: ["spécialistes", "Casablanca", "kinésithérapie", "ostéopathie", "psychologie", "nutrition", "Wenaya", "rendez-vous médecin"],
  alternates: { canonical: `${SITE_URL}/professional`, languages: languageAlternates("/professional") },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Nos Spécialistes — Wenaya Casablanca",
    description: "Découvrez l'équipe de spécialistes de Wenaya à Casablanca. Prenez rendez-vous en ligne.",
    url: `${SITE_URL}/professional`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Nos Spécialistes — Wenaya Casablanca",
    description: "Découvrez l'équipe de spécialistes de Wenaya à Casablanca. Prenez rendez-vous en ligne.",
  },
};

export default async function SpecialistsPage() {
  const specialists = await getAllSpecialistsAsync();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/#clinic`,
    name: "Wenaya Clinic",
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
      url: `${SITE_URL}/professional/${s.slug}`,
    })),
  };

  return (
    <ErrorBoundary>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col min-h-screen">
        <main>
          <SpecialistsPageBody specialists={specialists} />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
