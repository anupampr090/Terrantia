"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Fade + 14px rise on entering viewport (top 90%). Children of a stagger group: pass `stagger`. */
export default function Reveal({
  children, className = "", stagger = false, as: Tag = "div",
}: { children: React.ReactNode; className?: string; stagger?: boolean; as?: "div" | "section" | "article" | "figure" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const targets = stagger ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.fromTo(targets, { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.5, ease: "power1.out", stagger: stagger ? 0.06 : 0,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger]);
  const Comp = Tag as React.ElementType;
  return <Comp ref={ref} className={`${stagger ? "" : "rv"} ${className}`}>{children}</Comp>;
}
