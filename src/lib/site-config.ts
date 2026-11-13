/**
 * Single source of truth for the site's canonical domain and brand identity.
 * Used by metadata (canonical, Open Graph, Twitter), robots.txt, sitemap.xml,
 * and structured data so every absolute URL resolves consistently.
 * Override with NEXT_PUBLIC_SITE_URL in the environment.
 */
import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.wenaya.com").replace(/\/+$/, "");

export const SITE_NAME = "Wenaya";
/** Set WENAYA_INDEXABLE=false on staging; production keeps its public sitemap. */
export const INDEXING_ENABLED = process.env.WENAYA_INDEXABLE !== 'false'
  && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production')
  && !/(^|[.\/])(dev-website|localhost|127\.0\.0\.1)([.:\/]|$)/i.test(SITE_URL);

/** Base Open Graph fields shared by every page — spread first, then override per page. */
export const OG_DEFAULTS: NonNullable<Metadata["openGraph"]> = {
  siteName: SITE_NAME,
  locale: "fr_MA",
  type: "website",
  images: ["/og-image.png"],
};

/** Base Twitter card fields shared by every page — spread first, then override per page. */
export const TWITTER_DEFAULTS: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  images: ["/og-image.png"],
};
