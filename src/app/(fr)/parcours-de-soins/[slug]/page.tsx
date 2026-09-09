/**
 * Care Journey detail FR — /parcours-de-soins/[slug]
 * Static generation via generateStaticParams; dynamic SEO metadata, WebPage
 * structured data, breadcrumbs, and the editorial CareJourneyDetail.
 * Unknown slugs render a proper 404 via notFound().
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import CareJourneyDetail from "@/components/care-journeys/CareJourneyDetail";
import Footer from "@/components/Footer";
import { getAllCareJourneySlugs, getCareJourneyBySlug } from "@/lib/care-journeys";
import { safeDecodeURI } from "@/lib/href";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCareJourneySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = safeDecodeURI((await params).slug);
  const journey = getCareJourneyBySlug(slug);
  if (!journey) return {};

  const seo = journey.seo.fr;
  const url = `${SITE_URL}/parcours-de-soins/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(`/parcours-de-soins/${slug}`),
    },
    openGraph: {
      ...OG_DEFAULTS,
      title: seo.title,
      description: seo.description,
      url,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function CareJourneyPage({ params }: Props) {
  const slug = safeDecodeURI((await params).slug);
  const journey = getCareJourneyBySlug(slug);
  if (!journey) notFound();

  const pageUrl = `${SITE_URL}/parcours-de-soins/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: journey.title,
    description: journey.seo.fr.description,
    inLanguage: "fr",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main>
          <Breadcrumbs labels={{ "parcours-de-soins": "Parcours de soins", [slug]: journey.title }} />
          <CareJourneyDetail journey={journey} locale="fr" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}