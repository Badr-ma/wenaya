/**
 * Products listing page (FR) — populated from the live public product API.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import ProductsGrid from "@/components/produits/ProductsGrid";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";
import {
  fetchPublicProducts,
  mapBackendProductToProductItem,
} from "@/lib/products/api-adapter";

export const metadata: Metadata = {
  title: "Boutique Wenaya — Produits",
  description:
    "Découvrez notre sélection de produits soigneusement choisis pour accompagner votre santé et votre bien-être au quotidien.",
  alternates: {
    canonical: `${SITE_URL}/produits`,
    languages: languageAlternates("/produits"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Boutique Wenaya — Produits",
    description:
      "Découvrez notre sélection de produits soigneusement choisis pour accompagner votre santé et votre bien-être au quotidien.",
    url: `${SITE_URL}/produits`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Boutique Wenaya — Produits",
    description:
      "Découvrez notre sélection de produits soigneusement choisis pour accompagner votre santé et votre bien-être au quotidien.",
  },
};

export const revalidate = 60;

export default async function ProduitsPage() {
  let initial = undefined;

  try {
    const backendProducts = await fetchPublicProducts();
    const items = backendProducts.map((p) => mapBackendProductToProductItem(p));

    initial = {
      items,
      total: items.length,
      page: 1,
      totalPages: 1,
      hasMore: false,
    };
  } catch (error) {
    console.error("[produits] failed to load products", error);
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <ProductsGrid initial={initial} />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
