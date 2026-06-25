"use client";

import { useLocale } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      onClick={toggleLocale}
      className="relative flex items-center gap-1.5 h-[34px] px-3 rounded-xl text-[12.5px] font-medium transition-all duration-200 hover:bg-white/[0.06] active:scale-95"
      style={{ color: "rgba(255,255,255,0.55)" }}
      aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
    >
      <span
        className={`transition-all duration-200 ${
          locale === "fr" ? "text-white font-semibold" : "opacity-50"
        }`}
      >
        FR
      </span>
      <span className="w-px h-3 bg-white/[0.15]" />
      <span
        className={`transition-all duration-200 ${
          locale === "en" ? "text-white font-semibold" : "opacity-50"
        }`}
      >
        EN
      </span>
    </button>
  );
}
