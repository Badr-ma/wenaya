/**
 * Patient registration payload model — pure module (no `next/server` import).
 *
 * Builds the Laravel `POST /user/register` body from an unknown client input.
 * Rules kept deliberately minimal — NO invented password/phone policy beyond
 * presence + a defensive length bound. The backend remains authoritative: any
 * stricter rule it enforces surfaces as an upstream 400/422/409 which the BFF
 * maps to `validation-error` and the UI renders per-field.
 *
 * Role is ALWAYS injected here as `"patient"` and never read from the browser.
 * countryCode/timezone/currency fall back to the probe-verified defaults in
 * config.ts (§B of wenaya-patient-auth-register-report.md).
 */

import {
  PATIENT_DEFAULT_COUNTRY_CODE,
  PATIENT_DEFAULT_CURRENCY,
  PATIENT_DEFAULT_TIMEZONE,
} from "./config";

export interface RegisterInput {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  password?: unknown;
  phone?: unknown;
  countryCode?: unknown;
  timezone?: unknown;
  currency?: unknown;
  isTuteurLegal?: unknown;
}

export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: string;
  phone: string;
  timezone: string;
  isTuteurLegal: boolean;
  currency: string;
  role: "patient";
}

export type RegisterBuildResult =
  | { ok: true; body: RegisterBody }
  | { ok: false; fields: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trimmed string, or "" for any non-string input (so validation stays total). */
function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Coerce boolean | "0" | "1" | 0 | 1 → boolean; anything else → undefined. */
function bool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (v === 0 || v === "0") return false;
  if (v === 1 || v === "1") return true;
  return undefined;
}

/**
 * Validate an unknown client payload and build the upstream register body.
 * Structural shape errors (not an object) are the route's `invalid-payload`;
 * absent/invalid fields are returned as a per-field map (BFF-own messages,
 * never backend output).
 */
export function buildRegisterBody(input: unknown): RegisterBuildResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, fields: { payload: "Invalid payload." } };
  }
  const src = input as RegisterInput;

  const fields: Record<string, string> = {};

  const firstName = str(src.firstName);
  if (!firstName) fields.firstName = "Your first name is required.";
  else if (firstName.length > 100) fields.firstName = "First name is too long.";

  const lastName = str(src.lastName);
  if (!lastName) fields.lastName = "Your last name is required.";
  else if (lastName.length > 100) fields.lastName = "Last name is too long.";

  const email = str(src.email);
  if (!email) fields.email = "Your email address is required.";
  else if (email.length > 254 || !EMAIL_RE.test(email)) {
    fields.email = "A valid email address is required.";
  }

  const password = str(src.password);
  if (!password) fields.password = "A password is required.";
  else if (password.length > 1024) fields.password = "Password is too long.";

  const phone = str(src.phone);
  if (!phone) fields.phone = "A phone number is required.";
  else if (phone.length > 40) fields.phone = "Phone number is too long.";

  const countryCode = str(src.countryCode) || PATIENT_DEFAULT_COUNTRY_CODE;
  if (countryCode.length > 10) fields.countryCode = "Country code is invalid.";

  const timezone = str(src.timezone) || PATIENT_DEFAULT_TIMEZONE;
  if (timezone.length > 64) fields.timezone = "Timezone is invalid.";

  const currency = str(src.currency) || PATIENT_DEFAULT_CURRENCY;
  if (currency.length > 8) fields.currency = "Currency is invalid.";

  const isTuteurLegal = bool(src.isTuteurLegal) ?? false;

  if (Object.keys(fields).length > 0) return { ok: false, fields };

  return {
    ok: true,
    body: {
      firstName,
      lastName,
      email,
      password,
      countryCode,
      phone,
      timezone,
      isTuteurLegal,
      currency,
      role: "patient",
    },
  };
}