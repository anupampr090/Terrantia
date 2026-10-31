import { BOOKING_ROOMS, getBookingRoom, type BookingRoom } from "./booking-rooms";
import { nightsBetween } from "./booking-schema";

// Deterministic MOCK availability and pricing. All figures are placeholders.
export const TAX_RATE = 0.12;

export type RoomQuote = {
  room: BookingRoom;
  available: boolean;
  reason?: "capacity" | "booked";
  subtotal: number;
  tax: number;
  total: number;
  averageNightly: number;
};

export type AvailabilityResult = { nights: number; taxRate: number; quotes: RoomQuote[] };

function seasonMultiplier(month: number) {
  // Peak Dec to Apr, shoulder May and Nov, otherwise standard.
  if (month === 12 || month <= 4) return 1.3;
  if (month === 5 || month === 11) return 1.1;
  return 1;
}

function blockedNight(roomId: string, month: number, day: number) {
  if (roomId === "beach-residence") return day >= 10 && day <= 16;
  if (roomId === "pool-suite") return day >= 24 && day <= 28;
  if (roomId === "garden-villa") return month % 2 === 0 && day <= 3;
  return false;
}

export function quoteRoom(roomId: string, checkIn: string, checkOut: string, guests: number): RoomQuote | null {
  const room = getBookingRoom(roomId);
  if (!room) return null;
  const nights = nightsBetween(checkIn, checkOut);
  const start = Date.parse(checkIn + "T00:00:00Z");
  let subtotal = 0;
  let blocked = false;
  for (let i = 0; i < nights; i++) {
    const d = new Date(start + i * 86400000);
    const month = d.getUTCMonth() + 1;
    subtotal += room.nightlyRate * seasonMultiplier(month);
    if (blockedNight(room.id, month, d.getUTCDate())) blocked = true;
  }
  subtotal = Math.round(subtotal);
  const tax = Math.round(subtotal * TAX_RATE);
  const reason = guests > room.sleeps ? "capacity" : blocked ? "booked" : undefined;
  return { room, available: !reason, reason, subtotal, tax, total: subtotal + tax, averageNightly: Math.round(subtotal / nights) };
}

export function checkAvailability(checkIn: string, checkOut: string, guests: number): AvailabilityResult {
  const nights = nightsBetween(checkIn, checkOut);
  const quotes = BOOKING_ROOMS.map((r) => quoteRoom(r.id, checkIn, checkOut, guests)!);
  return { nights, taxRate: TAX_RATE, quotes };
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
