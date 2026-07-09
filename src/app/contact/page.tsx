"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const { t } = useLocale();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !email) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, message, source: "contact" }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-[#F2EFE9] pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">{t("contact.badge")}</span>
          </div>

          <h1 className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220] mb-6">
            {t("contact.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("contact.heading2")}
</span>
          </h1>
          <p className="text-[#2B2F36]/55 text-sm max-w-lg mx-auto mb-14 leading-relaxed">
            {t("contact.sub")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-14">
            <div className="space-y-6">
              <InfoCard title={t("contact.adresse")} icon={<PinIcon />}>
                <p>{t("contact.addressLine1")}</p>
                <p className="text-[#2B2F36]/50">{t("contact.addressLine2")}</p>
              </InfoCard>
              <InfoCard title={t("contact.telephone")} icon={<PhoneIcon />}>
                <Link href="tel:+212666124035" className="text-[#159AA9] hover:text-[#1AB0C0] transition-colors">
                  {t("contact.phone")}
                </Link>
              </InfoCard>
              <InfoCard title={t("contact.email")} icon={<MailIcon />}>
                <a href="mailto:contact@wenaya.com" className="text-[#159AA9] hover:text-[#1AB0C0] transition-colors">
                  {t("contact.emailAddr")}
                </a>
              </InfoCard>
              <InfoCard title={t("contact.horaires")} icon={<ClockIcon />}>
                <p>{t("contact.hoursWeek")}</p>
                <p className="text-[#2B2F36]/50">{t("contact.hoursClosed")}</p>
              </InfoCard>
            </div>

            <div className="bg-white/60 rounded-2xl p-6 sm:p-8 border border-[#0B1220]/[0.06]">
              <h2 className="text-[#0B1220] font-heading font-semibold text-lg mb-6">{t("contact.formTitle")}</h2>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[#B88A5A]/10 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-[#0B1220] font-heading font-semibold text-lg mb-2">Merci !</h3>
                  <p className="text-[#2B2F36]/50 text-sm">Votre message a bien été envoyé. Nous vous répondrons sous 24h.</p>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  {loading ? "Envoi..." : t("contact.envoyer")}
                </button>
              </form>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border border-[#0B1220]/[0.06] h-[250px] sm:h-[320px] bg-white/40 flex items-center justify-center">
            <div className="text-center">
              <PinIcon />
              <p className="text-[#2B2F36]/30 text-sm mt-2">{t("contact.mapText")}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
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

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#0B1220]/[0.03] border border-[#0B1220]/[0.06] flex items-center justify-center shrink-0 text-[#B88A5A]/60">
        {icon}
      </div>
      <div>
        <h3 className="text-[#0B1220] text-sm font-semibold mb-1">{title}</h3>
        <div className="text-[#2B2F36]/60 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
