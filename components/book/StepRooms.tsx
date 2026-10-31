"use client";

import Image from "next/image";
import { formatMoney, type AvailabilityResult } from "@/lib/availability";
import type { BookingRoom } from "@/lib/booking-rooms";

export default function StepRooms({
  result,
  guests,
  selected,
  onSelect,
  onBack,
}: {
  result: AvailabilityResult;
  guests: number;
  selected: BookingRoom["id"] | "";
  onSelect: (id: BookingRoom["id"]) => void;
  onBack: () => void;
}) {
  const anyAvailable = result.quotes.some((q) => q.available);
  return (
    <div className="space-y-6">
      <p className="text-[15px] text-muted">
        {result.nights} {result.nights === 1 ? "night" : "nights"}, {guests} {guests === 1 ? "guest" : "guests"}. Rates are placeholder figures and include a {Math.round(result.taxRate * 100)}% tax line.
      </p>
      {!anyAvailable && (
        <p role="status" className="rounded-xl border border-hairline bg-surface p-4 text-ink">
          No rooms are available for these dates and guests. Please go back and try different dates.
        </p>
      )}
      <ul className="space-y-4">
        {result.quotes.map((q, idx) => (
          <li key={q.room.id} className={`grid gap-4 rounded-xl border bg-canvas p-4 sm:grid-cols-[200px_1fr_auto] sm:items-center ${q.available ? "border-hairline" : "border-hairline bg-surface"}`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-strong">
              <Image src={q.room.image} alt="" fill priority={idx === 0} sizes="(min-width: 640px) 200px, 100vw" className={`object-cover ${q.available ? "" : "opacity-50 grayscale"}`} />
            </div>
            <div>
              <h3 className="text-[24px] leading-tight">{q.room.name}</h3>
              <p className="mt-1 text-[15px]">{q.room.blurb}</p>
              <p className="mt-1 text-[14px] text-muted">Sleeps {q.room.sleeps}</p>
              {q.available ? (
                <p className="mt-2 text-ink">
                  <span className="font-medium">{formatMoney(q.total)}</span> total
                  <span className="text-[14px] text-muted"> ({formatMoney(q.subtotal)} + {formatMoney(q.tax)} tax, placeholder price)</span>
                </p>
              ) : (
                <p className="mt-2 font-medium text-ink">
                  {q.reason === "capacity" ? `Unavailable: sleeps ${q.room.sleeps}, you have ${guests} guests.` : "Unavailable for these dates."}
                </p>
              )}
            </div>
            <div>
              {q.available ? (
                <button
                  type="button"
                  className={`btn ${selected === q.room.id ? "btn-primary" : "btn-secondary"}`}
                  aria-pressed={selected === q.room.id}
                  onClick={() => onSelect(q.room.id)}
                >
                  {selected === q.room.id ? "Selected" : "Select"}
                  <span className="sr-only"> {q.room.name}</span>
                </button>
              ) : (
                <span className="text-[14px] text-muted">Not available</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-secondary" onClick={onBack}>Change dates</button>
    </div>
  );
}
