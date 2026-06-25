"use client";

import { useLocale } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

const contentKeys = ["intro", "collectedData", "purposes", "legalBasis", "sharing", "security", "retention", "rights", "cookies", "contactConf"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[#0B1220] font-heading font-semibold text-base mb-3">{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export default function ConfidentialitePage() {
  const { t, tRaw } = useLocale();
  const sections = tRaw<string[]>("confidentialite.sections") || [];
  const content = tRaw<Record<string, string>>("confidentialite.content") || {};
  const lastUpdate = t("confidentialite.lastUpdate");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-[#F2EFE9] pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">{t("confidentialite.badge")}</span>
          </div>

          <h1 className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220] mb-10">
            {t("confidentialite.heading")}
          </h1>

          <div className="space-y-8 text-[#2B2F36]/70 text-sm leading-relaxed">
            {sections.map((section, i) => (
              <Section key={i} title={section}>
                {content[contentKeys[i]]}
              </Section>
            ))}
            <p className="text-[#2B2F36]/40 text-xs pt-4 border-t border-[#0B1220]/[0.06]">
              {lastUpdate}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
