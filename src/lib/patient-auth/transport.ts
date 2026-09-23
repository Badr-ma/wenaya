/**
 * Patient Sanctum auth transport — server-to-server forwarding to Laravel.
 *
 * SERVER-ONLY module; called by the `src/app/api/auth/*` route handlers which
 * run exclusively on the server. No `next/server` import (pure Node) so the
 * forwarding + CSRF retry logic can be unit-tested directly.
 *
 * Design rules enforced here:
 * - Laravel (Sanctum) stays the single source of truth for the patient session.
 *   We never create, forge or decode `we_session`; we only (a) forward the
 *   browser's cookies verbatim, (b) relay every upstream `Set-Cookie` back.
 * - No `Authorization`/Bearer header, no home-grown token, no `company` header
 *   (no doc-proven requirement on the auth endpoints — see audit §8).
 * - CSRF: on 419, reseed `/sanctum/csrf-cookie` ONCE, swap in the fresh
 *   `we_session`, retry ONCE, then stop. No retry loop.
 * - Nothing is logged: no credentials, no cookie values, no header dumps.
 */

import {
  PATIENT_API_BASE,
  PATIENT_CSRF_PATH,
  PATIENT_ME_PATH,
  PATIENT_PROFILE_PATH,
  PATIENT_LOGIN_PATH,
  PATIENT_LOGOUT_PATH,
  PATIENT_REGISTER_PATH,
  PATIENT_TIMEOUT_MS,
} from "./config";
import { applyReseedCookies, collectSetCookies } from "./cookies";
import type { UpstreamOutcome } from "./response";

/** Upstream outcome plus any `Set-Cookie` values to relay to the browser. */
export interface TransportResult {
  outcome: UpstreamOutcome;
  setCookies: string[];
}

interface ForwardOptions {
  cookieHeader?: string;
  xsrfHeader?: string | null;
  body?: unknown;
}

/** Single shared timeout controller for one upstream call. */
async function fetchUpstream(path: string, init: RequestInit): Promise<TransportResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PATIENT_TIMEOUT_MS);
  let status: number | null = null;
  let json: UpstreamOutcome["json"] = null;
  let aborted = false;
  let networkError = false;
  let headers: Headers | undefined;
  try {
    const res = await fetch(`${PATIENT_API_BASE}${path}`, { ...init, signal: controller.signal });
    status = res.status;
    headers = res.headers;
    const text = await res.text();
    if (text) {
      try {
        json = JSON.parse(text) as UpstreamOutcome["json"];
      } catch {
        json = null;
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") aborted = true;
    else networkError = true;
  } finally {
    clearTimeout(timer);
  }
  const setCookies = headers ? collectSetCookies(headers) : [];
  return { outcome: { status, json, aborted, networkError }, setCookies };
}

function baseHeaders(opts: ForwardOptions, method: "GET" | "POST"): Headers {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  if (method === "POST") headers.set("Content-Type", "application/json");
  if (opts.cookieHeader) headers.set("Cookie", opts.cookieHeader);
  if (opts.xsrfHeader) headers.set("X-XSRF-TOKEN", opts.xsrfHeader);
  return headers;
}

/**
 * GET /sanctum/csrf-cookie → 204 + we_session (and on session rotation, a fresh
 * XSRF-TOKEN). Always relays every upstream Set-Cookie to the caller unchanged.
 */
export async function seedPatientCsrf(cookieHeader?: string): Promise<TransportResult> {
  return fetchUpstream(PATIENT_CSRF_PATH, {
    method: "GET",
    headers: baseHeaders({ cookieHeader }, "GET"),
  });
}

/** GET /api/v1/customer → the current patient session, or 401 when anonymous. */
export async function fetchPatientMe(cookieHeader?: string): Promise<TransportResult> {
  return fetchUpstream(PATIENT_ME_PATH, {
    method: "GET",
    headers: baseHeaders({ cookieHeader }, "GET"),
  });
}

/**
 * GET /api/v1/getCustomerInformations → the authenticated patient's profile,
 * or 401 when anonymous. Same cookie-relay rules as fetchPatientMe; the BFF
 * route strips any extra upstream envelope fields (wallet, legal_guardian_id,
 * raw arrays) before the normalized PatientProfile ever leaves the server.
 */
export async function fetchPatientProfile(cookieHeader?: string): Promise<TransportResult> {
  return fetchUpstream(PATIENT_PROFILE_PATH, {
    method: "GET",
    headers: baseHeaders({ cookieHeader }, "GET"),
  });
}

/**
 * POST a state-changing request (login/logout) with a single self-healing CSRF
 * cycle. Works even when the browser only holds a stale `we_session` cookie:
 * the first 419 triggers one `GET /sanctum/csrf-cookie` reseed, whose fresh
 * session cookie is swapped into the retry request and whose Set-Cookie values
 * are returned so the browser ends up with the reset session too.
 */
async function postWithCsrfRetry(path: string, opts: ForwardOptions): Promise<TransportResult> {
  let cookieHeader = opts.cookieHeader;
  let xsrfHeader = opts.xsrfHeader ?? null;
  const relay: string[] = [];

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await fetchUpstream(path, {
      method: "POST",
      headers: baseHeaders({ cookieHeader, xsrfHeader }, "POST"),
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    });
    for (const sc of result.setCookies) relay.push(sc);

    if (attempt === 0 && result.outcome.status === 419) {
      const reseed = await seedPatientCsrf(cookieHeader);
      for (const sc of reseed.setCookies) relay.push(sc);

      const applied = applyReseedCookies(cookieHeader, reseed.setCookies);
      cookieHeader = applied.cookieHeader;
      if (applied.xsrfToken) xsrfHeader = applied.xsrfToken;
      continue;
    }
    return result;
  }

  // Both attempts were 419 → surface the last outcome as csrf-error.
  const last = await fetchUpstream(path, {
    method: "POST",
    headers: baseHeaders({ cookieHeader, xsrfHeader }, "POST"),
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  for (const sc of last.setCookies) relay.push(sc);
  return { outcome: last.outcome, setCookies: relay };
}

/** POST /customer/login — GUARDED at the route layer; transport itself is complete. */
export function submitPatientLogin(opts: ForwardOptions): Promise<TransportResult> {
  return postWithCsrfRetry(PATIENT_LOGIN_PATH, opts);
}

/** POST /customer/logout — GUARDED at the route layer. */
export function submitPatientLogout(opts: ForwardOptions): Promise<TransportResult> {
  return postWithCsrfRetry(PATIENT_LOGOUT_PATH, opts);
}

/**
 * POST /user/register — GUARDED at the route layer (`PATIENT_REGISTER_ENABLED`).
 * Same single self-healing CSRF cycle as login; on success Laravel logs the new
 * patient in (proven: a follow-up GET /api/v1/customer with the relayed cookies
 * returns the authenticated customer), so the BFF relays the Set-Cookie values
 * and the client can resolve the session via `/api/auth/me`.
 */
export function submitPatientRegister(opts: ForwardOptions): Promise<TransportResult> {
  return postWithCsrfRetry(PATIENT_REGISTER_PATH, opts);
}