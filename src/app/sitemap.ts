/**
 * Dynamic sitemap generator — combines static pages, blog posts, the products
 * listing, and specialist pages for both French and English locales.
 *
 * Every indexable FR URL has its EN equivalent. The sitemap uses the `alternates`
 * field so search engines can discover the locale pairings directly from the sitemap.
 *
 * Generated per request so the live API set (specialists, articles, practices)
 * is always reflected.
 */
import type { MetadataRoute } from "next";
import { fetchAllArticles, blogApiErrorLabel } from "@/lib/blog-articles-api";
import { getLiveSpecialists } from "@/lib/professionals";
import { getSpecialtyOptions } from "@/lib/specialist-filters";
import { getAllPratiqueSlugs } from "@/lib/pratiques";
import { getAllTroubleSlugs } from "@/lib/troubles";
import { getAllProgrammeSlugs } from "@/lib/corporate-programmes";
import { getAllGroupSessionSlugs } from "@/lib/group-sessions";
import { getAllCareJourneySlugs } from "@/lib/care-journeys";
import { SITE_URL } from "@/lib/site-config";

/** Regenerate the sitemap on every request so CMS/Redis additions appear immediately */
export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * XML-escape a URL destined for the sitemap document. Next.js's sitemap
 * serialization interpolates `url` and alternate `href` values into the XML
 * verbatim with no escaping, so a raw `&` in a path (the care-journey slugs
 * "grossesse-&-maternite" / "kinesitherapie-&-avc") would emit invalid XML.
 * Only a bare `&` is escaped to `&amp;`; already-escaped entities are left
 * untouched so nothing is ever double-escaped.
 */
function xmlEscapeUrl(value: string): string {
  return value.replace(
    /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g,
    "&amp;"
  );
}

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
  let articles: Awaited<ReturnType<typeof fetchAllArticles>> = [];
  try {
    articles = await fetchAllArticles();
  } catch (error) {
    console.error(`[blog] sitemap article fetch failed: ${blogApiErrorLabel(error)}`);
    articles = [];
  }
  /**
   * Specialists come from the LIVE API only (`getLiveSpecialists`, no
   * Redis/demo fallback). Fetched ONCE and reused for both the profile URLs and
   * the derived `/search/<specialty>` slugs, so the two sets can never drift
   * apart. An unreachable API yields an empty list → those entries are simply
   * omitted for that request (the sitemap stays valid, never 500s).
   */
  const liveSpecialists = await getLiveSpecialists();

  /**
   * Static pages — core site pages with priority weights for SEO.
   * No lastModified: the data layer exposes no reliable content modification date.
   */
  const staticPages: SitemapEntry[] = [
    ...dual("/", { changeFrequency: "weekly", priority: 1.0 }),
    ...dual("/about-us", { changeFrequency: "monthly", priority: 0.9 }),
    {
      url: `${SITE_URL}/clinique/wenaya-casablanca`,
      alternates: {
        languages: {
          "x-default": `${SITE_URL}/clinique/wenaya-casablanca`,
          "fr-MA": `${SITE_URL}/clinique/wenaya-casablanca`,
          "en-MA": `${SITE_URL}/en/clinic/wenaya-casablanca`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/en/clinic/wenaya-casablanca`,
      alternates: {
        languages: {
          "x-default": `${SITE_URL}/clinique/wenaya-casablanca`,
          "fr-MA": `${SITE_URL}/clinique/wenaya-casablanca`,
          "en-MA": `${SITE_URL}/en/clinic/wenaya-casablanca`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...dual("/corporate", { changeFrequency: "monthly", priority: 0.9 }),
    ...dual("/corporate/programmes", { changeFrequency: "monthly", priority: 0.8 }),
    ...getAllProgrammeSlugs().flatMap((slug) =>
      dual(`/corporate/programmes/${slug}`, { changeFrequency: "monthly", priority: 0.8 })
    ),
    {
      url: `${SITE_URL}/soins-a-domicile`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...dual("/produits", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/pratiques", { changeFrequency: "monthly", priority: 0.8 }),
    ...dual("/parcours-de-soins", { changeFrequency: "monthly", priority: 0.8 }),
    {
      url: `${SITE_URL}/maux-troubles`,
      alternates: {
        languages: {
          "x-default": `${SITE_URL}/maux-troubles`,
          "fr-MA": `${SITE_URL}/maux-troubles`,
          "en-MA": `${SITE_URL}/en/health-needs`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/en/health-needs`,
      alternates: {
        languages: {
          "x-default": `${SITE_URL}/maux-troubles`,
          "fr-MA": `${SITE_URL}/maux-troubles`,
          "en-MA": `${SITE_URL}/en/health-needs`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.8,
    },
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
    ...dual("/search/all", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/articles", { changeFrequency: "weekly", priority: 0.9 }),
    ...dual("/faq", { changeFrequency: "monthly", priority: 0.7 }),
    ...dual("/contact-us", { changeFrequency: "monthly", priority: 0.8 }),
    ...dual("/privacy-policy", { changeFrequency: "yearly", priority: 0.2 }),
    ...dual("/terms-and-conditions", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  /** Blog post URLs — shared slug set, both locales have the same posts */
  const blogEntries = articles.flatMap((article) => {
    const stamp = article.createdAt ?? article.updatedAt;
    return dual(`/articles/${article.slug}`, {
      lastModified: stamp ? new Date(stamp) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  /**
   * Product detail URLs — NOT emitted while the shop launch freeze is on:
   * /produits/{slug} temporarily 307s to the /produits listing (see
   * next.config.ts Category 6), and redirected URLs must not be advertised
   * in the sitemap. The listing itself stays indexable via staticPages above.
   */
  /** Specialist profile page URLs — LIVE API, shared slug set */
  const specialistEntries = liveSpecialists.flatMap((s) =>
    dual(`/professional/${s.slug}`, { changeFrequency: "monthly", priority: 0.8 })
  );

  /**
   * Professionals search pages — /search/all (in staticPages above) plus one
   * pre-filtered /search/<specialty> URL per verified specialty slug, derived
   * from the SAME live dataset the listing pages filter. Derived live so a new
   * backend specialty automatically appears here.
   */
  const searchSlugs = getSpecialtyOptions(liveSpecialists).map((o) => o.slug);
  const searchEntries = searchSlugs.flatMap((slug) =>
    dual(`/search/${slug}`, { changeFrequency: "monthly", priority: 0.8 })
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

  /** Care-journey detail page URLs — 7 FR + 7 EN (EN shares the FR slug under /en/parcours-de-soins) */
  const careJourneyEntries = getAllCareJourneySlugs().flatMap((slug) =>
    dual(`/parcours-de-soins/${slug}`, { changeFrequency: "monthly", priority: 0.7 })
  );

  /** Maux-troubles detail page URLs — live backend slugs; EN lives under /en/health-needs (strict segment split) */
  const troubleSlugs = await getAllTroubleSlugs();
  const troubleEntries: SitemapEntry[] = [];
  troubleSlugs.forEach((slug) => {
    const alt = {
      "x-default": `${SITE_URL}/maux-troubles/${slug}`,
      "fr-MA": `${SITE_URL}/maux-troubles/${slug}`,
      "en-MA": `${SITE_URL}/en/health-needs/${slug}`,
    };
    troubleEntries.push({
      url: `${SITE_URL}/maux-troubles/${slug}`,
      alternates: { languages: alt },
      changeFrequency: "monthly",
      priority: 0.7,
    });
    troubleEntries.push({
      url: `${SITE_URL}/en/health-needs/${slug}`,
      alternates: { languages: alt },
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  const entries: SitemapEntry[] = [
    ...staticPages,
    ...blogEntries,
    ...specialistEntries,
    ...searchEntries,
    ...practiceEntries,
    ...groupSessionEntries,
    ...careJourneyEntries,
    ...troubleEntries,
  ];

  return entries.map((entry) => ({
    ...entry,
    url: xmlEscapeUrl(entry.url),
    alternates: entry.alternates
      ? {
          ...entry.alternates,
          languages: entry.alternates.languages
            ? Object.fromEntries(
                Object.entries(entry.alternates.languages).flatMap(
                  ([lang, href]): [string, string][] =>
                    typeof href === "string"
                      ? [[lang, xmlEscapeUrl(href)]]
                      : []
                )
              )
            : undefined,
        }
      : undefined,
  }));
}
