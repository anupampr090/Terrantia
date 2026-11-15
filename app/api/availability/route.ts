import { NextResponse } from "next/server";
import { stepDatesSchema } from "@/lib/booking-schema";
import { checkAvailability } from "@/lib/availability";
import { rateLimit, readJsonBody, tooManyRequests } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Read only, so the allowance is wider than on the write routes.
  const rl = rateLimit(req, { key: "availability", max: 30, windowMs: 60_000 });
  if (rl.limited) return tooManyRequests(rl.retryAfterSec);

  const read = await readJsonBody(req, "Invalid JSON.");
  if (!read.ok) return read.response;

  const parsed = stepDatesSchema.safeParse(read.body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  const { checkIn, checkOut, guests } = parsed.data;
  return NextResponse.json(checkAvailability(checkIn, checkOut, guests));
}
