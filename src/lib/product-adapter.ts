/**
 * Product Adapter — single entry point for normalized product data.
 * Merges canonical (non-translatable) + locale (translated name/desc) data
 * into the shared Product model. UI components never import i18n files directly.
 */
import { canonicalProducts, type CanonicalProduct } from "@/data/products/canonical";
import { frProducts, type LocaleProductData } from "@/data/products/fr";
import { enProducts } from "@/data/products/en";
import type { Product, ProductListItem } from "@/types/product";

const localeMap: Record<string, Record<string, LocaleProductData>> = {
  fr: frProducts,
  en: enProducts,
};

function getLocaleData(locale: string): Record<string, LocaleProductData> {
  return localeMap[locale] || localeMap.fr;
}

function normalizeProduct(
  canonical: CanonicalProduct,
  locale: string,
): Product {
  const loc = getLocaleData(locale);
  const translated = loc[canonical.slug];

  return {
    id: canonical.slug,
    slug: canonical.slug,
    name: translated?.name || canonical.slug,
    description: translated?.desc || "",
    brand: canonical.brand,
    brandSlug: canonical.brandSlug,
    category: canonical.category,
    goals: canonical.goals,
    topics: canonical.topics,
    images: [{ src: canonical.image, alt: translated?.name || canonical.slug }],
    thumbnail: canonical.image,
    rating: canonical.rating,
    reviewCount: canonical.reviews,
    featured: canonical.featured,
    price: canonical.price,
    currency: canonical.currency,
    availability: canonical.availability,
    purchaseUrl: canonical.purchaseUrl,
    websiteUrl: canonical.websiteUrl,
  };
}

function toListItem(
  canonical: CanonicalProduct,
  locale: string,
): ProductListItem {
  const loc = getLocaleData(locale);
  const translated = loc[canonical.slug];

  return {
    id: canonical.slug,
    slug: canonical.slug,
    name: translated?.name || canonical.slug,
    description: translated?.desc || "",
    brand: canonical.brand,
    brandSlug: canonical.brandSlug,
    category: canonical.category,
    goals: canonical.goals,
    topics: canonical.topics,
    images: [{ src: canonical.image, alt: translated?.name || canonical.slug }],
    thumbnail: canonical.image,
    rating: canonical.rating,
    reviewCount: canonical.reviews,
    featured: canonical.featured,
    price: canonical.price,
    currency: canonical.currency,
    availability: canonical.availability,
  };
}

/** Legacy shape used by ProductsGrid and the API route — preserves backward compatibility */
export type LegacyProductItem = {
  slug: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  goals: string[];
  topics: string[];
};

function toLegacyItem(
  canonical: CanonicalProduct,
  locale: string,
): LegacyProductItem {
  const loc = getLocaleData(locale);
  const translated = loc[canonical.slug];

  return {
    slug: canonical.slug,
    title: translated?.name || canonical.slug,
    desc: translated?.desc || "",
    category: canonical.category,
    rating: canonical.rating,
    reviews: canonical.reviews,
    image: canonical.image,
    goals: canonical.goals,
    topics: canonical.topics,
  };
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────

/** Get all products normalized to the full Product model */
export function getProducts(locale: string = "fr"): Product[] {
  return canonicalProducts.map((c) => normalizeProduct(c, locale));
}

/** Get a single product by slug, or undefined */
export function getProductBySlug(
  slug: string,
  locale: string = "fr",
): Product | undefined {
  const canonical = canonicalProducts.find((c) => c.slug === slug);
  if (!canonical) return undefined;
  return normalizeProduct(canonical, locale);
}

/** Get all product slugs (for generateStaticParams) */
export function getAllProductSlugs(): string[] {
  return canonicalProducts.map((c) => c.slug);
}

/** Get legacy-shaped items for the API route and ProductsGrid (backward compatible) */
export function getLegacyProducts(locale: string = "fr"): LegacyProductItem[] {
  return canonicalProducts.map((c) => toLegacyItem(c, locale));
}

/** Get a legacy-shaped item by slug */
export function getLegacyProductBySlug(
  slug: string,
  locale: string = "fr",
): LegacyProductItem | undefined {
  const canonical = canonicalProducts.find((c) => c.slug === slug);
  if (!canonical) return undefined;
  return toLegacyItem(canonical, locale);
}

/** Get product list items (lightweight for cards) */
export function getProductListItems(locale: string = "fr"): ProductListItem[] {
  return canonicalProducts.map((c) => toListItem(c, locale));
}
