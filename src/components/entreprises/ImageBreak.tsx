/**
 * Image Break — full-width parallax image break. Stronger crop/parallax on
 * the photograph, with a clean editorial quote overlay (no glass card).
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export default function ImageBreak(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ib-quote", { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
      if (imgRef.current) {
        gsap.fromTo(imgRef.current, { yPercent: -7, scale: 1.16 }, {
          yPercent: 7, scale: 1, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[56vh] sm:h-[64vh] overflow-hidden bg-[#0B1220]">
      <div ref={imgRef} className="absolute inset-x-0 -inset-y-[12%] will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=3840&q=100"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-[#0B1220]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/45 via-transparent to-[#0B1220]/15" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="ib-quote text-center max-w-3xl px-6">
          <span className="mx-auto block w-12 h-px bg-[#B88A5A]/70 mb-7" />
          <p
            className="text-white/95 text-2xl sm:text-3xl lg:text-[2.75rem] leading-snug italic"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}
          >
            {t("entreprises.imageBreak.quote")}
          </p>
          <span className="mx-auto block w-12 h-px bg-[#B88A5A]/70 mt-7" />
        </div>
      </div>
    </section>
  );
}
