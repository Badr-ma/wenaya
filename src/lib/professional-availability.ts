/**
 * Professional availability — domain model + resolver layer (P4/P6).
 *
 * Normalizes the proven dev-API read endpoints
 * (getUnavailableDatesForProfessional / getAvailableTimeByProfessionalId, see
 * `wenaya-professionals-availability-contract-report.md`) into a single
 * UI-safe model. The transport-level fetch + error mapping live in
 * `professionals-detail-api.ts`; this module is the ONLY consumer of that
 * layer and the ONLY importer the UI/BFF may use.
 *
 * No secrets, no writes: this is a pure READ layer. The resolver contracts
 * let a day be in exactly one state:
 *   - open    → { available:true,  slots:[{ start,end,isReserved }] }
 *   - closed  → { available:false, nextDay:"YYYY-MM-DD", reason:"unavailable" }
 *   - blocked → available:false with a UI-safe reason:
 *               no-work-hours | ghost-mode | home-care-restricted | api-error
 */

import {
  AvailabilityApiError,
  fetchProfessionalUnavailableDates,
  fetchProfessionalAvailableTimes,
  type AvailabilityErrorCode,
} from "./professionals-detail-api";

/** UI-safe reason codes for a day with no bookable times. */
export type ProfessionalAvailabilityReason =
  | "no-work-hours"
  | "ghost-mode"
  | "home-care-restricted"
  | "unavailable"
  | "api-error";

export interface ProfessionalUnavailableDates {
  dates: string[];
  hasClasses: boolean;
}

export interface ProfessionalTimeSlot {
  start: string;
  end: string;
  isReserved: boolean;
}

export interface ProfessionalDayAvailability {
  available: boolean;
  slots: ProfessionalTimeSlot[];
  /** Closest bookable date ("YYYY-MM-DD") when the day is fully closed. */
  nextDay: string | null;
  /**
   * Why this day has no slots: `unavailable` for a fully-closed day with a
   * known nextDay; the error reason codes for professional/booking gaps.
   */
  reason: ProfessionalAvailabilityReason | null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeReason(code: AvailabilityErrorCode): ProfessionalAvailabilityReason {
  return code;
}

/** Resolver-safe debounce: keep the window anchored on the requested date. */
export function isIsoDate(value: string): boolean {
  return DATE_RE.test(value);
}

/**
 * Professional's fully-unavailable dates for the window anchored on `iso`
 * (≈ iso−26d … iso+58d). Never rejects: transport errors degrade to an empty
 * set so the booking calendar stays usable (an unavailable-dates failure must
 * not blank the whole month).
 */
export async function getProfessionalUnavailableDates(
  userName: string,
  iso: string
): Promise<ProfessionalUnavailableDates> {
  try {
    const result = await fetchProfessionalUnavailableDates(userName, iso);
    return { dates: result.dates, hasClasses: result.hasClasses };
  } catch {
    return { dates: [], hasClasses: false };
  }
}

/**
 * One professional's availability for one day. Maps the transport result to
 * the domain model; maps backend error codes to UI-safe reasons. Never
 * rejects — transport failures surface as `api-error` days.
 */
export async function getProfessionalAvailableTimes(
  professionalId: number,
  iso: string
): Promise<ProfessionalDayAvailability> {
  try {
    const result = await fetchProfessionalAvailableTimes(professionalId, iso);
    if (result.available) {
      return { available: true, slots: result.times, nextDay: null, reason: null };
    }
    return {
      available: false,
      slots: [],
      nextDay: result.nextDay ?? null,
      reason: "unavailable",
    };
  } catch (err) {
    const code = getAvailabilityErrorCode(err);
    return { available: false, slots: [], nextDay: null, reason: normalizeReason(code) };
  }
}

function getAvailabilityErrorCode(err: unknown): AvailabilityErrorCode {
  return err instanceof AvailabilityApiError ? err.code : "api-error";
}