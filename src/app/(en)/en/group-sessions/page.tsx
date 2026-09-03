/**
 * Group Sessions Page (EN) — /en/group-sessions
 * SEO/LLM-friendly group-sessions page: unique metadata, canonical, hreflang,
 * OpenGraph/Twitter, WebPage + ItemList + FAQPage structured data, breadcrumbs.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GroupSessionsPage from "@/components/seance-de-groupe/GroupSessionsPage";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import en from "@/i18n/en";

const sessionKeys = ["yoga", "sophrologie", "nutrition", "breathwork", "jjb", "pilates"] as const;

const alternateLanguages = {
  "fr-MA": `${SITE_URL}/seance-de-groupe`,
  "en-MA": `${SITE_URL}/en/group-sessions`,
  "x-default": `${SITE_URL}/seance-de-groupe`,
} as const;

export const metadata: Metadata = {
  title: "Group Sessions in Casablanca",
  description:
    "Group health and wellbeing sessions in Casablanca: Prenatal Yoga, Sophrology, Nutrition, Breathwork, Brazilian Jiu-Jitsu and Pilates & Posture, led by our professionals.",
  alternates: {
    canonical: `${SITE_URL}/en/group-sessions`,
    languages: alternateLanguages,
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Group Sessions in Casablanca | Wenaya",
    description:
      "Group workshops and classes led by our professionals in Casablanca — complementing your individual consultations.",
    url: `${SITE_URL}/en/group-sessions`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Group Sessions in Casablanca | Wenaya",
    description:
      "Group workshops and classes led by our professionals in Casablanca — complementing your individual consultations.",
  },
};

function buildStructuredData() {
  const { coursAteliers, seanceDeGroupe } = en;

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
    "@id": `${SITE_URL}/en/group-sessions`,
    url: `${SITE_URL}/en/group-sessions`,
    name: "Group sessions at Wenaya",
    description: seanceDeGroupe.hero.intro,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return [
    { "@context": "https://schema.org", ...webPage },
    { "@context": "https://schema.org", ...itemList },
  ];
}

export default function GroupSessionsEnPage() {
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