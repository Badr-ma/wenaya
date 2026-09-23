/**
 * Contact API route (BFF) — receives contact/booking/corporate/recruitment
 * form POSTs from every client form and forwards them to the backend contact
 * endpoint through `submitContact`. Returns a normalized JSON contract:
 *
 *   200 { success: true }
 *   400 { success: false, reason: "validation-error", fields?: {field: msg} }
 *   502 { success: false, reason: "backend-error" | "network-error" }
 *   504 { success: false, reason: "network-error" }
 *
 * This route is the ONLY submission seam — no client ever calls the backend
 * directly, and no stack traces / upstream URLs / raw exception strings are
 * ever leaked to the browser.
 */
import { NextRequest, NextResponse } from "next/server";
import { CONTACT_BODY_MAX_CHARS } from "@/lib/contact/config";
import { submitContact } from "@/lib/contact/contact-submit";

function validationResponse(fields?: Record<string, string>): NextResponse {
  return NextResponse.json(
    { success: false, reason: "validation-error", ...(fields ? { fields } : {}) },
    { status: 400 },
  );
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > CONTACT_BODY_MAX_CHARS) {
    return validationResponse({ form: "payload-too-large" });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw) as unknown;
  } catch {
    return validationResponse({ form: "invalid-json" });
  }
  if (Array.isArray(body)) {
    return validationResponse({ form: "invalid-payload" });
  }

  const result = await submitContact(body);
  switch (result.kind) {
    case "success":
      return NextResponse.json({ success: true });
    case "validation-error":
      return validationResponse(result.fields);
    case "backend-error":
      return NextResponse.json({ success: false, reason: "backend-error" }, { status: 502 });
    case "timeout":
      return NextResponse.json({ success: false, reason: "network-error" }, { status: 504 });
    case "network-error":
      return NextResponse.json({ success: false, reason: "network-error" }, { status: 502 });
    default:
      return NextResponse.json({ success: false, reason: "backend-error" }, { status: 502 });
  }
}