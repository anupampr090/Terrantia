"use client";
import { useState } from "react";
import Magnetic from "./Magnetic";
import { usePageTransition } from "./PageTransition";
import DateRangeFields, { toISO } from "./DateField";

export default function BookingBar() {
  const { push } = usePageTransition();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const today = toISO(new Date());
    if (!checkIn || !checkOut) return setError("Choose a check-in and check-out date.");
    if (checkIn < today) return setError("Check-in cannot be in the past.");
    if (checkOut <= checkIn) return setError("Check-out must be after check-in.");
    setError("");
    const q = new URLSearchParams({ checkIn, checkOut, guests });
    push(`/book?${q.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Check availability"
      className="rounded-xl bg-canvas p-4 text-ink shadow-[0_24px_48px_-24px_rgba(20,20,19,0.25)] md:p-5"
    >
      <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-[repeat(3,1fr)_auto] md:gap-4">
        <DateRangeFields
          checkIn={checkIn}
          checkOut={checkOut}
          invalid={!!error}
          describedBy={error ? "bb-err" : undefined}
          onChange={(i, o) => { setCheckIn(i); setCheckOut(o); if (error) setError(""); }}
        />
        <div>
          <label className="field-label" htmlFor="bb-g">Guests</label>
          <select id="bb-g" className="field" value={guests} onChange={(e) => setGuests(e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
          </select>
        </div>
        <Magnetic>
          <button type="submit" className="btn btn-primary self-end whitespace-nowrap px-4 md:px-6">Check availability</button>
        </Magnetic>
      </div>
      <p id="bb-err" role="alert" className={error ? "mt-3 text-[14px] text-danger" : "sr-only"}>{error}</p>
    </form>
  );
}
