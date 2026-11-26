# Adopting the design system in the CMS (Next.js · TypeScript · plain CSS)

For developers and AI coding agents. Follow the steps in order; each ends in something
you can check. The result: the CMS looks and behaves like one product with the website,
and `sebenarnya-lint-ds` keeps it that way.

**Ground rules (read first)**

- The design system is a package. **Never copy its files into the CMS and never edit them.**
  A change belongs in `DM3F/sebenarnya.my` (`design-system/`); the CMS installs the new version.
- **Use the components; do not rebuild them.** No shadcn/ui install, no Radix, no Tailwind,
  no other icon set, no other font. The components already follow shadcn/ui's API.
- **CMS CSS may lay things out, never restyle a component.** Page CSS sets grid, gap, width,
  order. Colours, type, sizes, radius and shadows come from tokens (`var(--…)`), never raw values.
- Rules in full: [`design-system-rules.md`](design-system-rules.md). Look and feel:
  [`design.md`](design.md). Every token and component rendered: the website's `/design-system/` page.

---

## 1. Install

```bash
npm install https://github.com/DM3F/sebenarnya.my/releases/download/ds-v0.1.0/sebenarnya-design-system-0.1.0.tgz
```

```bash
npm install lucide-react
```

(`react` and `react-dom` come with Next.js.) Before the first release exists, install the
local build instead: in `sebenarnya.my` run `npm run build:ds`, then
`npm install /path/to/sebenarnya.my/design-system/sebenarnya-design-system-0.1.0.tgz`.

**Check:** `node_modules/@sebenarnya/design-system/tokens.css` exists.

## 2. Root layout: CSS, font, density, hosts

`app/layout.tsx`:

```tsx
import '@sebenarnya/design-system/tokens.css';
import '@sebenarnya/design-system/base.css';
import './cms.css'; // the CMS's own layout CSS (optional), between base and ui
import '@sebenarnya/design-system/ui.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ConfirmDialogHost, Toaster } from '@sebenarnya/design-system';

// Manrope is the only family. tokens.css reads it through --font-manrope.
const manrope = Manrope({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-manrope' });

export const metadata: Metadata = { title: 'Sebenarnya CMS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-density="compact": the CMS is a desktop tool (shorter controls, 40px table rows)
    <html lang="ms" data-density="compact" className={manrope.variable}>
      <body>
        {children}
        <Toaster />
        <ConfirmDialogHost />
      </body>
    </html>
  );
}
```

Order matters: tokens → base → CMS CSS → ui. No root `font-size`; every size is px.

**Check:** `npm run dev`, the page background is warm white (`#FDFCFC`) and text is Manrope.

## 3. App shell: sidebar, top bar, page

One client component wraps every signed-in page, e.g. `app/(cms)/layout.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileCheck, Inbox, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import {
  AppShell, Avatar, IconButton, Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarHeader, SidebarItem, SidebarTrigger, Tooltip, Topbar,
} from '@sebenarnya/design-system';

const NAV = [
  { group: null, items: [{ href: '/', label: 'Ringkasan', icon: LayoutDashboard }] },
  { group: 'Kandungan', items: [
    { href: '/semakan', label: 'Semakan fakta', icon: FileCheck },
    { href: '/aduan', label: 'Aduan masuk', icon: Inbox, count: 12 },
  ] },
  { group: 'Pentadbiran', items: [{ href: '/tetapan', label: 'Tetapan', icon: Settings }] },
];

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <AppShell
      sidebar={
        <Sidebar>
          <SidebarHeader>Sebenarnya CMS</SidebarHeader>
          <SidebarContent>
            {NAV.map(({ group, items }) => (
              <SidebarGroup key={group ?? 'top'} label={group ?? undefined}>
                {items.map((i) => (
                  <SidebarItem key={i.href} as={Link} href={i.href} icon={i.icon} count={i.count}
                    current={i.href === '/' ? path === '/' : path.startsWith(i.href)}>
                    {i.label}
                  </SidebarItem>
                ))}
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <Avatar alt="Nur Aisyah" size="sm" />
            <span>Nur Aisyah</span>
            <Tooltip content="Log keluar"><IconButton icon={LogOut} label="Log keluar" variant="quiet" size="icon-sm" /></Tooltip>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Topbar><SidebarTrigger /></Topbar>
      {children}
    </AppShell>
  );
}
```

Each page renders its own `PageContent` (the `<main>`) and one `PageHeader`:

```tsx
import { Plus } from 'lucide-react';
import { Button, PageContent, PageHeader } from '@sebenarnya/design-system';

export default function SemakanPage() {
  return (
    <PageContent>
      <PageHeader title="Semakan fakta" description="Semua semakan, draf dan yang menunggu agensi."
        actions={<Button icon={Plus}>Semakan baharu</Button>} />
      {/* Card, Table, Pagination… */}
    </PageContent>
  );
}
```

**Check:** the sidebar is 260px wide on desktop; below 900px it becomes a drawer opened by
the menu button, and Escape closes it.

## 4. Build pages from components

| Need | Use | Not |
|---|---|---|
| Any action | `Button` (`filled` once per view, `outline`, `quiet` in toolbars and rows) | a styled `<div>` or `<a>`; a red button |
| Icon-only action | `IconButton` with a Malay `label`, in a `Tooltip` | an icon without a name |
| Panel / group | `Card` (`outline` for work panels) | a custom box with its own border and shadow |
| Rows of data | `Table` + parts, `TableHead sort onSort`, `TableRow selected`, `align="num"` | a grid of divs |
| Pages of rows | `Pagination` | custom page buttons |
| Form | `Field` + `Input` / `Textarea` / `Select`; `Checkbox`, `Switch`, `RadioGroup` | a bare `<input>` without a visible label |
| Search / filter | `SearchField size="sm" buttonLabel={null}` | a custom search box |
| Status label | `Badge`; fact-check result: `Verdict` (palsu · makluman · benar only) | coloured text |
| Message on the page | `Alert` (default · success · destructive) | a coloured box |
| Short confirmation | `toast('Disimpan')` | `alert()` |
| Confirm before delete/publish | `await confirmDialog({ title, confirmLabel: 'Padam', variant: 'destructive', onConfirm })` | `window.confirm()` |
| Edit in a window | `Dialog` with `footer` buttons | a custom modal |
| Numbers | `Stat`, `Meter`, `BarList`, `BarChart` (monochrome) | a chart library with its own colours |
| Loading / nothing yet | `Skeleton` / `EmptyState` | a spinner, an empty table |
| Where am I | `Breadcrumb` in the `Topbar` | |

Full props: the TypeScript types (`node_modules/@sebenarnya/design-system/react/index.d.ts`)
and the component table in [`design-system-rules.md`](design-system-rules.md) § 3.

Text only for screen readers (e.g. an empty column heading): `className="ui-sr-only"`.
There is no Tailwind in the CMS, so `sr-only` does nothing.

Layout CSS for a page uses spacing roles, never numbers:

```css
.semakan-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--gap-cards); }
@media (max-width: 900px) { .semakan-grid { grid-template-columns: 1fr; } }
```

Breakpoints: 1280 · 1100 · 900 · 600, `max-width` only.

## 5. Lint: keep it on-system

`package.json`:

```json
{ "scripts": { "lint:ds": "sebenarnya-lint-ds app components" } }
```

Run `npm run lint:ds` before every commit and in CI; it exits 1 on a problem. It rejects hex and
rgb colours, raw px in spacing and radius, font sizes outside the type roles, other icon
libraries, other fonts, `rem`, and more. A deliberate exception carries `/* ds-allow: reason */`
on the same line.

**Check:** `npm run lint:ds` prints `Design system: clean.` and `npm run build` passes.

## 6. Updating

When the design system releases a new version, change the version in the install URL
(`ds-vX.Y.Z/sebenarnya-design-system-X.Y.Z.tgz`), run `npm install`, then `npm run lint:ds`
and look at a few screens. Never patch the package locally.

---

## Prompt for an AI coding agent

Paste this into the agent working in the CMS repo:

> Apply the Sebenarnya design system to this CMS by following
> https://github.com/DM3F/sebenarnya.my/blob/main/docs/adopting-cms.md step by step.
> Install `@sebenarnya/design-system` from the release URL in step 1. Use only its components,
> tokens and Lucide icons: do not install shadcn/ui, Radix or Tailwind, do not copy or edit
> the package's files, and do not add colours, font sizes, radii or px spacing of your own.
> Replace existing buttons, tables, forms, dialogs and alerts with the components in the
> table in step 4. When unsure which component or prop to use, read
> `node_modules/@sebenarnya/design-system/react/index.d.ts` and
> https://github.com/DM3F/sebenarnya.my/blob/main/docs/design-system-rules.md.
> Finish only when `npm run lint:ds` prints "Design system: clean." and `npm run build` passes.
> List anything the design system could not cover instead of inventing a style for it.
