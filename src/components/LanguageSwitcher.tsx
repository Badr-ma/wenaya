/**
 * Language Switcher — toggles between French (FR) and English (EN).
 * Displays the non-active language label as a clickable button.
 * Navigates to the equivalent route in the other locale.
 */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LanguageContext";

function switchLocalePathname(pathname: string, from: "fr" | "en"): string {
  if (from === "en") {
    return pathname === "/en" ? "/" : pathname.replace(/^\/en/, "") || "/";
  }
  return `/en${pathname === "/" ? "" : pathname}`;
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleToggle = () => {
    const target = locale === "fr" ? "en" : "fr";
    const nextPath = switchLocalePathname(pathname, locale);
    setLocale(target);
    router.push(nextPath);
  };

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center gap-1.5 h-[34px] px-3 rounded-xl text-[12.5px] font-medium transition-all duration-200 border border-current/15 bg-current/[0.04] hover:bg-current/[0.1] hover:border-current/25 active:scale-95 text-inherit"
      aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
    >
      <span
        className={`transition-all duration-200 ${
          locale === "fr" ? "font-semibold opacity-100" : "opacity-40"
        }`}
      >
        FR
      </span>
      <span className="w-px h-3 bg-current/20" />
      <span
        className={`transition-all duration-200 ${
          locale === "en" ? "font-semibold opacity-100" : "opacity-40"
        }`}
      >
        EN
      </span>
    </button>
  );
}
