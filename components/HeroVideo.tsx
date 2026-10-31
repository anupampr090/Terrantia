"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Poster always renders; the video mounts only when motion is allowed. */
export default function HeroVideo() {
  const [play, setPlay] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setPlay(!mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Once the next section has covered the pinned hero, stop decoding the film (frees the main thread and GPU
  // during fast scrolling) and resume when the hero comes back into view.
  useEffect(() => {
    const v = video.current;
    if (!play || !v) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: "#top",
      start: "top top",
      end: () => "+=" + Math.round(window.innerHeight * 1.15),
      onLeave: () => v.pause(),
      onEnterBack: () => { v.play().catch(() => {}); },
    });
    return () => st.kill();
  }, [play]);
  return (
    <>
      <Image src="/media/hero/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      {play && (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/hero/hero-poster.jpg"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/media/hero/hero.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
