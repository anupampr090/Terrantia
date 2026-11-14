// PLACEHOLDER: replace with real nearby places once the location is set.
// Photos are existing placeholder stills from public/media, so alt text describes the photo.

export type PlaceMode = "walk" | "car" | "boat";

export type Place = {
  id: string;
  name: string;
  blurb: string;
  distance: string;
  mode: PlaceMode;
  image: string;
  alt: string;
  placeholder: true;
};

export const places: Place[] = [
  {
    id: "beach-cove",
    name: "Beach cove",
    blurb: "A sheltered strip of white sand for a first swim of the day.",
    distance: "5 min walk",
    mode: "walk",
    image: "/media/gallery/gallery-2.jpg",
    alt: "An infinity pool beside a white-sand beach, with leaning palm trees and the sea beyond",
    placeholder: true,
  },
  {
    id: "palm-walk",
    name: "Palm walk",
    blurb: "A shaded sand path under tall palms, easy on foot at any hour.",
    distance: "10 min walk",
    mode: "walk",
    image: "/media/gallery/gallery-5.jpg",
    alt: "A sandy path under tall palm trees between low cottages, with bright light at the far end",
    placeholder: true,
  },
  {
    id: "shoreline",
    name: "Shoreline stroll",
    blurb: "A long palm-lined shore, quietest in the early morning.",
    distance: "15 min walk",
    mode: "walk",
    image: "/media/gallery/gallery-4.jpg",
    alt: "Aerial view of a palm-lined shoreline with thatched cottages and a pool beside the sea",
    placeholder: true,
  },
  {
    id: "paddle-bay",
    name: "Paddle bay",
    blurb: "Calm water for paddleboards and sunset trips.",
    distance: "10 min by boat",
    mode: "boat",
    image: "/media/experiences/water.jpg",
    alt: "Two people on a paddleboard, silhouetted against the setting sun",
    placeholder: true,
  },
  {
    id: "sunset-deck",
    name: "Sunset on the water",
    blurb: "A quiet place to watch the light fade over still water.",
    distance: "15 min by car",
    mode: "car",
    image: "/media/gallery/gallery-3.jpg",
    alt: "A timber deck over calm water at dusk, with a bedroom visible through open sliding doors",
    placeholder: true,
  },
  {
    id: "beach-dinner",
    name: "Dinner on the sand",
    blurb: "A candlelit table by the sea, booked through the resort.",
    distance: "5 min by car",
    mode: "car",
    image: "/media/experiences/dining.jpg",
    alt: "A candlelit dinner table set on the sand between dark rocks, with the sea and a sunset sky behind",
    placeholder: true,
  },
];
