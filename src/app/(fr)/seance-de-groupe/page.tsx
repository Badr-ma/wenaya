/**
 * Group Sessions Page (FR) — /seance-de-groupe
 * SEO/LLM-friendly group-sessions page: unique metadata, canonical, hreflang,
 * OpenGraph/Twitter, WebPage + ItemList + FAQPage structured data, breadcrumbs.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GroupSessionsPage from "@/components/seance-de-groupe/GroupSessionsPage";
import { getActiveGroupSessions } from "@/lib/group-sessions-active";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import fr from "@/i18n/fr";

const alternateLanguages = {
  "fr-MA": `${SITE_URL}/seance-de-groupe`,
  "en-MA": `${SITE_URL}/en/seance-de-groupe`,
  "x-default": `${SITE_URL}/seance-de-groupe`,
} as const;

export const metadata: Metadata = {
  title: "Séances de groupe à Casablanca",
  description:
    "Séances collectives et ateliers encadrés par nos professionnels, en présentiel au centre Wenaya à Casablanca.",
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

function buildJsonLd(sessions: { title: string; description?: string }[]) {
  const { seanceDeGroupe } = fr;

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

export default async function GroupSessionsFrPage() {
  const sessions = await getActiveGroupSessions("fr");
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
