/**
 * Practice adapter — maps linked API specialities to the canonical local
 * `Pratique` model consumed by the UI.
 *
 * Slug canonicalization is keyed by backend `id` (== local `liveId`): the API's
 * `fr_slug` carries accents (e.g. `kinésithérapie`) while frontend routes are
 * ASCII (`kinesitherapie`). Locale resolution:
 *
 *   FR   → title/description from the API (fallback to the migrated local
 *          editorial content when the API value is missing or too thin).
 *   EN   → local translated content whenever `hasGenuineEn` is true (it is for
 *          all 19 practices) — the API stores French text in `en_name`/`en_slug`
 *          for several specialties, so we refuse to regress the EN UI.
 *   both → image always comes from the API. Existing articles retain local
 *          editorial content; new practices render backend details as text blocks.
 *
 * New IDs are accepted without a local counterpart, using a readable slug plus
 * the backend ID. Existing IDs retain their canonical URLs.
 */
import { practicesContent, type PracticeSection } from "./practice-content";
import { EN_ARTICLE_DEMO } from "./en-translations";
import type { ApiSpeciality } from "./practices-api";
import type { Pratique } from "./pratiques";
import { specialtyDisplayToSlug } from "./specialist-filters";

/**
 * backend id → canonical frontend slug (mirrors local `liveId`, practice-content.ts).
 * Derived from `practicesContent` to avoid duplication. Exported for the Troubles
 * adapter — its `specialties[]` embed full speciality records keyed by the same
 * backend id.
 */
export const SLUG_BY_LIVE_ID: Record<number, string> = (() => {
  const map: Record<number, string> = {};
  const seen = new Set<number>();
  for (const [slug, content] of Object.entries(practicesContent)) {
    const id = content.liveId;
    if (typeof id !== "number" || Number.isNaN(id)) {
      continue;
    }
    if (seen.has(id)) {
      console.warn(
        `[practice-adapter] duplicate liveId ${id} detected for slug "${slug}"; keeping first occurrence`
      );
      continue;
    }
    seen.add(id);
    map[id] = slug;
  }
  return map;
})();

/** Minimum meaningful description length — shorter API strings are treated as
 *  unusable (e.g. inline-styled leftovers that decode to a bare title). */
const MIN_DESCRIPTION_LENGTH = 24;

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

/** decode HTML entities, then strip tags and collapse whitespace → plain text. */
function decodeAndStrip(html: string): string {
  return decodeEntities(html)
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstNonEmpty(...values: (string | null | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = (value ?? "").trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

/**
 * Normalize one linked speciality into the domain model.
 * Returns null when the id has no local counterpart (unknown/offline-only data).
 */
export function normalizeApiSpeciality(api: ApiSpeciality, locale: string): Pratique | null {
  if (!Number.isSafeInteger(api.id) || api.id <= 0 || api.is_visible === false) return null;
  const knownSlug = SLUG_BY_LIVE_ID[api.id];
  const content = knownSlug ? practicesContent[knownSlug] : undefined;
  if (!content) {
    // Existing IDs retain their established URLs. New records need no local
    // registration; prefer the backend slug, then name, then stable ID.
    let slug = specialtyDisplayToSlug(firstNonEmpty(api.fr_slug, api.fr_name, api.en_slug, api.en_name) ?? "");
    // Include the immutable ID so duplicate names/slugs never share a route.
    slug = slug ? `${slug}-${api.id}` : `practice-${api.id}`;
    const title = locale === "en"
      ? firstNonEmpty(api.en_name, api.fr_name) ?? slug
      : firstNonEmpty(api.fr_name, api.en_name) ?? slug;
    const details = api.details
      ? api.details.split(/<\/(?:p|div|h[1-6]|li)>|<br\s*\/?\s*>|\r?\n/i).map(decodeAndStrip).filter(Boolean)
      : [];
    return {
      id: String(api.id), slug, title,
      description: api.description ? decodeAndStrip(api.description) : "",
      image: firstNonEmpty(api.image_web, api.image_mobile) ?? "",
      category: api.category?.trim() ?? "",
      article: details.length ? [{ body: details }] : undefined,
      liveId: api.id,
      specialtySlug: specialtyDisplayToSlug(firstNonEmpty(api.fr_name, api.en_name) ?? ""),
    };
  }
  const slug = knownSlug!;

  const isFr = locale !== "en";
  const article: PracticeSection[] | undefined = isFr ? content.articleFr : EN_ARTICLE_DEMO[slug];

  let title: string;
  let description: string;

  if (isFr) {
    title = firstNonEmpty(api.fr_name, content.titles.fr, api.en_name) ?? content.titles.fr;
    const decoded = api.description ? decodeAndStrip(api.description) : "";
    description =
      decoded.length >= MIN_DESCRIPTION_LENGTH
        ? decoded
        : firstNonEmpty(content.summaries.fr) ?? decoded;
  } else if (content.hasGenuineEn) {
    // EN stays fully local — the backend stores French for several EN fields.
    title = firstNonEmpty(content.titles.en, api.en_name, content.titles.fr) ?? api.en_name ?? content.titles.fr;
    description = firstNonEmpty(content.summaries.en, api.en_name) ?? "";
  } else {
    title = firstNonEmpty(api.en_name, api.fr_name, content.titles.en) ?? content.titles.en;
    const decoded = api.description ? decodeAndStrip(api.description) : "";
    description =
      decoded.length >= MIN_DESCRIPTION_LENGTH
        ? decoded
        : content.summaries.en;
  }

  // STRICT API-ONLY IMAGE RULE — the listing must reflect what the API actually
  // provides, nothing else. There is deliberately NO fallback to `content.image`
  // (local asset) and no demo/mock asset: an empty result means "the API supplied
  // no usable image" and the grid renders an empty image area. URLs that exist but
  // fail to load (404/500) are caught at render time by the grid's `onError`
  // handler, which hides the image without substituting anything.
  //
  // DEV-only policy: API-supplied image URLs pass through UNCHANGED — NO host
  // rewriting to api.wenaya.com (prod dependence is forbidden). Missing/broken
  // DEV images (e.g. dev-api.wenaya.com/storage 404s) are a DEV backend/storage
  // data problem — resolved there; the frontend only hides the image on load
  // failure. Other hosts (objectstorage, etc.) pass through untouched.
  const image = firstNonEmpty(api.image_web, api.image_mobile) ?? "";

  return {
    id: String(api.id),
    slug,
    title,
    description,
    image,
    category: content.category,
    article,
    liveId: api.id,
    sourceUrl: content.sourceUrl,
  };
}
