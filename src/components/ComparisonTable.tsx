"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const entries = [
  {
    title: "Clinics",
    desc: "Des centres dédiés à votre prévention, votre performance et votre récupération.",
    cta: "Découvrir la clinique",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <rect x="10" y="14" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="1" />
        <path d="M22 24v8M18 28h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 14V10a2 2 0 012-2h12a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    stats: "1 centre · 35 thérapeutes · 9 disciplines",
    featured: true,
  },
  {
    title: "Corporate",
    desc: "Des programmes de santé proactive pour vos équipes.",
    cta: "Découvrir Corporate",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <rect x="8" y="22" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1" />
        <rect x="16" y="10" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
        <path d="M20 30h8M20 34h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    stats: "Audit gratuit · Programmes sur mesure · Suivi RH",
  },
  {
    title: "Hospitality",
    desc: "Des expériences de récupération et de longévité, intégrées aux lieux d'hospitalité premium.",
    cta: "Bientôt disponible",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M8 40V14l16-8 16 8v26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="26" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1" />
        <path d="M14 40h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    stats: "Hôtels · Resorts · Retreats premium",
    soon: true,
  },
];

export default function ComparisonTable(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-16 sm:py-20 px-6" id="ecosysteme">
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            Clinics · Corporate · Hospitality
          </span>
          <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-4">
            L&apos;écosystème Wenaya.
          </h2>
          <p className="text-[#2B2F36] text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Trois portes d&apos;entrée. Une seule promesse.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {entries.map((e, i) => (
            <div
              key={e.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`bg-[#E8E2D9] rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                e.featured
                  ? "border-[#B88A5A] shadow-lg shadow-[rgba(184,138,90,0.06)]"
                  : "border-[#0B1220]/[0.06] hover:border-[#B88A5A]/30 hover:shadow-lg"
              }`}
            >
              <div className={`mb-5 ${e.featured ? "text-[#B88A5A]" : "text-[#B88A5A]"}`}>
                {e.icon}
              </div>
              <h3 className="heading-serif text-xl text-[#0B1220] mb-2">
                {e.title}
              </h3>
              <p className="text-[#2B2F36] text-sm leading-relaxed flex-1">
                {e.desc}
              </p>
              <p className="text-[#B88A5A] text-xs mt-4 font-medium">
                {e.stats}
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`mt-6 inline-flex items-center justify-center h-[44px] px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                  e.soon
                    ? "bg-[#0B1220]/5 text-[#2B2F36] cursor-default"
                    : "bg-[#0B1220] text-white hover:bg-[#2B2F36]"
                }`}
              >
                {e.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
