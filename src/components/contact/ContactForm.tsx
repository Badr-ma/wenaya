/**
 * Contact Form — the contact form card (previously inline in ContactPage).
 * Reads the `service` and `type` query params so a group-session booking CTA can
 * prefill and visibly pre-select the activity the user came from. Wrapped in a
 * Suspense boundary by ContactPage because it uses useSearchParams.
 */
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/contexts/LanguageContext";
import { getGroupSessionForBooking } from "@/lib/group-sessions";

function ContactFormInner(): React.JSX.Element {
  const { t, locale } = useLocale();
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const type = searchParams.get("type");
  const subject = searchParams.get("subject");
  const isRecruitment = subject === "recrutement" || subject === "recruitment";
  const requestedSession = service ? getGroupSessionForBooking(service, locale) : undefined;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    requestedSession ? `${t("contact.sessionPrefill")} ${requestedSession.title}.`
    : isRecruitment ? t("contact.recruitmentPrefill") : "",
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !email) {
      setError(t("contact.errorRequired"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          message,
          source: isRecruitment ? "recrutement" : "contact",
          service: service ?? undefined,
          type: type ?? undefined,
          subject: subject ?? undefined,
        }),
      });
      if (!res.ok) throw new Error(t("contact.errorServer"));
      setSubmitted(true);
    } catch {
      setError(t("contact.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 rounded-2xl p-6 sm:p-8 border border-[#0B1220]/[0.06]">
      <h2 className="text-[#0B1220] font-heading font-semibold text-lg mb-6">{t("contact.formTitle")}</h2>

      {submitted ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full bg-[#B88A5A]/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-[#0B1220] font-heading font-semibold text-lg mb-2">{t("contact.successTitle")}</h3>
          <p className="text-[#2B2F36]/50 text-sm">{t("contact.successMsg")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {requestedSession && (
            <div
              className="flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{ background: "#B88A5A0D", borderColor: "#B88A5A30" }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 shrink-0 rounded-full"
                style={{ background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)" }}
              />
              <p className="text-[#0B1220]/70 text-xs leading-relaxed">
                <span className="font-semibold text-[#0B1220]">{t("contact.sessionNotice")} :</span>{" "}
                {requestedSession.title}
              </p>
            </div>
          )}

          {isRecruitment && !requestedSession && (
            <div
              className="flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{ background: "#B88A5A0D", borderColor: "#B88A5A30" }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 shrink-0 rounded-full"
                style={{ background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)" }}
              />
              <p className="text-[#0B1220]/70 text-xs leading-relaxed">
                <span className="font-semibold text-[#0B1220]">
                  {locale === "en" ? "Recruitment" : "Recrutement"}
                </span>{" "}
                — {locale === "en" ? "Join the Wenaya team" : "Rejoindre l'équipe Wenaya"}
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label={t("contact.prenom")} placeholder={t("contact.prenomPlaceholder")} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <Input label={t("contact.nom")} placeholder={t("contact.nomPlaceholder")} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <Input label={t("contact.emailForm")} type="email" placeholder={t("contact.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label={t("contact.telephoneForm")} type="tel" placeholder={t("contact.telPlaceholder")} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div>
            <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">{t("contact.message")}</label>
            <textarea rows={4} placeholder={t("contact.messagePlaceholder")} value={message} onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)] resize-none"
            />
          </div>
          {error && <p className="text-red-500/80 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full h-11 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 4px 16px rgba(184,138,90,0.28)",
            }}
          >
            {loading ? t("contact.sending") : t("contact.envoyer")}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ContactForm(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="bg-white/60 rounded-2xl p-6 sm:p-8 border border-[#0B1220]/[0.06] min-h-[480px]" />}>
      <ContactFormInner />
    </Suspense>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, required }: { label: string; type?: string; placeholder: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
        className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
      />
    </div>
  );
}