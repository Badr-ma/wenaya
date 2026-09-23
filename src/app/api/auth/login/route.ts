import { NextResponse, type NextRequest } from "next/server";
import { PATIENT_AUTH_ENABLED, PATIENT_BODY_MAX_CHARS } from "@/lib/patient-auth/config";
import { browserCookieHeader } from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import { submitPatientLogin } from "@/lib/patient-auth/transport";
import { invalidPayloadResponse, mapPatientOutcome, notEnabledResponse } from "@/lib/patient-auth/response";

/**
 * POST /api/auth/login
 *
 * GUARDED: returns the normalized 403 `{ success: false, type: "not-enabled" }`
 * until `PATIENT_AUTH_ENABLED === "true"`. The transport itself is complete —
 * it forwards `POST /customer/login` `{ email, password }` with the browser's
 * Sanctum cookies and XSRF token, and self-heals a single CSRF rotation on 419.
 *
 * When enabled, session cookies set by Laravel are relayed to the browser
 * unchanged; no token or session is stored on this box. This endpoint is
 * intentionally NOT wired to any UI.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!PATIENT_AUTH_ENABLED) {
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
  const body = payload as { email?: unknown; password?: unknown };
  if (typeof body.email !== "string" || typeof body.password !== "string") {
    const built = invalidPayloadResponse();
    return NextResponse.json(built.body, { status: built.status });
  }

  const result = await submitPatientLogin({
    cookieHeader: browserCookieHeader(request),
    xsrfHeader: readXsrfHeaderFromCookie(request),
    body: { email: body.email, password: body.password },
  });
  const built = mapPatientOutcome(result.outcome);

  const res = NextResponse.json(built.body, { status: built.status });
  for (const sc of result.setCookies) {
    res.headers.append("Set-Cookie", sc);
  }
  return res;
}