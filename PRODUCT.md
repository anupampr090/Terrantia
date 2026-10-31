# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js (App Router, TypeScript) + Tailwind CSS + GSAP/ScrollTrigger + Lenis. Chosen by the user from the offered options.

## Users
Leisure travellers considering a stay at a tropical beachfront resort: couples, families, wellness and solo travellers (user answered "all", so copy stays broad). They browse on phone and laptop, compare rooms, and want to check dates and send a booking request quickly.

## Product Purpose
Terrantia is a concept-demo website for a luxury beachfront resort. It shows the resort through a cinematic hero video made from still photos, lets guests explore rooms and experiences, and takes a booking request. Success: a visitor understands the place in seconds and submits a request without friction.

## Positioning
The hero film is generated from the resort's own photographs (golden-hour and twilight variants), so the site opens on motion rather than a static banner.

## Operating Context
Photos and video are AI-generated or stock placeholders until real resort media is supplied. Booking is a request flow reviewed by resort staff by email; no payment is taken in phase 1.

## Capabilities and Constraints
- Name: Terrantia (confirmed). Setting: tropical beachfront (confirmed).
- Single-page site with anchors, plus a `/book` booking flow (availability check with mock data, guest details, request, confirmation reference).
- Smooth scrolling via Lenis; scroll-reveal motion via GSAP/ScrollTrigger; must honour prefers-reduced-motion.
- No database, payments or admin in phase 1 (phase 2: Postgres, Stripe deposit, admin view).
- Undecided: real location, real prices, real room names, real contact details, logo.

## Brand Commitments
Name "Terrantia". Fresh ocean-teal editorial luxury direction approved by the user via the design review canvas and recorded in `design.md`.

## Evidence on Hand
No real photos, testimonials, awards or prices exist. Testimonials, prices, room details and contact details in the build are placeholders and must be marked as such; do not present them as real.

## Product Principles
1. Media leads and interface recedes.
2. Booking copy says "request", never "confirmed", until staff confirm.
3. Every motion has a reduced-motion and no-JS fallback.
4. Placeholder content is honest about being placeholder.

## Accessibility & Inclusion
WCAG AA contrast (4.5:1 body), visible focus, keyboard-operable booking flow, 44px minimum targets, reduced-motion respected.
