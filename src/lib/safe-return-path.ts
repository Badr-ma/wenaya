/**
 * Shared `returnTo` validation for the patient auth flow.
 *
 * The login and signup pages accept a `?returnTo=` query param so an interrupted
 * flow (e.g. the group-session booking panel sends anonymous visitors here
 * carrying their chosen slot) can be resumed on success. Validating that value
 * in ONE place keeps the param from ever becoming an open redirect and lets the
 * login ⇄ signup links hand the same destination to each other.
 *
 * Only a root-relative internal path is accepted. Rejected: absolute URLs,
 * protocol-relative (`//evil.tld`), backslash variants (`/\evil.tld` — some
 * browsers normalise it to `//`), CR/LF injection, and the auth routes
 * themselves (a login/signup bounce loop).
 */
import { h, type HrefLocale } from "@/lib/href";

export function safeReturnPath(value: string | undefined, locale: HrefLocale): string | null {
  if (typeof value !== "string" || value === "") return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (/[\r\n]/.test(value)) return null;
  const path = value.split(/[?#]/, 1)[0];
  const authPaths = [h(locale, "/login"), h(locale, "/signup")];
  if (authPaths.some((p) => path === p || path === `${p}/`)) return null;
  return value;
}

/**
 * Append a validated `returnTo` to an internal auth link (login ⇄ signup) so the
 * destination survives switching between the two routes. Returns the base href
 * unchanged when there is no valid destination.
 */
export function withReturnTo(href: string, returnTo: string | undefined, locale: HrefLocale): string {
  const back = safeReturnPath(returnTo, locale);
  return back ? `${href}?returnTo=${encodeURIComponent(back)}` : href;
}
