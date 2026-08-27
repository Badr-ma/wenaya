"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

const stepNumbers = ["01", "02", "03", "04"];

export default function DemoProcess() {
  const { tRaw } = useLocale();
  const steps = tRaw<Array<{ title: string; desc: string }>>("entreprises.howItWorks.steps");
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
    const ctx = gsap.context(() => {
      gsap.from(".pr-eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });

      if (!prefersReduced.current) {
        gsap.fromTo(".pr-progress-fill", { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: ".pr-steps", start: "top 70%", end: "bottom 40%", scrub: 1 },
        });
      }

      if (!prefersReduced.current) {
        gsap.set(".m-pr-progress-fill", { scaleY: 0 });
      }

      gsap.utils.toArray<HTMLElement>(".pr-step").forEach((step, i) => {
        gsap.from(step, { opacity: 0, x: -20, duration: 0.6, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none none" },
        });
        if (!prefersReduced.current) {
          const num = step.querySelector(".pr-step-num");
          const lineFill = step.querySelector(".pr-step-line-fill");
          gsap.set(lineFill, { scaleX: 0 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: step, start: "top 72%", toggleActions: "play none none none" },
          });
          tl.to(num, { color: "#D4A574", duration: 0.5, ease: "power2.out" })
            .to(lineFill, { scaleX: 1, duration: 0.7, ease: "power2.out" }, "-=0.25");
          // Mobile: progress the vertical connector line step-by-step as each step enters (no scrub)
          if (window.innerWidth < 1024) {
            const frac = (i + 1) / steps.length;
            tl.to(".m-pr-progress-fill", { scaleY: frac, duration: 0.6, ease: "power2.out" }, "<0.15");
          }
        }
      });
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#0B1220] py-24 sm:py-36 px-6 overflow-hidden"
      data-section-bg="dark"
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="mb-20">
          <span className="pr-eyebrow inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {tRaw<string>("entreprises.howItWorks.title")}
          </span>
          <h2 className="heading-serif text-white mt-6" style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 1.08 }}>
            {tRaw<string>("entreprises.howItWorks.subtitle")}
          </h2>
        </div>

        <div className="pr-steps relative">
          {/* Vertical bronze line — desktop */}
          <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-px bg-white/[0.06]">
            <div className="pr-progress-fill absolute top-0 left-0 w-full h-full origin-top" style={{ background: "linear-gradient(to bottom, #B88A5A, #D4A574)" }} />
          </div>

          {/* Vertical connector line — mobile, progresses step-by-step */}
          <div className="lg:hidden absolute left-0 top-2 bottom-2 w-px bg-white/[0.06]">
            <div className="m-pr-progress-fill absolute top-0 left-0 w-full h-full origin-top" style={{ background: "linear-gradient(to bottom, #B88A5A, #D4A574)" }} />
          </div>

          <div className="space-y-16 lg:space-y-24 relative">
            {steps.map((step, i) => (
              <div key={i} className="pr-step relative pl-6 lg:pl-24">
                {/* Number — turns bronze when the step is reached */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="pr-step-num text-white/25 font-heading font-bold text-3xl lg:text-4xl">{stepNumbers[i]}</span>
                  <div className="pr-step-line relative h-px flex-1 overflow-hidden">
                    <div className="absolute inset-0 bg-white/[0.06]" />
                    <div
                      className="pr-step-line-fill absolute inset-0 origin-left"
                      style={{ background: "linear-gradient(to right, #B88A5A, #D4A574)" }}
                    />
                  </div>
                </div>
                <h3 className="text-white font-serif font-medium text-xl sm:text-2xl leading-tight">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm sm:text-base leading-relaxed mt-3 max-w-lg">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
