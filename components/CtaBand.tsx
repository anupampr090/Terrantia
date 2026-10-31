"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import useReducedMotion, { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { stories } from "@/lib/stories";

export default function CtaBand() {
  const [i, setI] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const reduced = useReducedMotion();
  const n = stories.length;
  const slide = useRef<HTMLDivElement>(null);
  const idx = useRef(0);
  const tween = useRef<gsap.core.Tween | null>(null);

  // Fade out with a 16px slide, swap the quote, fade in from the other side.
  const go = useCallback((step: number) => {
    const target = (idx.current + step + n) % n;
    const commit = () => { idx.current = target; setI(target); };
    const el = slide.current;
    if (!el || prefersReducedMotion()) { commit(); return; }
    tween.current?.kill();
    const dir = step > 0 ? 1 : -1;
    tween.current = gsap.to(el, {
      opacity: 0, x: -16 * dir, duration: 0.25, ease: "power1.in",
      onComplete: () => {
        commit();
        tween.current = gsap.fromTo(el, { opacity: 0, x: 16 * dir }, {
          opacity: 1, x: 0, duration: 0.35, ease: "power1.out", clearProps: "transform,opacity",
        });
      },
    });
  }, [n]);

  useEffect(() => () => { tween.current?.kill(); }, []);

  const playing = !userPaused && !hover && !focus && !reduced;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [playing, go]);

  const icon = "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-on-accent text-on-accent hover:bg-accent-hover";
  const s = stories[i];
  return (
    <section id="request" className="section-pad relative z-10 bg-accent text-center text-on-accent">
      <div className="container-x">
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Guest story (placeholder content)"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setFocus(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}
        >
          <figure className="m-0 min-h-[260px] md:min-h-[240px]" aria-live={playing ? "off" : "polite"} aria-atomic="true">
            <div ref={slide}>
              <blockquote className="mx-auto mb-4 max-w-[22em] font-display text-[30px] leading-[1.18] tracking-[-0.01em] text-on-accent md:text-[48px]">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <figcaption className="text-[15px] text-on-accent">
                {s.name}
              </figcaption>
            </div>
          </figure>
          <div className="mt-2 flex items-center justify-center gap-2">
            <button type="button" className={icon} aria-label="Previous story" onClick={() => go(-1)}>
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button type="button" className={icon} aria-label={userPaused ? "Play stories" : "Pause stories"} onClick={() => setUserPaused((p) => !p)}>
              {userPaused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
            </button>
            <button type="button" className={icon} aria-label="Next story" onClick={() => go(1)}>
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
        </div>
        <Reveal className="mt-24 md:mt-32">
          <h2 className="mb-4 text-[38px] leading-[1.08] tracking-[-0.015em] text-on-accent md:text-[56px]">Request your stay</h2>
          <p className="mb-8 text-on-accent">Send a request and our team will reply by email. No payment is taken.</p>
          <Magnetic>
            <Link href="/book" className="btn bg-canvas text-ink hover:bg-surface">Check availability</Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
