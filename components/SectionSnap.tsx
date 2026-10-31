"use client";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Snap from "lenis/snap";
import type Lenis from "lenis";
import { ROOM_HOLD } from "@/lib/rooms";

/**
 * Soft magnet to each section's best view (home page, wheel and trackpad only).
 *
 * Proximity snapping: scroll freely; when you stop near a snap point the page glides onto it.
 * After it settles on a full section the page holds for DWELL_MS (wheel input is swallowed by the
 * governor in SmoothScroll.tsx), so the view rests before the next move. Room steps and the
 * gallery pan do not dwell. Touch, reduced motion and a missing Lenis do nothing.
 *
 * Retune here.
 */
const CFG = {
  threshold: "22%" as const, // pull distance, relative to the viewport height
  debounce: 320,             // ms of stillness before the pull starts
  duration: 1.1,             // seconds for the glide
  dwellMs: 400,
  ease: (t: number) => 1 - Math.pow(1 - t, 3),
};

type W = { __lenis?: Lenis; __scrollDwellUntil?: number; __scrollDir?: number; __snap?: Snap };

export default function SectionSnap() {
  useEffect(() => {
    const ok = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    if (!ok.matches) return;
    const w = window as unknown as W;

    let snap: Snap | undefined;
    let removers: (() => void)[] = [];
    let noDwell = new Set<number>();
    let poll: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    // Layout position that ignores transforms (parallax) and works through pin spacers.
    const topOf = (el: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };
    const centred = (el: HTMLElement) => topOf(el) + el.offsetHeight / 2 - window.innerHeight / 2;
    const pinIn = (selector: string) =>
      ScrollTrigger.getAll().find((st) => st.pin && (st.pin as HTMLElement).closest(selector));

    const build = () => {
      if (!snap) return;
      removers.forEach((r) => r());
      removers = [];
      noDwell = new Set();
      const max = maxScroll();
      const points = new Map<number, boolean>(); // value -> dwells
      const add = (v: number, dwell: boolean) => {
        const value = Math.round(Math.min(max, Math.max(0, v)));
        const near = [...points.keys()].find((k) => Math.abs(k - value) < 40);
        if (near === undefined) points.set(value, dwell);
      };

      add(0, false);
      document.querySelectorAll<HTMLElement>("[data-snap-center]").forEach((el) => add(centred(el), true));

      // Rooms: room i is fully shown at timeline time i of total = n - FADE.
      const rooms = pinIn("#rooms");
      const n = document.querySelectorAll("#rooms [data-layer]").length;
      if (rooms && n > 1) {
        const total = n - (1 - ROOM_HOLD);
        for (let i = 0; i < n; i++) add(rooms.start + (i / total) * (rooms.end - rooms.start), false);
      }

      document.querySelectorAll<HTMLElement>("#experiences .snap-panel").forEach((el) => add(centred(el), true));

      // Gallery: only the start and end of the pan, never inside it.
      const gallery = pinIn("#gallery");
      if (gallery) { add(gallery.start, true); add(gallery.end, false); }

      const request = document.getElementById("request");
      if (request) add(centred(request), true);
      add(max, false);

      points.forEach((dwell, value) => {
        if (!dwell) noDwell.add(value);
        removers.push(snap!.add(value));
      });
    };

    const releaseDwell = () => { w.__scrollDwellUntil = 0; };

    const start = () => {
      const lenis = w.__lenis;
      if (!lenis || cancelled) return false;
      snap = new Snap(lenis, {
        type: "proximity",
        distanceThreshold: CFG.threshold,
        debounce: CFG.debounce,
        duration: CFG.duration,
        easing: CFG.ease,
        onSnapComplete: (item) => {
          if (!noDwell.has(Math.round(item.value))) w.__scrollDwellUntil = performance.now() + CFG.dwellMs;
        },
      });
      w.__snap = snap; // exposed for debugging and tests
      // Direction-aware: Lenis snaps to the nearest point either side, which would yank a slow reader
      // back to the section they are leaving. Only pull toward a point that lies ahead of the gesture.
      const inner = snap as unknown as { goTo: (i: number) => void; computeSnaps: () => { value: number }[] };
      const pull = inner.goTo.bind(snap);
      inner.goTo = (i: number) => {
        const dir = w.__scrollDir ?? 0;
        const target = inner.computeSnaps()[i]?.value;
        if (target !== undefined && dir !== 0) {
          const here = lenis.scroll;
          if ((dir > 0 && target < here - 8) || (dir < 0 && target > here + 8)) return;
        }
        pull(i);
      };
      build();
      ScrollTrigger.addEventListener("refresh", build);
      window.addEventListener("keydown", releaseDwell, true);
      window.addEventListener("pointerdown", releaseDwell, true);
      return true;
    };

    // SmoothScroll (a parent) creates Lenis after this child's effect runs, so wait for it.
    let tries = 0;
    if (!start()) {
      poll = setInterval(() => { if (start() || ++tries > 40) clearInterval(poll); }, 50);
    }

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      ScrollTrigger.removeEventListener("refresh", build);
      window.removeEventListener("keydown", releaseDwell, true);
      window.removeEventListener("pointerdown", releaseDwell, true);
      removers.forEach((r) => r());
      snap?.destroy();
      delete w.__snap;
      w.__scrollDir = 0;
      w.__scrollDwellUntil = 0;
    };
  }, []);

  return null;
}
