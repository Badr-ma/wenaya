import { NextResponse, type NextRequest } from "next/server";
import { browserCookieHeader } from "@/lib/patient-auth/cookies";
import { fetchPatientProfile } from "@/lib/patient-auth/transport";
import { mapPatientOutcome } from "@/lib/patient-auth/response";
import { normalizePatientProfile, type PatientProfile } from "@/lib/patient-auth/profile";

/** Upstream profile envelope type — NOT exported from profile.ts; derive via Parameters. */
type ProfileEnvelope = Parameters<typeof normalizePatientProfile>[0];

/**
 * GET /api/account/profile
 *
 * Returns the authenticated patient's read-only profile — the BFF boundary for
 * `GET /api/v1/getCustomerInformations`. Session semantics are byte-identical to
 * the `/api/auth/me` route (same Sanctum cookies, same Laravel session), so ALL
 * error mapping is delegated to `mapPatientOutcome` unchanged (401 → 401
 * unauthenticated, 419 → 419 csrf-error, 400/422 → validation-error, 502 →
 * backend-error, 504 → timeout/backend-error). The ONLY difference is the success
 * branch: instead of the minimal `user` envelope (me contract), it returns the
 * NORMALIZED read-only `PatientProfile` under `profile` — PII (email, phone,
 * wallet) and raw upstream arrays (addresses, destinations, legal guardians)
 * never cross this boundary; `normalizePatientProfile` strips them upstream-side.
 * Anonymous visitors get the same normalized 401 `{success:false,type:"unauthenticated"}`
 * as the me route. Read-only and inert: no writes, no booking, no payments.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const result = await fetchPatientProfile(browserCookieHeader(request));
  const built = mapPatientOutcome(result.outcome);

  const res =
    built.body.type === "success" && built.status === 200
      ? NextResponse.json(
          {
            success: true,
            type: "success",
            profile: normalizePatientProfile(result.outcome.json as ProfileEnvelope),
          } satisfies { success: true; type: "success"; profile: PatientProfile },
          { status: built.status },
        )
      : NextResponse.json(built.body, { status: built.status });

  for (const sc of result.setCookies) {
    res.headers.append("Set-Cookie", sc);
  }
  return res;
}
