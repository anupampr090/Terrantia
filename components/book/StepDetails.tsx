"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestDetailsShape, type GuestDetails } from "@/lib/booking-schema";
import FieldError from "./FieldError";

export default function StepDetails({
  roomName,
  defaults,
  onSubmit,
  onBack,
}: {
  roomName: string;
  defaults: GuestDetails;
  onSubmit: (d: GuestDetails) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestDetails>({ resolver: zodResolver(guestDetailsShape), defaultValues: defaults });

  const props = (name: keyof GuestDetails) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `err-${name}` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-6">
      <p className="text-[15px] text-muted">Room: <span className="text-ink">{roomName}</span>. Fields are all required except special requests.</p>
      <div>
        <label htmlFor="name" className="field-label">Full name</label>
        <input id="name" autoComplete="name" className="field" {...register("name")} {...props("name")} />
        <FieldError id="err-name" message={errors.name?.message} />
      </div>
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" type="email" autoComplete="email" className="field" {...register("email")} {...props("email")} />
        <FieldError id="err-email" message={errors.email?.message} />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">Phone</label>
        <input id="phone" type="tel" autoComplete="tel" className="field" {...register("phone")} {...props("phone")} />
        <FieldError id="err-phone" message={errors.phone?.message} />
      </div>
      <div>
        <label htmlFor="requests" className="field-label">Special requests (optional)</label>
        <textarea id="requests" rows={4} className="field !h-auto py-3" {...register("requests")} {...props("requests")} />
        <FieldError id="err-requests" message={errors.requests?.message} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary">Review request</button>
      </div>
    </form>
  );
}
