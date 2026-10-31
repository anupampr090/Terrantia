"use client";

import Image from "next/image";
import { Ban, CalendarX } from "lucide-react";
import { formatMoney, type AvailabilityResult } from "@/lib/availability";
import type { BookingRoom } from "@/lib/booking-rooms";
import { rooms, roomHighlights } from "@/lib/rooms";
import RoomDetails from "@/components/RoomDetails";

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
  const taxPct = Math.round(result.taxRate * 100);
  return (
    <div className="space-y-6">
      <p className="text-[15px] text-muted">
        {result.nights} {result.nights === 1 ? "night" : "nights"}, {guests} {guests === 1 ? "guest" : "guests"}. Rates are placeholder figures and include a {taxPct}% tax line.
      </p>
      {!anyAvailable && (
        <p role="status" className="rounded-xl border border-hairline bg-surface p-4 text-ink">
          No rooms are available for these dates and guests. Please go back and try different dates.
        </p>
      )}
      <ul className="space-y-5">
        {result.quotes.map((q, idx) => {
          const libRoom = rooms.find((r) => r.id === q.room.id);
          const isSelected = selected === q.room.id;
          const Icon = q.reason === "capacity" ? Ban : CalendarX;
          return (
            <li
              key={q.room.id}
              className={`grid gap-5 rounded-xl border p-4 sm:grid-cols-[220px_1fr] sm:p-5 md:grid-cols-[260px_1fr] ${
                q.available ? (isSelected ? "border-ink bg-canvas" : "border-hairline bg-canvas") : "border-hairline bg-surface"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-strong sm:aspect-auto sm:min-h-[200px]">
                <Image
                  src={q.room.image}
                  alt=""
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 768px) 260px, (min-width: 640px) 220px, 100vw"
                  className={`object-cover ${q.available ? "" : "opacity-50 grayscale"}`}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <div>
                  <h3 className="text-[28px] leading-tight">{q.room.name}</h3>
                  <p className="mt-1.5 text-[15px] text-body">{libRoom?.description ?? q.room.blurb}</p>
                </div>
                {libRoom && <RoomDetails items={roomHighlights(libRoom, 3)} />}
                <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  {q.available ? (
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                        <p className="m-0 flex items-baseline gap-2">
                          <span className="font-display text-[32px] font-medium leading-none tracking-[-0.01em] text-ink [font-variant-numeric:lining-nums_tabular-nums]">
                            {formatMoney(q.total)}
                          </span>
                          <span className="text-[14px] text-muted">total for the stay</span>
                        </p>
                        <span className="self-center rounded-full border border-hairline px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                          Placeholder price
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] text-muted [font-variant-numeric:lining-nums_tabular-nums]">
                        {formatMoney(q.subtotal)} + {formatMoney(q.tax)} tax
                      </p>
                    </div>
                  ) : (
                    <p className="m-0 flex items-center gap-2 text-[15px] font-medium text-ink">
                      <Icon size={18} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-muted" />
                      {q.reason === "capacity" ? `Sleeps ${q.room.sleeps}, you have ${guests} guests.` : "Unavailable for these dates."}
                    </p>
                  )}
                  {q.available ? (
                    <button
                      type="button"
                      className={`btn shrink-0 ${isSelected ? "btn-primary" : "btn-secondary"}`}
                      aria-pressed={isSelected}
                      onClick={() => onSelect(q.room.id)}
                    >
                      {isSelected ? "Selected" : "Select"}
                      <span className="sr-only"> {q.room.name}</span>
                    </button>
                  ) : (
                    <span className="shrink-0 text-[14px] text-muted">Not available</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn btn-secondary" onClick={onBack}>Change dates</button>
    </div>
  );
}
