import { NextResponse, type NextRequest } from "next/server";
import {
  PATIENT_BODY_MAX_CHARS,
  PATIENT_REGISTER_ENABLED,
} from "@/lib/patient-auth/config";
import { browserCookieHeader } from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import { buildRegisterBody } from "@/lib/patient-auth/register";
import { submitPatientRegister } from "@/lib/patient-auth/transport";
import {
  invalidPayloadResponse,
  mapRegisterOutcome,
  notEnabledResponse,
  validationErrorResponse,
} from "@/lib/patient-auth/response";

/**
 * POST /api/auth/register
 *
 * GUARDED: returns the normalized 403 `{ success: false, type: "not-enabled" }`
 * until `PATIENT_REGISTER_ENABLED === "true"`. The transport self-heals a
 * single CSRF rotation exactly like login (Proven on DEV 2026-09-20: a bare
 * POST returns 419, reseeding `/sanctum/csrf-cookie` then retrying succeeds).
 *
 * The client sends only identity/contact fields:
 * `{ firstName, lastName, email, password, phone, countryCode?, timezone?,
 * currency?, isTuteurLegal? }`. The BFF ALWAYS injects `role: "patient"` and
 * applies the probe-verified defaults for any missing countryCode/timezone/
 * currency (see register.ts). On success Laravel auto-authenticates the new
 * patient; the Set-Cookie values are relayed unchanged and the client resolves
 * the session via `/api/auth/me`. No account is ever created implicitly.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!PATIENT_REGISTER_ENABLED) {
    const built = notEnabledResponse();
    return NextResponse.json(built.body, { status: built.status });
  }

  const raw = await request.text();
  if (raw.length > PATIENT_BODY_MAX_CHARS) {
    const built = invalidPayloadResponse();
    return NextResponse.json(built.body, { status: built.status });
  }
  let payload: unknown;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    const built = invalidPayloadResponse();
    return NextResponse.json(built.body, { status: built.status });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    const built = invalidPayloadResponse();
    return NextResponse.json(built.body, { status: built.status });
  }

  const builtPayload = buildRegisterBody(payload);
  if (!builtPayload.ok) {
    const built = validationErrorResponse(builtPayload.fields);
    return NextResponse.json(built.body, { status: built.status });
  }

  const result = await submitPatientRegister({
    cookieHeader: browserCookieHeader(request),
    xsrfHeader: readXsrfHeaderFromCookie(request),
    body: builtPayload.body,
  });
  const built = mapRegisterOutcome(result.outcome);

  const res = NextResponse.json(built.body, { status: built.status });
  for (const sc of result.setCookies) {
    res.headers.append("Set-Cookie", sc);
  }
  return res;
}