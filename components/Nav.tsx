"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import Magnetic from "./Magnetic";

const links = [
  { href: "#rooms", label: "Rooms" },
  { href: "#experiences", label: "Experiences" },
  { href: "#gallery", label: "Gallery" },
];

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const openRef = useRef(false);
  const focusIn = useRef(false);
  const hidden = useRef(false);
  const setHidden = useRef<(h: boolean) => void>(() => {});

  useEffect(() => {
    openRef.current = open;
    if (open) setHidden.current(false);
  }, [open]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();
    const el = nav.current!;
    setHidden.current = (h) => {
      if (reduced || hidden.current === h) return;
      hidden.current = h;
      gsap.to(el, { yPercent: h ? -100 : 0, duration: 0.35, ease: "power2.out", overwrite: true });
    };
    let solidNow: boolean | null = null; // setState every scroll frame forces a React pass even when nothing changed
    const markSolid = (v: boolean) => { if (solidNow !== v) { solidNow = v; setSolid(v); } };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          markSolid(y > window.innerHeight - 90);
          if (y < 120 || openRef.current || focusIn.current) setHidden.current(false);
          else if (self.direction === 1) setHidden.current(true);
          else if (self.direction === -1) setHidden.current(false);
        },
      });
    });
    markSolid(window.scrollY > window.innerHeight - 90);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = nav.current!;
    const inn = () => { focusIn.current = true; setHidden.current(false); };
    const out = (e: FocusEvent) => { if (!el.contains(e.relatedTarget as Node)) focusIn.current = false; };
    el.addEventListener("focusin", inn);
    el.addEventListener("focusout", out);
    return () => { el.removeEventListener("focusin", inn); el.removeEventListener("focusout", out); };
  }, []);

  useEffect(() => {
    const els = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = "#" + e.target.id;
          if (e.isIntersecting) setActive(id);
          else setActive((cur) => (cur === id ? null : cur));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = sheet.current!;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis()?.stop();
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    focusables()[0]?.focus();
    const trigger = toggle.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis()?.start();
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);
  const bar = solid && !open ? "bg-canvas text-ink border-b border-hairline" : "text-on-dark border-b border-transparent";

  return (
    <>
      <nav ref={nav} aria-label="Primary" className={`fixed inset-x-0 top-0 z-30 flex h-20 items-center transition-colors duration-300 ${bar}`}>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120px] bg-[linear-gradient(180deg,rgba(9,34,42,0.55),rgba(9,34,42,0))] transition-opacity duration-300 ${solid || open ? "opacity-0" : "opacity-100"}`}
        />
        <div className="container-x flex w-full items-center justify-between">
          <Link href="/" className="font-display text-[28px] font-medium tracking-[0.04em] no-underline">Terrantia</Link>
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-8 md:flex">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={active === l.href ? "true" : undefined}
                  className="inline-flex min-h-11 items-center text-[15px] no-underline decoration-2 underline-offset-[10px] hover:underline aria-[current=true]:underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <Magnetic>
              <Link href="/book" className="btn btn-primary !text-on-accent">Reserve</Link>
            </Magnetic>
            <button
              ref={toggle}
              type="button"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          ref={sheet}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex h-dvh flex-col bg-canvas text-ink md:hidden"
        >
          <div className="container-x flex h-20 w-full shrink-0 items-center justify-between border-b border-hairline">
            <span className="font-display text-[28px] font-medium tracking-[0.04em]">Terrantia</span>
            <button type="button" className="-mr-2 inline-flex h-11 w-11 items-center justify-center" aria-label="Close menu" onClick={close}>
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="container-x flex w-full flex-1 flex-col justify-center gap-6">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={close} className="font-display text-[40px] leading-[1.1] text-ink no-underline">{l.label}</a>
            ))}
            <Link href="/book" onClick={close} className="btn btn-primary mt-4 !text-on-accent">Reserve</Link>
          </div>
        </div>
      )}
    </>
  );
}
