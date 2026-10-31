import {
  Armchair, BedDouble, BedSingle, Bath, BrushCleaning, Coffee, DoorOpen, Layers, House,
  Mountain, Umbrella, Users, Waves, Wifi, Wind, Wine, type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/rooms";

/** One registry for every room icon, so size, stroke and colour cannot drift between screens. */
const ICONS: Record<IconKey, LucideIcon> = {
  guests: Users,
  bed: BedDouble,
  twin: BedSingle,
  bath: Bath,
  balcony: DoorOpen,
  pool: Waves,
  loungers: Umbrella,
  view: Mountain,
  terrace: Armchair,
  ceiling: House,
  floor: Layers,
  ac: Wind,
  wifi: Wifi,
  breakfast: Coffee,
  minibar: Wine,
  housekeeping: BrushCleaning,
};

export default function RoomIcon({ name, size = 18, className = "" }: { name: IconKey; size?: number; className?: string }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" className={`shrink-0 text-accent ${className}`} />;
}
