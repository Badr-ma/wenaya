/**
 * Disease Marquee — infinite horizontal scrolling ticker showing wellness topics and conditions.
 * Three rows scrolling in alternating directions. Used on the homepage for visual interest.
 * Fetches editable data from Redis (via API), falls back to i18n hardcoded values.
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

interface MarqueeData {
  badge: string;
  heading1: string;
  heading2: string;
  sub: string;
  specialites: string[];
  services: string[];
  therapies: string[];
  pillShape?: "pill" | "square" | "rounded";
}

export default function DiseaseMarquee(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const [remote, setRemote] = useState<MarqueeData | null>(null);

  useEffect(() => {
    fetch("/api/admin/specialties")
      .then((r) => r.json())
      .then((j) => {
        if (j.source === "redis" && j.data) setRemote(j.data);
      })
      .catch(() => {});
  }, []);

  const badge = remote?.badge ?? t("diseaseMarquee.badge");
  const heading1 = remote?.heading1 ?? t("diseaseMarquee.heading1");
  const heading2 = remote?.heading2 ?? t("diseaseMarquee.heading2");
  const sub = remote?.sub ?? t("diseaseMarquee.sub");
  const row1Src = remote?.specialites ?? tRaw<string[]>("diseaseMarquee.specialites");
  const row2Src = remote?.services ?? tRaw<string[]>("diseaseMarquee.services");
  const row3Src = remote?.therapies ?? tRaw<string[]>("diseaseMarquee.therapies");

  const servicesRow1 = [...row1Src, ...row1Src];
  const servicesRow2 = [...row2Src, ...row2Src];
  const servicesRow3 = [...row3Src, ...row3Src];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const shapeClass = remote?.pillShape === "square"
    ? "rounded-none"
    : remote?.pillShape === "rounded"
      ? "rounded-lg"
      : "rounded-full";

  const pillClass =
    `inline-block mx-2 px-4 py-2 ${shapeClass} bg-white border border-[#0B1220]/[0.04] text-[#2B2F36]/50 text-sm font-medium transition-all duration-300 hover:bg-[rgba(184,138,90,0.08)] hover:border-[#B88A5A]/30 hover:text-[#0B1220] hover:scale-105`;

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-10 sm:py-18 overflow-hidden">
      <div ref={headingRef} className="text-center mb-8 sm:mb-12 px-6">
        <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
          {badge}
        </span>
        <h2 className="heading-serif text-3xl sm:text-4xl text-[#0B1220] mt-3 tracking-tight">
          {heading1}{" "}
          <span style={{
            background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {heading2}
          </span>
        </h2>
        <p className="text-[#2B2F36]/60 text-sm mt-3 max-w-xl mx-auto">
          {sub}
        </p>
      </div>

      <div className="relative">
        <div className="flex whitespace-nowrap animate-marquee mb-4">
          {servicesRow1.map((s, i) => (
            <span key={i} className={pillClass}>{s}</span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-reverse mb-4">
          {servicesRow2.map((s, i) => (
            <span key={i} className={pillClass}>{s}</span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee">
          {servicesRow3.map((s, i) => (
            <span key={i} className={pillClass}>{s}</span>
          ))}
        </div>
      </div>

      <div className="text-center mt-6 sm:mt-10">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center justify-center px-8 h-[50px] bg-[#B88A5A] text-white rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#A07848] hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
        >
          {t("diseaseMarquee.voirPlus")}
        </a>
      </div>
    </section>
  );
}
