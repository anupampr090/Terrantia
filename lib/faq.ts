// PLACEHOLDER: every answer and perk is draft copy. Confirm with the resort before launch.
import type { Detail } from "./rooms";

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  { q: "What time are check-in and check-out?", a: "Check-in is from 2 pm and check-out is by noon. Tell us if you arrive earlier or leave later and we will do our best." },
  { q: "Is there parking?", a: "Yes. Parking on site is free for guests." },
  { q: "Can I smoke?", a: "Rooms are non-smoking. There is a designated outdoor smoking area." },
  { q: "Do you arrange airport transfers?", a: "On request. We confirm the time and cost when we reply to your booking request." },
  { q: "Can I bring children or a pet?", a: "Children are welcome and cots are available. For pets, please ask in your request and we will confirm." },
  { q: "How do I pay?", a: "No payment is taken online. Send a request and our team replies by email to confirm your stay." },
];

export const directPerks: Detail[] = [
  { icon: "desk", label: "Early check-in or late check-out on request" },
  { icon: "bed", label: "A room upgrade when one is free" },
  { icon: "breakfast", label: "A welcome drink on arrival" },
];
