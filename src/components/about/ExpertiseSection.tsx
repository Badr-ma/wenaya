"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

const collageImages = [
  { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80&auto=format&fit=crop", alt: "Séance de kinésithérapie" },
  { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80&auto=format&fit=crop", alt: "Bien-être et méditation" },
  { src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=80&auto=format&fit=crop", alt: "Consultation nutrition" },
  { src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80&auto=format&fit=crop", alt: "Suivi psychologique" },
];

export default function ExpertiseSection(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const imgs = el.querySelectorAll(".es-img");
      gsap.fromTo("#es-title, #es-text, #es-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      gsap.fromTo(imgs, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-20 sm:py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center">
          <div className="max-w-xl">
            <div id="es-badge">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {t("expertiseSection.badge")}
              </span>
            </div>

            <h2 id="es-title" className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-5">
              {t("expertiseSection.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("expertiseSection.heading2")}
</span>
            </h2>

            <div id="es-text" className="mt-8 space-y-5 text-[#2B2F36] text-sm sm:text-base leading-relaxed">
              <p>{t("expertiseSection.p1")}</p>
              <p>{t("expertiseSection.p2")}</p>
            </div>

            <div id="es-cta" className="mt-10">
              <a href="#" onClick={(e) => e.preventDefault()} className="group inline-flex items-center gap-3 bg-[#0B1220] text-white text-sm font-semibold h-[50px] px-8 rounded-full transition-all duration-300 hover:bg-[#B88A5A] hover:shadow-lg hover:shadow-[rgba(184,138,90,0.2)]">
                {t("expertiseSection.cta")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {collageImages.map((img, i) => (
              <div key={i} className={`es-img relative aspect-[4/5] rounded-xl overflow-hidden ${i === 0 || i === 3 ? "translate-y-4" : "-translate-y-4"}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-all duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
