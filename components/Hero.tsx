"use client";
import { useEffect, useRef } from "react";
import { BedDouble, Car, MapPin, Star, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroVideo from "./HeroVideo";
import BookingBar from "./BookingBar";
import { resort } from "@/lib/resort";

// Hidden only once JS has set .js, and never under reduced motion.
const hide = "[.js_&]:opacity-0 motion-reduce:[.js_&]:opacity-100";
const shadow = "[text-shadow:0_1px_12px_rgba(9,34,42,0.7),0_1px_3px_rgba(9,34,42,0.5)]";

const facts: { I: LucideIcon; text: string }[] = [
  { I: BedDouble, text: `${resort.rooms} rooms and suites` },
  { I: Car, text: `${resort.transfer.minutes} min from ${resort.transfer.from}` },
  { I: Star, text: `${resort.rating.score} from ${resort.rating.count} ${resort.rating.source}` },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const kb = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Light scrub while the hero scrolls away. No pin: the page scrolls normally.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .fromTo(media.current, { scale: 1 }, { scale: 1.06 }, 0)
        .fromTo(dim.current, { opacity: 0 }, { opacity: 0.4 }, 0);

      // Ken Burns on its own wrapper so it does not fight the scroll scale
      gsap.fromTo(kb.current, { scale: 1 }, { scale: 1.06, duration: 14, ease: "none", yoyo: true, repeat: -1 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.fromTo(
        ".hero-word",
        { opacity: 0, yPercent: 60 },
        { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.04, clearProps: "transform" },
      ).fromTo(
        ".hero-fade",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, clearProps: "transform" },
        ">-0.3",
      );

      // Wait for the intro loader when it is going to run.
      const play = () => { tl.play(); };
      let timer: number | undefined;
      if (document.documentElement.classList.contains("intro-seen")) {
        play();
      } else {
        window.addEventListener("terrantia:intro-done", play, { once: true });
        timer = window.setTimeout(play, 6000);
      }
      return () => {
        window.removeEventListener("terrantia:intro-done", play);
        window.clearTimeout(timer);
      };
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <header ref={root} id="top" className="relative flex min-h-[100dvh] items-end overflow-hidden bg-dark text-on-dark">
      <div ref={media} className="absolute inset-0 will-change-transform">
        <div ref={kb} className="absolute inset-0 will-change-transform">
          <HeroVideo />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,34,42,0.85),rgba(9,34,42,0.15)_65%),linear-gradient(90deg,rgba(9,34,42,0.6),rgba(9,34,42,0)_62%)]" />
      <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(20deg,rgba(9,34,42,0.55),rgba(9,34,42,0)_65%)] md:block lg:hidden" />
      <div ref={dim} aria-hidden="true" className="absolute inset-0 bg-dark opacity-0" />
      <div className="container-x relative w-full pb-4 pt-24 md:pb-12 md:pt-28">
        <p className={`hero-fade mb-2 flex items-center gap-2 text-[12px] font-medium uppercase leading-[1.4] tracking-[0.12em] text-on-dark md:mb-3 ${shadow} ${hide}`}>
          <MapPin size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
          {resort.place}
        </p>
        <h1 className="text-[length:clamp(56px,11vh,72px)] leading-[0.95] tracking-[-0.02em] text-on-dark [text-shadow:0_2px_32px_rgba(9,34,42,0.7),0_1px_4px_rgba(9,34,42,0.45)] md:text-[length:clamp(64px,12vh,96px)]">
          <span className="sr-only">{resort.name}</span>
          <span aria-hidden="true">
            {resort.name.split("").map((c, i) => (
              <span key={i} className={`hero-word inline-block ${hide}`}>{c}</span>
            ))}
          </span>
        </h1>
        <p className={`hero-fade mt-3 max-w-[46ch] text-[16px] leading-[1.45] text-on-dark md:mt-5 md:text-[19px] md:leading-[1.5] ${shadow} ${hide}`}>
          {resort.descriptor}
        </p>
        <ul className={`hero-fade m-0 mt-3 flex list-none flex-wrap gap-x-6 gap-y-1 p-0 text-[14px] leading-[1.4] text-on-dark md:mt-5 md:gap-x-8 md:text-[15px] ${shadow} ${hide}`}>
          {facts.map(({ I, text }) => (
            <li key={text} className="inline-flex items-center gap-2">
              <I size={18} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
              {text}
            </li>
          ))}
        </ul>
        <div className={`hero-fade mt-4 md:mt-8 ${hide}`}>
          <BookingBar />
        </div>
        <p className={`hero-fade mt-3 text-[14px] leading-[1.4] text-on-dark md:mt-4 ${shadow} ${hide}`}>
          {resort.directPerk}{" "}
          <span className="text-on-dark-muted">Sample details until the resort confirms them.</span>
        </p>
      </div>
    </header>
  );
}
