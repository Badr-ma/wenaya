import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SpecialistsPageBody from "@/components/specialistes/SpecialistsPage";
import Footer from "@/components/Footer";
import { getAllSpecialistsAsync } from "@/lib/specialistes";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Our Specialists — Wenaya Casablanca",
  description:
    "Meet the Wenaya specialist team in Casablanca: physiotherapists, osteopaths, psychologists, nutritionists, speech therapists and more. Book an appointment online.",
  keywords: ["specialists", "Casablanca", "physiotherapy", "osteopathy", "psychology", "nutrition", "Wenaya", "medical appointment"],
  alternates: { canonical: `${SITE_URL}/en/specialistes`, languages: languageAlternates("/specialistes") },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Our Specialists — Wenaya Casablanca",
    description:
      "Meet the Wenaya specialist team in Casablanca. Book an appointment online.",
    url: `${SITE_URL}/en/specialistes`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Our Specialists — Wenaya Casablanca",
    description:
      "Meet the Wenaya specialist team in Casablanca. Book an appointment online.",
  },
};

export default async function EnglishSpecialistsPage() {
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
      jobTitle: s.roleEn ?? s.role,
      medicalSpecialty: s.specialty,
      url: `${SITE_URL}/en/specialistes/${s.slug}`,
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
