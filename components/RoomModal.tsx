"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import RoomIcon from "./RoomIcon";
import RoomDetails from "./RoomDetails";
import RoomPrice from "./RoomPrice";
import type { Room } from "@/lib/rooms";

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export default function RoomModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const prev = useRef<Element | null>(null);

  useEffect(() => {
    prev.current = document.activeElement;
    const el = dialog.current!;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis()?.stop();
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const opener = prev.current as HTMLElement | null;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      lenis()?.start();
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-dark/70 p-0 md:items-center md:p-8"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-modal-title"
        data-lenis-prevent
        className="relative max-h-[92dvh] w-full max-w-[880px] overflow-y-auto rounded-t-xl bg-canvas md:rounded-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close room details"
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-canvas text-ink"
        >
          <X size={22} aria-hidden="true" />
        </button>
        <div className="relative aspect-[16/9] w-full">
          <Image src={room.image} alt={room.alt} fill sizes="(min-width: 920px) 880px, 100vw" className="object-cover" />
        </div>
        <div className="p-6 md:p-10">
          <span className="flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
            <RoomIcon name="guests" />
            Sleeps {room.sleeps}
          </span>
          <h2 id="room-modal-title" className="mt-3 text-[36px] leading-[1.1] md:text-[44px]">{room.name}</h2>
          <p className="mt-4 max-w-[60ch]">{room.description}</p>
          <h3 className="mt-8 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Amenities</h3>
          <RoomDetails items={room.amenities} variant="full" className="mt-4" />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-hairline pt-6">
            <RoomPrice rate={room.nightlyRate} />
            <Link href={`/book?room=${room.id}`} className="btn btn-primary">Request this room</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
