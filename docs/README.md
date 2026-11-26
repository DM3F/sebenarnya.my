# Sebenarnya Design System

One design system for every Sebenarnya product: the public website (this repo),
the CMS dashboard and the browser extension. Same tokens, same components, same
rules, so the three products look and behave like one.

**Visual reference:** the `/design-system` page of the website (`npm run dev`, then
open <http://localhost:3000/design-system/>). It renders every token and every
component from the real code, so it is always up to date.

---

## Source of truth

The **code** is the source of truth. When a document disagrees with the code, the
code wins and the document gets fixed.

| File | What it holds |
|---|---|
| `app/tokens.css` | Every value: palette (primitive), roles (semantic), type, size, spacing, radius, motion, z-index. Plain CSS custom properties, Tailwind v4 names, no framework. |
| `app/base.css` | Element defaults every product needs under `ui.css`: body type and colour, headings, links, form controls that inherit the font. No layout, no root font size. |
| `app/ui.css` | The component styles (`.ui-btn`, `.ui-chip`, `.ui-field`, `.ui-menu`, `.ui-modal`…), written only with semantic tokens. |
| `components/ui/` | React components (Button, IconButton, Chip, Badge, Verdict, Tabs, SearchField, Field/Input/Textarea/Select, NavLink, DropdownMenu, LanguageMenu, Icon). No Next.js imports. |
| `scripts/lint-ds.mjs` | `npm run lint:ds`: the rules as a check (no hex, no raw px, type roles only, Lucide only…). |

## Documents

| Document | Read it when | Language |
|---|---|---|
| [`design.md`](design.md) | You need the *feel*: identity, palette meaning, type voice, density, motion dials, do/don't. | Bahasa Melayu |
| [`design-system-rules.md`](design-system-rules.md) | You write UI code: token tiers, type roles, control scale, spacing roles, components, lint rules, accessibility. **The technical spec.** | English |
| [`plan.md`](plan.md) | You want the open decisions and the roadmap. | Bahasa Melayu |
| [`website-changelog.md`](website-changelog.md) | You work on a specific website page. Page notes and history only, **not a spec** (many old values). | Bahasa Melayu |

## Products

| Product | Repo | Stack | Status |
|---|---|---|---|
| Website | this repo | Next.js 16, JavaScript, plain CSS | Uses the system |
| CMS dashboard | separate | Next.js, TypeScript, plain CSS | Not yet |
| Browser extension | separate | React, TypeScript, Tailwind CSS 3.4 | Not yet; Tailwind preset ready |

Neither the CMS nor the extension uses shadcn/ui or Radix. `components/ui/` is the
component library for all three; shadcn/ui is a reference for API and
accessibility, translated into plain CSS with our tokens. No dark mode for now.

## Using it in another product (today)

The system is not a package yet (roadmap step 3). Until then a product copies a
**pinned commit** of these files and records that commit hash in its own README:

1. `app/tokens.css`, `app/base.css`, then the product's own CSS, then
   `app/ui.css`, loaded in that order. These three files are the whole system;
   `app/global.css` is the website's page CSS and is never copied.
2. `components/ui/` if the product uses React. `lucide-react` is the only icon set.
3. Manrope. The website loads it with `next/font` as `--font-manrope`; elsewhere,
   load Manrope (400 · 500 · 600) under the family name `Manrope`, the fallback in
   `--font-sans`.
4. `scripts/lint-ds.mjs`, run in that product's CI.

Do not edit the copied files inside the product. A change goes into this repo
first (see *Changing the system*), then every product updates its copy.

### Browser extension (Tailwind CSS 3.4)

`design-system/tailwind-preset.cjs` turns every token into a Tailwind class that
reads it through `var()`. Change a token in `tokens.css` and the extension follows
with no code change. Class names are read from `tokens.css` when Tailwind starts,
so a new token is a new class.

```js
// tailwind.config.js
module.exports = {
  presets: [require('./design-system/tailwind-preset.cjs')],
  content: ['./src/**/*.{ts,tsx,html}'],
};
```

```css
/* CSS entry: tokens first, our base after Tailwind's preflight */
@import './design-system/tokens.css';
@tailwind base;
@import './design-system/base.css';
@tailwind components;
@tailwind utilities;
```

| Need | Class |
|---|---|
| Colour | `bg-background` `bg-muted` `bg-primary` `hover:bg-primary-hover` `text-foreground` `text-text-secondary` `text-muted-foreground` `border-border` `border-input` `text-verdict-palsu` `bg-verdict-palsu-dot` |
| Text (size + line height + weight in one class) | `text-display` `text-heading-lg` `text-heading` `text-title` `text-body` `text-body-sm` `text-label` `text-eyebrow` `text-verdict` `text-caption` `text-stat` |
| Control height | `h-control-sm` `h-control` `h-control-lg` `h-control-xl` · padding `px-control-x-sm` `px-control-x` `px-control-x-lg` |
| Spacing by relationship | `gap-inline` `gap-text` `gap-group` `gap-cards` `gap-block` · cards `p-card-sm` `p-card` `p-card-lg` |
| Shape | `rounded-control` (anything you press) `rounded-badge` `rounded-card` `rounded-card-lg` `rounded-field` `rounded-media` `rounded-full` (circles only) |
| Badge, dot, avatar | `h-badge` `h-badge-lg` `px-badge-x` `size-dot` `size-avatar` |
| Effects | `shadow-float` `shadow-overlay` `duration-fast` `duration-base` `ease-out` `active:scale-press` `z-dropdown` |
| Focus ring | `focus-visible:outline outline-focus outline-offset-focus` |
| Breakpoints | `xl:` `lg:` `md:` `sm:` are **max-width** (1280 · 1100 · 900 · 600), mobile last |

Two things differ from stock Tailwind on purpose:

- **Off-system values do not exist.** The preset replaces Tailwind's colours, type
  sizes, spacing, radius, weights and breakpoints, so `bg-red-500`, `text-sm`,
  `rounded-lg` and `font-bold` generate nothing. Use the roles above.
- **Spacing numbers are px.** `p-16` is 16px (`--spacing-16`), not Tailwind's
  `p-4` = 1rem. There is no rem anywhere: inside a content script rem follows the
  host page's root size. Prefer the relationship roles (`gap-group`, `p-card`) over
  numbers.

Load Manrope (400 · 500 · 600) inside the extension under the family name `Manrope`;
`--font-sans` falls back to it when `--font-manrope` (the website's `next/font`
variable) is not set.

### Known gaps per product

| Product | Gap | Roadmap step |
|---|---|---|
| All | Not a versioned package: copies drift. The website, CMS and extension live in **separate repos**, so they need an installable package. | 3 |
| All | Components are JavaScript; the CMS and extension are TypeScript and need type declarations (`.d.ts`). | 3 |
| All | No dark mode. Not needed for now (decided 26 Nov 2026). | 5 (deferred) |
| CMS dashboard | Compact density and the dashboard components (Card, Table, Checkbox, Switch, RadioGroup, Pagination, Breadcrumb, Alert, Toast, Tooltip, Skeleton, Avatar, EmptyState) are done. The app shell (sidebar, top bar, page header, phone drawer) is done too. Still missing: dialogs for confirm/delete, and charts and meters, which exist only as guidelines (`design.md` §4). | 4 |
| Browser extension | *Only if the UI is injected into other pages (content script):* tokens on `:root` and base rules on bare elements would clash with the host page. Needs a scoped mode (Shadow DOM, tokens on `:host`). Popup and side panel do not need it. | 4 |
| Browser extension | *Content script only:* fluid sizes use `vw`, which is the host page width there, not the panel. Needs fixed sizes in the scoped mode. | 4 |
| Browser extension | Manrope must ship inside the extension (CSP blocks font CDNs). | 4 |

Already safe for other products: every size is `px` (no `rem`, so a different
root font size changes nothing), components use only semantic tokens, and
`components/ui/` has no Next.js imports (`href` renders a plain `<a>`; pass
`as={Link}` for a router link).

## Changing the system

1. Check `design-system-rules.md` §5: can an existing component or variant do it?
2. Change a value at the right tier: primitive (whole brand), semantic (a role
   everywhere) or component knob (one component). Never in a product's own CSS.
3. Run `npm run lint:ds` and `npm run build`, then check `/design-system`.
4. Update `design-system-rules.md` if a token or component API changed.
5. One owner approves changes to tokens and components; products propose new
   variants by pull request to this repo, never by overriding styles locally.

## Roadmap

1. ✅ Tidy the docs: fix contradictions in `design.md`, split website history
   from the spec, add this README.
2. ✅ `/design-system` style guide page: every token and component, live.
3. Extract a `design-system` package in this repo (tokens, base, ui, React,
   fonts, lint); the website consumes it first. `lint:ds` in CI and screenshots
   of `/design-system` as a visual regression check.
4. Compact mode (dashboard), scoped mode (extension), bundled fonts.
5. Dark mode, after the decision in `plan.md`.
6. Optional: Figma variables, text styles and components generated from the code,
   when a designer needs them. The code stays the source of truth.
