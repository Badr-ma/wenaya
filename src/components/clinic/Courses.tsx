/**
 * Clinic Courses Preview — group sessions & workshops for the Clinic/B2C page.
 * Editorial horizontal list, compact preview linking to /seance-de-groupe.
 * No cards.
 */
import Link from "next/link";
import { getAllGroupSessions, type GroupSessionLocale } from "@/lib/group-sessions";
import { groupSessionsHref, type HrefLocale } from "@/lib/href";
import { useTranslations } from "@/i18n";

export default async function ClinicCourses({ locale, lang }: { locale: HrefLocale; lang: string }): Promise<React.JSX.Element> {
  const { t } = useTranslations(lang);
  const sessions = getAllGroupSessions(locale as GroupSessionLocale);
  const preview = sessions.slice(0, 4);

  // EN public route differs from FR (/en/group-sessions vs /seance-de-groupe)
  const courseHref = groupSessionsHref(locale);

  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.courses.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              {t("clinic.courses.heading1")}
              <br />
              {t("clinic.courses.heading2")}
            </h2>
          </div>
          <Link
            href={courseHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
          >
            {t("clinic.courses.cta")}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <p className="text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-2xl -mt-6 mb-14">
          {t("clinic.courses.sub")}
        </p>

        <div className="space-y-5">
          {preview.map((s) => (
            <Link
              key={s.slug}
              href={courseHref}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#0B1220]/[0.06] pb-5 last:border-b-0"
            >
              <div className="flex-1 flex flex-col gap-y-1">
                <h3 className="heading-serif text-[#0B1220] text-lg lg:text-xl group-hover:text-[#159AA9] transition-colors">
                  {s.title}
                </h3>
                <span className="text-[#0B1220]/45 text-sm line-clamp-1">{s.typeLabel}</span>
              </div>
              <div className="flex items-center gap-4 text-[#9AA0AB] text-sm">
                <span className="max-w-[240px] truncate hidden sm:block">{s.location.title}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:text-[#159AA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
