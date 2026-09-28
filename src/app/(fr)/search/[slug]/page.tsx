import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SpecialistsPageBody from "@/components/specialistes/SpecialistsPage";
import Footer from "@/components/Footer";
import { getLiveSpecialists } from "@/lib/professionals";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";
import { filterSpecialists, getSpecialtyOptions } from "@/lib/specialist-filters";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const TITLE = "Nos Spécialistes — Wenaya Casablanca";
const DESCRIPTION =
  "Découvrez l'équipe de spécialistes de Wenaya à Casablanca : kinésithérapeutes, ostéopathes, psychologues, nutritionnistes, orthophonistes et plus. Prenez rendez-vous en ligne.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const all = await getLiveSpecialists();
  const isSpecialty = getSpecialtyOptions(all).some((o) => o.slug === slug);
  if (slug !== "all" && !isSpecialty) notFound();
  const path = `/search/${slug}`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: ["spécialistes", "Casablanca", "kinésithérapie", "ostéopathie", "psychologie", "nutrition", "Wenaya", "rendez-vous médecin"],
    alternates: { canonical: `${SITE_URL}${path}`, languages: languageAlternates(path) },
    openGraph: {
      ...OG_DEFAULTS,
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${path}`,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default async function SpecialistsSearchPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const q = Array.isArray(sp?.q) ? sp.q[0] : (sp?.q ?? "");

  const all = await getLiveSpecialists();
  const isSpecialty = getSpecialtyOptions(all).some((o) => o.slug === slug);
  if (slug !== "all" && !isSpecialty) notFound();
  const specialty = slug === "all" ? "" : slug;

  const specialists = filterSpecialists(all, { specialty, q });
  const specialtyOptions = getSpecialtyOptions(all);

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
    medicalSpecialty: [...new Set(all.map((s) => s.specialty))],
    employee: all.map((s) => ({
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
          <SpecialistsPageBody
            specialists={specialists}
            specialtyOptions={specialtyOptions}
            specialty={specialty}
            q={q}
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}