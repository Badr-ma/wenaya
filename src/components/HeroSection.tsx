"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import HiggsField from "./HiggsField";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        .fromTo(headingRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(buttonsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo(searchRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
        .fromTo(statsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.1");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/forest.mp4" type="video/mp4" />
      </video>

      <HiggsField />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.05] tracking-tight max-w-3xl"
        >
          Soigner.
          <br />
          <span className="text-[#B88A5A]">Prévenir.</span>
          <br />
          Prolonger.
        </h1>

        <p
          ref={subRef}
          className="text-white/80 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
        >
          Enfants &mdash; Adultes &mdash; Seniors &mdash; Toutes les générations
        </p>

        <p className="text-white/60 text-sm mt-2 max-w-xl">
          Centre pluridisciplinaire à Casablanca : kinésithérapie, ostéopathie, psychologie, nutrition, orthophonie et thérapies complémentaires pour toute la famille.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
        >
          <a
            href="#"
            className="bg-[#B88A5A] hover:bg-[#A07848] text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-[rgba(184,138,90,0.3)]"
          >
            Réservez maintenant
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
          <a
            href="#"
            className="text-white/70 hover:text-white text-sm font-medium px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            Découvrir les pratiques
          </a>
        </div>

        <div
          ref={searchRef}
          className="w-full max-w-2xl mx-auto mt-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch gap-2"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <svg className="w-4 h-4 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <select className="w-full bg-transparent text-white text-sm outline-none appearance-none py-2 [&>option]:text-black">
              <option value="">Spécialité</option>
              <option value="kine">Kinésithérapie</option>
              <option value="osteo">Ostéopathie</option>
              <option value="psychologie">Psychologie</option>
              <option value="neuropsychologie">Neuropsychologie</option>
              <option value="nutrition">Nutrition</option>
              <option value="orthophonie">Orthophonie</option>
              <option value="naturopathie">Naturopathie</option>
              <option value="psychomotricite">Psychomotricité</option>
              <option value="therapies">Thérapies Complémentaires</option>
            </select>
          </div>
          <div className="w-px bg-white/10 hidden sm:block" />
          <div className="flex-1 flex items-center gap-2 px-3">
            <svg className="w-4 h-4 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <select className="w-full bg-transparent text-white text-sm outline-none appearance-none py-2 [&>option]:text-black">
              <option value="">Ville</option>
              <option value="casablanca">Casablanca</option>
              <option value="rabat">Rabat</option>
              <option value="marrakech">Marrakech</option>
            </select>
          </div>
          <button className="bg-[#B88A5A] hover:bg-[#A07848] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap">
            Rechercher
          </button>
        </div>
      </div>

      <div
        ref={statsRef}
        className="relative z-10 mt-14 w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 border-t border-white/10 pt-8"
      >
        <div className="text-center sm:pr-10 sm:border-r border-white/10 group">
          <div className="text-sm text-white/50">99%</div>
          <div className="text-white/70 text-xs mt-0.5">de nos utilisateurs recommandent leur praticien</div>
        </div>
        <div className="text-center sm:pl-10 group">
          <div className="text-sm text-white/50">+148</div>
          <div className="text-white/70 text-xs mt-0.5">avis Google</div>
        </div>
      </div>
    </section>
  );
}
