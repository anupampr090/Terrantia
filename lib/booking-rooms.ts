// PLACEHOLDER data: names, rates and capacities are not real.
export type BookingRoom = {
  id: "garden-villa" | "pool-suite" | "beach-residence";
  name: string;
  blurb: string;
  nightlyRate: number; // placeholder, USD
  sleeps: number;
  image: string;
};

export const BOOKING_ROOMS: readonly BookingRoom[] = [
  { id: "garden-villa", name: "Balcony Room", blurb: "King bed and a screened balcony. Placeholder description.", nightlyRate: 420, sleeps: 2, image: "/media/rooms/room-garden.jpg" },
  { id: "pool-suite", name: "Poolside Twin Room", blurb: "Twin beds with doors to the pool terrace. Placeholder description.", nightlyRate: 560, sleeps: 2, image: "/media/rooms/room-pool.jpg" },
  { id: "beach-residence", name: "Bay View Suite", blurb: "Freestanding bath and wide views over the bay. Placeholder description.", nightlyRate: 880, sleeps: 2, image: "/media/rooms/room-beach.jpg" },
];

export const ROOM_IDS = ["garden-villa", "pool-suite", "beach-residence"] as const;

export function getBookingRoom(id: string) {
  return BOOKING_ROOMS.find((r) => r.id === id);
}
