import { z } from "zod";
import { ROOM_IDS } from "./booking-rooms";

export const MAX_NIGHTS = 14;
export const MAX_GUESTS = 5;

const isoRe = /^\d{4}-\d{2}-\d{2}$/;
const isoDate = z.string().regex(isoRe, "Choose a valid date.");

export function todayISO(now = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = Date.parse(checkIn + "T00:00:00Z");
  const b = Date.parse(checkOut + "T00:00:00Z");
  return Math.round((b - a) / 86400000);
}

export const stayShape = z.object({
  checkIn: isoDate,
  checkOut: isoDate,
  guests: z
    .number({ error: "Enter the number of guests." })
    .int("Enter a whole number of guests.")
    .min(1, "At least 1 guest.")
    .max(MAX_GUESTS, `Up to ${MAX_GUESTS} guests.`),
});

function checkStay(v: { checkIn: string; checkOut: string }, ctx: z.RefinementCtx) {
  if (!isoRe.test(v.checkIn) || !isoRe.test(v.checkOut)) return;
  if (v.checkIn < todayISO()) {
    ctx.addIssue({ code: "custom", path: ["checkIn"], message: "Check-in cannot be in the past." });
  }
  const n = nightsBetween(v.checkIn, v.checkOut);
  if (n < 1) ctx.addIssue({ code: "custom", path: ["checkOut"], message: "Check-out must be after check-in." });
  else if (n > MAX_NIGHTS) ctx.addIssue({ code: "custom", path: ["checkOut"], message: `Stays are limited to ${MAX_NIGHTS} nights.` });
}

export const stepDatesSchema = stayShape.superRefine(checkStay);

export const guestDetailsShape = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number with at least 7 characters.")
    .max(30)
    .regex(/^[+\d][\d\s().-]*$/, "Use digits, spaces and + only."),
  requests: z.string().trim().max(1000, "Keep requests under 1000 characters."),
});

export const bookingSchema = stayShape
  .extend({ roomId: z.enum(ROOM_IDS, { error: "Choose a room." }) })
  .extend(guestDetailsShape.shape)
  .superRefine(checkStay);

export type StayInput = z.infer<typeof stayShape>;
export type GuestDetails = z.infer<typeof guestDetailsShape>;
export type BookingInput = z.infer<typeof bookingSchema>;
