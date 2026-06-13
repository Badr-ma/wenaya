"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function HeroSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".hero-reveal"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <video
        autoPlay muted loop playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/forest.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/50 via-[#0B1220]/30 to-[#0B1220]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#B88A5A]/8 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center px-6 pt-24 pb-16">
        <div className="hero-reveal">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            Prévention &middot; Performance &middot; Longévité
            <span className="w-8 h-px bg-[#B88A5A]/40" />
          </span>
        </div>

        <h1 className="hero-reveal heading-serif text-[clamp(2.5rem,6vw,5rem)] text-white mt-6 max-w-4xl leading-[1.05]">
          Vous méritez de vivre en meilleure santé,
          <br />
          <span className="text-[#B88A5A]">plus longtemps.</span>
        </h1>

        <p className="hero-reveal text-white/60 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed">
          Wenaya réunit kinésithérapeutes, ostéopathes, psychologues et nutritionnistes pour vous offrir une santé préventive, personnalisée et durable — dans un seul centre à Casablanca.
        </p>

        <div className="hero-reveal flex flex-col sm:flex-row items-center gap-4 mt-10">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="bg-[#B88A5A] hover:bg-[#A07848] text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
          >
            Réserver une évaluation
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="bg-white/5 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-white/10"
          >
            Découvrir votre parcours
          </a>
        </div>

        <div className="hero-reveal mt-16 w-full max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 border-t border-white/10 pt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">1</div>
            <div className="text-white/50 text-xs mt-1">centre de soins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">35</div>
            <div className="text-white/50 text-xs mt-1">thérapeutes certifiés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">+2000</div>
            <div className="text-white/50 text-xs mt-1">patients accompagnés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4,7</div>
            <div className="text-white/50 text-xs mt-1">★ sur Google (148 avis)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
