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
 *   both → image always prefers the live API image; article stays purely local
 *          (practice-content.ts / EN demo translations).
 *
 * Items whose id has no local counterpart are logged and skipped — never
 * silently routed to a 404 detail page.
 */
import { practicesContent, type PracticeSection } from "./practice-content";
import { EN_ARTICLE_DEMO } from "./en-translations";
import type { ApiSpeciality } from "./practices-api";
import type { Pratique } from "./pratiques";

/** backend id → canonical frontend slug (mirrors local `liveId`, practice-content.ts). */
const SLUG_BY_LIVE_ID: Record<number, string> = {
  2: "psychomotricite",
  3: "orthophonie",
  4: "kinesitherapie",
  5: "nutrition",
  6: "naturopathie",
  7: "neuropsychologie",
  8: "sexologie",
  9: "cupping-therapy-hijama",
  11: "psychologie",
  12: "yoga",
  13: "meditation",
  14: "psychotherapie",
  16: "massotherapie",
  18: "art-martial-therapie",
  22: "osteopathie",
  23: "sono-therapie",
  24: "coaching-sportif",
  25: "sophrologie",
  26: "infirmerie",
};

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
  const slug = SLUG_BY_LIVE_ID[api.id];
  if (!slug) {
    console.warn(`[practice-adapter] unknown speciality id ${api.id} (${api.fr_slug}) — skipped`);
    return null;
  }

  const content = practicesContent[slug];
  if (!content) {
    console.warn(`[practice-adapter] no local content for speciality id ${api.id} (slug ${slug}) — skipped`);
    return null;
  }

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

  const image = firstNonEmpty(api.image_web, api.image_mobile, content.image) ?? content.image;

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