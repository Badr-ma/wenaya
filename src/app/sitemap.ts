/**
 * Dynamic sitemap generator — combines static pages, blog posts, product pages, and specialist pages.
 * Generated per request so Redis-backed specialists are always included and stay in sync
 * with the dynamic /specialistes pages.
 */
import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { getAllSpecialistsAsync } from "@/lib/specialistes";
import { SITE_URL } from "@/lib/site-config";

/** Regenerate the sitemap on every request so CMS/Redis additions appear immediately */
export const dynamic = "force-dynamic";

/** Dynamically imports the French translations to extract product slugs */
async function getProductSlugs(): Promise<string[]> {
  const { default: fr } = await import("@/i18n/fr");
  const items = fr.produits.items as { slug: string }[];
  return items.map((p) => p.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPublishedPosts();
  const productSlugs = await getProductSlugs();
  const specialists = await getAllSpecialistsAsync();

  /**
   * Static pages — core site pages with priority weights for SEO.
   * No lastModified: the data layer exposes no reliable content modification date
   * for these pages, so no timestamp is emitted rather than inventing one.
   */
  const staticPages = [
    { url: SITE_URL, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/solutions/entreprises`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/solutions/entreprises/programmes`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/produits`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/pratiques`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/specialistes`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/confidentialite`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/conditions`, changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  /** Blog post URLs — lastModified uses each post's authored publishedAt date */
  const blogEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  /** Product detail page URLs — generated from product slugs */
  const productEntries = productSlugs.map((slug) => ({
    url: `${SITE_URL}/produits/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /**
   * Specialist profile page URLs — uses the async Redis-backed source so admin-added
   * specialists are included automatically (same source as the /specialistes pages).
   */
  const specialistEntries = specialists.map((s) => ({
    url: `${SITE_URL}/specialistes/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogEntries, ...productEntries, ...specialistEntries];
}
