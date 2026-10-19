/**
 * Client-side fetcher for the group-session booking BFF
 * `/api/group-sessions/booking` (see
 * `src/app/api/group-sessions/booking/route.ts`).
 *
 * The browser never talks to the upstream Wenaya API directly: the same-origin
 * route owns the upstream call, requires an authenticated patient session,
 * re-validates the slot against the live programme feed and adds the
 * `status: "pending"` envelope.
 *
 * Only the selected slot is sent — identity, programme title and pricing are
 * resolved server-side, so the browser cannot book as another patient or forge
 * a different slot.
 *
 * Never rejects: `{ ok:false, reason }` maps to the panel's retry UX state.
 */

import {
  resolveGroupSessionBookingReason,
  type GroupSessionBookingReason,
} from "./group-session-booking-reason";

export interface GroupSessionBookingRequest {
  /** Backend programme id (`session.live.programId`). */
  sessionId: number;
  /** Backend slot/event id inside that programme. */
  slotId: number;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** `HH:MM`. */
  time: string;
}

export interface GroupSessionBookingResult {
  ok: boolean;
  /**
   * Normalized failure reason for the UX copy. Absent on success. The union and
   * its trust guard live in `./group-session-booking-reason`, shared with the
   * BFF so both sides agree on the vocabulary.
   */
  reason?: GroupSessionBookingReason;
}

const ENDPOINT = "/api/group-sessions/booking";

export async function submitGroupSessionBooking(
  request: GroupSessionBookingRequest
): Promise<GroupSessionBookingResult> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      cache: "no-store",
    });
    if (!res.ok) {
      const reason = await readReason(res);
      return { ok: false, reason };
    }
    const json = (await res.json()) as { success?: unknown };
    return { ok: json?.success === true };
  } catch {
    // The browser never received the BFF answer, but the BFF may already have
    // completed the upstream write — same ambiguity as an upstream 5xx.
    return { ok: false, reason: "booking-uncertain" };
  }
}

/**
 * Map the BFF answer onto a reason the panel can explain to the visitor.
 *
 * The body-provided reason is authoritative when it is a known value (two
 * distinct failures can share one HTTP status: slot validation and `group-full`
 * are both HTTP 400), then the status fallback applies — both rules live in
 * `resolveGroupSessionBookingReason`, shared with the BFF.
 */
async function readReason(res: Response): Promise<GroupSessionBookingReason> {
  let bodyReason: unknown;
  try {
    const json = (await res.json()) as { reason?: unknown };
    bodyReason = json?.reason;
  } catch {
    /* body was not JSON — fall through to the status default */
  }
  return resolveGroupSessionBookingReason(res.status, bodyReason);
}
