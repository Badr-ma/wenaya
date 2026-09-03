/**
 * Clinic Practices Preview — curated practice disciplines for the Clinic/B2C page.
 * Editorial horizontal rows (image + text), curated subset linking to /pratiques.
 * No cards.
 */
import Link from "next/link";
import Image from "next/image";
import { getAllPratiques } from "@/lib/pratiques";
import { h, type HrefLocale } from "@/lib/href";
import { useTranslations } from "@/i18n";

const PREVIEW_SLUGS = [
  "kinesitherapie",
  "osteopathie",
  "psychologie",
  "nutrition",
  "neuropsychologie",
  "sophrologie",
];

export default async function ClinicPractices({ locale, lang }: { locale: HrefLocale; lang: string }): Promise<React.JSX.Element> {
  const { t, tRaw } = useTranslations(lang);
  const all = getAllPratiques(locale);
  const preview = PREVIEW_SLUGS
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.practices.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              {t("clinic.practices.heading1")}
              <br />
              {t("clinic.practices.heading2")}
            </h2>
          </div>
          <Link
            href={h(locale, "/pratiques")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
          >
            {t("clinic.practices.cta")}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <p className="text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-2xl -mt-6 mb-14">
          {t("clinic.practices.sub")}
        </p>

        <div className="space-y-6 divide-y divide-[#0B1220]/[0.06]">
          {preview.map((p, i) => (
            <Link
              key={p.slug}
              href={h(locale, `/pratiques/${p.slug}`)}
              className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] md:grid-cols-[180px_1fr_auto] items-center gap-6 py-8"
            >
              <div className="relative h-32 md:h-24 w-full md:w-[180px] overflow-hidden rounded-lg bg-[#0B1220]/5">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 180px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="heading-serif text-[#0B1220] text-xl lg:text-2xl group-hover:text-[#159AA9] transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-[#0B1220]/55 text-sm lg:text-base leading-relaxed line-clamp-2">
                  {p.description}
                </p>
              </div>
              <div className="hidden md:flex items-center text-[#0B1220]/30">
                <span className="font-mono text-sm mr-2">{String(i + 1).padStart(2, "0")}</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1.5 group-hover:text-[#159AA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
