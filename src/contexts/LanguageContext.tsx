/**
 * Language Context — provides locale state, t() translation function, and language switching
 * to all components in the app. Detects language from localStorage or browser settings on mount.
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useTranslations } from "@/i18n";

/** Supported locales — French (default) and English */
type Locale = "fr" | "en";

/** Shape of the language context value exposed to consuming components */
interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string) => string;
  tRaw: <T>(path: string) => T;
}

/** Language context — initialized as null, must be used within LanguageProvider */
const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Provider component — manages locale state and provides t() to the component tree.
 * `initialLocale` is used by per-language root layouts (e.g. the English layout)
 * to server-render content in that locale; when provided, client-side language
 * detection is skipped so the SSR'd language is preserved.
 */
export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? "fr");

  /** On mount: keep the SSR'd locale, or detect language from localStorage → browser language → default to French */
  useEffect(() => {
    if (initialLocale) {
      document.documentElement.lang = initialLocale;
      return;
    }
    let detected: Locale = "fr";
    try {
      const stored = localStorage.getItem("wenaya-locale");
      if (stored === "fr" || stored === "en") detected = stored;
      else {
        const browserLang = navigator.language?.slice(0, 2);
        detected = browserLang === "en" ? "en" : "fr";
      }
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(detected);
    document.documentElement.lang = detected;
  }, [initialLocale]);

  /** Sets locale, persists to localStorage, and updates the <html lang> attribute */
  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("wenaya-locale", l); } catch {}
    document.documentElement.lang = l === "fr" ? "fr" : "en";
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fr" ? "en" : "fr");
  }, [locale, setLocale]);

  const { t, tRaw } = useTranslations(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t, tRaw }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Custom hook — returns the language context; throws if used outside LanguageProvider */
export function useLocale(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLocale must be used within a LanguageProvider");
  return ctx;
}
