/**
 * Locale-aware commerce formatting (fr-MA / en-MA).
 * Consolidates the duplicated formatters that previously lived in CartActions,
 * ProductCard, and the FR/EN panier + checkout pages.
 */

/** Formats a number for a locale (fr-MA default, en-MA for "en"). */
export function formatNumber(n: number, locale: string = "fr"): string {
  return new Intl.NumberFormat(locale === "en" ? "en-MA" : "fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Formats a price, optionally appending a currency code. */
export function formatPrice(price: number, currency?: string, locale: string = "fr"): string {
  const formatted = formatNumber(price, locale);
  return currency ? `${formatted} ${currency}` : formatted;
}

/**
 * Normalizes legacy local-specialist price labels ("300 DH") to the
 * backend-established canonical currency ("300 MAD"). Presentation-only:
 * only the exact suffix "<number> DH" (case-insensitive) is rewritten to
 * "<number> MAD", preserving the numeric token verbatim. Every other value
 * (API-sourced "300 MAD", missing, zero, malformed/non-matching strings)
 * passes through unchanged.
 */
const LEGACY_DH_LABEL_RE = /^(\d+(?:[.,]\d+)?)\s+DH$/i;

export function normalizeLegacyPrice(value: string | null | undefined): string | null | undefined {
  if (typeof value !== "string") return value;
  return value.replace(LEGACY_DH_LABEL_RE, "$1 MAD");
}