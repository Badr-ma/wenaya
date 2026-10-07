/**
 * TrustBand — light proof band directly under the hero: the "Ils nous font
 * confiance" small-caps label, the five live partner logos as a wrapping
 * editorial row, and the Wenaya aggregate band line. Restrained once-only
 * GSAP fade.
 *
 * Source of truth: the live Wenaya corporate page
 * (https://wenaya.com/corporate and /en/corporate), whose trust section is a
 * hardcoded five-path array rendering `wenaya.com/for-entreprise/partners/1..5.jpg`
 * with generated alt `Partenaire 1..5`. Those exact five files are served here
 * byte-for-byte — no redrawn, recoloured, cropped or substituted marks.
 *
 * Positions 4 and 5 are UNIDENTIFIED. OCR yields only "SINCE 1908" for #4 and
 * no legible text for #5; the live site itself carries no company names (no HTML
 * text, no alt text, no JS-bundle string, no sitemap reference, no JPEG metadata,
 * no usable Wayback capture). They are therefore kept in place as unnamed
 * positions with a neutral "Partner logo" alt — deliberately NOT guessed at.
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

/**
 * Live partner assets, indexed to match `entreprises.programs.partners`
 * (PwC, Majorel, Webhelp, then the two unnamed live positions) so no company
 * name or ordering is duplicated here. `width`/`height` are the true intrinsic
 * pixel dimensions, which lets Next reserve the exact box before decode.
 *
 * `className` only normalises optical size — every mark is rendered with
 * `object-contain`, never cropped, stretched, or recoloured. All five keep a
 * uniform rendered height so the wrapping row stays even despite the source
 * files ranging from a 224x224 square wordmark to 1600x900 wide marks.
 *  - #1 PwC: 1600x900 wide wordmark card.
 *  - #2 Majorel: 500x300 wide logo on white.
 *  - #3 Webhelp: 1053x630 wide logo on white.
 *  - #4 unidentified: 1600x872 full-bleed dark card, white logotype.
 *  - #5 unidentified: 224x224 serif wordmark on white.
 */
const PARTNER_LOGOS: { src: string; width: number; height: number; className: string }[] = [
  { src: "/images/entreprises/partner-1.jpg", width: 1600, height: 900, className: "h-8 sm:h-10" },
  { src: "/images/entreprises/partner-2.jpg", width: 500, height: 300, className: "h-8 sm:h-10" },
  { src: "/images/entreprises/partner-3.jpg", width: 1053, height: 630, className: "h-8 sm:h-10" },
  { src: "/images/entreprises/partner-4.jpg", width: 1600, height: 872, className: "h-8 sm:h-10" },
  { src: "/images/entreprises/partner-5.jpg", width: 224, height: 224, className: "h-8 sm:h-10" },
];

export default function TrustBandSection() {
  const { t, tRaw } = useLocale();
  const partners = tRaw<string[]>("entreprises.programs.partners");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tb-band", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 94%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white px-6 py-8 sm:py-10 overflow-hidden scroll-mt-20">
      <div className="tb-band mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#B88A5A] text-center font-semibold">
          {t("entreprises.programs.ilsNousFontConfiance")}
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-11 sm:gap-y-6">
          {partners.map((name, i) => {
            const logo = PARTNER_LOGOS[i];
            if (!logo) return null;
            return (
              <li key={`${i}-${name}`} className="flex items-center">
                <Image
                  src={logo.src}
                  alt={`${name} logo`}
                  width={logo.width}
                  height={logo.height}
                  className={`${logo.className} w-auto max-w-[190px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100`}
                />
              </li>
            );
          })}
        </ul>
        <p className="mt-7 text-center text-sm text-[#2B2F36]/55">{t("entreprises.stats.band")}</p>
      </div>
    </section>
  );
}