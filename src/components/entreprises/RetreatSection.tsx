/**
 * Corporate Retreat — the 3 editorial chapters (Reset & Recharge, Team Health &
 * Cohesion, Active Wellness) as one row of equal-width cards on navy (2 + 1 on
 * tablet, single column on mobile), followed by the "Build Your Retreat"
 * progression and CTA → #contact. All chapters visible in the DOM for SEO/LLM
 * and accessibility. No slider, no arrows, no swipe, no autoplay, no stagger,
 * no animation.
 */
"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

interface Chapter {
  number: string;
  title: string;
  theme: string;
  desc: string;
  capabilities: string[];
}

interface DesignStep {
  number: string;
  label: string;
  desc: string;
}

const chapterImages = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=100&auto=format&fit=crop",
];

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function scrollToContact(e: React.MouseEvent<HTMLAnchorElement>) {
  if (reducedMotion) return;
  e.preventDefault();
  const el = document.querySelector("#contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function RetreatSection(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const chapters = tRaw<Chapter[]>("entreprises.retreat.chapters");
  const steps = tRaw<DesignStep[]>("entreprises.retreat.design.steps");

  return (
    <section className="relative bg-[#0B1220] py-20 sm:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[640px] h-[640px] rounded-full bg-[#B88A5A]/[0.06] blur-3xl translate-x-1/4 -translate-y-1/4" />
      </div>

      <div className="max-w-[88rem] mx-auto relative">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 sm:mb-20">
          <div className="lg:col-span-9">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase mb-8">
              <span className="w-10 h-px bg-[#B88A5A]/40" />
              {t("entreprises.retreat.badge")}
            </span>
            <h2 className="heading-serif text-white" style={{ fontSize: "clamp(2.1rem, 4.8vw, 3.9rem)", fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
              {t("entreprises.retreat.heading1")}{" "}
              <em className="not-italic text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 55%, #B88A5A 100%)" }}>
                {t("entreprises.retreat.heading2")}
              </em>
            </h2>
            <p className="text-white/55 text-base sm:text-lg leading-relaxed mt-6 max-w-xl">
              {t("entreprises.retreat.lead")}
            </p>
          </div>
        </div>

        {/* One-row equal-width chapter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {chapters.map((c, i) => (
            <article key={i} className="flex flex-col h-full">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-t-[24px]">
                <Image
                  src={chapterImages[i % chapterImages.length]}
                  alt={c.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/40 via-transparent to-transparent" aria-hidden />
                <span aria-hidden className="hidden lg:block absolute -bottom-6 left-6 font-heading font-bold leading-none select-none" style={{ fontSize: "clamp(4.9rem, 9.8vw, 8.2rem)", color: "transparent", WebkitTextStroke: "1.5px rgba(184,138,90,0.3)" }}>
                  {c.number}
                </span>
              </div>

              <div className="flex flex-col flex-1 pt-6 lg:pt-7">
                <span className="lg:hidden font-heading font-bold text-[#B88A5A] text-3xl leading-none block mb-4 tracking-tight">{c.number}</span>
                <div className="w-12 h-px bg-[#B88A5A]/40 mb-6" aria-hidden />
                <h3 className="heading-serif text-white font-semibold leading-[1.05]" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.85rem)" }}>{c.title}</h3>
                <p className="mt-4 text-[#B88A5A] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase">{c.theme}</p>
                <p className="mt-5 text-white/55 text-base sm:text-lg leading-relaxed max-w-xl">{c.desc}</p>
                <div className="mt-8">
                  {c.capabilities.map((cap, ci) => (
                    <div key={ci}>
                      <p className="py-3.5 text-white/80 text-sm font-medium tracking-[0.14em] uppercase">{cap}</p>
                      {ci < c.capabilities.length - 1 && <div className="h-px bg-[#B88A5A]/15" aria-hidden />}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Build Your Retreat */}
        <div className="mt-20 sm:mt-28 border-t border-white/[0.06] pt-14 sm:pt-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase mb-6">
              <span className="w-10 h-px bg-[#B88A5A]/40" />
              {t("entreprises.retreat.design.badge")}
            </span>
            <h3 className="heading-serif text-white" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              {t("entreprises.retreat.design.title")}
            </h3>
          </div>

          <div className="relative mt-10 sm:mt-12">
            <div className="absolute hidden lg:block left-0 right-0 top-[0.375rem] h-px bg-[#B88A5A]/15" aria-hidden />
            <div className="absolute lg:hidden left-[0.375rem] top-0 bottom-0 w-px bg-[#B88A5A]/15" aria-hidden />

            <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 pl-10 lg:pl-0">
              {steps.map((s) => (
                <div key={s.number} className="relative">
                  <span className="absolute -left-10 lg:-left-2.5 top-0 lg:top-[-0.09rem] w-2.5 h-2.5 rounded-full bg-[#B88A5A]" aria-hidden />
                  <div className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-0">
                    <span className="font-heading font-bold text-[#B88A5A] text-3xl leading-none tracking-tight">{s.number}</span>
                    <span className="text-white text-base font-semibold tracking-wide uppercase lg:mt-3">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
            <p className="heading-serif text-white text-xl sm:text-2xl leading-tight" style={{ maxWidth: "32rem" }}>
              {t("entreprises.retreat.preCta")}
            </p>
            <a
              href="#contact"
              onClick={scrollToContact}
              className="group inline-flex items-center justify-center gap-4 text-white px-9 h-14 rounded-full text-base font-semibold tracking-wide transition-all duration-300 hover:bg-[#A07848] sm:w-auto w-full shrink-0"
              style={{ background: "#B88A5A", boxShadow: "0 12px 40px rgba(184,138,90,0.28)" }}
            >
              {t("entreprises.retreat.cta")}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}