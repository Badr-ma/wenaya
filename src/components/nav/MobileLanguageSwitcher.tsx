/**
 * Mobile Language Switcher — compact locale dropdown for the mobile/tablet navbar.
 * Shows the active locale with a chevron and opens a small listbox (FR / EN).
 * Selecting a locale navigates to the equivalent route in that locale
 * (same routing as the desktop LanguageSwitcher).
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LanguageContext";
import { switchLocalePathname } from "@/lib/href";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

export default function MobileLanguageSwitcher({ dark }: { dark: boolean }) {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (code: LocaleCode) => {
    if (code !== locale) {
      const nextPath = switchLocalePathname(pathname, locale);
      setLocale(code);
      router.push(nextPath);
    }
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={locale === "fr" ? "Switch language" : "Changer de langue"}
        className="flex items-center gap-1 h-[34px] px-1.5 sm:px-2 rounded-xl text-[12px] sm:text-[12.5px] font-medium transition-all duration-200 border border-current/15 bg-current/[0.04] hover:bg-current/[0.1] hover:border-current/25 active:scale-95 text-inherit"
      >
        <span className="font-semibold">{locale === "fr" ? "FR" : "EN"}</span>
        <svg
          className={`h-[10px] w-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className={`absolute right-0 top-full mt-1.5 min-w-[68px] overflow-hidden rounded-xl border shadow-lg z-50 ${
            dark ? "bg-[#0B1220] border-white/[0.15]" : "bg-[#FAF8F4] border-[#0B1220]/[0.10]"
          }`}
        >
          {LOCALES.map(({ code, label }) => {
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(code)}
                className={`flex items-center justify-between w-full px-3 py-2 text-[12px] font-medium transition-colors ${
                  active ? "text-[#B88A5A]" : "hover:bg-current/[0.05]"
                }`}
              >
                {label}
                {active && (
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}