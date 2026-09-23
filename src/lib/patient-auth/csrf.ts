/**
 * CSRF helpers for the patient Sanctum auth BFF.
 *
 * SERVER-ONLY module. The browser holds the Laravel session cookies
 * (`we_session` + `XSRF-TOKEN`) directly; the BFF only reads the XSRF token the
 * browser sent along (never minting its own) so the request can pass Laravel's
 * CSRF middleware with the correct header name `X-XSRF-TOKEN`. Fresh tokens from
 * a reseed response are picked up by `applyReseedCookies` (cookies.ts).
 */

import { decodeCookieValue } from "./cookies";

/**
 * Read the browser's `XSRF-TOKEN` cookie and return its URL-decoded value.
 * Returns null when the browser sent no token (its only chance to receive one
 * is a prior `GET /api/auth/csrf`).
 */
export function readXsrfHeaderFromCookie(req: {
  cookies: { get(name: string): { value?: string } | undefined };
}): string | null {
  const raw = req.cookies.get("XSRF-TOKEN")?.value;
  if (!raw) return null;
  return decodeCookieValue(raw);
}