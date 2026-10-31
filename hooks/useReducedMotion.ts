"use client";
import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** true when the visitor prefers reduced motion. Server and first paint report true so no motion starts before measuring. */
export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(query).matches;
