"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const univers = [
  {
    name: "Prevent",
    subtitle: "La prévention comme priorité quotidienne.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" />
        <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Perform",
    subtitle: "La performance physique et mentale, au juste niveau.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M8 40V28l8-4 8 8 8-16 8 8v16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Recover",
    subtitle: "Récupérer, régénérer, repartir.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M24 8v16l8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: "Balance",
    subtitle: "Équilibrer le système nerveux et l'esprit.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1" />
        <path d="M24 16v8l5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  {
    name: "Longevity",
    subtitle: "Allonger les années en bonne santé.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M24 8c-8 0-16 6-16 16s8 16 16 16 16-6 16-16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M24 18v8l6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 8v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Biomarkers(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.fromTo(
        [headingRef.current, ...cards],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-16 sm:py-20 px-6" id="univers">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            Prévenir · Performer · Récupérer · Équilibrer · Durer
          </span>
          <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-4">
            Cinq univers, une santé.
          </h2>
          <p className="text-[#2B2F36]/60 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Notre approche couvre l&apos;ensemble du spectre de la santé proactive.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {univers.map((u, i) => (
            <div
              key={u.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-white border border-[#0B1220]/[0.04] rounded-2xl p-8 sm:p-10 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(184,138,90,0.06)] hover:border-[#B88A5A]/30 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B1220]/[0.02] border border-[#0B1220]/[0.04] flex items-center justify-center text-[#B88A5A] group-hover:border-[#B88A5A]/30 group-hover:bg-[#B88A5A]/5 transition-all duration-300">
                {u.icon}
              </div>
              <h3 className="font-heading font-bold text-[#0B1220] text-lg mt-6">
                {u.name}
              </h3>
              <p className="text-[#2B2F36]/60 text-sm leading-relaxed mt-2">
                {u.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
