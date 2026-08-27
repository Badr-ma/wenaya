"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function DemoTestimonials() {
  const { tRaw } = useLocale();
  const testimonials = tRaw<Array<{ quote: string; author: string }>>("entreprises.testimonials.items");
  const partners = tRaw<string[]>("entreprises.programs.partners");
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");
  const [active, setActive] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".tp-head", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    if (prefersReduced.current) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#F2EFE9] py-24 sm:py-36 px-6 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="tp-head text-center mb-16">
          <span className="inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase justify-center">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {tRaw<string>("entreprises.testimonials.title")}
            <span className="w-10 h-px bg-[#B88A5A]/50" />
          </span>
        </div>

        {/* Single large quote */}
        <div className="relative min-h-[250px] flex items-center justify-center">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? "translateY(0)" : "translateY(12px)",
                pointerEvents: i === active ? "auto" : "none",
              }}
            >
              <blockquote>
                <p className="text-[#0B1220] font-serif" style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)", lineHeight: 1.35, fontWeight: 500 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-[#B88A5A] text-sm font-semibold mt-8 tracking-wide">— {t.author}</p>
              </blockquote>
            </div>
          ))}
        </div>

        {/* Minimal dot indicators */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-500 ${i === active ? "w-6 h-1 bg-[#B88A5A] rounded-full" : "w-1 h-1 bg-[#0B1220]/15 rounded-full hover:bg-[#0B1220]/25"}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Partner names — simple marquee */}
        <div className="mt-20 pt-12 border-t border-[#0B1220]/[0.06]">
          <p className="text-[#0B1220]/25 text-[10px] font-semibold uppercase tracking-[0.2em] text-center mb-8">
            {tRaw<string>("entreprises.programs.ilsNousFontConfiance")}
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {partners.map((name, i) => (
              <span key={i} className="text-[#0B1220]/15 font-heading font-bold text-sm tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
