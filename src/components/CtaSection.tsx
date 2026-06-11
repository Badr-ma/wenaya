"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0B1220] py-24 sm:py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#159AA9]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#159AA9]/5 rounded-full blur-3xl" />

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-[#159AA9] font-semibold text-sm tracking-widest uppercase">
            Prévenir. Performer. Durer.
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold text-white mt-4 tracking-[-0.03em]">
            Commencez. Personnalisez. Durez.
          </h2>
          <p className="text-white/50 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Réservez une première évaluation pour cadrer votre parcours.
          </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <svg className="w-6 h-6 text-[#159AA9] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <h3 className="text-white font-medium text-sm mb-1">Adresse</h3>
            <p className="text-white/60 text-sm">
              88 Rue De Jabal Azourki<br />Casablanca 20930<br />Maroc
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <svg className="w-6 h-6 text-[#159AA9] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-white font-medium text-sm mb-1">Horaires</h3>
            <p className="text-white/60 text-sm">
              Lundi au Samedi : 9h00 – 19h00<br />Fermé le dimanche
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <svg className="w-6 h-6 text-[#159AA9] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <h3 className="text-white font-medium text-sm mb-1">Contact</h3>
            <p className="text-white/60 text-sm">
              Tél : +212 6 66 12 40 35<br />Email : corporate@wenaya.com<br />Réservation en ligne
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a
            href="#"
            className="bg-[#159AA9] hover:bg-[#159AA9]/80 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg"
          >
            Réserver une évaluation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#"
            className="bg-[#0B1220] border border-white/20 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-white/10"
          >
            Découvrir votre parcours
          </a>
        </div>
      </div>
    </section>
  );
}
