# haingt.dev — personal site

## Project Overview

One-screen "founder card" for Nguyen Thanh Hai: a storytelling page (hero line, an annotated
gear drawing where each gear is one chapter, a four-chapter list, a few links), not a CV. The
studio site (disagames.com: studio page, Clockwork Brood, devlog) is a separate repo,
`~/Projects/disa-games`. Studio and game content belongs there; this site only links to it.

**Stack:** Astro 6 (static output), TypeScript strict, vanilla CSS, vanilla JS, pnpm.

**Deploy:** Cloudflare Workers with static assets, not Cloudflare Pages. `wrangler.jsonc` +
`@astrojs/cloudflare`; `pnpm build` writes `dist/client` (the static assets) and `dist/server`
(the Worker entry). A push to `master` deploys.

## Content Rules

- All visible prose lives in the `STORY` export of `src/data/site.ts`. It is a DRAFT scaffold:
  Hải rewrites it in his own words. Edit copy there, not in components.
- Facts come from Hải. Nothing invented: no metrics, dates, taglines, launch dates or store pages.
- Never write where the name "Disa Games" comes from, anywhere.
- No private info: no family names, district, finances, layoff or gap year, Bookie's current state.
- `STORY.showDadLine` (default `false`) renders the optional dad line. Hải has not decided.
- No concept art on this site.
- Names, email and URLs used in more than one place live in `src/data/site.ts` (`PERSON`, `STUDIO`, `SOCIAL`).

## File Structure

```
src/
├── components/
│   ├── Nav.astro          # Wordmark + "Disa Games ↗" pill, no section links
│   ├── FounderCard.astro  # The page: h1, meta line, Fig. 1 + chapter <ol>, links + copy button
│   ├── Footer.astro       # One line
│   └── GearTrain.astro    # Meshing SVG gears; `annotate` adds centre lines + labels, `numbered` prefixes 1-4
├── data/site.ts           # PERSON, STUDIO, SOCIAL, STORY (all copy)
├── lib/gears.ts           # Gear geometry (build time)
├── scripts/motion.ts      # rAF loop for gear trains + pause toggle
├── layouts/BaseLayout.astro  # <head>: meta, OG/Twitter, Person JSON-LD, font preload, motion-class bootstrap
├── pages/index.astro      # Nav + FounderCard + Footer
└── styles/
    ├── tokens.css         # Palette + type + spacing tokens (shared with disagames.com)
    └── global.css         # @font-face, reset, typography, links, focus, reduced motion
public/
├── fonts/                 # Self-hosted woff2 (Fraunces latin + vietnamese, Inter, JetBrains Mono; OFL)
├── og.jpg                 # 1200x630 share card: gear drawing + name, no art
└── favicon.svg / favicon.ico
```

Gear numbers in Fig. 1 and the chapter list match (gear `data-index` = chapter index). Hovering or
focusing a chapter lights its gear (`.on` class, set in FounderCard's script); hovering a gear lights
its chapter. Gear labels show "n  Title" from 900px up and numerals only below.

## Design System

The founder brand is shared with disagames.com; this site is the quieter of the two: more cream
and muted, the only motion is the Fig. 1 gear train.

### Color Tokens (`src/styles/tokens.css`)

```css
--color-bg:          #14100c;  /* dark warm brown */
--color-surface:     #1d1712;
--color-surface-2:   #261e17;
--color-border:      #3a2e24;
--color-text:        #f1e7d8;  /* cream, 15.5:1 on bg */
--color-muted:       #b3a28d;  /* 7.6:1 on bg */
--color-quiet:       #7d6a57;  /* non-text marks only */
--color-accent:      #e0834f;  /* rust: indices, gear highlight, link hover */
--color-accent-deep: #a84e24;  /* underlines, hover borders, never text */
--color-rift:        #5fd9e6;  /* cyan, the single cold accent: focus ring */
--color-on-accent:   #14100c;
```

Keep `tokens.css` identical to the copy in `~/Projects/disa-games`.

### Typography

- **Display:** Fraunces, variable (opsz + wght), roman only (no italic file). Headings and the hero line.
- **Sans:** Inter 400-600. Body copy.
- **Mono:** JetBrains Mono 400-500. Meta line, captions, gear labels, small UI.
- Self-hosted from `public/fonts/` (`@font-face` in `global.css`, `font-display: swap`); only the two Fraunces files are preloaded. The latin subset has no "ả", so the Vietnamese Fraunces subset covers "Hải".

### Spacing & Layout

- `--radius: 6px`, `--max-w: 1120px`, `--gap: clamp(1rem, 4vw, 2.5rem)` (16px gutter on phones).
- One `.container` card. Fig. 1 is a horizontal timeline: four chapter gears spaced one column
  apart (centres at 1/8, 3/8, 5/8, 7/8 of the width) joined by `quiet` idler gears, with the
  chapter list as 4 columns under them from 1000px, 2×2 from 640px, stacked on phones.
- Background: a faint drafting grid on `body` (24px minor, 120px major, faded at the edges).

### Component Patterns

- **Links in text:** `.text-link` (deep-rust underline, rust on hover).
- Pills (nav studio link, copy button): 1px border, mono or small sans, rust border on hover.
- Pause toggle: a round icon button on the drawing (top-right from 1000px, under its right end
  below that); its label is visually hidden but read out.
- The copy button reports through a `role="status"` `aria-live="polite"` span.

### Motion

- `BaseLayout` sets one class on `<html>` before first paint: `.motion-ok`, `.motion-paused`
  (visitor pressed pause, stored in `localStorage`) or `.no-motion` (reduced motion).
- `motion.ts` turns `[data-gear-train]` SVGs (scrolling cranks them) and stops them off-screen or
  in a hidden tab. No reveal-on-scroll: all text is visible from the first frame.
- Anything that moves continuously needs a visible `[data-motion-toggle]` pause button (WCAG 2.2.2).

## Hard Constraints

- **No Tailwind**: vanilla CSS, scoped `<style>` per component, shared rules in `global.css`.
- **No JS frameworks**: vanilla JS only.
- **Static output only** (`output: 'static'` in `astro.config.mjs`).
- **Dark theme only**, no light mode toggle.
- **`prefers-reduced-motion`**: all animations and transitions off.
- **Mobile-first**: check 375px, 768px, 1024px, 1440px.

## Quality Gates

1. `pnpm build` passes with no errors
2. Lighthouse mobile: Performance >= 95, Accessibility = 100, Best Practices = 100, SEO = 100
3. No horizontal overflow at 375px
4. All interactive elements have visible focus-visible states
5. `prefers-reduced-motion: reduce` disables all animations and transitions
6. Text contrast ≥ 4.5:1

Lighthouse against a local build: serve `dist/client` (e.g.
`python3 -m http.server 4410 --bind 127.0.0.1 -d dist/client`), then
`CHROME_PATH=/usr/bin/brave-browser npx -y lighthouse http://127.0.0.1:4410/ --chrome-flags="--headless=new --no-sandbox"`.
