/**
 * Products Page — filterable product listing page for /produits.
 * Renders the ProductsGrid component (search, filters, sort, grid view).
 * Includes breadcrumbs, SEO metadata with keywords, ItemList JSON-LD, and Footer.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductsGrid from "@/components/produits/ProductsGrid";
import SkeletonCard from "@/components/produits/SkeletonCard";
import Footer from "@/components/Footer";
import { getProduits } from "@/lib/produits";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Nos Produits — Compléments, Appareils & Programmes Bien-être | Wenaya",
  description:
    "Découvrez notre sélection de produits santé et bien-être : compléments nutritionnels, appareils de thérapie, wearables, soins de la peau et programmes personnalisés par nos spécialistes.",
  alternates: {
    canonical: `${SITE_URL}/produits`,
    languages: languageAlternates("/produits"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Nos Produits — Wenaya",
    description:
      "Produits de santé, bien-être et longévité sélectionnés par nos spécialistes pour une santé optimale.",
    url: `${SITE_URL}/produits`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Nos Produits — Wenaya",
    description:
      "Produits de santé, bien-être et longévité sélectionnés par nos spécialistes pour une santé optimale.",
  },
};

function ProductsSkeleton() {
  return (
    <section className="bg-[#F2EFE9] pt-36 sm:pt-44 pb-20 sm:pb-28 px-6">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="max-w-2xl mx-auto text-center mb-14 space-y-4">
          <div className="h-12 w-64 bg-[#0B1220]/5 rounded mx-auto" />
          <div className="h-4 w-80 bg-[#0B1220]/5 rounded mx-auto max-w-sm" />
        </div>
        <div className="flex gap-4 mb-10">
          <div className="h-8 w-20 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-24 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-20 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-28 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-32 bg-[#0B1220]/5 rounded-full ml-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-14 sm:gap-y-16">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ItemListJsonLd({ items }: { items: { slug: string; title: string; image: string }[] }) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Produits Wenaya",
    description: "Produits de santé, bien-être et longévité sélectionnés par nos spécialistes.",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/produits/${item.slug}`,
      name: item.title,
      image: item.image,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

export default function ProduitsPage() {
  const result = getProduits({ locale: "fr", page: 1, limit: 12, sort: "bestRated" });

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <ItemListJsonLd
            items={result.items.map((p) => ({ slug: p.slug, title: p.title, image: p.image }))}
          />
          <Breadcrumbs />
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsGrid initial={result} />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
