/**
 * Pratiques Page — listing of all wellness practices (kinésithérapie, psychologie, etc.).
 * Renders the PratiquesGrid component with search, filters, and animated card grid.
 * Includes breadcrumbs, SEO metadata, and Footer.
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
  title: "Nos Pratiques — Kinésithérapie, Ostéopathie, Psychologie & Nutrition | Wenaya",
  description:
    "Découvrez toutes les pratiques Wenaya : kinésithérapie, ostéopathie, psychologie clinique, neuropsychologie, nutrition, orthophonie, naturopathie, psychomotricité et thérapies complémentaires à Casablanca.",
  alternates: {
    canonical: `${SITE_URL}/pratiques`,
    languages: languageAlternates("/pratiques"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Nos Pratiques — Wenaya",
    description:
      "Kinésithérapie, ostéopathie, psychologie, nutrition et plus — une approche intégrée pour votre santé à Casablanca.",
    url: `${SITE_URL}/pratiques`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Nos Pratiques — Wenaya",
    description:
      "Kinésithérapie, ostéopathie, psychologie, nutrition et plus — une approche intégrée pour votre santé à Casablanca.",
  },
};

export default async function PratiquesPage() {
  // SSR the first infinite-scroll batch through the SAME seam the grid consumes,
  // so the initial HTML carries a meaningful, crawlable set of practices (SEO)
  // and initial state always matches what the client would fetch.
  const initial = await getPracticesPageAsync({
    locale: "fr",
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
