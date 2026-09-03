/**
 * Group Sessions Formats — "Formats & organisation".
 * Explains the real known formats (weekly classes, one-off workshops, small groups,
 * in-person in Casablanca) grounded in Wenaya's supported activities.
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";

const items = [
  { key: "semana", n: "01" },
  { key: "ateliers", n: "02" },
  { key: "groupes", n: "03" },
  { key: "enPresentiel", n: "04" },
] as const;

export default function GroupSessionsFormats(): React.JSX.Element {
  const { t } = useLocale();

  return (
    <section className="relative bg-[#F2EFE9] px-6 py-14 sm:py-16">
      <div className="relative z-[2] max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="heading-serif text-[clamp(1.7rem,3.2vw,2.6rem)] text-[#0B1220] leading-tight">
            {t("seanceDeGroupe.formats.title")}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.key}
              className="rounded-2xl p-6 flex flex-col"
              style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="font-heading font-bold text-[#B88A5A]/70 text-xs tracking-[0.15em]">{it.n}</span>
              <h3 className="font-heading font-semibold text-white text-[15px] leading-snug mt-3">
                {t(`seanceDeGroupe.formats.items.${it.key}.title`)}
              </h3>
              <p className="text-white/60 text-[12.5px] leading-relaxed mt-2">
                {t(`seanceDeGroupe.formats.items.${it.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
