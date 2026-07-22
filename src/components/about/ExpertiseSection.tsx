"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { specialists } from "@/lib/specialistes";

const featuredSpecialists = specialists.slice(0, 10);

export default function ExpertiseSection(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const imgs = el.querySelectorAll(".es-img");
      gsap.fromTo(imgs, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } });
      gsap.fromTo("#es-title, #es-text, #es-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" } });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-20 sm:py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-10 lg:gap-14">
          <div className="max-w-xl text-center">
            <div id="es-badge">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {t("expertiseSection.badge")}
              </span>
            </div>

            <h2 id="es-title" className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-5">
              {t("expertiseSection.heading1")}{" "}
              <span style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {t("expertiseSection.heading2")}
              </span>
            </h2>

            <div id="es-text" className="text-[#2B2F36]/50 text-xs sm:text-sm leading-relaxed mt-5">
              <p>{t("expertiseSection.p1")}</p>
            </div>
          </div>

          <div className="relative w-full">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 w-full snap-x snap-mandatory scrollbar-hide">
              {featuredSpecialists.map((s) => (
                <Link key={s.slug} href={`/specialistes/${s.slug}`} className="es-img group relative shrink-0 w-[280px] h-[280px] rounded-xl overflow-hidden block z-10 snap-center">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 pointer-events-none"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/[0.04] pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1220]/70 to-transparent p-3 sm:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <p className="text-white text-sm font-heading font-bold">{s.name}</p>
                    <p className="text-white/60 text-xs">{s.role}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button onClick={() => scroll("left")} className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md items-center justify-center hover:bg-white transition-colors z-20">
              <svg className="w-4 h-4 text-[#0B1220]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
            </button>
            <button onClick={() => scroll("right")} className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md items-center justify-center hover:bg-white transition-colors z-20">
              <svg className="w-4 h-4 text-[#0B1220]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" /></svg>
            </button>
          </div>

          <div id="es-cta">
            <Link href="/specialistes" className="group inline-flex items-center gap-3 bg-[#0B1220] text-white text-sm font-semibold h-[50px] px-8 rounded-full transition-all duration-300 hover:bg-[#B88A5A] hover:shadow-lg hover:shadow-[rgba(184,138,90,0.2)]">
              {t("expertiseSection.cta")}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
