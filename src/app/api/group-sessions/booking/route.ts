import { NextResponse, type NextRequest } from "next/server";
import { getWenayaApiBase } from "@/lib/api/client";
import { fetchGroupPrograms, type ApiGroupProgram } from "@/lib/group-sessions-api";
import { browserCookieHeader } from "@/lib/patient-auth/cookies";
import { fetchPatientProfile } from "@/lib/patient-auth/transport";
import { mapPatientOutcome } from "@/lib/patient-auth/response";
import { normalizePatientProfile, type PatientProfile } from "@/lib/patient-auth/profile";

/**
 * POST /api/group-sessions/booking
 *
 * Authenticated booking-request submission for a live group session — the
 * group-session counterpart of `/api/professionals/waiting-list`, reusing the
 * SAME upstream contract the practitioner booking flow already sends:
 *
 *   POST {WENAYA_API_URL}/api/v1/waiting-lists
 *   { customer_name, customer_email, customer_phone, user_id, notes,
 *     booking_date, booking_time, status: "pending" }
 *
 * Deliberately a "booking REQUEST" seam, not a class registration: the
 * production-side-effect endpoint `joinPatientToGroupAppointment`
 * (`WRITE_PRODUCTION_SIDE_EFFECT` in `wenaya-api-integration-master-plan.md`)
 * is never called, and no reservation/confirmation is claimed. The backend owns
 * final eligibility and capacity.
 *
 *   Body: { sessionId, slotId, date, time }
 *
 * Hard requirements this route adds over the guest practitioner route:
 *
 *   1. A patient session is MANDATORY. The visitor's Sanctum cookies are read
 *      through `/api/v1/getCustomerInformations`; anonymous callers get the
 *      normalized 401 `unauthenticated` and NO request is created.
 *   2. Customer identity is taken from the AUTHENTICATED profile, never from
 *      client input — the browser cannot book as someone else.
 *   3. The slot is re-validated server-side against the live programme feed: an
 *      unknown programme, an unknown slot, a slot that does not belong to that
 *      programme, a date/time mismatch, or a non-`active` slot is rejected. A
 *      request is therefore only ever created for a slot that really exists.
 *      Titles in `notes` come from the feed, not the client.
 *   4. `user_id` is the programme's PROFESSIONAL id (DEV-verified: a programme
 *      or slot id is rejected upstream with 422 "selected user id is invalid").
 *
 * The browser never talks to the upstream host, and the `company: 1` header the
 * backend requires is owned here.
 *
 * Responses:
 *   - 200 { success: true }                       (pending request created)
 *   - 400 { success: false, reason: "validation", fields: string[] }
 *   - 401 { success: false, type: "unauthenticated" }
 *   - 502 { success: false, reason: "api-error" }
 *   - 504 { success: false, reason: "feed-unavailable" }
 *
 * `force-dynamic` by design — a booking submission is never cacheable.
 */
export const dynamic = "force-dynamic";

/** Default fetch timeout (15s) — matches the shared API client. */
const TIMEOUT_MS = 15_000;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const MAX_NOTES_LENGTH = 2000;

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
  | { kind: "ok"; title: string; date: string; time: string; professionalId: number }
  | { kind: "feed-unavailable" }
  | { kind: "not-found" }
  | { kind: "not-bookable" };

/**
 * Resolve the requested slot against the live programme feed.
 *
 * Liveness is taken from the backend's own `event_status` (it flips to
 * `completed` once a slot is over — see `wenaya-group-sessions-api-contract.md`).
 * No extra local clock gate is applied on purpose: a same-day early slot can
 * already be "yesterday" in UTC, so a local date comparison would reject slots
 * the backend still considers bookable.
 *
 * `professionalId` is the programme's embedded `professional.id`. The upstream
 * `waiting-lists` `user_id` is a PROFESSIONAL user id, NOT a programme or slot
 * id — verified on DEV 2026-09-29: `user_id: 799` (programme) and
 * `user_id: 1033` (slot) both return 422 "The selected user id is invalid",
 * while `user_id: 176` (Thomas Sabrou) returns 200 and creates the row.
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
  // Only a live, still-active slot can receive a booking request.
  if (child.event_status !== "active") return { kind: "not-found" };
  const date = child.event_date ?? "";
  const time = (child.event_time ?? "").slice(0, 5);
  if (!ISO_DATE_RE.test(date) || !TIME_RE.test(time)) return { kind: "not-found" };
  // Without the owning professional there is no valid `user_id` to send, so the
  // request cannot be created at all (upstream data problem, not a user error).
  const professionalId = program.professional?.id;
  if (!Number.isInteger(professionalId) || (professionalId as number) <= 0) {
    return { kind: "not-bookable" };
  }
  return { kind: "ok", title: program.title ?? "", date, time, professionalId: professionalId as number };
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

  // 1. A patient session is mandatory.
  const session = await fetchPatientProfile(browserCookieHeader(request));
  const mapped = mapPatientOutcome(session.outcome);
  if (mapped.body.type !== "success") {
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
  const profile: PatientProfile = normalizePatientProfile(
    session.outcome.json as ProfileEnvelope
  );

  const email = (profile.email ?? "").trim();
  const name = (profile.fullName ?? "").trim() || `${profile.firstName} ${profile.lastName}`.trim();
  if (!email || !name) {
    return NextResponse.json(
      { success: false, reason: "validation", fields: ["profile"] },
      { status: 400 }
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
  if (slot.kind === "not-bookable") {
    // The programme carries no usable professional, so no valid upstream
    // `user_id` exists. Not the visitor's fault and not fixable by retrying a
    // different slot, so it is reported as an upstream error, not validation.
    return NextResponse.json({ success: false, reason: "api-error" }, { status: 502 });
  }
  // A tampered date/time must not book a different slot.
  if (slot.date !== value.date || slot.time !== value.time) {
    return NextResponse.json(
      { success: false, reason: "validation", fields: ["date", "time"] },
      { status: 400 }
    );
  }

  const notes = [
    "Wenaya — demande de reservation groupe",
    `Programme : ${slot.title} (id ${value.sessionId})`,
    `Creneau : ${slot.date} ${slot.time} (slot ${value.slotId})`,
  ]
    .join("\n")
    .slice(0, MAX_NOTES_LENGTH);

  const payload = {
    customer_name: name,
    customer_email: email,
    customer_phone: (profile.phone ?? "").trim(),
    // The owning professional — verified DEV contract, see resolveLiveSlot().
    user_id: slot.professionalId,
    notes,
    booking_date: slot.date,
    booking_time: slot.time,
    status: "pending",
  };

  try {
    const upstream = await fetch(`${getWenayaApiBase()}/api/v1/waiting-lists`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        company: "1",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!upstream.ok) {
      return NextResponse.json({ success: false, reason: "api-error" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, reason: "api-error" }, { status: 502 });
  }
}
