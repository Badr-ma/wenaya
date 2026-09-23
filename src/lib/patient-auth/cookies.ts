/**
 * Cookie pass-through helpers for the patient Sanctum auth BFF.
 *
 * SERVER-ONLY module (imported only by `transport.ts` and the `src/app/api/auth/*`
 * route handlers). Session cookies are treated as opaque bytes from the browser's
 * perspective: they are forwarded verbatim to the Laravel backend and every
 * upstream `Set-Cookie` value is handed back to the browser unchanged.
 *
 * The BFF never decodes, decrypts, validates or re-issues the `we_session`
 * payload, and never introduces its own session cookie.
 */

/**
 * The browser's raw `Cookie` request header, verbatim. `undefined` when the
 * browser sent no cookies — used to decide whether to send the header upstream.
 */
export function browserCookieHeader(req: { headers: Headers }): string | undefined {
  return req.headers.get("cookie") ?? undefined;
}

/**
 * Every `Set-Cookie` value emitted by the upstream response, in order.
 * Works on the modern Fetch Headers API (Node ≥20 exposes `getSetCookie`).
 */
export function collectSetCookies(headers: Headers): string[] {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }
  const out: string[] = [];
  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") out.push(value);
  });
  return out;
}

const SET_COOKIE_NAME_RE = /^\s*([^=;\s]+)=([^;]*)/;

/**
 * Extract `{ name, value }` from a raw `Set-Cookie` string (ignores attributes).
 * Returns null when the fragment is not a cookie assignment.
 */
export function setCookieNameValue(setCookie: string): { name: string; value: string } | null {
  const m = SET_COOKIE_NAME_RE.exec(setCookie);
  if (!m) return null;
  return { name: m[1], value: m[2] };
}

/**
 * Rebuild a `Cookie` header after replacing the value of one cookie (used to
 * re-send the fresh `we_session` a CSRF reseed returned, so the retried state
 * changing request runs inside the new session). Always ordered first.
 * When there was no prior `Cookie` header, a header containing just the
 * replacement cookie is produced (needed for the first-ever registration or
 * login where the browser holds no `we_session` yet); `undefined` is only
 * returned when the caller passed neither a header nor a value to push.
 */
export function replaceCookieValue(
  cookieHeader: string | undefined,
  name: string,
  value: string | undefined,
): string | undefined {
  const kept: string[] = [];
  if (cookieHeader) {
    for (const part of cookieHeader.split(";")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const eq = trimmed.indexOf("=");
      const partName = eq === -1 ? trimmed : trimmed.slice(0, eq);
      if (partName === name) continue;
      kept.push(trimmed);
    }
  }
  if (value === undefined) {
    return kept.length > 0 ? kept.join("; ") : undefined;
  }
  kept.push(`${name}=${value}`);
  return kept.join("; ");
}

/**
 * Build the `{ cookieHeader, xsrfToken }` to use for the single CSRF retry:
 * - replace `we_session` with the fresh session cookie from the reseed response,
 * - if the reseed also returned a fresh `XSRF-TOKEN`, prefer it for the retry.
 */
export function applyReseedCookies(
  cookieHeader: string | undefined,
  setCookies: string[],
): { cookieHeader: string | undefined; xsrfToken: string | null } {
  let next = cookieHeader;
  let xsrfToken: string | null = null;
  for (const sc of setCookies) {
    const nv = setCookieNameValue(sc);
    if (!nv) continue;
    if (nv.name === "we_session") {
      next = replaceCookieValue(next, nv.name, nv.value);
    } else if (nv.name === "XSRF-TOKEN") {
      xsrfToken = decodeCookieValue(nv.value);
    }
  }
  return { cookieHeader: next, xsrfToken };
}

/**
 * URL-decode a cookie value, fail-safe: Laravel/axios encode the XSRF-TOKEN
 * cookie (e.g. `%2F...`); a value without percent-escapes is returned raw.
 */
export function decodeCookieValue(value: string): string {
  if (!value.includes("%")) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}