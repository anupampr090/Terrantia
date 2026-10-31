---
name: Resort Editorial Luxury
description: Fresh, photography-led design system for a luxury resort website. Cool white canvas, seafoam surfaces, editorial serif display, ocean teal accent, cinematic dark bands. Built to let the video and photos lead.
---

# Design: Resort Editorial Luxury

**Written for:** the developer implementing the site and the designer reviewing it.
**Companion:** `plan.md` covers structure and functionality. This file covers look, feel and motion.

## 1. Principles

1. **Media leads, UI recedes.** Photos and the hero video carry the emotion. Interface chrome stays quiet.
2. **Warm, not sterile.** Cool near-white and seafoam instead of pure white. Ink instead of black.
3. **Editorial pacing.** Alternate light, seafoam and dark bands so no two adjacent sections share a surface.
4. **Calm motion.** Things rise and fade softly. Nothing bounces or spins.
5. **Spacious.** Generous whitespace, one idea per section.

## 2. Colour tokens

Define all colours as CSS variables on `:root` and map them into the Tailwind theme. Components must reference tokens only, never raw hex.

```css
:root {
  --color-canvas: #f6faf9;        /* page background */
  --color-surface: #e0eeed;       /* seafoam cards, alternate bands */
  --color-surface-strong: #cde3e1;/* hover and selected states */
  --color-ink: #0b1f24;           /* headings and primary text */
  --color-body: #2c4247;          /* running text */
  --color-muted: #4f666a;         /* captions, secondary text */
  --color-hairline: #c6dcda;      /* 1px borders and dividers */
  --color-accent: #0f6b73;        /* ocean teal: primary buttons, links */
  --color-accent-hover: #0a5259;  /* pressed and hover state */
  --color-on-accent: #ffffff;
  --color-dark: #09222a;          /* footer and cinematic bands */
  --color-on-dark: #f6faf9;
  --color-on-dark-muted: #9fbcc0;
  --color-focus: #d9572b;         /* focus ring, always visible */
  --color-danger: #b3261e;        /* form errors */
}
```

**Accent choice:** ocean teal `#0f6b73` is the default. It gives about 6.2:1 contrast on the canvas for button text on accent. Focus ring is coral `#d9572b` so it stays visible on teal. Verify every text and background pair at 4.5:1 or better.

**Dark mode:** not in scope for phase 1. The site is designed light, with dark used for bands only.

## 3. Typography

| Role | Family | Size (desktop / mobile) | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Hero display | Cormorant Garamond | 88px / 52px | 400 | 1.02 | -0.02em |
| Section heading | Cormorant Garamond | 56px / 38px | 400 | 1.08 | -0.015em |
| Intro statement | Cormorant Garamond | 40px / 28px | 400 | 1.2 | -0.01em |
| Card title | Cormorant Garamond | 28px / 24px | 500 | 1.2 | 0 |
| Body | Inter | 17px / 16px | 400 | 1.6 | 0 |
| Small body | Inter | 15px / 14px | 400 | 1.5 | 0 |
| Label and eyebrow | Inter | 12px | 500 | 1.4 | 0.12em, uppercase |
| Button | Inter | 15px | 500 | 1 | 0 |

**Rules:**
- Display sizes use weight 400. Never bold a serif heading.
- Body text is never smaller than 14px.
- Text on photos always sits on a gradient scrim or a solid panel that passes 4.5:1.
- Headings are balanced (`text-wrap: balance`); body paragraphs are not.

**Substitutes:** if Cormorant Garamond is unavailable, use Playfair Display SC (the alternative in the design search). Pair it with Karla in place of Inter.

## 4. Spacing, grid and shape

- **Base unit:** 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Section padding:** 128px desktop, 80px mobile.
- **Container:** 1200px max, 16px side gutter on mobile, 32px on tablet and up.
- **Grid:** 12 columns on desktop, 6 on tablet, 4 on mobile.
- **Radii:** 12px cards and images, 8px buttons and inputs, pill (999px) for tags only.
- **Borders:** 1px `--color-hairline`. No drop shadows on chrome.
- **Shadows:** only one soft shadow under floating media, `0 24px 48px -24px rgb(20 20 19 / 0.25)`.

## 5. Surfaces and bands

The page alternates between these bands. No two adjacent bands may share a surface.

| Section | Surface | Notes |
|---|---|---|
| Hero | Video over dark scrim | Pinned; headline in canvas colour; next band rises over it like a curtain |
| Intro | Canvas | One large serif sentence, revealed word by word on scroll |
| Rooms | Surface (seafoam) | Pinned scroll: one large room at a time, no card boxes |
| Experiences | Canvas | Three near full-bleed photo panels, one short line each |
| Gallery | Dark | Pinned horizontal pan on desktop, masonry on touch and small screens |
| Booking CTA | Accent | Rotating guest quote (placeholder) above the request button |
| Footer | Dark | Muted text, large Terrantia wordmark rising into view |

## 6. Components

### Buttons
- **Primary:** `--color-accent` background, `--color-on-accent` text, 8px radius, 48px height, 0 24px padding. Hover moves to `--color-accent-hover`.
- **Secondary:** transparent, 1px ink border, ink text. Hover fills with `--color-surface`.
- **Text link:** accent colour, 1px underline offset 4px. Hover thickens the underline.
- **Focus:** 2px `--color-focus` ring with a 2px offset, always visible.
- **Minimum target:** 44 × 44px.

### Nav
- Height 80px. Transparent over the hero with light text. After the hero, canvas background with a hairline bottom border.
- Mobile: a menu button opens a full-height sheet on the canvas colour.

### Booking bar (hero)
- A floating panel on the canvas colour, 12px radius, soft media shadow.
- Three fields (check-in, check-out, guests) and a primary "Check availability" button.
- Fields have visible labels above them, never placeholder-only.
- Date picker: keyboard operable, no past dates, check-out disabled until check-in is set.

### Room (pinned scroll)
- One room at a time inside a 100svh pinned stage: large image with a 12px radius, name in display type, one clean description sentence, then a quiet placeholder note, icon rows, price block and a text link 'View room'.
- **Icon rows:** a two-column list (one column under 400px). Each row is a thin teal line icon (Lucide, 1.5px stroke, accent colour, no background circle, decorative) beside a label. 'Sleeps N' comes first, then what the photo shows. One shared component (`RoomDetails`) and one icon registry (`RoomIcon`) so size and stroke never drift.
- **Price block:** 'FROM' in label type, the amount in the display serif with tabular figures, '/ night' muted, and a small 'Placeholder price' tag.
- **Placeholder note:** never inside the description sentence. One muted line with an info icon: 'Placeholder copy until final text is supplied.'
- No card boxes or borders. Thin 2px accent progress line, no numeric pagination.
- Fallback (reduced motion, no-JS, short screens): a plain stacked list of the three rooms with the same content.

### Guest quote (inside the booking band)
- One large quote at a time in display type, attribution in label style, clearly marked placeholder.
- Previous/next (44px icon buttons) and a pause/play control. Auto-advance stops on hover, focus and reduced motion.

### Form fields
- Label above, 48px height, 8px radius, 1px hairline border, focus ring on the field.
- Errors appear beneath the field in `--color-danger` with an icon, not just colour.

### Footer
- Dark band, muted text, four short columns (Stay, Experiences, Contact, Legal), newsletter field with a visible label.

## 7. Imagery

- **Ratios:** hero 16:9 (fills the viewport), room cards 4:3, gallery mixed 4:5 / 1:1 / 3:2, experiences 5:4.
- **Treatment:** warm grade (lifted shadows, slightly golden highlights). Keep one grade across all photos.
- **Loading:** `next/image` with explicit width and height. The hero poster loads with priority. Everything else lazy-loads.
- **Video:** muted, looped, `playsinline`, `preload="metadata"`. Shows the poster until it can play. Reduced motion shows the still poster only.

## 8. Motion

Motion is a system, not decoration. Every animation comes from the rules below.

| Pattern | Trigger | Duration | Easing | Details |
|---|---|---|---|---|
| Reveal | Enters viewport at `top 90%` | 0.5s | `power1.out` | Opacity 0 → 1, y 14px → 0. Plays once. |
| Stagger | Card groups | 0.06s between items | `power1.out` | Maximum 6 items per stagger |
| Headline line reveal | Enters viewport | 0.6s | `expo.out` | Short headlines only (under 8 words). Revert split on cleanup. |
| Parallax | Scrub | Linked to scroll | linear | At most three image layers, 6–8% travel |
| Hero pin and curtain | Scroll 0 → 100vh | Linked to scroll | linear | Hero pins; video scales 1 → 1.12, scrim to 0.6, headline drifts up and fades; next band covers it |
| Intro loader | First visit per session, home only | About 1.8s | `expo.out`, `power3.inOut` | Teal overlay, wordmark letters rise, overlay wipes up. Skippable. Never shown for reduced motion or no-JS |
| Page transition | Internal link click | About 0.7s in, 0.7s out | `power3.inOut` | Teal curtain wipes over, route changes, curtain wipes away. Not used for back and forward |
| Rooms pin | Scroll, about 3 x 100vh | Linked to scroll | linear | One room at a time; clip-path crossfade with a scale settle 1.08 → 1; thin progress line |
| Gallery pan | Scroll, desktop only | Linked to scroll | linear | Pinned horizontal pan of the photo track |
| Magnetic button | Pointer move, desktop only | 0.5s | `power3.out` | Primary buttons lean 25% toward the pointer |
| Scroll feel | Wheel and trackpad only | Continuous smoothing (lerp 0.08) | n/a | Each wheel notch travels 65% of normal. Touch keeps native scrolling |
| Speed limit | Wheel and trackpad only | Sliding 0.5s window | n/a | A flick cannot travel more than about 1.3 screens per half second, tapering smoothly rather than stopping dead, so sections are never skipped by surprise |
| Section magnet | Stop near a section best view | Pull 1.1s after 0.32s stillness | ease-out cubic | Pulls to the nearest point within 22% of the viewport, only in the direction you are scrolling. Points: hero, intro, each room, each experience panel, gallery start and end, booking band, footer. Never inside the gallery pan |
| Dwell hold | After settling on a full section | 0.4s | n/a | Wheel input is held briefly so the view rests. Not applied between room steps. Released by any key press or click |
| Image hover | Pointer | 0.6s | `power2.out` | Scale 1 → 1.03 |
| Section anchor | Nav click | Lenis `scrollTo` | Lenis default | Offset by nav height |

**Rules:**
- Animate only `transform` and `opacity`.
- No motion longer than 1s except the hero exit.
- Reduced motion (`prefers-reduced-motion: reduce`): reveals, parallax, hover scale and carousel auto-advance all turn off. Content appears in its final state. Lenis does not start.
- Pause and stop controls exist for anything that auto-moves.

## 9. Responsive behaviour

| Breakpoint | Width | Changes |
|---|---|---|
| Mobile | under 768px | Single column. Hero heading 52px. Booking bar stacks. Nav becomes a sheet. |
| Tablet | 768–1023px | Two-column cards. Gallery 2 columns. |
| Desktop | 1024px and up | Three-column rooms. Gallery masonry. Full nav. |

- No horizontal scroll at any width.
- Video crops to the viewport with `object-fit: cover`; the focal point stays centred on mobile.

## 10. Accessibility

- Contrast 4.5:1 for body text, 3:1 for large text and UI controls.
- Visible focus on every interactive element.
- Keyboard order follows visual order. Modals trap focus and close on Esc, returning focus to the trigger.
- Images have meaningful alt text; decorative images use empty alt.
- Video has no audio and no information lost if it doesn't play.
- Tap targets 44 × 44px or larger.
- Language set to `en`; `prefers-reduced-motion` respected everywhere.

## 11. Content voice

- Calm, precise, confident. Short sentences. No exclamation marks.
- Avoid superlatives like "best" or "world-class" unless the resort can prove them.
- Booking copy says "request", "availability" and "reference". Never "confirmed" before a payment or staff confirmation exists.

## 12. Do and don't

**Do**
- Use the accent colour only for primary actions and key links.
- Let one photo per section carry the section.
- Keep the same grade across every photo.

**Don't**
- Use pure white or pure black for surfaces or text.
- Use emoji as icons; use Lucide SVGs.
- Stack more than two floating elements over a photo.
- Use bold serif headings or more than two type families.
- Animate on load for content that is already above the fold, beyond the hero.
