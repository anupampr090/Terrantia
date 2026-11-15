"use client";
import { useRef, useState } from "react";
import Image from "next/image";
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

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  function close() {
    setOpen(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }

  function openAt(e: React.MouseEvent<HTMLButtonElement>, i: number) {
    trigger.current = e.currentTarget;
    setOpen(i);
  }

  const label = (im: LightboxImage, i: number) => `Open image ${i + 1} of ${images.length}: ${im.alt}`;

  return (
    <>
      <section id="gallery" className="section-pad relative z-10 bg-dark text-on-dark">
        <div className="container-x">
          <Reveal className="mb-12 md:mb-16">
            <span className="eyebrow !text-on-dark-muted">Gallery</span>
            <h2 className="text-[38px] leading-[1.08] tracking-[-0.015em] text-on-dark md:text-[56px]">The place, in light</h2>
          </Reveal>
          {/* Masonry at every size: the page only ever scrolls vertically. Heights come from each photo's real ratio. */}
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3 lg:gap-6">
            {images.map((im, i) => (
              <ClipReveal key={im.src} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid lg:mb-6">
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
                    sizes="(min-width: 1200px) 363px, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
                    loading="lazy"
                    className="h-auto w-full transition-transform duration-[600ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </button>
              </ClipReveal>
            ))}
          </div>
        </div>
      </section>
      {open !== null && <Lightbox images={images} index={open} onClose={close} onIndex={setOpen} />}
    </>
  );
}
