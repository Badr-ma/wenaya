/**
 * Maux-Troubles hub FR — /maux-troubles
 * Correction-spec catalogue page: every real backend trouble (visible only),
 * each card linking to its OWN dynamic detail route (`/maux-troubles/{slug}`).
 * No direct routing to practices from hub cards. NO fallback to the old static
 * `health-needs.ts` — API failure renders an explicit error state.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import MauxTroublesHub from "@/components/maux-troubles/MauxTroublesHub";
import { getTroublesHub } from "@/lib/troubles-hub";
import { getTranslations } from "@/i18n";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

const { t } = getTranslations("fr");

const PAGE_PATH = "/maux-troubles";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: t("mauxTroubles.seoTitle") },
  description: t("mauxTroubles.seoDescription"),
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}`, languages: languageAlternates(PAGE_PATH, "/en/health-needs") },
  openGraph: {
    ...OG_DEFAULTS,
    title: t("mauxTroubles.seoTitle"),
    description: t("mauxTroubles.seoDescription"),
    url: `${SITE_URL}${PAGE_PATH}`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: t("mauxTroubles.seoTitle"),
    description: t("mauxTroubles.seoDescription"),
  },
};

export default async function MauxTroublesPage() {
  const hub = await getTroublesHub();
  const pageUrl = `${SITE_URL}${PAGE_PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: t("mauxTroubles.heading1"),
    description: t("mauxTroubles.seoDescription"),
    inLanguage: "fr",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main>
          <Breadcrumbs />
          <MauxTroublesHub items={hub.items} status={hub.status} locale="fr" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}