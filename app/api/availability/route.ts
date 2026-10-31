import { NextResponse } from "next/server";
import { stepDatesSchema } from "@/lib/booking-schema";
import { checkAvailability } from "@/lib/availability";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = stepDatesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  const { checkIn, checkOut, guests } = parsed.data;
  return NextResponse.json(checkAvailability(checkIn, checkOut, guests));
}
