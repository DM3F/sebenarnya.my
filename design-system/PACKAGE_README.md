# @sebenarnya/design-system

The Sebenarnya.my design system: tokens, base and component CSS, React components (with
TypeScript types), a Tailwind CSS 3.4 preset and a lint that keeps a product on-system.

Built from [`DM3F/sebenarnya.my`](https://github.com/DM3F/sebenarnya.my) (`design-system/`).
Do not edit these files in your product; change the design system there and install the
new version.

## Install

```bash
npm install https://github.com/DM3F/sebenarnya.my/releases/download/ds-v0.1.0/sebenarnya-design-system-0.1.0.tgz
```

`react`, `react-dom` and `lucide-react` are peer dependencies.

## Use

- **CMS (Next.js, plain CSS):** [docs/adopting-cms.md](https://github.com/DM3F/sebenarnya.my/blob/main/docs/adopting-cms.md)
- **Browser extension (React, Tailwind CSS 3.4):** [docs/adopting-extension.md](https://github.com/DM3F/sebenarnya.my/blob/main/docs/adopting-extension.md)
- **Rules (tokens, components, what lint checks):** [docs/design-system-rules.md](https://github.com/DM3F/sebenarnya.my/blob/main/docs/design-system-rules.md)
- **Look and feel:** [docs/design.md](https://github.com/DM3F/sebenarnya.my/blob/main/docs/design.md)
- **Every token and component, rendered:** the website's `/design-system/` page

| Import | What |
|---|---|
| `@sebenarnya/design-system/tokens.css` | Every value (colour, type, size, space, radius, motion) |
| `@sebenarnya/design-system/base.css` | Element defaults the components rely on |
| `@sebenarnya/design-system/ui.css` | Component styles |
| `@sebenarnya/design-system` | React components + types |
| `@sebenarnya/design-system/tailwind-preset` | Tailwind CSS 3.4 preset (classes read the tokens) |
| `npx sebenarnya-lint-ds` | The lint: hex colours, raw px, non-Lucide icons, off-system type… |
