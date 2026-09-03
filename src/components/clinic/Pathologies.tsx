/**
 * Clinic Pathologies — explorer for the Clinic/B2C page.
 * Editorial layout: a vertical numbered topic list alongside a large active
 * image. Hovering a topic swaps the active image + summary. All topic names
 * remain in the DOM (SSR). Links preserve the generic /pratiques destination.
 * No cards.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { getPathologies } from "@/lib/pathologies";
import { h } from "@/lib/href";

/** High-resolution visual fallbacks for topics whose own image is too small. */
const HIGH_RES_IMAGE: Record<string, string> = {
  "troubles-apprentissage": "/pratiques/sono-therapie.jpg",
  alzheimer: "/pratiques/massotherapie.jpg",
  "kinesitherapie-avc": "/pratiques/kinesitherapie.jpg",
};

export default function ClinicPathologies(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const pathologies = getPathologies(locale as "fr" | "en");
  const [active, setActive] = useState(0);
  const current = pathologies[active] ?? pathologies[0];

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] px-6 sm:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.pathologies.badge")}
            </span>
            <h2 className="heading-serif text-white leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.pathologies.heading1")}
              <br />
              {t("clinic.pathologies.heading2")}
            </h2>
          </div>
          <p className="text-white/45 text-base lg:text-lg leading-relaxed max-w-md">
            {t("clinic.pathologies.sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Numbered topic list — always fully present in DOM */}
          <div className="lg:col-span-6">
            <div className="space-y-0 divide-y divide-white/[0.08]">
              {pathologies.map((p, i) => (
                <Link
                  key={p.slug}
                  href={h(locale, "/pratiques")}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group flex items-center justify-between gap-6 py-4 lg:py-5 transition-colors ${active === i ? "text-white" : "text-white/45 hover:text-white/70"}`}
                >
                  <span className="flex items-baseline gap-5 lg:gap-6">
                    <span className={`font-mono text-sm ${active === i ? "text-[#B88A5A]" : "text-white/30"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="heading-serif text-2xl lg:text-3xl leading-tight">
                      {p.title}
                    </span>
                  </span>
                  <svg className={`w-4 h-4 shrink-0 text-[#B88A5A] transition-all ${active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Active image + summary */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-t-[28px] bg-white/[0.04] min-h-[280px] lg:min-h-[400px]">
              <Image
                key={current.slug}
                src={HIGH_RES_IMAGE[current.slug] ?? current.image}
                alt={current.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/85 via-[#0B1220]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-9">
                <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase mb-3 block">
                  {t("clinic.pathologies.cta")}
                </span>
                <h3 className="heading-serif text-white text-2xl lg:text-3xl leading-tight">
                  {current.title}
                </h3>
                <p className="mt-3 text-white/70 text-sm lg:text-base leading-relaxed max-w-md">
                  {current.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
