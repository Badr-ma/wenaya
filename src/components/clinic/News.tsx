/**
 * Clinic News — latest blog posts for the Clinic/B2C page.
 * Editorial layout: one large featured article opposite three text rows. No
 * card grid. Server component (reads filesystem-backed blog adapter).
 */
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/blog";
import { h, type HrefLocale } from "@/lib/href";
import { useTranslations as getTranslations } from "@/i18n";

function formatDate(iso: string, locale: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function ClinicNews({ locale, lang }: { locale: HrefLocale; lang: string }): Promise<React.JSX.Element> {
  const { t } = getTranslations(lang);
  const posts = getPublishedPosts().slice(0, 4);

  return (
    <section className="relative bg-[#0B1220] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.news.badge")}
            </span>
            <h2 className="heading-serif text-white leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.news.heading1")}
              <br />
              {t("clinic.news.heading2")}
            </h2>
          </div>
          <Link
            href={h(locale, "/articles")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white group whitespace-nowrap"
          >
            <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
              {t("clinic.news.cta")}
            </span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Featured first post */}
          {posts[0] ? (
            <Link href={h(locale, `/articles/${posts[0].slug}`)} className="group lg:col-span-7 block">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-[24px] bg-white/[0.04]">
                <Image
                  src={posts[0].featuredImage}
                  alt={posts[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-5 left-5 text-[#B88A5A] text-[11px] font-semibold tracking-[0.2em] uppercase bg-[#0B1220]/70 px-3 py-1.5">
                  {formatDate(posts[0].publishedAt, lang)}
                </span>
              </div>
              <div className="mt-5">
                <h3 className="heading-serif text-white text-2xl lg:text-3xl leading-tight group-hover:text-[#B88A5A] transition-colors">
                  {posts[0].title}
                </h3>
                <p className="mt-2 text-white/50 text-base leading-relaxed line-clamp-2 max-w-xl">
                  {posts[0].excerpt}
                </p>
              </div>
            </Link>
          ) : null}

          {/* Remaining list — text rows */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-0 divide-y divide-white/[0.1]">
              {posts.slice(1, 4).map((p) => (
                <Link key={p.slug} href={h(locale, `/articles/${p.slug}`)} className="group block py-5 first:pt-0">
                  <p className="text-[#B88A5A] text-sm font-medium">{formatDate(p.publishedAt, lang)}</p>
                  <h3 className="heading-serif text-white text-lg lg:text-xl mt-1.5 leading-snug group-hover:text-[#B88A5A] transition-colors">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
