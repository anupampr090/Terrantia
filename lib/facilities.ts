// PLACEHOLDER: confirm each facility with the resort before launch.
import type { Detail } from "./rooms";

export type FacilityGroup = {
  id: string;
  title: string;
  blurb: string;
  items: Detail[];
  placeholder: true;
};

/** The three things guests look for first. Shown as a quick strip above the full groups. */
export const facilityHighlights: Detail[] = [
  { icon: "wifi", label: "Wi-Fi throughout" },
  { icon: "parking", label: "Free parking" },
  { icon: "pool", label: "Pool" },
];

export const facilityGroups: FacilityGroup[] = [
  {
    id: "essentials",
    title: "The essentials",
    blurb: "The small things that make a stay easy.",
    placeholder: true,
    items: [
      { icon: "wifi", label: "Wi-Fi throughout" },
      { icon: "parking", label: "Free parking (placeholder)" },
      { icon: "smoking", label: "Designated smoking area (placeholder)" },
      { icon: "ac", label: "Air conditioning" },
      { icon: "desk", label: "24-hour front desk" },
      { icon: "luggage", label: "Luggage storage" },
    ],
  },
  {
    id: "dining",
    title: "Dining and bars",
    blurb: "Meals from morning to late, indoors or by the water.",
    placeholder: true,
    items: [
      { icon: "restaurant", label: "Restaurant" },
      { icon: "bar", label: "Bar" },
      { icon: "breakfast", label: "Breakfast" },
      { icon: "roomservice", label: "Room service (placeholder hours)" },
    ],
  },
  {
    id: "wellness",
    title: "Spa and wellness",
    blurb: "Slow mornings, quiet afternoons.",
    placeholder: true,
    items: [
      { icon: "spa", label: "Spa treatments" },
      { icon: "sauna", label: "Sauna and steam" },
      { icon: "yoga", label: "Yoga" },
      { icon: "gym", label: "Gym" },
      { icon: "pool", label: "Pool" },
    ],
  },
  {
    id: "services",
    title: "Business and services",
    blurb: "For working trips and for travelling with others.",
    placeholder: true,
    items: [
      { icon: "meeting", label: "Meeting room" },
      { icon: "business", label: "Business corner" },
      { icon: "laundry", label: "Laundry" },
      { icon: "transfer", label: "Airport transfer (placeholder)" },
      { icon: "accessible", label: "Accessible rooms" },
      { icon: "concierge", label: "Concierge" },
    ],
  },
];
