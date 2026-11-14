"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Car, ChevronLeft, ChevronRight, Footprints, Ship, type LucideIcon } from "lucide-react";
import { places, type PlaceMode } from "@/lib/places";
import ClipReveal, { MaskHeading } from "./ClipReveal";
import PlaceholderNote from "./PlaceholderNote";

const MODE_ICON: Record<PlaceMode, LucideIcon> = { walk: Footprints, car: Car, boat: Ship };

const arrow =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:bg-surface-strong disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent motion-reduce:transition-none";

export default function Nearby() {
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

  return (
    <section id="nearby" className="section-pad relative z-10 bg-canvas">
      <div className="container-x">
        <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
          <div>
            <span className="eyebrow">Nearby</span>
            <MaskHeading className="text-[38px] leading-[1.08] tracking-[-0.015em] md:text-[56px]">Close to the water</MaskHeading>
          </div>
          <div className="flex shrink-0 gap-3">
            <button type="button" className={arrow} onClick={() => step(-1)} disabled={!canPrev} aria-label="Previous places">
              <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" className={arrow} onClick={() => step(1)} disabled={!canNext} aria-label="Next places">
              <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
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
                <h3 className="mb-2 mt-5 text-[28px] font-medium leading-[1.1] text-ink md:text-[30px]">{p.name}</h3>
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
    </section>
  );
}
