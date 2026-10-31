"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

type Ctx = { push: (href: string) => void };
const PageTransitionContext = createContext<Ctx>({ push: (href) => { window.location.assign(href); } });
export const usePageTransition = () => useContext(PageTransitionContext);

type LenisLike = { scrollTo: (y: number, o?: { immediate?: boolean }) => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

/** Teal curtain that covers upward, swaps the route, then reveals upward. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pending = useRef(false);
  const tween = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
  const failsafe = useRef<number | undefined>(undefined);
  const raf = useRef(0);

  const reset = useCallback(() => {
    window.clearTimeout(failsafe.current);
    cancelAnimationFrame(raf.current);
    tween.current?.kill();
    tween.current = null;
    pending.current = false;
    busy.current = false;
    if (curtain.current) {
      gsap.set(curtain.current, { yPercent: 100, visibility: "hidden" });
      curtain.current.style.pointerEvents = "none";
    }
  }, []);

  const reveal = useCallback(() => {
    const el = curtain.current;
    if (!el) return;
    window.clearTimeout(failsafe.current);
    pending.current = false;
    window.scrollTo(0, 0);
    lenis()?.scrollTo(0, { immediate: true });
    raf.current = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      tween.current = gsap.to(el, {
        yPercent: -100,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: reset,
      });
    });
  }, [reset]);

  const push = useCallback((href: string) => {
    const el = curtain.current;
    if (busy.current) return;
    const url = new URL(href, window.location.href);
    if (!el || prefersReducedMotion() || url.pathname === window.location.pathname) {
      router.push(href);
      return;
    }
    busy.current = true;
    gsap.set(el, { yPercent: 100, visibility: "visible" });
    el.style.pointerEvents = "auto";
    tween.current = gsap.to(el, {
      yPercent: 0,
      duration: 0.7,
      ease: "power3.inOut",
      onComplete: () => {
        pending.current = true;
        router.push(href);
        failsafe.current = window.setTimeout(() => { if (pending.current) reveal(); }, 4000);
      },
    });
  }, [router, reveal]);

  // Route changed: reveal if we started the transition.
  useEffect(() => {
    if (pending.current) reveal();
  }, [pathname, reveal]);

  // Clear pointer-events once idle again.
  useEffect(() => {
    const el = curtain.current;
    if (!el) return;
    gsap.set(el, { yPercent: 100, visibility: "hidden" });
    return () => reset();
  }, [reset]);

  // One capture-phase listener for internal links.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (prefersReducedMotion()) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target || a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (hash only) or same path: let the browser or Next handle it.
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      push(url.pathname + url.search + url.hash);
    };
    const onPop = () => reset();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [push, reset]);

  const value = useMemo(() => ({ push }), [push]);
  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] bg-accent"
        style={{ visibility: "hidden", transform: "translateY(100%)" }}
      />
    </PageTransitionContext.Provider>
  );
}
