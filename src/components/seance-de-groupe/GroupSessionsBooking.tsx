/**
 * Group Sessions Booking — "Comment réserver ?".
 * Uses the existing Wenaya booking/contact path (/contact) and a subtle
 * contextual cross-link to /pratiques.
 */
"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";

const steps = [
  { key: "contact" },
  { key: "appoint" },
  { key: "guidance" },
] as const;

export default function GroupSessionsBooking(): React.JSX.Element {
  const { t, locale } = useLocale();

  return (
    <section className="relative bg-[#159AA9] px-6 py-14 sm:py-16">
      <div className="relative z-[2] max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="heading-serif text-[clamp(1.7rem,3.2vw,2.6rem)] text-white leading-tight">
            {t("seanceDeGroupe.booking.title")}
          </h2>
          <p className="text-white/80 text-sm sm:text-[15px] mt-3 max-w-xl mx-auto leading-relaxed">
            {t("seanceDeGroupe.booking.sub")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.key}
              className="rounded-2xl p-6 flex flex-col"
              style={{ background: "rgba(11,18,32,0.18)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <span className="font-heading font-bold text-white/60 text-xs tracking-[0.15em]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading font-semibold text-white text-[15px] leading-snug mt-3">
                {t(`seanceDeGroupe.booking.items.${s.key}.title`)}
              </h3>
              <p className="text-white/75 text-[12.5px] leading-relaxed mt-2">
                {t(`seanceDeGroupe.booking.items.${s.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 mt-10">
          <Link
            href={h(locale, "/contact")}
            className="inline-flex items-center gap-3 rounded-xl bg-[#0B1220] text-white text-sm font-semibold px-6 py-3 transition-all duration-300 hover:bg-[#0B1220]/85"
          >
            {t("seanceDeGroupe.booking.cta")}
          </Link>
          <Link
            href={h(locale, "/pratiques")}
            className="text-white/80 text-[13px] underline underline-offset-4 hover:text-white transition-colors"
          >
            {t("seanceDeGroupe.crossToPratiques")}
          </Link>
        </div>
      </div>
    </section>
  );
}
