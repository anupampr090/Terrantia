"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type W = { __lenis?: Lenis; __scrollDwellUntil?: number; __scrollDir?: number };

/**
 * Scroll feel. Wheel and trackpad only (hover + fine pointer); touch keeps native scrolling.
 * Retune here: wheelMultiplier = distance per notch, speedCap* = how fast a flick may travel,
 * dwell is set by SectionSnap and holds wheel input briefly after a section settles.
 */
const FEEL = {
  wheelMultiplier: 0.65,
  lerp: 0.08,              // continuous smoothing; duration+easing restarts on every wheel event and judders
  speedCapWindowMs: 500,   // sliding window for the cap
  speedCapScreens: 1.3,    // max travel inside that window, in viewport heights
  maxEventDelta: 120,      // largest single wheel event after the multiplier, in px
};

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
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const w = window as unknown as W;
    const recent: { t: number; d: number }[] = [];
    // Speed governor (fine pointers only): clamps single events and swallows wheel input once the
    // recent travel budget is spent, so a hard flick cannot whip past sections. Also honours the dwell hold.
    const governor = (data: { deltaY: number; event: Event }) => {
      if (!fine || !data.event.type.includes("wheel")) return true;
      if (lenis.isStopped) return true;
      if (data.deltaY !== 0) w.__scrollDir = Math.sign(data.deltaY); // read by SectionSnap: never pull against the gesture
      const now = performance.now();
      if (now < (w.__scrollDwellUntil ?? 0)) return false;
      while (recent.length && now - recent[0].t > FEEL.speedCapWindowMs) recent.shift();
      const used = recent.reduce((n, r) => n + r.d, 0);
      // Taper, do not cut: full speed until half the budget is spent, then ease to zero. A hard stop reads as stutter.
      const left = 1 - used / (FEEL.speedCapScreens * window.innerHeight);
      if (left <= 0.03) return false;
      const d = Math.min(Math.abs(data.deltaY), FEEL.maxEventDelta) * Math.min(1, left / 0.5);
      data.deltaY = Math.sign(data.deltaY) * d;
      recent.push({ t: now, d });
      return true;
    };
    const lenis: Lenis = new Lenis({
      autoRaf: false,
      ...(fine
        ? { lerp: FEEL.lerp, wheelMultiplier: FEEL.wheelMultiplier }
        : { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }),
      virtualScroll: governor,
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
