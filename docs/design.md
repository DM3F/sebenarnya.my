# DESIGN.md — Sebenarnya.my

Taste and visual language. This document answers **"what should it feel like"**; the technical numbers (tokens, component sizes) are in [`design-system-rules.md`](design-system-rules.md) and `design-system/tokens.css`. When this document disagrees with the code, **the code is right**. Doc map: [`README.md`](README.md).

Taste reference: **elevenlabs.io** — only its *visual language* is borrowed (calm, materials, how colour is used, the rhythm of space). Its layouts, page structure, illustrations and content are **not** copied.

---

## 1. Identity

**The product:** Malaysia's official fact-check portal. People arrive unsure — they have just received a viral message — and leave with a clear answer: *Palsu, Makluman or Benar* (false, notice, true), with the official source.

**The feel:** calm, confident, editorial. Like a magazine printed on warm cream paper, not a government dashboard and not noisy social media. The interface steps back so that **the claim, the verdict and the official source** do the talking.

- **Calm, not cold.** Warm white (eggshell), ink black, stone greys. No corporate blue, no rainbow gradients.
- **Confident without shouting.** Large but light headings; no bold type to "convince". Certainty comes from clarity, not from weight.
- **Colour = meaning.** Colour appears only when it carries information (a verdict) or identity (the logo, the sphere). Everything else is achromatic.
- **Human.** Real photos, everyday Malay, softly rounded corners. Official but not bureaucratic.

Keywords: *warm paper · ink · quiet authority · one spark of colour*.

---

## 2. Palette

Almost everything is warm achromatic (±97%). Chromatic colours are locked to specific roles.

### Neutrals (the canvas)

| Role | Colour | When |
|---|---|---|
| Canvas | `#FDFCFC` eggshell | Page background, control backgrounds (search, chip, outline button). Not pure white — slightly warm. |
| Raised surface | `#FFFFFF` | Only for something that must "lift" off the canvas: the selected panel in a segmented control, a dropdown. |
| Stage | `#F5F3F1` warm taupe | Bands, article card backgrounds, areas that frame content. Elevation comes from **tone**, not shadow. |
| Inset / divider | `#EBE8E4` stone | Hairlines, disabled fills, empty thumbnails, progress tracks. |
| Edge | `#D7D2CC` | Pill and card borders (0.5–1px). |
| Strong edge | `#878179` | Input field borders (3:1 contrast). |
| Muted text | `#6F6A63` smoke | Eyebrows, meta, dates, placeholders, icons. |
| Strong body text | `#44403B` graphite | Long paragraphs, ledes. |
| Ink | `#000000` | Headings, labels, primary buttons. |
| Decoration only | `#A59F97` ash | Lines and ornaments. **Never for text.** |

### Chromatic (locked)

| Role | Colour | When |
|---|---|---|
| Primary action | Ink `#000` | One filled button per screen (e.g. "Salur Kepada Kami", "Semak"). Actions are **never red**. |
| Focus / link | Ink `#000` (on dark or photos: white) | 2px focus ring (offset 2) and the field border while focused; text links = ink + underline. **No blue or violet** on focus or links. |
| Brand | Kebenaran red `#E8302A` | The logo and identity elements (the sphere, the atmosphere). Not for buttons, navigation or ordinary errors. |
| Verdict — Palsu | dot `#E8302A`, text `#C8211C` | Verdict labels only. |
| Verdict — Makluman | dot `#3A46F5`, text `#2F5FD0` | Verdict labels only. |
| Verdict — Benar | dot `#1FA463`, text `#137A49` | Verdict labels only. |

**Taste rules:**
- One "spark" of colour per view is enough. If a screen has more than two chromatic colours outside verdicts, something is wrong.
- A verdict colour **always** comes with its word (dot + WORD) — colour never works alone.
- Photos may be full colour; the interface around them stays achromatic so the photo does the talking.
- Gradients in one place only: the brand sphere / atmospheric field (soft, blurred, like light). Never on buttons, cards or section backgrounds.

---

## 3. Typography

**One family: Manrope.** One voice from the hero heading to button labels and numbers. Contrast comes from **size and colour**, not from switching fonts or going bold.

> Note: Inter and `--font-ui` were removed from the code (21 Nov 2026). Manrope is the only family.

| Role | Size (375 → 1280px) / line height | Weight | Used for |
|---|---|---|---|
| Display | 32 → 48 fluid / 1.2 | **500** | Page H1 only (hero, article detail, About us). **48px is the largest size on the site.** |
| Section | 28 → 36 fluid / 1.2 | 500 | Section H2, carousel slide titles and the WSIS banner: all the same weight as Display. |
| Heading | 20 → 24 fluid / 1.2 | 500 | Feature titles / subheadings inside a section, large card titles, pop-up titles. |
| Title | 18 → 20 fluid / 1.2 | 500 | Card titles. |
| Numbers (statistics) | 36 → 48 fluid / 1.2 | **400** | Every statistic. Units (juta+, ribu, jam) at 0.42em. Tabular figures. |
| Lead | 16 / 1.5 | 400 | The intro paragraph under a heading. Same size as Body; set apart by graphite colour (not ink) and space. |
| Article | 16 → 18 fluid / 1.5 | 400 | Body text in the article reading column only. |
| Body | 16 / 1.5 | 400 | Body text (`body` = 16). Graphite. Line length at most ±68 characters. |
| Label (buttons, nav, chips) | 16 / 1.5 (small: 14) | 500 | Sentence case. |
| Small / meta | 14 / 1.5 · caption 12 / 1.5 | 400–500 | Dates, meta, small labels. Smoke. |
| Eyebrow | 13 / 1.5 | 500 (verdict 600) | UPPERCASE, tracking +0.04em (the only tracking that is not 0): verdicts, eyebrows, footer headings. |
| Eyebrow badge | 13 / 1.5 | 400 | Natural case, smoke text, soft pill edge (35% of the text colour), no fill: the section label above a heading (`Badge variant="eyebrow"`). |

The role tokens live in `design-system/tokens.css` (`--text-display`, `--text-heading-lg` = Section, `--text-heading`, `--text-title`, `--text-intro`, `--text-article` (article body only, 16 → 18), `--text-body` (16, Lead included), `--text-stat` = Numbers … + `--line-height`). Large sizes are **fluid** with `clamp()` between 375px and 1280px, so each size is one smooth range (e.g. Display 32 → 48) with no media queries. The "Type roles" block at the end of `app/global.css` maps each website class to its role. Full table: `docs/design-system-rules.md` › Type roles.

**Font weight:** every heading is 500 (hero Display, section headings, heading, title) so it is clearly apart from 400 body text; statistics 400; 600 for verdicts only.

**Line height & tracking:** every heading 1.2, all other text 1.5. Tracking 0 everywhere (Manrope is balanced as drawn), except small UPPERCASE labels (+0.04em).

**Taste rules:**
- No weight 700+ anywhere. Emphasis = size, ink vs smoke, or white space.
- Short headings, deliberately broken into 2 balanced lines.
- UPPERCASE only for small labels (verdicts, footer eyebrows) — never for headings.
- A statistic is the "heading" of its block: let it be large, light and breathing; the caption under it small and muted.

---

## 4. Components

Shape language: **pills for what you press, softly rounded boxes for what you read.** Hairlines, not shadows.

### Card
- 20px corners (large cards 24px). Warm taupe on the eggshell canvas — a card "sits" on the paper, it does not float.
- No shadow at rest. If separation is needed, a 0.5–1px `#D7D2CC` border or a layer of tone.
- Media inside a card: 12px corners (concentric with the card's 8px padding).
- Photos may run full-bleed with a soft dark scrim behind the text; white text on a photo must pass 4.5:1.
- Hover: a subtle photo zoom (1.03), not a jumping card or a growing shadow.

### Chart
- Monochrome by default: ink or graphite lines and bars on the canvas, `#EBE8E4` hairline grid, 13–14px smoke labels.
- Only one series may be coloured — and its colour must mean something (e.g. a verdict). Everything else is grey.
- No 3D, no gradient fills, no colourful legends. Labelling the line or bar directly beats a legend.
- Numbers in charts use Manrope's tabular figures, weight 400.

### Meter (progress / score / count)
- Track: a thin pill (4–8px) in `#EBE8E4`; fill: ink `#000`.
- For a status (e.g. a check in progress) the fill may use a verdict colour — only when it carries meaning.
- The value beside the meter: a large number at weight 400 + a small unit; no doubled percentages.
- Autoplay meters (e.g. carousel dots) fill linearly and stop when paused.

### Buttons
- Every button is a **pill**, label 16 Medium. Height follows the fluid control scale: `sm` 32 → 36 · `md` 40 → 44 (default) · `lg` 44 → 48; the touch target is always 44.
- **Filled** (ink, white text) — one per screen, for the most important action.
- **Outline** (canvas + 1px border) for secondary actions; **ghost** (no border, underlined label) for quiet text actions; **quiet** (no fill, no underline, tinted on hover) for toolbars, pagination and row actions.
- On photos: a white/canvas pill with ink text.
- Lucide icons at 16px, 1.75px stroke, after the label (arrows) or before it (download, share).
- Press: scale 0.97 (`--press-scale`). Hover: a slightly lighter tone. Focus: 2px ink ring, offset 2px (white on photos and dark). No blue or violet.

### Other controls
- Segmented control / tabs: a canvas pill container with a thin border; the selected item "lifts" to white with a fine border — no colour.
- Search: a large pill, strong border, icon on the left, filled button on the right.
- Chip: a taupe pill, the same height as a button (scale `sm` · `md` · `lg`); selected = ink.

---

## 5. Density

**Spacious — low density, high confidence.**

- White space is the main material. Sections are 64 → 120px apart (fluid, phone → desktop), about 3× the heading → content gap (24 → 40); page gutter 96px on desktop.
- One idea per section: one heading, one row of content, one action. Never stack three grids on one screen.
- Inside a tight group (8–16px), the space between groups is at least 2× larger. Space builds the structure, not lines.
- Small text (13–14px) may be dense; headings and big numbers need room to breathe.
- Cards in a grid: 3–4 per row on desktop, always the same height. No rows of 6 mini cards.
- **Spacing by relationship, not by number:** inside a text group 8, between groups inside a card 16, between cards 16 → 24, section heading → content 24 → 40, between sections 64 → 120.
- **Card size decides padding + radius together:** small 16/20, regular 24/20 (default), large 32→24/24 (feature, modal). A gap inside a card is never larger than the card's padding. Full table: `docs/design-system-rules.md` › Spacing & radius roles.
- When in doubt: remove one element, don't shrink everything.
- **Four breakpoints only:** 1280 · 1100 · 900 · 600. Paragraph reading width at most 68ch; centred section heads 720px.
- **Tools (the CMS) use `data-density="compact"`:** the same components with shorter controls and tighter gaps (`design-system-rules.md` › Density). The public website stays spacious.

---

## 6. Dials

Scale 1–3 (1 = low, 3 = high).

| Dial | Value | Meaning |
|---|---|---|
| **ENERGY** | **1** | Calm. Achromatic, light headings, one spark of colour. No busy illustrations, no stickers, no emoji. Energy comes only from photos and verdicts. |
| **RHYTHM** | **2** | Orderly but not dull. A consistent grid, broken by one large element per section (a lead card, a big number, a full-bleed carousel). Heading left / content right repeats as a motif. |
| **MOTION** | **2** | Moves with purpose. Carousels and card rows glide slowly (autoplay, stopping on hover or focus), cards flip, photos zoom subtly. Strong ease-out, 150–600ms. **One entrance per page, on load only** (`components/PageEnter.js`): the page head enters in sequence, 100ms apart (the hero H1 rises line by line from a 600ms mask; lede, search, article title: opacity + 4px blur + 12px rise, 300ms). Nothing reveals on scroll: sections below the first screen are already there, so no content is hidden and there are no scroll listeners. A page change is a 250ms crossfade only (the most frequent action). Menus and modals have one style each (menu 150ms, modal 250ms in and out). Exception: the logo folder pop-in (its own choreography). No parallax, and `prefers-reduced-motion` stops all autoplay motion. |

---

## 7. Do / Don't

| Do | Don't |
|---|---|
| Let photos and verdicts be the only colour | Red buttons, coloured section backgrounds, gradients on cards |
| Headings at weight 500, big numbers at 400 | Bold 700 to "grab attention" |
| Large, light statistics | Bold numbers in coloured boxes |
| Pills for every action | Sharp rectangular buttons mixed with pills |
| Elevation through tone (eggshell → taupe → stone) | Layered shadows on every card |
| One filled button per screen | Three black buttons side by side |
| White space as the separator | A divider line between every block |
| Thin-stroke Lucide icons | Emoji, text glyphs (↗ →), mixed icon sets |

---

## 8. Decisions & gaps with the current implementation

Decisions (21 Nov 2026 onwards):

| # | Topic | Decision | Implementation status |
|---|---|---|---|
| 1 | Font family | **Manrope only.** Remove Inter / `--font-ui`. | ✅ Done. |
| 2 | Display weight | Every heading **500** (display included); body and statistics 400. | ✅ Done. |
| 3 | Large numbers | **400** for every statistic. | ✅ Done (`--font-weight-display`). No weight 300 left. |
| 4 | Tanya AIFA | **Keep it red for now** (no better idea yet). | Still open in `plan.md`. |
| 5 | Charts & meters | The § 4 guidelines are the starting point when needed (e.g. the CMS dashboard). | ✅ Done: `Stat`, `Meter`, `BarList`, `BarChart` (monochrome). |
| 6 | System-status green | `--color-success` (dark green) for status in tools such as the CMS: "Disimpan", "Diterbitkan". Only on `Alert` icons and edges (and toast icons), never as a background or a button colour. Not a verdict: the Benar verdict keeps its own token. | ✅ Decided 26 Nov 2026. |
| 7 | Touch target in compact density | 24px (WCAG 2.2 AA 2.5.8) in `data-density="compact"`, because 44px targets overlap 40px table rows. Compact is only for mouse-first desktop tools (the CMS); the website and anything used on a phone keep 44px. | ✅ Decided 26 Nov 2026. |
| 8 | Warning colour | No warning colour (yellow/amber) in the palette. `Alert` is default · success · destructive only; a warning is written in clear words in a default `Alert`. Add a colour only if a real need appears, as a new token. | ✅ Decided 26 Nov 2026. |

For every new decision, update together: `design-system/tokens.css`, `design-system-rules.md` and this file.
