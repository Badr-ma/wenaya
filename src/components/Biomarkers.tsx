"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function Biomarkers() {
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
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0B1220] py-24 sm:py-32 px-6" id="univers">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-[#159AA9] font-semibold text-sm tracking-widest uppercase">
            Prévenir &bull; Performer &bull; Récupérer &bull; Équilibrer &bull; Durer
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold text-white mt-4 tracking-[-0.03em]">
            Cinq univers, une santé.
          </h2>
          <p className="text-white/40 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Notre approche couvre l&apos;ensemble du spectre de la santé proactive.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {univers.map((u, i) => (
            <div
              key={u.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.06] hover:border-[#159AA9]/30 group"
            >
              <div className="text-[#159AA9] group-hover:text-white transition-colors duration-300">
                {u.icon}
              </div>
              <h3 className="font-heading font-bold text-white text-lg mt-5 tracking-[-0.02em]">
                {u.name}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mt-2">
                {u.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
