/**
 * Practices API client — typed access to the real Wenaya backend listing
 * endpoint. Server-side only: consumed by SSR and the `/api/pratiques` proxy,
 * never by the browser directly.
 *
 * Endpoint: GET /api/v1/getAllPublicSpecialitiesWithPaginate (Laravel 11 back
 * end, `X-Powered-By: Yolo`). Verified behavior:
 *   - the server hardcodes per_page = 12 — `per_page`/`limit`/`page[size]`
 *     query params are ignored, so pagination is fixed at 12 items/page
 *   - `page` is 1-based; 0/-1 clamp to 1; out-of-range pages return an empty
 *     `data` array gracefully
 *   - no `has_more` field — derive from `current_page < last_page`
 *   - POST is unsupported (405); search/category/filter params are ignored
 *   - response envelope: `{ error, message, data: Laravel paginator }`
 */
export const PRACTICES_API_BASE =
  process.env.PRACTICES_API_URL || "https://api.wenaya.com";
export const PRACTICES_API_ENDPOINT = "/api/v1/getAllPublicSpecialitiesWithPaginate";

export interface ApiSpeciality {
  id: number;
  ar_name: string | null;
  en_name: string | null;
  fr_name: string | null;
  ar_slug: string | null;
  en_slug: string | null;
  fr_slug: string | null;
  search_count: number | null;
  ar_displayed_name: string | null;
  fr_displayed_name: string | null;
  en_displayed_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  category: string | null;
  description: string | null;
  details: string | null;
  image_web: string | null;
  image_mobile: string | null;
  icon: string | null;
  is_visible: boolean | null;
  color: string | null;
  company_id: number | null;
  locked: boolean | null;
  company_priority: number | null;
}

interface ApiPaginatorLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApiSpecialitiesPaginator {
  current_page: number;
  data: ApiSpeciality[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: ApiPaginatorLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ApiSpecialitiesResponse {
  error: boolean;
  message: string | null;
  data: ApiSpecialitiesPaginator;
}

/** Data Cache revalidation window for the backend listing (1 hour). */
export const PRACTICES_API_REVALIDATE = 3600;

/** Runaway guard when paging through the entire dataset. */
const MAX_FETCH_PAGES = 50;

function isValidPaginator(value: unknown): value is ApiSpecialitiesPaginator {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    Array.isArray(p.data) &&
    typeof p.current_page === "number" &&
    typeof p.last_page === "number" &&
    typeof p.total === "number"
  );
}

function isValidResponse(value: unknown): value is ApiSpecialitiesResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.error === false && isValidPaginator(v.data);
}

/**
 * Fetch a single 1-based page of practices from the Wenaya backend.
 * Throws on network error, non-2xx, or an unexpected payload shape.
 * Result is cached for `PRACTICES_API_REVALIDATE` seconds (Data Cache).
 */
export async function fetchSpecialitiesPage(rawPage: number): Promise<ApiSpecialitiesResponse> {
  const page = Math.max(1, Math.trunc(rawPage) || 1);
  const url = `${PRACTICES_API_BASE}${PRACTICES_API_ENDPOINT}?page=${page}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: PRACTICES_API_REVALIDATE },
  });

  if (!response.ok) {
    throw new Error(`Wenaya practices API HTTP ${response.status}`);
  }

  const json: unknown = await response.json();
  if (!isValidResponse(json)) {
    throw new Error("Unexpected Wenaya practices API payload");
  }
  return json;
}

/**
 * Fetch the whole visible practice dataset by walking every page until the
 * backend reports the end (`next_page_url` null / current_page >= last_page).
 * Used for filter/search queries, which must run over the FULL dataset before
 * local pagination (never on a single loaded page).
 */
export async function fetchAllSpecialities(): Promise<ApiSpeciality[]> {
  const items: ApiSpeciality[] = [];
  let page = 1;

  while (page <= MAX_FETCH_PAGES) {
    const res = await fetchSpecialitiesPage(page);
    items.push(...res.data.data);
    if (res.data.data.length === 0) break;
    if (res.data.current_page >= res.data.last_page) break;
    page += 1;
  }

  return items;
}