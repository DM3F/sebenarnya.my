# Sebenarnya.my — Design System Handoff

Untuk: agent coding (Claude Code) yang akan implement design system baru ke repo `DM3F/sebenarnya.my` (branch `endahbyu`).
Sumber design: Figma `wxC95N2gmMWvBOWU1K7Nsy` (page "Design system" & "aratwork") dan Paper file `sebenarnya.my` (`01M7VAW17RGCJXGYKR590PX12M`, page "Design system" & "Artwork").

> Baca `AGENTS.md` dulu. Next.js dalam repo ni versi 16 — semak `node_modules/next/dist/docs/` sebelum ubah API/konvensyen.

---

## 0. Konteks repo (status sekarang)

- Next.js 16 + React 19, **JavaScript** (bukan TS), App Router, `output: "export"`, `basePath` `/sebenarnya-design` untuk production (GitHub Pages). Guna `withBase()` dari `lib/basePath.js` untuk path aset.
- Routes: `/` (Home), `/about-us`, `/logo`, `/article`, `/article/[slug]`.
- Styling: satu fail `app/global.css` (~3,900 baris), **tiada Tailwind**. Root font-size 62.5% → `1rem = 10px`.
- Font sekarang: Montserrat via `next/font` (`--font-montserrat`) dalam `app/layout.js`.
- Komponen sedia ada: `Header, Footer, Hero, Carousel, Latest, FlipCard, Bento, Stories, Viewership, Collaborators, Articles, ArticleDetail, AboutUs, Logo, LogoKit, ShareButton, Chatbot, ClaimForm, ScrollMotion`.

**Prinsip:** jangan tulis semula dari kosong. Tambah tokens → petakan variable lama ke tokens → kemas komponen satu per satu. Kekalkan routes, data (`data/content.js`, `lib/*`) dan behaviour (carousel, flip card, chatbot).

---

## 1. Brand idea

"Warm cream editorial, clear headlines." 97% akromatik; warna hanya pada logo, sphere, atmospheric field dan verdict. **Kebenaran Red bukan warna aksi** — jangan guna untuk button, link atau nav.

---

## 2. Design tokens

Cadangan: cipta `app/tokens.css`, import di atas `global.css` (dalam `layout.js`). Nilai dalam px — dalam CSS repo boleh tukar ke rem (÷10) ikut konvensyen sedia ada.

### 2.1 Primitive colors
```css
:root {
  /* Neutrals */
  --color-white: #ffffff;
  --color-eggshell: #fdfcfc;   /* canvas, cards */
  --color-warm-taupe: #f5f3f1; /* bands, stages, card fill */
  --color-stone: #ebe8e4;      /* dividers, plates, thumbnails */
  --color-pill-edge: #d7d2cc;  /* 0.5px pill edge */
  --color-ash: #a59f97;        /* decorative only, NEVER text */
  --color-field-edge: #878179; /* 1px input border (3:1) */
  --color-smoke: #6f6a63;      /* muted body, eyebrows */
  --color-graphite: #44403b;   /* strong body text, hover */
  --color-ink: #000000;        /* text, primary pill */

  /* Brand sparks (visual only) */
  --color-kebenaran-red: #e8302a;
  --color-red-ink: #c8211c;    /* small red text 5.6:1, error */
  --color-violet-spark: #3a46f5;

  /* Verdict: dot / text */
  --color-palsu-dot: #e8302a;    --color-palsu-text: #c8211c;
  --color-waspada-dot: #e08a00;  --color-waspada-text: #a35a00;
  --color-makluman-dot: #3a46f5; --color-makluman-text: #2f5fd0;
  --color-benar-dot: #1fa463;    --color-benar-text: #137a49;

  --color-focus: #2b7fff;
  --color-hairline: rgba(0,0,0,.05);
}
```

### 2.2 Semantic aliases (guna INI dalam komponen)
```css
:root {
  --surface-canvas: var(--color-eggshell);
  --surface-subtle: var(--color-warm-taupe);
  --surface-inset: var(--color-stone);
  --surface-raised: var(--color-white);
  --text-primary: var(--color-ink);
  --text-body: var(--color-graphite);
  --text-secondary: var(--color-smoke);
  --border-subtle: var(--color-stone);
  --border-field: var(--color-field-edge);
  --border-hairline: var(--color-hairline);
  --action-fill: var(--color-ink);
  --action-hover: var(--color-graphite);
  --action-foreground: var(--color-white);
  --focus-ring: var(--color-violet-spark); /* border fokus button */
}
```
(Mode dark ada dalam Figma frame "11 · Forms & themes" — belum wajib.)

### 2.3 Typography
Font: **Manrope** 300/400/500/600 (ganti Montserrat via `next/font/google`, variable `--font-manrope`).

| Token / style | Weight | Size / line | Tracking | Guna |
|---|---|---|---|---|
| Display/56 Medium | 500 | 56 / 60 | -0.02em | cover, hero headline, section display |
| Display/48 Medium | 500 | 48 / 52 | -0.02em | hero |
| Heading/48 Medium | 500 | 48 / 52 | -0.02em | tajuk slide carousel |
| Heading/36 | 500 | 36 / 42 | -0.02em | tajuk section |
| Heading/32 | 500 | 32 / 36 | -0.02em | closing band, lead story |
| Heading/24 | 500 | 24 / 32 | -0.01em | tajuk panel/kad |
| Heading/20 | 500 | 20 / 26 | 0 | tajuk kad artikel (page Artikel) |
| Heading/18 | 500 | 18 / 28 | 0 | subheading, tajuk kad kecil |
| Body/24 Large | 400 | 24 / 32 | -0.01em | intro Tentang Kami |
| Body/18 | 400 | 18 / 28 | 0 | intro, artikel body |
| Body/16 | 400 | 16 / 24 | +0.01em | default |
| Body/14 | 400 | 14 / 21 | +0.01em | meta, support |
| Label/18 (Button/Nav/Tab) | 500 | 18 / 24 | 0 | semua button, tab, nav |
| Eyebrow/14 | 500 | 14 / 20 | +0.01em | Smoke, sentence case |
| Verdict/13 | 600 | 13 / 18 | +0.04em | UPPERCASE |
| Caption/12 | 500 | 12 / 16 | +0.01em | tarikh, kredit |
| Stat/40 Light | 300 | 40 / 44 | -0.02em | angka statistik |
| Stat/32 Light | 300 | 32 / 36 | 0 | angka kecil (WSIS) |

**Peraturan: semua tajuk besar (Display & Heading) guna Medium 500** — contoh "Warm cream editorial, clear headlines." pada cover. Regular 400 hanya untuk body; Light 300 hanya untuk statistik.

Mobile (<600px): Display 38/42, Heading/36 → 30/36, Heading/32 → 28/34. Body kekal 400, max 68ch.

### 2.4 Spacing (4px base)
`4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 72, 96, 120`
- 8: gap pill berpasangan/chip · 12: gutter grid · 16: inset, margin mobile · 20: padding sisi pill · 24: title→body panel · 32: padding kad, margin desktop · 40: bawah header section · 64: padding stage · 96–120: jarak section, hero top.

### 2.5 Radius
`--radius-input: 8px` · `--radius-small: 12px` (thumbnail, media) · `--radius-card: 20px` (kad, stage, panel) · `--radius-card-lg: 24px` (feature card, hero stage) · `--radius-pill: 9999px` (SEMUA button, tab, chip, search).

### 2.6 Effects
```css
--shadow-subtle: 0 0 0 .5px rgba(0,0,0,.125), 0 1px 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04);
--shadow-subtle-2: inset 0 0 0 .5px rgba(0,0,0,.075);
--shadow-subtle-3: inset 0 0 0 .5px rgba(0,0,0,.10);
--shadow-float: 0 0 0 .5px rgba(0,0,0,.2), 0 8px 24px rgba(0,0,0,.12); /* Tanya AIFA sahaja */
```
Elevation datang dari tona (Eggshell → Warm Taupe → Stone), bukan shadow.

### 2.7 Layout
Page max 1280 (artwork frame 1624 = 81px side padding), rails 1180, side 32 / 16. Editorial grid 12 kolum, gap 12 (heading span 7, copy col 9–12). Breakpoints: 1100 nav · 900 stack · 600 type.

---

## 3. Pemetaan variable lama → token baru (`app/global.css`)

| Lama | Nilai lama | Baru |
|---|---|---|
| `--font` | Montserrat | `var(--font-manrope), 'Manrope', system-ui, sans-serif` |
| `--text`, `--dark` | #151618 | `var(--text-primary)` |
| `--bg` | #fff | `var(--surface-canvas)` |
| `--white` | #fff | `var(--surface-raised)` |
| `--dark-card` | #0c0d11 | `var(--color-ink)` |
| `--tag-bg` | #efeef0 | `var(--surface-subtle)` |
| `--tag-hover` | #e6e6ea | `var(--surface-inset)` |
| `--input-bg` | #f2f0f2 | `var(--surface-subtle)` (atau field putih + border, lihat Field/Search) |
| `--line` | #ceced0 | `var(--border-subtle)` |
| `--accent` | #314bff | `var(--color-violet-spark)` (visual sahaja) |
| `--orange` | #ff6b35 | `var(--color-waspada-dot)` |
| `--red` | #e51c23 | `var(--color-kebenaran-red)` |
| `--radius` | 26px | `var(--radius-card)` (20px); pill → `var(--radius-pill)` |
| `--gap` | 16px | kekal / `12px` untuk grid editorial |

Lepas tu cari hex keras dalam `global.css` (contoh `#6d6d72`, `#e2e2e5`, `#8a8a8f`, `#4a4a4f`, `#f5f5f7`, `#111215`, `#0d0e12`) dan gantikan dengan token semantik paling hampir (`--text-secondary`, `--border-subtle`, `--surface-subtle`, `--color-ink`).

Warna verdict dalam page Artikel lama (`#e51c23`, `#1d8a4e`, `#f56300`, `#0071e3`) → guna token verdict di 2.1.

---

## 4. Komponen (spec)

Cadangan: setiap komponen kongsi dalam `components/ui/` (Button, Chip, Tabs, Verdict, FieldSearch) + CSS dalam blok berasingan `global.css` atau CSS Modules. Semua guna token semantik.

### Button
- Asas: `height 44px; min-height 44px; padding 10px 20px; radius pill; Label/18; gap 8px` (ikon 16px).
- `filled`: bg `--action-fill`, text `--action-foreground`; hover bg `--action-hover`.
- `outline`: bg `--surface-canvas`, border `.5px solid --color-smoke`; hover bg `--surface-subtle`.
- `ghost`: bg `--surface-canvas`, text underline; hover bg `--surface-subtle`.
- `focus` (semua): `border: 2px solid --focus-ring`.
- `disabled`: bg `--surface-inset`, border `.5px --color-smoke`, text `--text-secondary`.
- Pasangan button: gap 8px. Props: `variant`, `size?`, `icon?`, `href?`.

### Chip
`height 44; padding 10px 12px; radius pill; bg --surface-canvas; border .5px --border-subtle; Label/18`. Hover `--surface-subtle`. Didahului label "Popular:" Body/14 Smoke.

### Tabs/Segmented (dan Language switcher)
Container `padding 3px; gap 2px; radius pill; bg --surface-canvas; border .5px --border-subtle`. Item = Chip; item terpilih bg `--surface-raised` + border `.5px --border-subtle`. Language switcher sama (item BM/EN, gap 8).

### Field/Search
`height 56; padding 0 6px 0 20px; radius pill; bg --surface-raised; border 1px --border-field; gap 12`. Ikon carian 18px Smoke, placeholder Body/16 Smoke, Button filled "Semak" di kanan. Focus: `border 2px --focus-ring` + `box-shadow 0 0 0 1.5px --color-focus`. Label atas: 14 Medium Ink.

### Verdict
`min-height 44; padding 8px; gap 8; radius pill; bg --surface-canvas`. Dot 8px (warna dot) + halo `0 0 0 3px <dot> @18%` + perkataan Verdict/13 + agensi Body/13 Smoke (`· KPDN`).
- `tone="default"`: perkataan Ink.
- `tone="single"`: perkataan guna warna text verdict.
- Selalu dot + perkataan + agensi (WCAG 1.4.1). Varian: `palsu | waspada | makluman | benar` (page Artikel ada juga "Penjelasan" — petakan ke `benar`).

### Nav/Header ⚠️
**Versi terbaru diedit oleh user dalam Paper (page Artwork / Design system) — ambil spec dari situ dulu** sebelum implement. Baseline dari Figma:
- Wide: `padding 16; flex space-between; bg --surface-canvas`. Logo 133×40 dalam slot 160×56. Nav items: Chip tanpa border (active bg `--surface-subtle`), gap 4: Utama, Artikel, Tentang Kami ▾ (dropdown), Berita dan Galeri, Salur Kepada Kami. Kanan: Language switcher + Button filled "Tanya AIFA".
- Compact (<1100): baris 1 logo + utilities, baris 2 nav.
- Dropdown menu: `padding 8; radius 12; bg canvas; border 1px --border-subtle`; item 44px, padding 10px 16px, Label/18. Item: Tentang kami, Logo, Hubungi kami.
- Header dalam artwork Paper sekarang: tinggi 120, padding sisi 81, nav gap 45, language switcher bg `#efeef0` dengan BM aktif bg Ink — **selaraskan ke token** (bg `--surface-subtle`, aktif `--action-fill`).

### Footer
Border-top 1px `--border-subtle`, padding atas 78. Kiri: logo 180×60 + teks 20/28 Medium (lebar 400). Kanan 3 kolum (Sosial · Semak & Lapor · Sebenarnya.my), tajuk 18/22 Medium, link Label/18 gap 12. Copyright Body/14. Gantikan Montserrat → Manrope.

### Tanya AIFA (floating)
Pill `padding 10px 22px 10px 18px; min-height 44`, ikon chat 24px + "Tanya AIFA" Label/18. Dalam artwork merah `#e51c23` + shadow merah — **bercanggah dengan rule "Red bukan warna aksi"**. Cadangan: Button filled Ink + `--shadow-float` (sahkan dengan user).

### Kad
- **Article card (page Artikel):** lebar 230; imej 276 tinggi radius 26→`--radius-card`; pill verdict kiri atas (bg white 90% + blur 10, padding 6px 10px, dot 7px, 13 SemiBold); avatar agensi 30px bulat kiri bawah; tajuk Heading/20; tarikh Body/14 @60%.
- **Flip card (Home "Semakan fakta terkini"):** 230×392, radius 20, bg `--surface-subtle`, imej 230×230, tajuk Heading/18 padding 14 16 18; avatar agensi 40px border 5px Ink di y=177. Belakang: bg Ink, agensi 12 @65%, ringkasan 14/21 @85%, Button "Baca lagi" canvas.
- **Feature card / WSIS:** bg `--surface-subtle`, radius 20, padding 46 44; stats Stat/32 Light + caption 12 Smoke.
- **Fungsi card (Tentang Kami):** tinggi 280, padding 24, radius 20, bg subtle; tajuk Heading/24 + nombor "/01" Body/16; teks Body/16 Smoke.
- **Logo download card:** border 1px `--border-subtle`, radius 20; area pratonton bg subtle; bawah: Heading/36 + Body/16 @80% + meta 14 @60% + Button filled "Muat turun" (ikon muat turun).

### Carousel "Semakan fakta popular" (Hero carousel)
Slide 960×480 radius 20, gap 20, slide aktif di tengah. Overlay `linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.05) 85%)`. Eyebrow Verdict/13 Smoke ("Palsu · KPDN"), tajuk Heading/48 Medium putih, teks Body/16 putih, Button canvas + ikon panah. Butang prev/next 48 bulat Ink + border Stone. Counter "04 / 05" pill Ink. Bawah: pill dots bg subtle (dot 8, aktif 48 lebar) + butang Jeda 56.

### Media sosial carousel
Kad 220×560 radius 20 (bg gradient ikut platform), kad aktif 920 lebar + `0 24px 50px rgba(0,0,0,.45)`. Progress bar 680×4. Butang 48 bulat bg subtle.

### Lain-lain section
- Band/Closing: border atas+bawah, padding 86 0, Heading/32 + pasangan Button (outline "Salur kepada kami" + filled "Semak dakwaan").
- Band/Announcement: tinggi 48, radius 12, bg subtle, dot Violet 8 + Body/14 + Button outline.
- Timeline (Tentang Kami): garis 2px Stone, dot 12 Kebenaran Red + halo putih 5px, tajuk Heading/24, teks Body/16 @80%, gap 44.
- Sumber kenyataan rasmi: border-top, padding 36 0, label 12 + baris logo agensi (tinggi 48, gap 56, opacity .92).

---

## 5. Pemetaan page → artboard Paper / Figma

| Route | Paper artboard | Figma node |
|---|---|---|
| `/` | Home | `3:203` |
| `/article` | Artikel | `20:3033` |
| `/about-us` | Tentang Kami | `4:1359` |
| `/logo` | Logo \| Sebenarnya.my | `4:1701` |
| `/article/[slug]` | Mesej pautan pendaftaran… | `4:1876` |
| (rujukan) | 01–08 Design system | `14:14` … `14:1347` |
| (komponen) | 09–11 (gambar render) | `25:50`, `25:53`, `25:56` |

Gambar: guna aset sedia ada dalam `public/images/` dahulu; aset baru dari Figma perlu dimuat turun ke `public/` (URL Figma MCP tamat 7 hari).

---

## 6. Urutan kerja dicadangkan

1. Branch baru dari `endahbyu` (contoh `design-system`).
2. Tukar font ke Manrope dalam `layout.js`.
3. Tambah `app/tokens.css` (bahagian 2) dan import.
4. Petakan variable lama dalam `:root` `global.css` (bahagian 3) → semak visual semua page.
5. Bina `components/ui/` (Button, Chip, Tabs, Verdict, FieldSearch) dan guna dalam komponen sedia ada.
6. Kemas Header (ikut versi Paper terbaru), Footer, Tanya AIFA.
7. Kemas section ikut page (bahagian 4 & 5), satu commit setiap section.
8. Ganti hex keras yang tinggal dengan token.
9. `npm run build` (export statik mesti lulus), semak dengan `npm run dev`, banding screenshot dengan Paper.
10. Buka PR ke `endahbyu`.

## 7. Perkara terbuka (sahkan dengan user)
- Spec Nav/Header terbaru dalam Paper.
- Warna butang Tanya AIFA (merah vs Ink).
- Page Artikel masih guna Montserrat dan radius 26 — tukar ke Manrope / 20 (cadangan: ya).
- Perlu mode Dark sekarang atau kemudian.
