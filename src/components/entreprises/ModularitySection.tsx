/**
 * Modularity Section — interactive, selection-driven modular approach.
 * Desktop: discipline list on the left (click to activate → bronze number +
 * extending line, right image reflects the active pillar). Mobile: stacked
 * accordion rows. GSAP scroll-triggered entrance only.
 */
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const pillarImages = [
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=100",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=100",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=100",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1600&q=100",
];

export default function ModularitySection() {
  const { t, tRaw } = useLocale();
  const pillars = tRaw<Array<{ title: string; desc: string }>>("entreprises.modularity.pillars");
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".mo-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".mo-row", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const select = (i: number) => setActive(i);

  const numClass = (i: number) =>
    i === active
      ? "text-[#B88A5A]"
      : "text-[#B88A5A]/25 group-hover:text-[#B88A5A]/60 transition-colors duration-300";

  const titleClass = (i: number) =>
    i === active
      ? "text-[#0B1220]"
      : "text-[#0B1220]/55 group-hover:text-[#0B1220]/80 transition-colors duration-300";

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-12 sm:py-16 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mo-head max-w-2xl mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            {t("entreprises.modularity.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] mt-4 leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 3.15vw, 3rem)" }}>
            {t("entreprises.modularity.subtitle")}
          </h2>
        </div>

        {/* Desktop: selection-driven list + image */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3">
            <div className="divide-y divide-[#0B1220]/[0.06]">
              {pillars.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={i === active}
                  className="mo-row group block w-full text-left py-7 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-6">
                    <span className={`font-heading font-bold text-2xl sm:text-3xl leading-none tabular-nums transition-colors duration-300 ${numClass(i)}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h3 className={`font-heading text-[#0B1220] text-xl sm:text-2xl font-semibold leading-tight transition-colors duration-300 ${titleClass(i)}`}>
                        {p.title}
                      </h3>
                      <p
                        className={`text-[#2B2F36]/55 text-sm sm:text-[15px] leading-relaxed mt-2 max-w-lg transition-all duration-300 overflow-hidden ${
                          i === active ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        } motion-reduce:max-h-40 motion-reduce:opacity-100`}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 ml-[calc(1.5rem+2.25rem)] h-px bg-[#0B1220]/10">
                    <div
                      className={`h-full bg-[#B88A5A] transition-all duration-500 motion-reduce:transition-none ${
                        i === active ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={pillarImages[active % pillarImages.length]}
                alt={pillars[active]?.title ?? ""}
                fill
                className="object-cover transition-all duration-500 motion-reduce:transition-none"
                sizes="(max-width: 1280px) 40vw, 480px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-[#0B1220]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[#B88A5A] text-xs font-semibold tracking-[0.18em] uppercase mb-2">
                  {String(active + 1).padStart(2, "0")}
                </p>
                <h3 className="text-white heading-serif text-2xl leading-tight">{pillars[active]?.title}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: stacked accordion + image */}
        <div className="lg:hidden">
          <div className="divide-y divide-[#0B1220]/[0.06]">
            {pillars.map((p, i) => {
              const open = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(i)}
                  aria-expanded={open}
                  className="mo-row block w-full text-left py-6"
                >
                  <div className="flex items-start gap-4">
                    <span className={`font-heading font-bold text-xl leading-none tabular-nums pt-1 transition-colors duration-300 ${numClass(i)}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`font-heading text-[#0B1220] text-lg font-semibold leading-tight transition-colors duration-300 ${titleClass(i)}`}>
                          {p.title}
                        </h3>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                          className={`shrink-0 text-[#B88A5A] transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
                        >
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p
                        className={`text-[#2B2F36]/55 text-sm leading-relaxed mt-2 overflow-hidden transition-all duration-300 motion-reduce:max-h-none motion-reduce:opacity-100 ${
                          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl mt-6">
            <Image
              src={pillarImages[active % pillarImages.length]}
              alt={pillars[active]?.title ?? ""}
              fill
              className="object-cover transition-all duration-500 motion-reduce:transition-none"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white heading-serif text-xl leading-tight">{pillars[active]?.title}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
