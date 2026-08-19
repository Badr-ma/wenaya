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

export default function EnglishPratiquesPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <Breadcrumbs />
          <PratiquesGrid />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
