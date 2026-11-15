// Outbound mail through the Resend HTTP API (no SDK, plain fetch).
//
// Configuration (all read at call time, so a restart is not needed in dev):
//   RESEND_API_KEY  Resend API key. Without it nothing is sent.
//   MAIL_FROM       Verified sender, for example "Terrantia <stay@example.com>".
//   RESORT_EMAIL    Inbox that receives booking requests, enquiries and signups.
//
// sendMail never throws. Logs carry the recipient and subject only, never the
// message body, because bodies contain guest personal data.

export type MailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export type MailResult = { ok: boolean; id?: string; error?: string };

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 8000;

/** The resort inbox, or "" when RESORT_EMAIL is not set. */
export function resortEmail(): string {
  return (process.env.RESORT_EMAIL ?? "").trim();
}

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.MAIL_FROM?.trim());
}

/** Header values must be a single line. */
function oneLine(s: string) {
  return s.replace(/[\r\n]+/g, " ").trim();
}

export async function sendMail({ to, subject, text, replyTo }: MailInput): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MAIL_FROM?.trim();
  const recipient = oneLine(to ?? "");
  const cleanSubject = oneLine(subject).slice(0, 200);

  if (!apiKey || !from || !recipient) {
    console.warn(`[mail:not-configured] to=${recipient || "(RESORT_EMAIL not set)"} subject=${cleanSubject}`);
    return { ok: false, error: "not-configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: cleanSubject,
        text,
        ...(replyTo ? { reply_to: oneLine(replyTo) } : {}),
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      // The provider's error body can echo addresses, so only the status is logged.
      console.error(`[mail:failed] status=${res.status} to=${recipient} subject=${cleanSubject}`);
      return { ok: false, error: `resend-${res.status}` };
    }
    const data = (await res.json().catch(() => null)) as { id?: unknown } | null;
    const id = typeof data?.id === "string" ? data.id : undefined;
    console.log(`[mail:sent] to=${recipient} subject=${cleanSubject}`);
    return { ok: true, id };
  } catch (err) {
    const error = err instanceof Error && err.name === "AbortError" ? "timeout" : "network";
    console.error(`[mail:failed] error=${error} to=${recipient} subject=${cleanSubject}`);
    return { ok: false, error };
  } finally {
    clearTimeout(timer);
  }
}
