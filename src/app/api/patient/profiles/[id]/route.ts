import { NextResponse, type NextRequest } from "next/server";
import {
  browserCookieHeader,
  isSecureRequest,
  relayableSetCookies,
} from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import {
  forwardPatientProfileRequest,
  normalizeMedicalProfile,
  normalizeProfileWrite,
  readUpstreamMessage,
} from "@/lib/patient-profile-proxy";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

function validId(raw: string): string | null {
  return /^\d{1,12}$/.test(raw) && Number(raw) > 0 ? String(Number(raw)) : null;
}

export async function GET(request: NextRequest, context: Context): Promise<NextResponse> {
  const id = validId((await context.params).id);
  if (!id) return NextResponse.json({ success: false, type: "invalid-link" }, { status: 400 });
  const result = await forwardPatientProfileRequest({
    method: "GET",
    path: `/api/v1/getProfile/${id}`,
    cookieHeader: browserCookieHeader(request),
  });
  const upstream = result.json && typeof result.json === "object" && !Array.isArray(result.json)
    ? result.json as Record<string, unknown>
    : null;
  const profile = normalizeMedicalProfile(upstream?.data ?? result.json);
  if (result.status < 200 || result.status >= 300 || upstream?.error === true || !profile) {
    const status = result.status === 401 || result.status === 403 ? result.status : 502;
    return NextResponse.json({ success: false, type: status === 401 ? "unauthenticated" : "profile-unavailable" }, { status });
  }
  const response = NextResponse.json({ success: true, profile }, { headers: { "Cache-Control": "private, no-store" } });
  for (const cookie of relayableSetCookies(result.setCookies, isSecureRequest(request))) response.headers.append("Set-Cookie", cookie);
  return response;
}

export async function PUT(request: NextRequest, context: Context): Promise<NextResponse> {
  const id = validId((await context.params).id);
  if (!id) return NextResponse.json({ success: false, type: "invalid-link" }, { status: 400 });
  const raw = await request.text();
  if (raw.length > 8_000) return NextResponse.json({ success: false, type: "invalid-payload" }, { status: 413 });
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
    method: "PUT",
    path: `/api/v1/updateProfile/${id}`,
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
