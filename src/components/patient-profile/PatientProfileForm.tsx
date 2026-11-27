"use client";

import { httpRequest } from "@/lib/http-request";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProfileMode = "create" | "edit";
type ProfileType = "self" | "child";
type FormLocale = "fr" | "en";
type Source = { id: string; name: string };
type Profile = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  country_code?: string;
  emergencyPhone?: string;
  birth_date?: string;
  gender?: string;
  source_id?: string | number;
  other?: string;
  informations?: string;
  has_legal_guardian?: boolean;
  profile_type?: ProfileType;
};
type ApiResult = {
  success?: boolean;
  type?: string;
  message?: string;
  profile?: Profile;
  sources?: Source[];
  fields?: unknown;
};

const fieldClass =
  "w-full rounded-xl border border-[#0B1220]/15 bg-white px-4 py-3 text-sm text-[#0B1220] outline-none transition focus:border-[#B88A5A] focus:ring-2 focus:ring-[#B88A5A]/15 disabled:bg-[#F2EFE9] disabled:text-[#0B1220]/55";
const labelClass = "mb-1.5 block text-sm font-medium text-[#0B1220]/75";

const copy = {
  fr: {
    patientSpace: "Espace patient", editTitle: "Modifier le patient", createTitle: "Vos informations", home: "Accueil", homeAria: "Retour à l’accueil",
    loading: "Chargement du formulaire…", loginPrompt: "Connectez-vous pour continuer, puis rouvrez le lien reçu.", login: "Se connecter", saved: "Enregistré", thanks: "Merci", returnHome: "Retour à Wenaya",
    unavailable: "Profil indisponible", unavailableText: "Le profil n’a pas pu être chargé. Aucun changement ne peut être enregistré depuis ce lien pour le moment.", retry: "Réessayer",
    profileType: "Type de profil", profileTypeLocked: "Le type de profil ne peut pas être modifié.", profileTypePrompt: "Choisissez la personne concernée par les informations.",
    self: "Je remplis ce profil pour moi-même", selfDescription: "Créer un profil personnel pour vos propres soins", child: "Je remplis ce profil pour un proche", childDescription: "Créer un profil pour un enfant ou une personne dont vous êtes responsable",
    patientInfo: "Informations du patient", patientInfoDescription: "Renseignez les informations personnelles du patient.", firstName: "Prénom", lastName: "Nom de famille", readOnly: "Ce champ ne peut pas être modifié ici.",
    gender: "Genre", select: "Sélectionner une option", male: "Homme", female: "Femme", birthDate: "Date de naissance", contact: "Informations de contact", countryCode: "Indicatif", phone: "Numéro de téléphone", email: "Adresse email",
    guardian: "Informations du parent ou responsable légal", guardianDescription: "Ces informations permettent de vous contacter au sujet du profil.", guardianFirst: "Prénom du responsable", guardianLast: "Nom du responsable", guardianPhone: "Téléphone du responsable", guardianEmail: "Email du responsable",
    referral: "Où avez-vous entendu parler de nous ?", referralDescription: "Aidez-nous à améliorer nos services en nous indiquant comment vous nous avez découverts.", referralLabel: "Comment nous avez-vous connus ?", consultation: "Motif de consultation et/ou professionnel recherché", additional: "Information additionnelle", additionalDescription: "Informations complémentaires pour une meilleure prise en charge.", emergencyPhone: "Téléphone d’urgence", cancel: "Annuler", save: "Enregistrer", saving: "Enregistrement…",
    loadError: "Impossible de charger ce profil. Vérifiez le lien puis réessayez.", connectionError: "La connexion a échoué. Vérifiez votre connexion puis réessayez.", saveError: "Enregistrement impossible pour le moment. Vérifiez les champs et réessayez.", loginRequired: "Connectez-vous pour continuer, puis rouvrez ce lien.", saveConnectionError: "La connexion a échoué. Vos informations n’ont pas été confirmées comme enregistrées.", created: "Votre profil a été créé.", updated: "Votre profil a été mis à jour.",
    sources: { "1": "Médecin traitant", "2": "Bouche a Oreille", "3": "Instagram", "4": "Facebook", "5": "LinkedIn", "6": "Tiktok", "7": "YouTube", "8": "Recherche Web" },
  },
  en: {
    patientSpace: "Patient space", editTitle: "Edit patient profile", createTitle: "Your information", home: "Home", homeAria: "Back to home",
    loading: "Loading form…", loginPrompt: "Sign in to continue, then reopen the link you received.", login: "Sign in", saved: "Saved", thanks: "Thank you", returnHome: "Return to Wenaya",
    unavailable: "Profile unavailable", unavailableText: "The profile could not be loaded. No changes can be saved from this link right now.", retry: "Try again",
    profileType: "Profile type", profileTypeLocked: "The profile type cannot be changed.", profileTypePrompt: "Choose whose information this profile contains.",
    self: "I am filling this out for myself", selfDescription: "Create a personal profile for your own care", child: "I am filling this out for someone else", childDescription: "Create a profile for a child or someone in your care",
    patientInfo: "Patient information", patientInfoDescription: "Enter the patient’s personal information.", firstName: "First name", lastName: "Last name", readOnly: "This field cannot be changed here.",
    gender: "Gender", select: "Select an option", male: "Male", female: "Female", birthDate: "Date of birth", contact: "Contact information", countryCode: "Country code", phone: "Phone number", email: "Email address",
    guardian: "Parent or legal guardian information", guardianDescription: "We use these details to contact you about the profile.", guardianFirst: "Guardian’s first name", guardianLast: "Guardian’s last name", guardianPhone: "Guardian’s phone number", guardianEmail: "Guardian’s email",
    referral: "How did you hear about us?", referralDescription: "Help us improve our services by telling us how you found us.", referralLabel: "How did you hear about us?", consultation: "Reason for consultation and/or professional you are looking for", additional: "Additional information", additionalDescription: "Share any additional information that may help us provide your care.", emergencyPhone: "Emergency phone number", cancel: "Cancel", save: "Save", saving: "Saving…",
    loadError: "Could not load this profile. Check the link and try again.", connectionError: "Connection failed. Check your connection and try again.", saveError: "Could not save right now. Check the fields and try again.", loginRequired: "Sign in to continue, then reopen this link.", saveConnectionError: "Connection failed. We could not confirm that your information was saved.", created: "Your profile has been created.", updated: "Your profile has been updated.",
    sources: { "1": "Primary care physician", "2": "Word of mouth", "3": "Instagram", "4": "Facebook", "5": "LinkedIn", "6": "TikTok", "7": "YouTube", "8": "Web search" },
  },
} as const;

function text(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function dateForInput(value: unknown): string {
  const raw = text(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const match = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(raw);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : "";
}

function errorFields(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([key, item]) => {
      const message = Array.isArray(item) ? item.find((entry) => typeof entry === "string") : item;
      return typeof message === "string" ? [[key, message]] : [];
    }),
  );
}

export default function PatientProfileForm({
  mode,
  profileId,
  locale = "fr",
}: {
  mode: ProfileMode;
  profileId?: string;
  locale?: FormLocale;
}) {
  const t = copy[locale];
  const [profile, setProfile] = useState<Profile>();
  const [sources, setSources] = useState<Source[]>([]);
  const [profileType, setProfileType] = useState<ProfileType>("self");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setPageError("");
      try {
        const requests: Promise<Response>[] = [httpRequest("/api/patient/profile-sources", { cache: "no-store" })];
        if (mode === "edit" && profileId) {
          requests.push(httpRequest(`/api/patient/profiles/${encodeURIComponent(profileId)}`, { cache: "no-store" }));
        }
        const [sourceResponse, profileResponse] = await Promise.all(requests);
        const sourceResult = await sourceResponse.json() as ApiResult;
        if (!active) return;
        if (sourceResult.success && Array.isArray(sourceResult.sources)) setSources(sourceResult.sources);

        if (profileResponse) {
          const result = await profileResponse.json() as ApiResult;
          if (!active) return;
          if (!profileResponse.ok || !result.success || !result.profile) {
            if (profileResponse.status === 401 || profileResponse.status === 403) setNeedsLogin(true);
            else setPageError(t.loadError);
          } else {
            setProfile(result.profile);
            setProfileType(result.profile.has_legal_guardian ? "child" : "self");
          }
        }
      } catch {
        if (active) setPageError(t.connectionError);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [mode, profileId]);

  const isEdit = mode === "edit";
  const isChild = profileType === "child";
  const loginHref = useMemo(() => {
    const path = typeof window === "undefined" ? "/" : `${window.location.pathname}${window.location.search}`;
    return `${locale === "en" ? "/en/login" : "/login"}?returnTo=${encodeURIComponent(path)}`;
  }, [locale]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    const birthDate = value("birth_date");
    const body: Record<string, unknown> = isEdit
      ? {
          emergencyPhone: value("emergencyPhone"),
          birth_date: birthDate,
          gender: value("gender"),
          source_id: value("source_id"),
          informations: value("informations"),
          has_legal_guardian: isChild,
          companyName: "",
          profile_type: profileType,
        }
      : {
          first_name: value("first_name"),
          last_name: value("last_name"),
          emergencyPhone: value("emergencyPhone"),
          birth_date: birthDate,
          gender: value("gender"),
          source_id: value("source_id"),
          type: "offline",
          informations: value("informations"),
          password: "",
          address: {},
          has_legal_guardian: isChild,
          parent_first_name: value("parent_first_name"),
          parent_last_name: value("parent_last_name"),
          parent_phone_number: value("parent_phone_number"),
          parent_email: value("parent_email"),
          legal_guardian_id: null,
          companyName: "",
          profile_type: profileType,
          ...(isChild ? {} : {
            email: value("email"),
            phone_number: value("phone_number"),
            country_code: value("country_code") || "212",
          }),
        };
    setSaving(true);
    setErrors({});
    setPageError("");
    setSuccessMessage("");
    try {
      const response = await httpRequest(isEdit ? `/api/patient/profiles/${encodeURIComponent(profileId ?? "")}` : "/api/patient/profiles", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json() as ApiResult;
      if (!response.ok || !result.success) {
        const fields = errorFields(result.fields);
        if (response.status === 401 || response.status === 403) {
          setNeedsLogin(true);
          setPageError(t.loginRequired);
        } else if (Object.keys(fields).length) {
          setErrors(fields);
        } else {
          setPageError(result.message || t.saveError);
        }
        setSaving(false);
        return;
      }
      setSuccessMessage(result.message || (isEdit ? t.updated : t.created));
      setSaving(false);
    } catch {
      setPageError(t.saveConnectionError);
      setSaving(false);
    }
  };

  const fieldError = (key: string) => errors[key] ? <p className="mt-1 text-xs text-red-700" role="alert">{errors[key]}</p> : null;
  const genderValue = text(profile?.gender);
  const sourceValue = text(profile?.source_id);

  return (
    <main className="min-h-screen bg-[#F2EFE9] px-4 pb-24 pt-24 sm:px-6 sm:pb-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B88A5A]">{t.patientSpace}</p>
            <h1 className="mt-1 heading-serif text-2xl text-[#0B1220] sm:text-3xl">
              {isEdit ? t.editTitle : t.createTitle}
            </h1>
          </div>
          <Link href={locale === "en" ? "/en" : "/"} aria-label={t.homeAria} className="rounded-full border border-[#0B1220]/15 bg-white px-4 py-2 text-sm text-[#0B1220] hover:bg-[#0B1220]/5">
            {t.home}
          </Link>
        </header>

        {loading ? (
          <div className="rounded-2xl border border-[#0B1220]/10 bg-white p-8 text-sm text-[#0B1220]/60" role="status">{t.loading}</div>
        ) : (
          <>
            {needsLogin && (
              <div className="mb-4 rounded-xl border border-[#B88A5A]/30 bg-white p-4 text-sm text-[#0B1220]">
                {t.loginPrompt}
                <Link className="ml-1 font-semibold underline" href={loginHref}>{t.login}</Link>
              </div>
            )}
            {pageError && <p className="mb-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-800" role="alert">{pageError}</p>}
            {successMessage ? (
              <section className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8" role="status">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{t.saved}</p>
                <h2 className="mt-2 heading-serif text-2xl text-[#0B1220]">{t.thanks}</h2>
                <p className="mt-3 text-sm leading-6 text-[#0B1220]/70">{successMessage}</p>
                <Link className="mt-6 inline-flex rounded-full bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white" href={locale === "en" ? "/en" : "/"}>{t.returnHome}</Link>
              </section>
            ) : isEdit && !profile ? (
              <section className="rounded-2xl border border-[#0B1220]/10 bg-white p-6 sm:p-8">
                <h2 className="heading-serif text-xl text-[#0B1220]">{t.unavailable}</h2>
                <p className="mt-2 text-sm leading-6 text-[#0B1220]/65">{t.unavailableText}</p>
                <button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-full bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white">{t.retry}</button>
              </section>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <section className="rounded-2xl border border-[#0B1220]/10 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="heading-serif text-xl text-[#0B1220]">{t.profileType}</h2>
                  <p className="mt-1 text-sm text-[#0B1220]/60">{isEdit ? t.profileTypeLocked : t.profileTypePrompt}</p>
                  {isEdit ? (
                    <div className="mt-4 rounded-xl bg-[#F2EFE9] p-4 text-sm font-medium text-[#0B1220]">
                      {isChild ? t.child : t.self}
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {([
                        ["self", t.self, t.selfDescription],
                        ["child", t.child, t.childDescription],
                      ] as const).map(([value, title, description]) => (
                        <button key={value} type="button" onClick={() => setProfileType(value)} aria-pressed={profileType === value}
                          className={`rounded-xl border p-4 text-left transition ${profileType === value ? "border-[#B88A5A] bg-[#B88A5A]/5" : "border-[#0B1220]/10 hover:border-[#B88A5A]/50"}`}>
                          <span className="block text-sm font-semibold text-[#0B1220]">{title}</span>
                          <span className="mt-1 block text-xs leading-5 text-[#0B1220]/60">{description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-[#0B1220]/10 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="heading-serif text-xl text-[#0B1220]">{t.patientInfo}</h2>
                  <p className="mt-1 text-sm text-[#0B1220]/60">{t.patientInfoDescription}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="patient-first-name">{t.firstName}{!isEdit && " *"}</label>
                      <input id="patient-first-name" name="first_name" className={fieldClass} defaultValue={profile?.first_name ?? ""} readOnly={isEdit} required={!isEdit} maxLength={100} autoComplete="given-name" />
                      {isEdit && <p className="mt-1 text-xs text-[#0B1220]/50">{t.readOnly}</p>}
                      {fieldError("first_name")}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="patient-last-name">{t.lastName}{!isEdit && " *"}</label>
                      <input id="patient-last-name" name="last_name" className={fieldClass} defaultValue={profile?.last_name ?? ""} readOnly={isEdit} required={!isEdit} maxLength={100} autoComplete="family-name" />
                      {isEdit && <p className="mt-1 text-xs text-[#0B1220]/50">{t.readOnly}</p>}
                      {fieldError("last_name")}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="patient-gender">{t.gender} *</label>
                      <select id="patient-gender" name="gender" className={fieldClass} defaultValue={genderValue} required>
                        <option value="">{t.select}</option>
                        <option value="male">{t.male}</option>
                        <option value="female">{t.female}</option>
                      </select>
                      {fieldError("gender")}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="patient-birth-date">{t.birthDate}</label>
                      <input id="patient-birth-date" name="birth_date" type="date" className={fieldClass} defaultValue={dateForInput(profile?.birth_date)} />
                      {fieldError("birth_date")}
                    </div>
                  </div>
                </section>

                {(!isEdit || !isChild) && (
                  <section className="rounded-2xl border border-[#0B1220]/10 bg-white p-5 shadow-sm sm:p-7">
                    <h2 className="heading-serif text-xl text-[#0B1220]">{t.contact}</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_2fr]">
                      <div>
                        <label className={labelClass} htmlFor="patient-country-code">{t.countryCode}</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#0B1220]/55">+</span>
                          <input id="patient-country-code" name="country_code" className={fieldClass} defaultValue={text(profile?.country_code) || "212"} inputMode="numeric" maxLength={10} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="patient-phone">{t.phone} *</label>
                        <input id="patient-phone" name="phone_number" type="tel" className={fieldClass} defaultValue={text(profile?.phone_number)} required maxLength={40} autoComplete="tel-national" />
                        {fieldError("phone_number")}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className={labelClass} htmlFor="patient-email">{t.email} *</label>
                      <input id="patient-email" name="email" type="email" className={fieldClass} defaultValue={text(profile?.email)} required maxLength={254} autoComplete="email" />
                      {fieldError("email")}
                    </div>
                  </section>
                )}

                {isChild && !isEdit && (
                  <section className="rounded-2xl border border-[#0B1220]/10 bg-white p-5 shadow-sm sm:p-7">
                    <h2 className="heading-serif text-xl text-[#0B1220]">{t.guardian}</h2>
                    <p className="mt-1 text-sm text-[#0B1220]/60">{t.guardianDescription}</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {([
                        ["parent_first_name", t.guardianFirst, "text", true],
                        ["parent_last_name", t.guardianLast, "text", true],
                        ["parent_phone_number", t.guardianPhone, "tel", true],
                        ["parent_email", t.guardianEmail, "email", true],
                      ] as const).map(([name, label, type, required]) => (
                        <div key={name}>
                          <label className={labelClass} htmlFor={name}>{label} *</label>
                          <input id={name} name={name} type={type} className={fieldClass} required={required} maxLength={254} />
                          {fieldError(name)}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-[#0B1220]/10 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="heading-serif text-xl text-[#0B1220]">{t.referral}</h2>
                  <p className="mt-1 text-sm text-[#0B1220]/60">{t.referralDescription}</p>
                  <div className="mt-5">
                    <label className={labelClass} htmlFor="patient-source">{t.referralLabel}</label>
                    <select id="patient-source" name="source_id" className={fieldClass} defaultValue={sourceValue}>
                      <option value="">{t.select}</option>
                      {sources.map((source) => <option key={source.id} value={source.id}>{t.sources[source.id as keyof typeof t.sources] ?? source.name}</option>)}
                    </select>
                    {fieldError("source_id")}
                  </div>
                  <div className="mt-4">
                    <label className={labelClass} htmlFor="patient-information">{t.consultation}</label>
                    <textarea id="patient-information" name="informations" rows={4} className={fieldClass} defaultValue={text(profile?.other ?? profile?.informations)} maxLength={1000} />
                    {fieldError("informations")}
                  </div>
                </section>

                <section className="rounded-2xl border border-[#0B1220]/10 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="heading-serif text-xl text-[#0B1220]">{t.additional}</h2>
                  <p className="mt-1 text-sm text-[#0B1220]/60">{t.additionalDescription}</p>
                  <div className="mt-5 max-w-md">
                    <label className={labelClass} htmlFor="patient-emergency-phone">{t.emergencyPhone}</label>
                    <input id="patient-emergency-phone" name="emergencyPhone" type="tel" className={fieldClass} defaultValue={text(profile?.emergencyPhone)} maxLength={40} />
                    {fieldError("emergencyPhone")}
                  </div>
                </section>

                <div className="sticky bottom-3 z-10 flex justify-end gap-3 rounded-2xl border border-[#0B1220]/10 bg-white/95 p-3 shadow-lg backdrop-blur">
                  <Link href={locale === "en" ? "/en" : "/"} className="rounded-full border border-[#0B1220]/15 px-5 py-3 text-sm font-semibold text-[#0B1220]">{t.cancel}</Link>
                  <button type="submit" disabled={saving} className="rounded-full bg-[#0B1220] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17233A] disabled:cursor-wait disabled:opacity-60">
                    {saving ? t.saving : t.save}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}
