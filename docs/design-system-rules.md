# Design system rules — Sebenarnya.my

Rules for anyone (people or coding agents) writing UI in this repo. Taste and
visual direction live in [`design.md`](design.md); the doc map and how to use the
system in other products (CMS dashboard, browser extension) is in
[`README.md`](README.md). This file is the technical spec: it says **how to write
the code** so the system stays easy to update. Website page notes and history are
in [`website-changelog.md`](website-changelog.md) (not a spec).

**Source of truth:** the code (`design-system/tokens.css`, `design-system/base.css`, `design-system/ui.css`, `design-system/react/`)
and these docs. The Paper file is no longer a reference — its canvas does not
match the current design, so never copy values or layouts from it.

Stack: Next.js 16 (App Router, static export), React 19, JavaScript, plain CSS
(no Tailwind), Lucide icons, Manrope only.

---

## 1. Token tiers — change a value in one place

| Tier | Where | Examples | Who may use it |
|---|---|---|---|
| 1 · Primitive | `design-system/tokens.css` (top) | `--color-grey-95`, `--text-16`, `--leading-body`, `--spacing-44` | Only tokens.css itself |
| 2 · Semantic | `design-system/tokens.css` | `--color-primary`, `--color-input`, `--text-label`, `--size-control`, `--radius-control`, `--focus-ring-*` | Every component |
| 3 · Component | `design-system/ui.css`, top of each block | `--btn-bg`, `--chip-height`, `--field-border`, `--verdict-dot` | That component and its variants |

Decision guide:

- **Change the whole brand** (e.g. a new ink colour) → edit a primitive.
- **Change a role everywhere** (e.g. every control 48px high, every field edge darker) → edit a semantic token.
- **Change one component** (e.g. outline buttons get a lighter edge) → edit that component's knob in `ui.css`.
- **Add a variant** → a new class that only reassigns the component's knobs. Never copy the base CSS.

### Semantic token families

| Family | Tokens |
|---|---|
| Colour | `--color-background · foreground · card · muted · muted-strong · accent · secondary(-hover/-foreground) · primary(-hover/-foreground) · input · border · border-strong · ring · link · destructive · disabled(-foreground) · surface-overlay · surface-media · scrim · brand · verdict-{palsu,penjelasan,waspada,makluman}(-dot)` (four verdicts only: Palsu, Penjelasan, Waspada, Makluman) |
| Type roles | `--text-display · heading-lg · heading · title · intro · article · body · body-sm · label · label-sm · eyebrow · badge · verdict · caption · stat`, each with `--line-height`, and where it applies `--font-weight` / `--letter-spacing` (Tailwind v4 shape: `--text-label--line-height`) |
| Size | `--size-control-sm · control · control-lg · control-xl` (fluid control scale, below) `· hit-area (44) · badge-sm (20) · badge (24) · badge-lg (32) · icon-sm/icon/icon-lg/icon-xl · dot · textarea · menu (220) · menu-lg (260)` |
| Space roles | Content: `--gap-inline · gap-text · gap-group · gap-cards · gap-block`, cards: `--pad-card-sm · pad-card · pad-card-lg`; controls: `--space-control-x-sm · control-x · control-x-lg` (fluid) `· field-x · badge-x-sm/-x/-x-lg · inline-tight · stack · segment`; page: `--space-page-x · section · page-top` |
| Shape | `--radius-control (pill) · badge (pill) · field (8) · menu · menu-item · media (card − 8 = 12) · card (20) · card-lg (24) · tail (4, chat bubble corner)`; `--radius-full` for true circles only |
| Focus & effects | `--border-width · underline-thickness · underline-offset · focus-ring-width · focus-ring-offset · focus-ring-color · blur-overlay · press-scale · transition-colors · shadow-*` |
| Motion | `--duration-fast/base/slow/slower · ease-out/in-out/emphasized` |

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

**Font weight — headings vs text:**
`500` every heading (display H1, section H2, heading, title), intro, labels and
small text · `400` body, article and stat numbers · `600` verdict only. Headings
stand apart from body by weight as well as size. Never set a weight on a heading
by hand; use the role's `--font-weight`.

**Line-height:** only two — `1.2` for every heading, title, intro and stat;
`1.5` for everything else.
**Tracking:** `0` everywhere (Manrope is spaced well as drawn). Only UPPERCASE
labels (eyebrow, verdict) use `--tracking-label` (.04em). Lint enforces this.

**Paragraph rule in one sentence:** all text is 16; the exceptions are the
article body (16 → 18), meta (14) and one intro statement per page. A lead
under a title is still `body` — set it apart with colour (`--color-text-secondary`)
and spacing, not size.
To change a size, edit the role in tokens.css — never the component.

### Control scale: sm · md · lg (· xl)

Every interactive control takes its height from one scale. Each step is **fluid**
from 375px to 1280px wide (same formula as the type roles), so a phone gets compact
controls and a desktop keeps the full size, with no breakpoints.

| Size | Token | Height (375 → 1280) | Side padding | Label | Use |
|---|---|---|---|---|---|
| `sm` | `--size-control-sm` | 32 → 36 | `--space-control-x-sm` 12 → 16 | `label-sm` 14 | dense rows, inline actions (remove file, download chips) |
| `md` (default) | `--size-control` | 40 → 44 | `--space-control-x` 16 → 20 | `label` 16 | every button, chip, tab, field, nav link, menu item |
| `lg` | `--size-control-lg` | 44 → 48 | `--space-control-x-lg` 20 → 24 | `label` 16 | a page's main action, carousel controls, icon discs |
| `xl` | `--size-control-xl` | 48 → 56 | — | — | the primary search and the floating AIFA button only |

- **Touch target stays 44.** `.ui-btn` and `.ui-chip` grow an invisible `::after`
  to `--size-hit-area` whenever they draw shorter (sm everywhere, md on a phone).
  A hand-built control below 44 adds the same pseudo-element.
- **Badges are not controls.** `Badge` and `Verdict` use the fixed badge scale:
  `sm` 20 (12px text) · `md` 24 (default, 13px) · `lg` 32 (14px, the Verdict pill).
- **Nested controls are derived, never set by hand:** the search button is
  `search height − 2 × (inset + border)`; a tab is `track − 2 × (segment + border)`.
- Never write a control height in px in `global.css`; take a `--size-control-*` token.

### Spacing & radius roles (pick by relationship, not by number)

Ask "what is the relationship between these two things?", never "16 or 24?".

| Relationship | Token | Value | Example |
|---|---|---|---|
| Icon ↔ label, items in a row | `--gap-inline` | 8 | icon + text, chips, paired buttons |
| Inside one text group | `--gap-text` | 8 | eyebrow → title → description → meta |
| Between groups inside a card | `--gap-group` | 16 | text ↔ actions, media ↔ body |
| Between cards | `--gap-cards` | 16 → 24 fluid | every card grid and card row |
| Section heading → content | `--gap-block` | 24 → 40 fluid | "Semakan fakta terkini" → its grid |
| Between sections | `--space-section` | 64 → 120 fluid | page rhythm; related blocks (hero → carousel → agency logos) take half |

**Card size decides padding and radius together** (one decision, two values):

| Card | Padding | Radius | When |
|---|---|---|---|
| `sm` | `--pad-card-sm` 16 | `--radius-card` 20 | narrower than ~280px: flip card, news card, poster tile |
| `md` | `--pad-card` 24 | `--radius-card` 20 | **default**, any card in a grid |
| `lg` | `--pad-card-lg` 32 → 24 fluid | `--radius-card-lg` 24 | feature card, modal, panel, a card ≥ half the row |

Four rules:
1. **Between groups ≥ 2× inside a group** (8 → 16). The page keeps one ratio on every screen:
   between sections ≈ 3× heading → content; between cards < heading → content.
2. **Inside a card, every gap ≤ the card padding**, so the content belongs to its
   container. A column gutter inside a card equals the card padding.
3. **Nested radius = outer − inset**: media inset 8px in a 20px card gets 12.
   Full-bleed media inherits the card radius through `overflow: hidden`.
4. **Pick the shape by role, never by look.** `--radius-control` for anything you
   press (buttons, chips, tabs, search, icon buttons, carousel controls, round social
   buttons); `--radius-badge` for static pill labels (Badge, Verdict, photo pills);
   `--radius-full` only for true circles (avatars, dots, decorative icon discs,
   progress tracks). Both roles are pills today, but a rebrand changes each with one
   line in tokens.css, so a control written with `--radius-full` would be left behind.
   Cards are never pills; `--radius-media` follows `--radius-card` by itself.

Exceptions: a full-screen modal on a phone uses `sm` (= the 16px page gutter).
Hero stages (`.about-hero-card`) are layout, not cards: they use section spacing.

**`--spacing-*` steps vs roles (lint `group-gap-primitive`):** a gap that separates
groups or blocks — 16px or more — always takes a role (`--gap-group`, `--gap-cards`,
`--gap-block`, `--space-section`), so changing a relationship changes it everywhere.
A `--spacing-*` step is only for geometry inside one component: gaps of 12px or less,
control padding, offsets. Don't add breakpoint overrides for a role (it is already
fluid). The rare exception (header chrome, carousel dot hit areas) carries `ds-allow`.

### Density: default and compact

`data-density="compact"` on `<html>` or an app shell makes everything inside denser by
changing token values only (tokens.css › DENSITY): controls sm 32 · md 36 · lg 40 · xl 44,
table rows 40, card padding 12 · 16 · 24, tighter card and block gaps, page gutter 24.
Type roles do not change. Sizes are fixed, not fluid. The hit area drops from 44 to 24
(WCAG 2.2 AA 2.5.8) so targets do not overlap 36–40px rows: **compact is for mouse-first
desktop tools only** (CMS). The public website and anything used on a phone stay default.
Never write density-specific CSS in a component; if compact needs a different value, it
is a token in the DENSITY block.

### Overlays: one menu, one modal

- **Menu** (`.ui-menu`, `design-system/ui.css`): nav dropdown, language and Kongsi menus share one
  surface — `--color-background`, 1px `--color-border`, `--radius-menu`, `--space-inline`
  padding, `--shadow-float` — and one 150ms pop-in (opacity + scale .96) from the trigger
  edge. A menu adds `.ui-menu` and sets only its width and `transform-origin`.
- **Modal** (`.ui-modal`): every `<dialog>` opened with `showModal()` (claim form, social
  peek, sphere photo). `--color-card` surface, `--radius-card-lg`, `--shadow-overlay`,
  backdrop `--color-scrim` (ink 60%), 250ms opacity + scale .96 in and .98 out (transitions,
  so a fast close reverses mid-way). Reduced motion: fade only. The AIFA panel is not modal
  but uses the same shadow and pop.
- Bases are written `:where(.ui-menu)` / `:where(.ui-modal)` (no specificity) because
  `ui.css` loads after `global.css`; component classes override them freely.

### Layout: breakpoints, layers, reading widths

**Four breakpoints only** (`max-width`, mobile last). Need a change between two of
them? Use the next one up, never a new number.

| Width | Name | What changes |
|---|---|---|
| 1280 | xl | page gutter 96 → 48 |
| 1100 | lg | nav collapses to the compact header |
| 900 | md | grids and side-by-side layouts stack to one column |
| 600 | sm | phone: gutter 16, full-screen sheets, single-column stats |

**Layers** (`z-index`): global stacking uses tokens, lowest to highest:
`--z-sticky` 10 header · `--z-dropdown` 20 menus · `--z-overlay` 30 scrims ·
`--z-floating` 40 Tanya AIFA · `--z-skip` 50 skip link. Inside one component,
plain `-1…5` orders siblings (image under text, badge over image).

**Reading widths:** `--measure-text` (68ch) for any paragraph that runs long;
`--measure-head` (720px) for a centred section heading and its lead. Short
headings may use `em` caps (`max-width: 12em`) to balance line breaks.

### Details: focus, icons, avatars, motion, borders

**Focus ring:** one ring everywhere — `--focus-ring-width` (2px) ·
`--focus-ring-color` · `--focus-ring-offset` (2px). On photos and dark surfaces use
`--focus-ring-color-inverse`. Never a hand-made outline.

**Icons** (Lucide via `<Icon size="…">`, never a number):

| Name | px | Job |
|---|---|---|
| `sm` | 14 | inside badges, next to 12–13px meta |
| `md` (default) | 16 | next to a label, inside buttons |
| `lg` | 20 | field and search icons, icon-only list items |
| `xl` | 24 | icon-only buttons (close, chat toggle), status marks |
| `display` | 40 | empty states, upload drop zones |

**Avatars:** `--size-avatar-sm` 32 on cards and images · `--size-avatar` 40
default. The logo sits `--avatar-inset` (4px) inside the white ring.

**Motion:** `--duration-fast` 150 hover/colour/press · `base` 250 small moves,
fades, **every menu, modal and the AIFA panel** · `slow` 450 reveals, flips · `slower` 600 the page entrance's H1 line rise, photo zoom (the ceiling).
A route change is the browser's own crossfade at `base` (navigation is the most frequent action).
Easing `--ease-out` by default. Ambient loops
(marquees, autoplay timers, 2s+) may use raw seconds; hand-tuned sequences
(the logo folder) carry `ds-allow`. **One entrance per page, on load only**
(`components/PageEnter.js`, 100ms between chunks); nothing reveals on scroll.

**Borders:** `--border-width` 1px for cards, panels, menus, fields and dividers ·
`--border-width-hairline` .5px for small pills and chips. Edge colour
`--color-border`; a divider inside a surface `--color-muted-strong`.

## 2. Hard rules (checked by `npm run lint:ds`)

1. No hex/rgb colours outside `tokens.css`.
2. No palette primitives (`--color-grey-*`, `--color-red`…) in components.
3. `design-system/ui.css`: **no raw lengths** (`px`); use roles. Exceptions carry `/* ds-allow: reason */`.
3d. **Details:** focus rings, motion and border widths only from tokens; `<Icon>` sizes by name.
3c. **Layout:** only the four breakpoints, `max-width` only (no `min-width` media queries); z-index above 5 must be a `--z-*` layer.
3b. **Spacing & radius, every file except tokens.css:** no raw `px` in padding, margin or gap, no raw `px` radius, no `--radius-lg` (use `--radius-card-lg`). Optical nudges and overlaps carry `/* ds-allow: reason */`.
3a. **Type, every file except tokens.css:** only type roles. No `--text-16`/`--leading-*` steps, no raw `font-size` (px, `clamp()`, `calc()`), no `px` line-height, no `fontSize` in JSX, no role that tokens.css does not define. Percent/em tweaks are fine.
4. Icons: Lucide only, always through `design-system/react/Icon.js`.
5. No `rem` (the root is 62.5% and the CSS is reused in the extension).
6. Font weights only from `--font-weight-*`; nothing above 600.
7. Manrope only (`--font-sans`).
8. No `transition: all`.
9. No `rgb()` / `rgba()` / `hsl()` outside `tokens.css` (masks excepted).
10. Press feedback on `:active` is `var(--press-scale)`, never a number.
11. A 32–56px `width`/`height`/`min-*` is a control, disc or tile: use `--size-control-*`, `--size-avatar*` or `--size-badge*` (`max-*` caps on images are fine). A 4–10px dot uses `--size-dot`.
12. Underlines use `--underline-offset` and `--underline-thickness`.

Run it before every commit; it exits 1 on failure.

## 3. Components — use these, don't rebuild them

Import from `@sebenarnya/design-system` in other products, `@/components/ui` in this website (it re-exports `design-system/react`). API mirrors shadcn/ui (variant + size props).

| Need | Component | Notes |
|---|---|---|
| Any action | `Button` | `variant`: filled · outline · secondary · ghost · media · link. `size`: sm · md (default) · lg · icon-sm · icon · icon-lg. `icon` / `iconEnd` take a Lucide component. `href` renders a link (`as={Link}` for next/link). One filled button per view. |
| Icon-only action | `IconButton` | `label` is required (becomes `aria-label`). Default variant outline. |
| Suggestion / filter | `Chip`, `ChipRow` | `size`: sm · md (default) · lg. `pressed` makes it a toggle (`aria-pressed`). `dot="palsu"` adds a verdict dot. |
| Static label | `Badge` | variant muted · outline · media; size sm (20) · md (24, default) · lg (32). Not clickable. |
| Verdict | `Verdict` | Always dot + word (+ agency). variant pill (lg badge 32) · overlay (on photos, 24) · tint (24) · plain (inherits colour). tone default · single. |
| Segmented / language | `Tabs` | `mode="tabs"` (tablist, arrow keys) or `mode="toggle"` (aria-pressed). |
| Search | `SearchField` | size lg (default, xl 48 → 56 + "Semak") · md (44 → 48) · sm (40 → 44). `buttonLabel={null}` for live filtering. |
| Form | `Field` + `Input` / `Textarea` / `Select` | Field wires id, `aria-invalid`, `aria-describedby`. `pill` for toolbar fields. `size` sm · md (default) · lg on Input and Select. |
| Navigation | `NavLink`, `DropdownMenu` | `current` sets `aria-current="page"`. |
| Icon | `Icon` | 1.75px stroke, `currentColor`, `aria-hidden`. |

**Dashboard components** (CMS, extension, tools). Native elements, no Radix; API mirrors shadcn/ui.

| Need | Component | Notes |
|---|---|---|
| Quiet action (toolbar, pagination, row action) | `Button variant="quiet"` | No fill, no underline, tinted on hover (shadcn's ghost). Our `ghost` keeps its underline. |
| A surface for one subject | `Card` + `CardHeader` `CardTitle` `CardDescription` `CardAction` `CardContent` `CardFooter` | variant muted (default) · outline (work panels) · raised (on taupe). size sm · md · lg. |
| Rows of data | `Table` + `TableHeader` `TableBody` `TableFooter` `TableRow` `TableHead` `TableCell` | `label` names the scroll region. `TableHead sort onSort` → sortable (aria-sort). `TableRow selected`. `align="num"` for figures, `check` for the selection column. Row height `--size-row`. |
| Choice sent with a form | `Checkbox` | `label` always (also when hidden), `hint`, `indeterminate`, `onCheckedChange`. |
| Setting that applies at once | `Switch` | `role="switch"`. If it needs Save, use Checkbox. |
| One of a few visible options | `RadioGroup` | `items`, `value`, `onValueChange`, orientation. Over ~5 options: Select. |
| Pages of a list | `Pagination` | `page`, `pageCount`, `onPageChange` or `href(page)`. |
| Where this page sits | `Breadcrumb` | `items`; last item is the current page. |
| Message that stays | `Alert` | default · success · destructive (role="alert"). Colour on the icon and edge only. There is no warning colour (design.md § 8, decision 8): write a warning in words in a default Alert. |
| Confirmation that goes away | `toast()` + `<Toaster />` once | 5s, pauses on hover/focus, polite. Not for errors the user must act on: use Alert. |
| Name of an icon-only control | `Tooltip` | Hover after 400ms, focus at once, Escape hides. Never essential information. |
| Loading | `Skeleton` | text · circle · block. Put `aria-busy` on the loading region. |
| Person or agency | `Avatar` | Initials fallback. sm · md. |
| Nothing here yet | `EmptyState` | Say what will appear and how to add the first one. |
| Divider | `Separator` | Decorative by default. |
| One number that matters | `Stat` | `label`, `value` (formatted), `delta` (%), `deltaLabel`, optional `trend` sparkline. Change by sign, arrow and words, never red/green. |
| Progress, score, quota | `Meter` | `role="meter"`; ink fill on a stone track; `valueText` is shown and read out. |
| Ranking (per agency, top claims) | `BarList` | Sorted largest first; numbers printed, bars show proportion. |
| One measure over time | `BarChart` | Monochrome, ≤24px columns 2px apart, hairline grid, latest value labelled, hover tooltip, screen-reader table. ≤ ~31 columns; aggregate beyond. Two measures with different scales: two charts, never a second axis. |
| A short task in a window (edit a title) | `Dialog` | Native `<dialog>` on the shared `.ui-modal` surface. `title`, `description`, `footer`, size sm (400) · md (520) · lg (720). Escape, the X or a scrim click close it; `busy` blocks closing while saving. First focus: the control with `data-autofocus`, else the first control. |
| A decision before an action (padam, terbit) | `ConfirmDialog`, or `await confirmDialog({…})` with `<ConfirmDialogHost />` once | `role="alertdialog"`: no X, no scrim close; Escape = Batal. `onConfirm` may return a promise: the button shows `pendingLabel`, the dialog closes on success and shows the error on failure. `variant="destructive"` adds the warning mark and starts focus on Batal. **The action button is never red** (design.md): say the verb ("Padam", not "Ya"). |
| Frame of a tool | `AppShell` + `Sidebar` (`SidebarHeader` `SidebarContent` `SidebarGroup` `SidebarItem` `SidebarFooter`) + `Topbar` + `SidebarTrigger` + `PageContent` + `PageHeader` | Compact by default. Sidebar `--size-sidebar`; items take the control shape, current page = muted fill + medium, `count` for numbers to act on. ≤900: drawer (trigger opens; Escape, scrim or a link closes; focus moves in and back; page inert). One `PageHeader` per page: title (`heading` role), one-line description, main actions. |

A page-specific class may position a component (`margin`, `grid-area`,
`align-self`). It must not restyle it (colour, height, radius, font). If a
design needs a new look, add a variant in `ui.css` first.

## 4. Accessibility baseline (WCAG 2.2 AA)

- Native `<button>` / `<a href>` only. Icon-only controls need a Malay `aria-label`.
- Focus: `:focus-visible` ring from the focus tokens; never remove it.
- Touch target ≥ 44px; any control drawn shorter (sm, md on a phone) extends its hit area (`::after`).
- Verdict colour never alone: dot + word + agency.
- Anything that moves on its own for more than 5s has a visible pause control and stops under `prefers-reduced-motion`.
- Skip link "Langkau ke kandungan" is the first focusable element; each page has one `<main id="main">`.
- Fields have visible labels; errors sit under the field and are linked with `aria-describedby`.

## 5. Adding something new — checklist

1. Can an existing component + variant do it? Use it.
2. Need a new look? Add a variant (knob reassignment) in `ui.css`.
3. Need a new value? Add a semantic token in `tokens.css` (and a primitive only if the raw value is new).
4. Run `npm run lint:ds` and `npm run build`.
5. Update this file (and `README.md` if the file layout changed) when the API changes. Website-only notes go in `website-changelog.md`.
