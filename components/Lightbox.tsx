"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = { src: string; alt: string; width: number; height: number };

type LenisLike = { stop: () => void; start: () => void };

export default function Lightbox({
  images, index, onClose, onIndex,
}: { images: LightboxImage[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const n = images.length;
  const prev = () => onIndex((index - 1 + n) % n);
  const next = () => onIndex((index + 1) % n);

  useEffect(() => {
    const w = window as unknown as { __lenis?: LenisLike };
    w.__lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      w.__lenis?.start();
      document.body.style.overflow = overflow;
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "Tab") {
      const f = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!f || !f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  const img = images[index];
  const btn = "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-on-dark-muted/60 bg-dark/70 text-on-dark hover:bg-dark";
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery image ${index + 1} of ${n}`}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 p-4 md:p-10"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button type="button" aria-label="Close gallery" onClick={onClose} className={`${btn} absolute right-4 top-4 md:right-8 md:top-8`}>
        <X size={20} aria-hidden />
      </button>
      <button type="button" aria-label="Previous image" onClick={prev} className={`${btn} absolute left-4 top-1/2 -translate-y-1/2 md:left-8`}>
        <ChevronLeft size={20} aria-hidden />
      </button>
      <button type="button" aria-label="Next image" onClick={next} className={`${btn} absolute right-4 top-1/2 -translate-y-1/2 md:right-8`}>
        <ChevronRight size={20} aria-hidden />
      </button>
      <figure className="flex max-h-full max-w-full flex-col items-center">
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="90vw"
          className="h-auto max-h-[78vh] w-auto max-w-[88vw] rounded-xl object-contain"
        />
        <figcaption className="mt-4 text-center text-[15px] text-on-dark-muted" aria-live="polite">
          {img.alt} ({index + 1} of {n})
        </figcaption>
      </figure>
    </div>
  );
}
