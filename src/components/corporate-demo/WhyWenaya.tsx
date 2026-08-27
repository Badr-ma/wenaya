"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function DemoWhyWenaya() {
  const { tRaw } = useLocale();
  const valueProps = tRaw<Array<{ title: string; desc: string; stat: string }>>("entreprises.approach.valueProps");
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    // Under reduced-motion, keep all content immediately visible (no entrance hiding).
    if (prefersReduced.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ww-eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
      gsap.from(".ww-heading", { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });

      gsap.utils.toArray<HTMLElement>(".ww-row").forEach((row) => {
        gsap.set(row.querySelector(".ww-stat"), { y: 30, opacity: 0, scale: 1.1 });
        gsap.set(row.querySelector(".ww-line"), { scaleX: 0 });
        gsap.set(row.querySelector(".ww-title"), { y: 24, opacity: 0 });
        gsap.set(row.querySelector(".ww-desc"), { y: 16, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 80%", toggleActions: "play none none none" },
        });
        tl.to(row.querySelector(".ww-stat"), { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" })
          .to(row.querySelector(".ww-line"), { scaleX: 1, duration: 0.7, ease: "power2.out" }, "-=0.3")
          .to(row.querySelector(".ww-title"), { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4")
          .to(row.querySelector(".ww-desc"), { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.3");
      });

      // Mobile: stats (35+/100%/−40%) animate with scale/opacity + divider-line draw
      if (window.innerWidth < 1024) {
        gsap.utils.toArray<HTMLElement>(".ww-row").forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 82%", toggleActions: "play none none none" },
          });
          tl.from(row.querySelector(".m-ww-stat"), { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(1.7)", immediateRender: false })
            .from(row.querySelector(".m-ww-line"), { scaleX: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, "-=0.25")
            .from(row.querySelector(".m-ww-title"), { y: 16, opacity: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, "-=0.3")
            .from(row.querySelector(".m-ww-desc"), { y: 12, opacity: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, "-=0.3");
        });
      }
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#0B1220] py-24 sm:py-32 px-6"
      data-section-bg="dark"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16 sm:mb-24">
          <span className="ww-eyebrow inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {tRaw<string>("entreprises.approach.valuePropsBadge")}
          </span>
          <h2
            className="ww-heading heading-serif text-white mt-6"
            style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 1.08 }}
            dangerouslySetInnerHTML={{
              __html: tRaw<string>("entreprises.approach.valuePropsHeading").replace(
                /<gradient>(.*?)<\/gradient>/,
                '<span class="text-transparent bg-clip-text" style="background-image: linear-gradient(135deg, #B88A5A 0%, #D4A574 100%)">$1</span>'
              ),
            }}
          />
        </div>

        {/* Bold typography rows — desktop + mobile shared */}
        <div>
          {valueProps.map((prop, i) => {
            const isEven = i % 2 === 1;
            return (
              <div
                key={i}
                className={`ww-row relative py-12 sm:py-16 border-t border-white/[0.06] first:border-t-0`}
              >
                <div className="hidden lg:grid lg:grid-cols-12 items-start">
                  {/* Stat — large display number */}
                  <div className={`lg:col-span-4 flex ${isEven ? "lg:order-2 lg:justify-end" : ""}`}>
                    <div className="lg:text-left">
                      <span className={`ww-stat text-transparent bg-clip-text font-heading font-bold block ${isEven ? "lg:text-right" : ""}`} style={{
                        fontSize: "clamp(4rem, 9.5vw, 8.5rem)",
                        lineHeight: 0.85,
                        backgroundImage: "linear-gradient(135deg, #D4A574 0%, #B88A5A 100%)",
                      }}>
                        {prop.stat}
                      </span>
                    </div>
                  </div>

                  {/* Bronze line */}
                  <div className={`lg:col-span-1 flex items-start pt-8 ${isEven ? "lg:order-3 justify-start" : ""}`}>
                    <div className="ww-line h-px w-16 bg-[#B88A5A]" />
                  </div>

                  {/* Title + desc */}
                  <div className={`lg:col-span-7 ${isEven ? "lg:order-1 lg:col-start-1" : ""}`}>
                    <div className={isEven ? "lg:text-right" : ""}>
                      <h3 className="ww-title text-white font-serif font-medium" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", lineHeight: 1.05 }}>
                        {prop.title}
                      </h3>
                      <p className={`ww-desc text-white/40 text-base sm:text-lg leading-relaxed mt-4 max-w-xl ${isEven ? "lg:ml-auto" : ""}`}>
                        {prop.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile: stacked — animated */}
                <div className="lg:hidden">
                  <div className="flex items-center gap-4">
                    <span className="m-ww-stat text-transparent bg-clip-text font-heading font-bold text-4xl sm:text-5xl" style={{ backgroundImage: "linear-gradient(135deg, #D4A574 0%, #B88A5A 100%)" }}>
                      {prop.stat}
                    </span>
                    <div className="m-ww-line h-px flex-1 origin-left" style={{ background: "linear-gradient(to right, #B88A5A, #D4A574)" }} />
                  </div>
                  <h3 className="m-ww-title text-white font-serif font-medium text-xl sm:text-2xl leading-tight mt-3">
                    {prop.title}
                  </h3>
                  <p className="m-ww-desc text-white/40 text-sm leading-relaxed mt-3">
                    {prop.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
