/**
 * Patient Login — patient sign-in for the Wenaya patient space.
 *
 * Minimal centered column: brand, "Wenaya pour les patients", supporting line,
 * email + password fields and a functional submit wired to the same-origin BFF
 * (`POST /api/auth/login` then `GET /api/auth/me`). The server guards the flow
 * while patient auth is inactive (`PATIENT_AUTH_ENABLED`), answering
 * `not-enabled`; the UI then shows the unavailable notice. On success the user
 * lands on a signed-in state with a CTA home (no patient dashboard route exists
 * yet — product decision pending; home is the established destination).
 * Shared by the French (/login) and English (/en/login) routes.
 *
 * `returnTo` (optional, same-origin only) resumes an interrupted flow — e.g. the
 * group-session booking panel redirects anonymous visitors here carrying their
 * chosen slot in the query, and on success the client returns to that exact URL
 * so the selection is restored. `safeReturnPath` rejects anything that is not a
 * root-relative internal path (external, protocol-relative or backslash tricks)
 * and never bounces back to a login route, so the param cannot be used as an
 * open redirect. Without a usable `returnTo` the original success card is shown.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { getCurrentPatient, loginPatient, type PatientAuthResult } from "@/lib/patient-auth-client";

export default function LoginClient({ returnTo }: { returnTo?: string }) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [notEnabled, setNotEnabled] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState<string>();
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(undefined);
    setNotEnabled(false);

    const form = e.currentTarget;
    const value = (name: string): string => {
      const el = form.elements.namedItem(name) as HTMLInputElement;
      return el ? String(el.value) : "";
    };

    let res: PatientAuthResult;
    try {
      res = await loginPatient(value("email"), value("password"));
    } catch {
      setSubmitting(false);
      setError(t("login.errorGeneric"));
      return;
    }

    if (res.success) {
      const back = safeReturnPath(returnTo, locale);
      if (back) {
        // Resume the interrupted flow (booking panel restores its slot from the
        // very same URL). No success card: the user already knows they signed in.
        setSubmitting(false);
        router.replace(back);
        return;
      }
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
    setError(t("login.errorGeneric"));
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
              {t("login.successHeading")}
            </h1>
            <p className="mt-4 text-sm text-[#2B2F36]/60 leading-relaxed">
              {successName ? `${successName} — ` : ""}
              {t("login.successBody")}
            </p>
            <Link
              href={h(locale, "/")}
              className="mt-8 inline-flex items-center justify-center w-full h-12 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              }}
            >
              {t("login.backHome")}
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
              {t("login.eyebrow")}
            </p>

            <h1 className="mt-3 heading-serif text-[#0B1220] text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.15]">
              {t("login.heading")}
            </h1>

            <p className="mt-3 text-sm text-[#2B2F36]/55 leading-relaxed">
              {t("login.subtitle")}
            </p>
          </div>

          <form className="mt-9 space-y-4 text-left" onSubmit={handleSubmit} noValidate>
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
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5"
              >
                {t("login.password")}
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={t("login.passwordPlaceholder")}
                required
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-center text-xs text-[#B0413E] leading-relaxed" role="alert">
                {error}
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
              {t("login.continue")}
            </button>

            {notEnabled && (
              <p className="text-center text-xs text-[#0B1220]/40 leading-relaxed">
                {t("login.unavailable")}
              </p>
            )}
          </form>

          <div className="mt-8 pt-7 border-t border-[#0B1220]/[0.06] text-center">
            <p className="text-sm text-[#2B2F36]/55">{t("login.noAccount")}</p>
            <Link
              href={h(locale, "/signup")}
              className="inline-block mt-2 text-sm font-semibold text-[#B88A5A] underline underline-offset-4 decoration-[#B88A5A]/40 hover:decoration-[#B88A5A] transition-colors"
            >
              {t("login.createAccount")}
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-x-4 text-[11px] text-[#2B2F36]/45">
            <Link href={h(locale, "/terms-and-conditions")} className="hover:text-[#0B1220] transition-colors">
              {t("login.terms")}
            </Link>
            <span className="w-1 h-1 rounded-full bg-[#B88A5A]" aria-hidden="true" />
            <Link href={h(locale, "/privacy-policy")} className="hover:text-[#0B1220] transition-colors">
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

/**
 * Validate a `returnTo` value before navigating to it.
 *
 * Only a root-relative internal path is accepted. Rejected: absolute URLs,
 * protocol-relative (`//evil.tld`), backslash variants (`/\evil.tld` — some
 * browsers normalise it to `//`), and the login routes themselves (a loop).
 * Returns `null` when the caller must fall back to the default success card.
 */
function safeReturnPath(value: string | undefined, locale: string): string | null {
  if (typeof value !== "string" || value === "") return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (/[\r\n]/.test(value)) return null;
  const path = value.split(/[?#]/, 1)[0];
  const loginPath = h(locale as "fr" | "en", "/login");
  if (path === loginPath || path === `${loginPath}/`) return null;
  return value;
}