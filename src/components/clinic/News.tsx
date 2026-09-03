/**
 * Clinic News — latest blog posts for the Clinic/B2C page.
 * Server component: reads blog data from the filesystem-backed adapter and
 * renders an editorial two-column layout (featured + list). No cards.
 */
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/blog";
import { h, type HrefLocale } from "@/lib/href";
import { useTranslations } from "@/i18n";

function formatDate(iso: string, locale: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function ClinicNews({ locale, lang }: { locale: HrefLocale; lang: string }): Promise<React.JSX.Element> {
  const { t } = useTranslations(lang);
  const posts = getPublishedPosts().slice(0, 4);

  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.news.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              {t("clinic.news.heading1")}
              <br />
              {t("clinic.news.heading2")}
            </h2>
          </div>
          <Link
            href={h(locale, "/blog")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
          >
            {t("clinic.news.cta")}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Featured first post */}
          {posts[0] ? (
            <Link href={h(locale, `/blog/${posts[0].slug}`)} className="group lg:col-span-7 block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#0B1220]/5">
                <Image
                  src={posts[0].featuredImage}
                  alt={posts[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-6">
                <p className="text-[#B88A5A] text-sm font-medium">{formatDate(posts[0].publishedAt, lang)}</p>
                <h3 className="heading-serif text-[#0B1220] text-2xl lg:text-3xl mt-2 leading-tight group-hover:text-[#159AA9] transition-colors">
                  {posts[0].title}
                </h3>
                <p className="mt-3 text-[#0B1220]/55 text-base leading-relaxed line-clamp-2">
                  {posts[0].excerpt}
                </p>
              </div>
            </Link>
          ) : null}

          {/* Remaining list */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-0 divide-y divide-[#0B1220]/[0.06]">
              {posts.slice(1, 4).map((p) => (
                <Link key={p.slug} href={h(locale, `/blog/${p.slug}`)} className="group block py-6 first:pt-0">
                  <p className="text-[#B88A5A] text-sm font-medium">{formatDate(p.publishedAt, lang)}</p>
                  <h3 className="heading-serif text-[#0B1220] text-lg mt-1.5 leading-snug group-hover:text-[#159AA9] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[#0B1220]/50 text-sm leading-relaxed line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}