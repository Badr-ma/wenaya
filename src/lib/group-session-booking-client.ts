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
  /** Normalized failure reason for the UX copy. Absent on success. */
  reason?: "validation" | "unauthenticated" | "feed-unavailable" | "api-error";
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
    return { ok: false, reason: "api-error" };
  }
}

/** Map an HTTP status onto a reason the panel can explain to the visitor. */
async function readReason(res: Response): Promise<GroupSessionBookingResult["reason"]> {
  if (res.status === 401) return "unauthenticated";
  if (res.status === 504) return "feed-unavailable";
  if (res.status === 400) return "validation";
  try {
    const json = (await res.json()) as { reason?: unknown };
    if (typeof json?.reason === "string") {
      return json.reason as GroupSessionBookingResult["reason"];
    }
  } catch {
    /* body was not JSON — fall through to the status default */
  }
  return "api-error";
}
