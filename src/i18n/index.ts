/**
 * i18n core — exports translation messages and the useTranslations() hook.
 * The hook returns a `t()` function that resolves dot-notation keys (e.g., "nav.accueil")
 * against the current locale's translation object, with French fallback.
 */
import fr from "./fr";
import en from "./en";
import type { Translations } from "./fr";

/** All available translation bundles keyed by locale code */
export const messages: Record<string, Translations> = { fr, en };
export type { Translations };

/** Resolves a dot-separated path on a nested object (e.g., "nav.accueil" → obj.nav.accueil) */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Translation hook factory — creates t() and tRaw() functions for a given locale.
 * t() returns a string with French fallback; tRaw<T>() returns any typed value (arrays, objects).
 */
export function useTranslations(locale: string) {
  const msg = messages[locale] || messages.fr;

  function t(path: string): string {
    const value = getNestedValue(msg, path);
    if (typeof value === "string") return value;
    console.warn(`[i18n] Missing translation key: "${path}" for locale "${locale}"`);
    const fallback = getNestedValue(messages.fr, path);
    return typeof fallback === "string" ? fallback : path;
  }

  function tRaw<T>(path: string): T {
    return getNestedValue(msg, path) as T;
  }

  return { t, tRaw, locale };
}
