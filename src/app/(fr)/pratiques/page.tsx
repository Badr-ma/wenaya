import Link from "next/link";
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

const listingMetadata: Metadata = {
  title: "Nos Pratiques — Kinésithérapie, Ostéopathie, Psychologie & Nutrition",
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

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const query = await searchParams;
  const page = Math.max(1, Math.min(1000, Number.parseInt(query.page ?? '1', 10) || 1));
  const suffix = page > 1 ? '?page=' + page : '';
  return { ...listingMetadata, ...(page > 1 ? { title: 'Nos pratiques — Page ' + page } : {}),
    alternates: { canonical: SITE_URL + '/pratiques' + suffix, languages: languageAlternates('/pratiques' + suffix) } };
}

export default async function PratiquesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams;
  const page = Math.max(1, Math.min(1000, Number.parseInt(query.page ?? '1', 10) || 1));
  // SSR the first infinite-scroll batch through the SAME seam the grid consumes,
  // so the initial HTML carries a meaningful, crawlable set of practices (SEO)
  // and initial state always matches what the client would fetch.
  const initial = await getPracticesPageAsync({
    locale: "fr",
    page,
    pageSize: PRATIQUES_PAGE_SIZE,
  });

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <Breadcrumbs />
          {page > 1 && <Link href="/pratiques" className="sr-only focus:not-sr-only">Première page</Link>}
          <PratiquesGrid
            key={page}
            initialPage={page}
            initialItems={initial.items}
            initialTotal={initial.total}
            initialHasMore={initial.hasMore}
            totalAll={initial.total}
            initialLoadError={initial.loadError}
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
