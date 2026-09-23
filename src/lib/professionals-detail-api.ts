/**
 * Professional detail API client — typed access to the Wenaya backend
 * professional detail endpoint. Server-side only: consumed by SSR during
 * prerender/ISR, never by the browser directly.
 *
 * Transport: plain `fetch` against the dev API (not the shared production
 * client — the professionals detail lives on dev-api.wenaya.com today).
 * Uses the Next.js Data Cache for ISR revalidation (1h), mirroring the
 * listing client (`professionals-api.ts`).
 *
 * Endpoint: GET /api/v1/getProfessionalBySlug/{slug} (Laravel/Yolo backend).
 * Verified behavior (2026-09-14, see `wenaya-api-integration-master-plan.md`):
 *   - envelope: `{ error: boolean, message: string, data: { user,
 *     professional, specialities[], worktimes } }`
 *   - `slug` is the routing identifier (NOT `username`)
 *   - the two sibling detail endpoints are BROKEN (500) on both dev+prod:
 *     getProfessionalDetailsBySlug (ambiguous `slug` column) and
 *     getProfessionalByUsername (missing validateSlug) — never used here
 *   - no Authorization header required
 *
 * Mapping contract (see `professionals-detail.ts`):
 *   name          ← user.first_name + " " + user.last_name
 *   photo         ← user.avatar (fallback professional.logo)
 *   specialities  ← specialities[].fr_name (l10n) / [].en_name
 *   rating/count  ← professional.avg_rating / total_reviews
 *   bio           ← professional.about_profile (HTML — sanitized in adapter)
 *   address       ← user.address.address_street_1 / lat / long
 *   appointment   ← professional.appointment_information (HTML — sanitized)
 *   Everything else (services, availability, certifications, reviews,
 *   languages, yearsExperience…) is NOT present on this endpoint and gets
 *   safe empty defaults — never invented.
 */

import { PROFESSIONALS_API_BASE } from "./professionals/config";

const PROFESSIONALS_DETAIL_PATH = "/api/v1/getProfessionalBySlug";

/**
 * Cares + packages endpoint. The legacy SPA called this lazily per
 * professional-tab; it is the ONLY source that carries services (name /
 * duration / price / delivery type) and package offers. Keyed by professional
 * user id (NOT the slug and NOT a practice id — `/1` as a practice id 404s).
 */
const CARES_PACKS_PATH = "/api/v1/getAllSpecialityWithCaresByProfessional";

/** Data Cache revalidation window (1 hour). */
export const PROFESSIONALS_DETAIL_REVALIDATE = 3600;

/** Default fetch timeout (15s). */
const TIMEOUT_MS = 15_000;

// ─── API shapes (verified against the 2026-09-14 sample payload) ────────

export interface ApiProfessionalDetailAddress {
  address_street_1: string | null;
  address_street_2: string | null;
  city: string | null;
  lat: string | null;
  long: string | null;
  zip: string | null;
}

export interface ApiProfessionalDetailUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  username: string;
  slug: string;
  formattedCreatedAt: string;
  currency: string | null;
  address: ApiProfessionalDetailAddress | null;
}

export interface ApiProfessionalDetailProfessional {
  user: number;
  logo: string | null;
  images: unknown;
  slug: string;
  appointment_information: string | null;
  about_profile: string | null;
  is_in_ghost_mode: string;
  avg_rating: string | number | null;
  total_reviews: string | number | null;
  practice: { logo: string; name: string } | null;
  is_favorite: boolean;
}

export interface ApiProfessionalDetailSpeciality {
  id: number;
  fr_name: string;
  en_name: string;
  ar_name: string;
  fr_slug: string;
  en_slug: string;
  ar_slug: string;
  color: string;
}

export interface ApiProfessionalDetail {
  user: ApiProfessionalDetailUser;
  professional: ApiProfessionalDetailProfessional;
  specialities: ApiProfessionalDetailSpeciality[];
  worktimes: unknown;
}

/** Envelope shape returned by the endpoint. */
interface ProfessionalDetailResponse {
  error: boolean;
  message: string;
  data: ApiProfessionalDetail;
}

// ─── Cares + packages shapes (verified 2026-09-14 dev payload) ────────────
// `getAllSpecialityWithCaresByProfessional/{userId}` returns
// `{ data: { specialities: [{ id, name, cares: [{ id, name, services: [
//   { id, name, duration, price, type, professional: [...] } ] }] }],
//   packs: [{ id, name, description, price, … }] } }`. The `professional`
// array inside a service embeds full user objects incl. email/phone — never
// surfaced by the adapter (only name/duration/price/type are display-safe).

export interface ApiCareService {
  id: number;
  name: string;
  duration: number | null;
  price: number | string | null;
  /** Delivery mode: `"practice"` | `"home"` (dev also uses `"domicile"`). */
  type: string | null;
}

export interface ApiCare {
  id: number;
  name: string;
  services?: ApiCareService[];
  /** Live-host alias (api.wenaya.com uses `prices`, dev uses `services`). */
  prices?: ApiCareService[];
}

export interface ApiCaresSpeciality {
  id: number;
  name: string;
  cares: ApiCare[];
}

export interface ApiPack {
  id: number;
  name: string;
  description: string | null;
  price: string | number | null;
  final_price?: string | number | null;
}

export interface ApiCaresAndPacks {
  specialities: ApiCaresSpeciality[];
  packs: ApiPack[];
}

/** Envelope shape returned by the cares+packages endpoint. */
interface CaresAndPacksResponse {
  error: boolean;
  data: { specialities?: unknown; packs?: unknown };
}

function isCaresAndPacksPayload(value: unknown): value is ApiCaresAndPacks {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  return Array.isArray(d.specialities) && Array.isArray(d.packs);
}

// ─── Validation ──────────────────────────────────────────────────────────

function isSpeciality(value: unknown): value is ApiProfessionalDetailSpeciality {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === "number" &&
    typeof s.fr_name === "string" &&
    typeof s.en_name === "string"
  );
}

function isValidProfessionalDetail(value: unknown): value is ApiProfessionalDetail {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  const user = d.user;
  const professional = d.professional;
  if (!user || typeof user !== "object") return false;
  if (!professional || typeof professional !== "object") return false;
  const u = user as Record<string, unknown>;
  const p = professional as Record<string, unknown>;
  return (
    typeof u.first_name === "string" &&
    typeof u.last_name === "string" &&
    typeof u.slug === "string" &&
    typeof p.slug === "string" &&
    Array.isArray(d.specialities) &&
    d.specialities.filter(isSpeciality).length === d.specialities.length
  );
}

function isValidResponse(value: unknown): value is ProfessionalDetailResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.error === false && isValidProfessionalDetail(v.data);
}

/**
 * Fetch one professional's detail by routing slug.
 * Throws on network error, non-2xx, an unexpected payload shape, or a
 * missing/blank slug. The caller decides the fallback (Redis → mock → 404).
 */
export async function fetchProfessionalDetail(slug: string): Promise<ApiProfessionalDetail> {
  if (!slug) throw new Error("Missing professional slug");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${PROFESSIONALS_API_BASE}${PROFESSIONALS_DETAIL_PATH}/${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: PROFESSIONALS_DETAIL_REVALIDATE },
    });

    if (!res.ok) {
      throw new Error(`Professional detail API HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!isValidResponse(json)) {
      throw new Error("Unexpected professional detail payload shape");
    }

    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetch one professional's cares + packages by user id (from the detail
 * payload's `user.id`). Throws on network error, non-2xx, or a payload
 * missing both arrays. The caller decides tolerance (a failure should leave
 * services/packages at their safe empty defaults, never break the page).
 */
export async function fetchProfessionalCaresAndPacks(
  userId: number
): Promise<ApiCaresAndPacks> {
  if (!Number.isFinite(userId) || userId <= 0) {
    throw new Error("Missing professional user id");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${PROFESSIONALS_API_BASE}${CARES_PACKS_PATH}/${userId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: PROFESSIONALS_DETAIL_REVALIDATE },
    });

    if (!res.ok) {
      throw new Error(`Professional cares/packages API HTTP ${res.status}`);
    }

    const json = (await res.json()) as CaresAndPacksResponse;

    if (json.error || !isCaresAndPacksPayload(json.data)) {
      throw new Error("Unexpected cares/packages payload shape");
    }

    return json.data as ApiCaresAndPacks;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Availability endpoints (verified 2026-09-18 on dev, see
// `wenaya-professionals-availability-contract-report.md`) ─────────────────
// Two READ endpoints power the professional booking availability read layer.
// Contract highlights:
//   - `getUnavailableDatesForProfessional/{userName}/{date}` REQUIRES the
//     HTTP header `company: 1` (a query param → 400 `company_id_required`);
//     `{userName}` accepts the routing slug OR `user.username`.
//     Success: `{ error:false, message:"", data:{ dates:["YYYY-MM-DD",…],
//     hasClasses:false } }`. The `date` param anchors a window
//     (measured ≈ date−26d … date+58d) — dates[] are absolute.
//   - `getAvailableTimeByProfessionalId/{professionalId}/{date}` REQUIRES an
//     INTEGER user id (slug → 400 "The professional id must be an integer.").
//     Open day:  `{ error:false, message:"", data:{ available:true,
//     times:[{ isReserved:false, start:"HH:MM", end:"HH:MM" }] } }`
//     Closed day: `{ error:false, message:"", data:{ available:false,
//     next_day:"YYYY-MM-DD" } }` — `next_day` = the closest bookable date.
//     Errors (uniform `{error,message,data:[]}`): `impossible_to_find_
//     professional_work_hours`, `ghost_mode_error`, `you_cant_book_an_
//     appointment_for_this_date_at_home`.
//   - `getUnavailableDatesForPractice` is BROKEN on dev (500 `column
//     "practice" does not exist`) — never used.
// Caching (P5 decision): slots move fast (reservations) → short revalidation
// (≤60s); the unavailable-dates window is slow → 1h. Slot strings carry NO
// timezone — treated as backend-local wall clock (Asia/Casablanca assumed),
// never converted client-side.

const UNAVAILABLE_DATES_PATH = "/api/v1/getUnavailableDatesForProfessional";
const AVAILABLE_TIME_PATH = "/api/v1/getAvailableTimeByProfessionalId";

/** Data Cache revalidation for the slow unavailable-dates window (1 hour). */
export const UNAVAILABLE_DATES_REVALIDATE = 3600;

/** Data Cache revalidation for fast-moving timeslots (60s). */
export const AVAILABLE_TIMES_REVALIDATE = 60;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{1,2}:\d{2}$/;

const COMPANY_HEADER = { company: "1" } as const;

/** Stable reason codes surfaced to the UI (never raw backend messages). */
export type AvailabilityErrorCode =
  | "no-work-hours"
  | "ghost-mode"
  | "home-care-restricted"
  | "api-error";

/**
 * Typed availability failure. `code` is UI-safe and mapped from verified
 * backend messages; the raw message string is NEVER sent to the browser.
 */
export class AvailabilityApiError extends Error {
  readonly code: AvailabilityErrorCode;
  constructor(code: AvailabilityErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AvailabilityApiError";
    this.code = code;
  }
}

const CODE_BY_BACKEND_MESSAGE: Record<string, AvailabilityErrorCode> = {
  impossible_to_find_professional_work_hours: "no-work-hours",
  ghost_mode_error: "ghost-mode",
  you_cant_book_an_appointment_for_this_date_at_home: "home-care-restricted",
};

function toErrorCode(message: unknown): AvailabilityErrorCode {
  if (typeof message === "string" && message in CODE_BY_BACKEND_MESSAGE) {
    return CODE_BY_BACKEND_MESSAGE[message];
  }
  return "api-error";
}

// ─── Availability API shapes (validated; raw Laravel shapes stay in the
// API layer — the domain model lives in `professional-availability.ts`) ────

export interface ApiUnavailableDates {
  dates: string[];
  hasClasses: boolean;
}

export interface ApiAvailableTimeSlot {
  isReserved: boolean;
  start: string;
  end: string;
}

export interface ApiAvailableTimes {
  available: boolean;
  times: ApiAvailableTimeSlot[];
  nextDay?: string;
}

/** Shared availability request plumbing: URL build + headers + timeout. */
async function fetchAvailabilityJson(
  path: string,
  slugOrId: string,
  dateIso: string,
  revalidate: number
): Promise<unknown> {
  if (!DATE_RE.test(dateIso)) {
    throw new AvailabilityApiError("api-error", "Invalid date (expected YYYY-MM-DD)");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${PROFESSIONALS_API_BASE}${path}/${encodeURIComponent(slugOrId)}/${dateIso}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", ...COMPANY_HEADER },
      signal: controller.signal,
      next: { revalidate },
    });

    if (!res.ok) {
      throw new AvailabilityApiError("api-error", `Availability API HTTP ${res.status}`);
    }

    return (await res.json()) as unknown;
  } finally {
    clearTimeout(timeout);
  }
}

function validateUnavailableDates(value: unknown): ApiUnavailableDates {
  if (!value || typeof value !== "object") {
    throw new AvailabilityApiError("api-error", "Unexpected unavailable-dates payload shape");
  }
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.dates) || data.dates.some((d) => typeof d !== "string" || !DATE_RE.test(d))) {
    throw new AvailabilityApiError("api-error", "Unexpected unavailable-dates payload shape");
  }
  return { dates: data.dates as string[], hasClasses: data.hasClasses === true };
}

function validateAvailableTimes(value: unknown): ApiAvailableTimes {
  if (!value || typeof value !== "object") {
    throw new AvailabilityApiError("api-error", "Unexpected available-times payload shape");
  }
  const data = value as Record<string, unknown>;

  if (data.available === true) {
    if (
      !Array.isArray(data.times) ||
      data.times.some(
        (t) =>
          !t ||
          typeof t !== "object" ||
          typeof (t as Record<string, unknown>).isReserved !== "boolean" ||
          typeof (t as Record<string, unknown>).start !== "string" ||
          typeof (t as Record<string, unknown>).end !== "string" ||
          !TIME_RE.test((t as Record<string, unknown>).start as string) ||
          !TIME_RE.test((t as Record<string, unknown>).end as string)
      )
    ) {
      throw new AvailabilityApiError("api-error", "Unexpected available-times payload shape");
    }
    return {
      available: true,
      times: (data.times as ApiAvailableTimeSlot[]).map((t) => ({
        isReserved: t.isReserved,
        start: t.start,
        end: t.end,
      })),
    };
  }

  if (data.available === false) {
    if (typeof data.next_day !== "string" || !DATE_RE.test(data.next_day)) {
      throw new AvailabilityApiError("api-error", "Unexpected available-times payload shape");
    }
    return { available: false, times: [], nextDay: data.next_day };
  }

  throw new AvailabilityApiError("api-error", "Unexpected available-times payload shape");
}

/**
 * Fetch a professional's fully-unavailable dates for the window anchored on
 * `dateIso` (≈ date−26d … date+58d). `userName` accepts the routing slug or
 * `user.username`. Requires the `company: 1` HTTP header (enforced here).
 */
export async function fetchProfessionalUnavailableDates(
  userName: string,
  dateIso: string
): Promise<ApiUnavailableDates> {
  if (!userName) {
    throw new AvailabilityApiError("api-error", "Missing professional userName");
  }
  const json = await fetchAvailabilityJson(UNAVAILABLE_DATES_PATH, userName, dateIso, UNAVAILABLE_DATES_REVALIDATE);
  if (!json || typeof json !== "object" || (json as Record<string, unknown>).error === true) {
    throw new AvailabilityApiError(
      toErrorCode((json as Record<string, unknown>)?.message),
      "Unavailable-dates request failed"
    );
  }
  return validateUnavailableDates((json as Record<string, unknown>).data);
}

/**
 * Fetch the available timeslots for one professional on one day. `professionalId`
 * must be the INTEGER user id (identity: user.id == professional.id == listing id).
 */
export async function fetchProfessionalAvailableTimes(
  professionalId: number,
  dateIso: string
): Promise<ApiAvailableTimes> {
  if (!Number.isInteger(professionalId) || professionalId <= 0) {
    throw new AvailabilityApiError("api-error", "Invalid professional id");
  }
  const json = await fetchAvailabilityJson(AVAILABLE_TIME_PATH, String(professionalId), dateIso, AVAILABLE_TIMES_REVALIDATE);
  if (!json || typeof json !== "object" || (json as Record<string, unknown>).error === true) {
    throw new AvailabilityApiError(
      toErrorCode((json as Record<string, unknown>)?.message),
      "Available-times request failed"
    );
  }
  return validateAvailableTimes((json as Record<string, unknown>).data);
}