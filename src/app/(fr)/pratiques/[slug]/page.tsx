/**
 * Pratique Detail Page — server component for individual practice pages (/pratiques/[slug]).
 * Server-resolves pratique via adapter, passes data to PratiqueDetail.
 * Returns 404 if slug does not exist.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import PratiqueDetail from "@/components/pratiques/PratiqueDetail";
import Footer from "@/components/Footer";
import { getPratiqueBySlug, getAllPratiqueSlugs } from "@/lib/pratiques";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPratiqueSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pratique = getPratiqueBySlug(slug, "fr");
  if (!pratique) return {};
  return {
    title: `${pratique.title} — Wenaya`,
    description: pratique.description,
    alternates: { canonical: `${SITE_URL}/pratiques/${slug}`, languages: languageAlternates(`/pratiques/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${pratique.title} — Wenaya`,
      description: pratique.description,
      url: `${SITE_URL}/pratiques/${slug}`,
      images: [{ url: pratique.image, alt: pratique.title }],
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${pratique.title} — Wenaya`,
      description: pratique.description,
      images: [pratique.image],
    },
  };
}

export default async function PratiquePage({ params }: Props) {
  const { slug } = await params;
  const pratique = getPratiqueBySlug(slug, "fr");
  if (!pratique) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    name: pratique.title,
    description: pratique.description,
    image: pratique.image,
    url: `${SITE_URL}/pratiques/${slug}`,
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main>
          <Breadcrumbs labels={{ [slug]: pratique.title }} />
          <PratiqueDetail
            pratique={pratique}
            locale="fr"
            backHref="/pratiques"
            backLabel="Retour aux pratiques"
            ctaLabel="Prendre rendez-vous"
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
