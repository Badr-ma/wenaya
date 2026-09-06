/**
 * Product Detail Page — server component for individual product pages (/produits/[slug]).
 * Server-resolves product via adapter, computes related + brand products, passes full data to ProductDetail.
 * Returns 404 if product not found.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/produits/ProductDetail";
import Footer from "@/components/Footer";
import { getProductBySlug, getProducts, getAllProductSlugs } from "@/lib/product-adapter";
import { getTranslations } from "@/i18n";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "fr");
  if (!product) return {};
  return {
    title: `${product.name} — Wenaya`,
    description: product.description,
    alternates: { canonical: `${SITE_URL}/produits/${slug}`, languages: languageAlternates(`/produits/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${product.name} — Wenaya`,
      description: product.description,
      url: `${SITE_URL}/produits/${slug}`,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${product.name} — Wenaya`,
      description: product.description,
    },
  };
}

export default async function ProduitPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug, "fr");
  if (!product) notFound();

  const { t, tRaw, locale } = getTranslations("fr");

  // Full Product objects for related and brand products
  const allProducts = getProducts("fr");
  const relatedProducts = allProducts
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, 4);

  const brandProducts = product.brandSlug
    ? allProducts
        .filter((p) => p.slug !== slug && p.brandSlug === product.brandSlug)
        .slice(0, 6)
    : [];

  // ── Product JSON-LD ──
  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.thumbnail,
    category: product.category,
  };

  // Brand (only if exists)
  if (product.brand) {
    productJsonLd.brand = {
      "@type": "Brand",
      name: product.brand,
    };
  }

  // AggregateRating (only if rating exists)
  if (product.rating != null && product.reviewCount != null) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
    };
  }

  // Offers (only if real commerce data exists)
  if (product.price != null) {
    const offers: Record<string, unknown> = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "MAD",
    };
    if (product.availability) {
      const availabilityMap: Record<string, string> = {
        in_stock: "https://schema.org/InStock",
        out_of_stock: "https://schema.org/OutOfStock",
        pre_order: "https://schema.org/PreOrder",
        limited: "https://schema.org/InStock",
      };
      offers.availability = availabilityMap[product.availability];
    }
    if (product.purchaseUrl) {
      offers.url = product.purchaseUrl;
    }
    productJsonLd.offers = offers;
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <main>
          <Breadcrumbs labels={{ [slug]: product.name }} />
          <ProductDetail
            product={product}
            relatedProducts={relatedProducts}
            brandProducts={brandProducts}
            locale={locale}
            t={t}
            tRaw={tRaw}
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
