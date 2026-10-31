"use client";

import { useEffect, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

export function toISO(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function fromISO(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function useMonths() {
  const [months, setMonths] = useState(1); // 1 on first render keeps SSR and hydration identical
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return months;
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
}: {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
}) {
  const months = useMonths();
  const from = fromISO(checkIn);
  const to = fromISO(checkOut);
  const selected: DateRange | undefined = from ? { from, to } : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div
      className="rounded-xl border border-hairline bg-canvas p-3 sm:p-4"
      style={
        {
          "--rdp-accent-color": "var(--color-accent)",
          "--rdp-accent-background-color": "var(--color-surface)",
          "--rdp-range_start-color": "var(--color-on-accent)",
          "--rdp-range_end-color": "var(--color-on-accent)",
          "--rdp-today-color": "var(--color-ink)",
          "--rdp-range_start-date-background-color": "var(--color-accent)",
          "--rdp-range_end-date-background-color": "var(--color-accent)",
          "--rdp-range_middle-background-color": "var(--color-surface)",
          "--rdp-range_middle-color": "var(--color-ink)",
          "--rdp-selected-border": "2px solid var(--color-accent)",
          color: "var(--color-ink)",
          fontSize: "15px",
        } as React.CSSProperties
      }
    >
      <DayPicker
        mode="range"
        numberOfMonths={months}
        selected={selected}
        defaultMonth={from ?? today}
        startMonth={today}
        disabled={{ before: today }}
        onSelect={(range) => onChange(range?.from ? toISO(range.from) : "", range?.to ? toISO(range.to) : "")}
      />
    </div>
  );
}
