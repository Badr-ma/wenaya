/**
 * Homecare Contact — closing navy conversion band for /soins-a-domicile.
 * Server component. Exact live copy + exact WhatsApp destination + phone + hours.
 */
import Link from "next/link";
import HomecareSectionHeading from "./HomecareSectionHeading";

const WHATSAPP_HREF =
  "https://wa.me/212666124035?text=Bonjour,%20je%20souhaite%20obtenir%20des%20informations%20sur%20les%20services%20de%20soins%20%C3%A0%20domicile%20%C3%A0%20Casablanca.";

export default function HomecareContact(): React.JSX.Element {
  return (
    <section
      data-section-bg="dark"
      className="relative bg-[#0B1220] px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto py-16 lg:py-24">
        <div className="max-w-2xl">
          <HomecareSectionHeading variant="dark" eyebrow="Contact" style={{ fontSize: "clamp(1.9rem, 3.4vw, 3rem)" }}>
            Besoin d&apos;une prise en charge à domicile à Casablanca&nbsp;?
          </HomecareSectionHeading>
          <p className="mt-5 text-white/75 text-base lg:text-lg leading-relaxed">
            Chaque situation est unique. Un échange permet de définir rapidement
            une prise en charge claire, sécurisée et adaptée aux besoins du
            patient.
          </p>

          <p className="mt-8 text-white text-xl lg:text-2xl font-medium">
            📞 Contactez Wenaya Homecare Services – Casablanca
          </p>
          <p className="mt-1 text-[#B88A5A] text-sm font-semibold tracking-wide">
            Disponible 24h/24 – 7j/7
          </p>

          <div className="mt-8">
            <Link
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-13 px-8 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
              }}
            >
              Contactez-nous sur WhatsApp
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/12 pt-6 text-sm text-white/55">
            <a href="tel:+212666124035" className="transition-colors hover:text-[#B88A5A]">
              0666-124035
            </a>
            <span>88 Rue De Jabal Azourki,</span>
            <span>Casablanca 20930</span>
          </div>
        </div>
      </div>
    </section>
  );
}
