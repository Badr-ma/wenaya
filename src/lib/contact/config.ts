/**
 * Contact submission config — single source of truth for the contact API
 * target. Server-only: consumed by `/api/contact` (the BFF forwarder) and the
 * submitted-payload writer (`contact-submit.ts`), never by the browser.
 *
 * The backend contact endpoint is a Laravel/Yolo route on the dev API
 * (`POST {base}/api/v1/contact-us`) requiring `fullname`, `email`, `message`.
 * `CONTACT_API_URL` exists so QA can point the forwarder at a stub endpoint
 * (or a dead port) without ever reaching the real backend.
 */
const DEV_CONTACT_API_URL = "https://dev-api.wenaya.com";

/** Trailing-slash-stripped, environment-overridable contact API base. */
export const CONTACT_API_BASE: string =
  process.env.CONTACT_API_URL?.replace(/\/+$/, "") || DEV_CONTACT_API_URL;

/** Backend contact-us route path (relative to the base above). */
export const CONTACT_API_PATH = "/api/v1/contact-us";

/** Hard cap (raw bytes) on an accepted JSON body — guards oversized floods. */
export const CONTACT_BODY_MAX_CHARS = 50_000;

/** Upstream POST abort timeout in ms (env-overridable). */
export const CONTACT_TIMEOUT_MS: number = (() => {
  const raw = Number(process.env.CONTACT_API_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 10_000;
})();