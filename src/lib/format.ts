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