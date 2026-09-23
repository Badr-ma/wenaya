import { NextResponse, type NextRequest } from "next/server";
import { browserCookieHeader } from "@/lib/patient-auth/cookies";
import { fetchPatientMe } from "@/lib/patient-auth/transport";
import { mapPatientOutcome } from "@/lib/patient-auth/response";

/**
 * GET /api/auth/me
 *
 * Returns the current patient session (the sole source of truth is Laravel
 * Sanctum, reached through `GET /api/v1/customer`). Anonymous visitors get the
 * normalized 401 `{ success: false, type: "unauthenticated" }`; the browser's
 * own Sanctum cookies drive the answer — nothing is stored on this box.
 * Read-only and inert: it never creates state and the UI is not wired to it.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const result = await fetchPatientMe(browserCookieHeader(request));
  const built = mapPatientOutcome(result.outcome);

  const res = NextResponse.json(built.body, { status: built.status });
  for (const sc of result.setCookies) {
    res.headers.append("Set-Cookie", sc);
  }
  return res;
}