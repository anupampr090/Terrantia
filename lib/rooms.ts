// All prices and copy are PLACEHOLDERS until the resort supplies real content.
export type Room = {
  id: string;
  name: string;
  features: [string, string];
  sleeps: number;
  nightlyRate: number; // PLACEHOLDER, USD
  image: string;
  alt: string;
  position: string; // CSS object-position for tall crops
  description: string;
  amenities: string[];
};

/** Share of each pinned scroll segment that one room holds. Used by Rooms.tsx and SectionSnap.tsx. */
export const ROOM_HOLD = 0.6;

export const rooms: Room[] = [
  {
    id: "garden-villa",
    name: "Balcony Room",
    features: ["King bed, timber ceiling", "Screened balcony"],
    sleeps: 2,
    nightlyRate: 0,
    image: "/media/rooms/room-garden.jpg",
    position: "62% 50%",
    alt: "Bedroom with a king bed, a timber ceiling and sliding glass doors to a screened balcony",
    description:
      "A calm bedroom with a king bed, warm wood floors and glass doors opening to a screened balcony. Placeholder description until final copy is supplied.",
    amenities: ["King bed", "Screened balcony", "Timber ceiling", "Air conditioning", "Wi-Fi", "Breakfast basket (placeholder)"],
  },
  {
    id: "pool-suite",
    name: "Poolside Twin Room",
    features: ["Twin beds", "Glass doors to the pool"],
    sleeps: 2,
    nightlyRate: 0,
    image: "/media/rooms/room-pool.jpg",
    position: "42% 50%",
    alt: "Twin beds in a bedroom with sliding glass doors opening to a pool and sun loungers",
    description:
      "Twin beds and sliding glass doors that open onto a pool terrace with sun loungers. Placeholder description.",
    amenities: ["Twin beds", "Pool terrace", "Sun loungers", "Air conditioning", "Wi-Fi", "Mini bar (placeholder)"],
  },
  {
    id: "beach-residence",
    name: "Bay View Suite",
    features: ["King bed, freestanding bath", "Terrace over the bay"],
    sleeps: 2,
    nightlyRate: 0,
    image: "/media/rooms/room-beach.jpg",
    position: "62% 50%",
    alt: "Bright bedroom with a freestanding bath and wide windows over a hillside bay",
    description:
      "A bright suite with a freestanding bath and wide windows over a hillside bay. Placeholder description.",
    amenities: ["King bed", "Freestanding bath", "Bay view terrace", "Air conditioning", "Wi-Fi", "Daily housekeeping (placeholder)"],
  },
];

export function formatRate(n: number): string {
  return `$${String(n).padStart(3, "0")}`;
}
