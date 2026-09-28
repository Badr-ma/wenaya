/**
 * WaitingListForm — shared email waiting-list form used on the Shop and
 * Configurator coming-soon pages. One component, two call sites via the
 * `source` prop ("shop" | "configurator") so the stored list is labelled.
 *
 * Behaviour:
 *   - Email required + client-side RFC-ish validation (same regex as the API).
 *   - Consent checkbox required every time (starts unchecked); the label links
 *     to the privacy policy.
 *   - POSTs to /api/waiting-list (the only submission seam).
 *   - Loading state on the button; success / error messages are i18n'd and
 *     announced via role="status" / role="alert".
 *   - Never shows success unless the API actually persisted the email.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import type { WaitingListSource } from "@/lib/waiting-list";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface WaitingListFormProps {
  source: WaitingListSource;
}

export default function WaitingListForm({ source }: WaitingListFormProps) {
  const { t, locale } = useLocale();

  const [email, setEmail] = useState("");
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>("");

  const inputId = `waiting-list-${source}-email`;
  const consentId = `waiting-list-${source}-consent`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(email)) {
      setError(t("waitingList.errorInvalidEmail"));
      return;
    }
    if (!consented) {
      setError(t("waitingList.errorConsent"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/waiting-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source, locale, consented: true }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;

      if (res.ok && data?.success === true) {
        setDone(true);
        setEmail("");
        setConsented(false);
      } else {
        setError(res.status === 503 ? t("waitingList.errorStorage") : t("waitingList.errorGeneric"));
      }
    } catch {
      setError(t("waitingList.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-14 sm:mt-16 border-t border-[#B88A5A]/25 pt-10 sm:pt-12">
      <div className="bg-[#FAF8F4] border border-[#B88A5A]/25 rounded-2xl p-6 sm:p-8">
        {done ? (
          <div role="status" className="text-center">
            <p className="text-[#0B1220] heading-serif text-xl sm:text-2xl mb-2">
              {t("waitingList.successTitle")}
            </p>
            <p className="text-[#2B2F36]/65 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {t("waitingList.success")}
            </p>
          </div>
        ) : (
          <>
            <p className="text-[#0B1220] text-base sm:text-lg font-medium leading-relaxed text-center mb-6">
              {t(source === "shop" ? "waitingList.shopPrompt" : "waitingList.configuratorPrompt")}
            </p>
            <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto">
              <label htmlFor={inputId} className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B88A5A] mb-2">
                {t("waitingList.emailLabel")}
              </label>
              <input
                id={inputId}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("waitingList.emailPlaceholder")}
                aria-invalid={error ? true : undefined}
                className="w-full h-12 rounded-xl border border-[#0B1220]/[0.10] bg-white px-4 text-sm text-[#0B1220] placeholder:text-[#2B2F36]/35 focus:border-[#B88A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A]/40 transition-colors"
              />
              <div className="mt-4">
                <label htmlFor={consentId} className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    id={consentId}
                    type="checkbox"
                    checked={consented}
                    onChange={(e) => setConsented(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#B88A5A]"
                  />
                  <span className="text-[#2B2F36]/60 text-xs leading-relaxed">
                    {t("waitingList.consent")}{" "}
                    <Link
                      href={h(locale, "/privacy-policy")}
                      className="text-[#B88A5A] underline decoration-[#B88A5A]/40 underline-offset-2 hover:decoration-[#B88A5A] transition-colors"
                    >
                      {t("waitingList.privacy")}
                    </Link>
                  </span>
                </label>
              </div>
              {error ? (
                <p role="alert" className="mt-3 text-xs text-[#B4552D] leading-relaxed">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full inline-flex items-center justify-center h-12 rounded-xl text-sm font-semibold text-white bg-gradient-to-b from-[#B88A5A] to-[#9A7242] hover:from-[#c4976b] hover:to-[#a58052] disabled:opacity-60 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
              >
                {submitting ? t("waitingList.submitting") : t("waitingList.submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}