/**
 * Programs Section — clean one-row card grid over the shared programme data
 * source (src/lib/corporate-programmes.ts). The 4 labelled programmes render as
 * equal-width editorial cards (image, index, badge, name, pitch, format, CTA):
 * one row of 4 on desktop, 2×2 on tablet, single column on mobile. No slider,
 * no staggered editorial layout, no animation.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { getProgrammeHref, getAllProgrammeCards } from "@/lib/corporate-programmes";

/** Editorial photography — reuse from the corporate Unsplash pool. */
const PROGRAMME_IMAGES: Record<string, string> = {
  "leadership-360": "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1600&q=100&auto=format&fit=crop",
  pcm: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=100&auto=format&fit=crop",
  "art-des-priorites": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=100&auto=format&fit=crop",
  "people-model-canvas": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=100&auto=format&fit=crop",
};

const INDEX_FALLBACK = ["01", "02", "03", "04"];

export default function ProgrammesSection() {
  const { t, locale } = useLocale();
  const programmes = getAllProgrammeCards(locale);

  if (!programmes.length) return null;

  return (
    <section className="relative bg-[#F2EFE9] py-16 sm:py-24 px-6 overflow-hidden">
      <div className="max-w-[88rem] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 sm:mb-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 whitespace-nowrap text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
              {t("entreprises.programmes.title")}
            </span>
            <h2 className="heading-serif text-[#0B1220] mt-4 leading-[1.06]" style={{ fontSize: "clamp(1.85rem, 3.4vw, 3.2rem)" }}>
              {t("entreprises.programmes.subtitle")}
            </h2>
          </div>
          <p className="text-[#0B1220]/55 text-sm leading-relaxed max-w-sm lg:shrink-0">
            {t("entreprises.programmes.ctaDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-10">
          {programmes.map((program, i) => {
            const image = PROGRAMME_IMAGES[program.slug];
            return (
              <article key={program.slug} className="flex flex-col h-full">
                {image && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-[24px] bg-white/40">
                    <Image
                      src={image}
                      alt={program.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                )}

                <div className="flex flex-col flex-1 pt-6 lg:pt-7">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="font-heading font-bold leading-none select-none shrink-0 text-[#B88A5A]"
                      style={{ fontSize: "clamp(1.7rem, 2.6vw, 2.4rem)", opacity: 0.9 }}
                    >
                      {i < INDEX_FALLBACK.length ? INDEX_FALLBACK[i] : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#B88A5A]/10 px-3 py-1 text-[#B88A5A] text-[10px] font-bold tracking-[0.16em] uppercase">
                      {program.badge}
                    </span>
                  </div>

                  <h3 className="heading-serif text-[#0B1220] mt-4 leading-[1.08]" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)" }}>
                    {program.name}
                  </h3>

                  <p className="mt-3 text-[#B88A5A] text-sm sm:text-[15px] font-medium leading-relaxed">{program.pitch}</p>

                  {program.format ? (
                    <span className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm text-[#0B1220]/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" aria-hidden />
                      {program.format}
                    </span>
                  ) : null}

                  <Link
                    href={getProgrammeHref(locale, program.slug)}
                    className="mt-auto pt-7 inline-flex items-center gap-2 text-[#B88A5A] text-sm font-semibold group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                  >
                    {t("entreprises.programmes.discoverLabel")}
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}