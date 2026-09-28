/**
 * Waiting-list API route (BFF) — accepts email subscriptions for the Shop and
 * Configurator coming-soon waiting lists. Validates input, persists to Upstash
 * Redis via `addToWaitingList`, and returns a normalized JSON contract:
 *
 *   200 { success: true, status: "added" | "existing" }
 *   400 { success: false, reason: "validation-error", fields?: {field: msg} }
 *   503 { success: false, reason: "storage-unavailable" }
 *   500 { success: false, reason: "storage-error" }
 *
 * Client-side forms POST here directly; this route is the ONLY submission seam
 * for waiting-list emails. Consent is required (fresh checkbox each time).
 */
import { NextRequest, NextResponse } from "next/server";
import {
  addToWaitingList,
  isValidWaitingListEmail,
  isValidWaitingListSource,
  normalizeEmail,
  WAITLIST_BODY_MAX_CHARS,
} from "@/lib/waiting-list";

function validationResponse(fields?: Record<string, string>): NextResponse {
  return NextResponse.json(
    { success: false, reason: "validation-error", ...(fields ? { fields } : {}) },
    { status: 400 },
  );
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length === 0 || raw.length > WAITLIST_BODY_MAX_CHARS) {
    return validationResponse({ form: "payload-too-large" });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw) as unknown;
  } catch {
    return validationResponse({ form: "invalid-json" });
  }
  if (Array.isArray(body) || typeof body !== "object" || body === null) {
    return validationResponse({ form: "invalid-payload" });
  }

  const { email, source, locale, consented } = body as Record<string, unknown>;

  const emailStr = typeof email === "string" ? email : "";
  if (!isValidWaitingListEmail(emailStr)) {
    return validationResponse({ email: "invalid-email" });
  }
  if (!isValidWaitingListSource(source)) {
    return validationResponse({ source: "invalid-source" });
  }
  if (consented !== true) {
    return validationResponse({ consented: "required" });
  }

  const localeStr = typeof locale === "string" && (locale === "fr" || locale === "en") ? locale : "fr";

  const outcome = await addToWaitingList({
    email: normalizeEmail(emailStr),
    source,
    locale: localeStr,
    consented: true,
  });

  switch (outcome.kind) {
    case "added":
      return NextResponse.json({ success: true, status: "added" });
    case "existing":
      return NextResponse.json({ success: true, status: "existing" });
    case "storage-unavailable":
      return NextResponse.json({ success: false, reason: "storage-unavailable" }, { status: 503 });
    case "storage-error":
      return NextResponse.json({ success: false, reason: "storage-error" }, { status: 500 });
    default:
      return NextResponse.json({ success: false, reason: "storage-error" }, { status: 500 });
  }
}