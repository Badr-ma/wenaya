/**
 * Shared server-side GET-only client for the public Wenaya (Laravel) API.
 *
 * Foundation for all future read adapters (specialists, cares, troubles,
 * articles, group sessions…). Only ONE conversation pattern lives here:
 *   GET {base}{path}?{query}  →  `Accept: application/json`  →  parse envelope
 *
 * Conventions (formalized in `wenaya-api-integration-master-plan.md` §G):
 *   - resolved ONLY on the server — imported by SSR/prerender code and the
 *     `/api/*` BFF proxies, never by "use client" components. Keep it that way:
 *     a client bundle must not contain the backend host.
 *   - base URL from env; production fallback ONLY because it matches the
 *     existing Practices behavior (default `https://api.wenaya.com`).
 *   - public read endpoints carry NO Authorization header and NO credentials;
 *     auth is out of scope for this module (the admin Bearer client lives in
 *     `./api-http.ts` and must stay isolated).
 *   - response shape is the Laravel envelope `{ error, message, data }`
 *     (see `./types.ts`); shape *validation* stays in the domain adapter that
 *     owns the payload (e.g. `practice-adapter.ts` / `practices-api.ts`).
 */
import type { LaravelEnvelope } from "./types";

/**
 * Backend base URL. The shared generic var `WENAYA_API_URL` is honored first
 * (future domains), then the existing Practices-only override
 * `PRACTICES_API_URL` (kept for backwards compatibility with the current
 * Practices fallback path), then the production API.
 */
export const WENAYA_API_BASE =
  process.env.WENAYA_API_URL || process.env.PRACTICES_API_URL || "https://api.wenaya.com";

/** Every public endpoint is versioned under /api/v1. */
export const WENAYA_API_VERSION_PREFIX = "/api/v1";

/** Default per-request timeout — guards against a hung upstream connection. */
export const WENAYA_API_DEFAULT_TIMEOUT_MS = 15_000;

export interface WenayaApiRequestOptions {
  /** Query params to serialize (null/undefined entries are skipped). */
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Per-request timeout in ms (default `WENAYA_API_DEFAULT_TIMEOUT_MS`). */
  timeoutMs?: number;
  /** Next.js Data Cache revalidation window in seconds, when set. */
  revalidate?: number;
  /** Extra headers merged over the default `Accept: application/json`. */
  headers?: HeadersInit;
  /** External abort signal (e.g. from a caller's AbortController). */
  signal?: AbortSignal;
}

/** Typed error for HTTP-level and transport-level failures. */
export class WenayaApiError extends Error {
  /** HTTP status when the failure was a non-2xx response; null otherwise. */
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "WenayaApiError";
    this.status = status;
  }
}

function toQueryString(query?: WenayaApiRequestOptions["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    params.set(key, String(value));
  }
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/** Merge the caller's headers over `Accept: application/json` (both HeadersInit forms). */
function buildFetchHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({ Accept: "application/json" });
  if (extra) {
    for (const [key, value] of new Headers(extra)) {
      headers.set(key, value);
    }
  }
  return headers;
}

/**
 * Perform a GET against the shared Wenaya API base.
 *
 * Throws `WenayaApiError` on: non-2xx response (status set), an upstream that
 * returns something the JSON parser cannot read, or timeout/abort (status
 * null). 2xx responses are returned as the raw parsed JSON — envelope-level
 * shape validation is left to the calling domain module.
 *
 * The `revalidate` option is forwarded as the Next.js fetch `next.revalidate`
 * hint (harmless / ignored outside a Next runtime, e.g. in the verification
 * harness). TypeScript accepts it via the local intersection so this file also
 * type-checks under a plain Node tsconfig without Next's global augmentation.
 */
type NextFetchRequestInit = RequestInit & { next?: { revalidate?: number }; };

export async function wenayaApiGet<T = unknown>(
  path: string,
  options: WenayaApiRequestOptions = {}
): Promise<T> {
  if (path === "" || path === "/" || !path.startsWith(WENAYA_API_VERSION_PREFIX)) {
    throw new WenayaApiError(
      `Wenaya API path must start with "${WENAYA_API_VERSION_PREFIX}": "${path}"`
    );
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? WENAYA_API_DEFAULT_TIMEOUT_MS;
  const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);
  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  const init: NextFetchRequestInit = {
    method: "GET",
    headers: buildFetchHeaders(options.headers),
    signal: controller.signal,
  };
  if (options.revalidate != null) {
    init.next = { revalidate: options.revalidate };
  }

  try {
    const response = await fetch(`${WENAYA_API_BASE}${path}${toQueryString(options.query)}`, init);

    if (!response.ok) {
      throw new WenayaApiError(`Wenaya API HTTP ${response.status} for ${path}`, response.status);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new WenayaApiError(`Wenaya API returned non-JSON for ${path}`);
    }
  } catch (error) {
    if (error instanceof WenayaApiError) throw error;
    // Timeout / external abort surface as an AbortError in Node & browsers.
    if (error instanceof Error && error.name === "AbortError") {
      throw new WenayaApiError(`Wenaya API request aborted for ${path}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutTimer);
  }
}

export type { LaravelEnvelope };