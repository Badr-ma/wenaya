/**
 * Products Page — SHOP LAUNCH FREEZE landing (FR).
 * /produits now renders the premium "shop coming soon" editorial page.
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
  title: "Boutique Wenaya — Bientôt disponible",
  description:
    "La boutique Wenaya arrive bientôt. Nous préparons une sélection de produits soigneusement choisis pour accompagner votre santé et votre bien-être au quotidien.",
  alternates: {
    canonical: `${SITE_URL}/produits`,
    languages: languageAlternates("/produits"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Boutique Wenaya — Bientôt disponible",
    description:
      "La boutique Wenaya arrive bientôt. Nous préparons une sélection de produits soigneusement choisis pour accompagner votre santé et votre bien-être au quotidien.",
    url: `${SITE_URL}/produits`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Boutique Wenaya — Bientôt disponible",
    description:
      "La boutique Wenaya arrive bientôt. Nous préparons une sélection de produits soigneusement choisis pour accompagner votre santé et votre bien-être au quotidien.",
  },
};

export default function ProduitsPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <ShopComingSoonLanding locale="fr" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}