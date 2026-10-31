"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Image frame with a clip-path reveal (bottom to top) and a small inner scale settle.
 * With `parallax`, children sit in an oversized layer (112% tall) that drifts about 8% in total.
 * In parallax mode children should fill the layer (next/image `fill`).
 * `overlay` renders above the image layer and does not move with the parallax.
 * Reduced motion: final state, no listeners. No JS: visible.
 */
export default function ClipReveal({
  children, className = "", delay = 0, parallax = false, overlay,
}: { children: React.ReactNode; className?: string; delay?: number; parallax?: boolean; overlay?: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = frame.current;
    const inn = inner.current;
    if (!el || !inn) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(inn, { scale: 1.08 });
      const st = { trigger: el, start: "top 85%", once: true };
      gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.out", delay, scrollTrigger: st, clearProps: "clipPath" });
      gsap.to(inn, { scale: 1, duration: 0.9, ease: "power2.out", delay, scrollTrigger: st, clearProps: "transform" });
    });
    if (parallax) {
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px) and (hover: hover)", () => {
        const l = layer.current;
        if (!l) return;
        gsap.fromTo(l, { yPercent: -4 }, {
          yPercent: 4, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }
    return () => mm.revert();
  }, [delay, parallax]);

  return (
    <div ref={frame} className={`relative overflow-hidden rounded-xl ${className}`}>
      <div ref={inner} className="relative h-full w-full">
        {parallax ? (
          <div ref={layer} className="absolute inset-x-0 -top-[6%] h-[112%]">{children}</div>
        ) : children}
        {overlay}
      </div>
    </div>
  );
}

/** Short heading whose text rises out of a mask when it enters the viewport. Visible with no JS or reduced motion. */
export function MaskHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const wrap = useRef<HTMLHeadingElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const w = wrap.current;
    const l = line.current;
    if (!w || !l) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(l, { yPercent: 110 });
      gsap.to(l, {
        yPercent: 0, duration: 0.6, ease: "expo.out",
        scrollTrigger: { trigger: w, start: "top 90%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <h2 ref={wrap} className={className}>
      <span className="block overflow-hidden pb-[0.12em]">
        <span ref={line} className="block">{children}</span>
      </span>
    </h2>
  );
}

/** Rises 40px into view with a fade when scrolled to. Decorative use. Visible with no JS or reduced motion. */
export function RiseIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 98%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return <div ref={ref} className={className} aria-hidden="true">{children}</div>;
}
