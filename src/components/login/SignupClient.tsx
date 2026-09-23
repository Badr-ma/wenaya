/**
 * Patient Signup — account creation for the Wenaya patient space, mirroring the
 * login page design language (brand → eyebrow → heading → supporting line).
 *
 * Fully wired to the same-origin BFF: `POST /api/auth/register` then
 * `GET /api/auth/me`. The server guards the flow while registration is inactive
 * (`PATIENT_REGISTER_ENABLED`), answering `not-enabled`; the UI then shows the
 * unavailable notice. On success Laravel auto-authenticates (proven on DEV), so
 * the signup succeeds directly into a signed-in success state with a CTA home.
 *
 * Client-side validation is native (required / type=email); per-field server
 * validation errors render localized copy; unknown backend field keys fall back
 * to their (BFF-own) message. Shared by FR (/signup) and EN (/en/signup).
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import {
  getCurrentPatient,
  registerPatient,
  type PatientAuthResult,
} from "@/lib/patient-auth-client";

const FIELD_COPY: Record<string, string> = {
  firstName: "signup.errors.firstName",
  lastName: "signup.errors.lastName",
  email: "signup.errors.email",
  password: "signup.errors.password",
  phone: "signup.errors.phone",
};

export default function SignupClient() {
  const { locale, t } = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [notEnabled, setNotEnabled] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState<string>();
  const [serverFields, setServerFields] = useState<Record<string, string>>();
  const [generalError, setGeneralError] = useState<string>();

  const fieldError = (key: string): string | undefined => {
    const copyKey = FIELD_COPY[key];
    if (copyKey && (serverFields?.[key] || serverFields?.payload)) {
      return t(copyKey);
    }
    return serverFields?.[key];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setServerFields(undefined);
    setGeneralError(undefined);
    setNotEnabled(false);

    const form = e.currentTarget;
    const value = (name: string): string => {
      const el = form.elements.namedItem(name) as HTMLInputElement;
      return el ? String(el.value) : "";
    };
    const body = {
      firstName: value("firstName"),
      lastName: value("lastName"),
      email: value("email"),
      password: value("password"),
      phone: value("phone"),
    };

    let res: PatientAuthResult;
    try {
      res = await registerPatient(body);
    } catch {
      setSubmitting(false);
      setGeneralError(t("signup.errors.generic"));
      return;
    }

    if (res.success) {
      const me = await getCurrentPatient();
      if (me.success) setSuccessName(me.user?.name);
      setSuccess(true);
      setSubmitting(false);
      return;
    }
    if (res.type === "not-enabled") {
      setNotEnabled(true);
      setSubmitting(false);
      return;
    }
    if (res.type === "validation-error") {
      setServerFields(res.fields);
      setSubmitting(false);
      return;
    }
    if (res.type === "unauthenticated" || res.type === "csrf-error" || res.type === "timeout") {
      setGeneralError(t("signup.errors.generic"));
      setSubmitting(false);
      return;
    }
    setGeneralError(t("signup.errors.generic"));
    setSubmitting(false);
  };

  const inputClass =
    "w-full h-12 rounded-xl border border-[#0B1220]/[0.08] bg-white px-4 text-sm text-[#0B1220] placeholder-[#0B1220]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]";

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F4]">
        <main className="flex-1 flex flex-col px-6 pt-28 pb-24 sm:pt-32">
          <div className="mx-auto w-full max-w-[400px] flex-1 flex flex-col justify-center text-center">
            <h1 className="heading-serif text-[#0B1220] text-[clamp(1.6rem,3.4vw,2.1rem)] leading-[1.15]">
              {t("signup.successHeading")}
            </h1>
            <p className="mt-4 text-sm text-[#2B2F36]/60 leading-relaxed">
              {successName ? `${successName} — ` : ""}
              {t("signup.successBody")}
            </p>
            <Link
              href={h(locale, "/")}
              className="mt-8 inline-flex items-center justify-center w-full h-12 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              }}
            >
              {t("signup.backHome")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F4]">
      <main className="flex-1 flex flex-col px-6 pt-28 pb-24 sm:pt-32">
        <div className="mx-auto w-full max-w-[400px] flex-1 flex flex-col justify-center">
          <div className="text-center">
            <Link href={h(locale, "/")} className="inline-block" aria-label="Wenaya">
              <Logo />
            </Link>

            <p className="mt-8 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#B88A5A]">
              {t("signup.eyebrow")}
            </p>

            <h1 className="mt-3 heading-serif text-[#0B1220] text-[clamp(1.6rem,3.6vw,2.1rem)] leading-[1.15]">
              {t("signup.heading")}
            </h1>

            <p className="mt-3 text-sm text-[#2B2F36]/55 leading-relaxed">
              {t("signup.subtitle")}
            </p>
          </div>

          <form className="mt-9 space-y-4 text-left" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="signup-firstname"
                  className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5"
                >
                  {t("signup.firstName")}
                </label>
                <input
                  id="signup-firstname"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder={t("signup.firstNamePlaceholder")}
                  maxLength={100}
                  required
                  className={inputClass}
                />
                {fieldError("firstName") && (
                  <p className="mt-1.5 text-xs text-[#B0413E]" role="alert">
                    {fieldError("firstName")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="signup-lastname"
                  className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5"
                >
                  {t("signup.lastName")}
                </label>
                <input
                  id="signup-lastname"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder={t("signup.lastNamePlaceholder")}
                  maxLength={100}
                  required
                  className={inputClass}
                />
                {fieldError("lastName") && (
                  <p className="mt-1.5 text-xs text-[#B0413E]" role="alert">
                    {fieldError("lastName")}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5"
              >
                {t("signup.email")}
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("signup.emailPlaceholder")}
                maxLength={254}
                required
                className={inputClass}
              />
              {fieldError("email") && (
                <p className="mt-1.5 text-xs text-[#B0413E]" role="alert">
                  {fieldError("email")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="signup-phone"
                className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5"
              >
                {t("signup.phone")}
              </label>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder={t("signup.phonePlaceholder")}
                maxLength={40}
                required
                className={inputClass}
              />
              {fieldError("phone") && (
                <p className="mt-1.5 text-xs text-[#B0413E]" role="alert">
                  {fieldError("phone")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5"
              >
                {t("signup.password")}
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={t("signup.passwordPlaceholder")}
                maxLength={1024}
                required
                className={inputClass}
              />
              {fieldError("password") && (
                <p className="mt-1.5 text-xs text-[#B0413E]" role="alert">
                  {fieldError("password")}
                </p>
              )}
            </div>

            {generalError && (
              <p className="text-center text-xs text-[#B0413E] leading-relaxed" role="alert">
                {generalError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl text-white text-sm font-semibold disabled:opacity-45 transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              }}
            >
              {t("signup.continue")}
            </button>

            {notEnabled && (
              <p className="text-center text-xs text-[#0B1220]/40 leading-relaxed">
                {t("signup.unavailable")}
              </p>
            )}
          </form>

          <div className="mt-8 pt-7 border-t border-[#0B1220]/[0.06] text-center">
            <p className="text-sm text-[#2B2F36]/55">{t("signup.hasAccount")}</p>
            <Link
              href={h(locale, "/login")}
              className="inline-block mt-2 text-sm font-semibold text-[#B88A5A] underline underline-offset-4 decoration-[#B88A5A]/40 hover:decoration-[#B88A5A] transition-colors"
            >
              {t("signup.signIn")}
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-x-4 text-[11px] text-[#2B2F36]/45">
            <Link href={h(locale, "/terms-and-conditions")} className="hover:text-[#0B1220] transition-colors">
              {t("signup.terms")}
            </Link>
            <span className="w-1 h-1 rounded-full bg-[#B88A5A]" aria-hidden="true" />
            <Link href={h(locale, "/privacy-policy")} className="hover:text-[#0B1220] transition-colors">
              {t("signup.privacy")}
            </Link>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#2B2F36]/35">
            {t("signup.footer")}
          </p>
        </div>
      </main>
    </div>
  );
}