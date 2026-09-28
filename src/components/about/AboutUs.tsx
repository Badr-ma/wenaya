/**
 * About Us page content — server component.
 *
 * A concise, editorial "Qui sommes nous" presentation page. Uses the established
 * Wenaya editorial header language (bronze small-caps eyebrow → heading-serif H1
 * → supporting paragraph) then presents the company mission as a calm reading
 * column beside a photograph, closes with a facts strip and CTAs toward the
 * Clinic page, the practices catalogue and the booking request flow.
 *
 * Content is always visible in the HTML (no-JS / SSR safe) and there are no
 * booking controls on this page — the CTAs point at existing first-class routes.
 */
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "@/i18n";
import { clinicHref, h, type HrefLocale } from "@/lib/href";

export default function AboutUs({ lang }: { lang: "fr" | "en" }) {
  const { t, tRaw } = getTranslations(lang);
  const paragraphs = tRaw<string[]>("aboutUs.paragraphs");
  const facts = tRaw<{ value: string; label: string }[]>("aboutUs.facts");
  const loc: HrefLocale = lang;

  return (
    <section data-section-bg="light" className="bg-[#FAF8F4]">
      <main className="max-w-7xl mx-auto px-4 sm:px-10">
        {/* Editorial header */}
        <header className="max-w-3xl pt-16 sm:pt-24 lg:pt-28 pb-10 sm:pb-14">
          <p className="text-[#B88A5A] font-semibold uppercase tracking-[0.22em] text-[11px] sm:text-xs flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#B88A5A]" aria-hidden="true" />
            {t("aboutUs.eyebrow")}
          </p>
          <h1 className="heading-serif text-[#0B1220] mt-5 text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.08] tracking-[-0.01em]">
            {t("aboutUs.heading")}
          </h1>
          <p className="text-[#2B2F36]/55 text-base sm:text-lg leading-[1.65] mt-6 max-w-[680px]">
            {t("aboutUs.lead")}
          </p>
        </header>

        {/* Mission reading column + photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 sm:pb-20">
          <div className="lg:col-span-7 space-y-6">
            {paragraphs.map((p: string, i: number) => (
              <p
                key={i}
                className="text-[#2B2F36]/75 text-[clamp(1.05rem,1.3vw,1.2rem)] leading-[1.75]"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[24px] bg-[#0B1220]">
              <Image
                src="/images/about/about-hero.jpg"
                alt={t("aboutUs.imageAlt")}
                fill
                sizes="(max-width:1023px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Facts strip */}
        <dl className="grid grid-cols-3 divide-x divide-[#0B1220]/[0.08] border-t border-[#0B1220]/[0.08] py-8 sm:py-10">
          {facts.map((f: { value: string; label: string }, i: number) => (
            <div key={i} className="px-3 sm:px-6 first:pl-0">
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-heading font-semibold text-[#0B1220] text-[clamp(1.4rem,2.2vw,2rem)] tracking-[-0.01em]">
                {f.value}
              </dd>
              <p className="text-[#2B2F36]/50 text-xs sm:text-sm mt-1.5">{f.label}</p>
            </div>
          ))}
        </dl>

        {/* CTAs */}
        <nav
          aria-label={t("aboutUs.ctaNavLabel")}
          className="flex flex-col sm:flex-row flex-wrap gap-3.5 pb-20 sm:pb-28"
        >
          <Link
            href={clinicHref(loc)}
            className="inline-flex items-center justify-center h-13 px-8 rounded-lg text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A] transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)" }}
          >
            {t("aboutUs.ctaPrimary")}
          </Link>
          <Link
            href={h(loc, "/pratiques")}
            className="inline-flex items-center justify-center h-13 px-8 rounded-lg text-sm font-semibold text-[#0B1220] border border-[#0B1220]/[0.18] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A] transition-all hover:border-[#0B1220]/40"
          >
            {t("aboutUs.ctaSecondary")}
          </Link>
          <Link
            href={`${h(loc, "/contact-us")}?type=booking`}
            className="inline-flex items-center justify-center h-13 px-8 rounded-lg text-sm font-semibold text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A] transition-all hover:text-[#9A7242] underline underline-offset-4 decoration-[#B88A5A]/40"
          >
            {t("aboutUs.ctaTertiary")}
          </Link>
        </nav>
      </main>
    </section>
  );
}