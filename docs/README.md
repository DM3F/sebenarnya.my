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
| `design-system/tokens.css` | Every value: palette (primitive), roles (semantic), type, size, spacing, radius, motion, z-index. Plain CSS custom properties, Tailwind v4 names, no framework. |
| `design-system/base.css` | Element defaults every product needs under `ui.css`: body type and colour, headings, links, form controls that inherit the font. No layout, no root font size. |
| `design-system/ui.css` | The component styles (`.ui-btn`, `.ui-chip`, `.ui-field`, `.ui-menu`, `.ui-modal`…), written only with semantic tokens. |
| `design-system/react/` | React components (Button, IconButton, Chip, Badge, Verdict, Tabs, SearchField, Field/Input/Textarea/Select, NavLink, DropdownMenu, LanguageMenu, Icon). No Next.js imports. |
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

Neither the CMS nor the extension uses shadcn/ui or Radix. `design-system/react/` is the
component library for all three; shadcn/ui is a reference for API and
accessibility, translated into plain CSS with our tokens. No dark mode for now.

## Using it in another product

The design system is an installable package, **`@sebenarnya/design-system`**, built from
`design-system/` in this repo and published as a GitHub Release asset:

```bash
npm install https://github.com/DM3F/sebenarnya.my/releases/download/ds-v0.1.0/sebenarnya-design-system-0.1.0.tgz
```

Step-by-step guides, each with a prompt to hand to an AI coding agent, and both tested on a
fresh project:

- **CMS (Next.js, TypeScript, plain CSS):** [`adopting-cms.md`](adopting-cms.md)
- **Browser extension (React, TypeScript, Tailwind CSS 3.4):** [`adopting-extension.md`](adopting-extension.md)

| Package path | Source in this repo | What |
|---|---|---|
| `tokens.css` · `base.css` · `ui.css` | `design-system/` | Values, element defaults, component styles |
| `@sebenarnya/design-system` (React + types) | `design-system/react/` | Components; `index.d.ts` types every prop |
| `tailwind-preset` | `design-system/tailwind-preset.cjs` | Tailwind CSS 3.4 classes that read the tokens |
| `sebenarnya-lint-ds` (bin) | `scripts/lint-ds.mjs` | The lint, runnable in any product |

### Releasing a new version

1. Change the design system here; check `/design-system`, `npm run lint:ds`, `npm run build`.
2. Bump `"version"` in `design-system/package.json` (semver: a removed or renamed token or prop is a major).
3. Merge to `main`, then on GitHub: **Actions → Release design system package → Run workflow**
   (branch `main`). It creates the tag `ds-v<version>`, lints, builds (`npm run build:ds`) and
   attaches the `.tgz` to a GitHub Release. It stops if that version is already released.
   (Pushing a tag `ds-v<version>` yourself does the same.)
4. Products change the version in their install URL.

Locally, `npm run build:ds` writes `design-system/dist/` and `design-system/sebenarnya-design-system-<version>.tgz`.

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
| All | No dark mode. Not needed for now (decided 26 Nov 2026). | 5 (deferred) |
| CMS dashboard | Compact density and the dashboard components (Card, Table, Checkbox, Switch, RadioGroup, Pagination, Breadcrumb, Alert, Toast, Tooltip, Skeleton, Avatar, EmptyState) are done. The app shell (sidebar, top bar, page header, phone drawer) is done too. Dialogs (Dialog, ConfirmDialog, `confirmDialog()`) are done too. Charts and meters (Stat, Meter, BarList, BarChart, Sparkline) are done too. | 4 |
| Browser extension | *Only if the UI is injected into other pages (content script):* tokens on `:root` and base rules on bare elements would clash with the host page. Needs a scoped mode (Shadow DOM, tokens on `:host`). Popup and side panel do not need it. | 4 |
| Browser extension | *Content script only:* fluid sizes use `vw`, which is the host page width there, not the panel. Needs fixed sizes in the scoped mode. | 4 |

Already safe for other products: every size is `px` (no `rem`, so a different
root font size changes nothing), components use only semantic tokens, and
`design-system/react/` has no Next.js imports (`href` renders a plain `<a>`; pass
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

1. ✅ Tidy the docs.
2. ✅ `/design-system` style guide page.
3. ✅ Package `@sebenarnya/design-system`: tokens, base, ui, React + TypeScript types,
   Tailwind 3.4 preset, portable lint, release workflow.
4. ✅ Compact density, dashboard components, app shell, dialogs, charts and meters.
   ✅ Adoption guides for the CMS and the extension, tested on fresh projects.
   Open: scoped mode (Shadow DOM) only if the extension injects UI into other pages.
5. Dark mode: deferred (not needed now).
6. Optional: Figma variables, text styles and components generated from the code,
   when a designer needs them. The code stays the source of truth.
