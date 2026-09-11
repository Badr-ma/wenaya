/**
 * Group Sessions Page (EN) — /en/seance-de-groupe
 * SEO/LLM-friendly group-sessions page: unique metadata, canonical, hreflang,
 * OpenGraph/Twitter, WebPage + ItemList + FAQPage structured data, breadcrumbs.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GroupSessionsPage from "@/components/seance-de-groupe/GroupSessionsPage";
import { getActiveGroupSessions } from "@/lib/group-sessions-active";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import en from "@/i18n/en";

const alternateLanguages = {
  "fr-MA": `${SITE_URL}/seance-de-groupe`,
  "en-MA": `${SITE_URL}/en/seance-de-groupe`,
  "x-default": `${SITE_URL}/seance-de-groupe`,
} as const;

export const metadata: Metadata = {
  title: "Group Sessions in Casablanca",
  description:
    "Group sessions and workshops led by our professionals, in person at the Wenaya centre in Casablanca.",
  alternates: {
    canonical: `${SITE_URL}/en/seance-de-groupe`,
    languages: alternateLanguages,
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Group Sessions in Casablanca | Wenaya",
    description:
      "Group workshops and classes led by our professionals in Casablanca — complementing your individual consultations.",
    url: `${SITE_URL}/en/seance-de-groupe`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Group Sessions in Casablanca | Wenaya",
    description:
      "Group workshops and classes led by our professionals in Casablanca — complementing your individual consultations.",
  },
};

function buildJsonLd(sessions: { title: string; description?: string }[]) {
  const { seanceDeGroupe } = en;

  const itemList = {
    "@type": "ItemList",
    name: seanceDeGroupe.list.title,
    itemListElement: sessions.map((session, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: session.title,
      description: session.description || undefined,
    })),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/en/seance-de-groupe`,
    url: `${SITE_URL}/en/seance-de-groupe`,
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

export default async function GroupSessionsEnPage() {
  const sessions = await getActiveGroupSessions("en");
  const jsonLd = buildJsonLd(
    sessions.map((s) => ({ title: s.title, description: s.description }))
  );
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
        <GroupSessionsPage sessions={sessions} />
      </div>
    </ErrorBoundary>
  );
}