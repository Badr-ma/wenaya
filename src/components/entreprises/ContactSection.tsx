/**
 * Contact Section — corporate inquiry form with fields for company name, email,
 * message, and employee count. Two-column layout: form on left, info on right.
 * Features: GSAP scroll animations, form validation, and success state.
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
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-24 sm:py-36 px-6 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#B88A5A]/[0.04] blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="grid sm:grid-cols-12 gap-10 sm:gap-16 items-start">
          <div className="ct-head sm:col-span-5">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              <span className="w-8 h-px bg-[#B88A5A]/40" />
              {t("entreprises.contactSection.title")}
            </span>
            <h2 className="heading-serif text-[#0B1220] text-[clamp(2rem, 4vw, 3.5rem)] mt-5 leading-[1.06]">
              {t("entreprises.contactSection.subtitle")}
            </h2>
            <p className="text-[#2B2F36]/60 text-base leading-relaxed mt-4">
              {t("entreprises.contactSection.desc")}
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0B1220]/[0.04] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#0B1220]/40 text-[10px] font-semibold tracking-[0.1em] uppercase">Email</p>
                  <p className="text-[#0B1220] text-sm font-medium">hello@wenaya.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0B1220]/[0.04] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#0B1220]/40 text-[10px] font-semibold tracking-[0.1em] uppercase">Response time</p>
                  <p className="text-[#0B1220] text-sm font-medium">Under 24h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ct-form sm:col-span-6 sm:col-start-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02)" }}>
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
                    placeholder="exemple@entreprise.fr"
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
                    style={{
                      background: "#B88A5A",
                    }}
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
          </div>
        </div>
      </div>
    </section>
  );
}
