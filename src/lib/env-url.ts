/**
 * Required server-side API base URL resolver.
 *
 * Every backend API base URL MUST come from the environment (`.env` in local
 * development, the deployment platform's env settings in production) — no
 * plain-text URLs in code. Missing variables fail fast with an actionable
 * message instead of silently falling back to a hardcoded host.
 *
 * SERVER-ONLY by convention: the URL must never leak into the browser
 * bundle. Never read these from "use client" files, and never use the
 * `NEXT_PUBLIC_` prefix for them.
 */

/** Strips trailing slashes from an API base URL. */
function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Resolves a required API base URL from the environment.
 * Throws at module load when the variable is absent (see `.env.example`).
 */
export function requireApiUrl(name: string, value?: string): string {
  const raw = value ?? process.env[name];
  if (!raw || !raw.trim()) {
    throw new Error(
      `Missing required environment variable: ${name} — add it to .env (see .env.example). ` +
        `API URLs are no longer hardcoded in source.`
    );
  }
  return stripTrailingSlashes(raw.trim());
}
