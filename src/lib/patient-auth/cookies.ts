/**
 * Cookie pass-through helpers for the patient Sanctum auth BFF.
 *
 * SERVER-ONLY module (imported only by `transport.ts` and the `src/app/api/*`
 * route handlers). Session cookies are treated as opaque bytes from the browser's
 * perspective: they are forwarded verbatim to the Laravel backend, and every
 * upstream `Set-Cookie` value is relayed back to the browser with its identity
 * and value untouched — only the attributes that would make the browser REJECT
 * the cookie on this app's origin are repaired (see `relayableSetCookie`).
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
 * Whether the app itself is served over https, which decides if a `Secure`
 * attribute may be relayed. Read from the proxy header first (production sits
 * behind TLS termination), falling back to the resolved request protocol.
 */
export function isSecureRequest(req: { headers: Headers; nextUrl?: { protocol?: string } }): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0]?.trim() === "https";
  return req.nextUrl?.protocol === "https:";
}

/**
 * Repair an upstream `Set-Cookie` so the BROWSER can actually store it here.
 *
 * Laravel mints its Sanctum cookies for the BACKEND's own host — DEV answers
 * `we_session=…; path=/; domain=.wenaya.com; secure; httponly`. Relayed
 * verbatim to this app's origin the browser SILENTLY DROPS them: a cookie whose
 * `Domain` does not cover the requesting host is discarded without an error,
 * and `Secure` is refused on a plain-http host. The observable symptom was a
 * `200` login followed by an immediate `401` on `/api/auth/me` — the session
 * never existed for the browser at all, while server-to-server probes that
 * forwarded the cookie by hand kept passing and masked it.
 *
 * Two repairs, both required for a same-origin BFF:
 *   - `Domain` is dropped, so the cookie is HOST-ONLY for this app's origin.
 *     This is what the browser needs, and it also stops the session from being
 *     sent to sibling subdomains. In production `www.wenaya.com` is covered by
 *     `.wenaya.com` anyway, so nothing that used to work breaks.
 *   - `Secure` is dropped only when the app is not served over https, and kept
 *     as-is otherwise so production keeps the hardened cookie.
 *
 * Cookie name, value and every other attribute (`Path`, `Expires`, `Max-Age`,
 * `HttpOnly`, `SameSite`) are relayed byte-for-byte: the BFF neither forges nor
 * interprets the session payload.
 */
export function relayableSetCookie(setCookie: string, secureRequest: boolean): string {
  const parts = setCookie
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return setCookie;
  const [pair, ...attributes] = parts;
  const kept: string[] = [];
  for (const attribute of attributes) {
    const eq = attribute.indexOf("=");
    const name = (eq === -1 ? attribute : attribute.slice(0, eq)).toLowerCase();
    if (name === "domain") continue;
    if (name === "secure" && !secureRequest) continue;
    kept.push(attribute);
  }
  return [pair, ...kept].join("; ");
}

/** {@link relayableSetCookie} over every upstream `Set-Cookie`, order preserved. */
export function relayableSetCookies(setCookies: string[], secureRequest: boolean): string[] {
  return setCookies.map((setCookie) => relayableSetCookie(setCookie, secureRequest));
}

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