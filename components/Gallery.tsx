"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";
import ClipReveal from "./ClipReveal";
import Lightbox, { type LightboxImage } from "./Lightbox";

const images: LightboxImage[] = [
  { src: "/media/gallery/gallery-1.jpg", alt: "Resort pool with a thatched swim-up bar, pavilions and tall palms", width: 2000, height: 1333 },
  { src: "/media/gallery/gallery-2.jpg", alt: "Curved infinity pool beside a white sand beach and leaning palms", width: 1500, height: 2004 },
  { src: "/media/gallery/gallery-3.jpg", alt: "Overwater villa terrace at dusk, with a bedroom beyond the open sliding doors", width: 2000, height: 1333 },
  { src: "/media/gallery/gallery-4.jpg", alt: "Aerial view of thatched beachfront bungalows, a lawn and a pool beside the sea", width: 2000, height: 1125 },
  { src: "/media/gallery/gallery-5.jpg", alt: "A sandy path under palm trees between low bungalows, with light at the far end", width: 2000, height: 1335 },
  { src: "/media/gallery/gallery-6.jpg", alt: "Wooden sun loungers and cream umbrellas beside a pool, under tall palms", width: 1400, height: 2100 },
];

const PAN_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [pan, setPan] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }

  // Switch to the pinned pan only after mount, so server markup is the masonry.
  useEffect(() => {
    const mq = window.matchMedia(PAN_QUERY);
    const update = () => setPan(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pan) return;
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    gsap.registerPlugin(ScrollTrigger);
    const dist = () => Math.max(0, tr.scrollWidth - window.innerWidth);
    const ctx = gsap.context(() => {
      gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 10,
        },
      });
    }, sec);
    return () => ctx.revert();
  }, [pan]);

  function openAt(e: React.MouseEvent<HTMLButtonElement>, i: number) {
    trigger.current = e.currentTarget;
    setOpen(i);
  }

  const label = (im: LightboxImage, i: number) => `Open image ${i + 1} of ${images.length}: ${im.alt}`;

  return (
    <>
      <section
        ref={section}
        id="gallery"
        className={`relative z-10 bg-dark text-on-dark ${pan ? "flex h-svh flex-col justify-center gap-10 overflow-clip" : "section-pad"}`}
      >
        {pan ? (
          <>
            <div className="container-x w-full">
              <span className="eyebrow !text-on-dark-muted">Gallery</span>
              <h2 className="text-[56px] leading-[1.08] tracking-[-0.015em] text-on-dark">The place, in light</h2>
            </div>
            <div ref={track} className="flex w-max gap-6 px-8 will-change-transform">
              {images.map((im, i) => (
                <button
                  key={im.src}
                  type="button"
                  aria-label={label(im, i)}
                  onClick={(e) => openAt(e, i)}
                  style={{ aspectRatio: `${im.width} / ${im.height}` }}
                  className="group relative block h-[64svh] shrink-0 cursor-zoom-in overflow-hidden rounded-xl"
                >
                  <Image
                    src={im.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    loading="eager"
                    className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="container-x">
            <Reveal className="mb-16">
              <span className="eyebrow !text-on-dark-muted">Gallery</span>
              <h2 className="text-[38px] leading-[1.08] tracking-[-0.015em] text-on-dark md:text-[56px]">The place, in light</h2>
            </Reveal>
            <div className="columns-1 gap-4 min-[560px]:columns-2 lg:columns-3">
              {images.map((im, i) => (
                <ClipReveal key={im.src} delay={Math.min(i % 6, 5) * 0.06} className="mb-4 break-inside-avoid">
                  <button
                    type="button"
                    aria-label={label(im, i)}
                    onClick={(e) => openAt(e, i)}
                    className="group block w-full cursor-zoom-in overflow-hidden rounded-xl"
                  >
                    <Image
                      src={im.src}
                      alt=""
                      width={im.width}
                      height={im.height}
                      sizes="(min-width: 1024px) 368px, (min-width: 560px) 46vw, 100vw"
                      loading="lazy"
                      className="h-auto w-full transition-transform duration-[600ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </button>
                </ClipReveal>
              ))}
            </div>
          </div>
        )}
      </section>
      {open !== null && <Lightbox images={images} index={open} onClose={close} onIndex={setOpen} />}
    </>
  );
}
