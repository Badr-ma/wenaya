/**
 * Professionals API client — typed access to the Wenaya backend professional
 * listing endpoint. Server-side only: consumed by SSR during prerender/ISR,
 * never by the browser directly.
 *
 * Transport: plain `fetch` against the dev API (not the shared production
 * client — the professionals listing lives on dev-api.wenaya.com today).
 * Uses Next.js Data Cache for ISR revalidation.
 *
 * Endpoint: GET /api/v1/getProfessionals/{companyId} (Laravel/Yolo backend).
 * Verified behavior (2026-09-14, see `wenaya-api-integration-master-plan.md`):
 *   - /1 = company ID 1 (Wenaya Clinic)
 *   - response is NOT paginated — flat array in `data`
 *   - response shape: `{ error: boolean, data: Professional[] }`
 *   - query params `?page=` and `?per_page=` are ignored
 *   - no Authorization header required
 */

import { PROFESSIONALS_API_BASE } from "./professionals/config";

const PROFESSIONALS_API_PATH = "/api/v1/getProfessionals/1";

/** Data Cache revalidation window (1 hour). */
export const PROFESSIONALS_API_REVALIDATE = 3600;

/** Default fetch timeout (15s). */
const TIMEOUT_MS = 15_000;

/**
 * Raw professional object as returned by the dev API.
 * Only 9 fields — far fewer than the frontend `Specialist` interface.
 */
export interface ApiProfessional {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  username: string;
  slug: string;
  speciality_names: string[];
  formattedCreatedAt: string;
  currency: string | null;
}

/** Envelope shape returned by the endpoint. */
interface ProfessionalsApiResponse {
  error: boolean;
  data: ApiProfessional[];
}

function isValidProfessional(value: unknown): value is ApiProfessional {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "number" &&
    typeof p.first_name === "string" &&
    typeof p.last_name === "string" &&
    typeof p.slug === "string" &&
    Array.isArray(p.speciality_names)
  );
}

function isValidResponse(value: unknown): value is ProfessionalsApiResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.error === false && Array.isArray(v.data);
}

/**
 * Fetch the full professional listing for Wenaya Clinic (company 1).
 * Throws on network error, non-2xx, or an unexpected payload shape.
 * Result is cached for `PROFESSIONALS_API_REVALIDATE` seconds (Data Cache).
 */
export async function fetchProfessionals(): Promise<ApiProfessional[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${PROFESSIONALS_API_BASE}${PROFESSIONALS_API_PATH}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: PROFESSIONALS_API_REVALIDATE },
    });

    if (!res.ok) {
      throw new Error(`Professionals API HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!isValidResponse(json)) {
      throw new Error("Unexpected professionals API payload shape");
    }

    return json.data.filter(isValidProfessional);
  } finally {
    clearTimeout(timeout);
  }
}
