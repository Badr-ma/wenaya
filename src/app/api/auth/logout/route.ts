import { NextResponse, type NextRequest } from "next/server";
import { PATIENT_AUTH_ENABLED } from "@/lib/patient-auth/config";
import { browserCookieHeader } from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import { submitPatientLogout } from "@/lib/patient-auth/transport";
import { mapPatientOutcome, notEnabledResponse } from "@/lib/patient-auth/response";

/**
 * POST /api/auth/logout
 *
 * GUARDED the same way as `/api/auth/login`: until `PATIENT_AUTH_ENABLED ===
 * "true"` this returns the normalized 403 `{ success: false, type:
 * "not-enabled" }`. When enabled it forwards `POST /customer/logout` with the
 * browser's Sanctum cookies and a single CSRF self-healing cycle, relaying any
 * session-clearing `Set-Cookie` back to the browser. The BFF stores nothing.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!PATIENT_AUTH_ENABLED) {
    const built = notEnabledResponse();
    return NextResponse.json(built.body, { status: built.status });
  }

  const result = await submitPatientLogout({
    cookieHeader: browserCookieHeader(request),
    xsrfHeader: readXsrfHeaderFromCookie(request),
  });
  const built = mapPatientOutcome(result.outcome);

  const res = NextResponse.json(built.body, { status: built.status });
  for (const sc of result.setCookies) {
    res.headers.append("Set-Cookie", sc);
  }
  return res;
}