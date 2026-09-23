/**
 * Client account (FR/EN shared) — the logged-in patient space.
 *
 * Resolves the READ-ONLY PatientProfile through the real BFF seam
 * (`GET /api/account/profile` → Laravel `getCustomerInformations`). The BFF
 * answers `not-enabled` when `PATIENT_AUTH_ENABLED` is inactive, `unauthenticated`
 * when no session resolves. While the upstream DEV session is blocked, and ONLY
 * when the page has armed the compile-time dev fallback (PROFILE_DEV_FALLBACK=true
 * + NODE_ENV!==production), an unauthenticated result renders the profile view
 * from a clearly-labelled DEV mock so the account UI stays buildable/QA-able.
 * The real seam remains the primary source; the fallback is never persisted,
 * never relayed, and impossible in production.
 *
 * States: loading · profile · anonymous · backend-unavailable ·
 *         not-enabled · dev-fallback (visually identical to profile).
 * Shared by the French (/compte) and English (/en/compte) routes.
 */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/Logo";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import {
  getPatientProfile,
  logoutPatient,
  type PatientAuthFailure,
  type PatientProfileResult,
} from "@/lib/patient-auth-client";
import { PROFILE_DEV_FALLBACK_ENABLED, getDevFallbackProfile } from "@/lib/patient-auth/profile-dev-fallback";

type Screen =
  | { name: "loading" }
  | { name: "profile"; profile: import("@/lib/patient-auth/profile").PatientProfile }
  | { name: "anonymous" }
  | { name: "backend-unavailable" }
  | { name: "not-enabled" };

/** Standard text-field styling (read-only), reused across the account cards. */
const readonlyFieldBox =
  "rounded-xl border border-[#0B1220]/[0.08] bg-white px-4 py-3 text-sm text-[#0B1220]";

export default function CompteClient({ devFallback = false }: { devFallback?: boolean }) {
  const { locale, t } = useLocale();
  const [screen, setScreen] = useState<Screen>({ name: "loading" });
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string>();

  const check = async () => {
    let res: PatientProfileResult;
    try {
      res = await getPatientProfile();
    } catch {
      setScreen({ name: "backend-unavailable" });
      return;
    }

    if (res.success && res.type === "success" && res.profile) {
      setScreen({ name: "profile", profile: res.profile });
      return;
    }

    // Surface the upstream seam truth, but let the DEV fallback render the
    // account UI when the upstream session is blocked locally.
    if (
      res.type === "unauthenticated" &&
      devFallback === true &&
      PROFILE_DEV_FALLBACK_ENABLED === true
    ) {
      // eslint-disable-next-line no-console
      console.info("[DEV] patient-profile fallback: upstream /api/account/profile is unauthenticated; rendering DEV-only mock profile for visual QA.");
      setScreen({ name: "profile", profile: getDevFallbackProfile() });
      return;
    }

    if (res.type === "unauthenticated") setScreen({ name: "anonymous" });
    else if (res.type === "not-enabled") setScreen({ name: "not-enabled" });
    else setScreen({ name: "backend-unavailable" });
  };

  useEffect(() => {
    void check();
    return () => {
      // no-op cleanup to keep the initial mount effect debt-free
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError(undefined);
    try {
      const res = await logoutPatient();
      if (res.success) {
        setScreen({ name: "anonymous" });
        setLoggingOut(false);
        return;
      }
      if (res.type === "not-enabled") {
        setScreen({ name: "not-enabled" });
        setLoggingOut(false);
        return;
      }
    } catch {
      // fall through to the generic error
    }
    setLogoutError(t("compte.error"));
    setLoggingOut(false);
  };

  /** Section header shown across account cards (label + thin bronze rule). */
  const SectionEyebrow = ({ children }: { children: string }) => (
    <div className="flex flex-col items-start gap-3">
      <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#B88A5A]">
        {children}
      </span>
      <span className="block w-8 h-[2px] bg-[#B88A5A]/60" aria-hidden="true" />
    </div>
  );

  /** Reusable read-only field row (label + value rendered in a soft readonly box). */
  const ReadonlyField = ({ label, value, mono = false }: { label: string; value?: string; mono?: boolean }) => (
    <div>
      <span className="block text-xs font-medium tracking-wide text-[#0B1220]/60 mb-1.5">
        {label}
      </span>
      <div className={`${readonlyFieldBox} ${mono ? "font-mono" : ""}`}>{value || "\u00A0"}</div>
    </div>
  );

  const profile = screen.name === "profile" ? screen.profile : undefined;

  /** Personal information rows (name, email, phone, gender, birth date, city, member since). */
  const accountRows = useMemo(() => {
    if (!profile) return [];
    const rows: { label: string; value: string; mono?: boolean }[] = [
      { label: t("compte.firstName"), value: profile.firstName },
      { label: t("compte.lastName"), value: profile.lastName },
      { label: t("compte.email"), value: profile.email, mono: true },
      { label: t("compte.phone"), value: profile.phone, mono: true },
      { label: t("compte.gender"), value: profile.gender },
      { label: t("compte.birthDate"), value: profile.birthDate },
    ];
    if (profile.city) rows.push({ label: t("compte.city"), value: profile.city });
    if (profile.formattedCreatedAt)
      rows.push({ label: t("compte.memberSince"), value: profile.formattedCreatedAt });
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, locale]);

  const initials = profile
    ? `${(profile.firstName || "")[0] ?? ""}${(profile.lastName || "")[0] ?? ""}`.toUpperCase()
    : "";
  const firstName = profile?.firstName ?? "";
  const greetingName = firstName || profile?.fullName || "";

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F4]">
      <main className="flex-1 flex flex-col px-4 sm:px-6 pt-28 pb-24 sm:pt-32">
        <div className="mx-auto w-full max-w-[880px]">
          <div className="text-center">
            <Link href={h(locale, "/")} className="inline-block" aria-label="Wenaya">
              <Logo />
            </Link>

            <p className="mt-8 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#B88A5A]">
              {t("compte.eyebrow")}
            </p>

            <h1 className="mt-3 heading-serif text-[#0B1220] text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.15]">
              {t("compte.heading")}
            </h1>

            <p className="mt-3 text-sm text-[#2B2F36]/55 leading-relaxed">{t("compte.welcomeBack")}</p>
          </div>

          {/* ── Loading ─────────────────────────────────────────────────────── */}
          {screen.name === "loading" && (
            <div className="mt-12 flex flex-col items-center gap-4" role="status" aria-label="Loading">
              <div className="h-24 w-24 rounded-full bg-[#0B1220]/[0.05] animate-pulse" />
              <div className="h-5 w-48 rounded bg-[#0B1220]/[0.05] animate-pulse" />
              <div className="h-5 w-72 rounded bg-[#0B1220]/[0.05] animate-pulse" />
              <span className="sr-only">{t("compte.loading")}</span>
            </div>
          )}

          {/* ── Profile summary ─────────────────────────────────────────────── */}
          {screen.name === "profile" && profile && (
            <div className="mt-12">
              <div className="rounded-2xl border border-[#B88A5A]/15 bg-white p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {initials ? (
                    <div
                      aria-hidden="true"
                      className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B1220] to-[#2B2F36] text-2xl font-semibold text-white ring-2 ring-[#B88A5A]/30"
                    >
                      {initials}
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-white border border-[#B88A5A]/20 text-[#B88A5A]"
                    >
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="heading-serif text-[#0B1220] text-[clamp(1.35rem,3vw,1.7rem)] leading-snug">
                        {profile.fullName || t("compte.anonymousName")}
                      </h2>
                      <span className="rounded-full border border-[#B88A5A]/25 bg-[#B88A5A]/[0.06] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#B88A5A]">
                        {t("compte.patientLabel")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#2B2F36]/55">{t("compte.manage")}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {profile.email && (
                    <div className="flex items-center gap-3 rounded-xl border border-[#0B1220]/[0.06] bg-[#FAF8F4] px-4 py-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-[#B88A5A]" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-10 6L2 7" />
                      </svg>
                      <span className="truncate text-sm text-[#0B1220]/80">{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3 rounded-xl border border-[#0B1220]/[0.06] bg-[#FAF8F4] px-4 py-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-[#B88A5A]" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span className="truncate text-sm text-[#0B1220]/80">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Personal information ──────────────────────────────────── */}
              <section aria-labelledby="compte-perso" className="mt-6">
                <SectionEyebrow>{t("compte.personalInfo")}</SectionEyebrow>
                <h2 id="compte-perso" className="sr-only">
                  {t("compte.personalInfo")}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 rounded-2xl border border-[#0B1220]/[0.06] bg-white p-6 sm:p-8">
                  {accountRows.map((row) => (
                    <ReadonlyField key={row.label} label={row.label} value={row.value} mono={row.mono} />
                  ))}
                </div>
              </section>

              {/* ── Security ──────────────────────────────────────────────── */}
              <section aria-labelledby="compte-sec" className="mt-8">
                <SectionEyebrow>{t("compte.security")}</SectionEyebrow>
                <h2 id="compte-sec" className="sr-only">
                  {t("compte.security")}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 rounded-2xl border border-[#0B1220]/[0.06] bg-white p-6 sm:p-8">
                  <ReadonlyField label={t("compte.email")} value={profile.email} mono />
                  <ReadonlyField label={t("compte.password")} value={t("compte.maskedPassword")} mono />
                  <div className="sm:col-span-2 rounded-xl border border-[#B88A5A]/10 bg-[#FAF8F4] px-4 py-3">
                    <p className="text-xs leading-relaxed text-[#0B1220]/[0.55]">{t("compte.securityNote")}</p>
                  </div>
                </div>
              </section>

              {/* ── Logout ────────────────────────────────────────────────── */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-label={t("compte.logoutAria")}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#B88A5A]/25 bg-white px-6 py-3 text-sm font-semibold text-[#0B1220]/70 transition-colors hover:bg-[#B88A5A]/[0.05] disabled:opacity-45"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {loggingOut ? t("compte.loggingOut") : t("compte.logout")}
                </button>
                <Link
                  href={h(locale, "/")}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#B88A5A] hover:text-[#9A7242] transition-colors"
                >
                  {t("compte.backHome")}
                </Link>
              </div>

              {logoutError && (
                <p role="alert" className="mt-3 text-xs text-[#B0413E]">
                  {logoutError}
                </p>
              )}
            </div>
          )}

          {/* ── Anonymous / login-needed ───────────────────────────────────── */}
          {screen.name === "anonymous" && (
            <div className="mt-12 rounded-2xl border border-[#B88A5A]/15 bg-white p-6 sm:p-8 text-center">
              <p role="status" className="mx-auto max-w-[420px] text-sm text-[#0B1220]/[0.55] leading-relaxed">
                {t("compte.notLoggedIn")}
              </p>
              <Link
                href={h(locale, "/login")}
                className="mt-6 inline-flex items-center justify-center w-full sm:w-auto sm:px-10 h-12 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)" }}
              >
                {t("compte.goLogin")}
              </Link>
            </div>
          )}

          {/* ── Backend unavailable ────────────────────────────────────────── */}
          {screen.name === "backend-unavailable" && (
            <div className="mt-12 rounded-2xl border border-[#B88A5A]/15 bg-white p-6 sm:p-8 text-center">
              <p role="alert" className="mx-auto max-w-[420px] text-sm text-[#0B1220]/[0.55] leading-relaxed">
                {t("compte.backendUnavailable")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setScreen({ name: "loading" });
                  void check();
                }}
                className="mt-6 inline-flex items-center justify-center w-full sm:w-auto sm:px-10 h-12 rounded-xl border border-[#B88A5A]/25 bg-white text-sm font-semibold text-[#0B1220]/70 transition-colors hover:bg-[#B88A5A]/[0.05]"
              >
                {t("compte.retry")}
              </button>
            </div>
          )}

          {/* ── Not enabled ────────────────────────────────────────────────── */}
          {screen.name === "not-enabled" && (
            <div className="mt-12 rounded-2xl border border-[#B88A5A]/15 bg-white p-6 sm:p-8 text-center">
              <p role="status" className="mx-auto max-w-[420px] text-sm text-[#0B1220]/[0.55] leading-relaxed">
                {t("compte.notEnabled")}
              </p>
              <Link
                href={h(locale, "/")}
                className="mt-6 inline-flex items-center justify-center w-full sm:w-auto sm:px-10 h-12 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)" }}
              >
                {t("compte.backHome")}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}