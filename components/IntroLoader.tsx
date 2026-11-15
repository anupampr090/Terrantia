"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

const WORD = "Terrantia";
type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

/**
 * First visit of the session, home route only. The overlay is hidden by default and
 * shown only under html.js:not(.intro-seen), so it never appears without JS.
 * Contract: on finish (or when skipped for any reason) html gets .intro-seen and
 * window fires 'terrantia:intro-done'.
 */
export default function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const markDone = () => {
      try { sessionStorage.setItem("terrantia-intro", "1"); } catch {}
      html.classList.add("intro-seen");
      window.dispatchEvent(new Event("terrantia:intro-done"));
    };

    if (html.classList.contains("intro-seen") || prefersReducedMotion() || window.location.pathname !== "/") {
      if (prefersReducedMotion() || window.location.pathname !== "/") {
        try { sessionStorage.setItem("terrantia-intro", "1"); } catch {}
      }
      markDone();
      // .intro-seen already hides the overlay in CSS. Unmount on the next frame.
      const raf = requestAnimationFrame(() => setGone(true));
      return () => cancelAnimationFrame(raf);
    }

    const el = root.current;
    if (!el) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis()?.stop();

    let finished = false;
    const restore = () => {
      document.body.style.overflow = prevOverflow;
      lenis()?.start();
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          finished = true;
          restore();
          markDone();
          setGone(true);
        },
      });
      tl.fromTo(".intro-letter", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "expo.out" }, 0)
        .fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 0.2)
        .to(el, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, 0.95);

      const skip = () => tl.progress(1);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") skip(); };
      el.addEventListener("click", skip);
      window.addEventListener("keydown", onKey);
      return () => {
        el.removeEventListener("click", skip);
        window.removeEventListener("keydown", onKey);
      };
    }, el);

    return () => {
      ctx.revert();
      if (!finished) restore();
    };
  }, []);

  if (gone) return null;
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] hidden cursor-pointer flex-col items-center justify-center bg-dark text-on-dark [.js:not(.intro-seen)_&]:flex"
    >
      <p className="font-display text-[44px] font-light leading-none tracking-[0.06em] md:text-[72px]">
        <span className="inline-flex overflow-hidden pb-2">
          {WORD.split("").map((c, i) => (
            <span key={i} className="intro-letter inline-block opacity-0">{c}</span>
          ))}
        </span>
      </p>
      <div className="intro-line mt-4 h-px w-40 origin-left bg-on-dark-muted md:w-56" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
