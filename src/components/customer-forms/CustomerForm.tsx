"use client";

import { httpRequest } from "@/lib/http-request";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import FieldRenderer, { type Answers, type FormField } from "./FieldRenderer";

type Section = { id?: string | number; title?: string; description?: string; fields: FormField[] };
type FormDefinition = { title: string; description?: string; sections: Section[] };
type Errors = Record<string, string>;

function validForm(value: unknown): value is FormDefinition {
  if (!value || typeof value !== "object") return false;
  const form = value as FormDefinition;
  return typeof form.title === "string" && Array.isArray(form.sections) && form.sections.length > 0 &&
    form.sections.every(section => section && Array.isArray(section.fields) && section.fields.every(field =>
      field && ["string", "number"].includes(typeof field.id) && typeof field.type === "string" && typeof field.label === "string",
    ));
}

function validate(fields: FormField[], answers: Answers, fr: boolean): Errors {
  return Object.fromEntries(fields.flatMap(field => {
    const value = answers[field.id];
    const empty = value === undefined || value === "" || value === false || (Array.isArray(value) && value.length === 0);
    if (empty) return field.required ? [[field.id, fr ? "Ce champ est obligatoire." : "This field is required."]] : [];
    if (field.type === "number" && (typeof value !== "number" || !Number.isFinite(value) ||
      (field.min_value != null && value < Number(field.min_value)) ||
      (field.max_value != null && value > Number(field.max_value)))) {
      return [[field.id, fr ? "Saisissez un nombre dans les limites indiquées." : "Enter a number within the specified limits."]];
    }
    if (field.type === "date" && typeof value === "string" &&
      ((field.min_date && value < field.min_date) || (field.max_date && value > field.max_date))) {
      return [[field.id, fr ? "Choisissez une date dans les limites indiquées." : "Choose a date within the specified limits."]];
    }
    return [];
  }));
}

export default function CustomerForm({ id, customerId, locale }: {
  id: string;
  customerId?: string;
  locale: "fr" | "en";
}) {
  const fr = locale === "fr";
  const url = "/api/customer/forms/" + encodeURIComponent(id);
  const [attempt, setAttempt] = useState(0);
  const [load, setLoad] = useState<{ attempt: number; form: FormDefinition | null }>();
  const draftKey = "customer-form:" + JSON.stringify([id, customerId]);
  const [answers, setAnswers] = useState<Answers>(() => {
    try {
      const draft: unknown = JSON.parse(sessionStorage.getItem(draftKey) ?? "{}");
      return draft && typeof draft === "object" && !Array.isArray(draft) ? draft as Answers : {};
    } catch {
      return {};
    }
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const sending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    httpRequest(url, {
      signal: controller.signal,
      headers: { company: localStorage.getItem("selectedCompany") || "1" },
    }).then(async response => {
      const payload = response.ok ? await response.json() : null;
      if (!controller.signal.aborted) setLoad({ attempt, form: validForm(payload?.form) ? payload.form : null });
    }).catch(() => {
      if (!controller.signal.aborted) setLoad({ attempt, form: null });
    });
    return () => controller.abort();
  }, [attempt, url]);

  useEffect(() => {
    if (!Object.keys(answers).length || complete) return;
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(answers));
    } catch {
      // The form remains usable when browser storage is unavailable.
    }
  }, [answers, complete, draftKey]);

  const form = load?.attempt === attempt ? load.form : undefined;
  const section = form?.sections[step];
  const last = form ? step === form.sections.length - 1 : false;
  const primary = "rounded-full bg-deep-navy px-6 py-3 text-sm font-semibold text-white hover:bg-graphite disabled:opacity-50";
  const secondary = "rounded-full border border-deep-navy/20 px-6 py-3 text-sm font-semibold text-deep-navy hover:bg-warm-sand";

  function goTo(next: number) {
    setStep(next);
    heading.current?.focus();
  }

  async function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !section || sending.current) return;
    const invalid = validate(last ? form.sections.flatMap(item => item.fields) : section.fields, answers, fr);
    setErrors(invalid);
    setSubmitError("");
    if (Object.keys(invalid).length) {
      goTo(form.sections.findIndex(item => item.fields.some(field => Object.prototype.hasOwnProperty.call(invalid, field.id))));
      return;
    }
    if (!last) {
      goTo(step + 1);
      return;
    }

    sending.current = true;
    setPending(true);
    try {
      const response = await httpRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", company: localStorage.getItem("selectedCompany") || "1" },
        body: JSON.stringify({ answers, customer_id: customerId }),
      });
      const payload = await response.json();
      if (response.ok && payload?.success !== false && payload?.error !== true) {
        try {
          sessionStorage.removeItem(draftKey);
        } catch {
          // A storage failure does not invalidate a successful submission.
        }
        setAnswers({});
        setComplete(true);
        heading.current?.focus();
        return;
      }
      if (response.status === 422 && payload?.errors && typeof payload.errors === "object") {
        const mapped: Errors = Object.fromEntries(form.sections.flatMap(item => item.fields.flatMap(field => {
          const raw = payload.errors["answers." + field.id] ?? payload.errors[field.id];
          const message = Array.isArray(raw) ? raw[0] : raw;
          return typeof message === "string" ? [[field.id, message]] : [];
        })));
        const errorStep = form.sections.findIndex(item => item.fields.some(field => Object.prototype.hasOwnProperty.call(mapped, field.id)));
        if (errorStep >= 0) {
          setErrors(mapped);
          goTo(errorStep);
        }
      }
      setSubmitError(response.status === 422
        ? fr ? "Vérifiez vos réponses et réessayez." : "Check your answers and try again."
        : fr ? "Impossible d’envoyer le formulaire. Réessayez." : "We couldn’t submit the form. Please try again.");
    } catch {
      setSubmitError(fr ? "Impossible d’envoyer le formulaire. Réessayez." : "We couldn’t submit the form. Please try again.");
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen px-4 pb-16 pt-32 text-deep-navy sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-2xl rounded-3xl border border-deep-navy/10 bg-ivory p-6 shadow-sm sm:p-10">
        <h1 ref={heading} tabIndex={-1} className="font-heading text-3xl font-bold tracking-tight outline-none sm:text-4xl">
          {complete ? fr ? "Formulaire envoyé" : "Form submitted" : form?.title || (fr ? "Formulaire" : "Form")}
        </h1>
        {complete ? (
          <div className="mt-5 space-y-6">
            <p role="status">{fr ? "Merci, vos réponses ont bien été envoyées." : "Thank you. Your answers have been submitted."}</p>
            <Link className={primary + " inline-block"} href={fr ? "/" : "/en"}>{fr ? "Retour à l’accueil" : "Back to home"}</Link>
          </div>
        ) : form && section ? (
          <>
            {form.description && <p className="mt-3 whitespace-pre-line text-graphite/80">{form.description}</p>}
            <div className="mb-8 mt-7 space-y-2">
              <p className="text-sm font-semibold" aria-live="polite">
                {fr ? "Étape " + (step + 1) + " sur " + form.sections.length : "Step " + (step + 1) + " of " + form.sections.length}
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-warm-sand" aria-hidden="true">
                <div className="h-full rounded-full bg-bronze" style={{ width: ((step + 1) / form.sections.length * 100) + "%" }} />
              </div>
            </div>
            <form onSubmit={advance} className="space-y-6">
              {submitError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{submitError}</p>}
              {section.title && <h2 className="font-heading text-xl font-bold">{section.title}</h2>}
              {section.description && <p className="whitespace-pre-line text-graphite/80">{section.description}</p>}
              {section.fields.map(field => <FieldRenderer key={field.id} field={field} locale={locale}
                value={Object.prototype.hasOwnProperty.call(answers, field.id) ? answers[field.id] : undefined}
                error={Object.prototype.hasOwnProperty.call(errors, field.id) ? errors[field.id] : undefined}
                change={value => setAnswers(previous => ({ ...previous, [field.id]: value }))} />)}
              <div className="flex flex-wrap justify-between gap-3 border-t border-deep-navy/10 pt-6">
                {step > 0 && <button type="button" className={secondary} disabled={pending} onClick={() => goTo(step - 1)}>{fr ? "Précédent" : "Back"}</button>}
                <button type="submit" className={primary + " ml-auto"} disabled={pending}>
                  {pending ? fr ? "Envoi…" : "Submitting…" : last ? fr ? "Envoyer" : "Submit" : fr ? "Suivant" : "Next"}
                </button>
              </div>
            </form>
          </>
        ) : form === null ? (
          <div className="mt-5 space-y-4">
            <p role="alert">{fr ? "Impossible de charger ce formulaire. Vérifiez le lien ou réessayez." : "We couldn’t load this form. Check the link or try again."}</p>
            <button type="button" className={secondary} onClick={() => setAttempt(previous => previous + 1)}>{fr ? "Réessayer" : "Try again"}</button>
          </div>
        ) : <p role="status" className="mt-5">{fr ? "Chargement du formulaire…" : "Loading form…"}</p>}
      </div>
    </main>
  );
}
