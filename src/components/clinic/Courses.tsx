/**
 * Clinic Courses Preview — group sessions & workshops for the Clinic/B2C page.
 * Editorial, image-led layout: one large featured session + horizontal
 * thumbnail rows for the remaining sessions. No card grid.
 */
import Link from "next/link";
import Image from "next/image";
import { getAllGroupSessions, type GroupSessionLocale } from "@/lib/group-sessions";
import { groupSessionsHref, type HrefLocale } from "@/lib/href";
import { useTranslations } from "@/i18n";

/** Collapse a session description to a single concise sentence for the Clinic preview. */
function previewDescription(desc: string): string {
  if (!desc) return desc;
  const trimmed = desc.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^(.*?[.!?])(\s|$)/);
  let one = (match ? match[1] : trimmed).trim();
  if (one.length > 130) one = one.slice(0, 130).trim().replace(/[.,;:]+$/, "") + "…";
  return one;
}

export default async function ClinicCourses({ locale, lang }: { locale: HrefLocale; lang: string }): Promise<React.JSX.Element> {
  const { t } = useTranslations(lang);
  const sessions = getAllGroupSessions(locale as GroupSessionLocale);
  const preview = sessions.slice(0, 4);
  const [featured, ...rest] = preview;
  const courseHref = groupSessionsHref(locale);

  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.courses.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
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

        {featured ? (
          <Link
            href={featured.path}
            className="group grid grid-cols-1 lg:grid-cols-2 items-stretch gap-8 lg:gap-12 mb-10 lg:mb-12"
          >
            <div className="relative overflow-hidden rounded-t-[28px] bg-[#0B1220]/5 min-h-[190px] sm:min-h-[240px]"
              style={{ backgroundImage: "none" }}
            >
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center lg:pl-2">
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase mb-3">
                {featured.typeLabel}
              </span>
              <h3 className="heading-serif text-[#0B1220] text-3xl lg:text-4xl leading-tight group-hover:text-[#159AA9] transition-colors">
                {featured.title}
              </h3>
              <p className="mt-4 text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-md">
                {previewDescription(featured.description)}
              </p>
              <p className="mt-4 text-[#0B1220]/45 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {featured.location.title}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] mt-6">
                <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
                  {t("clinic.practices.cta")}
                </span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </Link>
        ) : null}

        {/* Remaining sessions as horizontal thumbnail rows */}
        <div className="space-y-0 divide-y divide-[#0B1220]/[0.06]">
          {rest.map((s, i) => (
            <Link
              key={s.slug}
              href={s.path}
              className="group grid grid-cols-1 md:grid-cols-[140px_1fr_auto] items-center gap-5 md:gap-8 py-4"
            >
              <div className="relative h-20 md:h-16 w-full md:w-[140px] overflow-hidden rounded-lg bg-[#0B1220]/5">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 140px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.18em] uppercase">
                  {s.typeLabel}
                </span>
                <h3 className="heading-serif text-[#0B1220] text-xl lg:text-2xl leading-snug group-hover:text-[#159AA9] transition-colors">
                  {s.title}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[#0B1220]/45 text-sm">
                <span className="hidden sm:inline">{String(i + 2).padStart(2, "0")}</span>
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
