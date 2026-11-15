"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroVideo from "./HeroVideo";
import BookingBar from "./BookingBar";

const HEADLINE = "Where the land meets the sea";
// Hidden only once JS has set .js, and never under reduced motion.
const hideWord = "[.js_&]:opacity-0 motion-reduce:[.js_&]:opacity-100";
const hideFade = "[.js_&]:opacity-0 motion-reduce:[.js_&]:opacity-100";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const kb = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Pinned, scrubbed exit: later sections slide over the hero like a curtain.
      const exit = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: root.current,
          pinSpacing: false,
          anticipatePin: 1,
          refreshPriority: 30,
        },
      });
      exit
        .fromTo(media.current, { scale: 1 }, { scale: 1.12 }, 0)
        .fromTo(dim.current, { opacity: 0 }, { opacity: 0.6 }, 0)
        .fromTo(copy.current, { y: 0, opacity: 1 }, { y: -60, opacity: 0.15 }, 0);

      // Ken Burns on its own wrapper so it does not fight the scroll scale
      gsap.fromTo(kb.current, { scale: 1 }, { scale: 1.06, duration: 14, ease: "none", yoyo: true, repeat: -1 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.fromTo(
        ".hero-word",
        { opacity: 0, yPercent: 60 },
        { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.08, clearProps: "transform" },
      ).fromTo(
        ".hero-fade",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, clearProps: "transform" },
        ">-0.2",
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
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,34,42,0.8),rgba(9,34,42,0.1)_60%),linear-gradient(90deg,rgba(9,34,42,0.6),rgba(9,34,42,0)_62%)]" />
      <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(20deg,rgba(9,34,42,0.55),rgba(9,34,42,0)_65%)] md:block lg:hidden" />
      <div ref={dim}aria-hidden="true" className="absolute inset-0 bg-dark opacity-0" />
      <div className="container-x relative w-full pb-8 pt-32 md:pb-16">
        <div ref={copy} className="will-change-transform">
        <h1 className="max-w-[12ch] text-[52px] leading-[1.02] tracking-[-0.02em] text-on-dark [text-shadow:0_2px_32px_rgba(9,34,42,0.7),0_1px_4px_rgba(9,34,42,0.45)] md:text-[88px]">
          <span className="sr-only">{HEADLINE}</span>
          <span aria-hidden="true">
            {HEADLINE.split(" ").map((w, i) => (
              <span key={i}>
                <span className={`hero-word inline-block ${hideWord}`}>{w}</span>
                {" "}
              </span>
            ))}
          </span>
        </h1>
        <p className={`hero-fade mb-8 mt-5 max-w-[46ch] text-[17px] text-on-dark [text-shadow:0_1px_12px_rgba(9,34,42,0.6)] md:mb-10 md:mt-6 md:text-[19px] ${hideFade}`}>
          A beachfront retreat of rooms and suites, set between palms and open water.
        </p>
        </div>
        <div className={`hero-fade ${hideFade}`}>
          <BookingBar />
        </div>
      </div>
    </header>
  );
}
