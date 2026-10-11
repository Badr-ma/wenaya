/**
 * English About Page ("Who we are") — server component.
 * Renders the shared editorial APropos component in English (lang="en") — the
 * same content and design as the FR /about-us editorial page, with a faithful
 * EN copy (approved en.ts tokens + FR-derived editorial rest). Hreflang FR
 * alternate points at /about-us; canonical stays /en/about-us.
 * Includes WebPage structured data for SEO.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import APropos from "@/components/about/APropos";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

const ABOUT_PATH = "/en/about-us";

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "At Wenaya, our mission is to guide each individual along their path to optimal health and overall wellbeing. Discover who we are and our vision of integrated healthcare in Casablanca.",
  keywords: [
    "about Wenaya",
    "who we are",
    "Wenaya mission",
    "integrated healthcare",
    "overall wellbeing",
    "Wenaya Casablanca",
  ],
  alternates: {
    canonical: `${SITE_URL}${ABOUT_PATH}`,
    languages: languageAlternates("/about-us", ABOUT_PATH),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Who we are | Wenaya",
    description:
      "Our mission: guiding each individual toward optimal health and overall wellbeing.",
    url: `${SITE_URL}${ABOUT_PATH}`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Who we are | Wenaya",
    description:
      "Our mission: guiding each individual toward optimal health and overall wellbeing.",
  },
};

function aboutWebPageJsonLd(): React.ReactElement {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Who we are | Wenaya",
    description:
      "At Wenaya, our mission is to guide each individual along their path to optimal health and overall wellbeing.",
    url: `${SITE_URL}${ABOUT_PATH}`,
    inLanguage: "en-MA",
    isPartOf: { "@id": `${SITE_URL}/#organization` },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function EnglishAboutPage() {
  return (
    <>
      {aboutWebPageJsonLd()}
      <ErrorBoundary>
        <main>
          <Breadcrumbs />
          <APropos lang="en" />
        </main>
        <Footer />
      </ErrorBoundary>
    </>
  );
}