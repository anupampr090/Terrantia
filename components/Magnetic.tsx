"use client";
import { cloneElement, useEffect, useRef, type ReactElement } from "react";
import { gsap } from "gsap";

/**
 * Pulls its single child a few pixels toward the pointer. Desktop pointer only,
 * off under reduced motion. Uses gsap.quickTo, no React state.
 * Usage: <Magnetic><a className="btn btn-primary">Reserve</a></Magnetic>
 */
export default function Magnetic({
  children, strength = 0.25,
}: { children: ReactElement<{ ref?: React.Ref<HTMLElement> }>; strength?: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * strength);
        y((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => { x(0); y(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.set(el, { x: 0, y: 0 });
      };
    });
    return () => mm.revert();
  }, [strength]);

  return cloneElement(children, { ref });
}
