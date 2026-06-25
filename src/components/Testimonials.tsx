"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const images = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=600&fit=crop",
];

export default function VideoTestimonials(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const memberKeys = ["member1", "member2", "member3", "member4", "member5"];
  const team = memberKeys.map((key, i) => ({
    name: t(`testimonials.${key}.name`),
    role: t(`testimonials.${key}.role`),
    image: images[i],
  }));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });

      tl.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
        .fromTo(ornamentRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out", transformOrigin: "center" }, "-=0.4");

      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      cards.forEach((card, i) => {
        const img = card.querySelector(".tm-img") as HTMLElement;
        const overlay = card.querySelector(".tm-overlay") as HTMLElement;
        const btn = card.querySelector(".tm-btn") as HTMLElement;
        const text = card.querySelector(".tm-text") as HTMLElement;
        gsap.timeline({ scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" }, delay: i * 0.06 })
          .fromTo(img, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" })
          .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.25")
          .fromTo(btn, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, "-=0.15")
          .fromTo(text, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "-=0.1");
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => { cardsRef.current[i] = el; };

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] noise py-12 sm:py-24 px-6 overflow-hidden" id="equipe">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/20 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto relative">
        <div ref={headingRef} className="text-center mb-6">
          <span className="text-[#B88A5A] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase">
            {t("testimonials.badge")}
          </span>
          <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#0B1220] mt-4">
            {t("testimonials.heading")}
          </h2>
        </div>

        <div ref={ornamentRef} className="flex items-center justify-center gap-3 mb-10 sm:mb-16">
          <span className="w-8 h-px bg-[#B88A5A]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" />
          <span className="w-8 h-px bg-[#B88A5A]/40" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {team.map((member, i) => (
            <div
              key={i}
              ref={setCardRef(i)}
              className="group relative overflow-hidden rounded-[18px] bg-[#0B1220] cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-[#0B1220]/20 hover:-translate-y-0.5"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={400}
                height={600}
                referrerPolicy="no-referrer"
                className="tm-img absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] group-hover:scale-105"
                style={{ opacity: 0, transform: "scale(1.15)" }}
                unoptimized
              />

              <div className="tm-overlay absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/20 to-[#0B1220]/10" style={{ opacity: 0 }} />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/10 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="tm-btn relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={{ opacity: 0 }}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 7.142-7.5 11.25-7.5 11.25S4.5 19.142 4.5 12a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="tm-text absolute bottom-0 left-0 right-0 p-5 sm:p-6" style={{ opacity: 0 }}>
                <div className="w-6 h-px bg-[#B88A5A]/60 mb-3" />
                <p className="text-white text-sm sm:text-base font-medium leading-tight">{member.name}</p>
                <p className="text-white/45 text-xs mt-1 font-sans tracking-wide">{member.role}</p>
              </div>

              <div
                className="absolute inset-0 rounded-[18px] transition-all duration-500 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 h-[50px] bg-[#B88A5A] text-white rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#A07848] hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
          >
            {t("testimonials.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
