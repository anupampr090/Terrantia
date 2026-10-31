"use client";

import { useState } from "react";
import { formatMoney, type RoomQuote } from "@/lib/availability";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import FieldError from "./FieldError";
import { fromISO } from "./DateRangePicker";

const fmt = (iso: string) =>
  fromISO(iso)?.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) ?? iso;

export default function StepReview({
  booking,
  quote,
  nights,
  onBack,
  onDone,
}: {
  booking: BookingInput;
  quote: RoomQuote;
  nights: number;
  onBack: () => void;
  onDone: (reference: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, humans never see it

  async function submit() {
    setError("");
    const parsed = bookingSchema.safeParse(booking);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Some details are invalid. Please go back and check them.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send your request.");
      onDone(data.reference as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const rows: [string, string][] = [
    ["Room", quote.room.name],
    ["Check-in", fmt(booking.checkIn)],
    ["Check-out", fmt(booking.checkOut)],
    ["Nights", String(nights)],
    ["Guests", String(booking.guests)],
    ["Name", booking.name],
    ["Email", booking.email],
    ["Phone", booking.phone],
    ["Special requests", booking.requests || "None"],
  ];

  return (
    <div className="max-w-xl space-y-8">
      <dl className="divide-y divide-hairline rounded-xl border border-hairline bg-canvas">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 p-4 sm:grid-cols-[160px_1fr]">
            <dt className="field-label !mb-0">{k}</dt>
            <dd className="whitespace-pre-wrap break-words text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="rounded-xl bg-surface p-4">
        <div className="flex justify-between"><span>Room ({nights} nights)</span><span>{formatMoney(quote.subtotal)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{formatMoney(quote.tax)}</span></div>
        <div className="mt-2 flex justify-between border-t border-hairline pt-2 font-medium text-ink"><span>Estimated total</span><span>{formatMoney(quote.total)}</span></div>
        <p className="mt-2 text-[14px] text-muted">Placeholder prices. No payment is taken. Our team will review your request and reply by email.</p>
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      {error && <FieldError id="err-submit" message={error} />}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={loading}>Back</button>
        <button type="button" className="btn btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Sending request..." : "Request to book"}
        </button>
      </div>
    </div>
  );
}
