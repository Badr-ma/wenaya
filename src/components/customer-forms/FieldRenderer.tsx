export type Answer = string | number | boolean | string[];
export type Answers = Record<string, Answer>;

export type FormField = {
  id: string | number;
  type: string;
  label: string;
  helper_text?: string;
  placeholder?: string;
  required?: boolean;
  options?: { id: string | number; value: string }[];
  min_date?: string;
  max_date?: string;
  min_value?: number | string;
  max_value?: number | string;
  step?: number | string;
};

const control = "w-full rounded-xl border border-deep-navy/20 bg-white px-4 py-3 text-deep-navy outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/40";

export default function FieldRenderer({ field, value, change, error, locale }: {
  field: FormField;
  value?: Answer;
  change: (value: Answer) => void;
  error?: string;
  locale: "fr" | "en";
}) {
  const fr = locale === "fr";
  const id = "field-" + field.id;
  const multi = field.type === "multipleChoice";
  const choices = multi || field.type === "radio" || field.type === "yesNo";
  const checkbox = field.type === "singleCheckbox";
  const options = field.type === "yesNo"
    ? [{ id: "yes", value: "yes", label: fr ? "Oui" : "Yes" }, { id: "no", value: "no", label: fr ? "Non" : "No" }]
    : field.options?.map(option => ({ ...option, label: option.value })) ?? [];
  const selected = Array.isArray(value) ? value : [];
  const label = <>{field.label}{field.required && <span aria-hidden="true"> *</span>}</>;
  const describedBy = [field.helper_text && id + "-help", error && id + "-error"].filter(Boolean).join(" ") || undefined;
  const accessibility = { "aria-describedby": describedBy, "aria-invalid": Boolean(error) };
  const common = {
    id, name: String(field.id), className: control, value: typeof value === "string" || typeof value === "number" ? value : "",
    ...accessibility,
  };
  const inputType = ["date", "time", "number"].includes(field.type) ? field.type : "text";

  return (
    <fieldset className="min-w-0 space-y-2.5" {...accessibility}>
      {choices ? <legend className="font-semibold">{label}</legend> :
        !checkbox && <label className="block font-semibold" htmlFor={id}>{label}</label>}
      {field.helper_text && <p id={id + "-help"} className="text-sm text-graphite/80">{field.helper_text}</p>}
      {choices ? <div className="space-y-2">{options.map(option => (
        <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-deep-navy/10 bg-white px-4 py-3 has-checked:border-bronze">
          <input className="size-4 shrink-0 accent-deep-navy" name={id} type={multi ? "checkbox" : "radio"}
            checked={multi ? selected.includes(option.value) : value === option.value}
            onChange={event => change(multi
              ? event.target.checked ? [...selected, option.value] : selected.filter(item => item !== option.value)
              : option.value)} />
          {option.label}
        </label>
      ))}</div> : checkbox ? (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-deep-navy/10 bg-white px-4 py-3 font-semibold">
          <input id={id} type="checkbox" className="size-4 shrink-0 accent-deep-navy" checked={value === true}
            onChange={event => change(event.target.checked)} {...accessibility} />
          {label}
        </label>
      ) : field.type === "dropdown" ? (
        <select {...common} onChange={event => change(event.target.value)}>
          <option value="">{fr ? "Sélectionner une option" : "Select an option"}</option>
          {options.map(option => <option key={option.id} value={option.value}>{option.label}</option>)}
        </select>
      ) : field.type === "longAnswer" ? (
        <textarea {...common} rows={4} placeholder={field.placeholder} onChange={event => change(event.target.value)} />
      ) : (
        <input {...common} type={inputType} placeholder={field.placeholder}
          min={inputType === "date" ? field.min_date : field.min_value}
          max={inputType === "date" ? field.max_date : field.max_value}
          step={inputType === "number" ? field.step || 1 : undefined}
          onChange={event => change(inputType === "number" && event.target.value !== "" ? event.target.valueAsNumber : event.target.value)} />
      )}
      {error && <p id={id + "-error"} className="text-sm text-red-700">{error}</p>}
    </fieldset>
  );
}
