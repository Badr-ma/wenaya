"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

const segmentImages = [
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
];

const partnerColors = ["from-emerald-600 to-emerald-800", "from-red-600 to-red-800", "from-blue-600 to-indigo-700", "from-cyan-600 to-teal-700", "from-yellow-600 to-orange-700", "from-gray-700 to-gray-900"];

export default function EntreprisesPrograms(): React.JSX.Element {
  const { t, tRaw } = useLocale();

  const audiences = tRaw<Array<{ title: string; subtitle: string; desc: string }>>("entreprises.programs.audiences");
  const partners = (tRaw<string[]>("entreprises.programs.partners")).map((name, i) => ({ name, color: partnerColors[i] }));

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".seg-title", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".seg-row", { opacity: 0, x: (i) => (i % 2 === 0 ? -30 : 30) }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: ".seg-list", start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".marquee-track", { opacity: 0 }, {
        opacity: 1, duration: 0.6,
        scrollTrigger: { trigger: ".marquee-section", start: "top 85%", toggleActions: "play none none none" },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9]">
      {/* ── Segment rows — alternating image float ── */}
      <div className="section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="seg-title inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/40" />
              {t("entreprises.programs.tabPublics")}
              <span className="w-6 h-px bg-[#B88A5A]/40" />
            </p>
            <h2 className="seg-title heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-5">
              {t("entreprises.programs.heading1")}{" "}
              <span style={{ background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("entreprises.programs.heading2")}
              </span>
            </h2>
            <p className="seg-title text-[#2B2F36]/55 text-base leading-relaxed mt-4 max-w-lg mx-auto">
              {t("entreprises.programs.sub")}
            </p>
          </div>

          <div className="seg-list space-y-8 sm:space-y-12">
            {audiences.map((a, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="seg-row relative grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
                  {/* Image — floats left or right */}
                  <div className={`relative h-[240px] sm:h-[300px] rounded-2xl overflow-hidden ${isLeft ? "sm:order-1" : "sm:order-2"}`}>
                    <Image
                      src={segmentImages[i]}
                      alt={a.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F2EFE9]/60 to-transparent" />
                    <div className={`absolute top-4 ${isLeft ? "left-4" : "right-4"}`}>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-[#0B1220] font-heading font-bold text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={`${isLeft ? "sm:order-2 sm:pl-4" : "sm:order-1 sm:pr-4"}`}>
                    <span className="text-[#B88A5A]/40 font-heading font-bold text-5xl sm:text-6xl leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[#0B1220] heading-serif font-semibold text-2xl sm:text-3xl mt-2">{a.title}</h3>
                    <span className="inline-block mt-1.5 text-[#B88A5A] text-xs font-semibold tracking-[0.12em] uppercase">{a.subtitle}</span>
                    <p className="text-[#2B2F36]/55 text-base leading-relaxed mt-4">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Trust / Accreditation — infinite marquee ── */}
      <div className="marquee-section section-padding px-6 pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="relative border-t border-[#B88A5A]/8 pt-8 sm:pt-10">
            <p className="text-center mb-6">
              <span className="inline-flex items-center gap-3 text-[#B88A5A]/40 text-[10px] font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/15" />
                {t("entreprises.programs.ilsNousFontConfiance")}
                <span className="w-6 h-px bg-[#B88A5A]/15" />
              </span>
            </p>

            <div className="marquee-track relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none bg-gradient-to-r from-[#F2EFE9] to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none bg-gradient-to-l from-[#F2EFE9] to-transparent" />

              <div className="flex whitespace-nowrap animate-marquee gap-4">
                {[...partners, ...partners, ...partners].map((p, i) => (
                  <div key={i} className="inline-flex h-11 sm:h-12 items-center gap-2 sm:gap-3 px-4 sm:px-5 border border-[#B88A5A]/6 bg-white/30 rounded-full">
                    <div className={`w-1 h-4 sm:w-1.5 sm:h-5 rounded-full bg-gradient-to-b ${p.color} opacity-50 shrink-0`} />
                    <span className="text-[#0B1220]/70 font-heading font-semibold text-sm whitespace-nowrap">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
