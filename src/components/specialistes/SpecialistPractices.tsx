/**
 * Specialist → Practices — editorial text rows linking to the practices a
 * specialist genuinely offers (reverse of the practice→specialist mapping).
 * No cards: thin dividers between text rows with a trailing arrow. Renders
 * nothing when the specialist has no mapped practices. Locale-aware.
 */
import Link from "next/link";
import type { Pratique } from "@/lib/pratiques";
import { h } from "@/lib/href";
import { useLocale } from "@/contexts/LanguageContext";

interface SpecialistPracticesProps {
  practices: Pratique[];
}

export default function SpecialistPractices({
  practices,
}: SpecialistPracticesProps): React.JSX.Element | null {
  const { locale, t } = useLocale();

  if (!practices || practices.length === 0) return null;

  const overline = t("specialistes.detail.practicesOverline");
  const title = t("specialistes.detail.practicesTitle");

  return (
    <section aria-labelledby="specialist-practices-heading">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="inline-flex items-center gap-2.5">
          <span className="w-1 h-1 rounded-full bg-[#B88A5A]" />
          <span className="text-[#B88A5A]/70 text-[10px] font-semibold tracking-[0.24em] uppercase">
            {overline}
          </span>
        </div>
        <h2
          id="specialist-practices-heading"
          className="font-heading font-semibold text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#0B1220] mt-3 leading-tight"
        >
          {title}
        </h2>

        <div className="mt-8 border-t border-[#0B1220]/[0.08]">
          {practices.map((p) => (
            <Link
              key={p.slug}
              href={h(locale, `/pratiques/${p.slug}`)}
              className="group flex items-center justify-between gap-6 py-5 border-b border-[#0B1220]/[0.08]"
            >
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-[15px] sm:text-[17px] text-[#0B1220] group-hover:text-[#159AA9] transition-colors">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#2B2F36]/55">
                    {p.description}
                  </p>
                )}
              </div>
              <span
                aria-hidden="true"
                className="shrink-0 text-[#159AA9]/70 group-hover:text-[#159AA9] transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
