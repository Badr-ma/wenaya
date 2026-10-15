/**
 * Products listing page (EN) — populated from the live public product API.
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
  title: "Wenaya Shop — Products",
  description:
    "Explore our carefully selected range of products to support your health and wellbeing every day.",
  alternates: {
    canonical: `${SITE_URL}/en/produits`,
    languages: languageAlternates("/produits"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Wenaya Shop — Products",
    description:
      "Explore our carefully selected range of products to support your health and wellbeing every day.",
    url: `${SITE_URL}/en/produits`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Wenaya Shop — Products",
    description:
      "Explore our carefully selected range of products to support your health and wellbeing every day.",
  },
};

export const revalidate = 60;

export default async function EnglishProduitsPage() {
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
    console.error("[en/produits] failed to load products", error);
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
