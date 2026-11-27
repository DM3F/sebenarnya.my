# Sebenarnya.my website — implementation notes & history

> **Not the design system spec.** This file is the **website**'s work log: per-page decisions, section sizes and the history of changes since Nov 2026. Many values below are **outdated** (e.g. a blue `--color-ring`, mobile type overrides, `--radius-lg`) and are kept only as history.
>
> For the design system (also used by the CMS dashboard and the browser extension), read:
> - [`README.md`](README.md) — doc map and how other products use it
> - [`design.md`](design.md) — look and feel
> - [`design-system-rules.md`](design-system-rules.md) — tokens, components, lint
> - `design-system/tokens.css`, `design-system/ui.css`, `design-system/react/` — **the source of truth**; when this file disagrees with the code, the code is right. (Older entries below say `app/tokens.css`, `app/ui.css` and `components/ui/`: those files moved to `design-system/` on 26 Nov 2026.)
>
> Early reference (history only): Figma `wxC95N2gmMWvBOWU1K7Nsy`. The Paper file `sebenarnya.my` is no longer a reference.

---

## 0. Repo context (status at the time)

- Next.js 16 + React 19, **JavaScript** (not TS), App Router, `output: "export"`, `basePath` `/sebenarnya.my` in production (GitHub Pages). Use `withBase()` from `lib/basePath.js` for asset paths.
- Routes: `/` (Home), `/about-us`, `/logo`, `/article`, `/article/[slug]`.
- Styling: one file `app/global.css` (~3,900 lines), **no Tailwind**. Root font size 62.5% → `1rem = 10px`.
- Font: **Manrope only** (`--font-manrope` → `--font-sans`) through `next/font/google` in `app/layout.js`, for content, headings and every UI control. Inter and `--font-ui` removed (21 Nov 2026, `design.md` §8). ✅ Done.
- Tokens: `app/tokens.css` (imported before `global.css`). The old `:root` variables in `global.css` are mapped to tokens (section 3). ✅ Done.
- Existing components: `Header, Footer, Hero, Carousel, Latest, FlipCard, Bento, Stories, Viewership, Collaborators, Articles, ArticleDetail, AboutUs, Logo, LogoKit, ShareButton, Chatbot, ClaimForm, ScrollMotion`.

**Token rule (mandatory):** this design system will also be used by the **CMS dashboard** and the **browser extension**. Components may ONLY use **semantic tokens** (`--color-background`, `--color-foreground`, `--color-muted*`, `--color-border*`, `--color-primary*`, `--color-ring`, `--color-verdict-*`, `--color-brand*` …) and the `--text-*`, `--leading-*`, `--spacing-*`, `--radius-*` scales — never the palette (`--color-grey-*`, `--color-red`, `--color-blue` …) or raw hex. Component values are px so they do not depend on another project's root font size.

**Principle:** don't rewrite from scratch. Add tokens → map old variables to tokens → tidy components one by one. Keep the routes, the data (`data/content.js`, `lib/*`) and the behaviour (carousel, flip card, chatbot).

---

## 1. Brand idea

"Warm cream editorial, clear headlines." 97% achromatic; colour only on the logo, the sphere, the atmospheric field and verdicts. **Kebenaran red is not an action colour** — never for buttons, links or nav.

---

## 2. Design tokens

✅ **One set of token names** for the site, the CMS dashboard and the browser extension (Tailwind v4 namespaces + shadcn-style semantic colours). Single source: `app/tokens.css` (can be pasted straight into a Tailwind `@theme`). Three tiers: primitive → semantic → component; rules in [`design-system-rules.md`](design-system-rules.md).

### 2.1 Palette (primitive — NEVER in components)
`--color-white #FFFFFF` · `--color-grey-99 #FDFCFC` (eggshell) · `--color-grey-95 #F5F3F1` (warm taupe) · `--color-grey-91 #EBE8E4` (stone) · `--color-grey-82 #D7D2CC` (pill edge) · `--color-grey-50 #878179` (field edge) · `--color-grey-43 #6F6A63` (smoke) · `--color-grey-41 #6B6A68` · `--color-grey-25 #44403B` (graphite) · `--color-black #000` · `--color-red #E8302A` · `--color-red-dark #C8211C` · `--color-blue #3A46F5` · `--color-azure #2F5FD0` · `--color-green #1FA463` · `--color-green-dark #137A49`

### 2.2 Semantic colours (use THESE)
| Token | Value | Use |
|---|---|---|
| `--color-background` | grey-99 | page canvas, controls (outline button, chip, tab, search) |
| `--color-foreground` | black | main text |
| `--color-muted-foreground-inverse` | white 60% | muted text on dark/black (≈7:1 on black); never `--color-muted-foreground` on black (3.86:1) |
| `--color-card` | white | raised surface |
| `--color-muted` | grey-95 | bands, hover, active nav |
| `--color-muted-strong` | grey-91 | inset, divider, disabled fill |
| `--color-text-secondary` | grey-25 | strong body text |
| `--color-muted-foreground` | grey-43 | muted text, eyebrows, icons, placeholders, hero tagline |
| `--color-border` | grey-82 | pill, card and dropdown edges |
| `--color-border-strong` | grey-50 | field border, outline button |
| `--color-primary` / `-hover` / `-foreground` | black / grey-25 / white | primary action |
| `--color-foreground-inverse` | white | text on dark/media |
| `--color-ring` | blue | focus |
| `--color-link` | blue | links |
| `--color-destructive` | red-dark | error text, invalid field |
| `--color-brand` / `-strong` | red / red-dark | logo, sphere — NOT actions |
| `--color-brand-spark` | blue | decoration |
| `--color-hairline` | rgba(0,0,0,.05) | hairlines |
| `--color-verdict-{palsu,makluman,benar}` | red-dark / azure / green-dark | verdict word (tone single) |
| `--color-verdict-*-dot` | red / orange / blue / green | verdict dot |

Control sizes follow the **fluid control scale** (375 → 1280px): `sm` `--size-control-sm` 32→36 · `md` `--size-control` 40→44 (default) · `lg` `--size-control-lg` 44→48 · `xl` `--size-control-xl` 48→56 (the primary search + Tanya AIFA only). Side padding `--space-control-x-sm/-x/-x-lg` 12→16 · 16→20 · 20→24. The touch target stays 44 (`::after`). Radius `--radius-full`.
(Dark mode not required yet.)

### 2.3 Typography
Font: **Manrope** 300/400/500/600 for everything (`--font-sans`) — content, headings, navigation and UI controls.

| Style | Weight | Size / line (token) | Tracking | Use |
|---|---|---|---|---|
| Display/56 Medium | 500 | 56 / 60 | -0.02em | cover, hero headline, section display |
| Display/48 Medium | 500 | 48 / 52 | -0.02em | hero |
| Heading/48 Medium | 500 | 48 / 52 | -0.02em | carousel slide titles |
| Heading/36 | 500 | 36 / 42 | -0.02em | section titles |
| Heading/32 | 500 | 32 / 36 | -0.02em | closing band, lead story |
| Heading/24 | 500 | 24 / 32 | -0.01em | panel/card titles |
| Heading/20 | 500 | 20 / 26 | 0 | article card titles (Articles page) |
| Heading/18 | 500 | 18 / 28 | 0 | subheadings, small card titles |
| Body/24 Large | 400 | 24 / 32 | -0.01em | About us intro |
| Body/18 | 400 | 18 / 28 | 0 | intro, article body |
| Body/16 | 400 | 16 / 24 | +0.01em | default |
| Body/14 | 400 | 14 / 21 | +0.01em | meta, support |
| Label/16 (Button/Nav/Tab/Link) | 500 | 16 / 24 | 0 | every button, tab, chip, nav, dropdown, footer link, CTA |
| Eyebrow/14 | 500 | 14 / 20 | +0.01em | Smoke, sentence case |
| Verdict/13 | 600 | 13 / 18 | +0.04em | UPPERCASE |
| Caption/12 | 500 | 12 / 16 | +0.01em | dates, credits |
| Stat/40 Light | 300 | 40 / 44 | -0.02em | statistics |
| Stat/32 Light | 300 | 32 / 36 | 0 | small numbers (WSIS) |

**Rule: every interactive label (button, nav, tab, chip, dropdown, CTA, footer link) = 16 / 24 Medium** — no 18px labels. **Every heading is Medium 500** (Display H1, section titles, carousel slide titles, award, heading, title), read from its role's `--font-weight`, never written by hand. **Statistics are 400** through `--font-weight-display` (now for numbers only). Regular 400 for body; Light 300 only for statistic captions. Nothing 700+.

Tokens: components use **only** the type roles `--text-{display,heading-lg,heading,title,intro,article,body,body-sm,label,label-sm,eyebrow,badge,verdict,caption,stat}` (+ `--line-height`, `--font-weight`, `--letter-spacing`). Large roles are fluid with `clamp()` (375 → 1280px), no media queries for type. Full table: `docs/design-system-rules.md` › Type roles. Primitives (`--text-12…48`, `--leading-heading` 1.2, `--leading-body` 1.5; tracking 0 except `--tracking-label` for UPPERCASE) only in tokens.css.

Mobile (<600px): Display → `--text-38`/`--leading-42`, Heading/36 → `--text-30`/`--leading-36`, Heading/32 → `--text-28`/`--leading-34` (switched in component media queries). Body stays 400, max 68ch.

> **Current rule (replaces the list below):** components use the spacing roles `--gap-inline/text/group/cards/block` and card sizes `--pad-card-sm/-/lg` + `--radius-card` / `--radius-card-lg`. See `docs/design-system-rules.md` › Spacing & radius roles.

### 2.4 Spacing (4px base) — `--spacing-*`
`2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 44, 48, 56, 64, 72, 96, 120`
- 8: paired pills/chips gap · 12: grid gutter · 16: inset, mobile margin · 20: pill side padding · 24: panel title→body · 32: card padding · 40: under a section header · 64: stage padding · 96: hero top.

**Page rhythm (role tokens, `app/tokens.css`) — every page uses the same:**
| Token | Desktop | ≤1280 | ≤1024 | ≤900 | ≤600 | Use |
|---|---|---|---|---|---|---|
| `--space-page-x` | 96 | 48 | 48 | 24 | 16 | Page gutter: header, every section, footer (`--side` is an alias) |
| `--space-section` | 120 | ≈120 | ≈104 | ≈96 | 64 → ≈78 | Fluid `clamp(64, 40.8px + 6.188vw, 120)`: 64 @375 → 120 @1280, ≈3× `--gap-block`. Space between sections; `.main` is a flex column with this `row-gap` + `padding-bottom` before the footer; footer top padding |
| `--space-page-top` | 40 | 40 | 40 | 40 | 24 | Header → first block on pages without a hero (Articles, detail) |

Sections have **no** top/bottom padding of their own; the space comes from `.main`. Tight pairs get half (`.hero + .hero-carousel`, `.hero-carousel + .partners`: −½ `--space-section`). A new section only needs `padding-inline: var(--space-page-x)`.

### 2.5 Radius
`--radius-sm: 4px` · `--radius-input: 8px` · `--radius-md: 12px` (thumbnails, media, dropdown) · `--radius-card: 20px` (cards, stages, panels) · `--radius-lg: 24px` (feature card, hero stage) · `--radius-full: 9999px` (EVERY button, tab, chip, search).

### 2.6 Effects
```css
--shadow-float: 0 0 0 .5px rgba(0,0,0,.2), 0 8px 24px rgba(0,0,0,.12); /* Tanya AIFA only */
```
Elevation comes from tone (Eggshell → Warm Taupe → Stone), not shadow.

### 2.6b Icons — Lucide ✅
Every UI icon is **Lucide** (`lucide-react`, https://lucide.dev) through `components/ui/Icon.js`:
```jsx
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui';
<Icon icon={ArrowRight} />          // 16px (default)
<Icon icon={Search} size={18} />
```
- **1.75px stroke at every size** (`absoluteStrokeWidth`), colour `currentColor` (follows the text token), `aria-hidden` — the accessible name comes from the control.
- Sizes: 16 in buttons/labels/cards · 18–20 controls (search, close, carousel arrows) · 24 floating button (Tanya AIFA) · 28–40 status illustrations (forms).
- In use: ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown/Left/Right, Search, X, MessageSquareText, Flag, Check, Link, CloudUpload, Share, Download, Calendar, Play (the pause button and `filledIcons` were removed 22 Nov 2026).
- **Exception:** brand logos (Facebook, Instagram, Threads, X, TikTok) are not in Lucide → they stay brand SVGs (`data/content.js`).
- No text glyphs (↗ → ‹ ›), hand-written SVGs or other icon sets. Never override `stroke-width` in CSS.

### 2.7 Layout
Page max `--max-width`, sides `--space-page-x` (96 → 48 ≤1280 → 24 ≤900 → 16 ≤600). 12-column editorial grid, gap 12 (heading spans 7, copy column 9–12). Breakpoints (numbers in media queries; no tokens because media queries cannot read variables): 1100 compact header · 900 stacked layouts · 600 phone.

---

### 2.x Motion — page transition
- `components/PageTransition.js` (in `app/layout.js`): catches internal link clicks, runs `document.startViewTransition`, then `router.push`. `/submit-claim/` links, new tabs, external links and hashes are left alone.
- CSS: the browser's own crossfade, `::view-transition-group(root)` `--duration-base` (250ms) `--ease-out`. Opacity only, so the same under reduced motion. The new page plays its own entrance (`PageEnter`). (It used to be a 1.2s rise + wipe; `--duration-page` and `--ease-page` removed 23 Nov 2026.)
- Browsers without `startViewTransition`: normal navigation.

### 2.y Motion — hero carousel
- Infinite loop (no first/last slide); slides are placed around a continuous position with `translate3d`.
- Motion: exponential ease τ 0.11s toward the target (can be grabbed mid-motion). Drag follows the finger; a flick > 0.6 slide/s is enough to change slides; the trackpad follows the finger, then snaps after 140ms.
- Text shown on every card (centre, left, right); no count badge (infinite loop). Mobile: portrait cards, text at the bottom inside the card.
- `prefers-reduced-motion`: no autoplay, moves straight without a glide.

### 2.z Motion — FlipCard (Semakan fakta terkini)
- One card open at a time (state in `Latest.js`).
- Hover: wait 90ms before flipping (a pointer sweep does not flip every card); leave: wait 140ms so moving to the next card swaps in one motion.
- Opens 0.7s `cubic-bezier(.23,1,.32,1)` + rises 4px (mouse only); closes 0.45s `cubic-bezier(.65,0,.35,1)`. CSS transitions, so it can reverse mid-way.
- `prefers-reduced-motion`: switches straight without rotating.

## 3. Mapping old variables → new tokens (`app/global.css`)

| Old | Old value | New |
|---|---|---|
| `--font` | Montserrat | `var(--font-sans)` (Manrope) |
| `--text`, `--dark` | #151618 | `var(--color-foreground)` |
| `--bg` | #fff | `var(--color-background)` |
| `--white` | #fff | `var(--color-card)` |
| `--dark-card` | #0c0d11 | `var(--color-primary)` |
| `--tag-bg` | #efeef0 | `var(--color-muted)` |
| `--tag-hover` | #e6e6ea | `var(--color-muted-strong)` |
| `--input-bg` | #f2f0f2 | `var(--color-muted)` (or a white field + border, see Field/Search) |
| `--line` | #ceced0 | `var(--color-border)` |
| `--accent` | #314bff | `var(--color-link)` |
| `--orange` | #ff6b35 | `var(--color-verdict-waspada-dot)` |
| `--red` | #e51c23 | `var(--color-brand)` |
| `--radius` | 26px | `var(--radius-card)` (20px); pills → `var(--radius-full)` |
| `--gap` | 16px | kept / `12px` for the editorial grid |

Then find the hard-coded hex in `global.css` (e.g. `#6d6d72`, `#e2e2e5`, `#8a8a8f`, `#4a4a4f`, `#f5f5f7`, `#111215`, `#0d0e12`) and replace it with the nearest semantic token (`--color-muted-foreground`, `--color-border`, `--color-muted`, `--color-primary`).

The verdict colours on the old Articles page (`#e51c23`, `#1d8a4e`, `#f56300`, `#0071e3`) → use the verdict tokens in 2.1.

---

## 4. Components (spec)

✅ **Base components done** in `components/ui/` (import from `@/components/ui`) with CSS in `app/ui.css` (`ui-*` classes, semantic tokens only, Manrope):
- `Button` (`variant`: filled | outline | ghost, `icon`, `href`, `disabled`) + `ButtonGroup`
- `Chip` (`href?`) + `ChipRow` (`label` e.g. "Popular:")
- `Tabs` (`items`, `value`, `onChange`, `label`) — follows the ARIA tabs pattern (arrows, Home/End)
- `Verdict` (`type`: palsu | makluman | benar, `tone`: default | single, `agency`) — three verdicts only
- `SearchField` (`label`, `hideLabel`, `placeholder`, `buttonLabel`, `value`+`onChange(text)` or `defaultValue`, `error`, `action` or `onSubmit(query)`)
- `Tabs` `mode="toggle"` → `role=group` + `aria-pressed` (no tab panels)
- `NavLink` (`href`, `current`) — borderless nav link, side padding `--space-control-x` (20). States: rest weight 400 transparent · hover bg `--color-accent` (pointer only) · press scale .97 · current page weight 500, no fill · standard focus ring
- `LanguageMenu` (`items` [{value, label, lang, flag}], `value`, `onChange`, `label`, `groupLabel`, `align`) — 24px round flag pill + chevron (border `--color-border`, bg `--color-secondary`); panel `--radius-menu` + `--shadow-float`, muted caption group label, items flag + name, selected bg `--color-accent`. Enters in 150ms opacity+scale .96 from the trigger corner. Flags: `public/images/flags/*.svg`
- `DropdownMenu` (`label`, `items` [{label, href, current}], `current`, `align`) — NavLink trigger + chevron, a panel of links. `.ui-dropdown__item` can be `<a>` or `<button>` (browser button chrome removed: no border/bg, full width)
- Mobile menu: group labels (e.g. Tentang Kami) the same size/colour as Utama/Artikel; child links `--text-label-sm` (14), muted, indented 32
- Kongsi (share) menu: `.ui-menu` (the same as the nav and language dropdowns), appears in 150ms opacity + scale .96 from the top centre (the Kongsi button)
- `Button`/`Chip`/`NavLink` with `href` render a plain `<a>` (no Next.js dependency) so they work in the CMS/extension.

For the CMS/extension: copy `app/tokens.css` + `app/ui.css` (+ `components/ui/` if React). (Superseded 26 Nov 2026: products install the `@sebenarnya/design-system` package.) Already in place: **Header** and **Hero** (below). Other components not yet.

### Button
- Base (`md`): `height --size-control` (40 phone → 44 desktop); `padding 0 --space-control-x` (16→20); pill radius; Label/16; gap 8px (16px icon).
- Sizes: `sm` 32→36, padding 12→16, Label/14 · `md` (default) · `lg` 44→48, padding 20→24 · `icon-sm` / `icon` / `icon-lg` squares of their height. Below 44px an invisible `::after` keeps a 44 touch target.
- `filled`: bg `--color-primary`, text `--color-primary-foreground`; hover bg `--color-primary-hover`.
- `outline`: bg `--color-background`, border `.5px solid --color-border-strong`; hover bg `--color-muted`.
- `ghost`: bg `--color-background`, underlined text; hover bg `--color-muted`.
- `focus` (all): `border: 2px solid --color-ring`.
- `disabled`: bg `--color-muted-strong`, border `.5px --color-border-strong`, text `--color-muted-foreground`.
- Button pairs: gap 8px. Props: `variant`, `size?` (sm · md · lg · icon-sm · icon · icon-lg), `icon?`, `href?`.

### Chip
The same heights as Button: `sm` 32→36 (Label/14) · `md` 40→44 (default) · `lg` 44→48; pill radius; bg `--color-secondary`; Label/16. Hover `--color-secondary-hover`. Preceded by a "Popular:" label, Body/14 Smoke.

### Tabs/Segmented
The container is one `md` control tall (`--tabs-height`), `padding 2px; gap 2px; pill radius`. A tab = `track − 2 × (2 + border)`, so the whole control is as tall as the Button next to it. Selected item bg `--color-card` + border `--color-border`.

### Field/Search
Sizes: `lg` (default, `--size-control-xl` 48→56) · `md` (44→48) · `sm` (40→44, toolbar). `padding 0 4px 0 --space-control-x; pill radius; bg --color-background; border 1px --color-border-strong; gap 12`. 18px Smoke search icon, Body/16 Smoke placeholder, filled "Semak" Button on the right, its height = `search − 2 × (4 + border)` (38 phone → 46 desktop), so the 4px gap is the same above, below and on the right. Focus: `border 2px --color-ring` + `box-shadow 0 0 0 1.5px --color-ring`. Label above: 14 Medium Ink.

### Verdict
Badge scale, not a control: `pill` (default) = `lg` badge 32, padding `0 12 0 10`; `overlay` / `tint` = `md` badge 24, padding `0 10 0 8`. Gap 8; pill radius; bg `--color-background`. 8px dot (dot colour) + halo `0 0 0 3px <dot> @18%` + Verdict/13 word + Body/13 Smoke agency (`· KPDN`).
- `tone="default"`: ink word.
- `tone="single"`: the word in the verdict text colour.
- Always dot + word + agency (WCAG 1.4.1). Variants: `palsu | makluman | benar` only (labels: Palsu, Makluman, Benar).

### Nav/Header ✅
Built in `components/Header.js`, data in `data/content.js` (`navLinks`, `claimLink`):
- Left: logo 133×40 · centre: `NavLink` **Utama**, **Artikel** + `DropdownMenu` **Tentang Kami ▾** (Tentang kami, Logo) · right: `LanguageMenu` (Bahasa Melayu / English) + filled `Button` **Salur Kepada Kami**.
- Bar: bg `--color-background`, 1px bottom border `--color-border`, padding 16 / 96 (48 ≤1280, 24 ≤900, 16 ≤600), gap 24.
- Active item: `--color-muted` pill (the dropdown trigger is active when one of its children is the current page).
- Language: `LanguageMenu` (flag pill, side padding `--space-control-x`, panel on the right).
- Space between nav items and between the buttons on the right: the `--space-nav-gap` token (8).
- Dropdown: panel bg `--color-background`, 1px border `--color-border`, radius `--radius-md`, padding 8, `--shadow-float`; items 44px, padding 10 16, radius 8, hover/active `--color-muted`. Closes on Escape (focus back to the trigger), outside click or blur.
- ≤1100px: the nav becomes a panel (44×44 menu button); dropdown children are listed under their group label. ≤600px: the "Salur Kepada Kami" button moves into the panel, logo max 140.
- Font: every header label (NavLink, dropdown, BM/EN, the "Salur Kepada Kami" button) uses **Manrope** (`--font-sans`). Other UI controls too (Inter removed).
- "Hubungi kami" is not in the dropdown yet — there is no `/contact/` page.

Original Figma baseline:
- Wide: `padding 16; flex space-between; bg --color-background`. Logo 133×40 in a 160×56 slot. Nav items: borderless Chips (active bg `--color-muted`), gap 4: Utama, Artikel, Tentang Kami ▾ (dropdown), Berita dan Galeri, Salur Kepada Kami. Right: language switcher + filled Button "Tanya AIFA".
- Compact (<1100): row 1 logo + utilities, row 2 nav.
- Dropdown menu: `padding 8; radius 12; bg canvas; border 1px --color-border`; items 44px, padding 10px 16px, Label/16. Items: Tentang kami, Logo, Hubungi kami.
- The language switcher **uses tokens** (bg `--color-muted`, active `--color-primary`).

### Hero ✅
`components/Hero.js` + `components/Carousel.js`. Hero: top padding 96, gap 48; heading group gap 16.
- Display/56 Medium heading, **2 lines**: "Tidak pasti? / Semak sebelum kongsi." (≤600px: `--text-38`, lines flow with `text-wrap: balance`, still 2 lines).
- Lede 18/32 Medium `--color-text-secondary`, **2 lines** (69 + 69 characters): "Portal rujukan rasmi yang disahkan terus oleh kementerian dan agensi. / Tampal tajuk mesej tular di sini, atau tanya AIFA 24 jam di WhatsApp." (≤760px flows freely).
- `SearchField` max 800, placeholder "Contoh: bantuan tunai WhatsApp", error under the field.
- Under the search (gap 16): `ChipRow` "Carian popular:" (Body/14 `--color-muted-foreground`) + 4 `Chip`s: Bantuan tunai · RON95 · Hujan lebat · Lesen memandu. Every keyword must return at least one check; a click searches straight away (`/article?q=`).

### HeroCarousel ✅
- Slides 960×480 (width `min(960, 100vw − 128)`), radius `--radius-card`, gap 20; the centre slide in the middle, the left/right neighbours peeking.
- **Only the centre slide shows text** (eyebrow, title, text, CTA, counter); side slides are image only with a 25% dark scrim. Text appears after the slide stops (fade .5s, delay .6s).
- Content: left 64, max width 484, gap 16. White Verdict/13 eyebrow + 8px dot in `--color-verdict-*-dot` (3px 25% halo) — "PALSU · KPDN". White Heading/48 Medium title on 2 lines (`title` + `titleEm`). White Body/16 text, max 400. CTA pill `--color-background` + `--color-foreground` text + arrow.
- Overlay: `linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.05) 85%)`.
- Controls: dots pill bg `--color-muted` h48 padding 20 gap 12; 8px dots `--color-border-strong`, the active one 32 wide with a 6s `--color-foreground` progress fill; round 48 pause/play button `--color-muted`.
- **Autoplay 6s**; pause/play; starts paused under `prefers-reduced-motion`. Drag/swipe, trackpad, ←/→ keys (the gallery can take focus). Click a side slide = bring it to the centre; click the centre slide = open the article.
- ≤900px: width `100vw − 64`, title 36/42. ≤700px: image on top (16:10), text below, title 28/34, side slides at 50% opacity.
- The old section heading "Semakan Fakta Popular" was removed.

### Footer ✅
1px top border `--color-border`, padding 96 top / 32 bottom, sides 96 (48 ≤1280, 24 ≤900, 16 ≤600), gap 64. Left: 180 logo + Medium 18/24 text (max 400). Right: 3 columns 180 wide, gap 48 — **Sosial** (text only, opens in a new tab), **Semak & Lapor** (Semak Fakta, AIFA, Salur Kepada Kami), **Sebenarnya.my** (Tentang Kami, Berita dan Galeri). Column titles 14 semibold UPPERCASE `--tracking-label` `--color-muted-foreground`; links 16/24 Medium, gap 12, underline on hover. Copyright 14/21 `--color-muted-foreground`. ≤1100 stacked; ≤600 2 columns per row.

### About us page ✅
- **Hero:** photo card `--radius-lg`, padding 56/40/64, height min(755px, 85svh). Top: "Ikuti kami" 36/42 + 4 round 48 social buttons (`--color-card`, 24px brand icons). Bottom: 48/52 title + 24/32 lead, white.
- **Four functions:** right-aligned 56 title. Left: a 560×440 `--color-muted-strong` selected card (36/42, `/01` number tnum, 18/28 text) + ‹ › 44 buttons + a 3px progress bar (25% thumb, slides .45s `--ease-in-out`). Right: 3 small `--color-muted` cards (24/32, 16/24) — click to select. Content enters .32s `--ease` (opacity + 6px + 2px blur), small cards staggered 40ms. Reduced motion: fade only.
- **Berita dan Galeri (updated 22 Nov, marquee):** centred head (section title + intro). Two rows of news photos (`aboutNews.marquee`, demo data + AI-generated photos) moving in opposite directions ~28px/s: top row left, bottom row right, seamless loop (two identical sets, `translateX(-50%)`). Wide cards 529×340 (photo + tag + 20px title) and narrow cards 166×340 (photo + tag), 10px apart, `--radius-card`, a dark `--gradient-scrim-bottom` foot so white text is ≥ 4.5:1. Stops on hover/focus and with a pause button (WCAG 2.2.2); under reduced motion the rows do not move and can be scrolled by hand. Card height 340 / 280 (≤1100) / 220 (≤600). Under it, the photo sphere; the "Galeri" heading is `sr-only`.
- **Logo:** `LogoKit headingLevel={2}` — the same style as the `/logo` page (36/42 title, 475 muted preview, filled `Button`).

### Article detail page ✅
Padding 32 top / 96 bottom, sides 81 (48 ≤1280, 24 ≤900, 16 ≤600). "Semua artikel" 16/24 Medium + 20 icon. Tags: `Verdict tone="single"` with agency + a 14/20 Medium category pill, both with a .5px `--color-border` border, 44 tall. Title 48/52 Medium `--tracking-display` (32/36 ≤600), subtitle 18/28 `--color-text-secondary`, meta 14/21 `--color-muted-foreground` + Kongsi button (1px border, 16/24 Medium, 20 icon). Image 1100 × 2:1, `--radius-card` (4:3 ≤600). 680 reading column: 18/28 lead, a divider, "Penjelasan rasmi" 24/32 Medium.

### Articles page ✅
- Sides `--articles-side` 96 / 48 / 24 / 16, top padding 40, bottom 96.
- **Filters:** 44 pill search (1px `--color-border-strong` border, 18 Search icon, Manrope 16 input) + 2 native `<select>`s styled as 44 pills (`--color-border` border, 16 Medium label, Lucide ChevronDown) + a 14 `--color-muted-foreground` count. 44 category chip pills bg `--color-muted`, 16 Medium label, 7px verdict dot; selected = `--color-primary` + `--color-primary-foreground`; the row scrolls with ‹ › 44 buttons when it overflows.
- **Results:** with >4 results — a lead card (960:440, height 560, radius 20, bottom scrim, white 28/36 Medium title, 14 date) + a side list of 4 items (160×122 thumb radius 12, 20/26 Medium title, 14 date); then a 4-column grid (3 ≤1280, 2 ≤900, 1 ≤600), gap 32/24. Grid card: bg `--color-muted`, radius 20, padding 8/8/20, 220 photo radius 12, 20/26 title, 14 date.
- Verdict pill on photos: bg `--color-background` 90%, dot `--color-verdict-*-dot`, 13 semibold UPPERCASE word `--color-verdict-*`. Status `benar` is labelled **"Benar"**.
- The whole card is clickable (title link `::after`), focus ring on the card.

### Tanya AIFA (floating)
Pill `padding 10px 22px 10px 18px; min-height 44`, 24px chat icon + "Tanya AIFA" Label/16. Red `#e51c23` + red shadow in the artwork — **conflicts with the rule "red is not an action colour"**. Proposal: filled Ink Button + `--shadow-float` (to confirm with the owner).

### Cards
- **Article card (Articles page):** width 230; image 276 tall, radius 26→`--radius-card`; verdict pill top-left (bg white 90% + blur 10, padding 6px 10px, 7px dot, 13 SemiBold); 30px round agency avatar bottom-left; Heading/20 title; Body/14 date @60%.
- **FactCheckCard ✅ (Home "Semakan fakta terkini"):** `components/FlipCard.js`, 340×480, radius `--radius-card`. The flip is kept: mouse hover, click/tap, Enter/Space (focus moves to the visible side), `rotateY(180deg)` .6s `cubic-bezier(.77,0,.175,1)`, no animation under reduced motion.
  - Front: full photo; a thin top scrim (0.35→0, 120px) behind the logo and a dense bottom scrim (0.8→0.55→0, 300px) under the text so white text stays ≥4.5:1 on any photo; **a white 44 agency logo (30 logo, or a monogram) top-right**; **verdict pill (dot + 13 semibold WORD) + 24/125% Medium white title at the bottom** (inset 24); no arrow icon.
  - Back: bg `--color-muted`, 1px border `--color-border`, padding 24; `● PALSU · MCMC` (word in `--color-verdict-*`) + 36 avatar; 20/130% Medium title; 16/24 summary `--color-text-secondary`; 13 meta `--color-muted-foreground` "Disemak {date}" + "Sumber: kenyataan rasmi {agency}" above a rule; full-width CTA 48 tall, padding 6/6/6/20, `--color-primary`, 16 Medium label "Baca semakan" + a white 36 ↗ circle (concentric with the pill radius); hover `--color-primary-hover` + the ↗ icon slides 2px; press `scale .96`. Both faces exactly 480px (`box-sizing: border-box`) so the card height does not change while flipping; summary max 4 lines.
- **"Semakan fakta terkini" section ✅:** `components/Latest.js`. Top/bottom padding 96 (64 ≤1280, 48 ≤600), sides `--latest-side` 96 / 48 ≤1280 / 24 ≤900 / 16 ≤600 for the heading and buttons only — **the card row runs full-bleed to the screen edge** (like the hero carousel), the first card aligned with the heading; gap 48; Heading/36 Medium title on **2 balanced lines (22 + 22 characters): "Semakan fakta terkini, / disahkan agensi rasmi."** (≤600px lines flow with `text-wrap: balance`, still 2 lines). The card row = **an endless automatic glide** (the 12 latest checks, each with a unique image): cards sit on a "ring" — a card leaving on the left comes back on the right, no duplicate copies. Speed 36px/s; **mouse hover = slows to a stop, mouse leave = speeds back up** (ease ~0.2s). Also stops while a card is flipped, while keyboard focus is inside (the focused card is brought into view), while dragged (touch/pen), and always under `prefers-reduced-motion`. Round ‹ › 44 buttons (border `--color-border`) glide exactly one card; "Lihat lagi" outline `Button` with a `--color-foreground` border, centred.
- **The same section under the article page ✅:** `<Latest status={article.status} exclude={article.slug} />` in `app/article/[slug]/page.js`. The same style, glide and flip as Home; only checks with **the same verdict** (palsu / benar / makluman), without the article being read. Title + subtitle follow the verdict, from `articleStatus[status].related` in `data/content.js`: Palsu "Dakwaan palsu lain", Benar "Fakta benar lain", Makluman "Makluman lain". A short list (e.g. 3 benar) repeats to ≥ 8 cards so the ring has no hole.
- **Feature card / WSIS:** bg `--color-muted`, radius 20, padding 46 44; Stat/32 Light stats + 12 Smoke caption.
- **Function card (About us):** height 280, padding 24, radius 20, subtle bg; Heading/24 title + "/01" Body/16 number; Body/16 Smoke text.
- **Logo download card:** 1px border `--color-border`, radius 20; subtle preview area; bottom: Heading/36 + Body/16 @80% + 14 meta @60% + filled Button "Muat turun" (download icon).

### "Semakan fakta popular" carousel (Hero carousel)
Slides 960×480 radius 20, gap 20, the active slide centred. Overlay `linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.05) 85%)`. Verdict/13 Smoke eyebrow ("Palsu · KPDN"), white Heading/48 Medium title, white Body/16 text, canvas Button + arrow icon. Round 48 prev/next buttons, Ink + Stone border. Below: a subtle dots pill (8 dots, active 48 wide) + a 56 Pause button.

### Social media carousel
Cards 220×560 radius 20 (platform gradient bg), the active card 920 wide + `0 24px 50px rgba(0,0,0,.45)`. Progress bar 680×4. Round 48 buttons, subtle bg.

### Other sections
- Band/Closing: top + bottom border, padding 86 0, Heading/32 + a Button pair (outline "Salur kepada kami" + filled "Semak dakwaan").
- Band/Announcement: height 48, radius 12, subtle bg, 8 Violet dot + Body/14 + outline Button.
- Timeline (About us): 2px Stone line, 12 Kebenaran red dot + 5px white halo, Heading/24 title, Body/16 @80% text, gap 44.
- Official statement sources: top border, padding 36 0, 12 label + a row of agency logos (height 48, gap 56, opacity .92).

---

## 5. Page → component map

| Route | Components |
|---|---|
| `/` | `Hero`, `Carousel`, `Latest` + `FlipCard`, `Viewership`, `Bento`, `Stories` |
| `/article` | `Articles` |
| `/article/[slug]` | `ArticleDetail` |
| `/about-us` | `AboutUs`, `SphereGallery`, `LogoKit` |
| all | `Header`, `Footer`, `Chatbot`, `ClaimForm` |

Figma nodes (early reference only): `/` `3:203` · `/article` `20:3033` · `/about-us` `4:1359` · `/article/[slug]` `4:1876` · design system `14:14`–`14:1347`.

Images: use the existing assets in `public/images/` first; new assets from Figma must be downloaded into `public/` (Figma MCP URLs expire after 7 days).

---

## 6. Suggested work order (at the time)

1. A new branch from `endahbyu` (e.g. `design-system`).
2. ✅ Switch the font to Manrope in `layout.js` (Inter removed 21 Nov 2026).
3. ✅ Add `app/tokens.css` (section 2) and import it.
4. ✅ Map the old variables in `global.css`'s `:root` (section 3). A visual check of every page is still needed.
5. ✅ Build `components/ui/` (Button, Chip, Tabs, Verdict, SearchField). Not yet: use them in the existing components.
6. ✅ Header + Hero. Not yet: Footer, Tanya AIFA.
7. Tidy sections page by page (sections 4 & 5), one commit per section.
8. Replace the remaining hard-coded hex with tokens.
9. `npm run build` (the static export must pass), check with `npm run dev`, `npm run lint:ds`, and a visual check at desktop + 390px.
10. Open a PR to `endahbyu`.

## 7. Open questions (to confirm with the owner, at the time)
- The Tanya AIFA button colour (red vs Ink).
- The Articles page still used Montserrat and radius 26 — switch to Manrope / 20 (proposal: yes).
- Dark mode now or later.

## Home — lower part

- **Short About** (`.viewership`, `.partners`): sides `--brief-side` 96 → 48 (≤1280) → 24 (≤960) → 16 (≤600). Kicker 24 Medium, lead 20/130%. Statistics `clamp(48px, 5vw, 72px)` Medium, 16 Light description. Partner label 14 semibold uppercase `--color-muted-foreground`, logos 40 apart, fixed ticker.
- **Latest social media activity** (`.activity`): side padding 96, gap 32, Heading/36 Medium title.
- **WSIS PromoBanner** (`components/Bento.js`, `.wsis-banner`): flex row 560 tall, gap 24. Story card flex 1.62, padding 48, `--radius-lg`, `--color-black` background; brand-red eyebrow (not an action); light 44px CTA pill, 16/24 Medium label, Lucide `ArrowRight` icon, scale .96 on press → `/about-us/#berita-galeri`. Media flex 1, 1px border, `--radius-lg`. Stacks at ≤1100.
- **SocialCarousel** (`components/Stories.js`): no title of its own (the title comes from `.activity`). Sizes from the viewport width: small = 15.3%, large = the rest, gap 8; ≤700: small max(16%, 56), large min(80%, 380). Cards `--radius-lg`, progress track `--color-muted-strong` / bar `--color-foreground`, round 44px outline buttons with a focus ring.

## Page notes (About us, Articles, article detail)

- **Articles** (`components/Articles.js`): the lead card row + side list removed; every result in a 4-column card grid. Category chips only `Semua` + four verdicts (Palsu, Penjelasan, Waspada, Makluman). Card titles now `box-sizing: border-box` so the 12 right padding is respected.
- **Article detail**: `.post-body` reading column 514px, 18/28.
- **About us › About** (`.about-intro`, data `aboutIntro`): 14 Medium label pill framed in `--color-border`; 24/32 lead, 700 wide. Three cards 340 tall, gap 12, `--radius-card`: (1) `--color-primary` with 24 Medium text + a `--color-muted-foreground` part and a status indicator (decorative switch, `--color-link`); (2) `--color-muted-strong` with 16/24 Medium pills; (3) `--color-muted` with a 40 Light number + a dashed verdict bar (computed from `articles`). Facts row: 20 Medium centred title, 40 Light numbers, 14 `--color-muted-foreground` labels. ≤1100 the cards stack, facts 2×2.
- The "Bagaimana kami menyemak fakta" part was removed from the page because it is not on the canvas (the `howItWorks` data was removed later, 23 Nov 2026).
- **Mobile fixes**: `.about-intro__lead` `flex: none` ≤1100 (flex-basis 700 became a height in a column); `.about-fn-card` `flex: none` ≤700 (the small Four-functions cards collapsed to 48px); `.articles-card` `box-sizing: border-box` (the card overflowed its grid slot by 28px).
- **Hero carousel**: text on the centre slide only (side slides: image only, fade .2s out / .3s in); a 14px tnum `03 / 05` counter in a 60% black pill bottom-right of the active slide (hidden ≤600). The RON95 slide uses a fuel pump photo.

## Phase 5 — Clean-up (21 Nov 2026)

- `global.css`: ~700 lines of dead CSS removed (verified by a pixel-by-pixel screenshot comparison, desktop 1624 + mobile 390, every page).
- No hard-coded hex left except platform brand colours (`.story-instagram` …) and `#000` in `mask-image`. Old `:root` aliases removed; `:root` in `global.css` now holds only layout & motion helpers (`--side`, `--max-width`, `--ease`, `--slide`, `--ease-in-out`, `--duration-page`, `--fade`).
- Media overlays: `--gradient-scrim-media` (hero, left→right), `--gradient-scrim-media-wide`, `--gradient-scrim-bottom` (FlipCard), `--gradient-scrim-bottom-short` (mobile hero), `--gradient-scrim-top`.
- Font weights: all through `--font-weight-*`; no 700. Base `h1–h6` = Medium 500.
- Radius: all through `--radius-*` except `50%` circles.
- Sizes: no `rem`; off-scale font sizes mapped (15→16, 11→12, 27→28, 22→24, 19→20, 12.5→13, 18.5→18). Exception: the 9px agency monogram.
- Form errors (ClaimForm) = `--color-destructive`; AIFA input focus = `--color-ring`; AIFA link hover = `--color-link`. The remaining AIFA reds (toggle, avatar, user bubble, send button) wait for the Tanya AIFA colour decision.

## Motion, lint and accessibility (21 Nov 2026)

- **Motion tokens** (`app/tokens.css`): `--duration-fast` 150ms (hover, colour, press) · `--duration-base` 250ms · `--duration-slow` 450ms · `--duration-page` 1.2s (route transitions only). `--ease-out` cubic-bezier(.23,1,.32,1) = the default for enter/move/reveal · `--ease-in-out` (on-screen morphs, e.g. the menu icon) · `--ease-emphasized` (small CTA arrow nudges) · `--ease-page` (route transitions only).
- **`npm run lint:ds`** (`scripts/lint-ds.mjs`): hex, palette primitives, other icon libraries, Lucide icons without `<Icon>`, `rem`, weights off the scale, fonts other than Manrope, `transition: all`, shadcn default colours. Exceptions: a `ds-allow: <reason>` comment on the same line. Exits 1 on a problem (ready for CI).
- **Contrast:** all text on the 4 pages passes WCAG AA (scanned at runtime against the real background). Tanya AIFA is now `--color-brand-strong` (#C8211C, 5.56:1 with white) — still red, but it used to fail AA at 4.30:1. The Four-functions "/01" numbers = `--color-text-secondary`.
- **Focus:** the social media carousel (`.stories-viewport`) now has a focus ring.

## New-style article card (21 Nov 2026, elevenlabs.io reference)

`components/Articles.js › GridCard`, `.articles-card` in `global.css`.

- Card: background `--color-card`, 1px border `--color-border`, radius `--radius-card` (20), `overflow: hidden`, no shadow.
- Photo: full-bleed on top (clipped by the card radius), `aspect-ratio: 16 / 10`, `--color-muted-strong` background while the image loads.
- Verdict pill on the photo: solid white `--color-card`, 16px from the edge, padding 8/12; the text stays 13 Semibold UPPERCASE in the verdict colour.
- Agency avatar: bottom-left of the photo, 16px from the edge.
- Body (`.articles-card__body`): padding 20/24/24 (mobile 16/20/20), gap 8; 20/26 Medium title (mobile 18/24); 14 **Medium** date `--color-muted-foreground`.
- Hover (fine pointers only): photo zoom 1.03 (`--ease-out`), border → `--color-border-strong` (`--duration-fast`). Keyboard focus: a ring on the card (`:focus-within`).

## Decisions 21 Nov 2026

- **Follow `design.md`**: social media cards are now plain black (platform gradients removed); meta text (card dates, `.fc-meta`, `.story-meta`, `.post-meta`, logo card meta) = Medium 500.
- Tanya AIFA = `--color-brand-strong` (kept).
- Scope: the website only — CMS & extension dropped from the plan. (Reversed on 25 Nov 2026: the design system now serves both.)

## Update 21 Nov 2026 (afternoon)

- **Semakan fakta terkini:** the "Lihat lagi" button removed.
- **Logo:** the `/logo` page removed. The Logo section in About us has `id="logo"`; the Tentang Kami › Logo menu item → `/about-us/#logo`. `PageTransition` now lands on the `#hash` after the transition (it always went to the top before).
- **Article card:** the border is now `--color-muted-strong` (a soft hairline); **no hover on the border** — hover is only the 1.03 photo zoom.
- **About us, section 2 (About):** label + lead, three cards (story, agency pills, statistic + Palsu/Penjelasan/Makluman verdict bar) and a facts-in-numbers row. The top-left label is **plain eyebrow text** (14 Medium, `--color-muted-foreground`), not a pill.
- **Four functions:** autoplay every 5s (`AUTOPLAY_MS`); stops on hover or focus, when the tab is hidden, and no autoplay under `prefers-reduced-motion`. A manual choice restarts the timer. `aria-live` is `polite` only when the user is in control.
- **Social media gallery** (`components/Stories.js`, `.social-gallery`), replacing the slider:
  - 5 cards in a row (Instagram, Threads, X, TikTok, Facebook), 560 tall, gap 8, `--radius-lg`. The open card `flex-grow: 4`, folded cards `1`. Hover / focus / tap opens a card.
  - Motion: width 600ms `--ease-out`; photo 1.1 → 1 in 800ms; folded cards dimmed `brightness(.5)` (hover .7); text rises 12px + fades in after 180ms, leaves in 150ms with no delay; the platform icon returns after 300ms.
  - A new `--gradient-scrim-card` scrim so white text reads over busy photos/infographics.
  - Folded card: platform icon only. Open card: platform badge + date, 28/34 title, 2-line summary, white CTA pill "Buka di {platform}" (44px, press `scale(.97)`).
  - Mobile (≤700): a vertical column 720 tall; summary hidden. `prefers-reduced-motion`: no transitions.
  - The `stories` data now has an `image` + `alt` for every card; Facebook added (link to the Facebook page). The video/embed player removed — the CTA opens the original post.

## Update 21 Nov 2026 (evening)

- **About us gallery** (`components/SphereGallery.js`, `.sphere-*`): a 3D sphere of round photos (a port of SphereImageGrid), replacing the grid/accordion.
  - 36 nodes (6 gallery photos repeated) on a Fibonacci sphere, seeded jitter (no `Math.random`, SSR-safe). A square stage up to 960px; radius 0.4×, nodes 0.18× the stage size, scaled by depth + distance from the centre, overlapping nodes shrunk.
  - Motion written straight to the DOM from one rAF loop (no React re-render per frame); stops when off-screen.
  - Auto-rotates ~7°/s and keeps rotating on hover (as in the original code); stops only on keyboard focus, drag, an open dialog or `prefers-reduced-motion`. Drag (pointer capture after 4px) with momentum (decay .94); a drag does not open a photo. Touch: `touch-action: pan-y` — a horizontal swipe rotates, a vertical one scrolls the page.
  - Nodes: round buttons, 2px white 20% border, `--shadow-float`; hover (mouse) scale 1.2, press .97, focus outline `--color-ring`.
  - Click/tap → a native `<dialog>`, **photo only, no text box** (alt = caption), 44px close button with an X icon; Esc/backdrop closes. Enter: opacity + scale .96 → 1, 300ms `--ease-out`; backdrop 200ms. Reduced motion: fade only.
  - Hint 14/20 `--color-muted-foreground`: "Seret untuk memutar, pilih foto untuk membesarkan."
- **Social media gallery — folded cards** (`.social-card__tint`): back to how they were before the elastic gallery — an ink panel with the platform's colour gradient (Instagram, Threads, X, TikTok, Facebook; `ds-allow: platform brand colour`) and a 48px platform icon in the centre (32px ≤700). The photo shows only on the open card.
  - Open: the tint fades in 250ms `ease`, the icon fades + scales .8 in 120ms. Close: the tint and icon return after 250–300ms, once the row has settled. Hover (mouse) on a folded card: tint brightness 1.35.
  - This departs from the design.md decision "no gradients on cards" at the owner's request (21 Nov 2026).

## Scroll motion — heading line reveal
`components/ScrollMotion.js` (installed on Home, About us, article detail). Headings in the `lineBlocks` list are split per line (GSAP SplitText, `mask: 'lines'`) and rise from `yPercent 100` to 0: 0.9s, `power4.out`, stagger 0.08, once only when the top of the heading reaches 85% of the viewport. Each line mask gets .14em/.2em padding (with the same negative margin) so tall letters and descenders are not clipped; after the animation the split reverts to plain text. Body text, cards and data do not move. `prefers-reduced-motion` turns it all off. Screen readers get the full `aria-label` from SplitText. (Replaced by `PageEnter.js` on 23 Nov 2026, see below.)

## New pages (21 Nov 2026)
- `/submit-claim/` (`app/submit-claim/page.js`): a direct visit (a shared link, a new tab) gets a "Lapor berita tular" page and the `ClaimForm` pop-up opens by itself. A click inside the site still opens the pop-up without navigating.
- 404 (`app/not-found.js`): header + footer, eyebrow "Ralat 404", display title, two ways out (Utama filled, Artikel outline). Style `.page-notice`.

## MEDIUM audit fixes (21 Nov 2026)
- **Section titles:** one role for every page (`.latest-checks__title`, `.activity__title`, `.about-title`, `.about-fn-title`, `.logo-kit-title`): 28 → 36 fluid, weight 500, left-aligned. The Display H1 is 500 too. Subtitles inside a section (`.about-subtitle`) 24/32.
- **Heading outline:** the hero carousel has `<h2 class="sr-only">Semakan fakta pilihan</h2>` so the H3 slides do not skip a level.
- **Semibold (600)** only for verdict labels (and the logo wordmark). Eyebrows, badges, footer headings, AIFA labels, AIFA result titles, form titles: 500. `b, strong`: 500 (a broken `…semibold)er` declaration fixed).
- **One filled button per screen:** Logo/Icon downloads are now `variant="outline"`. The header button "Salur Kepada Kami" is outline on Home only (the hero "Semak" is the main action there); other pages stay filled.
- **Brand red** is no longer used as text (WSIS eyebrow → `--color-muted-foreground-inverse`). Tanya AIFA stays red (open decision #4) but without the red glow and without the jump: `--shadow-float`, slightly darker hover, press scale .97.
- **The WSIS poster** (`img[src*="wsis"]`) uses `object-fit: contain` on `--color-card` so the poster text is not cropped.
- **"275 juta+" photo card:** a 20% layer + a gradient scrim on the top half only (60% → 45% → 0 at 80%). Measured on the real pixels: caption ≥ 4.75:1 (desktop) / 5.32:1 (phone) at the brightest point.
- **Sphere gallery:** an invisible hit area ≥ 24 px on screen (`--node-hit` from JS, `.sphere-node::after`).

## "Cara Sebenarnya.my membantu" section (Home, before social media activity)
`components/KenaliSebenarnya.js`, styles `.kenali*` (formerly `HowItWorks.js` / `.how*`) in `app/global.css`. A 3-column bento grid (`grid-template-areas`):
channels | tall photo (3 rows) | four verdicts · photo story | photo | "24 jam" stat (2 rows) · agencies | photo | stat.
Tablet (≤1024) 2 columns, phone (≤600) one column. Card gap `--spacing-20` (phone 12), card padding 32 (phone 24), radius `--radius-card`.
- Reading cards: taupe `--color-muted` background, no shadow. One ink card (stat) with a large weight-400 number + a half-size unit (the same scale as the viewership statistics).
- Photos: full-bleed, hover zoom 1.03 (pointer only). White captions on a bottom scrim (80% → 55% → 0), measured ≥ 6.4:1 at the brightest pixel at 1440/768/390.
- Verdicts use the `Verdict` component (dot + word). Lucide icons in a 48 canvas disc.
- The section title uses the shared section-title role (`.how__title`). Animation: the title rises line by line; cards enter through ScrollMotion with an uneven 60–300 ms stagger; `prefers-reduced-motion` turns it off.
- Adapted from the BentoGridShowcase example (Tailwind/shadcn/framer-motion): layout only; no new dependencies.

## Logo section — format folder (About us, last before the footer)
`components/LogoKit.js` + `components/FormatFolder.js`, styles `.logo-kit*`, `.logo-card*`, `.folder*`, `.logo-terms*` in `app/global.css`. Design from the Wonder canvas ("Logo Kit Section").
- Layout: centred title + intro; a 2-column grid (gap 32; one column ≤900) — `--color-muted` cards, radius `--radius-lg`, padding 32 (phone 20): 36/42 title (28/34 phone) · 16 description · 14 meta → preview (logo 356×107 / icon 134×134, centred) → format folder. A "Terma penggunaan logo" box below (`--color-border`, radius `--radius-card`, padding 32, 16/21 text, 56 top margin).
- **Folder:** drawn on a 391×286 stage and scaled to the card width with a unitless ratio from a container query (`tan(atan2(100cqw, 391px))`) — no JS resize. Back plate `--color-folder-back`, front pocket `--color-folder-front` (edge `--color-folder-edge`), mini icon pill `--color-folder-pill`. Three 101×101 tiles (JPEG, PNG, SVG; file icons in `public/images/formats/*.svg`) at the canvas positions. Colours follow the Logo Kit Section canvas: pocket `rgb(71 67 64 / .95)`, pill `#766e69`, chip text `--color-accent`; card padding 48, 64 between parts, terms card `--color-muted`. New tokens in `tokens.css`: `--color-folder-*`, `--gradient-tile-jpeg/svg`, `--color-tile-png`, `--color-tile-svg-mini`, `--shadow-tile` (tile shadows follow the canvas — an exception to "elevation from tone").
- Downloads: PNG / SVG / JPEG chips (`<a download>`, aria-label "Muat turun Logo (PNG)"). Files: `logo.*` and `icon-download.*` in `public/images/logo/`. **JPEG** = white background. **The SVG still wraps a PNG** (not vector) until the original vector artwork is supplied.
- Motion (from the pasted IconFolder component, original values): enters once when 30% visible — the card rises 34 px + scale .92 → rest in .9s `cubic-bezier(.2,.8,.2,1)`, tiles follow with a .35s delay + .08s each. Spread: mouse hover, tap, or keyboard focus on a chip → the card rises 6 px + scale 1.02, the pocket drops 6 px, tiles spread 10.5 px × distance from the centre, rise 4 px, tilt ×1.2 (.6s, .04s delay each). Hovering one tile: it rises 26 px, scale 1.1, the other tiles scale .96 + saturation .75 / brightness .85, the format label appears and the matching chip is highlighted. A small departure: after the entrance (1.6s) hover no longer uses the .35s delay, so it responds immediately. Chips: `:active` scale .97, `:focus-visible` white outline.
- `prefers-reduced-motion`: no entrance, no movement (the tiles keep their original tilt).
- The tiles are decoration (`aria-hidden`); the real controls are the download links.

## One type hierarchy (21 Nov 2026)
- Maximum size 48px (the page H1). Roles: display 48 · section 36 · heading 24 · title 20 · lead 18 · body 16 · small 14 · eyebrow 13; statistics 48. Tablet/phone step down through tokens (`app/tokens.css` › Type roles). `body` is now 16 (it was 20 and leaked into elements without a size).
- 63 ad-hoc size declarations removed from component classes; sizes now come from the "Type roles" block at the end of `app/global.css`. A new component: pick a role, never write its own `font-size`.

## Social media logos + preview pop-up (Home › Cara Sebenarnya.my membantu)
- `components/SocialPeek.js`: a row of platform logos (Instagram, Threads, X, TikTok, Facebook; Simple Icons from `socialLinks`), 48px canvas buttons, ink hover.
- Pressing a logo → a modal `<dialog>` (`showModal`): 60% black backdrop, white panel `--radius-card`, enters with opacity + scale .96 (200–250ms). Content: platform badge + date, title (heading role), summary, outline button "Buka di …", 9:16 media on the right.
- Media: local `video` (Instagram) → the platform's official `embed` (Threads, X, TikTok; loaded only when the pop-up opens) → a cover image (Facebook, page link). Data in `stories` (`data/content.js`).
- Escape, the close button and a backdrop click close it; focus returns to the logo that opened it. Phone: one column, media 48dvh.
- The verdict cards in this section are now three only: Palsu, Makluman, Penjelasan (type `benar`).

## WSIS moved into "Cara Sebenarnya.my membantu" (21 Nov 2026)
- **The WSIS poster** (`/images/bento/wsis-prize-award.webp`, square) sits in the left-middle card (`story` area, formerly the elderly-people photo), `object-fit: contain` on `--color-card` + a `--color-border` hairline: the trophy and the poster text are never cropped. Card min 300px tall (poster ≈300px on desktop); phone: a square card. The tall middle card stays the "Tanya sebelum kongsi." photo.
- The ink card (formerly "24 jam") is now **Juara Dunia**: 13 UPPERCASE eyebrow + trophy icon, section-role title (36/400, phone 28), one line of context (lead, white 60%), `media` button "Ketahui lebih lanjut" → `/about-us/#berita-galeri`. The full text stays in About us › Berita.
- The WSIS banner (`components/Bento.js`) and its styles removed; "Aktiviti media sosial terkini" is now the social media gallery only.

## Sections removed + language review (22 Nov 2026)
- Removed: **Empat fungsi utama kami** (About us; the `whatWeDo` data, component and styles) and **Aktiviti media sosial terkini** (Home; `components/Stories.js` and the `.activity` / `.social-card` styles). The older notes about both above are history only. The social media preview stays through the logos in the "Ikuti kami" card (`SocialPeek`). The `.about-fn-controls/-arrows/-track` classes stay because Berita dan Galeri uses them.
- Language: all interface text in standard Malay (MCMC site terminology as reference). Fixed: "Temukan" → "temui", "tangkap layar" → "tangkapan skrin", "Terbaru/Terlama dahulu" → "Terkini/Terawal dahulu", "nak"/"jumpa" → "hendak"/"menemui", "Semak Tentang Kami" → "Ketahui tentang kami". "dari" only for place/time, "daripada" for sources.

- **About us hero (22 Nov 2026, following Wonder › About Hero Section):** new image `public/images/about/hero-2026.jpg` (glass tower, 1600w, from 3276×4096) with `filter: brightness(.66)` (= a 34% black layer) + a scrim from the bottom (60% → 40% → 0 at 65%) behind the title and paragraph; measured at the brightest pixel: paragraph ≥ 6.9:1, title ≥ 3.4:1. Title max 12em (2–3 lines), paragraph max 47em. Type and spacing follow the site roles (display 48, body, label), not the Wonder values (40/20/24).

## News (About us) + statistics (22 Nov 2026)
- **News, desktop:** the large card on the left = the active story; the small cards on the right = the next in line. On advance (5s autoplay / ›) the next story's content enters the large card from the right and each small card shifts one slot left (`news-in`: translateX 40px → 0 + opacity, 380ms `--ease-out`, 50ms stagger). ‹ reverses the direction (`data-dir="back"`). Card sizes do not change (480×488 large). Reduced motion: fade only.
- **News, phone (≤700):** only the large card shows; autoplay loops endlessly (WCAG 2.2.2: the pause button stays).
- **Numbers:** `components/CountUp.js` is used on Home (statistics) and About us (facts + "20+"): counts from 0 when entering the viewport (2s ease-out expo), width locked and tabular figures only while counting; afterwards proportional figures + `--text-stat--letter-spacing` (−0.02em) so "1,016" is not loose. Reduced motion: the final value straight away.

## Kenali Sebenarnya.my: name and the Juara Dunia card (22 Nov 2026)
- Component `components/KenaliSebenarnya.js`, classes `.kenali` / `.kenali__*` (formerly `HowItWorks` / `.how`). The grid areas now follow the content: `channels · photo · visitors · poster · award · social` (formerly `main · story · stat · agencies`).
- Juara Dunia card: eyebrow → "Juara Dunia" (section role, 400) → sub "dalam Kepercayaan Digital & Semakan Fakta Awam" (title role 20/500, white) → full paragraph (body 16, white 60%) with the facts **33 juta rakyat** and **lebih 20 agensi persekutuan** in white 500 `<strong>` → button "Ketahui lebih lanjut".

## Spacing + type roles extended to modals, forms, menus and the footer (22 Nov 2026)
- **Lapor form (modal):** a large card: padding `--pad-card` (top/bottom) × `--pad-card-lg` (sides); fields `--gap-group` (16) for rows and columns; title → description `--gap-text`; the drop zone, files and "Saluran aduan lain" `--pad-card-sm` + `--radius-media`; the "sent" view `--pad-card-lg`. Phone: `--pad-card-sm` throughout.
- **AIFA panel:** header `--pad-card-sm`, avatar ↔ title `--gap-inline`; the panel title now uses the title role (20/500), like the Lapor form title; messages and results `--gap-cards`, bubbles `--radius-media`; suggestions can wrap (no overflow out of the panel on phones).
- **Preview pop-up:** the badge uses `--space-badge-x` / `--space-inline-tight`; room for the close button on phones = `--size-control` + `--gap-inline`.
- **Kongsi menu + phone menu:** follow the dropdown menu roles: padding `--space-inline`, radius `--radius-menu`, items `--space-field-x` on the sides with the control height.
- **Footer:** blocks `--gap-block` (24 → 40 fluid), column title → list `--gap-group` (16), between links `--gap-cards` (16 → 24 fluid).

## Verdicts standardised: Palsu · Makluman · Benar (22 Nov 2026)
- Only three verdicts exist: **Palsu** (`palsu`), **Makluman** (`makluman`), **Benar** (`benar`). The label "Penjelasan" is now **Benar** everywhere (Articles filters, flip cards, Kenali Sebenarnya.my cards, badges). The `penjelasan` alias removed; an unknown type falls back to `makluman`.
- **Waspada removed** from the system: no more `--color-verdict-waspada(-dot)`, `.ui-verdict--waspada`, `.ui-chip--waspada`, `.fc--waspada`. The `--color-orange*` primitives stayed in the palette with no verdict role (removed later, 23 Nov 2026).
- Older notes above that mention Waspada / "Penjelasan" as a verdict label are history only. The article section title "Penjelasan rasmi" and article titles are not verdict labels and stay.

## Articles card grid (22 Nov 2026, following Wonder › Container)
- **Fluid grid:** `repeat(auto-fill, minmax(max(min(100%, var(--media-min) + 2 × --cell-pad-x), 25% − 1px), 1fr))` with `--media-min: 320px` → 1 column on phones, 2 (tablet, ≈768–1100), 3 (laptop, photo ≈350–440 at a 420 × 230 ratio), 4 (≥≈1520); never more than 4.
- **Continuous hairlines** between columns and rows: each cell draws a right + bottom `--color-muted-strong` line; the `.articles-results` wrapper (overflow hidden) + negative margins hide the outer edge lines. Cell padding: `--cell-pad` top/bottom `--gap-block` (24 → 40 fluid), `--cell-pad-x` left/right `--pad-card` (24) so photos are wider; phone `--pad-card` top/bottom, no vertical lines.
- **Open card** (no background/border): a 42:23 photo (420 × 230) radius `--radius-card` with the agency logo inside (bottom-left); under the photo a meta row `Verdict tint · date · N minit bacaan` (caption 12, smoke), then the title (title role). Hover: photo zoom 1.03.
- **`Verdict` variant `tint`** (new, `app/ui.css`): a 28px pill on the verdict colour at 22% over white.
- **Reading time:** `readingMinutes()` (`lib/articles.js`): words of the title + lead + explanation ÷ 200, minimum 1.

- **Language picker (22 Nov 2026):** no more flags. The button shows the language code (`BM` / `EN`, label role 16/500) + a chevron; the menu lists the codes only, without a "Bahasa" title (3 × `--size-control` wide). The full name stays in the accessible name ("BM — Bahasa Melayu"). `public/images/flags/` removed.

- **Visitors card, Kenali Sebenarnya.my (22 Nov 2026):** replaces the "Tiga jawapan yang jelas" card (`.kenali__card--visitors`, grid area `visitors`). Title "Lebih 130 pengunjung setiap hari" (title role, the number uses `CountUp`). Below it, pinned to the bottom of the card like the channels card icons: four overlapping round avatars (`--size-control` 44, 12 overlap, 2px ring in the card colour) + "menyemak fakta bersama kami" (body-sm, secondary). The avatars are cropped from existing carousel photos → `public/images/avatars/visitor-1…4.webp` (96 × 96, decorative, `alt=""`).

- **Home H1, rotating verdict (22 Nov 2026, updated):** the second line "Semak dakwaan **palsu**" (lower case). The word rotates palsu → benar → makluman with a letter-by-letter 3D flip (`components/FlipWord.js`, Web Animations API). **Transform only:** the new word enters the layout once; its letters roll in from below (rotateX −90° → 0) while the old word, laid over it, rolls out (0 → 90°). The word sits in a slot as wide as the longest word (an invisible copy `.flip-word__ghost` stacked in one grid cell), so "Semak dakwaan" stays put and the word grows to the right; the line is centred on "makluman". On phones (the word on its own line, centred) the word glides to its new centre with FLIP. Timing: 700 ms per letter, 40 ms apart, `cubic-bezier(0.2, 0, 0, 1)`; hold 2.2 s. Stops when the tab is hidden / off-screen; reduced motion = switch without the flip. The same weight as the rest of the H1 (display), ink. Screen readers: "Semak dakwaan palsu, benar atau makluman". Phone (≤600): the verdict on its own line. The H1 entrance = a transform + clip-path tween on the line spans (not SplitText).

- **About us, 22 Nov 2026:** (1) The News marquee has no pause/play button any more (`.marquee__bar`, `.is-stopped` removed); hover still pauses, reduced motion still stops it and allows manual scrolling. (2) Logo cards without visible text: the name, description and file meta removed; the name stays as an `h3.sr-only` for screen readers. Card = preview + format folder, padding `--pad-card-lg`, gap `--gap-group`; the preview has no `min-height`: file height + `--pad-card` top/bottom, so the space above the logo ≈ the space below it (desktop 60/63, phone 48/51). The folder title follows the card: "Muat turun logo" / "Muat turun ikon" (`folderTitle` in `logoPage.items`, falls back to `formatTitle`). Desktop: a 2-row subgrid so the preview and folder line up across both cards.

- **Format folder, text follows the roles (22 Nov 2026):** the folder is drawn on a 391 px stage and scaled to the card width (`--s`), so its text used to scale too (title ≈ 26 px desktop / 16 px phone, chips ≈ 18 / 11 px). Now the title + chips sit in `.folder__text`, scaled back with `scale(1 / --s)`: title = the **title** role (20, fluid 18 on phones), chips = **label-sm** (14) with a 14 download icon, title → chips `--gap-group`, between chips `--space-inline-tight`. Positions (34 / 18 from the pocket corner) stay in stage units.

- **22 Nov 2026:** (1) H1 verdict flip: the flip stays 700 ms / 40 ms apart; the dwell between words shortened 2.2 s → 1.2 s. (2) The "Semakan fakta terkini" section now uses the same head as Kenali Sebenarnya.my and Berita: a centred title "Semakan fakta terkini" + a one-line lead "Setiap jawapan disahkan terus oleh kementerian dan agensi berkaitan." (`.latest-checks__head`, lead = body role, secondary).

- **AIFA info cards, About us hero (22 Nov 2026):** `.about-hero-aifa` placed `position: absolute` top-right of the hero card with the same inset as the "Ikuti kami" block (top `--spacing-56`, side `--spacing-40`), width `min(330px, 34%)`, gap `--spacing-12`. Two `.aifa-card`s: media (`--color-card` background, padding 8, a 16:9 area radius `--radius-media` + a body-sm secondary caption; currently the poster `berita-aifa.jpg`, replace the `<img>` with an Instagram video embed in `.aifa-card__media`) and info (`--color-muted-strong` background, 16/500 label title, body-sm secondary text). Hover lifts 2px; off under `prefers-reduced-motion`. ≤1100px (tablet + phone) the cards are hidden. Text in `aboutHero.aifa` (`data/content.js`). The card title is a `<p>`, not an `<h2>`, because it comes before the `<h1>` in the DOM.

- **AIFA card, About us hero (22 Nov 2026):** the image replaced by the AIFA reel video (`public/images/about/aifa-reel.mp4`, 1276×718, 58 s) — `autoplay muted loop playsInline`, poster `aifa-reel-poster.jpg` (also the fallback background). The whole frame links to the Instagram reel (new tab, label "Tonton video AIFA di Instagram"). Reduced motion: the video hidden, the poster shown.

- **22 Nov 2026:** (1) The AIFA info card (About us hero) now has a graphite `--color-text-secondary` (#44403B) background: white title 10.3:1, white 80% text 7.3:1. (2) Header: `min-height: 72px` removed — with content-box sizing it was added on top of the 16 padding (a 104 px header). Height now = logo + 16 top/bottom = 86 px.

- **Mobile & other fixes (22 Nov 2026):**
  - **Salur Kepada Kami form (mobile):** links in the compact menu now close the menu (the form opens without navigating, and a same-page #hash link does not change the route, so the menu used to stay open behind the form).
  - **About us AIFA hero:** hidden ≤1100px (tablet + phone; it was ≤600, and 601–900 went into the flow).
  - **All pause buttons removed:** the Home hero carousel (`.gctl .play`) and the "Semakan fakta terkini" row. The carousel still stops on hover/focus/drag; reduced motion stops it.
  - **Close (X) buttons without a blue ring on open:** dialogs (form, social preview, sphere photo) now focus themselves (`tabIndex={-1}` + `dialog.focus()`, `dialog:focus { outline: none }`), so the close button does not open with a focus ring. Tab still shows the ring as usual.
  - **Fluid logo cards:** grid `auto-fit, minmax(min(100%, 320px), 1fr)` (2 columns from ≈700px), folder max 480px centred; folder ≤340px (container query): tighter chips, title → chips `--gap-text`, the small icon pill hidden — the chips stay on one line inside the pocket down to 320px.
  - **Articles:** the category chip bar arrows hidden ≤600px (swipe only).
  - **The Home H1 is always two lines** (phones too): each line `nowrap`, size = `min(--text-display, (100vw − 2 × --side) / 12.8)` (≈12.3em per line), so 22.5px @320, 28px @390, 39px @768, 48px desktop. The verdict is no longer on its own line on phones.

- **Fluid section rhythm (22 Nov 2026):** `--space-section` is now `clamp(64, 40.8px + 6.188vw, 120)` (it was steps of 96 · 64 · 48) and `--gap-block` `clamp(24, 17.37px + 1.768vw, 40)` (it was a fixed 40), so the space between sections ≈ 3× heading → content at every width. The `--space-section` breakpoints at ≤1024 / ≤600 removed. "Semakan fakta terkini": head → content `--gap-block` (was 48), card rail `--gap-cards` (was 24). Dead `.latest` rules removed.

- **Format folder, mobile (22 Nov 2026):** the mini icon pill (`.folder__pill`, tokens `--color-folder-pill`, `--color-tile-svg-mini`) removed. The chip download icon stays Lucide `Download` 14px (`Icon`). The stage scale (`--s` = card width / 391) is now measured with a `ResizeObserver` in `FormatFolder.js` and written as an inline style; `tan(atan2())` is used only where the browser supports it (`@supports`), with a fallback `--s: .85`. Before this, Safari without `tan(atan2())` did not compute the scale and the folder was cropped. The note above about the "unitless ratio from a container query" is now only the supported path, not the only one.

- **Heading weight + card gap (22 Nov 2026):** every heading is now 500 (the Display H1, carousel slide titles and the award were 400); heading blocks read the role's `--text-*--font-weight`, hand-written weights removed. `--font-weight-display` (400) is now for statistics only. `--gap-cards` `clamp(16, 12.69px + 0.884vw, 24)` (was 12); also used by the footer link lists, the AIFA log and the viewership statistics.

- **Four breakpoints, z-index layers, reading widths (22 Nov 2026):** only `max-width` 1280 · 1100 · 900 · 600 are allowed (`lint:ds` › `breakpoint`). Old values mapped upward: 1024 → 1100 (agencies, Kenali grid, About us hero AIFA cards), 768 / 760 / 960 → 900 (agencies, hero lede, viewership, sneak-peek pop-up), 700 / 480 → 600 (hero carousel, AIFA panel). Older notes in this document that say ≤1024, ≤960, ≤768, ≤760, ≤700 or ≤480 now refer to those new breakpoints. Layers: `--z-sticky` 10 header · `--z-dropdown` 20 menus / share · `--z-overlay` 30 · `--z-floating` 40 Tanya AIFA · `--z-skip` 50 skip link; inside a component only −1…5 (`lint:ds` › `z-index`; agency logo hover is now 5). Reading widths: `--measure-text` 68ch (`.post-subtitle`, `.logo-terms__body`), `--measure-head` 720px (the Semakan fakta terkini and Kenali heads).

- **Home H1 on phones larger than the H2 (23 Nov 2026):** ≤600px the H1 lines may wrap (3–4 lines: "Tidak pasti? / Jangan kongsi / Semak / dakwaan <verdict>"); only the "dakwaan + verdict" group (`.hero-title__verdict`, `nowrap`, ≈9.2em including a slot as wide as "makluman") never splits. Size `min(--text-display, (100vw − 2 × --side) / 9.6)`: 30px @320, 32px @360, 32.3px @390, 33px @430, so always larger than the H2 (28) and the group always fits the content width (measured in Chrome, no overflow). >600px stays two `nowrap` lines as before (the note above "always two lines" now applies to >600px only).

- **Kenali poster card, phone (23 Nov 2026):** ≤600 the card stays square (`aspect-ratio: 1`) without the 300 `min-height`. The combination forced the card to 332px wide at 320 (content 288) and the page could be pushed sideways. Now no overflow at 320 / 390 / 600 (measured in Chrome).

- **Details: focus, icons, avatars, motion, borders (23 Nov 2026):** one focus ring `--focus-ring-width` 2 · `--focus-ring-color` · `--focus-ring-offset` 2 (on photos / dark surfaces `--focus-ring-color-inverse`); the old 3/4px offsets are now 2. Icons by name `<Icon size="sm|md|lg|xl|display">` = 14 / 16 / 20 / 24 / 40 (`--size-icon-lg` 18 → 20: search, field and social logo icons; form done icon 28 → 24). Avatars `--size-avatar-sm` 32 (was 30 / 36) and `--size-avatar` 40 (was 44 on the flip card), the logo inside at `--avatar-inset` 4. Motion: `--duration-fast` 150 · `base` 250 · `slow` 450 · `slower` 700 (new) + `--ease-*`; the logo folder choreography stays `ds-allow`. Borders `--border-width` 1 / `--border-width-hairline` .5. `lint:ds`: `raw-motion`, `focus-ring`, `raw-border`, `icon-size`.

- **Home H1 on phones, four fixed lines (23 Nov 2026, replaces the "larger than the H2" note above):** ≤600px the H1 is always "Tidak pasti? / Jangan kongsi / Semak dakwaan / <verdict>". Each part is a `.hero-title__part` (block, `nowrap`); the verdict on its own line, centred (`.flip-word` grid, the row `justify-self: center`), and FlipWord glides it to the new centre when the word length changes. The widest line "Semak dakwaan" ≈7.5em, so the size `min(--text-display, (100vw − 2 × --side) / 7.8)` = 32px from 320 (36px @600), always larger than the H2 (28–30). >600px stays two lines. `.hero-title__verdict` removed. Also: a duplicate `--size-icon-xl: 20px` token removed (now 24 only).

- **PR #12 review fixes + colour audit (23 Nov 2026):**
  - **Sphere vs Tanya AIFA:** `.sphere-stage` is now `isolation: isolate`, so the nodes (inline z ≈1000) stay inside the stage and no longer cover the AIFA button (`--z-floating` 40). Tested in Chrome at 320 / 390 / 1440.
  - **Viewership** goes to one column at ≤1100 (was ≤900; at 901–960 the left column was only ≈200px).
  - **Motion:** `--duration-slower` 700 → 600ms, the ceiling in `design.md` (150–600ms): hover photo zoom, carousel scrim, flip open, scroll reveal.
  - **Text colour hierarchy** (ink = headings, graphite = paragraphs/leads, smoke = meta): the About us lead and the logo terms card body are now graphite (titles stay ink); the description under the Home statistics is now smoke 16 (as on About us; a dead Light weight removed); About us chart labels smoke; the "· MCMC" agency on the back of flip cards smoke; hero lede weight 400 (was 500).
  - **Tokens by role:** `--color-surface-inverse` (graphite, the AIFA info card background, formerly a text token), `--color-text-secondary-inverse` (white 80%, body text on dark, graphite's twin; `--color-muted-foreground-inverse` 60% is smoke's twin), `--color-folder-chip` (folder chip text, formerly `--color-accent`, which is a surface token).
  - `.fc-avatar--sm`: a transparent `outline` so the ring survives forced colours. `design.md`: Lead = Graphite (it said Smoke).

- **Motion: one entrance per page (23 Nov 2026):** `ScrollMotion.js` (GSAP ScrollTrigger + SplitText + IntersectionObserver, ±20 elements appearing on scroll) replaced by `PageEnter.js` (Web Animations API, no GSAP). Only the page head enters on load, 100ms apart: Home = the hero H1 line by line from a mask (`--duration-slower` 600ms) → lede → search; About us = the hero card; Articles = title → subtitle → meta. Each part: opacity + 4px blur + 12px rise, 300ms `--ease-out`; `fill: backwards`, so everything is visible without JS. Reduced motion: no entrance. Dead CSS `.motion .reveal`, the `.split-line` mask and `.about-subtitle` removed. `design.md` (MOTION) now allows this form; the logo folder pop-in stays as a component choreography.
- **Logo folder download chips = small buttons (23 Nov 2026):** they were label-sm 14 + a 14 icon, 31 tall, padding 12. Now the `ui-btn--sm` spec: `--text-label` 16/500, `md` 16 icon, height `--size-control-sm` 36, padding `--space-control-x-sm` 16, gap `--gap-inline` 8 (label↔icon and between chips). The title "Muat turun …" stays `--text-title` (18→20), so the chips read as its actions. Folder ≤340: padding 12; folder ≤300: icons hidden so the three chips stay on one line inside the pocket (the title already says "Muat turun", the chips' accessible names name the file). Measured in Chrome 320–1440: one line, inside the pocket.

- **Home H1: the verdict is now a Typewriter (23 Nov 2026, replaces the letter-by-letter 3D flip):** `components/Typewriter.js` (replaces `FlipWord.js`). The cycle: hold 2.5s → delete letter by letter (backspace, 40ms) → pause 400ms → type the next word (80ms ± 30ms per letter, so it feels typed by a person): palsu → benar → makluman. A text caret (`.typewriter__caret`): a thin .06em × .82em bar in the heading ink; blinks 530ms on / 530ms off (the OS rate, `step-end`) only while the word rests, solid while typing / deleting (`data-busy`). A slot as wide as "makluman" + the caret (an invisible copy in one grid cell), so "Semak dakwaan" and the H1 height never change; on phones the slot is centred on its line and the word is typed from the start of the slot. The first word is in the server HTML. Stops when the tab is hidden / the hero is off-screen. Reduced motion: no typing, the whole word switches after each hold, the caret does not blink. Measured in Chrome 320 / 390 / 1440: the right sequence, a solid caret while typing, no layout shift, no overflow.

- **Focus = ink, not blue (23 Nov 2026):** `--color-ring` and `--color-link` are now `--color-foreground` (they were `--color-blue` #3A46F5, the "violet spark"). This one token changes every focus state: the search bar (`.ui-search:focus-within`, an ink border + 1px ring), fields, buttons, chips, menus, cards. Dark surfaces / photos use `--focus-ring-color-inverse` (white): `.ui-btn--media` (carousel CTA, award CTA, sphere photo close), carousel slides, the "Ikuti kami" links, folder chips. The AIFA media card stays ink (it sits in a white card). A new base `:where(:focus-visible)` (specificity 0) so elements without their own style (e.g. `<summary>` in Lapor) no longer use the browser blue. AIFA link hover is now ink. Blue stays only for the Makluman verdict dot and the AIFA avatar. Tested in Chrome: Tab through Home (53 stops), About us (51), Articles (58), article detail (35), Lapor (9) — no blue ring; the ink ring on the canvas is 20.5:1.

- **Space above the header (23 Nov 2026):** the skip link "Langkau ke kandungan" (`a.ui-btn.ui-skip-link`) should be `position: fixed`, but `.ui-btn { position: relative }` (later in `ui.css`, same specificity) won, so the invisible link stayed in the flow and pushed the header down 44px on every page. Now `.ui-btn.ui-skip-link` (two classes). The header starts at 0, the logo 16px from the top (header padding 16, as specified). The skip link still appears top-left (8/8) on the first Tab, with an ink ring.

- **Flip card on iOS Safari (23 Nov 2026):** `backface-visibility: hidden` is not enough in WebKit: front-face children with their own layer (the verdict + title block `position: absolute; z-index`, the agency avatar, the flip button) showed through on the back, mirrored ("NAMULKAM", the logo top-left, the title over "Baca semakan"). Now the face turned away is also `visibility: hidden`, switched exactly when the card is edge-on (90°): close (symmetric curve) at 50% of `--duration-slow`; open (strong `--ease-out`) at 13% of `--duration-slower` (79ms, solved from the curve). Measured in Chrome: the switch happens at 94°, one frame after edge-on. Keyboard: focus moves to "Baca semakan" as soon as the back face shows (`FlipCard.js` waits up to ~1s). Reduced motion: an instant switch. Not yet tested on a real iOS device.

- **Design system audit: overlays, menus, spacing and motion (23 Nov 2026):**
  - **One `.ui-modal` recipe** (`app/ui.css`) for the Lapor form, the social preview and the sphere photo: surface `--color-card`, `--radius-card-lg`, `--shadow-overlay` (new token), backdrop `--color-scrim` (new token, ink 60%), enters in 250ms opacity + scale .96 and **leaves** at .98 (a transition, so it can be interrupted). There used to be four styles: raw `rgba(21,22,24,…)` shadows, 55/60/70% backdrops, 450 or 250ms entrances, three of them vanishing instantly on close. The AIFA panel: `--shadow-overlay` + the same 250ms pop, also on exit (`display` allow-discrete).
  - **One `.ui-menu` surface** for the nav, language and Kongsi dropdowns: `--color-background`, border, `--radius-menu`, padding `--space-inline`, `--shadow-float`, a 150ms pop from the trigger edge. The nav dropdown used to have no animation, and Kongsi had a `--color-card` background with a full copy of the CSS in `global.css`.
  - **New tokens:** `--color-surface-media` (behind photos/video, dark hero cards; replaces `--color-black` in FlipCard, the carousel and the About us hero), `--color-scrim`, `--shadow-overlay`. The `palette-primitive` lint now also catches `--color-black`.
  - **Spacing:** gaps between groups/blocks (≥16px) are now roles (`--gap-text/inline/group/cards/block`), not `--spacing-*`; breakpoint overrides that copied the fluid values removed (hero, Semakan terkini, Kenali, Articles, article, footer). A new lint `group-gap-primitive`. Section heads: title → lead `--gap-text` (8); section title → content `--gap-block` (40 → 24) on every page, including Logo (was 72) and "Semakan fakta terkini" on phones (was 32). Display H1 → lede `--gap-group` (16) in both heroes. Measured: 120 between sections (1440) / 65 (390) on every page.
  - **Motion:** route transition 1.2s → a 250ms crossfade; agency logo and AIFA card hover now mouse only (`hover: hover`); carousel dots no longer animate `width` (snap; the fill bar shows progress).
  - **Dead code:** `gsap` removed from `package.json`, empty `@media` blocks, `--fade`, comments without rules.
  - **Phone H1 verdict on the optical centre:** ≤600px the verdict has its own line, so `.typewriter__row` is now `justify-self: center` + `margin-inline-start: .12em` (half the caret and its gap), so the letters of "palsu", "benar" and "makluman" sit exactly on the H1's centre axis (measured 0.0px at 320/390/600). Desktop unchanged (the verdict follows "Semak dakwaan").

- **Home order + logo folder tiles (23 Nov 2026):**
  - **Home:** the "Pusat semakan fakta MCMC sejak 2017" section (`Viewership`) is now last, after Kenali Sebenarnya.my and just before the footer. The rhythm stays 120 (1440) / 65 (390) between every section.
  - **Format folder (Logo):** the JPEG/PNG/SVG tiles are now all white (`--color-tile` = `--color-card`); the colour comes from the file icons. Tokens `--gradient-tile-jpeg`, `--color-tile-png`, `--gradient-tile-svg` removed. `--shadow-tile` softened for white tiles (.5px 8% line + 0 12px 32px 14%).
  - **About us hero H1** checked: it uses the same `--text-display` role as the Home and article H1 (48 / 39 / 32 px at 1440 / 768 / 390, 500, 1.2); lead 16/24 400 like the other leads. Consistent.

- **About us hero: dimmed lead + facts in numbers in one column (23 Nov 2026):**
  - The hero lead (`.about-hero-text p`) is now `--color-text-secondary-inverse` (white 80%, graphite's twin), so title > lead as on other pages. The ≤600 scrim slightly stronger and taller (70% → 50% at 50% → transparent at 80%) because the lead has more lines on phones. Measured on the real photo pixels (the brightest pixel under the text): lead ≥ 6.2:1 from 320 to 1440; H1 ≥ 4:1 (large text, 3:1 minimum).
  - "Beberapa fakta tentang kami dalam angka": `.about-intro__facts-row` is now `flex-direction: column` at every screen size (one fact per row, centred), gap `--gap-block`. The 2-column grid at ≤1100 removed.
  - The hint under the sphere gallery (`.sphere-hint`) is now `text-align: center`; ≤600px two fixed lines: "Seret untuk memusingkan," / "pilih foto untuk melihatnya lebih besar." (two `<span>`s as blocks).

- **The "Agensi rakan" verdict bars (About us) fill once when visible (23 Nov 2026):** `useFillOnView` in `AboutUs.js` (IntersectionObserver, 50% visible, once only). Each Palsu / Benar / Makluman bar is revealed left → right with `clip-path: inset(0 100% 0 0 round …)` → `inset(0)` (rounded ends kept; `scaleX` would squash them), `--duration-slower` `--ease-out`, an uneven 0 / 75 / 135ms stagger. No continuous motion: data being read should not move. Without JS and under `prefers-reduced-motion`: bars full straight away. Tested 1440 / 390.

- **Juara Dunia card (Kenali Sebenarnya.my, Home), 23 Nov 2026:** the "Ketahui lebih lanjut" button removed; the card is now eyebrow, title, subtitle and text only. `.kenali__award-cta` and the unused `Button` / `ArrowRight` imports removed too.

- **Facts in numbers (23 Nov 2026):** one column (one fact per row) only on phones ≤600px. Desktop: one `space-around` row; tablet ≤1100px: a 2 × 2 grid.

- **Fluid "Ikuti kami" (23 Nov 2026):** the social media discs `--follow-disc: clamp(--size-control-sm 36, 29.5px + 1.55vw, --size-control-lg 48)` — 36 @≤390, 41 @768, 48 @≥1200; icon = half the disc (18 → 24). `::before` brings the touch area back to 44 (`--size-hit-area`). The list may `wrap`.

- **Home statistics, optical centre (23 Nov 2026):** the number + description in each `.viewership-stat` card are now centred (horizontally and vertically), `text-align: center`. Bottom padding = `--pad-card` + 24, so the text group sits 12px above the geometric centre (≈5% of the card height), i.e. the optical centre. Photo cards: one flat **35%** black layer (on request; 50–60% was too dark) + a halo on the letters only (`text-shadow` 16px 80% + 6px 70% + 2px 50%). Measured on the 4px background around the letters: p95 ≈ 5.3–6.1:1 (number and description). Brightest pixel: number ≥ 4.0:1 (passes AA for large text, 3:1); description 3.9:1 desktop / 3.05:1 phone — **below AA 4.5:1 at the photo's brightest point**. To pass fully: a 50% layer (≥4.72:1).


## Clean-up for the handover (23 Nov 2026)
Audited with scripts (tokens defined vs `var()` referenced; CSS classes vs real `className` tokens in JS, including dynamic prefixes such as `ui-btn--${variant}`; `@keyframes` vs `animation`; `public/` assets vs paths in the code).
- **Tokens removed (no users):** `--color-grey-62`, `--color-orange`, `--color-orange-dark`, `--color-selected`, `--font-weight-light`, `--shadow-subtle(-2/-3)`, `--gradient-scrim-card`, `--container-page`, `--container-rail`, `--size-icon-xl`, `--size-icon-display`, `--breakpoint-*` (replaced by a reference comment in `tokens.css`: 600 · 900 · 1100).
- **Tokens kept although not referenced yet:** type role sub-tokens (`--text-*--font-weight`, `--text-eyebrow--letter-spacing`) so every role is complete; `--color-brand`, `--spacing-28` (a scale step), `--z-overlay` (the z scale).
- **Dead CSS removed:** the old slider/posts/agencies (`.slider`, `.posts`, `.agencies`, `.agency*`, `@keyframes slideUp/agencySlide`), leftovers of the social media gallery (two unclosed comments that swallowed rules), the About us functions (`.about-fn-*`, `@keyframes about-fn-in/fade`), `.card`, `.fc-dot`, `.verdict-tag`, `.kenali__title-icon`, the `.section-label.big-title` comment.
- **JS/data removed:** `components/ui/filledIcons.js` (no pause buttons any more), the `howItWorks` export, the `paused` flag in `Latest.js`.
- **Assets removed (≈5.9 MB):** 7 unreferenced `posts/sebenarnya-*` photos, `about/hero.jpg`, `about/berita-wsis.webp`, `carousel/hero-ktmb|str|lesen.jpg`, 6 `carousel/human-*.jpg` portraits (the visitor avatars are already cropped into `images/avatars/`), `bento/gold-award-medal.webp`, `public/fonts/inter/` (Manrope only, through `next/font`).
- **UI library kept although unused on the site** (for the CMS + browser extension): `Tabs`, `ButtonGroup`, `Button` variants `link` / `icon-sm` / `icon-lg`, `Badge` `lg`, `Verdict` `single`.
- After the clean-up: `lint:ds` clean, the build passes, no referenced image missing in `out/`, CSS braces balanced.

## Component size scale sm · md · lg (23 Nov 2026, shadcn/ui + elevenlabs.io reference)

Problem: on phones buttons, search, chips and badges felt too large and inconsistent (Button 44, search 56, Verdict 44, Tabs 50, Badge 28/44, and `global.css` wrote 44/48/52/56 by hand).

- **One fluid control scale** in `tokens.css`: `sm` 32→36 · `md` 40→44 · `lg` 44→48 · `xl` 48→56, from 375px to 1280px with `clamp()` (the same formula as the type roles). Desktop stays as before; phones are 4–8px denser. Side padding follows the scale (`--space-control-x-sm/-x/-x-lg`).
- **The 44 touch target stays:** `.ui-btn::after` and `.ui-chip::after` grow to `--size-hit-area` when the control is shorter.
- **Badge scale (fixed, not targets):** `--size-badge-sm` 20 · `--size-badge` 24 · `--size-badge-lg` 32. `Badge` size sm/md/lg; `Verdict` pill = lg 32, overlay/tint = md 24. `.peek-modal__badge` = lg badge.
- **API:** `Button` size sm · md · **lg (new)** · icon-sm · icon · icon-lg. `Chip` size sm · md · lg (new). `Badge` sm · md · lg (lg was 44, now 32). `SearchField` lg (default) · **md (new)** · sm. `Input` / `Select` size sm · md · lg (new). `'default'` is still accepted as md.
- **Nested controls are derived:** the "Semak" button = `search − 2 × (inset 4 + border)`; a tab = `track − 2 × (segment + border)`; the `.fc-read` icon circle = `lg − 2 × 6`.
- **`global.css` now uses tokens:** `.menu-toggle` md, `.fc-read` lg, `.social-peek__logo` + `.kenali__icons` lg, carousel dots lg, `.aifa-toggle` xl (the 52px phone override removed), `.aifa-links a` sm, `.folder__chip` sm with Label/14, `.post-back` hit area.
- Measured at runtime (headless Chrome, 375 / 1280): Button 40 / 44, Chip 40 / 44, Home search 48 / 56 (button 38 / 46), Articles search 40 / 44, Select 40 / 44, Verdict pill 32, overlay/tint 24, Badge 24, `.fc-read` 44 / 48, social logos 44 / 48. Every 40px control's `::after` = 44.

## Hard-coded size audit + wider lint (23 Nov 2026)

- **Press:** every `:active` is now `var(--press-scale)` (.97); it used to be a mix of .94 / .95 / .96 / .97 (`.fc-read`, `.aifa-toggle`, `.about-hero-follow`, `.sphere-node`, `.social-peek__logo`, `.ui-navlink`, `.ui-lang__trigger`).
- **Claim form icon discs:** `.claim-icon` and `.claim-file-icon` = `--size-control` (40→44; the 38px phone override removed), `.claim-done-icon` = `--size-control-xl` (48→56), round `--radius-full`.
- **Dots:** the AIFA typing dots and carousel dots = `--size-dot` (8); the active dot = 4 × dot.
- **Menus:** Kongsi `--size-menu` (220, was 180); the compact nav panel `--size-menu-lg` (260, a new token).
- **New tokens:** `--color-hairline-strong` (the ring of a small logo on a photo), `--radius-tail` (chat bubble corner), `--underline-offset` (4) + `--underline-thickness` (1) for every underline (footer, "Semua artikel", forms, `Button` link/ghost).
- **Breakpoint:** the `@media (min-width: 901px)` on the Logo kit became a desktop base + `@media (max-width: 900px)`; the same render (grid/subgrid ≥901, flex ≤900).
- **New `lint:ds` rules:** `raw-colour-fn`, `press-scale`, `control-size` (32–56px), `dot-size`, `underline`, `breakpoint-direction`; `raw-radius` now also reads `border-*-*-radius`. Tested on the previous commit: 26 findings, now clean.
- **Deliberately unchanged:** the FormatFolder illustration geometry, the flip card / hero slide / marquee sizes, reading widths (400–1500px) and the AIFA panel / claim modal sizes: they need a design decision first (a measure scale + panel knobs).

## Design system becomes a package (24–26 Nov 2026)

From here the design system's history is in [`plan.md`](plan.md) (Handover to other products) and [`../design-system/CHANGELOG.md`](../design-system/CHANGELOG.md): the docs tidied, the `/design-system` style guide, `design-system/base.css`, shape roles, the Tailwind 3.4 preset, compact density and dashboard components, the app shell, dialogs, charts and meters, the `@sebenarnya/design-system` package (released as `ds-v0.1.0`) and the contribution process.
