import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — Wenaya | Casablanca, Maroc",
  description: "Contactez Wenaya — 88 Rue De Jabal Azourki, Casablanca. Téléphone : +212 6 66 12 40 35. Ouvert du lundi au samedi de 8h à 20h.",
  alternates: { canonical: "https://www.wenaya.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-[#F2EFE9] pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">Contact</span>
          </div>

          <h1 className="text-[#0B1220] font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.06] tracking-tight mb-6">
            Prenez rendez-vous
          </h1>
          <p className="text-[#2B2F36]/55 text-sm max-w-lg mb-14 leading-relaxed">
            Notre équipe est à votre écoute du lundi au samedi, de 8h à 20h.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-14">
            <div className="space-y-6">
              <InfoCard title="Adresse" icon={<PinIcon />}>
                <p>88 Rue De Jabal Azourki</p>
                <p className="text-[#2B2F36]/50">Casablanca 20930</p>
              </InfoCard>
              <InfoCard title="Téléphone" icon={<PhoneIcon />}>
                <Link href="tel:+212666124035" className="text-[#159AA9] hover:text-[#1AB0C0] transition-colors">
                  +212 6 66 12 40 35
                </Link>
              </InfoCard>
              <InfoCard title="Email" icon={<MailIcon />}>
                <a href="mailto:contact@wenaya.com" className="text-[#159AA9] hover:text-[#1AB0C0] transition-colors">
                  contact@wenaya.com
                </a>
              </InfoCard>
              <InfoCard title="Horaires" icon={<ClockIcon />}>
                <p>Lun–Sam : 8h00 – 20h00</p>
                <p className="text-[#2B2F36]/50">Fermé le dimanche</p>
              </InfoCard>
            </div>

            <div className="bg-white/60 rounded-2xl p-6 sm:p-8 border border-[#0B1220]/[0.06]">
              <h2 className="text-[#0B1220] font-heading font-semibold text-lg mb-6">Envoyez-nous un message</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Prénom" placeholder="Votre prénom" />
                  <Input label="Nom" placeholder="Votre nom" />
                </div>
                <Input label="Email" type="email" placeholder="votre@email.com" />
                <Input label="Téléphone" type="tel" placeholder="+212 6 XX XX XX XX" />
                <div>
                  <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">Message</label>
                  <textarea rows={4} placeholder="Votre message..."
                    className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)] resize-none"
                  />
                </div>
                <button type="button"
                  className="w-full h-11 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                  style={{
                    background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 4px 16px rgba(184,138,90,0.28)",
                  }}
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border border-[#0B1220]/[0.06] h-[250px] sm:h-[320px] bg-white/40 flex items-center justify-center">
            <div className="text-center">
              <PinIcon />
              <p className="text-[#2B2F36]/30 text-sm mt-2">88 Rue De Jabal Azourki, Casablanca</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Input({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder}
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
