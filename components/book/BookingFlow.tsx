"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BedDouble, CalendarCheck, CalendarDays, Check, Copy, Inbox, Mail, Users } from "lucide-react";
import type { AvailabilityResult } from "@/lib/availability";
import { nightsBetween, type BookingInput, type GuestDetails } from "@/lib/booking-schema";
import { BOOKING_ROOMS, type BookingRoom } from "@/lib/booking-rooms";
import StepIndicator from "./StepIndicator";
import StepDates, { type Stay } from "./StepDates";
import StepRooms from "./StepRooms";
import StepDetails from "./StepDetails";
import StepReview from "./StepReview";

function fmtDay(iso: string, withYear = false) {
  const d = new Date(`${iso}T00:00:00Z`);
  // en-GB puts a comma after the weekday ("Tue, 8 Dec"); the site writes "Tue 8 Dec".
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}), timeZone: "UTC" }).replace(",", "");
}

const NEXT_STEPS = [
  { Icon: Inbox, text: "Our team reviews your request" },
  { Icon: Mail, text: "We reply by email with next steps" },
  { Icon: CalendarCheck, text: "You decide, and nothing is secured until you hear back" },
];

const HEADINGS = ["Choose your dates", "Choose a room", "Your details", "Review your request"];

export default function BookingFlow({ initial, initialRoom = "" }: { initial: Stay; initialRoom?: BookingRoom["id"] | "" }) {
  const [step, setStep] = useState(0);
  const [stay, setStay] = useState<Stay>(initial);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [roomId, setRoomId] = useState<BookingRoom["id"] | "">("");
  const [details, setDetails] = useState<GuestDetails>({ name: "", email: "", phone: "", requests: "" });
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step, reference]);

  const quote = result?.quotes.find((q) => q.room.id === roomId && q.available);
  const done = reference !== "";
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const bookedRoom = BOOKING_ROOMS.find((r) => r.id === roomId);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  async function copyReference() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(reference);
      ok = true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = reference;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    setAnnounce(ok ? "Reference copied" : "Could not copy. Please select the reference and copy it.");
    if (ok) {
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => { setCopied(false); setAnnounce(""); }, 2000);
    }
  }

  function startOver() {
    setReference("");
    setRoomId("");
    setCopied(false);
    setAnnounce("");
    setStep(0);
  }

  return (
    <main id="main" className="section-pad !pt-12 md:!pt-16">
      <div className="container-x max-w-4xl">
        {!done && (
          <div className="mb-10">
            <StepIndicator current={step} />
          </div>
        )}

        {done ? (
          <section className="max-w-2xl">
            <span className="eyebrow">Booking request</span>
            <h1 ref={headingRef} tabIndex={-1} className="text-[38px] leading-[1.08] outline-none md:text-[56px]">Request received</h1>

            <div className="mt-8 rounded-xl border border-hairline bg-surface p-6 sm:p-8">
              <p className="m-0 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Your reference</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <p className="m-0 break-all font-display text-[40px] font-medium leading-none tracking-[-0.01em] text-ink [font-variant-numeric:lining-nums_tabular-nums] md:text-[48px]">{reference}</p>
                <button type="button" className="btn btn-secondary min-h-[44px] gap-2" onClick={copyReference}>
                  {copied ? <Check size={18} strokeWidth={1.5} aria-hidden="true" /> : <Copy size={18} strokeWidth={1.5} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy reference"}
                </button>
                <span className="sr-only" role="status" aria-live="polite">{announce}</span>
              </div>
              <p className="mt-3 text-[14px] text-muted">Keep it for any questions.</p>

              <dl className="mt-6 divide-y divide-hairline border-t border-hairline">
                {[
                  { Icon: CalendarDays, label: "Dates", value: `${fmtDay(stay.checkIn)} to ${fmtDay(stay.checkOut, true)}, ${nights} ${nights === 1 ? "night" : "nights"}` },
                  { Icon: BedDouble, label: "Room", value: bookedRoom?.name ?? "Room" },
                  { Icon: Users, label: "Guests", value: `${stay.guests} ${stay.guests === 1 ? "guest" : "guests"}` },
                  { Icon: Mail, label: "We will reply to", value: details.email },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 py-3.5">
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                    <dt className="w-[130px] shrink-0 text-[14px] text-muted sm:w-[160px]">{label}</dt>
                    <dd className="m-0 min-w-0 break-words text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10">
              <h2 className="text-[26px] leading-tight">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {NEXT_STEPS.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 space-y-3">
              <p>This is a request only: no payment has been taken.</p>
              <p className="text-[14px] text-muted">Terrantia is a concept demo. Prices and rooms are placeholders.</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary">Back to Terrantia</Link>
              <button type="button" className="btn btn-secondary" onClick={startOver}>Request another stay</button>
            </div>
          </section>
        ) : (
          <section aria-labelledby="step-heading">
            <span className="eyebrow">Step {step + 1} of 4</span>
            <h1 id="step-heading" ref={headingRef} tabIndex={-1} className="mb-8 text-[38px] leading-[1.08] outline-none md:text-[56px]">
              {HEADINGS[step]}
            </h1>

            {step === 0 && (
              <StepDates
                stay={stay}
                onStay={setStay}
                onResult={(r) => {
                  setResult(r);
                  // Keep a prior choice, or preselect the room from the URL, only if it is available.
                  const preferred = roomId || initialRoom;
                  setRoomId(r.quotes.some((q) => q.room.id === preferred && q.available) ? preferred : "");
                  setStep(1);
                }}
              />
            )}
            {step === 1 && result && (
              <div className="space-y-6">
                <StepRooms result={result} guests={stay.guests} selected={roomId} onSelect={setRoomId} onBack={() => setStep(0)} />
                <button type="button" className="btn btn-primary" disabled={!roomId} onClick={() => setStep(2)}>
                  Continue
                </button>
              </div>
            )}
            {step === 2 && quote && (
              <StepDetails
                roomName={quote.room.name}
                defaults={details}
                onBack={() => setStep(1)}
                onSubmit={(d) => {
                  setDetails(d);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && quote && roomId && (
              <StepReview
                booking={{ ...stay, roomId, ...details } as BookingInput}
                quote={quote}
                nights={nights}
                onBack={() => setStep(2)}
                onDone={setReference}
              />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
