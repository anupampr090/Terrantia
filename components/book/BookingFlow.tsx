"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AvailabilityResult } from "@/lib/availability";
import { nightsBetween, type BookingInput, type GuestDetails } from "@/lib/booking-schema";
import type { BookingRoom } from "@/lib/booking-rooms";
import StepIndicator from "./StepIndicator";
import StepDates, { type Stay } from "./StepDates";
import StepRooms from "./StepRooms";
import StepDetails from "./StepDetails";
import StepReview from "./StepReview";

const HEADINGS = ["Choose your dates", "Choose a room", "Your details", "Review your request"];

export default function BookingFlow({ initial, initialRoom = "" }: { initial: Stay; initialRoom?: BookingRoom["id"] | "" }) {
  const [step, setStep] = useState(0);
  const [stay, setStay] = useState<Stay>(initial);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [roomId, setRoomId] = useState<BookingRoom["id"] | "">("");
  const [details, setDetails] = useState<GuestDetails>({ name: "", email: "", phone: "", requests: "" });
  const [reference, setReference] = useState("");
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

  return (
    <main id="main" className="section-pad !pt-12 md:!pt-16">
      <div className="container-x max-w-4xl">
        {!done && (
          <div className="mb-10">
            <StepIndicator current={step} />
          </div>
        )}

        {done ? (
          <section className="max-w-xl">
            <span className="eyebrow">Booking request</span>
            <h1 ref={headingRef} tabIndex={-1} className="text-[38px] leading-[1.08] outline-none md:text-[56px]">Request received</h1>
            <div role="status" className="mt-6 space-y-4">
              <p>
                Your reference is <strong className="text-ink">{reference}</strong>. Keep it for any questions.
              </p>
              <p>
                Our staff will review your request and reply by email to {details.email} with next steps. This is a request only: your stay is not secured until you hear back from us, and no payment has been taken.
              </p>
              <p className="text-[14px] text-muted">Terrantia is a concept demo. Prices and rooms are placeholders.</p>
            </div>
            <Link href="/" className="btn btn-secondary mt-8">Back to Terrantia</Link>
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
                nights={nightsBetween(stay.checkIn, stay.checkOut)}
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
