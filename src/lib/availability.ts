/**
 * Availability calendar utilities — derive a month-long schedule from each
 * specialist's weekly availability pattern (weekday → time slots).
 */

import type { Specialist } from "./specialistes";

export interface AvailabilityDay {
  day: string;
  date: string;
  month: string;
  iso: string;
  slots: { time: string; available: boolean }[];
  closed: boolean;
  isPast: boolean;
}

export const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

/** Weekday label per JS getDay() (0 = Sunday) */
export const WEEKDAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/** Calendar column headers, Monday-first */
export const WEEKDAY_INITIALS = ["L", "M", "M", "J", "V", "S", "D"];

function toIso(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Map each working weekday to its slot list (first entry wins per weekday). */
function buildWeekdaySchedule(specialist: Specialist): Map<string, { time: string; available: boolean }[]> {
  const map = new Map<string, { time: string; available: boolean }[]>();
  for (const a of specialist.availability) {
    if (!map.has(a.day)) map.set(a.day, a.slots);
  }
  return map;
}

export function buildMonthAvailability(specialist: Specialist, year: number, monthIndex: number): AvailabilityDay[] {
  const schedule = buildWeekdaySchedule(specialist);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: AvailabilityDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, monthIndex, d);
    const isPast = dt.getTime() < today.getTime();
    const slots = isPast ? [] : schedule.get(WEEKDAY_LABELS[dt.getDay()]) ?? [];
    days.push({
      day: WEEKDAY_LABELS[dt.getDay()],
      date: String(d),
      month: MONTHS_FR[monthIndex],
      iso: toIso(year, monthIndex, d),
      slots,
      closed: slots.length === 0,
      isPast,
    });
  }
  return days;
}

/** Number of blank leading cells so the grid starts on Monday (getDay: 0 = Sunday). */
export function leadingBlanks(year: number, monthIndex: number): number {
  return (new Date(year, monthIndex, 1).getDay() + 6) % 7;
}

/**
 * Human-readable date caption for a day in the current locale
 * (e.g. "jeudi 13 août" in French, "Thursday, August 13" in English).
 */
export function formatDateCaption(iso: string, locale: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const localeTag = locale === "fr" ? "fr-FR" : "en-US";
  return date.toLocaleDateString(localeTag, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Compact secondary date label for the booking card
 * (e.g. "jeu. août. 13" in French, "Thu. Aug. 13" in English).
 */
export function formatDateCompact(iso: string, locale: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const localeTag = locale === "fr" ? "fr-FR" : "en-US";
  const weekday = date.toLocaleDateString(localeTag, { weekday: "short" });
  const monthShort = date.toLocaleDateString(localeTag, { month: "short" });
  return `${weekday} ${monthShort}. ${day}`;
}

/**
 * Abbreviated weekday column labels for the calendar grid, Monday-first
 * (e.g. ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."] in French).
 */
export function weekdayShortLabels(locale: string): string[] {
  const localeTag = locale === "fr" ? "fr-FR" : "en-US";
  const fmt = new Intl.DateTimeFormat(localeTag, { weekday: "short" });
  // 2026-08-10 is a Monday; offset by index for Monday-first order.
  return [0, 1, 2, 3, 4, 5, 6].map((i) => fmt.format(new Date(2026, 7, 10 + i)));
}
