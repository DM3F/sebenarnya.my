# Changelog — @sebenarnya/design-system

Install a version: `npm install https://github.com/DM3F/sebenarnya.my/releases/download/ds-vX.Y.Z/sebenarnya-design-system-X.Y.Z.tgz`.
How versions are numbered and released: [`docs/contributing.md`](../docs/contributing.md).

## 0.2.0 — 28 Nov 2026

- **Badge:** new `variant="eyebrow"` for the section label above a heading: 13px regular, smoke
  text, no fill, soft 1px edge (35% of the text colour). On dark surfaces set `--badge-fg` to an
  inverse tier and the edge follows.
- **Verdict:** four verdicts: `palsu`, `penjelasan` (green, replaces `benar`), `waspada` (new,
  amber) and `makluman`. Tokens `--color-verdict-penjelasan(-dot)` and
  `--color-verdict-waspada(-dot)`; `--color-verdict-benar(-dot)` removed. Chip `dot` takes the
  same four keys. **Breaking:** `type="benar"` now falls back to `makluman`; use `penjelasan`.

## 0.1.0 — 26 Nov 2026

First release.

- **Tokens** (`tokens.css`): palette, semantic colours, type roles (fluid 375 → 1280),
  control scale sm · md · lg · xl, spacing roles, shape roles (`--radius-control`,
  `--radius-badge`, `--radius-card`…), motion, z layers, chart tokens, and
  `data-density="compact"` for tools.
- **Base** (`base.css`) and **component styles** (`ui.css`).
- **React components** with TypeScript types: Button (+ quiet), IconButton, Chip, Badge,
  Verdict, Tabs, SearchField, Field / Input / Textarea / Select, Checkbox, Switch, RadioGroup,
  NavLink, DropdownMenu, LanguageMenu, Breadcrumb, Pagination, Card, Table, Alert, toast /
  Toaster, Tooltip, Dialog, ConfirmDialog / confirmDialog, Skeleton, Avatar, EmptyState,
  Separator, AppShell (Sidebar, Topbar, PageHeader, PageContent), Stat, Meter, BarList,
  BarChart, Sparkline, Icon.
- **Tailwind CSS 3.4 preset** (`tailwind-preset`): every class reads a token.
- **Lint** (`sebenarnya-lint-ds`).
