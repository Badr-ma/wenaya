/**
 * Troubles API client — typed access to the real Wenaya backend Maux-Troubles
 * catalogue. Server-side only: consumed by SSR (and future BFF proxies), never
 * by client components.
 *
 * Transport handled by the shared server read client (`./api/client.ts`);
 * this module keeps the endpoint constants, the domain types, the Data Cache
 * window and the envelope/paginator shape validation that owns the payload.
 *
 * Endpoints (Laravel 11 backend, verified 2026-09-10):
 *   GET /api/v1/getAllPublicTroubles      → `{ error, message, data: paginator }`
 *     (paginator data = 8 visible troubles this run; ids descending 8→1)
 *   GET /api/v1/getTroubleBySlug/{slug}   → `{ error, message, data: record }`
 *
 * Record shape (probe-verified keys): id, name, description (HTML teaser),
 * details (rich HTML), image_web, image_mobile, slug, created_at, updated_at,
 * creator_id, causes (HTML), thumbnail, company_id, is_visible, locked,
 * specialties[] (full speciality records with `id`). No locale field exists —
 * content is French-only; the EN page renders it verbatim under EN chrome.
 */
import { wenayaApiGet } from "./api/client";
import type { LaravelEnvelope } from "./api/types";

export const TROUBLES_API_ENDPOINT = "/api/v1/getAllPublicTroubles";
export const TROUBLE_BY_SLUG_PREFIX = "/api/v1/getTroubleBySlug/";

/** A speciality record embedded in `trouble.specialties[]` (backend id = canonical key). */
export interface ApiTroubleSpeciality {
  id: number;
  fr_slug: string | null;
  en_slug: string | null;
  fr_name: string | null;
  en_name: string | null;
  [key: string]: unknown;
}

export interface ApiTrouble {
  id: number;
  name: string;
  description: string | null;
  details: string | null;
  image_web: string | null;
  image_mobile: string | null;
  thumbnail: string | null;
  slug: string;
  causes: string | null;
  created_at: string | null;
  updated_at: string | null;
  creator_id: number | null;
  company_id: number | null;
  is_visible: boolean | null;
  locked: boolean | null;
  specialties: ApiTroubleSpeciality[] | null;
}

/** By-slug payload — the record plus optional backend join keys (e.g. `creator`). */
export interface ApiTroubleDetails extends ApiTrouble {
  creator?: unknown;
}

export interface ApiTroublesPaginator {
  current_page: number;
  data: ApiTrouble[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  links: unknown[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export type ApiTroublesResponse = LaravelEnvelope<ApiTroublesPaginator>;
export type ApiTroubleDetailResponse = LaravelEnvelope<ApiTroubleDetails>;

/** Data Cache revalidation window for the backend troubles catalogue (1 hour). */
export const TROUBLES_API_REVALIDATE = 3600;

/** Runaway guard when paging through the entire dataset. */
const MAX_FETCH_PAGES = 50;

function isValidPaginator(value: unknown): value is ApiTroublesPaginator {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    Array.isArray(p.data) &&
    typeof p.current_page === "number" &&
    typeof p.last_page === "number" &&
    typeof p.total === "number"
  );
}

function isValidResponse(value: unknown): value is ApiTroublesResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.error === false && isValidPaginator(v.data);
}

function isValidDetailResponse(value: unknown): value is ApiTroubleDetailResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.error === false &&
    !!v.data &&
    typeof v.data === "object" &&
    typeof (v.data as Record<string, unknown>).id === "number"
  );
}

/**
 * Fetch a single 1-based page of troubles from the Wenaya backend.
 * Throws on network error, non-2xx, or an unexpected payload shape.
 * Result cached for `TROUBLES_API_REVALIDATE` seconds (Data Cache).
 */
export async function fetchTroublesPage(rawPage: number): Promise<ApiTroublesResponse> {
  const page = Math.max(1, Math.trunc(rawPage) || 1);

  const json = await wenayaApiGet<unknown>(TROUBLES_API_ENDPOINT, {
    query: { page },
    revalidate: TROUBLES_API_REVALIDATE,
  });

  if (!isValidResponse(json)) {
    throw new Error("Unexpected Wenaya troubles API payload");
  }
  return json;
}

/**
 * Fetch the whole troubles dataset by walking every page until the backend
 * reports the end (`next_page_url` null / current_page >= last_page).
 */
export async function fetchAllTroubles(): Promise<ApiTrouble[]> {
  const items: ApiTrouble[] = [];
  let page = 1;

  while (page <= MAX_FETCH_PAGES) {
    const res = await fetchTroublesPage(page);
    items.push(...res.data.data);
    if (res.data.data.length === 0) break;
    if (res.data.current_page >= res.data.last_page) break;
    page += 1;
  }

  return items;
}

/**
 * Fetch a single trouble by its backend slug. Returns the record or null when
 * the backend reports error / an unrecognizable payload / or 404.
 */
export async function fetchTroubleBySlug(slug: string): Promise<ApiTroubleDetails | null> {
  const safeSlug = encodeURIComponent(slug);

  try {
    const json = await wenayaApiGet<unknown>(`${TROUBLE_BY_SLUG_PREFIX}${safeSlug}`, {
      revalidate: TROUBLES_API_REVALIDATE,
    });

    if (!isValidDetailResponse(json)) return null;
    return json.data;
  } catch {
    return null;
  }
}