/**
 * Clinic Recruitment Modal — centered, accessible dialog for practitioner applications.
 * Rendered by {@link Recruitment} when its CTA is clicked (instead of routing to /contact).
 *
 * Accessibility: role="dialog", aria-modal="true", aria-labelledby, real <label> per field,
 * focus trap + restore to trigger, Escape / X / backdrop close, body scroll lock.
 *
 * Submission is routed through {@link submitPractitionerApplication}, a thin adapter that
 * reuses the existing `/api/contact` endpoint (the only real submission API in the project).
 * Swap that function for a dedicated recruitment backend without touching this component.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";

interface RecruitmentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  message: string;
}

interface PractitionerApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  message: string;
  source: "practitioner-recruitment";
}

const INITIAL_FORM: RecruitmentForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  specialty: "",
  message: "",
};

/**
 * Submission adapter — posts a practitioner application to the existing contact API.
 * Reuses `/api/contact` (project's only real submission endpoint) carrying all fields
 * plus a `source` flag. Replace the base URL / payload with a dedicated recruitment
 * endpoint here when one exists.
 */
function submitPractitionerApplication(payload: PractitionerApplication): Promise<Response> {
  return fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

interface RecruitmentModalProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RecruitmentModal({ open, onClose }: RecruitmentModalProps): React.JSX.Element | null {
  const { t } = useLocale();
  const l = (key: string) => t(`clinic.recruitmentModal.${key}`);

  const [form, setForm] = useState<RecruitmentForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<Element | null>(null);

  const hasRequired =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.specialty.trim();

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((el) => !el.hasAttribute("disabled"));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = dialogRef.current?.contains(active);
      if (e.shiftKey) {
        if (active === first || !inside) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !inside) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => {
      const first = getFocusable()[0] ?? dialogRef.current;
      first?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      (returnFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const setField = (field: keyof RecruitmentForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!hasRequired) {
      setError(l("errorRequired"));
      return;
    }
    if (!isEmailValid(form.email.trim())) {
      setError(l("errorEmail"));
      return;
    }
    setLoading(true);
    try {
      const res = await submitPractitionerApplication({
        ...form,
        source: "practitioner-recruitment",
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError(l("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fieldClasses =
    "w-full bg-white border border-[#0B1220]/[0.12] rounded-lg px-4 py-3 text-[#0B1220] text-sm placeholder:text-[#0B1220]/35 focus:outline-none focus:border-[#B88A5A] focus:ring-2 focus:ring-[#B88A5A]/25 transition";

  const labelClasses = "block text-[#0B1220] text-[13px] font-semibold mb-1.5";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recruitment-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#0B1220]/60 backdrop-blur-sm"
        onClick={handleBackdrop}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative w-full sm:max-w-[520px] max-h-[calc(100dvh-2rem)] bg-[#FAF8F4] rounded-2xl border border-[#0B1220]/[0.08] shadow-[0_24px_64px_-24px_rgba(11,18,32,0.5)] flex flex-col overflow-hidden"
      >
        <div className="flex items-start justify-between px-6 sm:px-8 pt-6 sm:pt-7 pb-4 border-b border-[#0B1220]/[0.06]">
          <div>
            <h2 id="recruitment-modal-title" className="heading-serif text-[#0B1220] text-2xl sm:text-[26px] leading-tight">
              {l("title")}
            </h2>
            <p className="mt-1.5 text-[#2B2F36]/60 text-sm">{l("subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={l("close")}
            className="ml-4 shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#0B1220]/50 hover:text-[#0B1220] hover:bg-[#0B1220]/[0.06] transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#B88A5A]/12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="heading-serif text-[#0B1220] text-lg mb-2">{l("successTitle")}</h3>
              <p className="text-[#2B2F36]/65 text-sm max-w-xs mx-auto">{l("successMsg")}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex items-center justify-center h-11 px-6 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {l("close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="source" value="practitioner-recruitment" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="recruitment-firstName" className={labelClasses}>
                    {l("firstName")} <span aria-hidden="true" className="text-[#B88A5A]">*</span>
                  </label>
                  <input
                    id="recruitment-firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={setField("firstName")}
                    placeholder={l("firstNamePh")}
                    className={fieldClasses}
                  />
                </div>
                <div>
                  <label htmlFor="recruitment-lastName" className={labelClasses}>
                    {l("lastName")} <span aria-hidden="true" className="text-[#B88A5A]">*</span>
                  </label>
                  <input
                    id="recruitment-lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={setField("lastName")}
                    placeholder={l("lastNamePh")}
                    className={fieldClasses}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="recruitment-email" className={labelClasses}>
                    {l("email")} <span aria-hidden="true" className="text-[#B88A5A]">*</span>
                  </label>
                  <input
                    id="recruitment-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder={l("emailPh")}
                    className={fieldClasses}
                  />
                </div>
                <div>
                  <label htmlFor="recruitment-phone" className={labelClasses}>
                    {l("phone")} <span aria-hidden="true" className="text-[#B88A5A]">*</span>
                  </label>
                  <input
                    id="recruitment-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder={l("phonePh")}
                    className={fieldClasses}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="recruitment-specialty" className={labelClasses}>
                  {l("specialty")} <span aria-hidden="true" className="text-[#B88A5A]">*</span>
                </label>
                <input
                  id="recruitment-specialty"
                  name="specialty"
                  type="text"
                  autoComplete="off"
                  value={form.specialty}
                  onChange={setField("specialty")}
                  placeholder={l("specialtyPh")}
                  className={fieldClasses}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="recruitment-message" className={labelClasses}>
                  {l("messageOptional")}
                </label>
                <textarea
                  id="recruitment-message"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={setField("message")}
                  placeholder={l("messagePh")}
                  className={`${fieldClasses} resize-none`}
                />
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-[#B3403A]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex items-center justify-center gap-2.5 w-full h-12 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {loading ? l("sending") : l("submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
