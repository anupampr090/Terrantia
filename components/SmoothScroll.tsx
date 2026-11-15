"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type W = { __lenis?: Lenis };

/**
 * Scroll feel: normal distance per wheel notch with a smooth glide. Wheel and trackpad only;
 * touch keeps native scrolling. No slowdown, no speed cap, no snapping: research on scrolljacking
 * (NN/g) found that changing scroll speed costs users more than it gives.
 * lerp: higher is snappier, lower is floatier.
 */
const FEEL = { lerp: 0.1 };

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // phone address bar show/hide must not re-run pinned layouts
    ScrollTrigger.config({ ignoreMobileResize: true });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    // Pinned sections measure their start and distance once. When the page height changes later
    // (pin spacers mounting, images, fonts) their numbers go stale, so re-measure after it settles.
    let lastH = document.documentElement.scrollHeight;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const h = document.documentElement.scrollHeight;
        if (Math.abs(h - lastH) > 2) { lastH = h; refresh(); }
      }, 200);
    });
    ro.observe(document.body);
    const late = [800, 2500].map((ms) => setTimeout(refresh, ms));
    const stopWatching = () => { ro.disconnect(); clearTimeout(timer); late.forEach(clearTimeout); };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => { window.removeEventListener("load", refresh); stopWatching(); };
    }
    const w = window as unknown as W;
    const lenis: Lenis = new Lenis({
      autoRaf: false,
      lerp: FEEL.lerp,
      // The 80px nav offset comes from `section[id] { scroll-margin-top }` in globals.css,
      // which Lenis and native anchors both honour. Do not add an offset here as well.
      anchors: true,
    });
    w.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      window.removeEventListener("load", refresh);
      stopWatching();
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete w.__lenis;
    };
  }, []);
  return <>{children}</>;
}
