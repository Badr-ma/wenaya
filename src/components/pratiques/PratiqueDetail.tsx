/**
 * Pratique Detail — renders the core content for individual practice pages.
 * Client Component — required for DOMPurify sanitization and dangerouslySetInnerHTML.
 *
 * Renders: back link, hero (image + title + description + CTA), article body.
 * When the backend provides `details` (HTML), the article section renders below the hero.
 * Currently `details` is undefined in local data — the article section does not render.
 */
"use client";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "dompurify";
import type { Pratique } from "@/lib/pratiques";
import { h } from "@/lib/href";

type HrefLocale = "fr" | "en";

interface PratiqueDetailProps {
  pratique: Pratique;
  locale: HrefLocale;
  backHref: string;
  backLabel: string;
  ctaLabel: string;
}

export default function PratiqueDetail({
  pratique,
  locale,
  backHref,
  backLabel,
  ctaLabel,
}: PratiqueDetailProps): React.JSX.Element {
  const hasDetails = Boolean(pratique.details);

  return (
    <section className="bg-[#F2EFE9] min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Back link */}
        <Link
          href={h(locale, backHref)}
          className="inline-flex items-center text-xs text-[#2B2F36]/30 hover:text-[#2B2F36]/60 transition-colors mb-10 sm:mb-14"
        >
          <span className="mr-1.5">←</span>
          {backLabel}
        </Link>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={pratique.image}
              alt={pratique.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B1220] leading-tight">
              {pratique.title}
            </h1>

            <div className="border-l-2 border-[#377B89]/40 pl-5 py-1">
              <p className="text-[#2B2F36]/60 text-base sm:text-lg leading-relaxed">
                {pratique.description}
              </p>
            </div>

            <div className="pt-4">
              <Link
                href={h(locale, "/contact")}
                className="inline-flex items-center gap-3 h-11 px-7 rounded-xl text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px rgba(184,138,90,0.35)",
                }}
              >
                {ctaLabel}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Article body — rendered only when backend provides details HTML */}
        {hasDetails && (
          <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-[#0B1220]/[0.06]">
            <div
              className="pratique-article max-w-3xl text-[#2B2F36]/70 leading-[1.9] text-[clamp(0.95rem,1.2vw,1.05rem)]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pratique.details!) }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
