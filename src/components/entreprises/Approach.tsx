"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function EntreprisesApproach(): React.JSX.Element {
  const { t, tRaw } = useLocale();

  const stepNums = ["01", "02", "03", "04"];
  const steps = (tRaw<Array<{title: string; desc: string}>>("entreprises.approach.steps")).map((s, i) => ({ ...s, num: stepNums[i] }));

  const expertData = [
    { initials: "SB", gradient: "from-[#B88A5A] to-[#9A7242]", glow: "rgba(184,138,90,0.12)" },
    { initials: "AL", gradient: "from-[#159AA9] to-[#0D7A87]", glow: "rgba(21,154,169,0.12)" },
    { initials: "KA", gradient: "from-emerald-600 to-emerald-800", glow: "rgba(16,185,129,0.12)" },
    { initials: "YO", gradient: "from-violet-500 to-violet-700", glow: "rgba(139,92,246,0.12)" },
  ];

  const experts = (tRaw<Array<{name: string; role: string}>>("entreprises.approach.experts")).map((e, i) => ({ ...e, ...expertData[i] }));

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#ea-badge, #ea-title, #ea-desc",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(
        ".ea-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(
        ".ea-expert",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.45, stagger: 0.1, ease: "back.out(1.7)", scrollTrigger: { trigger: "#ea-experts", start: "top 85%", toggleActions: "play none none none" } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F2EFE9 0%, #ECE7DD 50%, #F2EFE9 100%)" }}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-[0.03] hidden sm:block">
        <div className="absolute top-0 right-0 w-48 h-px bg-[#B88A5A]" />
        <div className="absolute top-0 right-0 w-px h-48 bg-[#B88A5A]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <div id="ea-badge">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/40" />
              {t("entreprises.approach.badge")}
            </span>
          </div>
          <h2 id="ea-title" className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-5">
            {t("entreprises.approach.heading")}
          </h2>
          <p id="ea-desc" className="text-[#2B2F36]/55 text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto">
            {t("entreprises.approach.sub")}
          </p>
        </div>

        {/* Desktop: connected horizontal timeline */}
        <div className="hidden lg:block">
          {/* Background timeline track */}
          <div className="relative mb-12">
            <div className="absolute top-8 left-[2.5rem] right-[2.5rem] h-px bg-gradient-to-r from-[#B88A5A]/5 via-[#B88A5A]/15 to-[#B88A5A]/5" />
            <div className="grid grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="ea-card relative flex flex-col items-center text-center">
                  {/* Circle marker */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-[#E8E2D9] border-2 border-[#B88A5A]/20 flex items-center justify-center transition-all duration-300 group-hover:border-[#B88A5A]/40">
                    <span className="text-[#B88A5A] font-heading font-bold text-sm">{s.num}</span>
                  </div>
                  <h3 className="text-[#0B1220] font-heading font-semibold text-base mt-5">{s.title}</h3>
                  <p className="text-[#2B2F36]/50 text-sm leading-relaxed mt-2 max-w-[220px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/tablet: stacked with left connecting line */}
        <div className="lg:hidden relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-gradient-to-b from-[#B88A5A]/20 via-[#B88A5A]/10 to-[#B88A5A]/20" />
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="ea-card relative flex items-start gap-5">
                <div className="relative z-10 w-11 h-11 rounded-full bg-[#E8E2D9] border-2 border-[#B88A5A]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#B88A5A] font-heading font-bold text-xs">{s.num}</span>
                </div>
                <div className="min-w-0 pt-2">
                  <h3 className="text-[#0B1220] font-heading font-semibold text-base">{s.title}</h3>
                  <p className="text-[#2B2F36]/50 text-sm leading-relaxed mt-1.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Advisory Board ── */}
      <div id="ea-experts" className="mt-24 pt-16 sm:pt-20 border-t border-[#B88A5A]/8 relative overflow-hidden">
          {/* Subtle background image */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.18]">
            <Image
              src="/images/diverse-team.jpg"
              alt=""
              fill
              className="object-cover object-center brightness-[0.7] saturate-[0.6]"
              sizes="100vw"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(184,138,90,0.08) 100%)" }} />
          </div>

          <div className="max-w-2xl mx-auto text-center mb-14 relative z-10">
            <div id="ea-experts-badge">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {t("entreprises.approach.boardBadge")}
              </span>
            </div>
            <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-5">{t("entreprises.approach.boardHeading")}</h2>
            <p className="text-[#2B2F36]/55 text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto">
              {t("entreprises.approach.boardDesc")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 max-w-3xl mx-auto relative z-10">
            {experts.map((expert, i) => (
              <div key={i} className="ea-expert text-center group relative">
                {/* Decorative bg glow */}
                <div
                  className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${expert.glow}, transparent 70%)` }}
                />
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br ${expert.gradient} flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl shadow-lg shadow-black/5`}>
                  <span className="text-white font-heading font-bold text-lg sm:text-xl">{expert.initials}</span>
                  {/* Ring */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-white/[0.15] ring-inset" />
                </div>
                <h3 className="text-[#0B1220] font-heading font-semibold text-sm sm:text-base mt-4">{expert.name}</h3>
                <p className="text-[#2B2F36]/45 text-xs sm:text-sm mt-1">{expert.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
