/**
 * Patient Sanctum auth BFF configuration.
 *
 * SERVER-ONLY module. Imported exclusively by `src/lib/patient-auth/transport.ts`
 * and the `src/app/api/auth/*` route handlers, which run server-side only and are
 * never shipped to the client bundles. The backend base URL must never leak into
 * the browser: do not import this module from any "use client" file.
 *
 * `PATIENT_API_URL` exists so QA/environments can point the BFF at a stub
 * endpoint (mirrors the `CONTACT_API_URL` convention in `src/lib/contact/config.ts`).
 */

const DEV_PATIENT_API_URL = "https://dev-api.wenaya.com";

export const PATIENT_API_BASE: string =
  process.env.PATIENT_API_URL?.replace(/\/+$/, "") || DEV_PATIENT_API_URL;

/** Laravel Sanctum cookie (re)seed endpoint. GET → 204 + sets we_session (and XSRF-TOKEN on later responses). */
export const PATIENT_CSRF_PATH = "/sanctum/csrf-cookie";

/** Authenticated-customer fetch endpoint (phase 3 read side). GET. */
export const PATIENT_ME_PATH = "/api/v1/customer";

/** Patient profile endpoint (read-only account V1). GET. See transport.fetchPatientProfile. */
export const PATIENT_PROFILE_PATH = "/api/v1/getCustomerInformations";

/** Patient session-creation endpoint. POST { email, password }. GUARDED — see login route. */
export const PATIENT_LOGIN_PATH = "/customer/login";

/** Patient session-destruction endpoint. POST. GUARDED — see logout route. */
export const PATIENT_LOGOUT_PATH = "/customer/logout";

/** Patient registration endpoint. POST. GUARDED — see register route. */
export const PATIENT_REGISTER_PATH = "/user/register";

/** Single upstream timeout for every patient-auth BFF call (ms). */
export const PATIENT_TIMEOUT_MS: number = (() => {
  const raw = process.env.PATIENT_AUTH_TIMEOUT_MS;
  if (!raw) return 10_000;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10_000;
})();

/**
 * Master switch for the state-changing patient routes (`/api/auth/login`,
 * `/api/auth/logout`). Set to "true" ONLY after an approved DEV patient account
 * and backend domain/CORS confirmation are in place. Defaults OFF: the routes
 * return a normalized 403 `not-enabled` response and the transport is never
 * triggered. Read side (`/api/auth/csrf`, `/api/auth/me`) is unaffected.
 */
export const PATIENT_AUTH_ENABLED: boolean =
  process.env.PATIENT_AUTH_ENABLED === "true";

/**
 * Master switch for the register route (`/api/auth/register`). Set to "true"
 * for QA/launch; defaults OFF so the route returns a normalized 403
 * `not-enabled` response and no account is ever created implicitly.
 */
export const PATIENT_REGISTER_ENABLED: boolean =
  process.env.PATIENT_REGISTER_ENABLED === "true";

/**
 * Proven registration field defaults (establish from the 2026-09-20 DEV
 * contract probe — see wenaya-patient-auth-register-report.md §B). The legacy
 * documented register body is `{ firstName, lastName, email, password,
 * countryCode, phone, timezone, isTuteurLegal, currency, role }`; `role` is
 * ALWAYS injected server-side as `"patient"` and never read from the browser.
 * When the client omits countryCode/timezone/currency the BFF applies these
 * probe-verified values rather than inventing them.
 */
export const PATIENT_DEFAULT_COUNTRY_CODE = "MA";
export const PATIENT_DEFAULT_TIMEZONE = "Africa/Casablanca";
export const PATIENT_DEFAULT_CURRENCY = "MAD";

/** Upper bound on an incoming login request body (bytes), mirrors contact BFF. */
export const PATIENT_BODY_MAX_CHARS = 8_000;