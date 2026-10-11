/**
 * À propos page — FR /about-us
 * Editorial company page (CEO-approved copy, Wenaya Clinics / Corporate / YOLO).
 *
 * Bilingual FR/EN: `/about-us` (canonical FR) and `/en/about-us` (canonical EN)
 * both render the editorial company page with reciprocal hreflang fr-MA/en-MA
 * + x-default. The legacy `/a-propos` path 308-redirects to `/about-us`.
 *
 * Metadata follows the approved delivery: French title/description, robots
 * index/follow/max-image-preview:large, canonical https://www.wenaya.com/about-us,
 * OG/Twitter sharing via the shared default image, and an AboutPage JSON-LD that
 * reuses the existing Organization entity through its stable @id so no address,
 * logo or profile is ever invented.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import APropos from "@/components/about/APropos";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

const ABOUT_PATH = "/about-us";

export const metadata: Metadata = {
  title: "À propos de Wenaya | Notre vision de la santé",
  description:
    "Découvrez la vision Wenaya : réinventer la manière de prendre soin de sa santé grâce à la prévention, la longévité, la performance, l'accompagnement en entreprise et une IA spécialisée.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  alternates: {
    canonical: `${SITE_URL}${ABOUT_PATH}`,
    languages: languageAlternates(ABOUT_PATH, "/en/about-us"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "À propos de Wenaya | Réinventer la manière de prendre soin de sa santé",
    description:
      "Une vision de la santé proactive, personnalisée et continue, portée par Wenaya Clinics, Wenaya Corporate et YOLO.",
    url: `${SITE_URL}${ABOUT_PATH}`,
    type: "website",
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "À propos de Wenaya | Notre vision de la santé",
    description:
      "Une vision de la santé proactive, personnalisée et continue, portée par Wenaya Clinics, Wenaya Corporate et YOLO.",
  },
};

function aboutPageJsonLd(): React.ReactElement {
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}${ABOUT_PATH}#webpage`,
    url: `${SITE_URL}${ABOUT_PATH}`,
    name: "À propos de Wenaya",
    description:
      "La vision de Wenaya : réinventer la manière de prendre soin de sa santé.",
    inLanguage: "fr-MA",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      {aboutPageJsonLd()}
      <ErrorBoundary>
        <main>
          <Breadcrumbs labels={{ "about-us": "À propos" }} />
          <APropos />
        </main>
        <Footer />
      </ErrorBoundary>
    </>
  );
}
