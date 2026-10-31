"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

const line = "Slow mornings, warm water and long evenings on the sand.";

export default function Intro() {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll("[data-w]"), { opacity: 0.3 }, {
        opacity: 1, ease: "none", duration: 1, stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section data-snap-center className="section-pad relative z-10 bg-canvas">
      <div className="container-x">
        <p ref={root} className="max-w-[20em] font-display text-[32px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[56px]">
          {line.split(" ").map((w, i) => (
            <span key={i}>
              <span data-w>{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
