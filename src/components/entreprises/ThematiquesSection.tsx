/**
 * Thématiques Section — showcases the different wellness themes Wenaya covers
 * (mental health, musculoskeletal, nutrition, stress management).
 * Features: image cards in a grid layout with GSAP scroll animations.
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const themeImages = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=100",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=100",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=100",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=100",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=100",
];

export default function ThematiquesSection() {
  const { t, tRaw } = useLocale();
  const themes = tRaw<Array<{ title: string; desc: string }>>("entreprises.thematiques.themes");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".th-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".th-row", { opacity: 0, x: -16 }, {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-24 sm:py-36 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="th-head max-w-2xl mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            {t("entreprises.thematiques.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] text-[clamp(2.2rem, 4vw, 3.8rem)] mt-5 leading-[1.06]">
            {t("entreprises.thematiques.subtitle")}
          </h2>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {themes.map((th, i) => (
            <div key={i} className="th-row grid sm:grid-cols-12 gap-5 sm:gap-8 items-center">
              <div className={`sm:col-span-4 ${i % 2 === 0 ? "sm:order-first" : "sm:order-last"}`}>
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={themeImages[i % themeImages.length]}
                    alt={th.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[#0B1220]/5" />
                </div>
              </div>
              <div className="sm:col-span-8">
                <h3 className="text-[#0B1220] heading-serif text-xl sm:text-2xl font-semibold">{th.title}</h3>
                <p className="text-[#2B2F36]/45 text-sm sm:text-base leading-relaxed mt-2 max-w-xl">{th.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
