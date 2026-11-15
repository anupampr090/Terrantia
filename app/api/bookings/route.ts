import { NextResponse } from "next/server";
import { bookingSchema, nightsBetween } from "@/lib/booking-schema";
import { quoteRoom } from "@/lib/availability";
import { resortEmail, sendMail } from "@/lib/mailer";
import { honeypotFilled, rateLimit, readJsonBody, tooManyRequests } from "@/lib/rate-limit";
import { newReference, randomReference } from "@/lib/reference";
import { saveRecord } from "@/lib/store";

export async function POST(req: Request) {
  const rl = rateLimit(req, { key: "bookings", max: 5, windowMs: 60_000 });
  if (rl.limited) return tooManyRequests(rl.retryAfterSec);

  const read = await readJsonBody(req, "Invalid JSON.");
  if (!read.ok) return read.response;
  const body = read.body;

  if (honeypotFilled(body)) {
    // Honeypot filled: bots get a fake success and nothing is processed.
    return NextResponse.json(
      { reference: randomReference(), total: 0, roomName: "", delivered: true },
      { status: 201 },
    );
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  const b = parsed.data;

  const quote = quoteRoom(b.roomId, b.checkIn, b.checkOut, b.guests);
  if (!quote || !quote.available) {
    return NextResponse.json(
      { error: "That room is no longer available for those dates. Please choose different dates or another room." },
      { status: 409 },
    );
  }

  const reference = await newReference();
  const nights = nightsBetween(b.checkIn, b.checkOut);

  const stay = [
    `Reference: ${reference}`,
    `Room: ${quote.room.name}`,
    `Check-in: ${b.checkIn}`,
    `Check-out: ${b.checkOut}`,
    `Nights: ${nights}`,
    `Guests: ${b.guests}`,
    `Estimated total: ${quote.total} USD including tax (placeholder rate, staff will send the final price)`,
  ].join("\n");

  // Store and tell the resort first. The guest is only told "we received your
  // request" when at least one of those two actually worked.
  const [stored, resortMail] = await Promise.all([
    saveRecord("booking", {
      reference,
      status: "requested",
      roomId: b.roomId,
      roomName: quote.room.name,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      nights,
      guests: b.guests,
      total: quote.total,
      name: b.name,
      email: b.email,
      phone: b.phone,
      requests: b.requests,
    }),
    sendMail({
      to: resortEmail(),
      replyTo: b.email,
      subject: `New booking request ${reference}`,
      text: [
        "A new booking request came in through the website. Nothing is held for this guest until you reply.",
        "",
        stay,
        "",
        `Name: ${b.name}`,
        `Email: ${b.email}`,
        `Phone: ${b.phone}`,
        `Special requests: ${b.requests || "none"}`,
        "",
        "Reply to this email to answer the guest directly.",
      ].join("\n"),
    }),
  ]);

  const delivered = resortMail.ok;

  if (stored.ok || delivered) {
    await sendMail({
      to: b.email,
      replyTo: resortEmail() || undefined,
      subject: `We received your request (${reference})`,
      text: [
        `Hello ${b.name},`,
        "",
        "Thank you for your booking request at Terrantia. We received it, and our staff will reply to you by email.",
        "",
        stay,
        `Special requests: ${b.requests || "none"}`,
        "",
        "Nothing is secured yet. This is a request, not a reservation: no room is held and no payment has been taken. Your stay is only arranged once our staff reply to you.",
        "",
        "Please quote your reference if you contact us about this request.",
        "",
        "Terrantia",
      ].join("\n"),
    });
  } else {
    // Neither stored nor mailed: say so loudly, without personal data.
    console.error(`[booking:not-delivered] ${reference} was neither stored nor mailed to the resort.`);
  }

  return NextResponse.json(
    { reference, total: quote.total, roomName: quote.room.name, delivered },
    { status: 201 },
  );
}
