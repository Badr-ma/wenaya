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
  const { t } = useLocale();
  return (
    <div className="bg-[#B88A5A] text-white text-center text-sm py-2.5 px-4 font-medium">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
        {content?.bannerText ?? t("banner.text")}
      </span>
    </div>
  );
}
