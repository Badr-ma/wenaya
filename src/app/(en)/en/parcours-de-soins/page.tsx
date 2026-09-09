/**
 * Care Journeys hub EN — /en/parcours-de-soins
 * Editorial grid of the 7 care pathways. Static metadata, WebPage structured
 * data, breadcrumbs, and the shared CareJourneysHub (content mirrors live —
 * the live site serves the same French copy under EN chrome).
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import CareJourneysHub from "@/components/care-journeys/CareJourneysHub";
import Footer from "@/components/Footer";
import { PARCOURS_DE_SOINS_HUB } from "@/lib/care-journeys";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: PARCOURS_DE_SOINS_HUB.seo.en.title,
  description: PARCOURS_DE_SOINS_HUB.seo.en.description,
  alternates: {
    canonical: `${SITE_URL}/en/parcours-de-soins`,
    languages: languageAlternates("/parcours-de-soins"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: PARCOURS_DE_SOINS_HUB.seo.en.title,
    description: PARCOURS_DE_SOINS_HUB.seo.en.description,
    url: `${SITE_URL}/en/parcours-de-soins`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: PARCOURS_DE_SOINS_HUB.seo.en.title,
    description: PARCOURS_DE_SOINS_HUB.seo.en.description,
  },
};

export default function EnglishCareJourneysHubPage() {
  const pageUrl = `${SITE_URL}/en/parcours-de-soins`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: PARCOURS_DE_SOINS_HUB.heading,
    description: PARCOURS_DE_SOINS_HUB.supporting,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main>
          <Breadcrumbs />
          <CareJourneysHub locale="en" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}