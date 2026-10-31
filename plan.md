# Resort Website: Plan

**Written for:** the developer building the site and the client reviewing it.
**Status:** approved plan, not yet scaffolded.

## 1. Goal

A single-page luxury resort website with:
- A full-bleed, AI-generated video hero made from resort photos.
- Smooth scrolling with Lenis.
- Scroll-reveal motion with GSAP and ScrollTrigger.
- A working booking request flow (no payments in phase 1).

This is a concept demo. All copy, photos and prices are placeholders until real content is supplied.

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS, tokens as CSS variables (see `design.md`) |
| Motion | GSAP + ScrollTrigger, Lenis |
| Forms | react-hook-form + zod (one schema shared by client and server) |
| Date picker | react-day-picker |
| Email | Resend (optional; logs to console when no key is set) |
| Analytics | Plausible (cookie-free, no consent banner) |
| Hosting | Vercel |
| Icons | Lucide (SVG only, no emoji) |
| Fonts | Cormorant Garamond (display), Inter (body), self-hosted via `next/font` |

## 3. Page structure

Single page with anchor navigation, plus `/book` for the booking flow.

1. **Nav:** transparent over the hero, turns cream with a hairline border after the hero. Logo, section anchors, "Reserve" button.
2. **Hero:** looping AI video with a still poster, headline, sub-line, and a booking bar (dates, guests, "Check availability"). The video scales down and fades as the visitor scrolls away.
3. **Intro:** one large serif statement that reveals line by line.
4. **Rooms:** three cards (image, name, features, "from" price). Staggered reveal, subtle image parallax.
5. **Experiences:** spa, dining, water activities, wellness. Alternating image and text rows.
6. **Gallery:** lazy-loaded masonry or horizontal strip, clip-path reveal, keyboard-navigable lightbox.
7. **Guest stories:** three placeholder testimonials, with previous/next and pause controls.
8. **Booking CTA band** (dark), then **footer** (address, map link, phone, WhatsApp, newsletter signup).

## 4. Booking flow (phase 1)

1. The hero booking bar collects check-in, check-out and guests. Rules: no past dates, check-out after check-in, 1 to 14 nights.
2. `POST /api/availability` returns the room types free for those dates, with a total (nightly rate × nights, seasonal multiplier, tax line). Data comes from `lib/rooms.ts` and `lib/availability.ts` (typed mock data).
3. The guest selects a room, then enters name, email, phone and special requests.
4. A review step shows the summary. "Request to book" calls `POST /api/bookings`. The server re-validates the input, re-checks availability, creates a reference (`RS-2026-XXXX`) and returns a confirmation screen.
5. Emails go to the guest and the resort via Resend when `RESEND_API_KEY` is set. Otherwise they are logged in development.
6. **No payment in phase 1.** The copy says "request", never "confirmed".

**Phase 2:** Postgres (Neon or Supabase) with Drizzle for rooms, bookings and blocked dates; Stripe Checkout for a deposit; a minimal admin view.

## 5. Other functions

- Room detail modal: gallery, amenities, price. Focus trap, Esc to close, smooth scroll paused while open.
- Enquiry form with a honeypot field and a basic rate limit on its route.
- Newsletter signup using the same mailer.
- Click-to-call and WhatsApp links; a Google Maps link.
- SEO: metadata, Open Graph image, sitemap, robots.txt, `Resort` JSON-LD.

## 6. Motion rules

- One animation driver: `gsap.ticker` calls `lenis.raf`, `lagSmoothing(0)`, and `ScrollTrigger.update` runs on every Lenis scroll. Lenis uses `autoRaf: false`.
- A single `SmoothScroll` client component wraps the layout.
- Reveals: opacity 0 → 1 and 12–16px rise, 0.35–0.6s, `power1.out`, starting at `top 90%`.
- Parallax: at most three image layers, `yPercent` scrubbed.
- Only `transform` and `opacity` are animated.
- Reduced motion: final states render immediately and Lenis does not start.
- No-JS: content is visible by default. Hidden states apply only after a `js` class is set.

## 7. Media

- **Hero video:** 3–4 clips of about 8 seconds each, made from resort photos. Each clip uses a golden-hour or twilight still as its first or last frame.
  - Default tool: Adobe Firefly video (first frame, last frame, 24 fps, 8 s, seed). Alternatives: Google Veo/Flow, Runway or Kling.
  - Shots: exterior dusk push-in, pool at golden hour, villa entrance, beach aerial drift.
  - Export: WebM (VP9) and MP4 (H.264), each 3 MB or less, muted, looped, with a 1600px WebP/AVIF poster.
- **Photos:** one wide exterior, 3–4 interiors, pool, spa, dining, beach, sunset. At least 2400px wide. Licence-checked AI or stock.
- **Brand:** placeholder name and SVG wordmark, favicon, OG image.
- **Copy:** headline, intro, three room descriptions with prices, four experiences, three testimonials, footer details. All placeholder.
- Images go in `public/media/` (`hero/`, `rooms/`, `gallery/`) and render through `next/image` with explicit dimensions.

## 8. Build order

1. Scaffold: `npx create-next-app@latest` (TypeScript, Tailwind, App Router), then `npm i gsap lenis`.
2. Run the `impeccable` context step and read its craft floor before the first UI edit.
3. Tokens in `app/globals.css` and the Tailwind theme; fonts in `app/layout.tsx`.
4. `SmoothScroll`, `Reveal` and `HeroVideo` components.
5. Sections 1–8 as server components, with client islands for motion and booking.
6. Booking flow, API routes, zod schema, confirmation screen, emails.
7. Media optimisation and poster and fallback wiring.
8. One batched verification pass (desktop and mobile), one fix pass, one confirmation pass, then stop.

## 9. Verification

- **Scroll:** Lenis feels smooth, anchors land correctly, ScrollTrigger start points don't drift.
- **Video:** autoplays muted on desktop Chrome and mobile Safari/Chrome; the poster shows first; reduced motion shows the still.
- **Reduced motion:** all content visible, no animation, Lenis off.
- **No JS:** all content readable.
- **Responsive:** Playwright screenshots at 375, 768 and 1440px. No horizontal scroll, no clipped text.
- **Accessibility:** contrast 4.5:1 or better, visible focus rings, tap targets 44px or larger, keyboard-only use of nav, booking, modal and carousel.
- **Build:** `npm run build` is clean. Lighthouse: poster and LCP image prioritised, CLS under 0.1.

## 10. Out of scope (phase 1)

Payments, a database, an admin panel, a real availability calendar, multi-language content, and a CMS.
