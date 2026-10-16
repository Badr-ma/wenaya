/**
 * Public product API adapter — server-side only.
 *
 * Fetches the live catalogue from the Laravel backend and maps it to the
 * Product / ProductItem shapes used by the new-website components.
 */
import { getApiBaseUrl } from "@/lib/api-base";
import type { Product, ProductListItem } from "@/types/product";

export const PUBLIC_SHOP_COMPANY_SLUG = "wenaya-clinic";

export type BackendPublicProduct = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  unit_name?: string | null;
  image?: string | null;
  images?: string[];
  availability: "in_stock" | "out_of_stock" | "pre_order" | "limited";
  category?: string | null;
  goals?: string[];
  topics?: string[];
  rating?: number | null;
  reviews?: number;
  brand?: string | null;
  created_at?: string | null;
};

export type BackendPublicProductsResponse = {
  error: boolean;
  message: string;
  data: BackendPublicProduct[];
  meta?: {
    product_total_count?: number;
  };
};

export type BackendPublicProductResponse = {
  error: boolean;
  message: string;
  data: BackendPublicProduct;
};

const FALLBACK_IMAGE = "/images/wellness-stretch.jpg";

function getProductImages(product: BackendPublicProduct): string[] {
  const images = product.images ?? (product.image ? [product.image] : []);
  return images.length > 0 ? images : [FALLBACK_IMAGE];
}

function getProductImage(product: BackendPublicProduct): string {
  return getProductImages(product)[0];
}

export function mapBackendProductToProduct(
  product: BackendPublicProduct,
): Product {
  const images = getProductImages(product);
  return {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    brand: product.brand ?? undefined,
    category: product.category ?? "supplements",
    goals: product.goals ?? [],
    topics: product.topics ?? [],
    images: images.map((src) => ({ src, alt: product.name })),
    thumbnail: images[0],
    rating: product.rating ?? undefined,
    reviewCount: product.reviews ?? 0,
    price: product.price,
    currency: product.currency ?? "MAD",
    availability: product.availability,
    purchaseUrl: `/produits/${product.slug}`,
    websiteUrl: `/produits/${product.slug}`,
    badges:
      product.availability === "out_of_stock" ? ["Out of stock"] : undefined,
  };
}

export type ProductItem = {
  slug: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  goals: string[];
  topics: string[];
  price?: number;
  currency?: string;
  availability?: "in_stock" | "out_of_stock" | "pre_order" | "limited";
  badges?: string[];
  featured?: boolean;
};

export function mapBackendProductToProductItem(
  product: BackendPublicProduct,
): ProductItem {
  const availability = product.availability;
  const images = getProductImages(product);
  return {
    slug: product.slug,
    title: product.name,
    desc: product.description ?? "",
    category: product.category ?? "supplements",
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    image: images[0],
    images,
    goals: product.goals ?? [],
    topics: product.topics ?? [],
    price: product.price,
    currency: product.currency ?? "MAD",
    availability,
    badges: availability === "out_of_stock" ? ["Out of stock"] : undefined,
    featured: false,
  };
}

export function mapBackendProductToListItem(
  product: BackendPublicProduct,
): ProductListItem {
  const images = getProductImages(product);
  return {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    brand: product.brand ?? undefined,
    category: product.category ?? "supplements",
    goals: product.goals ?? [],
    topics: product.topics ?? [],
    images: images.map((src) => ({ src, alt: product.name })),
    thumbnail: images[0],
    rating: product.rating ?? undefined,
    reviewCount: product.reviews ?? 0,
    price: product.price,
    currency: product.currency ?? "MAD",
    availability: product.availability,
    badges:
      product.availability === "out_of_stock" ? ["Out of stock"] : undefined,
    featured: false,
  };
}

export async function fetchPublicProducts(): Promise<BackendPublicProduct[]> {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const url = `${base}/api/v2/${PUBLIC_SHOP_COMPANY_SLUG}/public/products?limit=100`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Products API returned ${res.status}`);
  }

  const json = (await res.json()) as BackendPublicProductsResponse;
  return json.data ?? [];
}

export async function fetchPublicProductBySlug(
  slug: string,
): Promise<BackendPublicProduct | null> {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const url = `${base}/api/v2/${PUBLIC_SHOP_COMPANY_SLUG}/public/products/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Product API returned ${res.status}`);
  }

  const json = (await res.json()) as BackendPublicProductResponse;
  return json.data ?? null;
}
