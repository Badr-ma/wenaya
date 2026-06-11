"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function WhyWeExist() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo("#wwe-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      gsap.fromTo("#wwe-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 83%", toggleActions: "play none none none" } });
      gsap.fromTo("#wwe-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" } });
      gsap.fromTo("#wwe-image", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" } });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="bg-[#F2EFE9] py-28 sm:py-36 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center">
          <div className="max-w-xl">
            <div id="wwe-badge">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                Notre Mission
              </span>
            </div>

            <h2 id="wwe-title" className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold text-[#0B1220] leading-[1.08] tracking-tight mt-5">
              Votre santé, notre priorité
            </h2>

            <div id="wwe-text" className="mt-8 space-y-5 text-[#2B2F36] text-sm sm:text-base leading-relaxed">
              <p>
                Chez Wenaya, notre mission est d&apos;accompagner chaque individu dans son chemin vers une santé optimale et un bien-être global. Guidés par cette vision, nous avons créé un refuge où les expertises paramédicales et les thérapies alternatives se rejoignent, offrant des solutions personnalisées en complément de la médecine conventionnelle.
              </p>
              <p>
                Nous croyons fermement en l&apos;importance de l&apos;intégration holistique des soins de santé, reconnaissant que chaque personne est unique et mérite une approche individualisée. Notre équipe dévouée travaille main dans la main avec vous, vous encourageant à devenir responsable de votre santé.
              </p>
              <p className="text-[#0B1220] font-medium">
                Trop souvent, les symptômes sont traités sans tenir compte de leurs causes sous-jacentes. Nous croyons que chaque individu doit être considéré dans sa globalité — car le corps, l&apos;esprit et l&apos;âme sont intrinsèquement liés. Wenaya est né pour prendre en compte tous les plans de l&apos;être.
              </p>
            </div>
          </div>

          <div id="wwe-image" className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 lg:ml-auto rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=85&auto=format&fit=crop"
                alt="Consultation personnalisée chez Wenaya"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/[0.04]" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#B88A5A]/8 blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
