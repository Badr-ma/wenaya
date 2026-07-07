"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";


const visualReasons = [
  { num: "01", decoration: "#B88A5A" },
  { num: "02", decoration: "#B88A5A" },
  { num: "03", decoration: "#B88A5A" },
  { num: "04", decoration: "#B88A5A" },
];

export default function ClinicsWhy(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const { t, tRaw } = useLocale();

  const rawReasons = tRaw<{ title: string; desc: string }[]>("clinics.why.reasons");
  const reasons = rawReasons.map((r, i) => ({ ...r, ...visualReasons[i] }));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cw-item",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-20 sm:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, #0B1220 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="mx-auto text-center mb-14 sm:mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
              {t("clinics.why.badge")}
            </span>
          </div>
          <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220]">
            {t("clinics.why.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("clinics.why.heading2")}
</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {reasons.map((r, i) => (
            <div key={i} className="cw-item flex gap-6">
              <span className="font-heading font-black text-[3rem] sm:text-[4rem] leading-none tracking-tight"
                style={{ color: `${r.decoration}15` }}
              >
                {r.num}
              </span>
              <div className="pt-1">
                <h3 className="text-[#0B1220] font-heading font-semibold text-lg mb-2">{r.title}</h3>
                <p className="text-[#2B2F36]/55 text-sm leading-relaxed max-w-sm">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cw-item mt-16 pt-8 border-t border-[#0B1220]/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-[#2B2F36]/45 text-sm max-w-md">
            {t("clinics.why.bottom")}
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-[#B88A5A] text-sm font-semibold hover:gap-3 transition-all duration-300">
            {t("clinics.why.cta")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
