// PLACEHOLDER: every fact here is sample content until the resort supplies real details.
// One source for the hero, the proof strip and the location section, so the facts never disagree.
// Never copy the rating into structured data (JSON-LD): a sample rating must not reach search engines.

export const resort = {
  name: "Terrantia",
  /** Shown above the name in the hero. */
  place: "Coral Bay, Southern Coast",
  /** One specific sentence: what it is and where. */
  descriptor: "Twenty-four rooms and suites on a quiet bay, between palm groves and open water.",
  rooms: 24,
  transfer: { minutes: 25, from: "the airport", by: "car" },
  rating: { score: 4.8, outOf: 5, count: 212, source: "guest reviews" },
  /** The one perk named next to the date search. */
  directPerk: "Book direct for early check-in when a room is ready.",
  awards: [
    { title: "Award name", issuer: "Awarding body", year: 2026 },
    { title: "Award name", issuer: "Awarding body", year: 2025 },
  ],
  /** Getting here, shown in the location section. */
  routes: [
    { mode: "car" as const, label: "From the airport", detail: "25 minutes by car. Transfers on request." },
    { mode: "boat" as const, label: "From the harbour", detail: "10 minutes by boat." },
    { mode: "walk" as const, label: "To the beach", detail: "A two-minute walk from every room." },
  ],
  mapUrl: "https://maps.google.com/",
  placeholder: true as const,
};

export type Resort = typeof resort;
