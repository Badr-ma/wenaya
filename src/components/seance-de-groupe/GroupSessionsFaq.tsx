/**
 * Group Sessions FAQ — "Questions fréquentes".
 * Visible FAQ content (accordion) grounded in the supported group sessions.
 * Visibility of this section is guaranteed by the page; it pairs with the
 * FAQPage JSON-LD emitted by the route page.
 */
"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export default function GroupSessionsFaq(): React.JSX.Element {
  const { t } = useLocale();
  const [open, setOpen] = useState<string | null>(faqKeys[0]);

  return (
    <section className="relative bg-white px-6 py-14 sm:py-16">
      <div className="relative z-[2] max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="heading-serif text-[clamp(1.7rem,3.2vw,2.6rem)] text-[#0B1220] leading-tight">
            {t("seanceDeGroupe.faq.title")}
          </h2>
        </div>

        <div className="space-y-3">
          {faqKeys.map((key) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className="rounded-2xl transition-colors"
                style={{ background: "#F2EFE9", border: "1px solid rgba(11,18,32,0.06)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : key)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading font-semibold text-[#0B1220] text-[14px] sm:text-[15px] leading-snug">
                    {t(`seanceDeGroupe.faq.items.${key}.q`)}
                  </span>
                  <svg
                    className={`w-4 h-4 shrink-0 text-[#B88A5A] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-[#2B2F36]/65 text-[13px] leading-relaxed">
                    {t(`seanceDeGroupe.faq.items.${key}.a`)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
