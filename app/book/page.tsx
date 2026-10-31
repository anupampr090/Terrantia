import type { Metadata } from "next";
import Link from "next/link";
import BookingFlow from "@/components/book/BookingFlow";
import { MAX_GUESTS } from "@/lib/booking-schema";
import { getBookingRoom } from "@/lib/booking-rooms";

export const metadata: Metadata = {
  title: "Request your stay",
  description: "Check availability and send a booking request to Terrantia. Concept demo with placeholder prices.",
};

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function BookPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const checkIn = iso.test(one(sp.checkIn)) ? one(sp.checkIn) : "";
  const checkOut = checkIn && iso.test(one(sp.checkOut)) ? one(sp.checkOut) : "";
  const g = parseInt(one(sp.guests), 10);
  const guests = Number.isFinite(g) ? Math.min(MAX_GUESTS, Math.max(1, g)) : 2;

  const room = getBookingRoom(one(sp.room))?.id ?? "";

  return (
    <>
      <header className="border-b border-hairline">
        <div className="container-x flex h-20 items-center">
          <Link href="/" className="font-display inline-flex min-h-11 items-center text-[28px] tracking-tight text-ink no-underline">
            Terrantia
          </Link>
        </div>
      </header>
      <BookingFlow initial={{ checkIn, checkOut, guests }} initialRoom={room} />
    </>
  );
}
