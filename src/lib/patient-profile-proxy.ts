/** Server-only proxy for the legacy patient medical-profile endpoints. */
import { getApiBaseUrl } from "@/lib/api-base";
import {
  applyReseedCookies,
  collectSetCookies,
} from "@/lib/patient-auth/cookies";
import { seedPatientCsrf } from "@/lib/patient-auth/transport";

export type ProfileProxyResult = {
  status: number;
  json: unknown;
  setCookies: string[];
};

type RequestOptions = {
  method: "GET" | "POST" | "PUT";
  path: string;
  cookieHeader?: string;
  xsrfToken?: string | null;
  body?: unknown;
};

async function requestUpstream(options: RequestOptions): Promise<ProfileProxyResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const headers = new Headers({ Accept: "application/json" });
    if (options.cookieHeader) headers.set("Cookie", options.cookieHeader);
    if (options.xsrfToken) headers.set("X-XSRF-TOKEN", options.xsrfToken);

    // Wenaya's createProfile/updateProfile endpoints accept multipart FormData.
    // Keep the browser-facing BFF JSON contract, then convert it here so the
    // backend receives the format used by the legacy patient-profile forms.
    const formData = new FormData();
    if (options.body && typeof options.body === "object" && !Array.isArray(options.body)) {
      for (const [key, value] of Object.entries(options.body as Record<string, unknown>)) {
        if (value === null || value === undefined) continue;
        if (key === "address" && typeof value === "object" && !Array.isArray(value)) {
          for (const [addressKey, addressValue] of Object.entries(value as Record<string, unknown>)) {
            if (typeof addressValue === "string") formData.append(`address[${addressKey}]`, addressValue);
          }
          continue;
        }
        if (typeof value === "string" || typeof value === "number") {
          formData.append(key, String(value));
        } else if (typeof value === "boolean") {
          formData.append(key, value ? "1" : "0");
        }
      }
    }

    const response = await fetch(`${getApiBaseUrl()}${options.path}`, {
      method: options.method,
      headers,
      ...(options.method === "GET" ? { cache: "no-store" as const } : {}),
      ...(options.method === "GET" ? {} : { body: formData }),
      signal: controller.signal,
    });
    const text = await response.text();
    let json: unknown = null;
    if (text) {
      try {
        json = JSON.parse(text) as unknown;
      } catch {
        json = null;
      }
    }
    return { status: response.status, json, setCookies: collectSetCookies(response.headers) };
  } catch {
    return { status: 502, json: null, setCookies: [] };
  } finally {
    clearTimeout(timer);
  }
}

/** Forward one profile request, reseeding Sanctum once if the API answers 419. */
export async function forwardPatientProfileRequest(
  options: RequestOptions,
): Promise<ProfileProxyResult> {
  const first = await requestUpstream(options);
  if (options.method === "GET" || first.status !== 419) return first;

  const reseed = await seedPatientCsrf(options.cookieHeader);
  const applied = applyReseedCookies(options.cookieHeader, reseed.setCookies);
  const retry = await requestUpstream({
    ...options,
    cookieHeader: applied.cookieHeader,
    xsrfToken: applied.xsrfToken ?? options.xsrfToken,
  });
  return { ...retry, setCookies: [...reseed.setCookies, ...retry.setCookies] };
}

/** Keep only the small profile fields required by the old create/edit pages. */
export function normalizeMedicalProfile(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const guardian = source.legal_guardian;
  const safeGuardian = guardian && typeof guardian === "object" && !Array.isArray(guardian)
    ? guardian as Record<string, unknown>
    : undefined;
  const keys = [
    "id", "first_name", "last_name", "email", "phone_number", "country_code",
    "emergencyPhone", "birth_date", "gender", "source_id", "other", "informations",
    "has_legal_guardian", "profile_type",
  ];
  const profile: Record<string, unknown> = {};
  for (const key of keys) {
    const field = source[key] ?? (key === "other" ? source.informations : undefined);
    if (typeof field === "string" || typeof field === "number" || typeof field === "boolean") {
      profile[key] = field;
    }
  }
  if (safeGuardian) {
    profile.legal_guardian = {
      first_name: typeof safeGuardian.first_name === "string" ? safeGuardian.first_name : "",
      last_name: typeof safeGuardian.last_name === "string" ? safeGuardian.last_name : "",
      phone_number: typeof safeGuardian.phone_number === "string" ? safeGuardian.phone_number : "",
      email: typeof safeGuardian.email === "string" ? safeGuardian.email : "",
    };
  }
  return profile;
}

/** Limit profile writes to fields used by the old forms and cap each text value. */
export function normalizeProfileWrite(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const src = value as Record<string, unknown>;
  const stringKeys = [
    "first_name", "last_name", "email", "phone_number", "country_code", "emergencyPhone",
    "birth_date", "gender", "source_id", "type", "informations", "password",
    "parent_first_name", "parent_last_name", "parent_phone_number", "parent_email",
    "companyName", "profile_type",
  ];
  const normalized: Record<string, unknown> = {};
  for (const key of stringKeys) {
    const field = src[key];
    if (typeof field === "string") {
      if (field.length > 1000) return null;
      normalized[key] = field;
    }
  }
  if (typeof src.has_legal_guardian === "boolean") {
    normalized.has_legal_guardian = src.has_legal_guardian;
  }
  if (src.legal_guardian_id === null) normalized.legal_guardian_id = null;
  if (src.address && typeof src.address === "object" && !Array.isArray(src.address)) {
    const address = src.address as Record<string, unknown>;
    normalized.address = Object.fromEntries(
      Object.entries(address).flatMap(([key, field]) =>
        /^[a-zA-Z_]{1,40}$/.test(key) && typeof field === "string" && field.length <= 200
          ? [[key, field]]
          : [],
      ),
    );
  }
  if (normalized.gender && !["male", "female"].includes(String(normalized.gender))) return null;
  if (normalized.profile_type && !["self", "child"].includes(String(normalized.profile_type))) return null;
  return normalized;
}

export function readUpstreamMessage(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const message = (value as Record<string, unknown>).message;
  return typeof message === "string" && message.length <= 240 ? message : undefined;
}
