/**
 * Blog / Articles API adapter — typed read access to the Wenaya Blog backend
 * public feed. Server-side only: consumed by SSR/prerender, never by the
 * browser directly (the backend host must not reach client bundles).
 *
 * Transport handled by the shared server read client (`./api/client.ts`);
 * this module owns the endpoint constants, the domain types, the envelope
 * validation and the normalization (creator PII projection + safe-HTML
 * pipeline).
 *
 * Endpoints (verified 2026-09-15, see
 * `wenaya-blog-articles-contract-phase2-report.md` §A/§B):
 *   - LISTING `GET /api/v1/public/articles?page={page}` — HTTP 200, returns a
 *     **FLAT Laravel paginator** (NOT the `{error,message,data}` envelope used
 *     by practices/group-sessions). Top-level keys (13): current_page, data,
 *     first_page_url, from, last_page, last_page_url, links, next_page_url,
 *     path, per_page, prev_page_url, to, total.
 *   - DETAIL  `GET /api/v1/public/articles/{slug}` — HTTP 200, returns the
 *     bare record (13 keys: id, title, description, details, image, slug,
 *     created_at, updated_at, creator_id, company_id, thumbnail, locked,
 *     creator); unknown slug → 404 (adapter → null).
 *
 * `creator` is a FULL Laravel User object (~50 keys incl. email/phone/PII).
 * This adapter projects it down to `{id, firstName, lastName, avatar}` at the
 * boundary — nothing else ever leaves this module.
 *
 * `description`/`details` carry entity-encoded HTML. This module runs
 * `description` through `htmlToText` (entities decoded, tags stripped →
 * a single clean plain-text line for headers/listing/SEO summaries) and
 * `details` through `sanitizeSafeHtml` (decode→whitelist pipeline, never
 * double-decoded) — the body keeps sanitized HTML while summaries never
 * render literal tags.
 */
import { wenayaApiGet, WenayaApiError, WENAYA_API_BASE } from "./api/client";
import { sanitizeSafeHtml, htmlToText } from "./sanitize-html";

/** Back-compat alias — the shared base owns env resolution (see client.ts). */
export const BLOG_ARTICLES_API_BASE = WENAYA_API_BASE;

/** Listing endpoint (full path incl. version prefix; flat paginator). */
export const BLOG_ARTICLES_LISTING_ENDPOINT = "/api/v1/public/articles";

/** Detail endpoint prefix; callers append `/{slug}`. */
export const BLOG_ARTICLES_DETAIL_PREFIX = "/api/v1/public/articles/";

/** Data Cache revalidation window for reads (10 minutes). */
export const BLOG_ARTICLES_API_REVALIDATE = 600;

/** Runaway guard if the backend ever grows past this many pages. */
const MAX_FETCH_PAGES = 50;

/* ------------------------------------------------------------------------ */
/* Domain types (normalized, locale-agnostic)                              */
/* ------------------------------------------------------------------------ */

/** Projected creator identity — PII never leaves the adapter boundary. */
export interface ArticleCreator {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  slug: string | null;
}

/** One listing row (short form). */
export interface ArticleSummary {
  id: number;
  slug: string;
  title: string;
  /** Plain text (tags stripped) — safe for headers, listing cards, meta. */
  description: string | null;
  image: string | null;
  thumbnail: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  locked: boolean;
  creator: ArticleCreator | null;
}

/** Full article body (short form + sanitized long-form `details`). */
export interface ArticleDetail extends ArticleSummary {
  details: string | null;
}

/** Normalized listing page (flat paginator metadata). */
export interface ArticlePage {
  articles: ArticleSummary[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  hasNextPage: boolean;
}

/* ------------------------------------------------------------------------ */
/* Raw wire shapes (validated defensively, then normalized)                */
/* ------------------------------------------------------------------------ */

interface RawPaginator {
  current_page: number;
  data: unknown[];
  last_page: number;
  per_page: number;
  total: number;
  /* other Laravel paginator keys are ignored (first_page_url, links, …) */
}

interface RawArticleRow {
  id: number | string;
  slug: string;
  title: string;
  description: string | null;
  details: string | null;
  image: string | null;
  thumbnail: string | null;
  created_at: string | null;
  updated_at: string | null;
  locked: boolean;
  creator?: Record<string, unknown> | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isValidRawPaginator(value: unknown): value is RawPaginator {
  if (!isRecord(value)) return false;
  return (
    typeof value.current_page === "number" &&
    Array.isArray(value.data) &&
    typeof value.last_page === "number" &&
    typeof value.per_page === "number" &&
    typeof value.total === "number"
  );
}

function isValidRawRow(value: unknown): value is RawArticleRow {
  if (!isRecord(value)) return false;
  return (
    (typeof value.id === "number" || typeof value.id === "string") &&
    typeof value.slug === "string" &&
    value.slug.trim().length > 0
  );
}

/* ------------------------------------------------------------------------ */
/* Normalization helpers                                                   */
/* ------------------------------------------------------------------------ */

function toCreator(value: unknown): ArticleCreator | null {
  if (!isRecord(value)) return null;
  return {
    id:
      typeof value.id === "number" || typeof value.id === "string"
        ? Number(value.id) || 0
        : 0,
    firstName: typeof value.first_name === "string" ? value.first_name : null,
    lastName: typeof value.last_name === "string" ? value.last_name : null,
    avatar: typeof value.avatar === "string" ? value.avatar : null,
    slug: typeof value.slug === "string" ? value.slug : null,
  };
}

function toSummary(raw: RawArticleRow): ArticleSummary {
  return {
    id: Number(raw.id) || 0,
    slug: raw.slug,
    title: typeof raw.title === "string" ? raw.title : "",
    description:
      typeof raw.description === "string" ? htmlToText(raw.description) : null,
    image: typeof raw.image === "string" ? raw.image : null,
    thumbnail: typeof raw.thumbnail === "string" ? raw.thumbnail : null,
    createdAt:
      typeof raw.created_at === "string" ? raw.created_at : null,
    updatedAt:
      typeof raw.updated_at === "string" ? raw.updated_at : null,
    locked: raw.locked === true,
    creator: toCreator(raw.creator ?? null),
  };
}

function toDetail(raw: RawArticleRow): ArticleDetail {
  return {
    ...toSummary(raw),
    details: typeof raw.details === "string" ? sanitizeSafeHtml(raw.details) : null,
  };
}

/* ------------------------------------------------------------------------ */
/* Adapter API                                                             */
/* ------------------------------------------------------------------------ */

/**
 * Fetch one 1-based page of article summaries from the backend.
 * Returns a fully normalized `ArticlePage`. Throws on network error, non-2xx,
 * or an unexpected (non-flat-paginator) payload shape.
 */
export async function getArticlesPage(rawPage: number = 1): Promise<ArticlePage> {
  const page = Math.max(1, Math.trunc(rawPage) || 1);

  const json = await wenayaApiGet<unknown>(BLOG_ARTICLES_LISTING_ENDPOINT, {
    query: { page },
    revalidate: BLOG_ARTICLES_API_REVALIDATE,
  });

  if (!isValidRawPaginator(json)) {
    throw new Error("Unexpected Wenaya articles listing payload");
  }

  const rows = (json.data as unknown[])
    .filter(isValidRawRow)
    .filter((row) => row.locked !== true)
    .map(toSummary);

  return {
    articles: rows,
    currentPage: json.current_page,
    lastPage: json.last_page,
    perPage: json.per_page,
    total: json.total,
    hasNextPage: json.current_page < json.last_page,
  };
}

/**
 * Fetch the WHOLE active article set by walking every page until the backend
 * reports the end (current_page >= last_page) — the filters/search sibling.
 */
export async function fetchAllArticles(): Promise<ArticleSummary[]> {
  const articles: ArticleSummary[] = [];
  let page = 1;

  while (page <= MAX_FETCH_PAGES) {
    const res = await getArticlesPage(page);
    articles.push(...res.articles);
    if (res.articles.length === 0) break;
    if (res.currentPage >= res.lastPage) break;
    page += 1;
  }

  return articles;
}

/**
 * Fetch one article by slug. Returns the fully normalized detail, or null on
 * a backend 404 (so callers can `notFound()`).
 */
export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const trimmed = typeof slug === "string" ? slug.trim() : "";
  if (!trimmed) return null;

  let json: unknown;
  try {
    json = await wenayaApiGet<unknown>(
      `${BLOG_ARTICLES_DETAIL_PREFIX}${encodeURIComponent(trimmed)}`,
      { revalidate: BLOG_ARTICLES_API_REVALIDATE }
    );
  } catch (error) {
    if (error instanceof WenayaApiError && error.status === 404) return null;
    throw error;
  }

  if (json === null || json === undefined) return null; // backend 404
  if (!isValidRawRow(json)) {
    throw new Error("Unexpected Wenaya article detail payload");
  }

  return toDetail(json);
}
