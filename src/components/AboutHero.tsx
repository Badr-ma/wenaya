"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("#ah-badge", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo("#ah-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.35")
        .fromTo("#ah-desc", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
        .fromTo("#ah-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo("#ah-image", { opacity: 0, scale: 0.92, x: 40 }, { opacity: 1, scale: 1, x: 0, duration: 1.1 }, "-=0.5");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] min-h-screen flex items-center px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#159AA9]/4 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/12 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          <div className="max-w-xl z-10">
            <div id="ah-badge">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                Qui sommes nous
              </span>
            </div>

            <h1 id="ah-title" className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-bold text-white leading-[1.06] tracking-tight mt-6">
              Soigner. Prévenir.{" "}
              <span className="text-[#B88A5A]">Prolonger.</span>
            </h1>

            <p id="ah-desc" className="text-white/45 text-base sm:text-lg leading-relaxed mt-6 max-w-lg">
              Wenaya, c&apos;est un écosystème de santé intégrée qui réunit des spécialistes en kinésithérapie, ostéopathie, psychologie, nutrition et thérapies complémentaires — pour un accompagnement global et personnalisé.
            </p>

            <div id="ah-cta" className="mt-10">
              <a href="#story" className="group inline-flex items-center gap-3 text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:text-[#B88A5A]">
                <span className="w-10 h-px bg-white/30 group-hover:w-14 transition-all duration-300 group-hover:bg-[#B88A5A]" />
                Découvrir notre histoire
              </a>
            </div>
          </div>

          <div id="ah-image" className="relative">
            <div className="relative aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src="/images/about/about-hero.png"
                alt="Wenaya centre de santé"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#B88A5A]/5 blur-2xl" />
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-[#159AA9]/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
