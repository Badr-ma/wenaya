/**
 * ShopComingSoonNotice — page-level "shop coming soon" state shown on the /panier
 * and /checkout routes while the shop is frozen. Preserves the page shell design
 * (sand background, top padding, heading-serif H1) used by PanierView / CheckoutView.
 *
 * SHOP LAUNCH FREEZE: Commerce interactions are temporarily disabled. Direct visits
 * to the cart/checkout routes render this notice instead of a working basket — no
 * cart mutation, order creation, or payment path exists while the freeze is on.
 * PanierView / CheckoutView stay on disk unchanged for future activation.
 */
"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";

export default function ShopComingSoonNotice() {
  const { t, locale } = useLocale();

  return (
    <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <span className="text-[#B88A5A] text-[11px] font-semibold uppercase tracking-[0.22em] block mb-4">
          {t("shop.comingSoon.eyebrow")}
        </span>
        <h1 className="heading-serif text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#0B1220] mb-5">
          {t("shop.comingSoon.title")}
        </h1>
        <p className="text-[#2B2F36]/55 text-base sm:text-lg leading-relaxed mb-8 max-w-[560px]">
          {t("shop.comingSoon.body")}
        </p>
        <Link
          href={h(locale, "/produits")}
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
        >
          {t("shop.comingSoon.button")}
        </Link>
      </div>
    </section>
  );
}