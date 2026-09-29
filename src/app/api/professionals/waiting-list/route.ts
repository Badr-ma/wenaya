import { NextResponse } from "next/server";
import { PROFESSIONALS_API_BASE } from "@/lib/professionals/config";

/**
 * BFF proxy for the professional booking submission (waiting list).
 *
 *   POST /api/professionals/waiting-list
 *   Body: { customer_name, customer_email, customer_phone, user_id,
 *           booking_date, booking_time, notes? }
 *
 * Forwards the EXACT payload shape the legacy wenaya-front booking flow sent
 * to the backend (`joinWaitingList` → `POST api/v1/waiting-lists` with
 * `status: "pending"` appended server-side below, same as the old client did):
 *
 *   { customer_name, customer_email, customer_phone, user_id, notes,
 *     booking_date, booking_time, status: "pending" }
 *
 * Deliberately a server-side proxy (same policy as the availability route):
 * the browser never talks to the upstream host, and the `company: 1` header
 * the backend requires is owned here.
 *
 * Responses:
 *   - 200 { success: true }
 *   - 400 { success: false, reason: "validation", fields: string[] }
 *   - 502 { success: false, reason: "api-error" }
 *
 * `force-dynamic` by design — a booking submission is never cacheable.
 */
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const MAX_NOTES_LENGTH = 2000;

/** Default fetch timeout (15s) — matches the other professional endpoints. */
const TIMEOUT_MS = 15_000;

function phoneDigitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}

function validate(body: Record<string, unknown>): string[] {
  const fields: string[] = [];
  const name = typeof body.customer_name === "string" ? body.customer_name.trim() : "";
  const email = typeof body.customer_email === "string" ? body.customer_email.trim() : "";
  const phone = typeof body.customer_phone === "string" ? body.customer_phone.trim() : "";
  const userId = Number(body.user_id);
  const date = typeof body.booking_date === "string" ? body.booking_date : "";
  const time = typeof body.booking_time === "string" ? body.booking_time : "";

  if (!name || name.length > 200) fields.push("customer_name");
  if (!email || !EMAIL_RE.test(email)) fields.push("customer_email");
  const digits = phoneDigitCount(phone);
  if (!phone || digits < 8 || digits > 15) fields.push("customer_phone");
  if (!Number.isInteger(userId) || userId <= 0) fields.push("user_id");
  if (!ISO_DATE_RE.test(date)) fields.push("booking_date");
  if (!TIME_RE.test(time)) fields.push("booking_time");
  if (body.notes !== undefined && typeof body.notes !== "string") fields.push("notes");
  if (typeof body.notes === "string" && body.notes.length > MAX_NOTES_LENGTH) fields.push("notes");

  return fields;
}

export async function POST(request: Request) {
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
  const fields = validate(body);
  if (fields.length > 0) {
    return NextResponse.json({ success: false, reason: "validation", fields }, { status: 400 });
  }

  // Byte-identical payload shape to the legacy `joinWaitingList` call.
  const payload = {
    customer_name: (body.customer_name as string).trim(),
    customer_email: (body.customer_email as string).trim(),
    customer_phone: (body.customer_phone as string).trim(),
    user_id: Number(body.user_id),
    notes: typeof body.notes === "string" ? body.notes : "",
    booking_date: body.booking_date as string,
    booking_time: body.booking_time as string,
    status: "pending",
  };

  try {
    const upstream = await fetch(`${PROFESSIONALS_API_BASE}/api/v1/waiting-lists`, {
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
