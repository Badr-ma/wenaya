/**
 * Product Domain Model — single source of truth for product/entity data across the application.
 *
 * Designed to represent both current demo products and future backend entities
 * (brands, supplements, devices, wearables, programs, etc.).
 *
 * Fields marked optional may not exist in the current demo data.
 * UI components must gracefully handle missing optional fields.
 */

export interface ProductSEO {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
}

export interface ProductImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;

  shortDescription?: string;

  brand?: string;
  brandSlug?: string;

  category: string;
  categories?: string[];

  goals: string[];
  topics: string[];

  images: ProductImage[];
  thumbnail?: string;

  rating?: number;
  reviewCount?: number;

  price?: number;
  currency?: string;

  availability?: "in_stock" | "out_of_stock" | "pre_order" | "limited";

  purchaseUrl?: string;
  websiteUrl?: string;

  benefits?: string[];
  ingredients?: string[];
  specifications?: Record<string, string>;

  badges?: string[];

  createdAt?: string;
  updatedAt?: string;

  featured?: boolean;

  seo?: ProductSEO;
}

/** Lightweight product representation for listing cards */
export type ProductListItem = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "description"
  | "shortDescription"
  | "brand"
  | "brandSlug"
  | "category"
  | "categories"
  | "goals"
  | "topics"
  | "images"
  | "thumbnail"
  | "rating"
  | "reviewCount"
  | "price"
  | "currency"
  | "availability"
  | "badges"
  | "featured"
>;
