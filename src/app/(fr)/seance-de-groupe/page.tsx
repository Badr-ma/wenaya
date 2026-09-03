/**
 * Group Sessions Page (FR) — /seance-de-groupe
 * SEO/LLM-friendly group-sessions page: unique metadata, canonical, hreflang,
 * OpenGraph/Twitter, WebPage + ItemList + FAQPage structured data, breadcrumbs.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GroupSessionsPage from "@/components/seance-de-groupe/GroupSessionsPage";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import fr from "@/i18n/fr";

const sessionKeys = ["yoga", "sophrologie", "nutrition", "breathwork", "jjb", "pilates"] as const;

const alternateLanguages = {
  "fr-MA": `${SITE_URL}/seance-de-groupe`,
  "en-MA": `${SITE_URL}/en/group-sessions`,
  "x-default": `${SITE_URL}/seance-de-groupe`,
} as const;

export const metadata: Metadata = {
  title: "Séances de groupe à Casablanca",
  description:
    "Séances collectives de santé et de bien-être à Casablanca : Yoga Prénatal, Sophrologie, Nutrition, Breathwork, Jiu Jitsu Brésilien et Pilates & Posture, encadrées par nos professionnels.",
  alternates: {
    canonical: `${SITE_URL}/seance-de-groupe`,
    languages: alternateLanguages,
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Séances de groupe à Casablanca | Wenaya",
    description:
      "Ateliers et cours collectifs encadrés par nos professionnels à Casablanca — en complément de vos consultations individuelles.",
    url: `${SITE_URL}/seance-de-groupe`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Séances de groupe à Casablanca | Wenaya",
    description:
      "Ateliers et cours collectifs encadrés par nos professionnels à Casablanca — en complément de vos consultations individuelles.",
  },
};

function buildStructuredData() {
  const { coursAteliers, seanceDeGroupe } = fr;

  const itemList = {
    "@type": "ItemList",
    name: seanceDeGroupe.list.title,
    itemListElement: sessionKeys.map((key, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: coursAteliers[key].title,
      description: coursAteliers[key].desc,
    })),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/seance-de-groupe`,
    url: `${SITE_URL}/seance-de-groupe`,
    name: "Séances de groupe chez Wenaya",
    description: seanceDeGroupe.hero.intro,
    inLanguage: "fr",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return [
    { "@context": "https://schema.org", ...webPage },
    { "@context": "https://schema.org", ...itemList },
  ];
}

export default function GroupSessionsFrPage() {
  const jsonLd = buildStructuredData();
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        {jsonLd.map((block, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        ))}
        <GroupSessionsPage />
      </div>
    </ErrorBoundary>
  );
}
