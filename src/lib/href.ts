/**
 * Locale-aware internal link helper.
 * English pages live under `/en/...`; French pages stay at the root.
 * `h("en", "/about")` → "/en/about"; `h("fr", "/about")` → "/about".
 * External/anchor paths are returned unchanged.
 */
export type HrefLocale = "fr" | "en";

export function h(locale: HrefLocale, path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  if (locale !== "en") return path;
  if (path === "/") return "/en";
  if (path === "/en" || path.startsWith("/en/")) return path;
  return `/en${path}`;
}

/**
 * Locale-aware href for the group-sessions page.
 * The EN listing matches live wenaya.com and uses the same segment as French
 * (/en/seance-de-groupe), so the EN path simply adds the /en prefix.
 */
export function groupSessionsHref(locale: HrefLocale): string {
  return locale === "en" ? "/en/seance-de-groupe" : "/seance-de-groupe";
}
