/**
 * Client-side fetcher for the availability BFF proxy
 * `/api/professionals/availability` (see `src/app/api/professionals/availability/route.ts`).
 *
 * The browser never talks to dev-api.wenaya.com directly — all availability
 * reads go through the same-origin route (react-server-components rest,
 * ok) which owns the upstream call, the `company: 1` header and the error
 * mapping. This module therefore only knows the stable envelope:
 *
 *   unavailable-dates → { error:false, data:{ dates:string[], hasClasses:boolean } }
 *   available-times   → { error:false, data:{ available, slots, nextDay, reason } }
 *                     or 502 { error:true, reason:"api-error" }
 *
 * Type-only imports keep the server-only resolver module out of the client
 * bundle.
 */
import type {
  ProfessionalAvailabilityReason,
  ProfessionalTimeSlot,
} from "./professional-availability";

const ENDPOINT = "/api/professionals/availability";

export interface ClientUnavailableDates {
  ok: boolean;
  dates: string[];
  hasClasses: boolean;
}

export type ClientDay =
  | { ok: true; available: true; slots: ProfessionalTimeSlot[]; nextDay: null }
  | {
      ok: true;
      available: false;
      slots: ProfessionalTimeSlot[];
      nextDay: string | null;
      reason: ProfessionalAvailabilityReason;
    }
  | { ok: false };

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const SLOT_TIME_RE = /^\d{2}:\d{2}$/;

/**
 * P8 safety rail: the backend occasionally repeats identical times and any
 * malformed value must never reach the slot list. Wall-clock strings are kept
 * verbatim (assumed Asia/Casablanca — documented, no timezone conversion).
 */
function normalizeSlots(slots: ProfessionalTimeSlot[]): ProfessionalTimeSlot[] {
  const seen = new Set<string>();
  const out: ProfessionalTimeSlot[] = [];
  for (const s of slots) {
    if (!s || typeof s.start !== "string" || typeof s.end !== "string") continue;
    if (!SLOT_TIME_RE.test(s.start) || !SLOT_TIME_RE.test(s.end)) continue;
    const key = `${s.start}-${s.end}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ start: s.start, end: s.end, isReserved: Boolean(s.isReserved) });
  }
  return out;
}

/**
 * Fully-unavailable day set for the professional, anchored on `date`
 * (server treats it as the window center: ≈ date−26d … date+58d).
 * Never rejects: on any failure the caller falls back to an empty set.
 */
export async function fetchClientUnavailableDates(
  userName: string,
  date: string
): Promise<ClientUnavailableDates> {
  const url = `${ENDPOINT}?type=unavailable-dates&userName=${encodeURIComponent(userName)}&date=${encodeURIComponent(date)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !json || json.error !== false) {
      return { ok: false, dates: [], hasClasses: false };
    }
    return {
      ok: true,
      dates: Array.isArray(json.data?.dates) ? json.data.dates : [],
      hasClasses: Boolean(json.data?.hasClasses),
    };
  } catch {
    return { ok: false, dates: [], hasClasses: false };
  }
}

/**
 * Day-level availability (open slots / closed day / practitioner reason).
 * Never rejects: `{ ok:false }` maps to the "please retry" UX state.
 */
export async function fetchClientDay(
  professionalId: number,
  date: string
): Promise<ClientDay> {
  const url = `${ENDPOINT}?type=available-times&professionalId=${professionalId}&date=${encodeURIComponent(date)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !json || json.error !== false) {
      return { ok: false };
    }
    const data = json.data ?? {};
    if (data.available === true) {
      return {
        ok: true,
        available: true,
        slots: normalizeSlots(Array.isArray(data.slots) ? data.slots : []),
        nextDay: null,
      };
    }
    return {
      ok: true,
      available: false,
      slots: normalizeSlots(Array.isArray(data.slots) ? data.slots : []),
      nextDay: typeof data.nextDay === "string" ? data.nextDay : null,
      reason: data.reason || "unavailable",
    };
  } catch {
    return { ok: false };
  }
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** "YYYY-MM-DD" string for a Date instance (local time). */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export { todayIso, ISO_DATE_RE };