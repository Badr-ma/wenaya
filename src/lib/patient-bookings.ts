/** Display-only model. No raw patient, payment or clinical records cross the BFF. */
export type BookingKind = "appointments" | "groups";
export type BookingBucket = "today" | "upcoming" | "past";
export interface PatientBooking {
  id: string;
  title: string;
  date: string;
  time: string;
  professional: string;
  location: string;
  status: string;
}
export interface PatientBookingsPage {
  items: PatientBooking[];
  page: number;
  totalPages: number;
  total: number;
}

/** Backend session dates are clinic-local (Casablanca), not browser-local. */
export function upcomingGroupBookings(items: PatientBooking[], now = new Date()): PatientBooking[] {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Casablanca", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: string) => parts.find(part => part.type === type)?.value ?? "";
  const today = `${value("year")}-${value("month")}-${value("day")}`;
  const time = `${value("hour")}:${value("minute")}`;
  return items.filter(item => item.date && (item.date > today ||
    (item.date === today && (!item.time || item.time >= time))))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}
function text(value: unknown): string {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim().slice(0, 300) : "";
}
function person(value: unknown): string {
  const p = object(value);
  return [text(p.first_name), text(p.last_name)].filter(Boolean).join(" ") || text(p.business);
}
function date(value: unknown): string {
  const raw = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "";
  const parsed = new Date(`${raw}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === raw ? raw : "";
}

/** Shapes verified against the legacy patient appointments and group screens. */
export function normalizePatientBookings(
  payload: unknown, kind: BookingKind, bucket: BookingBucket,
): PatientBookingsPage {
  const envelope = object(payload);
  if (envelope.error === true) throw new Error("Unsuccessful bookings response");
  const data = object(envelope.data);
  const paginator = kind === "groups" ? data : object(data[bucket]);
  if (!Array.isArray(paginator.data) || !Number.isSafeInteger(paginator.current_page) ||
      !Number.isSafeInteger(paginator.last_page) || !Number.isSafeInteger(paginator.total) ||
      Number(paginator.current_page) < 1 || Number(paginator.last_page) < 1 || Number(paginator.total) < 0) {
    throw new Error("Unexpected bookings response");
  }
  const items = paginator.data.map((value): PatientBooking => {
    const row = object(value);
    if (!/^[1-9]\d*$/.test(String(row.id))) throw new Error("Invalid booking ID");
    const rawTime = text(kind === "groups" ? row.event_time : row.booking_time);
    return {
      id: String(row.id),
      title: kind === "groups" ? text(row.title) : "",
      date: date(kind === "groups" ? row.event_date : row.booking_date),
      time: /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(rawTime) ? rawTime.slice(0, 5) : "",
      professional: person(row.professional),
      location: kind === "groups" ? text(object(row.company).name) : text(object(row.practice).business),
      // Group event status is not a confirmation of the patient's payment/booking.
      status: text(kind === "groups" ? row.event_status : row.booking_status),
    };
  });
  return { items, page: Number(paginator.current_page), totalPages: Number(paginator.last_page), total: Number(paginator.total) };
}
