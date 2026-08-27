"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function DemoImpact() {
  const { tRaw } = useLocale();
  const without = tRaw<Array<{ label: string; desc: string }>>("entreprises.approach.comparison.without");
  const withItems = tRaw<Array<{ label: string; desc: string }>>("entreprises.approach.comparison.with");
  const withoutLabel = tRaw<string>("entreprises.approach.comparison.withoutLabel");
  const withLabel = tRaw<string>("entreprises.approach.comparison.withLabel");
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const pairs = without.map((w, i) => ({ without: w, with: withItems[i] })).filter(Boolean);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    // Under reduced-motion, keep all content immediately visible (no entrance hiding).
    if (prefersReduced.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".im-eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
      gsap.from(".im-heading", { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });

      // Transformation chapters — cinematic before→after sequence
      gsap.utils.toArray<HTMLElement>(".im-pair").forEach((pair) => {
        gsap.set(pair.querySelector(".im-num"), { opacity: 0, y: 24 });
        gsap.set(pair.querySelector(".im-label-out"), { opacity: 0, y: 14 });
        gsap.set(pair.querySelector(".im-out-label"), { opacity: 0, y: 18 });
        gsap.set(pair.querySelector(".im-out-strike"), { scaleX: 0 });
        gsap.set(pair.querySelector(".im-out-desc"), { opacity: 0, y: 12 });
        gsap.set(pair.querySelector(".im-linkline-h"), { scaleX: 0 });
        gsap.set(pair.querySelector(".im-linkline-v"), { scaleY: 0 });
        gsap.set(pair.querySelector(".im-linkarrow"), { opacity: 0, x: -8 });
        gsap.set(pair.querySelector(".im-in-block"), { opacity: 0, y: 30 });
        gsap.set(pair.querySelector(".im-in-label"), { opacity: 0, scale: 0.94 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: pair, start: "top 70%", toggleActions: "play none none none" },
        });

        // 1. number enters
        tl.to(pair.querySelector(".im-num"), { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
          // 2. "Without Wenaya" appears
          .to(pair.querySelector(".im-label-out"), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
          // 3. problem statement reveals
          .to(pair.querySelector(".im-out-label"), { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.25")
          .to(pair.querySelector(".im-out-desc"), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
          // 4. bronze transition line/arrow draws
          .to(pair.querySelector(".im-linkline-h"), { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.3")
          .to(pair.querySelector(".im-linkline-v"), { scaleY: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.3")
          .to(pair.querySelector(".im-linkarrow"), { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.35")
          // 5. old state strikes through + fades
          .to(pair.querySelector(".im-out-strike"), { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, "-=0.4")
          .to(pair.querySelector(".im-label-out"), { opacity: 0.4, duration: 0.4, ease: "power2.out" }, "<")
          .to(pair.querySelector(".im-out-label"), { opacity: 0.3, duration: 0.5, ease: "power2.out" }, "<")
          .to(pair.querySelector(".im-out-desc"), { opacity: 0.2, duration: 0.5, ease: "power2.out" }, "<")
          // 6. "With Wenaya" reveals
          .to(pair.querySelector(".im-in-block"), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
          // 7. result/stat becomes dominant
          .to(pair.querySelector(".im-in-label"), { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");
        // 8. description follows
        tl.from(pair.querySelector(".im-in-desc"), { opacity: 0, y: 12, duration: 0.5, ease: "power3.out", immediateRender: false }, "-=0.35");
      });
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#F2EFE9] py-24 sm:py-36 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16 sm:mb-24">
          <span className="im-eyebrow inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            Impact
          </span>
          <h2 className="im-heading heading-serif text-[#0B1220] mt-6" style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 1.08 }}>
            {tRaw<string>("entreprises.approach.comparison.heading")}
          </h2>
          <p className="text-[#2B2F36]/45 text-base mt-4">{tRaw<string>("entreprises.approach.comparison.sub")}</p>
        </div>

        {/* Transformation chapters — normal flow, no cards */}
        <div>
          {pairs.map((pair, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className="im-pair relative py-16 sm:py-24 lg:min-h-[70vh] lg:flex lg:items-center border-t border-[#0B1220]/[0.06] first:border-t-0"
              >
                <div className={`w-full max-w-[600px] ${isLeft ? "lg:mr-auto" : "lg:ml-auto"}`}>
                  {/* Chapter number */}
                  <div className="im-num text-[#B88A5A] font-heading font-bold" style={{ fontSize: "clamp(3rem, 7vw, 5rem)", lineHeight: 0.9 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* WITHOUT WENAYA */}
                  <div className="mt-8">
                    <div className="im-label-out flex items-center gap-3 text-[#2B2F36]/40 text-[10px] font-bold tracking-[0.25em] uppercase">
                      {withoutLabel}
                      <span className="w-8 h-px bg-[#2B2F36]/20" />
                    </div>
                    <p className="im-out-label relative inline-block mt-3 text-[#2B2F36]/60 text-2xl sm:text-3xl font-serif max-w-md">
                      {pair.without.label}
                      <span className="im-out-strike absolute left-0 top-1/2 h-[2px] w-full origin-left" style={{ background: "linear-gradient(to right, #B88A5A, #B88A5A)" }} />
                    </p>
                    <p className="im-out-desc text-[#2B2F36]/35 text-sm sm:text-base mt-2 max-w-md leading-relaxed">
                      {pair.without.desc}
                    </p>
                  </div>

                  {/* Bronze transition */}
                  <div className="my-10 lg:my-12">
                    {/* Desktop: horizontal line + arrow */}
                    <div className="hidden lg:flex items-center gap-4">
                      <div className="im-linkline-h h-px w-48 origin-left" style={{ background: "linear-gradient(to right, #B88A5A, #D4A574)" }} />
                      <span className="im-linkarrow text-[#B88A5A] text-2xl">→</span>
                    </div>
                    {/* Mobile: vertical line + down arrow */}
                    <div className="lg:hidden flex flex-col items-center gap-3">
                      <div className="im-linkline-v w-px h-16 origin-top" style={{ background: "linear-gradient(to bottom, #B88A5A, #D4A574)" }} />
                      <span className="im-linkarrow text-[#B88A5A] text-2xl">↓</span>
                    </div>
                  </div>

                  {/* WITH WENAYA */}
                  <div className="im-in-block">
                    <div className="im-label-in flex items-center gap-3 text-[#0B1220]/50 text-[10px] font-bold tracking-[0.25em] uppercase">
                      {withLabel}
                      <span className="w-8 h-px bg-[#B88A5A]/40" />
                    </div>
                    <p
                      className="im-in-label text-transparent bg-clip-text font-serif mt-3"
                      style={{
                        fontSize: "clamp(2.2rem, 5vw, 4rem)",
                        lineHeight: 1.05,
                        fontWeight: 500,
                        backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 55%, #B88A5A 100%)",
                      }}
                    >
                      {pair.with.label}
                    </p>
                    <p className="im-in-desc text-[#0B1220]/50 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
                      {pair.with.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
