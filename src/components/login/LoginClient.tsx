/**
 * Patient Login — presentation-parity with the live Wenaya patient sign-in.
 * Minimal centered column: brand, "Wenaya pour les patients", supporting line,
 * email field with a disabled "Continuer" action + availability notice.
 * Presentation-only until a real patient-auth backend exists — the submit is
 * intentionally disabled and no authentication request is made.
 * Shared by the French (/login) and English (/en/login) routes.
 */
"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { SITE_URL } from "@/lib/site-config";

export default function LoginClient() {
  const { locale, t } = useLocale();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F4]">
      <main className="flex-1 flex flex-col px-6 pt-28 pb-24 sm:pt-32">
        <div className="mx-auto w-full max-w-[400px] flex-1 flex flex-col justify-center">
          <div className="text-center">
            <Link href={h(locale, "/")} className="inline-block" aria-label="Wenaya">
              <Logo />
            </Link>

            <p className="mt-8 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#B88A5A]">
              {t("login.eyebrow")}
            </p>

            <h1 className="mt-3 heading-serif text-[#0B1220] text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.15]">
              {t("login.heading")}
            </h1>

            <p className="mt-3 text-sm text-[#2B2F36]/55 leading-relaxed">
              {t("login.subtitle")}
            </p>
          </div>

          <form className="mt-9 space-y-4 text-left" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5"
              >
                {t("login.email")}
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("login.emailPlaceholder")}
                className="w-full h-12 rounded-xl border border-[#0B1220]/[0.08] bg-white px-4 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
              />
            </div>

            <button
              type="submit"
              disabled
              aria-disabled="true"
              title={t("login.unavailable")}
              className="w-full h-12 rounded-xl text-white text-sm font-semibold disabled:opacity-45 cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              }}
            >
              {t("login.continue")}
            </button>

            <p className="text-center text-xs text-[#0B1220]/40 leading-relaxed">
              {t("login.unavailable")}
            </p>
          </form>

          <div className="mt-8 pt-7 border-t border-[#0B1220]/[0.06] text-center">
            <p className="text-sm text-[#2B2F36]/55">{t("login.noAccount")}</p>
            <Link
              href={`${SITE_URL}/user/sign-up`}
              className="inline-block mt-2 text-sm font-semibold text-[#B88A5A] underline underline-offset-4 decoration-[#B88A5A]/40 hover:decoration-[#B88A5A] transition-colors"
            >
              {t("login.createAccount")}
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-x-4 text-[11px] text-[#2B2F36]/45">
            <Link href={h(locale, "/conditions")} className="hover:text-[#0B1220] transition-colors">
              {t("login.terms")}
            </Link>
            <span className="w-1 h-1 rounded-full bg-[#B88A5A]" aria-hidden="true" />
            <Link href={h(locale, "/confidentialite")} className="hover:text-[#0B1220] transition-colors">
              {t("login.privacy")}
            </Link>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#2B2F36]/35">
            {t("login.footer")}
          </p>
        </div>
      </main>
    </div>
  );
}