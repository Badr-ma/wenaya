"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

const challengeIcons = [
  "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
  "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
  "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
];

export default function DemoChallenges() {
  const { tRaw } = useLocale();
  const themes = tRaw<Array<{ title: string; desc: string }>>("entreprises.thematiques.themes");
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
      gsap.from(".wc-eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
      gsap.from(".wc-title", { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });

      gsap.utils.toArray<HTMLElement>(".wc-row").forEach((row) => {
        gsap.set(row.querySelector(".wc-num"), { y: 30, opacity: 0.25, scale: 0.9 });
        gsap.set(row.querySelector(".wc-line"), { scaleX: 0 });
        gsap.set(row.querySelectorAll(".wc-word-mask > span"), { yPercent: 110 });
        gsap.set(row.querySelector(".wc-desc"), { y: 20, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 78%", toggleActions: "play none none none" },
        });
        tl.to(row.querySelector(".wc-num"), { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" })
          .to(row.querySelector(".wc-line"), { scaleX: 1, duration: 0.9, ease: "power2.out" }, "-=0.4")
          .to(row.querySelectorAll(".wc-word-mask > span"), {
            yPercent: 0, duration: 0.7, stagger: 0.06, ease: "power4.out",
          }, "-=0.5")
          .to(row.querySelector(".wc-desc"), { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");
      });

      // Mobile: numbered themes reveal with number scale + bronze line draw + text stagger
      if (window.innerWidth < 1024) {
        gsap.utils.toArray<HTMLElement>(".wc-row").forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 82%", toggleActions: "play none none none" },
          });
          tl.from(row.querySelector(".m-wc-num"), { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(2)", immediateRender: false })
            .from(row.querySelector(".m-wc-line"), { scaleX: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, "-=0.25")
            .from(row.querySelector(".m-wc-title"), { y: 18, opacity: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, "-=0.3")
            .from(row.querySelector(".m-wc-desc"), { y: 12, opacity: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, "-=0.3");
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
          <span className="wc-eyebrow inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {tRaw<string>("entreprises.thematiques.title")}
          </span>
          <h2 className="wc-title heading-serif text-white mt-6" style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 1.08 }}>
            {tRaw<string>("entreprises.thematiques.subtitle")}
          </h2>
        </div>

        {/* Editorial vertical list — desktop + mobile shared */}
        <div>
          {themes.map((theme, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className={`wc-row relative py-12 sm:py-16 border-t border-white/[0.06] first:border-t-0`}
              >
                {/* Grid layout: number + content, alternating alignment */}
                <div className="hidden lg:grid lg:grid-cols-12 items-start">
                  {/* Number — strong bronze editorial marker */}
                  <div className={`lg:col-span-2 flex ${isLeft ? "justify-start" : "justify-end"} pt-1`}>
                    <span
                      className="wc-num text-transparent bg-clip-text font-heading font-bold block"
                      style={{
                        fontSize: "clamp(4rem, 8vw, 7rem)",
                        lineHeight: 0.85,
                        backgroundImage: "linear-gradient(135deg, #D4A574 0%, #B88A5A 100%)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Bronze divider / progress line */}
                  <div className="lg:col-span-1 flex items-center">
                    <div
                      className="wc-line h-[2px] w-full origin-left"
                      style={{ background: "linear-gradient(to right, #B88A5A, #D4A574)" }}
                    />
                  </div>

                  {/* Title + desc */}
                  <div className={`lg:col-span-6 ${isLeft ? "" : "lg:col-start-7"}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <svg className="w-6 h-6 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={challengeIcons[i % challengeIcons.length]} />
                      </svg>
                    </div>
                    <h3 className="wc-word-mask overflow-hidden text-white font-serif font-medium" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.08 }}>
                      <span className="block">{theme.title}</span>
                    </h3>
                    <p className="wc-desc text-white/40 text-base sm:text-lg leading-relaxed mt-5 max-w-xl">
                      {theme.desc}
                    </p>
                  </div>
                </div>

                {/* Mobile: simple stacked — animated */}
                <div className="lg:hidden">
                  <div className="flex items-center gap-5">
                    <span className="m-wc-num text-transparent bg-clip-text font-heading font-bold text-3xl" style={{ backgroundImage: "linear-gradient(135deg, #D4A574 0%, #B88A5A 100%)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <svg className="w-6 h-6 text-[#B88A5A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={challengeIcons[i % challengeIcons.length]} />
                    </svg>
                    <div className="m-wc-line h-px flex-1 origin-left" style={{ background: "linear-gradient(to right, #B88A5A, #D4A574)" }} />
                  </div>
                  <h3 className="m-wc-title text-white font-serif font-medium text-xl sm:text-2xl leading-tight mt-4">
                    {theme.title}
                  </h3>
                  <p className="m-wc-desc text-white/40 text-sm leading-relaxed mt-3">
                    {theme.desc}
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
