/**
 * Product Detail Page — server component for individual product pages (/produits/[slug]).
 * Fetches product by slug, generates metadata, shows ProductDetail component.
 * Returns 404 if product not found.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/produits/ProductDetail";
import Footer from "@/components/Footer";
import en from "@/i18n/en";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";

interface ProductItem {
  slug: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return (en.produits.items as ProductItem[]).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = (en.produits.items as ProductItem[]).find((p) => p.slug === slug);
  if (!item) return {};
  return {
    title: `${item.title} — Wenaya`,
    description: item.desc,
    alternates: { canonical: `${SITE_URL}/produits/${slug}` },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${item.title} — Wenaya`,
      description: item.desc,
      url: `${SITE_URL}/produits/${slug}`,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${item.title} — Wenaya`,
      description: item.desc,
    },
  };
}

export default async function ProduitPage({ params }: Props) {
  const { slug } = await params;
  const item = (en.produits.items as ProductItem[]).find((p) => p.slug === slug);
  if (!item) notFound();

  /** Product schema — emits only fields present in the product data (no price/availability: none exists) */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.desc,
    image: item.image,
    category: item.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: item.rating,
      reviewCount: item.reviews,
      bestRating: 5,
    },
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <main>
          <Breadcrumbs labels={{ [slug]: item.title }} />
          <ProductDetail slug={slug} />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
