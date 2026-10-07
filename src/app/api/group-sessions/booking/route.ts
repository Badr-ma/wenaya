import { NextResponse, type NextRequest } from "next/server";
import { getWenayaApiBase } from "@/lib/api/client";
import { fetchGroupPrograms, type ApiGroupProgram } from "@/lib/group-sessions-api";
import { applyReseedCookies, browserCookieHeader } from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import { fetchPatientProfile, seedPatientCsrf } from "@/lib/patient-auth/transport";
import { mapPatientOutcome } from "@/lib/patient-auth/response";
import { normalizePatientProfile, type PatientProfile } from "@/lib/patient-auth/profile";

/**
 * POST /api/group-sessions/booking
 *
 * Authenticated "pay later" registration of a patient to a live group class —
 * the group-session counterpart of `/api/professionals/waiting-list`, but on the
 * GROUP-CLASS join endpoint rather than the waiting-list queue.
 *
 *   Body: { sessionId, slotId, date, time }
 *
 * UPSTREAM — `POST {WENAYA_API_URL}/api/v1/joinCustomerToGroupAppointment`:
 *
 *   { event: <classId>,
 *     participants: [{ id: <userId>, joined_at: <unix>, from: "client",
 *                      paid: 0, transaction: null, type: "online" }] }
 *
 * This replaces the previous `POST /api/v1/waiting-lists` call, which only ever
 * appended a row to the WAITING-LIST queue and never registered the patient in a
 * class. `joinCustomerToGroupAppointment` is a production-side-effect endpoint
 * (`WRITE_PRODUCTION_SIDE_EFFECT` in `wenaya-api-integration-master-plan.md`);
 * it is now called deliberately, and this route reports exactly what it returns —
 * a non-2xx upstream answer is NEVER reported as a successful registration.
 *
 * IDENTITY. `participants[].id` is the AUTHENTICATED patient id, read from the
 * profile endpoint (`/api/v1/getCustomerInformations`) through the visitor's
 * Sanctum cookie. It is never taken from the body, so the browser cannot register
 * as somebody else. A patient session is therefore MANDATORY: anonymous callers
 * get the normalized 401 `unauthenticated` and no upstream write happens.
 *
 * WHY `event` IS THE DATED CHILD-SLOT ID (not the programme id):
 *   - the visitor books a DATE + TIME, and only a child slot carries those; the
 *     parent is the programme template, so sending it would discard the choice;
 *   - capacity and participant counts are per-slot in this backend
 *     (`group-sessions.ts`: "per-slot, not programme-wide"), so a registration
 *     must bind to the capacity-checked unit;
 *   - the slot id is already the documented booking identity of this app:
 *     `LiveGroupSessionSlot.id` — "Backend child-slot id — submitted with the
 *     booking request";
 *   - the backend's own "which classes can I filter" collection
 *     (`getAppointmentGroupFilterAttributes`) enumerates the dated active slots,
 *     not the parent programmes.
 * `sessionId` is still sent by the client and still used to prove that `slotId`
 * really belongs to that programme (a tampered pair is rejected below).
 *
 * TIMESTAMPS. `joined_at` is Unix time in SECONDS (`Math.floor(Date.now()/1000)`),
 * the PHP/Laravel convention behind the documented `<unix>` placeholder (Carbon's
 * `unix()`, `created_at`/`timestamp` casts). Milliseconds would place the row
 * decades in the future and break any comparison against the slot date. This repo
 * has no competing Unix convention (its only `Date.now()` uses are ms-based local
 * tokens/ids), so the endpoint documentation is the single source here.
 *
 * GROUP PACKS — deliberately NOT implemented. The backend also exposes
 * `POST /api/v1/checkIfUserHasValidPack` (needs `patient`, `patientType`, `care`,
 * `professional`, `duration`) and `POST /api/v1/createOrGetCustomerGroupOrder`
 * (`groupId`), which must run BEFORE this join for a pack-funded registration.
 * The group-package id and the per-occurrence `care`/`duration` values are not
 * confirmed against this API, and inventing them would risk a wrong charge, so
 * this route performs the pay-later join only. Pack support stays pending until the
 * backend contract is verified.
 *
 * CSRF. The join is an authenticated Laravel POST, so the patient's session
 * cookie is forwarded and the `company: 1` header the backend expects is owned
 * here. Per `API_DOCUMENTATION (1).md` §3 (axios `withXSRFToken: true`, and
 * "always call `GET /sanctum/csrf-cookie` before the FIRST POST of a session —
 * the interceptor only rescues you on 419"), the browser's own `XSRF-TOKEN`
 * cookie is read with `readXsrfHeaderFromCookie` and forwarded as
 * `X-XSRF-TOKEN` on the FIRST attempt. When the browser holds no token, the
 * CSRF cookie is seeded proactively before the join, because the documented 419
 * interceptor alone never covers that case. A `419` still reseeds ONCE and
 * retries ONCE, then stops. Every path reuses `seedPatientCsrf` +
 * `applyReseedCookies` — the same helpers the patient-auth routes use, so there
 * is no second CSRF implementation.
 *
 * SLOT RE-VALIDATION (what makes the request tamper-proof): an unknown programme,
 * an unknown slot, a slot that does not belong to that programme, a date/time
 * mismatch, or a non-`active` slot is rejected before any write, so a
 * registration is only ever created for a slot that really exists.
 *
 * Responses:
 *   - 200 { success: true }                       (upstream 2xx: registered)
 *   - 400 { success: false, reason: "validation", fields: string[] }
 *   - 401 { success: false, type: "unauthenticated" }
 *   - 502 { success: false, reason: "api-error" }
 *   - 504 { success: false, reason: "feed-unavailable" }
 *
 * 401 is reserved for a LOCAL decision — this route could not resolve a usable
 * patient session before the join (anonymous caller, or a profile call that no
 * longer authenticates). An upstream 401/403 on the join itself is a different
 * condition (the documented `fresh_access_token_required` session problem) and is
 * deliberately NOT reported as `unauthenticated`, so the UI is never told to send
 * a still-authenticated patient back to the login screen.
 *
 * `force-dynamic` by design — a booking submission is never cacheable.
 */
export const dynamic = "force-dynamic";

/** Default fetch timeout (15s) — matches the shared API client. */
const TIMEOUT_MS = 15_000;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/**
 * Group-class registration endpoint.
 *
 * NOT documented. `API_DOCUMENTATION (1).md` §6.8 documents a DIFFERENT group
 * join route, `joinPatientToGroupAppointment` ("join a class (with pack)"),
 * and never mentions this one. This endpoint is nonetheless verified to EXIST —
 * it is a real registered route (an unsupported method answers 405 "Supported
 * methods: POST") — but its body contract is undocumented, so it cannot be
 * changed on the assumption that it behaves like the documented route. It is
 * used here because it serves the pack-less "pay later" registration this route
 * performs; the documented route is pack-gated.
 */
const JOIN_PATH = "/api/v1/joinCustomerToGroupAppointment";

type ProfileEnvelope = Parameters<typeof normalizePatientProfile>[0];

interface ValidatedRequest {
  sessionId: number;
  slotId: number;
  date: string;
  time: string;
}

function validate(body: Record<string, unknown>): { fields: string[]; value: ValidatedRequest | null } {
  const fields: string[] = [];
  const sessionId = Number(body.sessionId);
  const slotId = Number(body.slotId);
  const date = typeof body.date === "string" ? body.date : "";
  const time = typeof body.time === "string" ? body.time : "";

  if (!Number.isInteger(sessionId) || sessionId <= 0) fields.push("sessionId");
  if (!Number.isInteger(slotId) || slotId <= 0) fields.push("slotId");
  if (!ISO_DATE_RE.test(date)) fields.push("date");
  if (!TIME_RE.test(time)) fields.push("time");

  if (fields.length > 0) return { fields, value: null };
  return { fields, value: { sessionId, slotId, date, time } };
}

/** Outcome of checking the requested slot against the live feed. */
type SlotResolution =
  | { kind: "ok"; date: string; time: string }
  | { kind: "feed-unavailable" }
  | { kind: "not-found" };

/**
 * Resolve the requested slot against the live programme feed.
 *
 * Liveness is taken from the backend's own `event_status` (it flips to
 * `completed` once a slot is over — see `wenaya-group-sessions-api-contract.md`).
 * No extra local clock gate is applied on purpose: a same-day early slot can
 * already be "yesterday" in UTC, so a local date comparison would reject slots
 * the backend still considers bookable.
 *
 * Returns the authoritative slot date/time, which the route compares with the
 * requested ones so a tampered date cannot book a different slot.
 */
async function resolveLiveSlot(sessionId: number, slotId: number): Promise<SlotResolution> {
  let programs: ApiGroupProgram[];
  try {
    programs = await fetchGroupPrograms();
  } catch {
    return { kind: "feed-unavailable" };
  }
  const program = programs.find((p) => p.id === sessionId);
  if (!program) return { kind: "not-found" };
  const child = program.children.find((c) => c.id === slotId);
  if (!child) return { kind: "not-found" };
  // Only a live, still-active slot can receive a registration.
  if (child.event_status !== "active") return { kind: "not-found" };
  const date = child.event_date ?? "";
  const time = (child.event_time ?? "").slice(0, 5);
  if (!ISO_DATE_RE.test(date) || !TIME_RE.test(time)) return { kind: "not-found" };
  return { kind: "ok", date, time };
}

/** Which network attempt produced an upstream answer. */
type JoinAttempt = "initial-post" | "csrf-retry";

/**
 * Result of the upstream join call.
 *
 * `status` is `null` when no HTTP response was received at all (network error or
 * timeout), which the caller maps the same way as a refusal. `upstreamMessage` is
 * a sanitized summary of the upstream body used for SERVER LOGS ONLY — it is
 * never relayed to the browser.
 */
interface JoinOutcome {
  status: number | null;
  attempt: JoinAttempt | "unknown";
  upstreamMessage: string | null;
  transportError: string | null;
}

/** Longest upstream summary kept in a log line. */
const MAX_UPSTREAM_TEXT = 300;

/**
 * Reduce an upstream body to one short, credential-free line.
 *
 * The dev API answers in debug mode with a full stack trace (file paths, and
 * potentially other requests' data), so only a message-shaped field is kept and
 * the trace is never dumped. Any long opaque run is redacted as a belt-and-braces
 * guard so a token or cookie can never reach the log even if it were echoed back.
 */
function sanitizeUpstreamText(raw: string | null | undefined): string | null {
  if (raw === null || raw === undefined) return null;
  // Whitespace-only body: nothing worth a log line.
  if (raw.replace(/\s+/g, " ").trim() === "") return "";
  let summary = raw;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const rec = parsed as Record<string, unknown>;
      if (typeof rec.message === "string") summary = rec.message;
      else if (typeof rec.error === "string") summary = rec.error;
      else if (Array.isArray(rec.errors)) {
        summary = rec.errors
          .map((e) => (typeof e === "string" ? e : JSON.stringify(e)))
          .join("; ");
      }
    }
  } catch {
    // Non-JSON body: keep the raw text.
  }
  // Normalize AFTER the field is extracted: a message carrying newlines must not
  // be able to break the one-line-per-failure shape of the log.
  return summary
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_UPSTREAM_TEXT)
    .replace(/[A-Za-z0-9_-]{32,}/g, "[redacted]");
}

/** Describe a thrown fetch error without leaking anything sensitive. */
function describeTransportError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return `${error.name} after ${TIMEOUT_MS}ms`;
    }
    return `${error.name}: ${error.message}`;
  }
  return "non-Error thrown";
}

/**
 * Emit ONE server-side diagnostic line per failed join so an upstream refusal
 * can be diagnosed after the fact.
 *
 * Deliberately records only non-secret context — the upstream status, a sanitized
 * message, and the three ids needed to correlate the attempt. No cookie, session
 * or XSRF value, no request payload, and no personal data is ever logged, and
 * nothing logged here is returned to the browser.
 */
function logJoinFailure(details: {
  stage:
    | "local-identity"
    | "transport-error"
    | "unauthenticated-upstream"
    | "slot-refused"
    | "upstream-error"
    | "upstream-ambiguous";
  upstreamStatus: number | null;
  attempt: JoinAttempt | "unknown";
  upstreamMessage: string | null;
  sessionId: number;
  slotId: number;
  patientId: number | null;
}): void {
  console.error("[group-sessions/booking] join failed", {
    stage: details.stage,
    upstreamStatus: details.upstreamStatus,
    attempt: details.attempt,
    upstreamMessage: details.upstreamMessage,
    sessionId: details.sessionId,
    slotId: details.slotId,
    patientId: details.patientId,
  });
}

/**
 * Authenticated join POST. Returns the upstream HTTP status (plus a sanitized
 * body summary and the attempt that produced it) so the caller can map and log
 * the outcome.
 *
 * Two documented CSRF guarantees, in order:
 *
 * 1. Proactive seed. `API_DOCUMENTATION (1).md` §3 requires
 *    `GET /sanctum/csrf-cookie` before the FIRST POST of a session, and states
 *    the axios interceptor only recovers from 419. So when the browser sent no
 *    `XSRF-TOKEN` (nothing to forward), the cookie is seeded up front.
 * 2. Reactive reseed. A `419` (stale/missing token) reseeds once and retries
 *    exactly once. No retry loop.
 *
 * When the browser already carries a valid `XSRF-TOKEN` it is forwarded as
 * `X-XSRF-TOKEN` on attempt 0 and no extra round-trip is paid; the session
 * cookie is always preserved as sent by the browser.
 */
async function postJoin(
  cookieHeader: string | undefined,
  xsrfHeader: string | null,
  payload: unknown
): Promise<JoinOutcome> {
  let cookie = cookieHeader;
  let xsrf = xsrfHeader;

  // Only seed when the browser gave us nothing to forward.
  if (xsrf === null) {
    const reseed = await seedPatientCsrf(cookie);
    const applied = applyReseedCookies(cookie, reseed.setCookies);
    cookie = applied.cookieHeader;
    if (applied.xsrfToken) xsrf = applied.xsrfToken;
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const phase: JoinAttempt = attempt === 0 ? "initial-post" : "csrf-retry";

    let upstream: Response;
    try {
      upstream = await fetch(`${getWenayaApiBase()}${JOIN_PATH}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          company: "1",
          ...(cookie ? { Cookie: cookie } : {}),
          ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      // No HTTP response at all: report it as an outcome so it is diagnosable.
      return {
        status: null,
        attempt: phase,
        upstreamMessage: null,
        transportError: sanitizeUpstreamText(describeTransportError(error)),
      };
    }

    if (attempt === 0 && upstream.status === 419) {
      const reseed = await seedPatientCsrf(cookie);
      const applied = applyReseedCookies(cookie, reseed.setCookies);
      cookie = applied.cookieHeader;
      if (applied.xsrfToken) xsrf = applied.xsrfToken;
      continue;
    }

    if (upstream.status >= 200 && upstream.status < 300) {
      return { status: upstream.status, attempt: phase, upstreamMessage: null, transportError: null };
    }
    // Non-2xx: read the body for the server log only. It is never relayed.
    return {
      status: upstream.status,
      attempt: phase,
      upstreamMessage: sanitizeUpstreamText(await upstream.text().catch(() => null)),
      transportError: null,
    };
  }
  // Both attempts were 419: the caller maps it to an upstream error.
  return { status: 419, attempt: "csrf-retry", upstreamMessage: null, transportError: null };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, reason: "validation", fields: ["body"] },
      { status: 400 }
    );
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json(
      { success: false, reason: "validation", fields: ["body"] },
      { status: 400 }
    );
  }

  const body = raw as Record<string, unknown>;
  const { fields, value } = validate(body);
  if (!value) {
    return NextResponse.json({ success: false, reason: "validation", fields }, { status: 400 });
  }

  // 1. A patient session is mandatory; its id is the participant identity.
  const cookieHeader = browserCookieHeader(request);
  // The browser's own XSRF token, forwarded as `X-XSRF-TOKEN` on the first join
  // attempt — the same convention as the login/logout/register routes.
  const xsrfHeader = readXsrfHeaderFromCookie(request);
  const session = await fetchPatientProfile(cookieHeader);
  const mapped = mapPatientOutcome(session.outcome);
  if (mapped.body.type !== "success") {
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
  const profile: PatientProfile = normalizePatientProfile(
    session.outcome.json as ProfileEnvelope
  );
  // The join payload carries the patient id and nothing else identity-related, so
  // a usable id is the one profile requirement (email/name are no longer sent).
  const patientId = profile.id;
  if (!Number.isInteger(patientId) || patientId <= 0) {
    // Local refusal that also answers 502, so it is logged to keep it from being
    // mistaken for an upstream rejection.
    logJoinFailure({
      stage: "local-identity",
      upstreamStatus: null,
      attempt: "unknown",
      upstreamMessage: "unusable patient id from /api/v1/customer",
      sessionId: value.sessionId,
      slotId: value.slotId,
      patientId: null,
    });
    return NextResponse.json(
      { success: false, reason: "api-error" },
      { status: 502 }
    );
  }

  // 2. The slot must exist in the live feed.
  const slot = await resolveLiveSlot(value.sessionId, value.slotId);
  if (slot.kind === "feed-unavailable") {
    return NextResponse.json(
      { success: false, reason: "feed-unavailable" },
      { status: 504 }
    );
  }
  if (slot.kind === "not-found") {
    return NextResponse.json(
      { success: false, reason: "validation", fields: ["slotId"] },
      { status: 400 }
    );
  }
  // A tampered date/time must not book a different slot.
  if (slot.date !== value.date || slot.time !== value.time) {
    return NextResponse.json(
      { success: false, reason: "validation", fields: ["date", "time"] },
      { status: 400 }
    );
  }

  const payload = {
    // Dated child slot id (see the header): the class the visitor actually joins.
    event: value.slotId,
    participants: [
      {
        // Authenticated patient id — never from the request body.
        id: patientId,
        joined_at: Math.floor(Date.now() / 1000),
        from: "client",
        paid: 0,
        transaction: null,
        type: "online",
      },
    ],
  };

  let join: JoinOutcome;
  try {
    join = await postJoin(cookieHeader, xsrfHeader, payload);
  } catch (error) {
    // Unexpected failure inside the join helper: the write may already have
    // reached the upstream, so this is ambiguous rather than a clean refusal
    // (see the 5xx branch below). Diagnosable, never a success.
    logJoinFailure({
      stage: "transport-error",
      upstreamStatus: null,
      attempt: "unknown",
      upstreamMessage: sanitizeUpstreamText(describeTransportError(error)),
      sessionId: value.sessionId,
      slotId: value.slotId,
      patientId,
    });
    return NextResponse.json({ success: false, reason: "booking-uncertain" }, { status: 502 });
  }

  if (join.status === null) {
    // No HTTP response at all (network failure or timeout). The request may still
    // have been received and committed upstream, so this is ambiguous: the
    // registration might exist even though we never saw the answer.
    logJoinFailure({
      stage: "transport-error",
      upstreamStatus: null,
      attempt: join.attempt,
      upstreamMessage: join.transportError,
      sessionId: value.sessionId,
      slotId: value.slotId,
      patientId,
    });
    return NextResponse.json({ success: false, reason: "booking-uncertain" }, { status: 502 });
  }

  const status = join.status;
  if (status >= 200 && status < 300) {
    return NextResponse.json({ success: true });
  }
  // Upstream refused the write even though the patient IS authenticated locally
  // (the profile call above succeeded). This is the documented upstream session
  // problem — observed as 401 `fresh_access_token_required` — not a local
  // "log in again", so it must not be reported as `unauthenticated`. Mapping it
  // to `api-error` keeps the two conditions distinguishable while leaving the
  // client's existing reason union untouched. No upstream body or header is
  // relayed, so no cookie/session/XSRF value can leak to the browser.
  if (status === 401 || status === 403) {
    logJoinFailure({
      stage: "unauthenticated-upstream",
      upstreamStatus: status,
      attempt: join.attempt,
      upstreamMessage: join.upstreamMessage,
      sessionId: value.sessionId,
      slotId: value.slotId,
      patientId,
    });
    return NextResponse.json({ success: false, reason: "api-error" }, { status: 502 });
  }
  // The class or slot was refused upstream (full, already taken or withdrawn):
  // the visitor has to re-pick, so it is surfaced as a slot validation failure
  // rather than as a generic error.
  if (status === 404 || status === 422) {
    logJoinFailure({
      stage: "slot-refused",
      upstreamStatus: status,
      attempt: join.attempt,
      upstreamMessage: join.upstreamMessage,
      sessionId: value.sessionId,
      slotId: value.slotId,
      patientId,
    });
    return NextResponse.json(
      { success: false, reason: "validation", fields: ["slotId"] },
      { status: 400 }
    );
  }
  // An upstream 5xx is AMBIGUOUS, not a refusal. The upstream write is not
  // atomic: the registration is committed and a downstream external call then
  // fails, answering 500 ("Could not connect to api, check your ID and SECRET"),
  // so the patient IS registered even though the status is a 5xx. Reporting that
  // as a plain failure invites an immediate retry that could double-book them, so
  // the client receives its own reason and states the ambiguity. This never
  // claims the booking succeeded — that stays tied to a real upstream 2xx above.
  if (status >= 500) {
    logJoinFailure({
      stage: "upstream-ambiguous",
      upstreamStatus: status,
      attempt: join.attempt,
      upstreamMessage: join.upstreamMessage,
      sessionId: value.sessionId,
      slotId: value.slotId,
      patientId,
    });
    return NextResponse.json(
      { success: false, reason: "booking-uncertain" },
      { status: 502 }
    );
  }
  // 419 (CSRF could not be reseeded) and any other 4xx: the write was rejected
  // before anything was registered, so this is a genuine failure.
  logJoinFailure({
    stage: "upstream-error",
    upstreamStatus: status,
    attempt: join.attempt,
    upstreamMessage: join.upstreamMessage,
    sessionId: value.sessionId,
    slotId: value.slotId,
    patientId,
  });
  return NextResponse.json({ success: false, reason: "api-error" }, { status: 502 });
}
