/**
 * English Practices Page — listing of all wellness practices.
 * Renders the shared PratiquesGrid component (i18n-driven) with search, filters,
 * and animated card grid. Includes breadcrumbs, SEO metadata, and Footer.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import PratiquesGrid from "@/components/pratiques/PratiquesGrid";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";
import { getPracticesPageAsync, PRATIQUES_PAGE_SIZE } from "@/lib/pratiques";

export const metadata: Metadata = {
  title: "Our Practices — Physiotherapy, Osteopathy, Psychology & Nutrition | Wenaya",
  description:
    "Discover all Wenaya practices: physiotherapy, osteopathy, clinical psychology, neuropsychology, nutrition, speech therapy, naturopathy, psychomotricity and complementary therapies in Casablanca.",
  alternates: {
    canonical: `${SITE_URL}/en/pratiques`,
    languages: languageAlternates("/pratiques"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Our Practices — Wenaya",
    description:
      "Physiotherapy, osteopathy, psychology, nutrition and more — an integrated approach to your health in Casablanca.",
    url: `${SITE_URL}/en/pratiques`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Our Practices — Wenaya",
    description:
      "Physiotherapy, osteopathy, psychology, nutrition and more — an integrated approach to your health in Casablanca.",
  },
};

export default async function EnglishPratiquesPage() {
  // SSR the first infinite-scroll batch through the SAME seam the grid consumes,
  // so the initial HTML carries a meaningful, crawlable set of practices (SEO)
  // and initial state always matches what the client would fetch.
  const initial = await getPracticesPageAsync({
    locale: "en",
    page: 1,
    pageSize: PRATIQUES_PAGE_SIZE,
  });

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <Breadcrumbs />
          <PratiquesGrid
            initialItems={initial.items}
            initialTotal={initial.total}
            initialHasMore={initial.hasMore}
            totalAll={initial.total}
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
