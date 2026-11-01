import { NextResponse, type NextRequest } from "next/server";
import { browserCookieHeader, isSecureRequest, relayableSetCookies } from "@/lib/patient-auth/cookies";
import { readPatientBookings } from "@/lib/patient-bookings-server";

export const dynamic = "force-dynamic";
const privateHeaders = { "Cache-Control": "private, no-store", Vary: "Cookie" };

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const kind = params.get("kind") ?? "appointments";
  const bucket = params.get("bucket") ?? "upcoming";
  const page = Number(params.get("page") ?? 1);
  if ((kind !== "appointments" && kind !== "groups") ||
      (bucket !== "today" && bucket !== "upcoming" && bucket !== "past") ||
      !Number.isSafeInteger(page) || page < 1 || page > 10000) {
    return NextResponse.json({ success: false, type: "invalid-payload" }, { status: 400, headers: privateHeaders });
  }
  try {
    const result = await readPatientBookings(browserCookieHeader(request), kind, page, bucket);
    const response = NextResponse.json(result.body, { status: result.status, headers: privateHeaders });
    for (const cookie of relayableSetCookies(result.setCookies, isSecureRequest(request))) response.headers.append("Set-Cookie", cookie);
    return response;
  } catch {
    return NextResponse.json({ success: false, type: "backend-error" }, { status: 502, headers: privateHeaders });
  }
}
