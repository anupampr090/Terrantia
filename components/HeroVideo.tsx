"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Conn = { saveData?: boolean; effectiveType?: string };

/**
 * Poster always renders. The film mounts only when motion is allowed and the visitor has not asked
 * to save data (or is on a 2G connection). Phones get the lighter 1280px file.
 */
export default function HeroVideo() {
  const [play, setPlay] = useState(false);
  const [src, setSrc] = useState("/media/hero/hero.mp4");
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const on = () => {
      const conn = (navigator as Navigator & { connection?: Conn }).connection;
      const frugal = !!conn && (conn.saveData === true || /2g/.test(conn.effectiveType ?? ""));
      setSrc(small.matches ? "/media/hero/hero-mobile.mp4" : "/media/hero/hero.mp4");
      setPlay(!mq.matches && !frugal);
    };
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
  }, [play, src]);
  return (
    <>
      <Image src="/media/hero/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      {play && (
        <video
          ref={video}
          key={src}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/hero/hero-poster.jpg"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </>
  );
}
