# Sebenarnya.my — Design System Plan

The design system's work checklist. Update this file **in the same commit** whenever an item is done (website page notes: `docs/website-changelog.md`).

> **Source of truth:** the code in this repo (`design-system/tokens.css`, `design-system/ui.css`, `design-system/react/`) together with [`design.md`](design.md) and [`design-system-rules.md`](design-system-rules.md). The Paper file `sebenarnya.my` is **no longer a reference**: its canvas does not match the current design. Never copy values or layouts from Paper.
- Full spec: [`design-system-rules.md`](design-system-rules.md) · doc map: [`README.md`](README.md) · website history: [`website-changelog.md`](website-changelog.md) · how to ask for or make a change: [`contributing.md`](contributing.md).
- Branches: every change reaches `main` through a pull request. The early website work happened on `endahbyu`.
- Scope: the Sebenarnya.my website (Next.js 16, plain CSS). Since 25 Nov 2026 the design system also serves the **CMS dashboard** and the **browser extension**: see *Handover to other products* below and [`README.md`](README.md).

**Standing rules**
- Components use **semantic tokens only** (`--color-background`, `--color-foreground`, `--color-muted*`, `--color-border*`, `--color-primary*`, `--color-ring`, `--color-verdict-*`…) plus the type roles, spacing roles and shape roles. Never palette primitives.
- Font: **Manrope only** (content, headings, navigation and UI controls). Every heading and label **Medium 500**; body and statistics **400** (`--font-weight-display`); 600 for verdicts only. Nothing above 600. See [`design.md`](design.md).
- Kebenaran red is not an action colour (buttons, links, nav).
- Icons: **Lucide** only, through `design-system/react/Icon.js` (1.75px stroke with `absoluteStrokeWidth`, currentColor, `aria-hidden`). Brand logos (Facebook, TikTok…) stay as brand SVGs.
- Every interactive label (button, nav, tab, chip, dropdown, CTA, footer link) = **16 / 24 Medium**.
- **px** only in tokens and components (no `rem`): the website sets `html { font-size: 62.5% }`.

Legend: `[x]` done & pushed · `[~]` partly · `[ ]` not yet · `[?]` needs the owner's decision

---

## Phase 1 — Foundations (tokens & font)

- [x] Manrope through `next/font` (`app/layout.js`); Inter removed
- [x] `design-system/tokens.css`: primitive, semantic, type scale, weight, spacing, radius, shadow, container, mobile scale
- [x] Old `:root` variables in `global.css` mapped to tokens
- [x] Heading weight rules in the docs (every heading 500 — see `design.md`)
- [x] **One set of token names** in `design-system/tokens.css` (Tailwind v4 namespaces + shadcn-style semantic colours), three tiers: primitive → semantic → component.
- [x] Media overlay tokens: `--gradient-scrim-media`, `-media-wide`, `-bottom`, `-bottom-short`, `-top`
- [x] Motion tokens in `tokens.css`: `--duration-fast/base/slow/slower`, `--ease-out` (default), `--ease-in-out`, `--ease-emphasized`. The old `--ease`/`--slide` are gone; no hard-coded `cubic-bezier` left except the FlipCard flip curve
- [ ] Dark mode — deferred (not needed now, 26 Nov 2026).

## Phase 2 — Base components (`design-system/react/`, `design-system/ui.css`)

- [x] Button (filled, outline, secondary, ghost, quiet, media, link, disabled, `href`)
- [x] Chip + ChipRow
- [x] Tabs (tabs & toggle modes)
- [x] Verdict (palsu, makluman, benar — the only three; tone default/single)
- [x] SearchField (controlled, error)
- [x] NavLink
- [x] Dropdown menu (`DropdownMenu`) — for "Tentang Kami ▾"
- [x] Icons: Lucide (`lucide-react` ^0.577) through `Icon`; every hand-written SVG replaced (except brand logos)
- [x] Button: `sm` size + `media` variant (canvas button on images) + `secondary`, `iconEnd`
- [x] Round icon button: `IconButton`, used in the carousel, Latest, About us, Articles, dialogs
- [x] Field / Input / Textarea / Select (`design-system/react/Field.js`) — used in ClaimForm, Articles, AIFA
- [ ] Pagination dots as a shared component (only inside HeroCarousel for now).
- [x] Agency avatar: `Avatar` (32 / 40px, initials fallback)

## Phase 3 — Brand components & patterns (website)

- [x] Nav/Header: "Tentang Kami ▾" dropdown, Utama/Artikel nav, BM/EN switch; Manrope labels
- [ ] Nav/Header: "Hubungi kami" item (needs a `/contact/` page)
- [x] Footer — every page
- [x] Tanya AIFA floating button — dark red `--color-brand-strong` (5.56:1, passes AA), decided 21 Nov 2026
- [x] Article card (Articles grid), new elevenlabs.io-like style: white card + border, full-bleed photo, white verdict pill
- [x] FactCheckCard / flip card: one card open at a time, hover intent 90/140ms, opens 0.7s ease-out, closes 0.45s
- [x] "Semakan fakta terkini" section: endless automatic glide, stops on hover
- [x] 20 new articles (October 2026) with unique images; agency monogram when there is no logo
- [ ] New agency logos: MOF, JAIS, Kesultanan Pahang, PMO, JPM, Caltex, KTMB (monograms for now)
- [x] HeroCarousel: infinite loop, text on the centre slide only, slide counter, autoplay + dots + pause
- [x] Page transition between routes (`components/PageTransition.js`, View Transitions API)
- [x] PromoBanner / Award (WSIS)
- [x] Social media gallery ("Aktiviti media sosial"): 5 elastic cards without a slider; a folded card = platform gradient panel + centred icon
- [x] About us gallery: 3D sphere of round photos (drag + auto-rotate), click → photo-only dialog
- [x] AgencyLogoStrip ("Sumber kenyataan rasmi")
- [ ] Band: Closing, Announcement
- [ ] Timeline (About us)
- [ ] Function card, Feature card, Logo download card

## Phase 4 — Pages

| Route | Artboard | Status |
|---|---|---|
| `/` | Home | [x] Header, Hero (+ popular searches), HeroCarousel, Semakan fakta terkini, short About, Aktiviti media sosial (WSIS + SocialCarousel), footer |
| `/article` | Articles | [x] Code: filters (5 verdict chips), 4-column card grid, footer (`components/Articles.js`, `components/Footer.js`) |
| `/article/[slug]` | Article detail page | [x] Code: Verdict + category pill, 48/52 title, meta + Kongsi (share), 1100×550 image, 514 reading column (`components/ArticleDetail.js`) |
| `/about-us` | Tentang Kami | [x] Code: Hero (photo + Ikuti kami), About, Four functions, Berita dan Galeri, Logo (`components/AboutUs.js`, `LogoKit.js`). "Bagaimana kami menyemak" removed. |
| ~~`/logo`~~ | — | Removed (21 Nov 2026). The logo is now the `#logo` section of About us; the Tentang Kami › Logo menu item goes to `/about-us/#logo` |

- [x] Hero: new heading "Tidak pasti? Jangan kongsi / Semak dakwaan, Temukan kebenaran"

## Visual direction decisions (docs/design.md, 21 Nov 2026)

- [x] One font family: Manrope only — code and docs
- [x] Every heading weight 500 (display included) — code and docs (an earlier plan said 400; superseded)
- [x] Statistics weight 400 — code and docs
- [x] Tanya AIFA in dark red `--color-brand-strong` (decided 21 Nov 2026)
- [x] When in doubt, **follow design.md** (social media cards without gradients, meta 500)

## Phase 5 — Clean-up

- [x] Hard-coded hex in `global.css` replaced with semantic tokens (except platform brand colours on story cards and `#000` in `mask-image`, which is alpha only). Old `:root` aliases (`--text`, `--white`, `--red`…) removed
- [x] `font-weight: 700` replaced (not in the scale; 500/600 used). Every weight is now a `--font-weight-*` token
- [x] Hard-coded radii replaced with `--radius-*` tokens (circles keep `50%`)
- [x] No `rem` left in `ui.css` or `global.css`; off-scale font sizes mapped to `--text-*` (except the 9px agency monogram)
- [x] No `transition: all` left
- [x] Unused old CSS removed: ~700 lines (old posts/cards, pill-form, bento, old Articles layout, `hiw`, `.btn`). ClaimForm now uses `Button`

## Phase 6 — Quality & delivery (website)

- [x] Visual check of every page on desktop (1440) + mobile (390), axe WCAG 2.2 AA clean (22 Nov)
- [x] Accessibility: contrast (all text passes AA — scanned at runtime), keyboard focus (Tab through every page), `prefers-reduced-motion` (autoplay & ticker stop)
- [x] `npm run build` (static export) passes
- [x] Component catalogue page `/design-system` (noindex, not in the nav) — the visual reference
- [x] Website work merged to `main` (DM3F/sebenarnya.my#25 onwards)

---

## Phase 9 — Consistency check

`npm run lint:ds` (`scripts/lint-ds.mjs`, plain Node, no dependencies) checks the rules automatically: hard-coded colours, palette primitives in components, other icon libraries, Lucide icons without `<Icon>`, `rem`, weights outside the scale, `transition: all`, raw px in spacing and radius, off-system type, breakpoints, z-index, motion, focus rings, Tailwind arbitrary values and more. Exceptions carry `ds-allow:` on the same line. It runs in other products as `npx sebenarnya-lint-ds`.

- [x] Rule list turned into `npm run lint:ds`. Now: clean
- [~] Run in CI: the design-system release workflow lints before every release; the website's deploy workflow does not lint yet

### Manual visual check

| Check | Web |
|---|:-:|
| Font: Manrope only; every heading 500 | [x] |
| Interactive labels 16/24 Medium | [ ] |
| Verdict: the same 3 colours + dot everywhere | [ ] |
| Button / chip / tab fully round; input 8px; card 20px | [ ] |
| 2px `--color-ring` focus visible on every control | [x] |
| Lucide icons 1.75px, colour follows the text | [ ] |
| Red only for brand / errors, never for actions | [~] AIFA (decision 4 in `design.md`) |
| `prefers-reduced-motion` stops motion | [x] |
| Mobile 375 not clipped | [x] 390 |

---

## Open decisions

- [ ] **Logo SVG** — the owner will send the official SVG files (logo + icon). When they arrive: put them in `public/images/logo/` and add an SVG download next to the PNG (`logoPage.items` in `data/content.js`, `components/LogoKit.js`).
- [ ] **Logo usage terms** — the current text is a DEMO (`logoPage.terms`). Replace it with MCMC's official text before launch.

## Handover to other products (25 Nov 2026)

The agreed order. Gaps per product: [`README.md`](README.md) › Known gaps.

**Stacks of the other products (answered 26 Nov 2026):**

| Product | Framework | Language | Styling | shadcn / Radix |
|---|---|---|---|---|
| CMS dashboard | Next.js | TypeScript | Plain CSS | Not used yet |
| Browser extension | React | TypeScript | Tailwind CSS 3.4 | Not used yet |

- All repos are **separate** (website, CMS, extension), so the design system is a versioned package that each repo installs.
- No product has a component library yet: `design-system/react/` is the standard; shadcn/ui is a reference for API and accessibility only (translated into plain CSS + our tokens).
- Dark mode is **not needed** for now.
- The extension's UI surface (popup / side panel / content script) is not known yet. The design system focuses on UI/UX design and tokens; a scoped mode (Shadow DOM) only if the extension turns out to use a content script.

- [x] 1. Tidy the docs: contradictions in `design.md` fixed (violet focus → ink, 44 height → control scale, type table follows `tokens.css`, headings 500), `design-system-handoff.md` → `website-changelog.md` (website history, not a spec), product-neutral `README.md`.
- [x] 2. Style guide page `/design-system`: every token and component rendered from the real code (noindex, not linked from the nav).
- [x] 3a. `design-system/base.css`: element defaults (body, headings, links, form controls) moved out of `global.css`, so `tokens.css` + `base.css` + `ui.css` stand alone. Verified: 0 computed-style differences across 5,683 elements (4 pages).
- [x] 3b. Shape roles: pill controls in `global.css` (9) and `.ui-lang__trigger` now use `--radius-control`; badges (`.ui-badge`, `.ui-verdict` + 4 photo pills) use the new `--radius-badge`; `--radius-full` only for circles; `--radius-media` derives from `--radius-card` − 8. One line in `tokens.css` now reshapes every control, badge or card. Verified: 0 computed-style differences on the website.
- [x] 3. Package `@sebenarnya/design-system` (`design-system/`): tokens, base, ui, React + TypeScript types, Tailwind 3.4 preset, portable lint (`npx sebenarnya-lint-ds`), release workflow (Run workflow or tag `ds-vX.Y.Z` → `.tgz` in a GitHub Release). The website uses it from `design-system/`. The CMS and extension adoption guides were tested on fresh projects (Next.js + TypeScript: build, type check, lint and browser pass; Tailwind 3.4: every layer and the font in the output). **`ds-v0.1.0` released 26 Nov 2026** and installed from its public URL.
- [x] 4a. Tailwind CSS 3.4 preset for the extension (`design-system/tailwind-preset.cjs`): every token becomes a class that reads `var()`, class names are read from `tokens.css`, off-system values (`bg-red-500`, `text-sm`, `rounded-lg`) do not exist, no rem. Tested with Tailwind 3.4.17. Also: `--font-sans` now falls back to `'Manrope'` (it fell back to Times outside Next.js).
- [x] 4b. Compact density + dashboard components: `data-density="compact"` (token values only: controls 32/36/40/44, table rows 40, card padding 12/16/24, 24px hit area for desktop). New components (shadcn API, native elements, no Radix): Card, Table (sort + row selection), Checkbox, Switch, RadioGroup, Pagination, Breadcrumb, Alert, Toast, Tooltip, Skeleton, Avatar, EmptyState, Separator; Button variant `quiet`. New tokens: `--color-success` (system status, never a verdict), `--size-row`, `--size-check`, `--size-switch`, `--size-toast`, `--size-sidebar`, `--radius-check`, `--spacing-36`. All on `/design-system` › Komponen dashboard, including the CMS panel in default vs compact.
- [x] 4c. App shell: `AppShell`, `Sidebar` (+ Header, Content, Group, Item with `count`, Footer), `SidebarTrigger`, `Topbar`, `PageContent`, `PageHeader`. Compact by default. At ≤900 the sidebar becomes a drawer: focus moves in and back, Escape / scrim / a link close it, the page behind is `inert`. Design-system parts only: the CMS repo fills the menu and the pages.
- [x] 4d. Dialogs: `Dialog` (short tasks, sizes sm/md/lg) and `ConfirmDialog` / `confirmDialog()` (role alertdialog, no scrim close, async onConfirm with a pending label and the error inside the dialog; destructive: focus starts on Batal + warning mark on the icon, the action button stays ink). Focus stays on the button while pending (aria-disabled, not disabled).
- [x] 4e. Charts and meters: `Stat` (+ sparkline), `Meter`, `BarList`, `BarChart` (monochrome, hairline grid, latest value labelled, hover tooltip, screen-reader table). Tokens `--color-chart*`, `--size-chart`, `--size-chart-bar`, `--size-meter`, `--size-sparkline`.
- [x] 4. Manrope for the extension: `@fontsource/manrope` (in the guide). Scoped mode (Shadow DOM) only if the extension uses a content script.
- [x] Contribution process: [`contributing.md`](contributing.md), owner `endahbyu`, CODEOWNERS, request template, PR template, `design-system/CHANGELOG.md`.
- [ ] 5. Dark mode: **deferred** (not needed, 26 Nov 2026).
- [ ] 6. Optional: Figma variables, text styles and components generated from the code.

**Design decisions (26 Nov 2026, approved by the owner):** `--color-success` for system status (icon + edge only) · 24px touch target in compact density (desktop tools only) · no warning colour; `Alert` stays default · success · destructive. Details: [`design.md`](design.md) § 8, decisions 6–8.
