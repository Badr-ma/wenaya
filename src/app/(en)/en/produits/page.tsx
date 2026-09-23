/**
 * Products Page — SHOP LAUNCH FREEZE landing (EN).
 * /en/produits now renders the premium "shop coming soon" editorial page.
 * Product-detail, cart and checkout routes redirect here (see next.config.ts).
 * The existing shop implementation stays on disk untouched for future activation.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import ShopComingSoonLanding from "@/components/shop/ShopComingSoonLanding";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Wenaya Shop — Coming Soon",
  description:
    "The Wenaya Shop is coming soon. We're preparing a carefully selected range of products to support your health and wellbeing every day.",
  alternates: {
    canonical: `${SITE_URL}/en/produits`,
    languages: languageAlternates("/produits"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Wenaya Shop — Coming Soon",
    description:
      "The Wenaya Shop is coming soon. We're preparing a carefully selected range of products to support your health and wellbeing every day.",
    url: `${SITE_URL}/en/produits`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Wenaya Shop — Coming Soon",
    description:
      "The Wenaya Shop is coming soon. We're preparing a carefully selected range of products to support your health and wellbeing every day.",
  },
};

export default function EnglishProduitsPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <ShopComingSoonLanding locale="en" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}