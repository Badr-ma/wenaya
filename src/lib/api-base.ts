/**
 * Single backend API base URL for the whole app.
 *
 * ONE environment variable (`WENAYA_API_URL`, see `.env.example`) drives every
 * server-side API consumer — professionals, contact, blog, patient auth,
 * practices — so the backend target can be switched by editing `.env` only.
 * No plain-text URLs in code; fails fast at startup when missing.
 *
 * SERVER-ONLY: never import from a "use client" file and never use the
 * `NEXT_PUBLIC_` prefix for this variable.
 */
import { requireApiUrl } from "./env-url";

/** Trailing-slash-stripped backend API base (e.g. `https://dev-api.wenaya.com`). */
export const API_BASE_URL: string = requireApiUrl("WENAYA_API_URL");
