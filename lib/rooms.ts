// All prices and copy are PLACEHOLDERS until the resort supplies real content.
import { getBookingRoom } from "./booking-rooms";

/** One source for the placeholder rate, so the home page and /book never disagree. */
const rate = (id: string) => getBookingRoom(id)?.nightlyRate ?? 0;

/** Keys map to Lucide icons in components/RoomIcon.tsx. */
export type IconKey =
  | "guests" | "bed" | "twin" | "bath" | "balcony" | "pool" | "loungers" | "view" | "terrace"
  | "ceiling" | "floor" | "ac" | "wifi" | "breakfast" | "minibar" | "housekeeping"
  | "size"
  // facilities (lib/facilities.ts)
  | "parking" | "smoking" | "restaurant" | "bar" | "roomservice" | "desk" | "luggage"
  | "spa" | "sauna" | "yoga" | "gym" | "meeting" | "business" | "laundry" | "transfer"
  | "accessible" | "concierge";

export type Detail = { icon: IconKey; label: string };

export type Room = {
  id: string;
  name: string;
  sleeps: number;
  nightlyRate: number; // PLACEHOLDER, USD
  image: string;
  alt: string;
  position: string; // CSS object-position for tall crops
  /** One clean sentence. The placeholder note is rendered separately, never inside this text. */
  description: string;
  placeholder: true;
  /** What the photo shows, in priority order. Sleeps is added in front by roomHighlights(). */
  details: Detail[];
  /** Fuller list for the room pop-up. */
  amenities: Detail[];
};

/** Share of each pinned scroll segment that one room holds. Used by Rooms.tsx and SectionSnap.tsx. */
export const ROOM_HOLD = 0.6;

export const rooms: Room[] = [
  {
    id: "garden-villa",
    name: "Balcony Room",
    sleeps: 2,
    nightlyRate: rate("garden-villa"),
    image: "/media/rooms/room-garden.jpg",
    position: "62% 50%",
    alt: "Bedroom with a king bed, a timber ceiling and sliding glass doors to a screened balcony",
    description: "A calm bedroom with a king bed, warm wood floors and glass doors opening to a screened balcony.",
    placeholder: true,
    details: [
      { icon: "size", label: "32 m²" },
      { icon: "bed", label: "King bed" },
      { icon: "balcony", label: "Screened balcony" },
      { icon: "ceiling", label: "Timber ceiling" },
      { icon: "floor", label: "Warm wood floors" },
    ],
    amenities: [
      { icon: "size", label: "32 m²" },
      { icon: "bed", label: "King bed" },
      { icon: "balcony", label: "Screened balcony" },
      { icon: "ceiling", label: "Timber ceiling" },
      { icon: "ac", label: "Air conditioning" },
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "breakfast", label: "Breakfast basket (placeholder)" },
    ],
  },
  {
    id: "pool-suite",
    name: "Poolside Twin Room",
    sleeps: 2,
    nightlyRate: rate("pool-suite"),
    image: "/media/rooms/room-pool.jpg",
    position: "42% 50%",
    alt: "Twin beds in a bedroom with sliding glass doors opening to a pool and sun loungers",
    description: "Twin beds and sliding glass doors that open onto a pool terrace with sun loungers.",
    placeholder: true,
    details: [
      { icon: "size", label: "30 m²" },
      { icon: "twin", label: "Twin beds" },
      { icon: "pool", label: "Direct pool access" },
      { icon: "loungers", label: "Sun loungers" },
      { icon: "balcony", label: "Sliding glass doors" },
    ],
    amenities: [
      { icon: "size", label: "30 m²" },
      { icon: "twin", label: "Twin beds" },
      { icon: "pool", label: "Pool terrace" },
      { icon: "loungers", label: "Sun loungers" },
      { icon: "ac", label: "Air conditioning" },
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "minibar", label: "Mini bar (placeholder)" },
    ],
  },
  {
    id: "beach-residence",
    name: "Bay View Suite",
    sleeps: 2,
    nightlyRate: rate("beach-residence"),
    image: "/media/rooms/room-beach.jpg",
    position: "62% 50%",
    alt: "Bright bedroom with a freestanding bath and wide windows over a hillside bay",
    description: "A bright suite with a freestanding bath and wide windows over a hillside bay.",
    placeholder: true,
    details: [
      { icon: "size", label: "58 m²" },
      { icon: "bed", label: "King bed" },
      { icon: "bath", label: "Freestanding bath" },
      { icon: "view", label: "Views over the bay" },
      { icon: "terrace", label: "Terrace" },
    ],
    amenities: [
      { icon: "size", label: "58 m²" },
      { icon: "bed", label: "King bed" },
      { icon: "bath", label: "Freestanding bath" },
      { icon: "view", label: "Bay view terrace" },
      { icon: "ac", label: "Air conditioning" },
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "housekeeping", label: "Daily housekeeping (placeholder)" },
    ],
  },
];

/** Sleeps first, then what the photo shows. `max` trims for tight layouts (the mobile pinned stage). */
export function roomHighlights(r: Room, max?: number): Detail[] {
  const all: Detail[] = [{ icon: "guests", label: `Sleeps ${r.sleeps}` }, ...r.details];
  return max ? all.slice(0, max) : all;
}

export function formatRate(n: number): string {
  return `$${String(n).padStart(3, "0")}`;
}
