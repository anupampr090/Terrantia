import { NextResponse } from "next/server";
import { z } from "zod";
import { resortEmail, sendMail } from "@/lib/mailer";
import { honeypotFilled, rateLimit, readJsonBody, tooManyRequests } from "@/lib/rate-limit";
import { saveRecord } from "@/lib/store";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1, "Please enter a message.").max(2000),
});

export async function POST(req: Request) {
  const rl = rateLimit(req, { key: "enquiry", max: 5, windowMs: 60_000 });
  if (rl.limited) return tooManyRequests(rl.retryAfterSec);

  const read = await readJsonBody(req);
  if (!read.ok) return read.response;

  if (honeypotFilled(read.body)) return NextResponse.json({ ok: true, delivered: true }); // bots: pretend success

  const parsed = schema.safeParse(read.body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const e = parsed.data;

  const [stored, mail] = await Promise.all([
    saveRecord("enquiry", { name: e.name, email: e.email, phone: e.phone ?? "", message: e.message }),
    sendMail({
      to: resortEmail(),
      replyTo: e.email,
      subject: "New website enquiry",
      text: [
        "A new enquiry came in through the website.",
        "",
        `Name: ${e.name}`,
        `Email: ${e.email}`,
        `Phone: ${e.phone || "not given"}`,
        "",
        "Message:",
        e.message,
        "",
        "Reply to this email to answer the guest directly.",
      ].join("\n"),
    }),
  ]);

  if (!stored.ok && !mail.ok) {
    console.error("[enquiry:not-delivered] an enquiry was neither stored nor mailed to the resort.");
  }

  return NextResponse.json({ ok: true, delivered: mail.ok });
}
