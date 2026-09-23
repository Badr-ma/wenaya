/**
 * Packs — three ready-to-use packs (packs.items) as image-led cards under the
 * "Des exemples concrets" header. Each card = large editorial photo on top,
 * small-caps bronze level badge, serif name, pitch, a checkmarked capability
 * column (first three features) and a CTA to #contact. Restrained once-only
 * GSAP entrance.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type Pack = { level: string; name: string; pitch: string; features: string[] };

const PACK_IMAGES = [
  "/images/cours-ateliers/wellness.jpg",
  "/images/business-meeting.jpg",
  "/images/executive-team.jpg",
];

export default function PacksSection() {
  const { t, tRaw } = useLocale();
  const packs = tRaw<Pack[]>("entreprises.packs.items");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pk-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".pk-card", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-9 sm:py-13 lg:py-16 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="pk-head mx-auto max-w-2xl text-center mb-8 sm:mb-10">
          <h2 className="heading-serif text-[#0B1220] leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.packs.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[15px] sm:text-base text-[#2B2F36]/55 leading-relaxed">{t("entreprises.packs.subtitle")}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {packs.map((pack, i) => (
            <article
              key={i}
              className="pk-card flex flex-col overflow-hidden rounded-[8px] bg-white border border-[#0B1220]/[0.08]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0B1220]">
                <Image
                  src={PACK_IMAGES[i % PACK_IMAGES.length]}
                  alt={pack.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1023px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 py-6">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#B88A5A] font-semibold">{pack.level}</span>
                <h3 className="heading-serif text-[#0B1220] text-xl sm:text-2xl font-semibold leading-snug mt-1.5">{pack.name}</h3>
                <p className="mt-2 text-sm text-[#2B2F36]/55">{pack.pitch}</p>
                <ul className="mt-5 space-y-2.5 border-t border-[#0B1220]/10 pt-5">
                  {pack.features.slice(0, 3).map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm leading-relaxed text-[#2B2F36]/70">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-[#159AA9]">
                        <path d="M6 13l4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0B1220] text-white text-sm font-semibold px-7 h-12 transition-colors hover:bg-[#232B3C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                  >
                    {t("entreprises.packs.cta")}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}