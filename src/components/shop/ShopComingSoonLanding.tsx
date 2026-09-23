/**
 * ShopComingSoonLanding — premium editorial "shop coming soon" page shown on
 * /produits and /en/produits while the commerce frontend is paused.
 *
 * SHOP LAUNCH FREEZE: the shop listing is temporarily replaced by this landing;
 * product-detail, cart and checkout routes redirect here via next.config.ts.
 * All existing shop code (products data, cards, grid, detail pages, cart,
 * checkout, API) stays on disk untouched for future activation. This page
 * carries no fake products, prices, countdown or newsletter form — a calm,
 * typographic, editorial composition in Wenaya's design language.
 */
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "@/i18n";
import { h, type HrefLocale } from "@/lib/href";

interface ShopComingSoonLandingProps {
  locale: HrefLocale;
}

export default function ShopComingSoonLanding({ locale }: ShopComingSoonLandingProps) {
  const { t } = getTranslations(locale);

  return (
    <section
      data-section-bg="light"
      className="bg-[#F2EFE9] min-h-screen pt-36 sm:pt-44 pb-20 sm:pb-28 px-4 sm:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 items-center">
        <div>
          <span className="text-[#B88A5A] text-[11px] font-semibold uppercase tracking-[0.22em] block mb-3">
            {t("shop.landing.eyebrow")}
          </span>
          <span aria-hidden="true" className="block w-10 h-[2px] bg-[#B88A5A] mb-7" />
          <h1 className="heading-serif text-[#0B1220] text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1.08] tracking-[-0.01em] mb-6">
            {t("shop.landing.title")}
          </h1>
          <p className="text-[#2B2F36]/65 text-base sm:text-lg leading-relaxed max-w-[560px] mb-4">
            {t("shop.landing.body")}
          </p>
          <p className="text-[#2B2F36]/45 text-sm sm:text-base leading-relaxed max-w-[520px] mb-10">
            {t("shop.landing.secondary")}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href={h(locale, "/")}
              className="inline-flex items-center justify-center px-8 h-13 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
            >
              {t("shop.landing.cta")}
            </Link>
            <Link
              href={h(locale, "/pratiques")}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1220] underline decoration-[#B88A5A]/40 underline-offset-4 hover:text-[#B88A5A] hover:decoration-[#B88A5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 rounded-sm"
            >
              {t("shop.landing.ctaSecondary")}
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#B88A5A]/25 shadow-[0_24px_60px_rgba(11,18,32,0.12)]">
            <Image
              src="/images/wellness-stretch.jpg"
              alt={t("shop.landing.imageAlt")}
              fill
              priority
              sizes="(max-width:1023px) 96vw, 44vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}