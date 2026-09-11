/**
 * Group Sessions API client — typed access to the Wenaya backend ACTIVE
 * group-appointment feed. Server-side only: consumed by SSR during
 * prerender/ISR, never by the browser directly.
 *
 * Transport handled by the shared server read client (`./api/client.ts`);
 * this module owns the endpoint constant, the domain types and the
 * envelope/paginator validation. The business rules (which slots are
 * listable) live in `./group-sessions-active.ts`.
 *
 * Endpoint: GET /api/v1/getAppointmentsGroupsWithPagination (Laravel 11
 * backend). Verified behavior (2026-09-10, see
 * `wenaya-group-sessions-api-contract.md` §4):
 *   - returns a Laravel paginator whose `data` holds PARENT programs, each
 *     embedding its `children[]` = currently-active dated slots
 *   - `page` is 1-based (paginator shows `current_page`/`last_page`/
 *     `per_page`/`total`); walk pages until the backend ends
 *   - response envelope: `{ error, message, data: Laravel paginator }`
 *   - all other group endpoints are NOT used here: bySlug is a dead route;
 *     byPracticeSlug is keyed by *company* slug; the flat feed
 *     (`getAllAppointmentsGroup`) is the alternate / validation source.
 */
import { wenayaApiGet, WENAYA_API_BASE } from "./api/client";
import type { LaravelEnvelope } from "./api/types";

/** Back-compat alias — the shared base owns env resolution (see client.ts). */
export const GROUP_SESSIONS_API_BASE = WENAYA_API_BASE;

export const GROUP_SESSIONS_API_ENDPOINT = "/api/v1/getAppointmentsGroupsWithPagination";

/** Data Cache revalidation window for the active feed (10 minutes). */
export const GROUP_SESSIONS_API_REVALIDATE = 600;

/** Runaway guard when paging through the entire dataset. */
const MAX_FETCH_PAGES = 50;

export interface ApiGroupCompany {
  id?: number;
  slug?: string | null;
  name?: string | null;
}

export interface ApiGroupProfessional {
  id?: number;
  slug?: string | null;
  name?: string | null;
}

export interface ApiGroupProgramChild {
  id: number;
  title: string | null;
  description: string | null;
  parent: number | null;
  nbr_of_participants: number | null;
  capacity: number | null;
  event_key: string | null;
  event_slug: string | null;
  event_date: string | null;
  event_time: string | null;
  event_status: string | null;
  price: string | null;
  firstUseprice: string | null;
  duration: string | null;
}

export interface ApiGroupProgram extends ApiGroupProgramChild {
  logo: string | null;
  professional?: ApiGroupProfessional | null;
  company?: ApiGroupCompany | null;
  /** Active dated slots belonging to this parent program. */
  children: ApiGroupProgramChild[];
}

export interface ApiGroupProgramsPaginator {
  current_page: number;
  data: ApiGroupProgram[];
  last_page: number;
  per_page: number;
  total: number;
  links: unknown[];
}

export type ApiGroupProgramsResponse = LaravelEnvelope<ApiGroupProgramsPaginator>;

function isValidPaginator(value: unknown): value is ApiGroupProgramsPaginator {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    Array.isArray(p.data) &&
    typeof p.current_page === "number" &&
    typeof p.last_page === "number" &&
    typeof p.total === "number"
  );
}

function isValidResponse(value: unknown): value is ApiGroupProgramsResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.error === false && isValidPaginator(v.data);
}

/** Coerce one raw program row to the typed shape (defensive unions). */
function toProgram(value: Record<string, unknown>): ApiGroupProgram | null {
  if (typeof value.id !== "number" && typeof value.id !== "string") return null;
  const children = Array.isArray(value.children)
    ? value.children.filter(
        (c): c is Record<string, unknown> => Boolean(c) && typeof c === "object"
      )
    : [];
  const child = (c: Record<string, unknown>): ApiGroupProgramChild => ({
    id: Number(c.id) || 0,
    title: typeof c.title === "string" ? c.title : null,
    description: typeof c.description === "string" ? c.description : null,
    parent: typeof c.parent === "number" || typeof c.parent === "string" ? Number(c.parent) || null : null,
    nbr_of_participants: typeof c.nbr_of_participants === "number" || typeof c.nbr_of_participants === "string" ? Number(c.nbr_of_participants) || null : null,
    capacity: typeof c.capacity === "number" || typeof c.capacity === "string" ? Number(c.capacity) || null : null,
    event_key: typeof c.event_key === "string" ? c.event_key : null,
    event_slug: typeof c.event_slug === "string" ? c.event_slug : null,
    event_date: typeof c.event_date === "string" ? c.event_date : null,
    event_time: typeof c.event_time === "string" ? c.event_time : null,
    event_status: typeof c.event_status === "string" ? c.event_status : null,
    price: typeof c.price === "string" ? c.price : null,
    firstUseprice: typeof c.firstUseprice === "string" ? c.firstUseprice : null,
    duration: typeof c.duration === "string" ? c.duration : null,
  });

  return {
    id: Number(value.id) || 0,
    title: typeof value.title === "string" ? value.title : null,
    description: typeof value.description === "string" ? value.description : null,
    parent: typeof value.parent === "number" || typeof value.parent === "string" ? Number(value.parent) || null : null,
    nbr_of_participants: typeof value.nbr_of_participants === "number" || typeof value.nbr_of_participants === "string" ? Number(value.nbr_of_participants) || null : null,
    capacity: typeof value.capacity === "number" || typeof value.capacity === "string" ? Number(value.capacity) || null : null,
    event_key: typeof value.event_key === "string" ? value.event_key : null,
    event_slug: typeof value.event_slug === "string" ? value.event_slug : null,
    event_date: typeof value.event_date === "string" ? value.event_date : null,
    event_time: typeof value.event_time === "string" ? value.event_time : null,
    event_status: typeof value.event_status === "string" ? value.event_status : null,
    price: typeof value.price === "string" ? value.price : null,
    firstUseprice: typeof value.firstUseprice === "string" ? value.firstUseprice : null,
    duration: typeof value.duration === "string" ? value.duration : null,
    logo: typeof value.logo === "string" ? value.logo : null,
    professional: value.professional && typeof value.professional === "object" ? value.professional as ApiGroupProfessional : null,
    company: value.company && typeof value.company === "object" ? value.company as ApiGroupCompany : null,
    children: children.map(child),
  };
}

/**
 * Fetch a single 1-based page of parent group programs from the backend.
 * Throws on network error, non-2xx, or an unexpected payload shape.
 * Result is cached for `GROUP_SESSIONS_API_REVALIDATE` seconds (Data Cache).
 */
export async function fetchGroupProgramsPage(rawPage: number): Promise<ApiGroupProgramsResponse> {
  const page = Math.max(1, Math.trunc(rawPage) || 1);

  const json = await wenayaApiGet<unknown>(GROUP_SESSIONS_API_ENDPOINT, {
    query: { page },
    revalidate: GROUP_SESSIONS_API_REVALIDATE,
  });

  if (!isValidResponse(json)) {
    throw new Error("Unexpected Wenaya group-sessions API payload");
  }
  return json;
}

/**
 * Fetch the whole ACTIVE group-program set by walking every page until the
 * backend reports the end (current_page >= last_page). Each program embeds
 * its active children — no further request needed for the listing.
 */
export async function fetchGroupPrograms(): Promise<ApiGroupProgram[]> {
  const programs: ApiGroupProgram[] = [];
  let page = 1;

  while (page <= MAX_FETCH_PAGES) {
    const res = await fetchGroupProgramsPage(page);
    for (const raw of res.data.data) {
      const program = toProgram(raw as unknown as Record<string, unknown>);
      if (program) programs.push(program);
    }
    if (res.data.data.length === 0) break;
    if (res.data.current_page >= res.data.last_page) break;
    page += 1;
  }

  return programs;
}