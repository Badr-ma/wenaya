/**
 * Group Sessions Benefits — "Pourquoi participer ?".
 * Short benefit cards grounded in the supported Wenaya group activities.
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";

const items = [
  { key: "cadre", accent: "#159AA9" },
  { key: "groupe", accent: "#B88A5A" },
  { key: "prevention", accent: "#159AA9" },
  { key: "access", accent: "#B88A5A" },
] as const;

export default function GroupSessionsBenefits(): React.JSX.Element {
  const { t } = useLocale();

  return (
    <section className="relative bg-white px-6 py-14 sm:py-16">
      <div className="relative z-[2] max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="heading-serif text-[clamp(1.7rem,3.2vw,2.6rem)] text-[#0B1220] leading-tight">
            {t("seanceDeGroupe.benefits.title")}
          </h2>
          <p className="text-[#2B2F36]/55 text-sm sm:text-[15px] mt-3 max-w-xl mx-auto leading-relaxed">
            {t("seanceDeGroupe.benefits.sub")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.key}
              className="rounded-2xl p-6 flex items-start gap-4 transition-all duration-300"
              style={{ background: "#F2EFE9", border: "1px solid rgba(11,18,32,0.06)" }}
            >
              <div
                className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center"
                style={{ background: `${it.accent}14`, border: `1px solid ${it.accent}22` }}
              >
                <svg className="w-5 h-5" style={{ color: it.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-[#0B1220] text-[15px] leading-snug">
                  {t(`seanceDeGroupe.benefits.items.${it.key}.title`)}
                </h3>
                <p className="text-[#2B2F36]/60 text-[13px] leading-relaxed mt-1.5">
                  {t(`seanceDeGroupe.benefits.items.${it.key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
