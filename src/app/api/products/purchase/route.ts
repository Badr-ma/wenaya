/**
 * Product purchase BFF — forwards purchase requests to the Laravel V2 API.
 *
 * POST /api/products/purchase
 * Authenticated payload: { items: [{ slug, quantity }], address_id, payment_method?, notes? }
 * Guest payload:       { items: [{ slug, quantity }], guest: { name, phone, email? }, address: { ... }, payment_method?, notes? }
 */
import { NextResponse, type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/api-base";
import { browserCookieHeader, isSecureRequest, relayableSetCookies } from "@/lib/patient-auth/cookies";
import { readXsrfHeaderFromCookie } from "@/lib/patient-auth/csrf";
import { seedPatientCsrf } from "@/lib/patient-auth/transport";
import { applyReseedCookies } from "@/lib/patient-auth/cookies";
import { PUBLIC_SHOP_COMPANY_SLUG } from "@/lib/products/api-adapter";

export const dynamic = "force-dynamic";

const AUTH_UPSTREAM_PATH = `/api/v2/${PUBLIC_SHOP_COMPANY_SLUG}/customer/products/purchase`;
const GUEST_UPSTREAM_PATH = `/api/v2/${PUBLIC_SHOP_COMPANY_SLUG}/public/products/guest-purchase`;
const TIMEOUT_MS = 15_000;

function isGuestBody(body: unknown): body is { guest?: unknown; address?: unknown } {
  return typeof body === "object" && body !== null && "guest" in body && "address" in body;
}

async function forwardPurchase(
  upstreamPath: string,
  body: unknown,
  cookieHeader: string | undefined,
  xsrfToken: string | null
): Promise<{ response: Response; setCookies: string[] }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    if (cookieHeader) headers.set("Cookie", cookieHeader);
    if (xsrfToken) headers.set("X-XSRF-TOKEN", xsrfToken);

    const response = await fetch(`${getApiBaseUrl()}${upstreamPath}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const setCookies: string[] = [];
    if (typeof response.headers.getSetCookie === "function") {
      setCookies.push(...response.headers.getSetCookie());
    } else {
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") setCookies.push(value);
      });
    }

    return { response, setCookies };
  } finally {
    clearTimeout(timer);
  }
}

async function forwardGuestPurchase(
  body: unknown
): Promise<{ response: Response; setCookies: string[] }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}${GUEST_UPSTREAM_PATH}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const setCookies: string[] = [];
    if (typeof response.headers.getSetCookie === "function") {
      setCookies.push(...response.headers.getSetCookie());
    } else {
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") setCookies.push(value);
      });
    }

    return { response, setCookies };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: true, message: "Invalid JSON body" }, { status: 400 });
  }

  const isGuest = isGuestBody(body);
  let result: { response: Response; setCookies: string[] };

  if (isGuest) {
    // Public guest endpoint: no patient cookie / CSRF required.
    result = await forwardGuestPurchase(body);
  } else {
    let cookieHeader = browserCookieHeader(request);
    let xsrfToken = readXsrfHeaderFromCookie(request);

    result = await forwardPurchase(AUTH_UPSTREAM_PATH, body, cookieHeader, xsrfToken);

    // Single CSRF self-heal retry, mirroring the patient-auth transport.
    if (result.response.status === 419) {
      const reseed = await seedPatientCsrf(cookieHeader);
      const applied = applyReseedCookies(cookieHeader, reseed.setCookies);
      cookieHeader = applied.cookieHeader;
      if (applied.xsrfToken) xsrfToken = applied.xsrfToken;

      const retry = await forwardPurchase(AUTH_UPSTREAM_PATH, body, cookieHeader, xsrfToken);
      retry.setCookies.unshift(...reseed.setCookies);
      result = retry;
    }
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

  const res = NextResponse.json(json ?? { error: true, message: "Upstream error" }, {
    status: result.response.status,
  });

  for (const sc of relayableSetCookies(result.setCookies, isSecureRequest(request))) {
    res.headers.append("Set-Cookie", sc);
  }

  return res;
}
