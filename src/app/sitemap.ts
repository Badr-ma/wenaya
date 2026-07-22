/**
 * Dynamic sitemap generator — combines static pages, blog posts, product pages, and specialist pages.
 * Runs at build time to generate /sitemap.xml for search engine crawling.
 */
import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { getAllSpecialists } from "@/lib/specialistes";

const BASE = "https://www.wenaya.com";

/** Fixed last-modified date — update when site content structurally changes */
const LAST_MODIFIED = new Date("2025-07-22");

/** Dynamically imports the French translations to extract product slugs */
async function getProductSlugs(): Promise<string[]> {
  const { default: fr } = await import("@/i18n/fr");
  const items = fr.produits.items as { slug: string }[];
  return items.map((p) => p.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPublishedPosts();
  const productSlugs = await getProductSlugs();
  const specialists = getAllSpecialists();

  /** Static pages — core site pages with priority weights for SEO */
  const staticPages = [
    { url: BASE, lastModified: LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE}/about`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/solutions/entreprises`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/solutions/entreprises/programmes`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/produits`, lastModified: LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/pratiques`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/specialistes`, lastModified: LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/confidentialite`, lastModified: LAST_MODIFIED, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE}/conditions`, lastModified: LAST_MODIFIED, changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  /** Blog post URLs — generated from published posts data */
  const blogEntries = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  /** Product detail page URLs — generated from product slugs */
  const productEntries = productSlugs.map((slug) => ({
    url: `${BASE}/produits/${slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /** Specialist profile page URLs — generated from specialist data */
  const specialistEntries = specialists.map((s) => ({
    url: `${BASE}/specialistes/${s.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogEntries, ...productEntries, ...specialistEntries];
}
