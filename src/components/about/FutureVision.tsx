"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

export default function FutureVision(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo("#fv-content", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" } });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&q=85&auto=format&fit=crop"
          alt="Famille marchant au coucher du soleil"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/70 to-[#0B1220]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/20 to-transparent" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.03]" />
      </div>

      <div id="fv-content" className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">{t("futureVision.badge")}</span>
        <h2 className="heading-serif text-[clamp(2.2rem,4.5vw,4rem)] text-white mt-5">
          {t("futureVision.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("futureVision.heading2")}
</span>
        </h2>
        <p className="text-white/60 text-base sm:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
          {t("futureVision.desc")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <a
            href="tel:0666124035"
            className="inline-flex items-center justify-center px-8 h-[52px] bg-[#B88A5A] hover:bg-[#A07848] text-white text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
          >
            {t("futureVision.cta1")}
          </a>
          <a
            href="/pratiques"
            className="inline-flex items-center justify-center px-8 h-[52px] bg-transparent text-white/70 border border-white/20 hover:border-white/40 hover:text-white rounded-full text-sm font-medium transition-all duration-300"
          >
            {t("futureVision.cta2")}
          </a>
        </div>
      </div>
    </section>
  );
}
