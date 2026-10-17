#!/usr/bin/env node
/**
 * Verification for the group-session booking failure mapping
 * (src/lib/group-session-booking-reason.ts) — the shared decision logic behind
 * the BFF response and the client UX reason.
 *
 * Runs with the built-in Node test runner (node:test) — NO third-party framework,
 * consistent with a repo that has none. The module under test is dependency-free,
 * so this imports it directly via a file:// URL under `node --experimental-strip-types`.
 *
 * Run: `npm run verify:booking`
 *   (or node --experimental-strip-types scripts/verify-group-booking-reason.mjs)
 *
 * Covers the six required cases:
 *   1. upstream 400 + exact `event_is_full`            → group-full
 *   2. any OTHER 400                                   → NOT group-full
 *   3. upstream 404 / 422                              → unchanged (slot validation)
 *   4. auth failures (local 401, upstream 401/403)     → unchanged
 *   5. transport / ambiguous failures (5xx, null)      → unchanged (booking-uncertain)
 *   6. retry suppressed for group-full (and uncertain)
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MODULE_TS = pathToFileURL(
  join(ROOT, "src", "lib", "group-session-booking-reason.ts")
).href;

const {
  ALREADY_JOINED_CODE,
  EVENT_FULL_CODE,
  isAlreadyJoinedMessage,
  isEventFullMessage,
  isGroupSessionBookingReason,
  isNonRetryableBookingReason,
  mapUpstreamJoinFailure,
  resolveGroupSessionBookingReason,
} = await import(MODULE_TS);

// ---------------------------------------------------------------------------
// 1. upstream 400 + exact `event_is_full` → group-full
// ---------------------------------------------------------------------------
test("case 1 — upstream 400 with exact `event_is_full` maps to group-full", () => {
  const out = mapUpstreamJoinFailure(400, EVENT_FULL_CODE);
  assert.equal(out.httpStatus, 400);
  assert.equal(out.reason, "group-full");
  assert.equal(out.stage, "upstream-error");
  assert.equal(out.fields, undefined);

  // The exact code is matched case-insensitively and after trimming whitespace.
  assert.equal(mapUpstreamJoinFailure(400, "  EVENT_IS_FULL  ").reason, "group-full");
  assert.equal(mapUpstreamJoinFailure(400, "event_is_full ").reason, "group-full");
  assert.equal(isEventFullMessage(" Event_Is_Full "), true);
});

// ---------------------------------------------------------------------------
// 2. any OTHER 400 → NOT group-full
// ---------------------------------------------------------------------------
test("case 2 — a different 400 is never misreported as group-full", () => {
  for (const message of [
    null,
    "",
    "validation_error",
    // substrings must NOT count — the match is exact.
    "event_is_full_extra",
    "the event is full",
    "event is full",
  ]) {
    const out = mapUpstreamJoinFailure(400, message);
    assert.notEqual(out.reason, "group-full");
    assert.equal(out.httpStatus, 502);
    assert.equal(out.reason, "api-error");
    assert.equal(out.stage, "upstream-error");
  }
});

// ---------------------------------------------------------------------------
// 2b. upstream 400 + exact `user_already_joined` → already-joined
// ---------------------------------------------------------------------------
test("case 2b — upstream 400 with exact `user_already_joined` maps to already-joined", () => {
  const out = mapUpstreamJoinFailure(400, ALREADY_JOINED_CODE);
  assert.equal(out.httpStatus, 400);
  assert.equal(out.reason, "already-joined");
  assert.equal(out.stage, "upstream-error");
  assert.equal(out.fields, undefined);
  assert.notEqual(out.reason, "group-full");
  assert.notEqual(out.reason, "api-error");

  // Exact code is matched case-insensitively and after trimming whitespace.
  assert.equal(mapUpstreamJoinFailure(400, "  USER_ALREADY_JOINED  ").reason, "already-joined");
  assert.equal(isAlreadyJoinedMessage(" User_Already_Joined "), true);

  // Substrings / near-misses must NOT be treated as a duplicate registration.
  for (const message of [
    null,
    "",
    "user_already_joined_extra",
    "user already joined",
    "already_joined",
  ]) {
    assert.equal(isAlreadyJoinedMessage(message), false);
    assert.equal(mapUpstreamJoinFailure(400, message).reason, "api-error");
  }
});

// ---------------------------------------------------------------------------
// 3. upstream 404 / 422 → unchanged (slot validation, re-pick)
// ---------------------------------------------------------------------------
test("case 3 — upstream 404/422 keep the slot-validation mapping", () => {
  for (const status of [404, 422]) {
    const out = mapUpstreamJoinFailure(status, "whatever");
    assert.equal(out.httpStatus, 400, `status ${status}`);
    assert.equal(out.reason, "validation");
    assert.deepEqual(out.fields, ["slotId"]);
    assert.equal(out.stage, "slot-refused");
  }
});

// ---------------------------------------------------------------------------
// 4. auth failures → unchanged
// ---------------------------------------------------------------------------
test("case 4 — auth failures keep their existing meaning", () => {
  // Upstream 401/403 for an already-authenticated patient is api-error, NOT
  // unauthenticated (which is reserved for a local no-session decision).
  for (const status of [401, 403]) {
    const out = mapUpstreamJoinFailure(status, "fresh_access_token_required");
    assert.equal(out.httpStatus, 502, `status ${status}`);
    assert.equal(out.reason, "api-error");
    assert.equal(out.stage, "unauthenticated-upstream");
  }
  // Client-side: a BFF 401 still resolves to the login reason.
  assert.equal(resolveGroupSessionBookingReason(401, undefined), "unauthenticated");
  // A body reason wins over the status (a 401 with an explicit reason is trusted).
  assert.equal(resolveGroupSessionBookingReason(401, "api-error"), "api-error");
});

// ---------------------------------------------------------------------------
// 5. transport / ambiguous failures → unchanged (booking-uncertain)
// ---------------------------------------------------------------------------
test("case 5 — 5xx and ambiguous outcomes are booking-uncertain", () => {
  for (const status of [500, 502, 503, 504]) {
    const out = mapUpstreamJoinFailure(status, "boom");
    assert.equal(out.httpStatus, 502, `status ${status}`);
    assert.equal(out.reason, "booking-uncertain");
    assert.equal(out.stage, "upstream-ambiguous");
  }
  // 504 (client-side feed-unavailable) and any unknown status keep their meaning.
  assert.equal(resolveGroupSessionBookingReason(504, undefined), "feed-unavailable");
  assert.equal(resolveGroupSessionBookingReason(500, undefined), "api-error");
  assert.equal(resolveGroupSessionBookingReason(502, "api-error"), "api-error");
});

// ---------------------------------------------------------------------------
// 6. retry suppressed for group-full (and uncertain), kept otherwise
// ---------------------------------------------------------------------------
test("case 6 — group-full, already-joined and booking-uncertain suppress the retry CTA", () => {
  assert.equal(isNonRetryableBookingReason("group-full"), true);
  assert.equal(isNonRetryableBookingReason("already-joined"), true);
  assert.equal(isNonRetryableBookingReason("booking-uncertain"), true);
  assert.equal(isNonRetryableBookingReason("validation"), false);
  assert.equal(isNonRetryableBookingReason("api-error"), false);
  assert.equal(isNonRetryableBookingReason("unauthenticated"), false);
  assert.equal(isNonRetryableBookingReason("feed-unavailable"), false);
  assert.equal(isNonRetryableBookingReason(null), false);
  assert.equal(isNonRetryableBookingReason(undefined), false);
});

// ---------------------------------------------------------------------------
// Guard + client status precedence (readReason contract)
// ---------------------------------------------------------------------------
test("trust guard accepts only the known reason vocabulary", () => {
  for (const known of [
    "validation",
    "unauthenticated",
    "feed-unavailable",
    "api-error",
    "group-full",
    "already-joined",
    "booking-uncertain",
  ]) {
    assert.equal(isGroupSessionBookingReason(known), true, known);
  }
  assert.equal(isGroupSessionBookingReason("nope"), false);
  assert.equal(isGroupSessionBookingReason(null), false);
  assert.equal(isGroupSessionBookingReason(42), false);
});

test("client resolver — body reason first, then status fallback", () => {
  // The body reason is authoritative (400 + group-full must survive).
  assert.equal(resolveGroupSessionBookingReason(400, "group-full"), "group-full");
  assert.equal(resolveGroupSessionBookingReason(400, "validation"), "validation");
  // Unrecognized/absent body reason falls back to the status default.
  assert.equal(resolveGroupSessionBookingReason(400, undefined), "validation");
  assert.equal(resolveGroupSessionBookingReason(400, "nonsense"), "validation");
  assert.equal(resolveGroupSessionBookingReason(401, undefined), "unauthenticated");
  assert.equal(resolveGroupSessionBookingReason(400, "already-joined"), "already-joined");
  assert.equal(resolveGroupSessionBookingReason(504, undefined), "feed-unavailable");
  assert.equal(resolveGroupSessionBookingReason(418, undefined), "api-error");
});
