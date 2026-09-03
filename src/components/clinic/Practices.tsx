/**
 * Clinic Practices Preview — curated practice disciplines for the Clinic/B2C
 * page. Image-led editorial split rows (three representative disciplines:
 * Kinésithérapie, Ostéopathie, Psychologie) linking to /pratiques. No cards.
 *
 * Note: the psychology practice's source image is low-resolution (328px), so it
 * is substituted with the higher-resolution psychotherapy practice image for
 * large-panel display. All other disciplines use their own practice image.
 */
import Link from "next/link";
import Image from "next/image";
import { getAllPratiques } from "@/lib/pratiques";
import { h, type HrefLocale } from "@/lib/href";
import { useTranslations } from "@/i18n";

const PREVIEW_SLUGS = ["kinesitherapie", "osteopathie", "psychologie"];

/** High-resolution visual fallback for practices whose own image is too small. */
const HIGH_RES_IMAGE: Record<string, string> = {
  psychologie: "/pratiques/psychotherapie.jpg",
};

/** Collapse a practice description to a single concise sentence for the Clinic preview. */
function previewDescription(desc: string): string {
  if (!desc) return desc;
  const trimmed = desc.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^(.*?[.!?])(\s|$)/);
  let one = (match ? match[1] : trimmed).trim();
  if (one.length > 130) one = one.slice(0, 130).trim().replace(/[.,;:]+$/, "") + "…";
  return one;
}

export default async function ClinicPractices({ locale, lang }: { locale: HrefLocale; lang: string }): Promise<React.JSX.Element> {
  const { t } = useTranslations(lang);
  const all = getAllPratiques(locale);
  const preview = PREVIEW_SLUGS
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const [featured, ...rest] = preview;

  return (
    <section className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.practices.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
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

        {featured ? (
          <Link
            href={h(locale, `/pratiques/${featured.slug}`)}
            className="group grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12"
          >
            <div className="relative overflow-hidden rounded-t-[28px] bg-[#0B1220]/5">
              <Image
                src={HIGH_RES_IMAGE[featured.slug] ?? featured.image}
                alt={featured.title}
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#B88A5A] font-mono text-sm">
                01
              </span>
              <h3 className="heading-serif text-[#0B1220] text-3xl lg:text-4xl leading-tight group-hover:text-[#159AA9] transition-colors">
                {featured.title}
              </h3>
              <p className="text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-md">
                {previewDescription(featured.description)}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] mt-2">
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

        {/* Remaining practices — compact editorial rows */}
        <div className="mt-8 lg:mt-10 space-y-0 divide-y divide-[#0B1220]/[0.06]">
          {rest.map((p, i) => {
            const img = HIGH_RES_IMAGE[p.slug] ?? p.image;
            return (
              <Link
                key={p.slug}
                href={h(locale, `/pratiques/${p.slug}`)}
                className="group grid grid-cols-1 md:grid-cols-[120px_1fr] lg:grid-cols-[120px_48px_1fr_auto] items-center gap-4 md:gap-6 py-4"
              >
                <div className="relative h-24 md:h-20 w-full md:w-[120px] overflow-hidden rounded-lg bg-[#0B1220]/5">
                  <Image
                    src={img}
                    alt={p.title}
                    width={1200}
                    height={800}
                    sizes="120px"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="hidden lg:block text-[#B88A5A] font-mono text-sm">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-y-1 min-w-0">
                  <h3 className="heading-serif text-[#0B1220] text-xl lg:text-2xl leading-snug group-hover:text-[#159AA9] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[#0B1220]/50 text-sm leading-relaxed max-w-xl">
                    {previewDescription(p.description)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] md:justify-self-end">
                  <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
                    {t("clinic.practices.cta")}
                  </span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
