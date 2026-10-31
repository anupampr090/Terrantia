import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/booking-schema";
import { quoteRoom } from "@/lib/availability";

const g = globalThis as unknown as { __terrantiaRefs?: Set<string> };
const refs = (g.__terrantiaRefs ??= new Set<string>());

function newReference() {
  for (let i = 0; i < 50; i++) {
    const ref = `RS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!refs.has(ref)) {
      refs.add(ref);
      return ref;
    }
  }
  const ref = `RS-2026-${Date.now().toString().slice(-6)}`;
  refs.add(ref);
  return ref;
}

const hits = new Map<string, number[]>();
function limited(ip: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests. Please try again soon." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (body && typeof body === "object" && (body as { website?: unknown }).website) {
    // Honeypot filled: bots get a fake success and nothing is processed.
    return NextResponse.json({ reference: "RS-2026-0000", total: 0, roomName: "" }, { status: 201 });
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
  const reference = newReference();
  const summary = `${quote.room.name}, ${b.checkIn} to ${b.checkOut}, ${b.guests} guest(s), placeholder total ${quote.total} USD`;
  console.log(`[email to guest ${b.email}] Request received (${reference}). ${summary}. Staff will reply by email.`);
  console.log(`[email to resort] New booking request ${reference} from ${b.name} (${b.email}, ${b.phone}). ${summary}. Requests: ${b.requests || "none"}`);
  return NextResponse.json({ reference, total: quote.total, roomName: quote.room.name }, { status: 201 });
}
