"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const audienceIcons: React.JSX.Element[] = [
  (<svg key="aud-1" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M6 19v-8l4-2.667M18 19V11l-4-2.667M10 8.333V19M14 8.333V19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>),
  (<svg key="aud-2" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 5V3h8v2M10 11l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>),
  (<svg key="aud-3" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>),
];

const offerIcons: React.JSX.Element[] = [
  (<svg key="off-1" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.3" />
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>),
  (<svg key="off-2" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect x="4" y="9" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 9V6a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.4" />
  </svg>),
  (<svg key="off-3" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9 9h6M9 13h4M9 17h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
  </svg>),
  (<svg key="off-4" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <rect x="3" y="3" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9 17h6M12 15v2" stroke="currentColor" strokeWidth="1.3" />
  </svg>),
  (<svg key="off-5" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M5 19V8l4-2 6 4 4-2v11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M9 12v5M15 10v7M19 8v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>),
  (<svg key="off-6" viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M12 3C6.477 3 2 5.686 2 9c0 1.854 1.044 3.524 2.667 4.667L5 18l3.333-2.333A9.135 9.135 0 0012 16c5.523 0 10-2.686 10-6s-4.477-6-10-6z" stroke="currentColor" strokeWidth="1.3" />
  </svg>),
];

const accentColors = ["#B88A5A", "#C99B68", "#D4A870", "#159AA9", "#B88A5A", "#C99B68"];

const images = [
  "/images/business-meeting.jpg",
  "/images/diverse-team.jpg",
  "/images/executive-team.jpg",
  "/images/wellness-stretch.jpg",
  "/images/cours-ateliers/wellness.jpg",
  "/images/cours-ateliers/nature.jpg",
];

export default function EntreprisesPrograms(): React.JSX.Element {
  const { t, tRaw } = useLocale();

  const audiences = (tRaw<Array<{ title: string; subtitle: string; desc: string }>>("entreprises.programs.audiences")).map((a, i) => ({ ...a, icon: audienceIcons[i] }));
  const offers = (tRaw<Array<{ title: string; desc: string }>>("entreprises.programs.offers")).map((o, i) => ({ ...o, icon: offerIcons[i], accent: accentColors[i], img: images[i % images.length] }));
  const themes = tRaw<Array<{ title: string; desc: string }>>("entreprises.programs.themes");

  const partnerColors = ["from-emerald-600 to-emerald-800", "from-red-600 to-red-800", "from-blue-600 to-indigo-700", "from-cyan-600 to-teal-700", "from-yellow-600 to-orange-700", "from-gray-700 to-gray-900"];
  const partners = (tRaw<string[]>("entreprises.programs.partners")).map((name, i) => ({ name, color: partnerColors[i] }));

  const tabs = [
    { id: "audience", label: t("entreprises.programs.tabPublics") },
    { id: "offers", label: t("entreprises.programs.tabOffre") },
    { id: "themes", label: t("entreprises.programs.tabThematiques") },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 5000);
  }, [tabs.length]);

  useEffect(() => {
    startAutoRotate();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoRotate]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".tab-item");
    gsap.fromTo(cards, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" });
  }, [activeTab]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".prog-fade", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const switchTab = (i: number) => {
    setActiveTab(i);
    isPaused.current = true;
    setTimeout(() => { isPaused.current = false; }, 8000);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#F2EFE9]">
      <div className="section-padding px-6">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <div className="prog-fade">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {t("entreprises.programs.badge")}
              </span>
            </div>
            <h2 className="prog-fade heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-5">
              {t("entreprises.programs.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("entreprises.programs.heading2")}
</span>
            </h2>
            <p className="prog-fade text-[#2B2F36]/55 text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto">
              {t("entreprises.programs.sub")}
            </p>
          </div>

          {/* Tab buttons — iOS-style underline */}
          <div className="prog-fade flex items-center gap-6 sm:gap-8 mb-10 border-b border-[#B88A5A]/10">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => switchTab(i)}
                onMouseEnter={() => { isPaused.current = true; }}
                onMouseLeave={() => { setTimeout(() => { isPaused.current = false; }, 2000); }}
                className={`relative pb-3 text-[11px] sm:text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                  activeTab === i ? "text-[#0B1220]" : "text-[#2B2F36]/30 hover:text-[#2B2F36]/50"
                }`}
              >
                {tab.label}
                {activeTab === i && (
                  <>
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B88A5A] rounded-full" />
                    <span
                      key={activeTab}
                      className="absolute -bottom-[1px] left-0 h-[3px] bg-[#B88A5A]/60 rounded-full shadow-sm animate-progress"
                    />
                  </>
                )}
              </button>
            ))}
            {/* Auto-rotation indicator */}
            <div className="ml-auto flex items-center gap-2 text-[#2B2F36]/20">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#B88A5A]/40 animate-pulse" />
                <span className="text-[9px] tracking-[0.1em] uppercase">auto</span>
              </div>
              <div className="w-12 h-1 rounded-full bg-[#B88A5A]/8 overflow-hidden">
                <span
                  key={activeTab}
                  className="block h-full rounded-full bg-[#B88A5A]/30 animate-progress"
                />
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div ref={contentRef} className="relative min-h-[280px]">
            {/* Audiences */}
            {activeTab === 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {audiences.map((a, i) => (
                  <div key={i} className="tab-item group relative h-full">
                    <div className="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:shadow-lg h-full flex flex-col"
                      style={{ border: "1px solid rgba(184,138,90,0.12)", background: "#fff" }}
                    >
                      {/* Image area */}
                      <div className="relative h-[180px] sm:h-[200px] overflow-hidden bg-[#E8E2D9] shrink-0">
                        <Image
                          src={images[i % images.length]}
                          alt={a.title}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#F2EFE9]/60 to-transparent" />

                        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-[#0B1220] font-heading font-bold text-xs tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                        <h3 className="text-[#0B1220] font-heading font-semibold text-base sm:text-lg">{a.title}</h3>
                        <span className="inline-block mt-1.5 text-[#B88A5A] text-[10px] font-semibold tracking-[0.12em] uppercase">
                          {a.subtitle}
                        </span>
                        <p className="text-[#2B2F36]/50 text-sm leading-relaxed mt-2">{a.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Offers */}
            {activeTab === 1 && (
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                {offers.map((o, i) => (
                  <div key={i} className="tab-item group relative h-full">
                    <div className="flex items-stretch gap-0 overflow-hidden rounded-xl transition-all duration-500 group-hover:shadow-md h-full"
                      style={{ border: "1px solid rgba(184,138,90,0.10)", background: "#fff" }}
                    >
                      {/* Image side */}
                      <div className="relative w-[120px] sm:w-[140px] shrink-0 overflow-hidden">
                        <Image
                          src={o.img}
                          alt={o.title}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-[1.06]"
                          sizes="140px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/40 to-transparent" />
                        {/* Number */}
                        <span className="absolute bottom-2 left-3 text-white/50 font-heading font-bold text-lg tabular-nums leading-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Text side */}
                      <div className="flex-1 p-4 sm:p-5 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: `${o.accent}15`, color: `${o.accent}70` }}
                          >
                            {o.icon}
                          </div>
                          <span className="text-[#0B1220] font-heading font-semibold text-sm sm:text-base truncate">{o.title}</span>
                        </div>
                        <p className="text-[#2B2F36]/50 text-xs sm:text-sm leading-relaxed">{o.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Themes */}
            {activeTab === 2 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {themes.map((th, i) => (
                  <div key={i} className="tab-item group relative h-full">
                    <div className="relative h-full rounded-xl overflow-hidden transition-all duration-500 group-hover:shadow-lg flex flex-col"
                      style={{ background: "#F2EFE9", border: "1px solid rgba(184,138,90,0.12)" }}
                    >
                      {/* Decorative top section with accent */}
                      <div className="relative h-20 sm:h-24 shrink-0 overflow-hidden">
                        {/* Background image */}
                        <Image
                          src={images[i % images.length]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                        {/* Gradient overlay on image */}
                        <div className="absolute inset-0"
                          style={{ background: `linear-gradient(135deg, ${accentColors[i]}40, ${accentColors[i]}20)` }}
                        />
                        {/* Large number watermark */}
                        <span className="absolute -top-2 -right-1 font-heading font-bold text-7xl sm:text-8xl leading-none select-none pointer-events-none text-white/10">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Small decorative circle */}
                        <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full"
                            style={{ background: `${accentColors[i]}60` }}
                          />
                          <span className="font-heading font-bold text-[10px] tabular-nums text-white/60">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Diagonal accent line */}
                        <div className="absolute top-0 right-0 w-24 h-px opacity-40"
                          style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3))`, transform: "rotate(-45deg) translateY(12px)" }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-center">
                        <h3 className="text-[#0B1220] font-heading font-semibold text-sm sm:text-base">{th.title}</h3>
                        <p className="text-[#2B2F36]/50 text-sm leading-relaxed mt-2">{th.desc}</p>
                      </div>

                      {/* Bottom accent bar */}
                      <div className="mx-5 mb-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(90deg, transparent, ${accentColors[i]}30, transparent)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Partners marquee */}
      <div className="py-14 sm:py-16 px-6 relative overflow-hidden border-t border-[#B88A5A]/5">
        <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none overflow-hidden opacity-[0.1]">
          <Image
            src="/images/wellness-stretch.jpg"
            alt=""
            fill
            className="object-cover object-right brightness-[0.7] saturate-[0.6]"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F2EFE9]/60 to-[#F2EFE9]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(184,138,90,0.06) 100%)" }} />
        </div>
        <div className="max-w-7xl mx-auto mb-8">
          <div className="prog-fade text-center">
            <span className="inline-flex items-center gap-3 text-[#B88A5A]/50 text-[10px] font-semibold tracking-[0.2em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/20" />
              {t("entreprises.programs.ilsNousFontConfiance")}
              <span className="w-6 h-px bg-[#B88A5A]/20" />
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-[#F2EFE9] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-[#F2EFE9] to-transparent" />

          <div className="flex whitespace-nowrap animate-marquee mb-3 gap-3">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="inline-flex h-12 md:h-14 items-center gap-2 md:gap-3 px-4 md:px-6 rounded-xl border border-[#B88A5A]/8 bg-white/60">
                <div className={`w-1 h-5 md:w-1.5 md:h-6 rounded-full bg-gradient-to-b ${p.color} opacity-60 shrink-0`} />
                <span className="text-[#0B1220]/40 font-heading font-semibold text-xs md:text-sm whitespace-nowrap">{p.name}</span>
              </div>
            ))}
          </div>

          <div className="flex whitespace-nowrap animate-marquee-reverse gap-3">
            {[...partners, ...partners].reverse().map((p, i) => (
              <div key={i} className="inline-flex h-12 md:h-14 items-center gap-2 md:gap-3 px-4 md:px-6 rounded-xl border border-[#B88A5A]/8 bg-white/60">
                <div className={`w-1 h-5 md:w-1.5 md:h-6 rounded-full bg-gradient-to-b ${p.color} opacity-60 shrink-0`} />
                <span className="text-[#0B1220]/40 font-heading font-semibold text-xs md:text-sm whitespace-nowrap">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
