/**
 * Troubles adapter — maps the live Wenaya backend Maux-Troubles catalogue to
 * the normalized model consumed by the `/maux-troubles` + `/en/health-needs`
 * pages.
 *
 * Normalization rules:
 *   - ONLY records with `is_visible !== false` are included (backend gate).
 *   - `description` → one-line plain text (HTML decoded + stripped).
 *   - `details` → sanitized semantic HTML (p/ul/ol/li/strong/em/br preserved)
 *     rendered via `dangerouslySetInnerHTML`; `causes` is included ONLY when it
 *     carries content distinct from the `details` intro (today it repeats it).
 *   - image → `image_web` ?? `image_mobile` ?? `thumbnail`.
 *   - `specialtySlugs` ← the trouble's `specialties[].id`, canonicalized to the
 *     frontend practice slug via the shared `SLUG_BY_LIVE_ID` map (id-keyed,
 *     exactly like the Practices adapter). Specialty ids without a local
 *     counterpart are skipped.
 *
 * Polish-by-design: NO fallback to the old static `health-needs.ts` — a real
 * empty catalogue or an API failure produces an explicit empty/error state on
 * the pages, never stale demo content. Throws on fetch failure; the page owns
 * the try/catch and the UX state.
 */
import { SLUG_BY_LIVE_ID } from "./practice-adapter";
import {
  fetchAllTroubles,
  fetchTroubleBySlug,
  type ApiTrouble,
} from "./troubles-api";
import { htmlToText, sanitizeSafeHtml } from "./sanitize-html";

export interface Trouble {
  id: number;
  slug: string;
  name: string;
  description: string;
  detailHtml: string;
  causesHtml: string;
  image: string | null;
  specialtySlugs: string[];
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(input: string): string {
  return input.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,
    (match, entity: string) => {
      const body = entity.slice(1);
      if (entity.startsWith("#x") || entity.startsWith("#X")) {
        const code = Number.parseInt(body, 16);
        return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : match;
      }
      if (entity.startsWith("#")) {
        const code = Number.parseInt(body, 10);
        return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : match;
      }
      return ENTITIES[entity] ?? match;
    }
  );
}

/** Strip tags and collapse whitespace to one clean line of plain text. */
function toOneLine(html: string): string {
  return decodeEntities(html)
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lower-cased, whitespace-collapsed plain text used for content comparison. */
function comparableText(html: string | null | undefined): string {
  return htmlToText(html ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Sanitized `causes` HTML, suppressed when it is empty or merely repeats text
 * already present in `details`. The current API dataset duplicates the intro
 * paragraph in `causes`, so this keeps the "Causes courantes" section honest
 * instead of echoing the intro. Never invents replacement content.
 */
function distinctCausesHtml(
  causes: string | null | undefined,
  details: string | null | undefined
): string {
  const causesText = comparableText(causes);
  if (!causesText) return "";
  if (comparableText(details).includes(causesText)) return "";
  return sanitizeSafeHtml(causes);
}

function toOneLineSafe(html: string | null | undefined): string {
  const line = toOneLine(html ?? "");
  return line;
}

function firstImage(trouble: ApiTrouble): string | null {
  const candidates = [trouble.image_web, trouble.image_mobile, trouble.thumbnail];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

function normalize(trouble: ApiTrouble): Trouble {
  const specialtySlugs = (trouble.specialties ?? [])
    .map((specialty) => SLUG_BY_LIVE_ID[specialty.id])
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

  return {
    id: trouble.id,
    slug: trouble.slug,
    name: trouble.name ?? "",
    description: toOneLineSafe(trouble.description),
    detailHtml: sanitizeSafeHtml(trouble.details),
    causesHtml: distinctCausesHtml(trouble.causes, trouble.details),
    image: firstImage(trouble),
    specialtySlugs: Array.from(new Set(specialtySlugs)),
  };
}

/** All visible troubles, in backend order, normalized for the UI. Throws on failure. */
export async function getTroubles(): Promise<Trouble[]> {
  const raw = await fetchAllTroubles();
  return raw
    .filter((trouble) => trouble.is_visible !== false)
    .map(normalize);
}

/** Resolve a single backend-slug trouble to the domain model (detail pages). Null when missing. */
export async function getTroubleBySlug(slug: string): Promise<Trouble | null> {
  const raw = await fetchTroubleBySlug(slug);
  if (!raw) return null;
  return normalize(raw);
}

/**
 * All visible trouble slugs (sitemap/generateStaticParams). Never throws —
 * returns [] on API failure so an encyclopaedia outage can't break the sitemap.
 */
export async function getAllTroubleSlugs(): Promise<string[]> {
  try {
    const troubles = await getTroubles();
    return troubles.map((trouble) => trouble.slug);
  } catch (error) {
    console.error("[troubles] failed to fetch trouble slugs:", error);
    return [];
  }
}