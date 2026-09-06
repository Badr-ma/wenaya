/**
 * Pratique Specialists — editorial specialist rows (not cards).
 * Horizontal rows with portrait, name, role, real specialty tags, and an arrow.
 * Thin separators between rows. Links to the locale-aware specialist detail page,
 * which owns the BookingPanel flow.
 */
import Image from "next/image";
import Link from "next/link";
import type { Specialist } from "@/lib/specialistes";
import { h, type HrefLocale } from "@/lib/href";

interface PratiqueSpecialistsProps {
  specialists: Specialist[];
  overline: string;
  title: string;
  locale: HrefLocale;
}

export default function PratiqueSpecialists({
  specialists,
  overline,
  title,
  locale,
}: PratiqueSpecialistsProps): React.JSX.Element | null {
  if (!specialists || specialists.length === 0) return null;

  return (
    <section aria-labelledby="pratique-specialists-heading">
      <div className="max-w-7xl">
        <div className="inline-flex items-center gap-2.5">
          <span className="w-1 h-1 rounded-full bg-[#B88A5A]" />
          <span className="text-[#B88A5A]/70 text-[10px] font-semibold tracking-[0.24em] uppercase">{overline}</span>
        </div>
        <h2
          id="pratique-specialists-heading"
          className="heading-serif text-[clamp(1.7rem,3.5vw,2.6rem)] text-[#0B1220] mt-3 leading-tight"
        >
          {title}
        </h2>

        <div className="mt-12 sm:mt-16 border-t border-[#0B1220]/[0.08]">
          {specialists.map((s) => {
            const role = locale === "en" ? s.roleEn ?? s.role : s.role;
            return (
              <Link
                key={s.slug}
                href={h(locale, `/professional/${s.slug}`)}
                className="group grid grid-cols-[76px_1fr] sm:grid-cols-[92px_1fr_auto] items-center gap-6 sm:gap-10 py-7 sm:py-9 border-b border-[#0B1220]/[0.08]"
              >
                <div className="relative w-[76px] h-[76px] sm:w-[92px] sm:h-[92px] rounded-full overflow-hidden bg-[#0B1220]/5 shrink-0">
                  <Image
                    src={s.image}
                    alt={`${s.name}, ${role}`}
                    fill
                    sizes="92px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-heading font-semibold text-[17px] sm:text-[19px] text-[#0B1220] group-hover:text-[#159AA9] transition-colors">
                      {s.name}
                    </h3>
                    <span className="text-[13px] text-[#B88A5A]">{role}</span>
                  </div>
                  {s.specialtyTags.length > 0 && (
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#2B2F36]/55 truncate sm:text-clip sm:whitespace-normal">
                      {s.specialtyTags.slice(0, 3).join(" · ")}
                    </p>
                  )}
                </div>

                <span className="hidden sm:inline-flex col-start-2 sm:col-start-3 justify-self-start sm:justify-self-end items-center gap-2 text-[13px] font-medium text-[#159AA9]/70 group-hover:text-[#159AA9] transition-colors">
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}