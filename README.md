# Terrantia

Concept-demo website for a luxury beachfront resort: a pinned video hero, scroll-driven rooms and gallery, and a booking request flow. All rooms, prices, facilities, testimonials and contact details are placeholders until real content is supplied.

Built with Next.js (App Router, TypeScript), Tailwind CSS, GSAP with ScrollTrigger, and Lenis.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Other commands: `npm run build`, `npm run start`, `npm run lint`.

## Configuration

See `.env.example`. In short:

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public address used for canonical links, the sitemap, robots.txt and share images. Set it in production. |
| `RESEND_API_KEY`, `MAIL_FROM` | Send email through Resend. Without them no mail is sent. |
| `RESORT_EMAIL` | Inbox that receives booking requests, enquiries and newsletter signups. |
| `DATA_DIR` | Folder for the local request store. Defaults to `.data`. |

## How requests are handled

A booking request, enquiry or newsletter signup is validated, saved to a JSON Lines file in `DATA_DIR`, and emailed to `RESORT_EMAIL` when email is configured. The guest gets a "request received" email with a reference. No payment is taken and nothing is confirmed automatically.

Limits to know before going live:

- The file store only suits a single long-running server. Serverless hosts do not keep it, so email is the only delivery there until a database is added (see phase 2 in `plan.md`).
- The rate limiter lives in memory, per server instance.
- If neither the store nor email works, the guest still sees "Request received". The server logs `[booking:not-delivered]`.

## Media

Placeholder photos are from Pexels; see `CREDITS.md`. The source and licence of the hero film are not confirmed. Untouched originals live in `media-originals/` (not served, not in git). Re-create derived files with `node scripts/encode-hero.mjs` and `python scripts/grade-media.py`.

## Adding a real map

The location section shows a drawn placeholder, not a live map. To embed one, add the map provider to `frame-src` (and `img-src` if needed) in the Content-Security-Policy in `next.config.ts`; without that the browser blocks it.

## Docs

`PRODUCT.md` (what it is and who it is for), `design.md` (look, feel and motion), `plan.md` (structure and phases).
