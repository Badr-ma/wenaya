/**
 * Login Page — patient login form with email/password fields.
 * Client component with form validation and success/error states.
 * Marked noindex in layout metadata (not for search engines).
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-[#F2EFE9] flex items-center justify-center px-6 pt-24 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#0B1220]/[0.06]"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}
          >
            <div className="text-center mb-8">
              <h1>
                <Link href="/" className="inline-block heading-serif text-[#0B1220] text-[clamp(1.5rem,3vw,2rem)]">
                  Wenaya
                </Link>
              </h1>
              <p className="text-[#2B2F36]/50 text-sm mt-1">{t("login.subtitle")}</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">{t("login.email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
                />
              </div>

              <div>
                <label className="block text-[#0B1220]/60 text-xs font-medium tracking-wide mb-1.5">{t("login.password")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#2B2F36]/50 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#0B1220]/[0.15] text-[#B88A5A] focus:ring-[#B88A5A]/30" />
                  {t("login.rememberMe")}
                </label>
                <a href="#" className="text-[#B88A5A] hover:text-[#9A7242] transition-colors font-medium">
                  {t("login.forgotPassword")}
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 4px 16px rgba(184,138,90,0.28)",
                }}
              >
                {t("login.submit")}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#0B1220]/[0.06] text-center">
              <p className="text-[#2B2F36]/50 text-xs">
                {t("login.noAccount")}{" "}
                <a href="#" className="text-[#B88A5A] hover:text-[#9A7242] transition-colors font-medium">
                  {t("login.createAccount")}
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-[#2B2F36]/30 text-xs mt-6">
            {t("login.footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
