# Design system rules — Sebenarnya.my

Rules for anyone (people or coding agents) writing UI in this repo. Taste and
visual direction live in [`design.md`](design.md); exact component specs in
[`design-system-handoff.md`](design-system-handoff.md). This file says **how to
write the code** so the system stays easy to update.

**Source of truth:** the code (`app/tokens.css`, `app/ui.css`, `components/ui/`)
and these docs. The Paper file is no longer a reference — its canvas does not
match the current design, so never copy values or layouts from it.

Stack: Next.js 16 (App Router, static export), React 19, JavaScript, plain CSS
(no Tailwind), Lucide icons, Manrope only.

---

## 1. Token tiers — change a value in one place

| Tier | Where | Examples | Who may use it |
|---|---|---|---|
| 1 · Primitive | `app/tokens.css` (top) | `--color-grey-95`, `--text-16`, `--leading-body`, `--spacing-44` | Only tokens.css itself |
| 2 · Semantic | `app/tokens.css` | `--color-primary`, `--color-input`, `--text-label`, `--size-control`, `--radius-control`, `--focus-ring-*` | Every component |
| 3 · Component | `app/ui.css`, top of each block | `--btn-bg`, `--chip-height`, `--field-border`, `--verdict-dot` | That component and its variants |

Decision guide:

- **Change the whole brand** (e.g. a new ink colour) → edit a primitive.
- **Change a role everywhere** (e.g. every control 48px high, every field edge darker) → edit a semantic token.
- **Change one component** (e.g. outline buttons get a lighter edge) → edit that component's knob in `ui.css`.
- **Add a variant** → a new class that only reassigns the component's knobs. Never copy the base CSS.

### Semantic token families

| Family | Tokens |
|---|---|
| Colour | `--color-background · foreground · card · muted · muted-strong · accent · secondary(-hover/-foreground) · primary(-hover/-foreground) · input · border · border-strong · ring · link · destructive · disabled(-foreground) · surface-overlay · brand · verdict-*` |
| Type roles | `--text-display · heading-lg · heading · title · intro · article · body · body-sm · label · label-sm · eyebrow · badge · verdict · caption · stat`, each with `--line-height`, and where it applies `--font-weight` / `--letter-spacing` (Tailwind v4 shape: `--text-label--line-height`) |
| Size | `--size-control-sm (36) · control (44) · control-lg (48) · control-xl (56) · hit-area · badge · icon-sm/icon/icon-lg/icon-xl · dot · textarea · menu` |
| Space roles | Content: `--gap-inline · gap-text · gap-group · gap-cards · gap-block`, cards: `--pad-card-sm · pad-card · pad-card-lg`; controls: `--space-control-x(-sm) · field-x · badge-x/-y · inline-tight · stack · segment`; page: `--space-page-x · section · page-top` |
| Shape | `--radius-control (pill) · field (8) · menu · menu-item · media (12) · card (20) · card-lg (24)` |
| Focus & effects | `--border-width · focus-ring-width · focus-ring-offset · focus-ring-color · blur-overlay · press-scale · transition-colors · shadow-*` |
| Motion | `--duration-fast/base/slow · ease-out/in-out/emphasized` |

### Type roles (the only way to size text)

| Role | Size (375 → 1280px) | Line-height | Use |
|---|---|---|---|
| `display` | 32 → 48 fluid | 1.2 | page H1 only |
| `heading-lg` | 28 → 36 fluid | 1.2 | section H2 |
| `heading` | 20 → 24 fluid | 1.2 | panel / feature H3 |
| `title` | 18 → 20 fluid | 1.2 | card titles |
| `intro` | 20 → 24 fluid | 1.2 | one big statement **per page, max** (Figma Body/24 Large) |
| `article` | 16 → 18 fluid | 1.5 | article reading column (`/article/[slug]`) **only** |
| `body` | 16 | 1.5 | **every other paragraph**: leads, summaries, footer, UI text |
| `body-sm` | 14 | 1.5 | meta, support text |
| `label` / `label-sm` | 16 / 14, medium | 1.5 | buttons, nav, form labels |
| `eyebrow` / `badge` / `verdict` | 13 | 1.5 | eyebrows, badges, verdict word |
| `caption` | 12 | 1.5 | dates, credits |
| `stat` | 36 → 48 fluid | 1.2 | statistic numbers |

Fluid roles use `clamp()` inside tokens.css, so there are **no type media
queries**: components write `font-size: var(--text-heading)` and get the right
size on every screen. Body, label and small roles are fixed on purpose.

**Line-height:** only two — `1.2` for every heading, title, intro and stat;
`1.5` for everything else.
**Tracking:** `0` everywhere (Manrope is spaced well as drawn). Only UPPERCASE
labels (eyebrow, verdict) use `--tracking-label` (.04em). Lint enforces this.

**Paragraph rule in one sentence:** all text is 16; the exceptions are the
article body (16 → 18), meta (14) and one intro statement per page. A lead
under a title is still `body` — set it apart with colour (`--color-text-secondary`)
and spacing, not size.
To change a size, edit the role in tokens.css — never the component.

### Spacing & radius roles (pick by relationship, not by number)

Ask "what is the relationship between these two things?", never "16 or 24?".

| Relationship | Token | Value | Example |
|---|---|---|---|
| Icon ↔ label, items in a row | `--gap-inline` | 8 | icon + text, chips, paired buttons |
| Inside one text group | `--gap-text` | 8 | eyebrow → title → description → meta |
| Between groups inside a card | `--gap-group` | 16 | text ↔ actions, media ↔ body |
| Between cards | `--gap-cards` | 12 | every card grid and card row |
| Section heading → content | `--gap-block` | 40 | "Semakan fakta terkini" → its grid |
| Between sections | `--space-section` | 96 · 64 · 48 | page rhythm |

**Card size decides padding and radius together** (one decision, two values):

| Card | Padding | Radius | When |
|---|---|---|---|
| `sm` | `--pad-card-sm` 16 | `--radius-card` 20 | narrower than ~280px: flip card, news card, poster tile |
| `md` | `--pad-card` 24 | `--radius-card` 20 | **default**, any card in a grid |
| `lg` | `--pad-card-lg` 32 → 24 fluid | `--radius-card-lg` 24 | feature card, modal, panel, a card ≥ half the row |

Four rules:
1. **Between groups ≥ 2× inside a group** (8 → 16).
2. **Inside a card, every gap ≤ the card padding**, so the content belongs to its
   container. A column gutter inside a card equals the card padding.
3. **Nested radius = outer − inset**: media inset 8px in a 20px card gets 12.
   Full-bleed media inherits the card radius through `overflow: hidden`.
4. **Pill (`--radius-control`) is for controls only**: buttons, chips, tabs, search.
   Cards are never pills.

Exceptions: a full-screen modal on a phone uses `sm` (= the 16px page gutter).
Hero stages (`.about-hero-card`) are layout, not cards: they use section spacing.

## 2. Hard rules (checked by `npm run lint:ds`)

1. No hex/rgb colours outside `tokens.css`.
2. No palette primitives (`--color-grey-*`, `--color-red`…) in components.
3. `app/ui.css`: **no raw lengths** (`px`); use roles. Exceptions carry `/* ds-allow: reason */`.
3b. **Spacing & radius, every file except tokens.css:** no raw `px` in padding, margin or gap, no raw `px` radius, no `--radius-lg` (use `--radius-card-lg`). Optical nudges and overlaps carry `/* ds-allow: reason */`.
3a. **Type, every file except tokens.css:** only type roles. No `--text-16`/`--leading-*` steps, no raw `font-size` (px, `clamp()`, `calc()`), no `px` line-height, no `fontSize` in JSX, no role that tokens.css does not define. Percent/em tweaks are fine.
4. Icons: Lucide only, always through `components/ui/Icon.js`.
5. No `rem` (the root is 62.5% and the CSS is reused in the extension).
6. Font weights only from `--font-weight-*`; nothing above 600.
7. Manrope only (`--font-sans`).
8. No `transition: all`.

Run it before every commit; it exits 1 on failure.

## 3. Components — use these, don't rebuild them

Import from `@/components/ui`. API mirrors shadcn/ui (variant + size props).

| Need | Component | Notes |
|---|---|---|
| Any action | `Button` | `variant`: filled · outline · secondary · ghost · media · link. `size`: default · sm · icon · icon-sm · icon-lg. `icon` / `iconEnd` take a Lucide component. `href` renders a link (`as={Link}` for next/link). One filled button per view. |
| Icon-only action | `IconButton` | `label` is required (becomes `aria-label`). Default variant outline. |
| Suggestion / filter | `Chip`, `ChipRow` | `pressed` makes it a toggle (`aria-pressed`). `dot="palsu"` adds a verdict dot. |
| Static label | `Badge` | variant muted · outline · media; size default · lg. Not clickable. |
| Verdict | `Verdict` | Always dot + word (+ agency). variant pill · overlay (on photos) · plain (inherits colour). tone default · single. |
| Segmented / language | `Tabs` | `mode="tabs"` (tablist, arrow keys) or `mode="toggle"` (aria-pressed). |
| Search | `SearchField` | size default (56 + "Semak") · sm (44). `buttonLabel={null}` for live filtering. |
| Form | `Field` + `Input` / `Textarea` / `Select` | Field wires id, `aria-invalid`, `aria-describedby`. `pill` for toolbar fields. |
| Navigation | `NavLink`, `DropdownMenu` | `current` sets `aria-current="page"`. |
| Icon | `Icon` | 1.75px stroke, `currentColor`, `aria-hidden`. |

A page-specific class may position a component (`margin`, `grid-area`,
`align-self`). It must not restyle it (colour, height, radius, font). If a
design needs a new look, add a variant in `ui.css` first.

## 4. Accessibility baseline (WCAG 2.2 AA)

- Native `<button>` / `<a href>` only. Icon-only controls need a Malay `aria-label`.
- Focus: `:focus-visible` ring from the focus tokens; never remove it.
- Touch target ≥ 44px; 36px controls extend their hit area (`::after`).
- Verdict colour never alone: dot + word + agency.
- Anything that moves on its own for more than 5s has a visible pause control and stops under `prefers-reduced-motion`.
- Skip link "Langkau ke kandungan" is the first focusable element; each page has one `<main id="main">`.
- Fields have visible labels; errors sit under the field and are linked with `aria-describedby`.

## 5. Adding something new — checklist

1. Can an existing component + variant do it? Use it.
2. Need a new look? Add a variant (knob reassignment) in `ui.css`.
3. Need a new value? Add a semantic token in `tokens.css` (and a primitive only if the raw value is new).
4. Run `npm run lint:ds` and `npm run build`.
5. Update this file and `design-system-handoff.md` if the API changed.
