/**
 * Group Sessions Hero — H1 and intro for the /seance-de-groupe page.
 * Simple eyebrow + heading + one-line intro (Wenaya design system).
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";

export default function GroupSessionsHero(): React.JSX.Element {
  const { t } = useLocale();

  return (
    <section data-section-bg="light" className="relative bg-[#F2EFE9] px-6 pt-16 pb-8 sm:pt-24 sm:pb-12">
      <div className="relative z-[2] max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 mb-5">
          <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
          <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
            {t("seanceDeGroupe.hero.badge")}
          </span>
        </div>
        <h1 className="heading-serif text-[clamp(2.2rem,4.5vw,3.8rem)] text-[#0B1220] leading-[1.08] tracking-[-0.01em]">
          {t("seanceDeGroupe.hero.title")}
        </h1>
        <p className="text-[#2B2F36]/60 text-[15px] sm:text-base max-w-2xl mx-auto mt-5 leading-relaxed">
          {t("seanceDeGroupe.hero.intro")}
        </p>
      </div>
    </section>
  );
}
