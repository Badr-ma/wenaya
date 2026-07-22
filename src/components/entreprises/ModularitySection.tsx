/**
 * Modularity Section — explains Wenaya's modular approach to corporate wellness.
 * Two-column layout: text on left explaining flexibility, image on right.
 * GSAP scroll-triggered fade-in animations.
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

export default function ModularitySection() {
  const { t, tRaw } = useLocale();
  const pillars = tRaw<Array<{ title: string; desc: string }>>("entreprises.modularity.pillars");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".mo-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".mo-row", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".mo-image", { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-24 sm:py-36 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mo-head max-w-2xl mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            {t("entreprises.modularity.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] text-[clamp(2.2rem, 4vw, 3.8rem)] mt-5 leading-[1.06]">
            {t("entreprises.modularity.subtitle")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-3">
            <div className="divide-y divide-[#0B1220]/[0.06]">
              {pillars.map((p, i) => (
                <div key={i} className="mo-row grid sm:grid-cols-12 gap-4 sm:gap-6 py-8 sm:py-10 first:pt-0">
                  <div className="sm:col-span-1">
                    <span className="text-[#B88A5A]/30 font-heading font-bold text-2xl sm:text-3xl leading-none tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="sm:col-span-11">
                    <h3 className="heading-serif text-[#0B1220] text-xl sm:text-2xl font-semibold leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-[#2B2F36]/50 text-sm sm:text-base leading-relaxed mt-2 max-w-lg">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:pt-4">
            <div className="mo-image relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=100"
                alt="Atelier bien-être en entreprise"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
