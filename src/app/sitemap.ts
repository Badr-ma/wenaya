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
import { getAllPratiqueSlugs } from "@/lib/pratiques";
import { getAllGroupSessionSlugs } from "@/lib/group-sessions";
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
  const staticPages: SitemapEntry[] = [
    ...dual("/", { changeFrequency: "weekly", priority: 1.0 }),
    ...dual("/about", { changeFrequency: "monthly", priority: 0.9 }),
    ...dual("/corporate", { changeFrequency: "monthly", priority: 0.9 }),
    ...dual("/corporate/programmes", { changeFrequency: "monthly", priority: 0.8 }),
    ...dual("/produits", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/pratiques", { changeFrequency: "monthly", priority: 0.8 }),
    {
      url: `${SITE_URL}/seance-de-groupe`,
      alternates: {
        languages: {
          "x-default": `${SITE_URL}/seance-de-groupe`,
          "fr-MA": `${SITE_URL}/seance-de-groupe`,
          "en-MA": `${SITE_URL}/en/seance-de-groupe`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/en/seance-de-groupe`,
      alternates: {
        languages: {
          "x-default": `${SITE_URL}/seance-de-groupe`,
          "fr-MA": `${SITE_URL}/seance-de-groupe`,
          "en-MA": `${SITE_URL}/en/seance-de-groupe`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...dual("/professional", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/articles", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/faq", { changeFrequency: "monthly", priority: 0.7 }),
    ...dual("/contact", { changeFrequency: "monthly", priority: 0.8 }),
    ...dual("/confidentialite", { changeFrequency: "yearly", priority: 0.2 }),
    ...dual("/conditions", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  /** Blog post URLs — shared slug set, both locales have the same posts */
  const blogEntries = posts.flatMap((post) =>
    dual(`/articles/${post.slug}`, { lastModified: new Date(post.publishedAt), changeFrequency: "monthly", priority: 0.8 })
  );

  /** Product detail page URLs — shared slug set */
  const productEntries = productSlugs.flatMap((slug) =>
    dual(`/produits/${slug}`, { changeFrequency: "monthly", priority: 0.7 })
  );

  /** Specialist profile page URLs — Redis-backed, shared slug set */
  const specialistEntries = specialists.flatMap((s) =>
    dual(`/professional/${s.slug}`, { changeFrequency: "monthly", priority: 0.8 })
  );

  /** Practice detail page URLs — 19 FR + 19 EN */
  const practiceSlugs = getAllPratiqueSlugs();
  const practiceEntries = practiceSlugs.flatMap((slug) =>
    dual(`/pratiques/${slug}`, { changeFrequency: "monthly", priority: 0.7 })
  );

  /** Group-session detail page URLs — EN shares the FR slug under /en/seance-de-groupe */
  const groupSessionSlugs = getAllGroupSessionSlugs();
  const groupSessionEntries: SitemapEntry[] = [];
  groupSessionSlugs.forEach((slugFr) => {
    const alt = {
      "x-default": `${SITE_URL}/seance-de-groupe/${slugFr}`,
      "fr-MA": `${SITE_URL}/seance-de-groupe/${slugFr}`,
      "en-MA": `${SITE_URL}/en/seance-de-groupe/${slugFr}`,
    };
    groupSessionEntries.push({
      url: `${SITE_URL}/seance-de-groupe/${slugFr}`,
      alternates: { languages: alt },
      changeFrequency: "monthly",
      priority: 0.7,
    });
    groupSessionEntries.push({
      url: `${SITE_URL}/en/seance-de-groupe/${slugFr}`,
      alternates: { languages: alt },
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return [...staticPages, ...blogEntries, ...productEntries, ...specialistEntries, ...practiceEntries, ...groupSessionEntries];
}
