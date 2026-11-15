// PLACEHOLDER: sample stay packages. Replace with real offers, terms and dates before launch.

export type Offer = {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  terms: string;
  image: string;
  alt: string;
  placeholder: true;
};

export const offers: Offer[] = [
  {
    id: "stay-longer",
    title: "Stay longer",
    summary: "Four nights or more, with the slow mornings included.",
    includes: ["Breakfast each morning", "One dinner on the beach", "Late check-out when available"],
    terms: "Sample offer. Minimum four nights.",
    image: "/media/gallery/gallery-3.jpg",
    alt: "An overwater villa terrace at dusk with a bedroom beyond open sliding doors",
    placeholder: true,
  },
  {
    id: "spa-escape",
    title: "Spa escape",
    summary: "Two nights built around rest: treatments, yoga and quiet.",
    includes: ["One treatment per guest", "Morning yoga", "Breakfast each morning"],
    terms: "Sample offer. Minimum two nights.",
    image: "/media/gallery/gallery-6.jpg",
    alt: "Wooden sun loungers and cream umbrellas beside a pool, under tall palms",
    placeholder: true,
  },
];
