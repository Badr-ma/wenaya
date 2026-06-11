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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        .fromTo(headingRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(buttonsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
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
          className="text-[clamp(2rem,5vw,4.5rem)] font-heading font-bold text-white leading-[1.08] tracking-[-0.03em] max-w-4xl"
        >
          Wenaya crée les nouveaux standards de la{" "}
          <span className="text-[#B88A5A]">prévention</span>, de la{" "}
          <span className="text-[#B88A5A]">performance</span> et de la{" "}
          <span className="text-[#B88A5A]">longévité</span>.
        </h1>

        <p
          ref={subRef}
          className="text-white/70 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
        >
          La santé du futur sera préventive, personnalisée et continue.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <a
            href="#"
            className="bg-[#0B1220] hover:bg-[#2B2F36] text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg"
          >
            Découvrir votre parcours
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
            className="bg-[#159AA9] hover:bg-[#159AA9]/80 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg"
          >
            Commencer votre évaluation
          </a>
        </div>
      </div>

      <div
        ref={statsRef}
        className="relative z-10 mt-14 w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 border-t border-white/10 pt-8"
      >
        <div className="text-center sm:pr-10 sm:border-r border-white/10">
          <div className="text-lg font-bold text-white">1 centre</div>
          <div className="text-white/50 text-xs mt-0.5">Wenaya à Casablanca</div>
        </div>
        <div className="text-center sm:px-10 sm:border-r border-white/10">
          <div className="text-lg font-bold text-white">35</div>
          <div className="text-white/50 text-xs mt-0.5">thérapeutes certifiés</div>
        </div>
        <div className="text-center sm:px-10 sm:border-r border-white/10">
          <div className="text-lg font-bold text-white">+2 000</div>
          <div className="text-white/50 text-xs mt-0.5">personnes accompagnées</div>
        </div>
        <div className="text-center sm:pl-10">
          <div className="text-lg font-bold text-white">4,7★</div>
          <div className="text-white/50 text-xs mt-0.5">sur Google (148 avis)</div>
        </div>
      </div>
    </section>
  );
}
