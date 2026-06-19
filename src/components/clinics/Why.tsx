"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    num: "01",
    title: "Différenciation",
    desc: "Positionnez votre clinique comme un établissement de référence en santé préventive et intégrée au Maroc.",
    decoration: "#159AA9",
  },
  {
    num: "02",
    title: "Fidélisation",
    desc: "Offrez un suivi continu entre les consultations — vos patients restent engagés et connectés à votre clinique.",
    decoration: "#B88A5A",
  },
  {
    num: "03",
    title: "Efficacité",
    desc: "Automatisez le suivi préventif et libérez du temps médical grâce à nos outils d'orchestration intelligents.",
    decoration: "#159AA9",
  },
  {
    num: "04",
    title: "Croissance",
    desc: "Attirez une nouvelle patientèle sensible à la prévention et au bien-être, avec des programmes innovants.",
    decoration: "#B88A5A",
  },
];

export default function ClinicsWhy(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cw-item",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-20 sm:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, #0B1220 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
              Pourquoi Wenaya
            </span>
          </div>
          <h2 className="text-[#0B1220] font-heading"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)", fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.015em" }}
          >
            Une clinique qui anticipe,<br />
            <span className="italic text-[#B88A5A]">c&apos;est une clinique qui grandit.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {reasons.map((r, i) => (
            <div key={i} className="cw-item flex gap-6">
              <span className="font-heading font-black text-[3rem] sm:text-[4rem] leading-none tracking-tight"
                style={{ color: `${r.decoration}15` }}
              >
                {r.num}
              </span>
              <div className="pt-1">
                <h3 className="text-[#0B1220] font-heading font-semibold text-lg mb-2">{r.title}</h3>
                <p className="text-[#2B2F36]/55 text-sm leading-relaxed max-w-sm">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cw-item mt-16 pt-8 border-t border-[#0B1220]/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-[#2B2F36]/45 text-sm max-w-md">
            Rejoignez les 15+ cliniques qui utilisent déjà Wenaya pour transformer leur approche de la santé.
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-[#159AA9] text-sm font-semibold hover:gap-3 transition-all duration-300">
            Demander une démo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
