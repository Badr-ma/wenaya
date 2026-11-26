import { NextResponse, type NextRequest } from "next/server";
import {
  browserCookieHeader,
  isSecureRequest,
  relayableSetCookies,
} from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import {
  forwardPatientProfileRequest,
  normalizeProfileWrite,
  readUpstreamMessage,
} from "@/lib/patient-profile-proxy";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const raw = await request.text();
  if (raw.length > 8_000) {
    return NextResponse.json({ success: false, type: "invalid-payload" }, { status: 413 });
  }
  let payload: unknown;
  try {
    payload = raw ? JSON.parse(raw) as unknown : null;
  } catch {
    return NextResponse.json({ success: false, type: "invalid-payload" }, { status: 400 });
  }
  const body = normalizeProfileWrite(payload);
  if (!body || !["self", "child"].includes(String(body.profile_type ?? ""))) {
    return NextResponse.json({ success: false, type: "invalid-payload" }, { status: 400 });
  }

  const result = await forwardPatientProfileRequest({
    method: "POST",
    path: "/api/v1/createProfile",
    cookieHeader: browserCookieHeader(request),
    xsrfToken: readXsrfHeaderFromCookie(request),
    body,
  });
  const upstream = result.json && typeof result.json === "object" && !Array.isArray(result.json)
    ? result.json as Record<string, unknown>
    : null;
  const failed = result.status < 200 || result.status >= 300 || upstream?.error === true;
  const status = failed
    ? result.status === 401 || result.status === 403 ? result.status
      : result.status === 422 ? 422
        : result.status >= 400 && result.status < 500 ? result.status : 502
    : 200;
  const response = NextResponse.json(
    failed
      ? { success: false, type: status === 401 ? "unauthenticated" : status === 422 ? "validation-error" : "request-failed", fields: upstream?.errors, message: readUpstreamMessage(result.json) }
      : { success: true, message: readUpstreamMessage(result.json) },
    { status },
  );
  for (const cookie of relayableSetCookies(result.setCookies, isSecureRequest(request))) response.headers.append("Set-Cookie", cookie);
  return response;
}
