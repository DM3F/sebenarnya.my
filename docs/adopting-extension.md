# Adopting the design system in the browser extension (React · TypeScript · Tailwind CSS 3.4)

For developers and AI coding agents. The extension keeps Tailwind; a preset makes every
Tailwind class read the design system's tokens, so the extension follows the website and the
CMS when a token changes.

**Ground rules (read first)**

- The design system is a package. **Never copy or edit its files**; install new versions.
- **Only preset classes.** The preset replaces Tailwind's colours, type sizes, spacing, radius,
  weights and breakpoints, so `bg-red-500`, `text-sm`, `rounded-lg`, `font-bold` do not exist.
  Never use arbitrary values with raw colours or lengths (`bg-[#fff]`, `p-[13px]`): lint rejects them.
- **Spacing numbers are px.** `p-16` = 16px (`--spacing-16`), not Tailwind's `p-4` = 1rem.
  Prefer the relationship roles (`gap-group`, `p-card`) over numbers.
- The React components (Button, Dialog, Table…) work here too; use them for anything
  interactive instead of rebuilding a button from classes.
- Lucide icons only, through `<Icon>`. Manrope only.

---

## 1. Install

```bash
npm install https://github.com/DM3F/sebenarnya.my/releases/download/ds-v0.1.0/sebenarnya-design-system-0.1.0.tgz
```

```bash
npm install lucide-react @fontsource/manrope
```

`@fontsource/manrope` bundles the font files inside the extension (an extension's content
security policy blocks font CDNs).

## 2. Tailwind config

`tailwind.config.js` (or `.cjs`):

```js
module.exports = {
  presets: [require('@sebenarnya/design-system/tailwind-preset')],
  content: ['./src/**/*.{ts,tsx,html}'],
};
```

No `theme.extend` with colours or sizes of your own: a value the extension needs belongs in
the design system's `tokens.css`.

## 3. CSS entry

```css
@import '@fontsource/manrope/400.css';
@import '@fontsource/manrope/500.css';
@import '@fontsource/manrope/600.css';
@import '@sebenarnya/design-system/tokens.css';
@import 'tailwindcss/base';
@import '@sebenarnya/design-system/base.css';
@import 'tailwindcss/components';
@import '@sebenarnya/design-system/ui.css';
@import 'tailwindcss/utilities';
```

Everything is an `@import` (Tailwind 3's way to mix its layers with other files; an `@import`
after a `@tailwind` line is dropped). Tokens first, then Tailwind's preflight, then our base on top of it. `ui.css` is only needed
when you use the React components. `--font-sans` falls back to `Manrope`, the family name
`@fontsource` registers.

For a dense popup or side panel, put `data-density="compact"` on its root element. The popup's
width is the browser's frame, set once in the popup page's own CSS (`body { width: 360px } /* ds-allow: popup frame */`).

## 4. Build UI

```tsx
import { Button, Verdict } from '@sebenarnya/design-system';

export function Popup() {
  return (
    <div className="bg-background p-card flex flex-col gap-group">
      <div className="flex flex-col gap-text">
        <p className="text-eyebrow uppercase text-muted-foreground">Sebenarnya.my</p>
        <h1 className="text-heading text-foreground">Semak mesej ini?</h1>
        <p className="text-body text-text-secondary">Kami jumpa satu semakan rasmi yang sepadan.</p>
      </div>
      <div className="flex flex-col gap-text p-card-sm rounded-card bg-muted">
        <Verdict type="palsu" agency="KPDN" />
        <p className="text-title text-foreground">Pautan bantuan tunai melalui WhatsApp</p>
      </div>
      <Button>Baca semakan</Button>
    </div>
  );
}
```

| Need | Class |
|---|---|
| Colour | `bg-background` `bg-muted` `bg-card` `text-foreground` `text-text-secondary` `text-muted-foreground` `border-border` `border-input` |
| Text (size + line height + weight) | `text-display` `text-heading-lg` `text-heading` `text-title` `text-body` `text-body-sm` `text-label` `text-eyebrow` `text-caption` `text-stat` |
| Spacing by relationship | `gap-inline` `gap-text` `gap-group` `gap-cards` `gap-block` · `p-card-sm` `p-card` `p-card-lg` |
| Size | `h-control` `h-control-sm` `h-control-lg` · `size-avatar` `size-dot` |
| Shape | `rounded-control` (pressed things) `rounded-badge` `rounded-card` `rounded-card-lg` `rounded-field` `rounded-full` (circles) |
| Effects | `shadow-float` `shadow-overlay` `duration-fast` `ease-out` `z-dropdown` |
| Focus | `focus-visible:outline outline-focus outline-offset-focus` |
| Breakpoints | `xl:` `lg:` `md:` `sm:` are **max-width** (1280 · 1100 · 900 · 600) |

The full list is generated from `tokens.css`; see `docs/README.md` › Browser extension.

## 5. Lint

```json
{ "scripts": { "lint:ds": "sebenarnya-lint-ds src" } }
```

Run before every commit and in CI. Besides the CSS rules it rejects Tailwind arbitrary values
with raw colours or lengths, other icon libraries and other fonts.

## Not covered yet

If the extension injects UI **into other websites** (a content script), the design system's
global rules would mix with the host page. That needs a scoped mode (Shadow DOM, fixed sizes)
which does not exist yet: ask the design system owner before building it. Popup, side panel
and options pages are fine as they are.

---

## Prompt for an AI coding agent

> Apply the Sebenarnya design system to this browser extension by following
> https://github.com/DM3F/sebenarnya.my/blob/main/docs/adopting-extension.md step by step.
> Keep Tailwind CSS 3.4 and use the `@sebenarnya/design-system/tailwind-preset` preset; use only
> preset classes (no default Tailwind colours or sizes, no arbitrary values with colours or px,
> no `theme.extend`). Use the package's React components for buttons, dialogs, forms and tables,
> Lucide icons through `<Icon>`, and Manrope from `@fontsource/manrope`. Do not copy or edit the
> package's files. Finish only when `npm run lint:ds` prints "Design system: clean." and the
> extension builds. List anything the design system could not cover instead of inventing a style.
