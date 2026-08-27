"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function DemoConsultation() {
  const { t, tRaw } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".cs-left", { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
      gsap.from(".cs-stat", { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, [ready]);

  const stats = tRaw<Array<{ value: string; label: string; source: string }>>("entreprises.stats.items");

  return (
    <section
      id="contact"
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-white py-24 sm:py-36 px-6 overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="cs-stat">
              <p className="heading-serif text-[#0B1220]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.06 }}>
                {stat.value}
              </p>
              <p className="text-[#2B2F36]/40 text-sm mt-3">{stat.label}</p>
              {stat.source && (
                <p className="text-[#2B2F36]/20 text-[11px] mt-2">{stat.source}</p>
              )}
            </div>
          ))}
        </div>

        {/* Editorial layout: heading left, content right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="cs-left">
            <span className="inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
              <span className="w-10 h-px bg-[#B88A5A]/50" />
              {t("entreprises.contactSection.title")}
            </span>
            <h2 className="heading-serif text-[#0B1220] mt-6" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1 }}>
              {t("entreprises.contactSection.subtitle")}
            </h2>
            <p className="text-[#2B2F36]/40 text-base leading-relaxed mt-5 max-w-md">
              {t("entreprises.consultation.desc")}
            </p>
            <a
              href="tel:+212600000000"
              className="inline-flex items-center gap-3 mt-8 text-[#0B1220] text-sm font-semibold group"
            >
              <span className="border-b border-[#0B1220]/20 pb-0.5 group-hover:border-[#0B1220] transition-colors">
                {t("entreprises.contactSection.submit")}
              </span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          <div className="cs-left">
            <p className="text-[#0B1220] font-serif" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", lineHeight: 1.3 }}>
              {t("entreprises.contactSection.desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
