/**
 * Maux-Troubles assembler.
 *
 * HUB (`getTroublesHub`): the correction spec makes the hub a pure catalogue —
 * `getAllPublicTroubles`, each card a whole-card link to its OWN dynamic detail
 * route. No practice/pros resolution on the hub; no direct-routing to practices
 * from hub cards.
 *
 * DETAIL (`getTroubleDetail`): single-trouble page enriches the normalized
 * Trouble record with locale-aware related-practice links and
 * professional-search links, the same resolution policy the Clinic Health
 * Needs section uses:
 *
 *   practice link  ← specialty slug exists in the canonical practice dataset
 *                   (`getAllPratiques(locale)`) → `/pratiques/{slug}` / `/en/pratiques/{slug}`
 *   pros link      ← specialty slug exists in the LIVE professionals option set
 *                   (`getSpecialtyOptions(getLiveSpecialists())`) → `/search/{slug}` / `/en/search/{slug}`
 *
 * A trouble renders a practice row only when the discipline exists; a pros link
 * only when the `/search/{slug}` filter currently resolves at least one
 * professional. Never invented routes, never `href="#"`.
 *
 * NEIGHBORS (`getTroubleNeighbors`): prev/next navigation over the ordered
 * (backend page-walk) catalogue, linking only to detail routes. Errors tolerated
 * → both `null`.
 *
 * Failure policy: API error → `status: "error"` (page renders the error state);
 * zero visible records → `status: "empty"`. No fallback to static demo data.
 */
import { getAllPratiques } from "./pratiques";
import { getLiveSpecialists } from "./professionals";
import { getSpecialtyOptions } from "./specialist-filters";
import { getTroubles, getTroubleBySlug, type Trouble } from "./troubles";
import { h, troubleDetailHref } from "./href";

export interface TroubleHubPractice {
  slug: string;
  title: string;
  href: string;
  prosHref: string | null;
}

export interface TroubleHubItem extends Trouble {
  practices: TroubleHubPractice[];
}

export type TroublesHubStatus = "ok" | "empty" | "error";

export interface TroublesHubResult {
  status: TroublesHubStatus;
  items: Trouble[];
}

/** Prev/next navigation link for the detail-page trail (detail routes only). */
export interface TroubleNavLink {
  slug: string;
  name: string;
  href: string;
}

export interface TroubleNeighbors {
  prev: TroubleNavLink | null;
  next: TroubleNavLink | null;
}

/** Locale-resolved practice/pros page data used by the detail pages. */
async function buildPracticeMaps(locale: "fr" | "en") {
  const specialists = await getLiveSpecialists().catch(() => []);
  const practiceBySlug = new Map(getAllPratiques(locale).map((p) => [p.slug, p.title]));
  const proSlugs = new Set(getSpecialtyOptions(specialists).map((o) => o.slug));
  return { practiceBySlug, proSlugs };
}

function resolvePractices(
  trouble: Pick<Trouble, "specialtySlugs">,
  locale: "fr" | "en",
  practiceBySlug: Map<string, string>,
  proSlugs: Set<string>
): TroubleHubPractice[] {
  return trouble.specialtySlugs
    .filter((slug) => practiceBySlug.has(slug))
    .map<TroubleHubPractice>((slug) => ({
      slug,
      title: practiceBySlug.get(slug) as string,
      href: h(locale, `/pratiques/${slug}`),
      prosHref: proSlugs.has(slug) ? h(locale, `/search/${slug}`) : null,
    }));
}

export async function getTroublesHub(): Promise<TroublesHubResult> {
  try {
    const items = await getTroubles();
    return { status: items.length === 0 ? "empty" : "ok", items };
  } catch (error) {
    console.error("[troubles-hub] failed to load maux-troubles catalogue:", error);
    return { status: "error", items: [] };
  }
}

/**
 * Resolve the previous/next trouble over the ordered catalogue. Uses only
 * detail routes (`troubleDetailHref`) — never practices. Boundary/unknown slug
 * → that side is `null`; any backend error → both `null`.
 */
export async function getTroubleNeighbors(
  locale: "fr" | "en",
  slug: string
): Promise<TroubleNeighbors> {
  try {
    const troubles = await getTroubles();
    const index = troubles.findIndex((trouble) => trouble.slug === slug);
    if (index === -1) return { prev: null, next: null };
    const toNav = (trouble: Trouble): TroubleNavLink => ({
      slug: trouble.slug,
      name: trouble.name,
      href: troubleDetailHref(locale, trouble.slug),
    });
    return {
      prev: index > 0 ? toNav(troubles[index - 1]) : null,
      next: index < troubles.length - 1 ? toNav(troubles[index + 1]) : null,
    };
  } catch (error) {
    console.error(`[troubles-hub] failed to resolve neighbors for "${slug}":`, error);
    return { prev: null, next: null };
  }
}

/**
 * Resolve a single backend-slug trouble (detail pages) with the same
 * locale-aware practice/pros resolution as the hub. Returns null when the
 * trouble is unknown OR the backend is unreachable (404 either way).
 */
export async function getTroubleDetail(
  locale: "fr" | "en",
  slug: string
): Promise<TroubleHubItem | null> {
  try {
    const trouble = await getTroubleBySlug(slug);
    if (!trouble) return null;
    const { practiceBySlug, proSlugs } = await buildPracticeMaps(locale);
    return {
      ...trouble,
      practices: resolvePractices(trouble, locale, practiceBySlug, proSlugs),
    };
  } catch (error) {
    console.error(`[troubles-hub] failed to resolve trouble detail "${slug}":`, error);
    return null;
  }
}