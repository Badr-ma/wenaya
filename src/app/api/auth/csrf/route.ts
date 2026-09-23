import { NextResponse, type NextRequest } from "next/server";
import { browserCookieHeader } from "@/lib/patient-auth/cookies";
import { seedPatientCsrf } from "@/lib/patient-auth/transport";

/**
 * GET /api/auth/csrf
 *
 * Seeds the Laravel Sanctum session for the browser: forwards to
 * `GET /sanctum/csrf-cookie` and relays every upstream `Set-Cookie`
 * (`we_session`, and on rotation `XSRF-TOKEN`) back unchanged. The browser
 * therefore holds the Sanctum session cookies directly — the BFF keeps no
 * session state. Read-only: no state is changed on this box and no write is
 * made against the backend.
 *
 * Normalized contract: 200 `{ success: true, type: "success" }` + Set-Cookie(s);
 * on upstream failure a failing instance of the shared envelope (see
 * `response.ts`) is returned.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const result = await seedPatientCsrf(browserCookieHeader(request));

  if (result.outcome.status === null) {
    return NextResponse.json(
      result.outcome.aborted
        ? { success: false, type: "timeout" }
        : { success: false, type: "backend-error" },
      { status: result.outcome.aborted ? 504 : 502 },
    );
  }
  if (result.outcome.status < 200 || result.outcome.status >= 300) {
    return NextResponse.json(
      { success: false, type: "backend-error", upstreamStatus: result.outcome.status },
      { status: 502 },
    );
  }

  const res = NextResponse.json({ success: true, type: "success" });
  for (const sc of result.setCookies) {
    res.headers.append("Set-Cookie", sc);
  }
  return res;
}