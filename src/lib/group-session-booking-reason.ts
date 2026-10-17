/**
 * Pure, dependency-free decision logic for the group-session booking failure
 * states. It exists so the mapping is testable in isolation, without a test
 * framework: the behaviour is unit-tested directly by
 * `scripts/verify-group-booking-reason.mjs` (Node's built-in `node:test`) under
 * `node --experimental-strip-types`.
 *
 * Two layers share it:
 *   - the BFF (`src/app/api/group-sessions/booking/route.ts`) maps an upstream
 *     join refusal onto a normalized HTTP response via `mapUpstreamJoinFailure`;
 *   - the browser client (`src/lib/group-session-booking-client.ts`) maps that
 *     response onto a UX reason via `resolveGroupSessionBookingReason`.
 *
 * Keeping it import-free mirrors `src/lib/format.ts`, the other module the repo
 * verifies this way.
 */

/** Every normalized failure reason the booking seam can carry. */
export type GroupSessionBookingReason =
  | "validation"
  | "unauthenticated"
  | "feed-unavailable"
  | "api-error"
  /**
   * The event's capacity is reached. A settled business rule the patient can
   * act on by choosing another session — not a transient failure, so it is
   * never offered as a retry.
   */
  | "group-full"
  /**
   * The patient is already registered to this event upstream (HTTP 400 whose
   * body `message` is exactly `user_already_joined`). The registration is
   * effectively in place, so — like a full session — it is a settled outcome the
   * patient cannot change by retrying; the retry CTA is never offered.
   */
  | "already-joined"
  /**
   * The write may already have been registered upstream even though no
   * confirmation came back (upstream 5xx after commit, timeout, or a lost
   * response). Never treated as a success, and never offered as an immediate
   * retry, because repeating it could register the patient twice.
   */
  | "booking-uncertain";

/** Every reason the seam is allowed to carry, in one place for trust checks. */
export const GROUP_SESSION_BOOKING_REASONS: readonly GroupSessionBookingReason[] = [
  "validation",
  "unauthenticated",
  "feed-unavailable",
  "api-error",
  "group-full",
  "already-joined",
  "booking-uncertain",
];

/**
 * Trust guard: a client-supplied or body-supplied reason is only honored when it
 * is one of the known values, so a malformed/unknown string can never smuggle an
 * unexpected state into the UI.
 */
export function isGroupSessionBookingReason(value: unknown): value is GroupSessionBookingReason {
  return (
    typeof value === "string" &&
    (GROUP_SESSION_BOOKING_REASONS as readonly string[]).includes(value)
  );
}

/** The exact upstream `message` value that means the event's capacity is reached. */
export const EVENT_FULL_CODE = "event_is_full";

/**
 * EXACT match (after trimming and lowercasing) against the documented code —
 * never a substring. `join.upstreamMessage` is the parsed `message` field, so a
 * body such as "the event is full" or "event_is_full_extra" must NOT be treated
 * as a full session.
 */
export function isEventFullMessage(raw: string | null | undefined): boolean {
  return (raw ?? "").trim().toLowerCase() === EVENT_FULL_CODE;
}

/** The exact upstream `message` value that means the patient already joined. */
export const ALREADY_JOINED_CODE = "user_already_joined";

/**
 * EXACT match (after trimming and lowercasing) against the documented code —
 * never a substring, so "user_already_joined_extra" is not treated as a
 * duplicate registration.
 */
export function isAlreadyJoinedMessage(raw: string | null | undefined): boolean {
  return (raw ?? "").trim().toLowerCase() === ALREADY_JOINED_CODE;
}

/** Stage labels used for the single server-side failure log line. */
export type JoinFailureStage =
  | "unauthenticated-upstream"
  | "slot-refused"
  | "upstream-ambiguous"
  | "upstream-error";

/** A normalized BFF failure: HTTP status the browser sees, plus the log stage. */
export interface JoinFailureMapping {
  httpStatus: number;
  reason: GroupSessionBookingReason;
  /** Present only for field-level validation refusals. */
  fields?: string[];
  stage: JoinFailureStage;
}

/**
 * Map a non-2xx upstream join outcome onto the normalized BFF response.
 *
 * The caller handles `join.status === null` (no HTTP response at all → ambiguous
 * transport failure) and the 2xx success case before calling this; this covers
 * every remaining status:
 *
 *   - 401 / 403 — the upstream refused a write for a patient who IS authenticated
 *     locally (the documented `fresh_access_token_required` session problem). It
 *     must NOT be reported as `unauthenticated` (that would send a still-signed-in
 *     patient back to login), so it becomes `api-error`.
 *   - 404 / 422 — the class or slot was refused upstream (full, taken, withdrawn):
 *     the visitor re-picks, so it surfaces as slot validation.
 *   - >= 500 — AMBIGUOUS, not a refusal. The upstream write is not atomic: the
 *     registration can be committed and a downstream external call then fail,
 *     answering 500. Reporting a plain failure invites a double-booking retry, so
 *     it becomes `booking-uncertain`.
 *   - any other 4xx (e.g. 419 CSRF) — rejected before anything was registered, so
 *     a genuine failure. Inside this bucket, one refusal carries a meaning the
 *     patient can act on: an HTTP 400 whose body `message` is exactly
 *     `event_is_full` → `group-full`, and a body `message` of exactly
 *     `user_already_joined` → `already-joined`. Every other value keeps the
 *     neutral `api-error`, so an unrelated 400 is never misreported as a full
 *     session or a duplicate registration.
 *
 * The raw upstream text is never relayed to the browser by the caller.
 */
export function mapUpstreamJoinFailure(
  status: number,
  upstreamMessage: string | null
): JoinFailureMapping {
  if (status === 401 || status === 403) {
    return { httpStatus: 502, reason: "api-error", stage: "unauthenticated-upstream" };
  }
  if (status === 404 || status === 422) {
    return {
      httpStatus: 400,
      reason: "validation",
      fields: ["slotId"],
      stage: "slot-refused",
    };
  }
  if (status >= 500) {
    return { httpStatus: 502, reason: "booking-uncertain", stage: "upstream-ambiguous" };
  }
  if (isEventFullMessage(upstreamMessage)) {
    return { httpStatus: 400, reason: "group-full", stage: "upstream-error" };
  }
  if (isAlreadyJoinedMessage(upstreamMessage)) {
    return { httpStatus: 400, reason: "already-joined", stage: "upstream-error" };
  }
  return { httpStatus: 502, reason: "api-error", stage: "upstream-error" };
}

/**
 * Client-side resolution of the reason carried by a non-ok BFF response.
 *
 * A body-provided reason is authoritative when it is a known value, because two
 * distinct failures share one HTTP status (slot validation and `group-full` are
 * both HTTP 400). Reading the body first keeps them distinguishable; the
 * status-based fallback preserves behavior for bodies that are absent or carry an
 * unrecognized reason.
 */
export function resolveGroupSessionBookingReason(
  status: number,
  bodyReason: unknown
): GroupSessionBookingReason {
  if (isGroupSessionBookingReason(bodyReason)) return bodyReason;
  if (status === 401) return "unauthenticated";
  if (status === 504) return "feed-unavailable";
  if (status === 400) return "validation";
  return "api-error";
}

/**
 * Whether a failure must NOT offer the retry CTA: `group-full` can only fail
 * again, `already-joined` means the registration is already in place, and
 * `booking-uncertain` may already be registered (retrying could double-book).
 * Everything else keeps the retry affordance.
 */
export function isNonRetryableBookingReason(
  reason: GroupSessionBookingReason | null | undefined
): boolean {
  return reason === "group-full" || reason === "already-joined" || reason === "booking-uncertain";
}
