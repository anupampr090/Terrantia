import { Check } from "lucide-react";

export const STEP_LABELS = ["Dates", "Rooms", "Details", "Review"] as const;

export default function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Booking progress">
      <ol className="flex items-center gap-3 sm:gap-6">
        {STEP_LABELS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} aria-current={active ? "step" : undefined} className="flex items-center gap-2 text-[15px]">
              <span
                aria-hidden="true"
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[13px] font-medium ${
                  active ? "border-accent bg-accent text-on-accent" : done ? "border-ink bg-ink text-canvas" : "border-hairline text-muted"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={`${active ? "font-medium text-ink" : "hidden text-muted sm:inline"}`}>
                {label}
                <span className="sr-only">{done ? " (completed)" : active ? " (current step)" : ""}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
