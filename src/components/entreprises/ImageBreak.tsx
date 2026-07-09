"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

export default function ImageBreak(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0 }, {
        opacity: 1, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[50vh] sm:h-[60vh] overflow-hidden bg-[#0B1220]">
      <Image
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=3840&q=100"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/60 via-[#0B1220]/30 to-[#0B1220]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-xl px-6">
          <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">Wenaya</span>
          <p className="text-white/60 text-sm mt-3 italic" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}>
            {t("entreprises.imageBreak.quote")}
          </p>
        </div>
      </div>
    </section>
  );
}

