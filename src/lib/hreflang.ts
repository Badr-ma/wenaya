/**
 * Hreflang helper — generates the `alternates.languages` object for Next.js metadata.
 * Ensures every indexable page emits correct <link rel="alternate" hreflang="..."> tags.
 *
 * Usage in page metadata:
 *   alternates: { canonical: `${SITE_URL}/about`, languages: languageAlternates("/about") }
 *
 * Both FR and EN pages call this with the FR path — the helper generates both locale URLs.
 */
import { SITE_URL } from "./site-config";

/**
 * Returns the `alternates.languages` map for a page that exists in both FR and EN.
 * @param frPath — the FR-path of the page (e.g. "/" or "/about" or "/specialistes/ghita")
 */
export function languageAlternates(frPath: string): Record<string, string> {
  const enPath = `/en${frPath === "/" ? "" : frPath}`;
  return {
    "fr-MA": `${SITE_URL}${frPath}`,
    "en-MA": `${SITE_URL}${enPath}`,
    "x-default": `${SITE_URL}${frPath}`,
  };
}
