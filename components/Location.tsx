"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Car, ChevronLeft, ChevronRight, ExternalLink, Footprints, Ship, type LucideIcon } from "lucide-react";
import { places, type PlaceMode } from "@/lib/places";
import { resort } from "@/lib/resort";
import ClipReveal, { MaskHeading } from "./ClipReveal";
import PlaceholderNote from "./PlaceholderNote";

const MODE_ICON: Record<PlaceMode, LucideIcon> = { walk: Footprints, car: Car, boat: Ship };

const arrow =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:bg-surface-strong disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent motion-reduce:transition-none";

/** A quiet drawing in place of a real map: the location is a placeholder and the CSP blocks third-party frames. */
function CoastPanel() {
  return (
    <ClipReveal className="aspect-[4/3] bg-surface">
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* Water, below the shoreline */}
        <path
          d="M0 168 C 70 150, 120 214, 200 204 S 330 132, 400 156 V300 H0 Z"
          fill="var(--color-surface-strong)"
          opacity="0.6"
        />
        {/* Shoreline */}
        <path
          d="M0 168 C 70 150, 120 214, 200 204 S 330 132, 400 156"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Depth lines */}
        <path
          d="M0 206 C 80 190, 130 248, 205 240 S 330 176, 400 196"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M0 246 C 90 232, 140 282, 212 276 S 335 222, 400 238"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* The road in */}
        <path
          d="M400 44 C 330 58, 300 96, 262 150"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 7"
        />
        <circle cx="258" cy="158" r="14" fill="var(--color-accent)" opacity="0.14" />
        <circle cx="258" cy="158" r="5" fill="var(--color-accent)" />
        <text
          x="258"
          y="132"
          textAnchor="middle"
          fill="var(--color-ink)"
          fontSize="20"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Terrantia
        </text>
      </svg>
      <PlaceholderNote className="absolute bottom-4 left-4" text="Map placeholder" />
    </ClipReveal>
  );
}

export default function Location() {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const by = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * by, behavior: reduce ? "auto" : "smooth" });
  };

  const { minutes, from, by } = resort.transfer;

  return (
    <section id="location" className="section-pad relative z-10 bg-canvas">
      <div className="container-x">
        <MaskHeading className="text-[38px] leading-[1.08] tracking-[-0.015em] md:text-[56px]">Getting here</MaskHeading>

        <div className="mt-10 grid gap-12 md:mt-16 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <p className="m-0 font-display text-[28px] leading-[1.2] tracking-[-0.01em] text-ink md:text-[40px]">{resort.place}</p>
            <p className="mb-0 mt-5 max-w-[44ch]">
              {resort.descriptor} Most guests arrive from {from}, {minutes} minutes away by {by}.
            </p>
            <ul className="m-0 mt-8 list-none border-t border-hairline p-0">
              {resort.routes.map((r) => {
                const Mode = MODE_ICON[r.mode];
                return (
                  <li key={r.label} className="flex items-start gap-4 border-b border-hairline py-4">
                    <Mode size={20} strokeWidth={1.5} aria-hidden="true" className="mt-[3px] shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="m-0 text-[16px] font-medium leading-[1.4] text-ink">{r.label}</p>
                      <p className="m-0 mt-1 text-[15px] leading-[1.5] text-body">{r.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <a
                href={resort.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link inline-flex min-h-11 items-center gap-2"
              >
                <span>Open in Maps<span className="sr-only"> (opens in a new tab)</span></span>
                <ExternalLink size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
              </a>
            </div>
            <PlaceholderNote className="mt-4" text="Location and travel times are placeholders until the location is set." />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <CoastPanel />
          </div>
        </div>

        {/* Keeps the old #nearby anchor working */}
        <div id="nearby" className="mt-20 scroll-mt-20 md:mt-32">
          <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
            <h3 className="text-[28px] leading-[1.15] tracking-[-0.01em] md:text-[32px]">Nearby</h3>
            <div className="flex shrink-0 gap-3">
              <button type="button" className={arrow} onClick={() => step(-1)} disabled={!canPrev} aria-label="Previous places">
                <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button type="button" className={arrow} onClick={() => step(1)} disabled={!canNext} aria-label="Next places">
                <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
          {/* A native, user-driven sideways scroller with buttons. It never takes over the page scroll. */}
          <div
            ref={scroller}
            onScroll={update}
            role="region"
            aria-label="Places nearby"
            tabIndex={0}
            className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-4 px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8"
          >
            {places.map((p) => {
              const Mode = MODE_ICON[p.mode];
              return (
                <article key={p.id} className="w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[340px]">
                  <ClipReveal className="aspect-[4/5]">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 640px) 340px, 78vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </ClipReveal>
                  <h4 className="mb-2 mt-5 font-display text-[24px] font-medium leading-[1.2] text-ink md:text-[28px]">{p.name}</h4>
                  <p className="mb-3 text-[15px] text-body">{p.blurb}</p>
                  <p className="m-0 flex items-center gap-2 text-[13px] text-muted">
                    <Mode size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-accent" />
                    <span>{p.distance}</span>
                  </p>
                </article>
              );
            })}
          </div>
          <PlaceholderNote className="mt-10" text="Places and distances are placeholders until the location is set." />
        </div>
      </div>
    </section>
  );
}
