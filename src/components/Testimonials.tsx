"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: "Dr. Amal Benali",
    role: "Médecin généraliste — Santé préventive & bilans complets",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop",
  },
  {
    name: "Sarah El Fassi",
    role: "Kinésithérapeute — Rééducation fonctionnelle & TECAR",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=600&fit=crop",
  },
  {
    name: "Khalid Ouazzani",
    role: "Ostéopathe — Douleurs musculo-squelettiques & troubles fonctionnels",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop",
  },
  {
    name: "Nadia Tazi",
    role: "Psychologue clinicienne — TCC & gestion du stress",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop",
  },
  {
    name: "Yassine El Amrani",
    role: "Nutritionniste — Rééquilibrage alimentaire & suivi métabolique",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=600&fit=crop",
  },
];

export default function VideoTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => { cardsRef.current[i] = el; };

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] noise py-28 sm:py-36 px-6 overflow-hidden" id="equipe">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/20 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto relative">
        <div ref={headingRef} className="text-center mb-6">
          <span className="text-[#B88A5A] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase">
            Une équipe de 15 professionnels de santé à Casablanca
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-serif font-bold text-[#0B1220] mt-4 leading-[1.1] tracking-tight">
            Des spécialistes pluridisciplinaires à votre écoute
          </h2>
        </div>

        <div ref={ornamentRef} className="flex items-center justify-center gap-3 mb-16">
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
              <img
                src={member.image}
                alt={member.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/20 to-[#0B1220]/10" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/10 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B1220]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 7.142-7.5 11.25-7.5 11.25S4.5 19.142 4.5 12a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
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
            Découvrir plus
          </a>
        </div>
      </div>
    </section>
  );
}
