/**
 * Contact Page — contact form and clinic information.
 * Shared by the French (/contact) and English (/en/contact) routes.
 * Features: form with name/email/subject/message fields, validation, success state,
 * clinic address, phone, email, and Google Maps embed.
 * Client component with i18n translations.
 */
"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col">
      <Breadcrumbs />
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

            <ContactForm />
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
      </main>
      <Footer />
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
