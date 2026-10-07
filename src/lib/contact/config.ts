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
 *
 * This module holds the route constants for ALL THREE upstream contracts the
 * BFF can write to — the default `contact-us`, the corporate
 * `sendBusinessEmail` and the recruitment `sendProEmail`. They differ in body
 * shape and success semantics, so each keeps its own documented constant here
 * while sharing the one base URL above.
 */
import { getApiBaseUrl } from "../api-base";

/** Contact API base — lazily resolved (safe for client-bundle imports). */
export function getContactApiBase(): string {
  return getApiBaseUrl();
}

/** Backend contact-us route path (relative to the base above). */
export const CONTACT_API_PATH = "/api/v1/contact-us";

/**
 * Corporate business-email route (relative to the base above) — the writer
 * target for the Corporate quote form. Proven from the deployed legacy
 * Corporate page (`pages/corporate-*.js` → module `34960._b` → wrapper `tX`):
 * `POST /api/v1/sendBusinessEmail`.
 *
 * This is a DIFFERENT contract from `CONTACT_API_PATH`: dedicated
 * `businessName` / `companySize` / `interestedLevel` fields instead of a
 * `fullname` + message-stuffed `contact-us` body. The legacy app reached it
 * through the shared axios instance, so it inherits that client's
 * `withCredentials` + Sanctum CSRF interceptor — mirrored in
 * `contact-submit.ts#forwardCorporate`.
 */
export const CORPORATE_BUSINESS_EMAIL_API_PATH = "/api/v1/sendBusinessEmail";

/**
 * Browser-facing `source` marker that selects the corporate writer branch.
 * Lives ONLY on the same-origin BFF hop (`POST /api/contact`); it is never the
 * value sent upstream (that is {@link CORPORATE_BUSINESS_EMAIL_SOURCE}).
 */
export const CORPORATE_CONTACT_SOURCE = "corporate-quote";

/** `source` value the confirmed sendBusinessEmail contract requires. */
export const CORPORATE_BUSINESS_EMAIL_SOURCE = "for-entreprise-contact-form";

/**
 * Practitioner recruitment ("Join the team") route (relative to the base above)
 * — the writer target for the Clinic recruitment modal. Documented in
 * `API_DOCUMENTATION (1).md` (B.16 contact) as `POST {v}/sendProEmail`, and the
 * body recovered from the deployed legacy application
 * (`pages/_app-*.js` → shared `sendProEmail` wrapper → the single call site on
 * the live `/about-us` "join_our_team" form).
 *
 * This is a DIFFERENT contract again, and deliberately smaller than the other
 * two: `firstName`, `lastName`, `email`, `phone`, `specialty` (required) and
 * `message` (optional). Note there is NO upstream `source`/`type`/`cv`/`role`
 * field on this endpoint — unlike sendBusinessEmail, the contract carries no
 * envelope, so the browser `source` marker below is consumed purely for BFF
 * routing and must be stripped before forwarding.
 */
export const PRO_EMAIL_API_PATH = "/api/v1/sendProEmail";

/**
 * Browser-facing `source` marker that selects the recruitment writer branch.
 * Emitted by `RecruitmentModal` on the same-origin BFF hop
 * (`POST /api/contact`) only; it is never forwarded upstream.
 *
 * Deliberately distinct from the contact page's `"recrutement"` marker
 * (`ContactForm`, `?subject=recrutement`), which is a free-text message flow
 * that keeps using the DEFAULT `contact-us` contract. Matching only this exact
 * value leaves that flow untouched.
 */
export const RECRUITMENT_CONTACT_SOURCE = "practitioner-recruitment";

/** Hard cap (raw bytes) on an accepted JSON body — guards oversized floods. */
export const CONTACT_BODY_MAX_CHARS = 50_000;

/** Upstream POST abort timeout in ms (env-overridable). */
export const CONTACT_TIMEOUT_MS: number = (() => {
  const raw = Number(process.env.CONTACT_API_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 10_000;
})();