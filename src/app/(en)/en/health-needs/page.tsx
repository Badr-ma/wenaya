/**
 * Maux-Troubles hub EN — /en/health-needs
 * Same correction-spec catalogue page as the FR hub, with genuinely-English
 * chrome (labels, breadcrumbs, nav, en-MA SEO). Each card links to its own
 * dynamic detail route (`/en/health-needs/{slug}`). Backend content is FR-only
 * (no EN fields on the Troubles API) → the item names/paragraphs are served
 * as-is in French, exactly like the site serves `/en/...` programme bodies
 * today; no invented medical translations.
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

const { t } = getTranslations("en");

const FR_PATH = "/maux-troubles";
const EN_PATH = "/en/health-needs";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: t("mauxTroubles.seoTitle") },
  description: t("mauxTroubles.seoDescription"),
  alternates: { canonical: `${SITE_URL}${EN_PATH}`, languages: languageAlternates(FR_PATH, EN_PATH) },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: t("mauxTroubles.seoTitle"),
    description: t("mauxTroubles.seoDescription"),
    url: `${SITE_URL}${EN_PATH}`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: t("mauxTroubles.seoTitle"),
    description: t("mauxTroubles.seoDescription"),
  },
};

export default async function EnglishMauxTroublesPage() {
  const hub = await getTroublesHub();
  const pageUrl = `${SITE_URL}${EN_PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: t("mauxTroubles.heading1"),
    description: t("mauxTroubles.seoDescription"),
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main>
          <Breadcrumbs />
          <MauxTroublesHub items={hub.items} status={hub.status} locale="en" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}