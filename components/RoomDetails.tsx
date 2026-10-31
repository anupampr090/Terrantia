import RoomIcon from "./RoomIcon";
import type { Detail } from "@/lib/rooms";

/**
 * Icon rows: a thin teal line icon beside each detail, two columns where there is room.
 * compact: pinned stage, stacked list and /book cards. full: the room pop-up amenities.
 */
export default function RoomDetails({
  items, variant = "compact", className = "",
}: { items: Detail[]; variant?: "compact" | "full"; className?: string }) {
  const grid = variant === "full"
    ? "gap-x-10 gap-y-4 sm:grid-cols-2"
    : "gap-x-8 gap-y-3 min-[400px]:grid-cols-2";
  return (
    <ul className={`m-0 grid list-none p-0 ${grid} ${className}`}>
      {items.map((d) => (
        <li key={d.label} className="flex items-center gap-3 text-[15px] leading-[1.35] text-body">
          <RoomIcon name={d.icon} />
          <span>{d.label}</span>
        </li>
      ))}
    </ul>
  );
}
