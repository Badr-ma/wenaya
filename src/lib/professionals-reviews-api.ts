/**
 * Professional reviews API client — typed access to the Wenaya backend
 * reviews endpoint. Server-side only: consumed by SSR during prerender/ISR,
 * never by the browser directly.
 *
 * Transport: plain `fetch` against the dev API (same host as the professionals
 * listing/detail — dev-api.wenaya.com today).
 *
 * Endpoint: GET /api/v1/getReviewsByProfessionalSlug/{userName} (Laravel/Yolo
 * backend). Verified behavior (2026-09-18, see `wenaya-professionals-reviews-report.md`):
 *   - `{userName}` accepts the listing slug OR the raw username (both share the
 *     same value on the roster, e.g. `khaoula-chah`)
 *   - HTTP header `company: 1` is sent (app-wide convention for the pro APIs);
 *     the reviews endpoints respond without it but we keep it for consistency
 *   - success envelope:
 *       { error: false, message: "", data: {
 *           reviews: { current_page, data: [...], per_page: 12, total, ... },
 *           counts: { total_reviews, note_1..note_5, average_rating }
 *         } }
 *     (counts are `null` when there are no reviews, not zero)
 *   - unknown slug -> 400 { error: true, message: "Not Found!", data: [] }
 *   - DEV currently carries ZERO reviews for every professional (roster scan
 *     of 22 pros + full id scan 1..260). A review-bearing professional today
 *     throws a Laravel 500 (`Call to undefined relationship [patient]`) — see
 *     report; the item decoder is deliberately defensive (documented contract
 *     is `createReview { rate, comment, professional }`).
 */

import { PROFESSIONALS_API_BASE } from "./professionals/config";

const REVIEWS_API_PATH = "/api/v1/getReviewsByProfessionalSlug";

/** Data Cache revalidation window (1 hour — matches the detail envelope). */
export const REVIEWS_API_REVALIDATE = 3600;

/** Default fetch timeout (15s — mirrors the other professionals clients). */
const TIMEOUT_MS = 15_000;

/**
 * Raw review item as returned by the dev API. Fields are intentionally loose:
 * no live payload is observable today (every roster pro has 0 reviews and the
 * backend 500s on review-bearing ids), so decoding is defensive — the adapter
 * tolerates `review_id`/`rate`/`comment` (documented contract) plus common
 * Laravel serializer variants.
 */
export type ApiReviewItem = {
  id?: unknown;
  review_id?: unknown;
  user?: { name?: unknown };
  patient?: { name?: unknown };
  client?: { name?: unknown };
  name?: unknown;
  rate?: unknown;
  rating?: unknown;
  note?: unknown;
  created_at?: unknown;
  date?: unknown;
  createdAt?: unknown;
  comment?: unknown;
  message?: unknown;
  text?: unknown;
  content?: unknown;
  specialty?: unknown;
  practice?: unknown;
  verified?: unknown;
  is_verified?: unknown;
};

/** Paginator slice inside the reviews envelope. */
interface ApiReviewsPage {
  total?: unknown;
  per_page?: unknown;
  data?: unknown;
}

/** Envelope shape returned by the endpoint. */
interface ApiReviewsResponse {
  error: boolean;
  message?: string;
  data?: {
    reviews?: ApiReviewsPage;
    counts?: Record<string, unknown>;
  } | null;
}

function isValidResponse(value: unknown): value is ApiReviewsResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.error !== false) return false;
  const data = v.data;
  if (!data || typeof data !== "object") return false;
  const reviews = (data as Record<string, unknown>).reviews;
  if (!reviews || typeof reviews !== "object") return false;
  const page = reviews as Record<string, unknown>;
  return Array.isArray(page.data) && typeof page.total === "number";
}

/**
 * Fetch the first page of reviews for a professional by slug/username.
 * Throws on network error, non-2xx, an unexpected payload shape, or an
 * error envelope (e.g. unknown slug -> 400). A valid success response with
 * `total: 0` returns `{ items: [], total: 0 }` — authoritative empty data.
 */
export async function fetchProfessionalReviewsApi(
  userName: string,
): Promise<{ items: ApiReviewItem[]; total: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const encoded = encodeURIComponent(userName);
    const url = `${PROFESSIONALS_API_BASE}${REVIEWS_API_PATH}/${encoded}?page=1`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", company: "1" },
      signal: controller.signal,
      next: { revalidate: REVIEWS_API_REVALIDATE },
    });

    if (!res.ok) {
      throw new Error(`Reviews API HTTP ${res.status}`);
    }

    const json: unknown = await res.json();

    if (!isValidResponse(json)) {
      throw new Error("Unexpected reviews API payload shape");
    }

    const page = json.data?.reviews as ApiReviewsPage;
    const items = Array.isArray(page.data)
      ? (page.data as ApiReviewItem[])
      : [];
    const total =
      typeof page.total === "number" && Number.isFinite(page.total)
        ? page.total
        : items.length;

    return { items, total };
  } finally {
    clearTimeout(timeout);
  }
}