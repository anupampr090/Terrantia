"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/** Mobile only. Shows after the hero scrolls away, hides over the CTA band and footer. */
export default function StickyReserve() {
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    // This bar is md:hidden. Do not run scroll handlers on desktop where it can never be seen.
    const mobile = window.matchMedia("(max-width: 767px)");
    if (!mobile.matches) return;
    const cta = document.getElementById("request");
    const foot = document.querySelector("footer");
    const rooms = document.getElementById("rooms");
    // The hero pins for one viewport of scroll, so wait about 1.2 viewports.
    // Without pinning (reduced motion) use the rooms section reaching the top.
    let frame = 0;
    let last: boolean | null = null;
    const check = () => {
      frame = 0;
      const vh = window.innerHeight;
      const pinned = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const past = pinned
        ? window.scrollY > vh * 1.2
        : (rooms ? rooms.getBoundingClientRect().top <= 0 : window.scrollY > vh);
      if (past !== last) { last = past; setPastHero(past); }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ends = new Set<Element>();
    const endIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) ends.add(e.target);
        else ends.delete(e.target);
      }
      setNearEnd(ends.size > 0);
    });
    if (cta) endIO.observe(cta);
    if (foot) endIO.observe(foot);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      endIO.disconnect();
    };
  }, []);

  const show = pastHero && !nearEnd;
  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden ${
        show ? "visible translate-y-0" : "invisible translate-y-full"
      }`}
    >
      <Link href="/book" tabIndex={show ? 0 : -1} className="btn btn-primary w-full !text-on-accent">Request your stay</Link>
    </div>
  );
}
