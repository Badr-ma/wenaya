/**
 * Contact submission config — single source of truth for the contact API
 * target. Server-only: consumed by `/api/contact` (the BFF forwarder) and the
 * submitted-payload writer (`contact-submit.ts`), never by the browser.
 *
 * The backend contact endpoint is a Laravel/Yolo route on the contact API
 * (`POST {base}/api/v1/contact-us`) requiring `fullname`, `email`, `message`.
 * The base URL comes from the ONE shared environment variable
 * (`WENAYA_API_URL`, see `.env.example`) via `@/lib/api-base` — never
 * hardcoded; QA can point it at a stub endpoint (or a dead port) without
 * ever reaching the real backend.
 */
import { API_BASE_URL } from "../api-base";

/** Contact API base (shared backend base URL). */
export const CONTACT_API_BASE: string = API_BASE_URL;

/** Backend contact-us route path (relative to the base above). */
export const CONTACT_API_PATH = "/api/v1/contact-us";

/** Hard cap (raw bytes) on an accepted JSON body — guards oversized floods. */
export const CONTACT_BODY_MAX_CHARS = 50_000;

/** Upstream POST abort timeout in ms (env-overridable). */
export const CONTACT_TIMEOUT_MS: number = (() => {
  const raw = Number(process.env.CONTACT_API_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 10_000;
})();