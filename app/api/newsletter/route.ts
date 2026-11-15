import { NextResponse } from "next/server";
import { z } from "zod";
import { resortEmail, sendMail } from "@/lib/mailer";
import { honeypotFilled, rateLimit, readJsonBody, tooManyRequests } from "@/lib/rate-limit";
import { hasNewsletterEmail, saveRecord } from "@/lib/store";

const schema = z.object({
  email: z.string().trim().email().max(200),
});

// Addresses seen by this process, so repeat signups stay quiet even when the
// file store is unavailable. Capped; cleared on restart.
const seen = new Set<string>();
const SEEN_MAX = 5000;

export async function POST(req: Request) {
  const rl = rateLimit(req, { key: "newsletter", max: 5, windowMs: 60_000 });
  if (rl.limited) return tooManyRequests(rl.retryAfterSec);

  const read = await readJsonBody(req);
  if (!read.ok) return read.response;

  if (honeypotFilled(read.body)) return NextResponse.json({ ok: true, delivered: true }); // bots: pretend success

  const parsed = schema.safeParse(read.body);
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  const email = parsed.data.email.toLowerCase();

  // Duplicates get the same reply as a new signup: nothing is stored or sent
  // twice, and the reply does not reveal who is already on the list.
  if (seen.has(email) || (await hasNewsletterEmail(email))) {
    return NextResponse.json({ ok: true, delivered: true });
  }
  if (seen.size >= SEEN_MAX) seen.clear();
  seen.add(email);

  const [stored, mail] = await Promise.all([
    saveRecord("newsletter", { email }),
    sendMail({
      to: resortEmail(),
      replyTo: email,
      subject: "New newsletter signup",
      text: `A visitor asked to join the Terrantia newsletter.\n\nEmail: ${email}`,
    }),
  ]);

  if (!stored.ok && !mail.ok) {
    seen.delete(email); // let a later attempt try again
    console.error("[newsletter:not-delivered] a signup was neither stored nor mailed to the resort.");
  }

  return NextResponse.json({ ok: true, delivered: mail.ok });
}
