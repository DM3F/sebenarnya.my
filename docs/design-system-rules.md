# Design system rules — Sebenarnya.my

Rules for anyone (people or coding agents) writing UI in this repo. Taste and
visual direction live in [`design.md`](design.md); exact component specs in
[`design-system-handoff.md`](design-system-handoff.md). This file says **how to
write the code** so the system stays easy to update.

**Source of truth:** the code (`app/tokens.css`, `app/ui.css`, `components/ui/`)
and these docs. The Paper file is no longer a reference — its canvas does not
match the current design, so never copy values or layouts from it.

Stack: Next.js 16 (App Router, static export), React 19, JavaScript, plain CSS
(no Tailwind), Lucide icons, Inter only. Visual base: the ElevenLabs "living
instruments on cream" reference (light headings, quiet chrome, color inside media).

---

## 1. Token tiers — change a value in one place

| Tier | Where | Examples | Who may use it |
|---|---|---|---|
| 1 · Primitive | `app/tokens.css` (top) | `--color-grey-95`, `--text-16`, `--leading-24`, `--spacing-44` | Only tokens.css itself |
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
| Type roles | `--text-display · heading-lg · heading · title · body-lg · body · body-sm · label · label-sm · badge · verdict · caption · stat`, each with `--line-height`, and where it applies `--font-weight` / `--letter-spacing` (Tailwind v4 shape: `--text-label--line-height`) |
| Size | `--size-control-sm (36) · control (44) · control-lg (48) · control-xl (56) · hit-area · badge · icon-sm/icon/icon-lg/icon-xl · dot · textarea · menu` |
| Space roles | `--space-control-x(-sm) · field-x · badge-x/-y · inline(-tight) · stack · segment` + the 4px scale `--spacing-*` for layout |
| Shape | `--radius-control (pill) · field (8) · menu · menu-item · media · card · lg` |
| Focus & effects | `--border-width · focus-ring-width · focus-ring-offset · focus-ring-color · blur-overlay · press-scale · transition-colors · shadow-*` |
| Weight roles | `--font-weight-display (300) · heading (300) · title (400) · label (400) · eyebrow (500)`; `--font-weight-semibold` (600) only for verdict words and `<strong>` |
| Motion | `--duration-fast/base/slow · ease-out/in-out/emphasized` |

Mobile type steps (Display 38/42, Heading-lg 30/36) are applied once, inside
tokens.css, by reassigning the role tokens under `@media (max-width: 600px)`.

## 2. Hard rules (checked by `npm run lint:ds`)

1. No hex/rgb colours outside `tokens.css`.
2. No palette primitives (`--color-grey-*`, `--color-red`…) in components.
3. `app/ui.css`: **no raw lengths** (`px`) and **no type scale steps** (`--text-16`, `--leading-24`); use roles. Exceptions carry `/* ds-allow: reason */`.
4. Icons: Lucide only, always through `components/ui/Icon.js`.
5. No `rem` (the root is 62.5% and the CSS is reused in the extension).
6. Font weights only from `--font-weight-*`; nothing above 600.
7. Inter only (`--font-sans`).
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
