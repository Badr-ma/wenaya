/**
 * Contact — final conversion section combining the corporate inquiry form
 * (email + message, posts to /api/contact) with the closing quote and the
 * primary call-to-action (Google Calendar booking). Dark closing band.
 * Keeps id="contact" and data-contact for anchor/scroll targets.
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

export default function ContactSection() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ct-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".ct-form", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".ct-cta", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ email, message: msg }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
      setMsg("");
    } else {
      setStatus("error");
    }
  };

  return (
    <section id="contact" data-contact ref={sectionRef} className="relative bg-[#0B1220] py-20 sm:py-28 px-6 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[720px] h-[720px] rounded-full bg-[#B88A5A]/[0.06] blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[520px] h-[520px] rounded-full bg-[#B88A5A]/[0.04] blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: heading + info + form */}
          <div>
            <div className="ct-head">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                <span className="w-8 h-px bg-[#B88A5A]/40" />
                {t("entreprises.contactSection.title")}
              </span>
              <h2 className="heading-serif text-white mt-5 leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)" }}>
                {t("entreprises.contactSection.subtitle")}
              </h2>
              <p className="text-white/55 text-base leading-relaxed mt-4 max-w-md">
                {t("entreprises.contactSection.desc")}
              </p>
            </div>

            <div className="ct-form mt-8 sm:mt-10">
              <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="ct-email" className="block text-[#0B1220] text-xs font-semibold tracking-[0.05em] uppercase mb-2">
                      {t("entreprises.contactSection.emailLabel")}
                    </label>
                    <input
                      id="ct-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F2EFE9]/60 border border-[#0B1220]/[0.08] rounded-xl px-4 py-3 text-[#0B1220] text-sm placeholder:text-[#2B2F36]/[0.3] outline-none focus:border-[#B88A5A]/40 focus:bg-white transition-all duration-200"
                      placeholder={t("entreprises.contactSection.emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <label htmlFor="ct-msg" className="block text-[#0B1220] text-xs font-semibold tracking-[0.05em] uppercase mb-2">
                      {t("entreprises.contactSection.msgLabel")}
                    </label>
                    <textarea
                      id="ct-msg"
                      required
                      rows={4}
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      className="w-full bg-[#F2EFE9]/60 border border-[#0B1220]/[0.08] rounded-xl px-4 py-3 text-[#0B1220] text-sm placeholder:text-[#2B2F36]/[0.3] outline-none focus:border-[#B88A5A]/40 focus:bg-white transition-all duration-200 resize-none"
                      placeholder={t("entreprises.contactSection.msgPlaceholder")}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 w-full sm:w-auto justify-center hover:bg-[#A07848]"
                      style={{ background: "#B88A5A" }}
                    >
                      {t("entreprises.contactSection.submit")}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>

                  {status === "success" && (
                    <p className="text-green-700 text-sm">{t("entreprises.contactSection.success")}</p>
                  )}
                  {status === "error" && (
                    <p className="text-red-600 text-sm">{t("entreprises.contactSection.error")}</p>
                  )}
                </form>
              </div>

              <div className="mt-7 flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-semibold tracking-[0.1em] uppercase">Email</p>
                    <p className="text-white text-sm font-medium">hello@wenaya.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-semibold tracking-[0.1em] uppercase">Response time</p>
                    <p className="text-white text-sm font-medium">Under 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: closing quote + conversion CTA */}
          <div className="ct-cta lg:pt-8 lg:sticky lg:top-24">
            <svg className="w-8 h-8 mb-6" viewBox="0 0 32 32" fill="none" style={{ color: "rgba(184,138,90,0.35)" }}>
              <path d="M9.333 20c0-2.667 1.334-5.333 4-8L16 8l1.333 1.333C15.111 11.556 14 13.778 14 16v4H9.333zM20 20c0-2.667 1.333-5.333 4-8L26.667 8 28 9.333c-2.222 2.223-3.333 4.445-3.333 6.667V20H20z" fill="currentColor" />
            </svg>
            <blockquote className="text-white/60 italic text-lg sm:text-xl leading-relaxed max-w-md">
              {t("entreprises.cta.quote")}
            </blockquote>
            <div className="flex items-center gap-3 mt-5">
              <span className="w-6 h-px bg-[#B88A5A]/30" />
              <span className="text-white/40 text-xs font-medium tracking-[0.15em] uppercase">{t("entreprises.cta.quoteAttr")}</span>
            </div>

            <h3 className="mt-10 text-white font-serif font-medium leading-[1.06] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 2.85rem)" }}
            >
              {t("entreprises.cta.finalHeading")}
            </h3>
            <p className="text-white/50 text-base leading-relaxed mt-4 max-w-md">
              {t("entreprises.cta.finalSub")}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full text-white text-base font-semibold shadow-[0_12px_32px_-12px_rgba(184,138,90,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_rgba(184,138,90,0.95)] active:translate-y-0 w-full sm:w-auto"
                style={{ background: "#B88A5A" }}
              >
                {t("entreprises.cta.cta1")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            <p className="text-white/30 text-xs mt-10 tracking-[0.05em]">
              {t("entreprises.cta.contact")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
