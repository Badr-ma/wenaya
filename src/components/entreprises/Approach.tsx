"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

export default function EntreprisesApproach(): React.JSX.Element {
  const { tRaw } = useLocale();

  const featured = tRaw<{ title: string; stat: string; desc: string; longDesc: string; link: string }>("entreprises.approach.featuredCallout");
  const valueProps = tRaw<Array<{ title: string; desc: string; stat: string }>>("entreprises.approach.valueProps");
  const stats = tRaw<Array<{ number: string; label: string }>>("entreprises.approach.stats");
  const comparison = tRaw<{ heading: string; sub: string; without: Array<{ label: string; desc: string }>; with: Array<{ label: string; desc: string }> }>("entreprises.approach.comparison");

  const sectionRef = useRef<HTMLElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".reveal", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });

      gsap.fromTo(".vp-row", { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".vp-list", start: "top 85%", toggleActions: "play none none none" },
      });

      statRefs.current.forEach((ref) => {
        if (!ref) return;
        gsap.fromTo(ref, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
          scrollTrigger: { trigger: ref, start: "top 90%", toggleActions: "play none none none" },
        });
      });

      gsap.fromTo(".comp-half", { opacity: 0 }, {
        opacity: 1, duration: 0.6, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: ".comp-section", start: "top 85%", toggleActions: "play none none none" },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9]">
      {/* ── Featured callout — draft explanation ── */}
      <div className="section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-3 flex items-center">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#0B1220] heading-serif text-3xl sm:text-4xl tracking-tight">{featured.title}</span>
                    <span className="text-[#B88A5A] font-heading font-bold text-lg sm:text-xl tracking-tight whitespace-nowrap">{featured.stat}</span>
                  </div>
                  <p className="text-[#2B2F36]/55 text-base sm:text-lg leading-relaxed">
                    {featured.longDesc}
                  </p>
                  <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1.5 mt-5 text-[#B88A5A] hover:text-[#9A7242] text-xs font-semibold tracking-[0.12em] uppercase transition-colors">
                    {featured.link}
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="lg:col-span-2 rounded-2xl bg-[#0B1220] p-6 sm:p-8">
                <p className="text-white/40 text-xs font-semibold tracking-[0.15em] uppercase mb-6">Impact sur l&apos;absentéisme</p>
                <svg viewBox="0 0 280 200" className="w-full h-auto" fill="none">
                  <line x1="60" y1="24" x2="60" y2="168" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <text x="52" y="20" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="var(--font-nunito), system-ui">%</text>
                  <line x1="60" y1="48" x2="250" y2="48" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="60" y1="84" x2="250" y2="84" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="60" y1="120" x2="250" y2="120" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="60" y1="156" x2="250" y2="156" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <text x="52" y="52" textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize="9">10</text>
                  <text x="52" y="88" textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize="9">7.5</text>
                  <text x="52" y="124" textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize="9">5</text>
                  <text x="52" y="160" textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize="9">2.5</text>
                  <rect x="100" y="52" width="36" height="116" rx="3" fill="rgba(255,255,255,0.04)" />
                  <rect x="100" y="52" width="36" height="116" rx="3" fill="url(#bar-before)" opacity="0.3" />
                  <rect x="160" y="99" width="36" height="69" rx="3" fill="url(#bar-after)" />
                  <text x="118" y="184" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="var(--font-nunito), system-ui">Avant</text>
                  <text x="178" y="184" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="var(--font-nunito), system-ui">Après</text>
                  <text x="118" y="46" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="var(--font-cormorant), Georgia, serif" fontWeight="600">8.2%</text>
                  <text x="178" y="93" textAnchor="middle" fill="#B88A5A" fontSize="11" fontFamily="var(--font-cormorant), Georgia, serif" fontWeight="600">4.9%</text>
                  <line x1="136" y1="65" x2="160" y2="108" stroke="#B88A5A" strokeWidth="1.5" opacity="0.5" />
                  <rect x="92" y="8" width="112" height="22" rx="11" fill="rgba(184,138,90,0.12)" />
                  <text x="148" y="23" textAnchor="middle" fill="#B88A5A" fontSize="10" fontFamily="var(--font-nunito), system-ui" fontWeight="700">−40% d&apos;absentéisme</text>
                  <defs>
                    <linearGradient id="bar-before" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                    </linearGradient>
                    <linearGradient id="bar-after" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B88A5A" />
                      <stop offset="100%" stopColor="#9A7242" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Value props — editorial list ── */}
      <div className="section-padding px-6 pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="vp-list divide-y divide-[#B88A5A]/8">
            {valueProps.map((vp, i) => (
              <div key={i} className="vp-row flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 sm:py-10">
                <div className="flex items-start gap-6 sm:gap-10 w-full sm:w-auto">
                  <span className="text-[#B88A5A]/20 font-heading font-bold text-3xl sm:text-4xl leading-none tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[#0B1220] heading-serif font-semibold text-xl sm:text-2xl">{vp.title}</h3>
                    <p className="text-[#2B2F36]/55 text-base leading-relaxed mt-1.5 max-w-lg">{vp.desc}</p>
                  </div>
                </div>
                <span className="text-[#B88A5A] font-heading font-bold text-base sm:text-lg whitespace-nowrap ml-[3.25rem] sm:ml-0">
                  {vp.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats bar — floating constellation ── */}
      <div className="relative bg-[#0B1220] py-14 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, #B88A5A 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex flex-wrap justify-center gap-x-16 sm:gap-x-24 gap-y-10">
            {stats.map((s, i) => {
              const offsets = ["translateY(0)", "translateY(-8px)", "translateY(4px)", "translateY(-12px)"];
              return (
                <div
                  key={i}
                  ref={(el) => { statRefs.current[i] = el; }}
                  className="text-center"
                  style={{ transform: offsets[i] }}
                >
                  <p className="text-white font-heading font-bold tracking-tight leading-none" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}>
                    {s.number}
                  </p>
                  <p className="text-white/70 text-sm mt-2">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Comparison — split diptych ── */}
      <div className="comp-section section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="reveal inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/40" />
              {comparison.heading}
              <span className="w-6 h-px bg-[#B88A5A]/40" />
            </p>
            <p className="reveal text-graphite text-base leading-relaxed mt-3 max-w-md mx-auto">{comparison.sub}</p>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden">
            {/* Without — dimmed, translucent */}
            <div className="comp-half relative bg-[#0B1220] p-8 sm:p-10 lg:p-12">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #B88A5A 0%, transparent 60%)" }} />
              <h3 className="relative text-white/60 font-heading font-semibold text-sm tracking-[0.15em] uppercase mb-8">Sans Wenaya</h3>
              <div className="relative space-y-7">
                {comparison.without.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-white/15 text-xl leading-none shrink-0 mt-0.5">✕</span>
                    <div>
                      <p className="text-white/70 font-heading font-semibold text-sm">{item.label}</p>
                      <p className="text-white/50 text-sm leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* With — bronze glow */}
            <div className="comp-half relative bg-gradient-to-br from-[#1A1118] to-[#0B1220] p-8 sm:p-10 lg:p-12 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #B88A5A 0%, transparent 70%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(184,138,90,0.03) 0%, transparent 50%)" }} />
              <h3 className="relative text-[#B88A5A] font-heading font-semibold text-sm tracking-[0.15em] uppercase mb-8">Avec Wenaya</h3>
              <div className="relative space-y-7">
                {comparison.with.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-[#B88A5A] text-xl leading-none shrink-0 mt-0.5">✓</span>
                    <div>
                      <p className="text-white font-heading font-semibold text-sm">{item.label}</p>
                      <p className="text-white/60 text-sm leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider line between halves */}
              <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-[#B88A5A]/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
