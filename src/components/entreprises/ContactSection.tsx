/**
 * Contact — final conversion section for the corporate pages.
 * Two-column on desktop: LEFT = heading + contact details + external Google
 * Calendar booking CTA; RIGHT = quote-request form (team size + programme
 * level selectors) posting to /api/contact. The form carries the backend-
 * required identity fields (firstName, lastName, email) plus the stable
 * field names teamSize, programmeLevel and source="corporate-quote".
 * Keeps id="contact" and data-contact for anchor/scroll targets.
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

type FormStatus = "idle" | "sending" | "success" | "error";

type SelectOption = { value: string; label: string };

export default function ContactSection() {
  const { t, tRaw } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [programmeLevel, setProgrammeLevel] = useState("");

  const teamSizeOptions: SelectOption[] = tRaw<SelectOption[]>("entreprises.contactSection.teamSizeOptions") ?? [];
  const programmeLevelOptions: SelectOption[] = tRaw<SelectOption[]>("entreprises.contactSection.programmeLevelOptions") ?? [];

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
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        teamSize,
        programmeLevel,
        source: "corporate-quote",
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setStatus("success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setTeamSize("");
      setProgrammeLevel("");
    } else {
      setStatus("error");
    }
  };

  const renderSelect = (
    id: string,
    name: string,
    label: string,
    placeholder: string,
    value: string,
    options: SelectOption[],
    onChange: (v: string) => void,
  ) => (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-[#F2EFE9]/60 border border-[#0B1220]/[0.08] rounded-xl px-4 py-3 pr-10 text-sm outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus-visible:ring-2 focus-visible:ring-[#B88A5A]/25 ${value === "" ? "text-[#2B2F36]/50" : "text-[#0B1220]"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1220]/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );

  const inputClass =
    "w-full bg-[#F2EFE9]/60 border border-[#0B1220]/[0.08] rounded-xl px-4 py-3 text-[#0B1220] text-sm placeholder:text-[#2B2F36]/[0.3] outline-none focus:border-[#B88A5A]/40 focus:bg-white transition-all duration-200";
  const fieldLabelClass =
    "block text-[#0B1220] text-xs font-semibold tracking-[0.05em] uppercase mb-2";

  return (
    <section id="contact" data-contact ref={sectionRef} className="relative bg-[#0B1220] py-20 sm:py-28 px-4 sm:px-6 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[720px] h-[720px] rounded-full bg-[#B88A5A]/[0.06] blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[520px] h-[520px] rounded-full bg-[#B88A5A]/[0.04] blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: heading + contact details + booking CTA */}
          <div className="ct-head">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              <span className="w-8 h-px bg-[#B88A5A]/40" />
              {t("entreprises.contactSection.eyebrow")}
            </span>
            <h2 className="heading-serif text-white mt-5 leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)" }}>
              {t("entreprises.contactSection.heading")}
            </h2>
            <p className="text-white/55 text-base leading-relaxed mt-4 max-w-md">
              {t("entreprises.contactSection.sub")}
            </p>

            <ul className="mt-9 space-y-5">
              <li className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <div>
                  <p className="text-white/40 text-[11px] font-semibold uppercase tracking-[0.12em]">{t("entreprises.contactSection.emailLabel")}</p>
                  <a href="mailto:corporate@wenaya.com" className="text-white text-sm font-medium transition-colors hover:text-[#B88A5A]">
                    {t("entreprises.contactSection.email")}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <div>
                  <p className="text-white/40 text-[11px] font-semibold uppercase tracking-[0.12em]">{t("entreprises.contactSection.phoneLabel")}</p>
                  <a href="tel:+212666124035" className="text-white text-sm font-medium transition-colors hover:text-[#B88A5A]">
                    {t("entreprises.contactSection.phone")}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-white/40 text-[11px] font-semibold uppercase tracking-[0.12em]">{t("entreprises.contactSection.addressLabel")}</p>
                  <p className="text-white text-sm font-medium">{t("entreprises.contactSection.address")}</p>
                </div>
              </li>
            </ul>

            <div className="mt-10">
              <a
                href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("entreprises.contactSection.bookingAria")}
                className="group inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full text-white text-base font-semibold shadow-[0_12px_32px_-12px_rgba(184,138,90,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_rgba(184,138,90,0.95)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                style={{ background: "#B88A5A" }}
              >
                {t("entreprises.contactSection.bookingCta")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
              <p className="text-white/30 text-xs mt-5 tracking-[0.05em]">
                {t("entreprises.cta.contact")}
              </p>
            </div>
          </div>

          {/* Right: quote request form */}
          <div className="ct-form lg:sticky lg:top-24">
            <div className="bg-[#FAF8F4] rounded-2xl p-6 sm:p-8" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              <h3 className="text-[#0B1220] font-semibold text-xl sm:text-2xl leading-snug tracking-[-0.01em]">
                {t("entreprises.contactSection.quoteHeading")}
              </h3>
              <p className="text-[#0B1220]/60 text-sm leading-relaxed mt-2">
                {t("entreprises.contactSection.quoteSub")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 mt-7">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ct-firstname" className={fieldLabelClass}>
                      {t("entreprises.contactSection.firstNameLabel")}
                    </label>
                    <input
                      id="ct-firstname"
                      type="text"
                      required
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                      placeholder={t("entreprises.contactSection.firstNamePlaceholder")}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-lastname" className={fieldLabelClass}>
                      {t("entreprises.contactSection.lastNameLabel")}
                    </label>
                    <input
                      id="ct-lastname"
                      type="text"
                      required
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                      placeholder={t("entreprises.contactSection.lastNamePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ct-request-email" className={fieldLabelClass}>
                    {t("entreprises.contactSection.emailFieldLabel")}
                  </label>
                  <input
                    id="ct-request-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder={t("entreprises.contactSection.emailFieldPlaceholder")}
                  />
                </div>

                {renderSelect(
                  "ct-team-size",
                  "teamSize",
                  t("entreprises.contactSection.teamSizeLabel"),
                  t("entreprises.contactSection.teamSizePlaceholder"),
                  teamSize,
                  teamSizeOptions,
                  setTeamSize,
                )}

                {renderSelect(
                  "ct-programme-level",
                  "programmeLevel",
                  t("entreprises.contactSection.programmeLevelLabel"),
                  t("entreprises.contactSection.programmeLevelPlaceholder"),
                  programmeLevel,
                  programmeLevelOptions,
                  setProgrammeLevel,
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2.5 w-full h-13 px-8 rounded-xl text-white text-sm font-semibold tracking-wide bg-[#0B1220] transition-all duration-300 hover:bg-[#1B2233] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? t("entreprises.contactSection.fetching") : t("entreprises.contactSection.submit")}
                  </button>
                </div>

                {status === "success" && (
                  <p role="status" className="text-green-700 text-sm">{t("entreprises.contactSection.success")}</p>
                )}
                {status === "error" && (
                  <p role="alert" className="text-red-600 text-sm">{t("entreprises.contactSection.error")}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}