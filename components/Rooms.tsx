"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";
import RoomModal from "./RoomModal";
import { ArrowIcon } from "./ArrowLink";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import RoomDetails from "./RoomDetails";
import RoomPrice from "./RoomPrice";
import PlaceholderNote from "./PlaceholderNote";
import { rooms, roomHighlights, ROOM_HOLD, type Room } from "@/lib/rooms";

// Desktop only: phones, tablets, touch, reduced motion and no JS all get the stacked list.
const PIN_QUERY =
  "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 600px) and (hover: hover) and (pointer: fine)";
const HOLD = ROOM_HOLD; // share of each segment a room holds
const FADE = 1 - HOLD; // share spent crossfading

function ViewButton({ r, onOpen }: { r: Room; onOpen: (r: Room) => void }) {
  return (
    <button
      type="button"
      className="link group inline-flex min-h-11 items-center gap-2 whitespace-nowrap bg-transparent p-0"
      onClick={() => onOpen(r)}
      aria-haspopup="dialog"
    >
      <span>View room<span className="sr-only">: {r.name}</span></span>
      <ArrowIcon />
    </button>
  );
}

/** Default layout (phones, tablets, touch, reduced motion, no JS): a plain, stacked list. */
function Stacked({ onOpen }: { onOpen: (r: Room) => void }) {
  return (
    <div className="container-x space-y-20 md:space-y-32">
      {rooms.map((r) => (
        <Reveal as="article" key={r.id}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-[16/10]">
            <Image
              src={r.image}
              alt={r.alt}
              fill
              sizes="(min-width: 1200px) 1136px, 100vw"
              className="object-cover"
              style={{ objectPosition: r.position }}
            />
          </div>
          <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-12 md:gap-8">
            <h3 className="text-[34px] leading-[1.1] tracking-[-0.015em] md:col-span-6 md:text-[48px]">{r.name}</h3>
            <div className="md:col-span-6">
              <p className="m-0 max-w-[40ch]">{r.description}</p>
              <PlaceholderNote className="mt-3" />
              <RoomDetails items={roomHighlights(r)} className="mt-6" />
              <RoomPrice rate={r.nightlyRate} className="mt-6" />
              <div className="mt-5"><ViewButton r={r} onOpen={onOpen} /></div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Pinned, scroll-driven layout. Desktop only: mounted on the client after the media query matches. */
function Pinned({ onOpen }: { onOpen: (r: Room) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const n = rooms.length;
    const total = n - FADE; // timeline length in segments
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", el);
      const inners = gsap.utils.toArray<HTMLElement>("[data-inner]", el);
      const texts = gsap.utils.toArray<HTMLElement>("[data-text]", el);
      const fill = el.querySelector<HTMLElement>("[data-fill]");

      // Starting state, owned by GSAP only (never inline CSS transforms: GSAP reads those as px and the layers stick).
      gsap.set(layers.slice(1), { yPercent: 100 });
      gsap.set(inners.slice(1), { yPercent: -100, scale: 1.08 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => "+=" + total * window.innerHeight,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 20,
          scrub: true, // Lenis already smooths; extra scrub lag made fast scrolling feel like it was catching up
          invalidateOnRefresh: true,
        },
      });
      if (fill) tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: total }, 0);
      for (let i = 1; i < n; i++) {
        const s = i - FADE;
        // Wipe with transforms only (compositor, no repaint): the frame slides up while the image counter-slides,
        // which reads exactly like the old clip-path reveal. Both y tweens share one ease so the photo stays put.
        tl.fromTo(layers[i], { yPercent: 100 }, { yPercent: 0, ease: "power2.inOut", duration: FADE }, s);
        tl.fromTo(inners[i], { yPercent: -100 }, { yPercent: 0, ease: "power2.inOut", duration: FADE }, s);
        tl.fromTo(inners[i], { scale: 1.08 }, { scale: 1, ease: "power2.out", duration: FADE }, s);
        tl.to(texts[i - 1], { autoAlpha: 0, y: -18, duration: FADE * 0.4 }, s);
        tl.fromTo(texts[i], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: FADE * 0.45 }, s + FADE * 0.55);
      }
    }, el);
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, []);

  return (
    <div ref={wrap}>
      <div ref={stage} className="relative h-svh overflow-hidden bg-surface">
        {/* Images */}
        <div className="absolute inset-y-0 left-0 w-7/12 overflow-hidden">
          {rooms.map((r) => (
            <div
              key={r.id}
              data-layer
              className="absolute inset-0 overflow-hidden will-change-transform"
            >
              <div data-inner className="absolute inset-0 will-change-transform">
                <Image
                  src={r.image}
                  alt={r.alt}
                  fill
                  sizes="59vw"
                  className="object-cover"
                  style={{ objectPosition: r.position }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Text, all rooms share one grid cell; hidden rooms are visibility:hidden so they leave the tab order */}
        <div className="absolute inset-y-0 left-7/12 right-0 flex items-center px-16">
          <div className="flex w-full max-w-[480px] items-stretch gap-8">
            {/* Progress line, decorative, beside the text block */}
            <div aria-hidden="true" className="relative w-[2px] shrink-0 bg-accent/20">
              <div data-fill className="absolute inset-0 origin-top bg-accent" />
            </div>
            <div className="grid min-w-0 flex-1">
            {rooms.map((r, i) => (
              <div
                key={r.id}
                data-text
                className={`col-start-1 row-start-1 min-w-0 ${i > 0 ? "invisible" : ""}`}
                style={i > 0 ? { opacity: 0 } : undefined}
              >
                <h3 className="text-[56px] leading-[1.05] tracking-[-0.015em]">{r.name}</h3>
                <p className="mt-5 max-w-[40ch] text-[16px]">{r.description}</p>
                <RoomDetails items={roomHighlights(r)} className="mt-6" />
                <RoomPrice rate={r.nightlyRate} className="mt-6" />
                <div className="mt-5"><ViewButton r={r} onOpen={onOpen} /></div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Rooms() {
  const [active, setActive] = useState<Room | null>(null);
  const [pinned, setPinned] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const close = useCallback(() => setActive(null), []);

  // Mode switch: stacked by default (server, no JS, reduced motion, touch, small or short screens).
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mask line reveal for the heading.
  useEffect(() => {
    const el = heading.current;
    if (!el || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll("[data-m]"), { yPercent: 110 }, {
        yPercent: 0, duration: 0.6, ease: "expo.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="relative z-10 bg-surface pt-24 md:pt-40">
      <div className="container-x">
        {/* padding lives on an inner element: .container-x is unlayered CSS and would override pb-* on itself */}
        <div className="pb-16 md:pb-24">
          <h2 ref={heading} id="rooms-title" className="text-[38px] leading-[1.08] tracking-[-0.015em] md:text-[56px]">
            {"Three ways to stay".split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
                <span data-m className="inline-block">{w}</span>
                {" "}
              </span>
            ))}
          </h2>
          <PlaceholderNote className="mt-5" text="Room names, sizes, prices and copy are placeholders until the resort supplies final details." />
        </div>
      </div>
      {pinned ? (
        <Pinned onOpen={setActive} />
      ) : (
        <div className="pb-24 md:pb-40"><Stacked onOpen={setActive} /></div>
      )}
      {active && createPortal(<RoomModal room={active} onClose={close} />, document.body)}
    </section>
  );
}
