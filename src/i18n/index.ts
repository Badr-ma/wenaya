import fr from "./fr";
import en from "./en";
import type { Translations } from "./fr";

export const messages: Record<string, Translations> = { fr, en };
export type { Translations };

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

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
