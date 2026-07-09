"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

function scrollToContact() {
  const el = document.querySelector("[data-contact]");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function EntreprisesCta(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [nlSubmitted, setNlSubmitted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cta-line").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 14 }, {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0B1220] min-h-[70vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2400&q=100"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0B1220]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-transparent to-[#0B1220]/30" />
      </div>

      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="cta-line mb-8">
            <svg className="w-8 h-8 mx-auto mb-6" viewBox="0 0 32 32" fill="none" style={{ color: "rgba(184,138,90,0.25)" }}>
              <path d="M9.333 20c0-2.667 1.334-5.333 4-8L16 8l1.333 1.333C15.111 11.556 14 13.778 14 16v4H9.333zM20 20c0-2.667 1.333-5.333 4-8L26.667 8 28 9.333c-2.222 2.223-3.333 4.445-3.333 6.667V20H20z" fill="currentColor" />
            </svg>
            <blockquote className="text-white/50 italic text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {t("entreprises.cta.quote")}
            </blockquote>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="w-6 h-px bg-[#B88A5A]/20" />
              <span className="text-white/40 text-xs font-medium tracking-[0.15em] uppercase">{t("entreprises.cta.quoteAttr")}</span>
              <span className="w-6 h-px bg-[#B88A5A]/20" />
            </div>
          </div>

          <h2 className="cta-line text-white font-serif font-medium leading-[1.06] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
          >
            {t("entreprises.cta.finalHeading")}
          </h2>

          <p className="cta-line text-white/50 text-base leading-relaxed mt-5 max-w-md mx-auto">
            {t("entreprises.cta.finalSub")}
          </p>

          <div className="cta-line flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <a
              href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 28px rgba(184,138,90,0.35)",
              }}
            >
              {t("entreprises.cta.cta1")}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToContact(); }}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-white/35 text-sm font-medium border border-white/[0.08] transition-all duration-300 hover:text-white hover:border-white/[0.16]"
            >
              {t("entreprises.cta.cta2")}
            </a>
          </div>

          <p className="cta-line text-white/30 text-xs mt-16 tracking-[0.05em]">
            {t("entreprises.cta.contact")}
          </p>
        </div>
      </div>
    </section>
  );
}
