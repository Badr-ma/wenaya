/**
 * Patient address BFF — relays the authenticated patient's addresses between
 * the shop checkout and the Laravel customer API.
 *
 * GET  /api/patient/addresses → /api/v1/getAllCustomerAddresses
 * POST /api/patient/addresses → /api/v1/createCustomerAddress
 */
import { NextResponse, type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-base";
import {
  applyReseedCookies,
  browserCookieHeader,
  isSecureRequest,
  relayableSetCookies,
} from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import { seedPatientCsrf } from "@/lib/patient-auth/transport";

export const dynamic = "force-dynamic";

const GET_UPSTREAM_PATH = "/api/v1/getAllCustomerAddresses";
const POST_UPSTREAM_PATH = "/api/v1/createCustomerAddress";
const TIMEOUT_MS = 15_000;

function extractSetCookies(response: Response): string[] {
  if (typeof response.headers.getSetCookie === "function") {
    return [...response.headers.getSetCookie()];
  }
  const setCookies: string[] = [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") setCookies.push(value);
  });
  return setCookies;
}

async function forward(
  upstreamPath: string,
  method: "GET" | "POST",
  cookieHeader: string | undefined,
  xsrfToken: string | null,
  body?: string
): Promise<{ response: Response; setCookies: string[] }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = new Headers({ Accept: "application/json" });
    if (method === "POST") headers.set("Content-Type", "application/json");
    if (cookieHeader) headers.set("Cookie", cookieHeader);
    if (xsrfToken) headers.set("X-XSRF-TOKEN", xsrfToken);

    const response = await fetch(`${getApiBaseUrl()}${upstreamPath}`, {
      method,
      headers,
      ...(method === "POST" ? { body } : {}),
      signal: controller.signal,
    });

    return { response, setCookies: extractSetCookies(response) };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  let cookieHeader = browserCookieHeader(request);

  const result = await forward(GET_UPSTREAM_PATH, "GET", cookieHeader, null);

  const text = await result.response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  const res = NextResponse.json(
    json ?? { error: true, message: "Upstream error", data: [] },
    { status: result.response.status }
  );

  for (const sc of relayableSetCookies(result.setCookies, isSecureRequest(request))) {
    res.headers.append("Set-Cookie", sc);
  }

  return res;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let cookieHeader = browserCookieHeader(request);
  let xsrfToken = readXsrfHeaderFromCookie(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: true, message: "Invalid JSON body" }, { status: 400 });
  }

  let result = await forward(
    POST_UPSTREAM_PATH,
    "POST",
    cookieHeader,
    xsrfToken,
    JSON.stringify(body)
  );

  // Single CSRF self-heal retry, mirroring the patient-auth transport.
  if (result.response.status === 419) {
    const reseed = await seedPatientCsrf(cookieHeader);
    const applied = applyReseedCookies(cookieHeader, reseed.setCookies);
    cookieHeader = applied.cookieHeader;
    if (applied.xsrfToken) xsrfToken = applied.xsrfToken;

    const retry = await forward(
      POST_UPSTREAM_PATH,
      "POST",
      cookieHeader,
      xsrfToken,
      JSON.stringify(body)
    );
    retry.setCookies.unshift(...reseed.setCookies);
    result = retry;
  }

  const text = await result.response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  const res = NextResponse.json(
    json ?? { error: true, message: "Upstream error" },
    { status: result.response.status }
  );

  for (const sc of relayableSetCookies(result.setCookies, isSecureRequest(request))) {
    res.headers.append("Set-Cookie", sc);
  }

  return res;
}
