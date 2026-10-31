"use client";

import { useState } from "react";
import { MAX_GUESTS, MAX_NIGHTS, nightsBetween, stepDatesSchema } from "@/lib/booking-schema";
import type { AvailabilityResult } from "@/lib/availability";
import DateRangePicker, { fromISO } from "./DateRangePicker";
import FieldError from "./FieldError";

export type Stay = { checkIn: string; checkOut: string; guests: number };

const fmt = (iso: string) =>
  fromISO(iso)?.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) ?? "Not chosen";

export default function StepDates({
  stay,
  onStay,
  onResult,
}: {
  stay: Stay;
  onStay: (s: Stay) => void;
  onResult: (r: AvailabilityResult) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const nights = stay.checkIn && stay.checkOut ? nightsBetween(stay.checkIn, stay.checkOut) : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = stepDatesSchema.safeParse(stay);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      if (!stay.checkIn) next.checkIn = "Choose a check-in date.";
      else if (!stay.checkOut) next.checkOut = "Choose a check-out date.";
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not check availability.");
      onResult(data as AvailabilityResult);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not check availability. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <div>
        <p className="text-[15px] text-muted" id="range-help">
          Select your check-in date, then your check-out date. Stays are 1 to {MAX_NIGHTS} nights. Use the arrow keys to move between days and Enter to select.
        </p>
        <div className="mt-4" aria-describedby="range-help">
          <DateRangePicker checkIn={stay.checkIn} checkOut={stay.checkOut} onChange={(checkIn, checkOut) => onStay({ ...stay, checkIn, checkOut })} />
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="field-label">Check-in</dt>
            <dd className="text-ink" aria-describedby={errors.checkIn ? "err-checkIn" : undefined}>{fmt(stay.checkIn)}</dd>
            <FieldError id="err-checkIn" message={errors.checkIn} />
          </div>
          <div>
            <dt className="field-label">Check-out</dt>
            <dd className="text-ink">{fmt(stay.checkOut)}</dd>
            <FieldError id="err-checkOut" message={errors.checkOut} />
          </div>
          <div>
            <dt className="field-label">Nights</dt>
            <dd className="text-ink" aria-live="polite">{nights > 0 ? nights : "None"}</dd>
          </div>
        </dl>
      </div>

      <div className="max-w-xs">
        <label htmlFor="guests" className="field-label">Guests</label>
        <select
          id="guests"
          className="field"
          value={stay.guests}
          aria-invalid={!!errors.guests}
          aria-describedby={errors.guests ? "err-guests" : undefined}
          onChange={(e) => onStay({ ...stay, guests: Number(e.target.value) })}
        >
          {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
          ))}
        </select>
        <FieldError id="err-guests" message={errors.guests} />
      </div>

      {serverError && <FieldError id="err-server" message={serverError} />}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Checking availability..." : "Check availability"}
      </button>
    </form>
  );
}
