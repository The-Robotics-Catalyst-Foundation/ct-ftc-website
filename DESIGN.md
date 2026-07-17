---
name: Connecticut FIRST Tech Challenge
description: Public site and volunteer hub for CT FTC — liquid-glass bento tiles over an aurora field, SwiftUI-inspired
colors:
  robotics-blue: "#2563eb"
  robotics-blue-deep: "#1447c9"
  aurora-gold: "#f5b100"
  base-mist: "#eef2f8"
  glass-white: "rgba(255, 255, 255, 0.6)"
  glass-white-strong: "rgba(255, 255, 255, 0.78)"
  glass-border: "rgba(255, 255, 255, 0.55)"
  ink-900: "#0b1220"
  ink-600: "#3c4a63"
  ink-400: "#7a869c"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'SF Pro Display', 'Geist Variable', sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'Geist Variable', sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2rem)"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist Variable', sans-serif"
    fontSize: "1rem"
    fontWeight: 450
    lineHeight: 1.55
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist Variable', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "2.5rem"
  full: "9999px"
spacing:
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "3.5rem"
components:
  glass-tile:
    backgroundColor: "{colors.glass-white}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "2rem"
  glass-tile-strong:
    backgroundColor: "{colors.glass-white-strong}"
    rounded: "{rounded.lg}"
  button-primary:
    backgroundColor: "{colors.robotics-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "0.9rem 2rem"
  button-primary-hover:
    backgroundColor: "{colors.robotics-blue-deep}"
  button-glass:
    backgroundColor: "{colors.glass-white}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.full}"
    padding: "0.9rem 2rem"
---

# Design System: Connecticut FIRST Tech Challenge

<!-- Replaces the prior "Pit Crew Console" brutalist system per explicit direction: full pivot to a liquid-glass bento language. -->

## 1. Overview

**Creative North Star: "The Control Center"**

Think iOS Control Center and macOS's Big Sur-era widget board: frosted, translucent tiles of varying sizes floating in a soft grid over a colorful, gently animated field, each tile a self-contained module (an event, a stat, a CTA). Glass here is the entire point, not a decorative accent — every surface is a pane of material, layered with blur and saturation so the color underneath bleeds through and shifts as you scroll or resize. That's the deliberate departure from the site's previous flat-black-bordered brutalism: depth now comes from light and blur instead of hard outlines and offset shadows.

The aesthetic pulls directly from Apple's SwiftUI / visionOS material system (Liquid Glass, introduced across iOS/macOS 26): thin bright specular edges, soft ambient shadows with real blur (not offset "stickers"), continuous large-radius corners, and content that reads as sitting *behind* frosted glass rather than *inside* a bordered box. It still rejects the same two things PRODUCT.md flags — an aggressive gamer/esports intensity, and a dated cluttered nonprofit layout — but now the antidote is refined translucency and generous whitespace instead of loud color-blocking.

**Key Characteristics:**
- Every panel is a glass tile: translucent white fill, backdrop blur + saturation, a hairline bright border, and a soft blurred ambient shadow — never a solid opaque card, never a hard offset shadow.
- Tiles sit in a bento grid: modules of different sizes (1×1, 2×1, 2×2) tessellated together, not a uniform repeating card grid.
- An "aurora" gradient field of soft blue/gold blooms sits behind everything, visible through and around the glass, so translucency actually has something to show.
- Typography drops the all-caps black-weight brutalist voice for a SwiftUI-style weight hierarchy: bold display, semibold headline, regular body, no forced uppercase.
- Motion is spring-smooth (anime.js, exponential ease-out, no literal bounce/elastic) — tiles lift and settle rather than snap.
- Robotics Blue survives the pivot as the one accent color carried over from the old system, now expressed as a tinted glass fill and a pill-shaped primary button instead of a flat bordered block.

## 2. Colors

A near-white "mist" base with a soft multi-color aurora glow behind it; glass tiles sit on top, tinted just enough by whatever's behind them to feel alive rather than flat.

### Primary
- **Robotics Blue** (#2563eb): The one accent carried over from the brand's prior identity. Used for the primary button, active states, and the aurora glow's dominant hue. On glass tiles it appears as a tint (a translucent blue wash), not a solid fill, except on the primary CTA itself.

### Secondary
- **Robotics Blue Deep** (#1447c9): Hover/pressed state for Robotics Blue.

### Tertiary
- **Aurora Gold** (#f5b100): The second aurora hue and the rare highlight accent (a live badge, an upcoming-event indicator). Same rarity rule as before — one hero moment per page, not a repeating accent.

### Neutral
- **Base Mist** (#eef2f8): The page background beneath the aurora field — soft, barely-blue, never stark white.
- **Glass White** (`rgba(255,255,255,0.6)`) / **Glass White Strong** (`rgba(255,255,255,0.78)`): Tile fills. Strong is for tiles carrying dense text (needs more opacity for contrast); regular is for decorative or image-backed tiles.
- **Glass Border** (`rgba(255,255,255,0.55)`): The hairline edge every tile gets, brightest along the top to fake a specular highlight.
- **Ink 900 / 600 / 400** (#0b1220 / #3c4a63 / #7a869c): Heading, body, and caption/meta text in descending emphasis. No pure black — even "ink" carries a hair of blue.

### Named Rules
**The Aurora-Behind-Glass Rule.** Glass tiles are only interesting over something worth seeing through them. Never place a glass tile directly on flat Base Mist with nothing behind it — there must be an aurora bloom, an image, or a colored section within blur range, or the tile reads as a plain white card with rounded corners.

**The One Accent, Tinted Rule.** Robotics Blue is the only saturated color allowed as a *solid* fill (the primary button). Everywhere else it appears as a translucent tint mixed into glass, never as a flat block — that tinted, layered quality is what separates this system from the old solid-color brutalism.

## 3. Typography

**Font stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", "Geist Variable", sans-serif` — on Apple devices this resolves to the real system font (the whole point of a SwiftUI-flavored system); everywhere else it falls back to Geist Variable, already loaded via `@fontsource-variable/geist`, which shares enough of the same geometric-humanist DNA to not clash.

**Character:** A real weight hierarchy replaces the old system's uniform heavy-black voice — bold display, semibold headlines, regular body, no forced uppercase anywhere. This is the clearest visual signal of the pivot: type now whispers where it used to shout.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 6vw, 5rem)`, `-0.03em` tracking, leading 1.02): Hero headline only, sentence case.
- **Headline** (650, `clamp(1.5rem, 2.6vw, 2rem)`, `-0.015em`): Section titles, sentence case.
- **Body** (450, 1rem, 1.55 leading, Ink 600): Descriptions and copy, capped at 65–75ch.
- **Caption** (600, 0.8125rem, `0.01em` tracking, Ink 400): Tile labels, metadata, timestamps — the only place a small semibold label is allowed, and never uppercase.

### Named Rules
**The No-Shout Rule.** Nothing in this system is uppercase except a handful of short glass-badge labels (e.g. "LIVE", "NEW"), and even those stay small and rare. Headlines and body copy are always sentence case — the opposite of the prior brutalist voice.

## 4. Elevation

Depth comes entirely from blur, saturation, and soft ambient shadow — there is no hard-offset "sticker" shadow anywhere in this system; that vocabulary belonged to the old brutalist look and is fully retired.

### Shadow & Material Vocabulary
- **Glass Material** (`backdrop-filter: blur(28px) saturate(180%); -webkit-backdrop-filter: blur(28px) saturate(180%);`): Applied to every tile, the nav, and any floating surface. This is the core material, not a shadow.
- **Ambient Float** (`box-shadow: 0 20px 60px -15px rgba(15, 23, 42, 0.25), 0 2px 8px rgba(15, 23, 42, 0.06);`): The soft, blurred shadow every glass tile casts at rest — replaces the old flat/mini/skeuo sticker shadows entirely.
- **Ambient Float, Hover** (`box-shadow: 0 28px 70px -12px rgba(15, 23, 42, 0.3), 0 4px 12px rgba(15, 23, 42, 0.08);`): Slightly larger and softer on hover, paired with a small `translateY(-2px)` lift — never a press-down; glass tiles float up, they don't get pushed.
- **Specular Edge** (`border: 1px solid rgba(255,255,255,0.55); border-top-color: rgba(255,255,255,0.85);`): A hairline border, brighter on the top edge only, to fake the highlight where light catches the top of a glass pane.

### Named Rules
**The No-Offset-Shadow Rule.** No shadow in this system has a hard, unblurred offset. Every shadow blurs generously (≥40px) and sits low-opacity; if a shadow reads as a solid black rectangle nudged sideways, it's a leftover from the old system and must be replaced.

## 5. Components

### Glass Tiles (Bento)
- **Shape:** `rounded-lg`–`rounded-xl` (2–2.5rem), approximating Apple's continuous "squircle" corners with standard large-radius rounding.
- **Fill:** Glass White or Glass White Strong, Glass Material blur/saturate, Specular Edge border, Ambient Float shadow.
- **Grid:** Bento layout — tiles span 1, 2, or occasionally 3 grid columns/rows so the page reads as a tessellated widget board, not a uniform card row. `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` as the breakpoint-free fallback, with explicit `grid-column`/`grid-row` spans on the tiles that should read as larger "hero" modules.
- **Motion:** Tiles enter with a staggered fade + rise (12–16px) driven by anime.js, `easeOutExpo`-family easing, ~450–600ms, staggered 60–80ms per tile. On hover, a tile lifts (`translateY(-2px)`) into Ambient Float, Hover.

### Buttons
- **Primary:** Solid Robotics Blue pill (`rounded-full`), white text, Robotics Blue Deep on hover, Ambient Float shadow (not a border) — the one place a fully solid, non-glass fill is correct.
- **Glass / Secondary:** Same pill shape, Glass White fill, Glass Material blur, Specular Edge border, Ink 900 text — used for secondary actions sitting on top of the aurora field or a photo.
- **No black borders anywhere** — the prior system's signature black-outline rule is explicitly retired.

### Navigation
- **Style:** A floating glass bar, Glass White Strong, full Glass Material treatment, `rounded-full`, Ambient Float shadow, pinned with a small margin from the viewport edge (not flush).
- **Helpful, not just links:** The nav carries one live, data-backed module — the next upcoming CT FTC event (name + countdown) rendered as a small glass chip — so it does real work beyond navigation, not just a label list.
- **States:** Active route gets a Robotics Blue tinted-glass pill (translucent blue wash + white text), inactive routes are plain Ink-900-on-glass text with a soft hover tint.
- **Mobile:** Collapses into a single glass sheet that slides/fades in from the top, same material and radius language as desktop, full-width tappable rows.

## 6. Do's and Don'ts

### Do:
- **Do** give every panel real glass material — blur(≥24px) + saturate(≥150%) + a translucent fill — never a solid opaque background pretending to be "clean."
- **Do** place an aurora gradient (or image, or colored section) behind every glass tile so the blur has something worth showing.
- **Do** use soft, generously blurred ambient shadows (≥40px blur, low opacity) for all elevation.
- **Do** keep type in sentence case with a real weight hierarchy (bold display → semibold headline → regular body).
- **Do** stagger tile entrances with anime.js using exponential ease-out — never a bounce/elastic easing, per the shared motion rules — and always respect `prefers-reduced-motion` with an instant/crossfade fallback.

### Don't:
- **Don't** bring back any element of the old system: no solid black 2–3px borders, no hard offset "sticker" shadows, no all-caps font-black body text.
- **Don't** use glass decoratively on an isolated element while everything around it stays flat — this system commits to glass everywhere or not at all.
- **Don't** place a glass tile over a flat, undifferentiated background — see the Aurora-Behind-Glass Rule.
- **Don't** let Robotics Blue or Aurora Gold appear as more than one solid (non-glass) fill per screen; everywhere else they're tints.
- **Don't** carry this glass language into the `/admin` dashboard's existing look without a separate decision — `admin.css` already runs its own lighter glass system; reconcile deliberately rather than silently duplicating tokens.
