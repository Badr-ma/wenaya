/**
 * Why We Exist — mission statement section for the about page.
 * Two-column layout: text explaining Wenaya's founding mission on left,
 * clinic/team image on right. GSAP scroll-triggered animations.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

export default function WhyWeExist(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo("#wwe-title, #wwe-text, #wwe-image", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="bg-[#F2EFE9] py-20 sm:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center">
          <div className="max-w-xl">
            <div id="wwe-badge">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {t("whyWeExist.badge")}
              </span>
            </div>

            <h2 id="wwe-title" className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-5">
              {t("whyWeExist.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("whyWeExist.heading2")}
</span>
            </h2>

            <div id="wwe-text" className="mt-8 space-y-5 text-[#2B2F36] text-sm sm:text-base leading-relaxed">
              <p>{t("whyWeExist.p1")}</p>
              <p>{t("whyWeExist.p2")}</p>
              <p className="text-[#0B1220] font-medium">{t("whyWeExist.p3")}</p>
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
