import { formatRate } from "@/lib/rooms";

/** Price block: "From" label, the amount in the display serif, "/ night" muted, and a quiet placeholder tag. */
export default function RoomPrice({
  rate, unit = "night", className = "",
}: { rate: number; unit?: string; className?: string }) {
  return (
    <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-2 ${className}`}>
      <p className="m-0 flex items-baseline gap-2">
        <span className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-muted">From</span>
        <span className="font-display text-[32px] font-medium leading-none tracking-[-0.01em] text-ink [font-variant-numeric:lining-nums_tabular-nums]">
          {formatRate(rate)}
        </span>
        <span className="text-[14px] text-muted">/ {unit}</span>
      </p>
      <span className="self-center rounded-full border border-hairline px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
        Placeholder price
      </span>
    </div>
  );
}
