/**
 * Product Detail Page (FR) — server-resolves product from the live public API.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/produits/ProductDetail";
import Footer from "@/components/Footer";
import {
  fetchPublicProductBySlug,
  fetchPublicProducts,
  mapBackendProductToProduct,
} from "@/lib/products/api-adapter";
import { getTranslations } from "@/i18n";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const backendProducts = await fetchPublicProducts();
    return backendProducts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const backendProduct = await fetchPublicProductBySlug(slug);
  if (!backendProduct) return {};

  const product = mapBackendProductToProduct(backendProduct);

  return {
    title: { absolute: `${product.name} — Wenaya` },
    description: product.description,
    alternates: {
      canonical: `${SITE_URL}/produits/${slug}`,
      languages: languageAlternates(`/produits/${slug}`),
    },
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

export const revalidate = 60;

export default async function ProduitPage({ params }: Props) {
  const { slug } = await params;
  const backendProduct = await fetchPublicProductBySlug(slug);
  if (!backendProduct) notFound();

  const product = mapBackendProductToProduct(backendProduct);
  const { t, tRaw, locale } = getTranslations("fr");

  let allProducts: ReturnType<typeof mapBackendProductToProduct>[] = [];
  try {
    const backendProducts = await fetchPublicProducts();
    allProducts = backendProducts.map((p) => mapBackendProductToProduct(p));
  } catch {
    // leave empty; detail still renders
  }

  const relatedProducts = allProducts
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, 4);

  const brandProducts = product.brand
    ? allProducts.filter((p) => p.slug !== slug && p.brand === product.brand).slice(0, 6)
    : [];

  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.thumbnail,
    category: product.category,
  };

  if (product.brand) {
    productJsonLd.brand = {
      "@type": "Brand",
      name: product.brand,
    };
  }

  if (product.rating != null && product.reviewCount != null) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
    };
  }

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
    offers.url = `${SITE_URL}/produits/${slug}`;
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
