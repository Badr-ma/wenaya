/**
 * Dynamic sitemap generator — combines static pages, blog posts, product pages,
 * and specialist pages for both French and English locales.
 *
 * Every indexable FR URL has its EN equivalent. The sitemap uses the `alternates`
 * field so search engines can discover the locale pairings directly from the sitemap.
 *
 * Generated per request so Redis-backed specialists are always included.
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

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Helper: creates a FR+EN pair of sitemap entries with alternates */
function dual(frPath: string, opts: Partial<SitemapEntry> = {}): SitemapEntry[] {
  const enPath = `/en${frPath === "/" ? "" : frPath}`;
  const alt = { "x-default": `${SITE_URL}${frPath}`, en: `${SITE_URL}${enPath}` };
  return [
    { url: `${SITE_URL}${frPath}`, alternates: { languages: alt }, ...opts },
    { url: `${SITE_URL}${enPath}`, alternates: { languages: alt }, ...opts },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPublishedPosts();
  const productSlugs = await getProductSlugs();
  const specialists = await getAllSpecialistsAsync();

  /**
   * Static pages — core site pages with priority weights for SEO.
   * No lastModified: the data layer exposes no reliable content modification date.
   */
  const staticPages = [
    ...dual("/", { changeFrequency: "weekly", priority: 1.0 }),
    ...dual("/about", { changeFrequency: "monthly", priority: 0.9 }),
    ...dual("/solutions/entreprises", { changeFrequency: "monthly", priority: 0.9 }),
    ...dual("/solutions/entreprises/programmes", { changeFrequency: "monthly", priority: 0.8 }),
    ...dual("/produits", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/pratiques", { changeFrequency: "monthly", priority: 0.8 }),
    ...dual("/specialistes", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/blog", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/faq", { changeFrequency: "monthly", priority: 0.7 }),
    ...dual("/contact", { changeFrequency: "monthly", priority: 0.8 }),
    ...dual("/confidentialite", { changeFrequency: "yearly", priority: 0.2 }),
    ...dual("/conditions", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  /** Blog post URLs — shared slug set, both locales have the same posts */
  const blogEntries = posts.flatMap((post) =>
    dual(`/blog/${post.slug}`, { lastModified: new Date(post.publishedAt), changeFrequency: "monthly", priority: 0.8 })
  );

  /** Product detail page URLs — shared slug set */
  const productEntries = productSlugs.flatMap((slug) =>
    dual(`/produits/${slug}`, { changeFrequency: "monthly", priority: 0.7 })
  );

  /** Specialist profile page URLs — Redis-backed, shared slug set */
  const specialistEntries = specialists.flatMap((s) =>
    dual(`/specialistes/${s.slug}`, { changeFrequency: "monthly", priority: 0.8 })
  );

  return [...staticPages, ...blogEntries, ...productEntries, ...specialistEntries];
}
