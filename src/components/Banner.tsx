/**
 * Top Banner — small promotional bar at the very top of the homepage.
 * Displays a dismissible message with a CTA link.
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";
import type { BannerContent } from "@/lib/homepage-types";

interface BannerProps {
  content?: BannerContent;
}

export default function Banner({ content }: BannerProps): React.JSX.Element {
  const { t, locale } = useLocale();
  // Locale-aware override: a CMS value only ever applies to its own locale,
  // so a French page can never inherit an English-only bannerText. When no
  // override exists for this locale, fall back to i18n (per-locale by design).
  const bannerText =
    locale === "en" ? content?.bannerTextEn : content?.bannerTextFr;
  return (
    <div className="bg-[#B88A5A] text-white text-center text-sm py-2.5 px-4 font-medium">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
        {bannerText ?? t("banner.text")}
      </span>
    </div>
  );
}
