/**
 * About Page ("Qui sommes nous") — server component.
 * Concise editorial company-mission page. No clinic sections: the CTAs point
 * toward the Clinic page, the practices catalogue and the booking request flow.
 * Includes WebPage structured data for SEO.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import AboutUs from "@/components/about/AboutUs";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

const ABOUT_PATH = "/about-us";

export const metadata: Metadata = {
  title: "Qui sommes nous",
  description:
    "Chez Wenaya, notre mission est d'accompagner chaque individu dans son chemin vers une santé optimale et un bien-être global. Découvrez qui sommes nous et notre vision de la santé intégrée à Casablanca.",
  keywords: [
    "à propos de Wenaya",
    "qui sommes nous",
    "mission Wenaya",
    "santé intégrée",
    "bien-être global",
    "Wenaya Casablanca",
  ],
  alternates: {
    canonical: `${SITE_URL}${ABOUT_PATH}`,
    languages: languageAlternates(ABOUT_PATH),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Qui sommes nous | Wenaya",
    description:
      "Notre mission : accompagner chaque individu vers une santé optimale et un bien-être global.",
    url: `${SITE_URL}${ABOUT_PATH}`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Qui sommes nous | Wenaya",
    description:
      "Notre mission : accompagner chaque individu vers une santé optimale et un bien-être global.",
  },
};

function aboutWebPageJsonLd(): React.ReactElement {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Qui sommes nous | Wenaya",
    description:
      "Chez Wenaya, notre mission est d'accompagner chaque individu dans son chemin vers une santé optimale et un bien-être global.",
    url: `${SITE_URL}${ABOUT_PATH}`,
    inLanguage: "fr-MA",
    isPartOf: { "@id": `${SITE_URL}/#organization` },
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
      {aboutWebPageJsonLd()}
      <ErrorBoundary>
        <main>
          <Breadcrumbs />
          <AboutUs lang="fr" />
        </main>
        <Footer />
      </ErrorBoundary>
    </>
  );
}