"use client";

import { useLocale } from "@/contexts/LanguageContext";

export default function Banner(): React.JSX.Element {
  const { t } = useLocale();
  return (
    <div className="bg-[#B88A5A] text-white text-center text-sm py-2.5 px-4 font-medium">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
        {t("banner.text")}
      </span>
    </div>
  );
}
