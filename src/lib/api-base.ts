/**
 * Single backend API base URL for the whole app.
 *
 * ONE environment variable (`WENAYA_API_URL`, see `.env.example`) drives every
 * server-side API consumer — professionals, contact, blog, patient auth,
 * practices — so the backend target can be switched by editing `.env` only.
 * No plain-text URLs in code.
 *
 * SERVER-ONLY: never import from a "use client" file and never use the
 * `NEXT_PUBLIC_` prefix for this variable.
 *
 * WHY LAZY: client components sometimes import lib modules that transitively
 * reach this file (e.g. clinic explorers importing the practices dataset).
 * Resolving the env var at module-evaluation time would throw inside the
 * browser bundle (server env vars don't exist client-side). The URL is
 * therefore resolved lazily, on the first real fetch call — which only ever
 * happens server-side — and kept fail-fast there.
 */
import { requireApiUrl } from "./env-url";

let cachedBase: string | undefined;

/** Trailing-slash-stripped backend API base (e.g. `https://dev-api.wenaya.com`). */
export function getApiBaseUrl(): string {
  if (cachedBase === undefined) {
    cachedBase = requireApiUrl("WENAYA_API_URL");
  }
  return cachedBase;
}
