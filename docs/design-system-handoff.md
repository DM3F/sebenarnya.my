# Sebenarnya.my — Design System Handoff

Untuk: agent coding (Claude Code) yang akan implement design system baru ke repo `DM3F/sebenarnya.my` (branch `endahbyu`).
Rujukan awal: Figma `wxC95N2gmMWvBOWU1K7Nsy` (page "Design system" & "aratwork").

> **Sumber kebenaran:** kod dalam repo ini (`app/tokens.css`, `app/ui.css`, `components/ui/`) bersama [`design.md`](design.md) dan [`design-system-rules.md`](design-system-rules.md). Fail Paper `sebenarnya.my` **bukan lagi rujukan**: kanvasnya tidak sama dengan design semasa. Jangan salin nilai atau susun atur daripada Paper.

> Checklist kemajuan: [`plan.md`](plan.md) — kemas kini bersama fail ini setiap commit.

> Baca `AGENTS.md` dulu. Next.js dalam repo ni versi 16 — semak `node_modules/next/dist/docs/` sebelum ubah API/konvensyen.

---

## 0. Konteks repo (status sekarang)

- Next.js 16 + React 19, **JavaScript** (bukan TS), App Router, `output: "export"`, `basePath` `/sebenarnya.my` untuk production (GitHub Pages). Guna `withBase()` dari `lib/basePath.js` untuk path aset.
- Routes: `/` (Home), `/about-us`, `/logo`, `/article`, `/article/[slug]`.
- Styling: satu fail `app/global.css` (~3,900 baris), **tiada Tailwind**. Root font-size 62.5% → `1rem = 10px`.
- Font: **Manrope sahaja** (`--font-manrope` → `--font-sans`) via `next/font/google` dalam `app/layout.js`, untuk kandungan, tajuk dan semua kawalan UI. Inter dan `--font-ui` dibuang (21 Nov 2026, `design.md` §8). ✅ Siap.
- Tokens: `app/tokens.css` (diimport sebelum `global.css`). Variable lama dalam `:root` `global.css` sudah dipetakan ke token (bahagian 3). ✅ Siap.
- Komponen sedia ada: `Header, Footer, Hero, Carousel, Latest, FlipCard, Bento, Stories, Viewership, Collaborators, Articles, ArticleDetail, AboutUs, Logo, LogoKit, ShareButton, Chatbot, ClaimForm, ScrollMotion`.

**Peraturan token (wajib):** design system ini akan dipakai juga di **CMS dashboard** dan **browser extension**. Komponen HANYA boleh guna **token semantik** (`--color-background`, `--color-foreground`, `--color-muted*`, `--color-border*`, `--color-primary*`, `--color-ring`, `--color-verdict-*`, `--color-brand*` …) serta skala `--text-*`, `--leading-*`, `--spacing-*`, `--radius-*` — jangan guna palette (`--color-grey-*`, `--color-red`, `--color-blue` …) atau hex terus. Nilai komponen dalam px supaya tak bergantung pada root font-size projek lain.

**Prinsip:** jangan tulis semula dari kosong. Tambah tokens → petakan variable lama ke tokens → kemas komponen satu per satu. Kekalkan routes, data (`data/content.js`, `lib/*`) dan behaviour (carousel, flip card, chatbot).

---

## 1. Brand idea

"Warm cream editorial, clear headlines." 97% akromatik; warna hanya pada logo, sphere, atmospheric field dan verdict. **Kebenaran Red bukan warna aksi** — jangan guna untuk button, link atau nav.

---

## 2. Design tokens

✅ **Satu set nama token** untuk situs, CMS dashboard dan browser extension (namespace Tailwind v4 + warna semantik gaya shadcn). Sumber tunggal: `app/tokens.css` (boleh ditampal terus ke `@theme` Tailwind). Tiga lapis: primitive → semantic → component; peraturan di [`design-system-rules.md`](design-system-rules.md).

### 2.1 Palette (primitive — JANGAN guna dalam komponen)
`--color-white #FFFFFF` · `--color-grey-99 #FDFCFC` (eggshell) · `--color-grey-95 #F5F3F1` (warm taupe) · `--color-grey-91 #EBE8E4` (stone) · `--color-grey-82 #D7D2CC` (pill edge) · `--color-grey-62 #A59F97` (ash, hiasan sahaja) · `--color-grey-50 #878179` (field edge) · `--color-grey-43 #6F6A63` (smoke) · `--color-grey-41 #6B6A68` · `--color-grey-25 #44403B` (graphite) · `--color-black #000` · `--color-red #E8302A` · `--color-red-dark #C8211C` · `--color-blue #3A46F5` · `--color-azure #2F5FD0` · `--color-orange #E08A00` · `--color-orange-dark #A35A00` · `--color-green #1FA463` · `--color-green-dark #137A49`

### 2.2 Semantic colours (guna INI)
| Token | Nilai | Guna |
|---|---|---|
| `--color-background` | grey-99 | kanvas page, kawalan (button outline, chip, tab, search) |
| `--color-foreground` | black | teks utama |
| `--color-muted-foreground-inverse` | putih 60% | teks redup atas latar gelap/hitam (≈7:1 atas hitam); jangan guna `--color-muted-foreground` atas hitam (3.86:1) |
| `--color-card` | white | permukaan terangkat |
| `--color-muted` | grey-95 | band, hover, nav aktif |
| `--color-muted-strong` | grey-91 | inset, divider, isi disabled |
| `--color-text-secondary` | grey-25 | teks body kuat |
| `--color-muted-foreground` | grey-43 | teks redup, eyebrow, ikon, placeholder, tagline hero |
| `--color-border` | grey-82 | tepi pill, kad, dropdown |
| `--color-border-strong` | grey-50 | border field, button outline |
| `--color-primary` / `-hover` / `-foreground` | black / grey-25 / white | aksi utama |
| `--color-foreground-inverse` | white | teks atas gelap/media |
| `--color-selected` | grey-41 | |
| `--color-ring` | blue | fokus |
| `--color-link` | blue | pautan |
| `--color-destructive` | red-dark | teks ralat, field tidak sah |
| `--color-brand` / `-strong` | red / red-dark | logo, sphere — BUKAN aksi |
| `--color-brand-spark` | blue | hiasan |
| `--color-hairline` | rgba(0,0,0,.05) | garis halus |
| `--color-verdict-{palsu,waspada,makluman,benar}` | red-dark / orange-dark / azure / green-dark | perkataan verdict (tone single) |
| `--color-verdict-*-dot` | red / orange / blue / green | titik verdict |

Saiz kawalan guna spacing: tinggi `--spacing-44` (min sasaran sentuh), search `--spacing-56`, padding sisi `--spacing-20`, radius `--radius-full`.
(Mode dark belum wajib.)

### 2.3 Typography
Font: **Manrope** 300/400/500/600 untuk semuanya (`--font-sans`) — kandungan, tajuk, navigasi dan kawalan UI.

| Gaya | Weight | Size / line (token) | Tracking | Guna |
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
| Label/16 (Button/Nav/Tab/Link) | 500 | 16 / 24 | 0 | semua button, tab, chip, nav, dropdown, link footer, CTA |
| Eyebrow/14 | 500 | 14 / 20 | +0.01em | Smoke, sentence case |
| Verdict/13 | 600 | 13 / 18 | +0.04em | UPPERCASE |
| Caption/12 | 500 | 12 / 16 | +0.01em | tarikh, kredit |
| Stat/40 Light | 300 | 40 / 44 | -0.02em | angka statistik |
| Stat/32 Light | 300 | 32 / 36 | 0 | angka kecil (WSIS) |

**Peraturan: semua label interaktif (button, nav, tab, chip, dropdown, CTA, link footer) = 16 / 24 Medium** — tiada label 18px. **Display (48–56) dan angka statistik guna 400** melalui `--font-weight-display` — besar tetapi ringan (`design.md` §3). **Heading (24–36) guna Medium 500.** Regular 400 untuk body; Light 300 hanya untuk kapsyen statistik. Tiada 700+. Pengguna `--font-weight-display`: `.hero-title`, `.hero-carousel h3`, `.wsis-banner__title`, `.post-title`, `.about-hero-text h1`, `.about-title`, `.about-fn-title`, `.viewership-stats dt`, `.about-intro__stat-value`, `.about-intro__facts-row dt`.

Token: saiz `--text-{12,13,14,16,18,20,24,28,30,32,36,38,40,48,56}`, line-height `--leading-{16,18,20,21,24,26,28,32,34,36,42,44,52,60}` (+ `--leading-display/heading/body` %), tracking `--tracking-{display,tight,body,label}`, weight `--font-weight-{light,regular,medium,semibold}`. Contoh Display/56 = `--text-56` / `--leading-60` / `--tracking-display` / `--font-weight-medium`.

Mobile (<600px, `--breakpoint-type`): Display → `--text-38`/`--leading-42`, Heading/36 → `--text-30`/`--leading-36`, Heading/32 → `--text-28`/`--leading-34` (tukar dalam media query komponen). Body kekal 400, max 68ch.

### 2.4 Spacing (4px base) — `--spacing-*`
`2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 44, 48, 56, 64, 72, 96, 120`
- 8: gap pill berpasangan/chip · 12: gutter grid · 16: inset, margin mobile · 20: padding sisi pill · 24: title→body panel · 32: padding kad · 40: bawah header section · 64: padding stage · 96: hero top.

**Ritma halaman (token peranan, `app/tokens.css`) — semua halaman guna yang sama:**
| Token | Desktop | ≤1280 | ≤1024 | ≤900 | ≤600 | Guna |
|---|---|---|---|---|---|---|
| `--space-page-x` | 96 | 48 | 48 | 24 | 16 | Gutter halaman: header, setiap seksyen, footer (`--side` ialah alias) |
| `--space-section` | 96 | 96 | 64 | 64 | 48 | Jarak antara seksyen; `.main` ialah flex column dengan `row-gap` ini + `padding-bottom` sebelum footer; padding atas footer |
| `--space-page-top` | 40 | 40 | 40 | 40 | 24 | Header → blok pertama pada halaman tanpa hero (Artikel, detail) |

Seksyen **tidak** ada padding atas/bawah sendiri; jarak datang dari `.main`. Kumpulan rapat dapat separuh (`.hero + .hero-carousel`, `.hero-carousel + .partners`: −½ `--space-section`). Seksyen baharu: cukup `padding-inline: var(--space-page-x)`.

### 2.5 Radius
`--radius-sm: 4px` · `--radius-input: 8px` · `--radius-md: 12px` (thumbnail, media, dropdown) · `--radius-card: 20px` (kad, stage, panel) · `--radius-lg: 24px` (feature card, hero stage) · `--radius-full: 9999px` (SEMUA button, tab, chip, search).

### 2.6 Effects
```css
--shadow-subtle: 0 0 0 .5px rgba(0,0,0,.125), 0 1px 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04);
--shadow-subtle-2: inset 0 0 0 .5px rgba(0,0,0,.075);
--shadow-subtle-3: inset 0 0 0 .5px rgba(0,0,0,.10);
--shadow-float: 0 0 0 .5px rgba(0,0,0,.2), 0 8px 24px rgba(0,0,0,.12); /* Tanya AIFA sahaja */
```
Elevation datang dari tona (Eggshell → Warm Taupe → Stone), bukan shadow.

### 2.6b Ikon — Lucide ✅
Semua ikon UI guna **Lucide** (`lucide-react`, https://lucide.dev) melalui `components/ui/Icon.js`:
```jsx
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui';
<Icon icon={ArrowRight} />          // 16px (default)
<Icon icon={Search} size={18} />
```
- Garis **1.75px pada semua saiz** (`absoluteStrokeWidth`), warna `currentColor` (ikut token teks), `aria-hidden` — nama boleh-capai datang dari kawalan.
- Saiz: 16 dalam button/label/kad · 18–20 kawalan (search, tutup, anak panah carousel) · 24 butang terapung (Tanya AIFA) · 28–40 ilustrasi status (borang).
- Dipakai: ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown/Left/Right, Search, X, MessageSquareText, Flag, Check, Link, CloudUpload, Share, Download, Calendar, Play, Pause (diisi: `PlayFilled`/`PauseFilled` dari `components/ui/filledIcons`, fill currentColor).
- **Pengecualian:** logo jenama (Facebook, Instagram, Threads, X, TikTok) bukan dalam Lucide → kekal SVG jenama (`data/content.js`).
- Jangan guna glyph teks (↗ → ‹ ›), SVG tulis tangan atau set ikon lain. Jangan override `stroke-width` dalam CSS.

### 2.7 Layout
Page max 1280 `--container-page`, rails 1180 `--container-rail` (artwork frame 1624 = 81px side padding), rails 1180, side 32 / 16. Editorial grid 12 kolum, gap 12 (heading span 7, copy col 9–12). Breakpoints: `--breakpoint-nav` 1100 · `--breakpoint-stack` 900 · `--breakpoint-type` 600 (rujukan; media query tak boleh baca variable).

---

### 2.x Motion — page transition
- Token (`app/global.css`): `--ease-in-out cubic-bezier(.87,0,.13,1)` · `--duration-page 1.2s`.
- `components/PageTransition.js` (dalam `app/layout.js`): tangkap klik link dalaman, jalankan `document.startViewTransition`, lalu `router.push`. Link `/submit-claim/`, tab baru, link luar dan hash tidak disentuh.
- CSS `::view-transition-old/new(root)`: page lama naik 35% + redup ke .4; page baru di-wipe dari bawah (clip-path polygon).
- `prefers-reduced-motion`: crossfade 200ms sahaja.
- Browser tanpa `startViewTransition`: navigasi biasa.

### 2.y Motion — hero carousel
- Infinite loop (tiada slide pertama/terakhir); slide disusun di sekitar posisi kontinu dengan `translate3d`.
- Gerak: ease eksponensial τ 0.11s ke arah sasaran (boleh disentuh di tengah gerakan). Drag ikut jari, flick > 0.6 slide/s cukup untuk tukar slide; trackpad ikut jari lalu snap selepas 140ms.
- Teks dipaparkan pada semua kad (tengah, kiri, kanan); tiada badge kiraan (infinite loop). Mobile: kad potret, teks di bahagian bawah dalam kad.
- `prefers-reduced-motion`: tiada autoplay, perpindahan terus tanpa glide.

### 2.z Motion — FlipCard (Semakan fakta terkini)
- Satu kad terbuka pada satu masa (state di `Latest.js`).
- Hover: tunggu 90ms sebelum flip (sapuan pointer tidak flip semua kad); keluar: tunggu 140ms supaya pindah ke kad sebelah bertukar dalam satu gerakan.
- Buka 0.7s `cubic-bezier(.23,1,.32,1)` + naik 4px (mouse sahaja); tutup 0.45s `cubic-bezier(.65,0,.35,1)`. Transition CSS, jadi boleh diterbalikkan di tengah jalan.
- `prefers-reduced-motion`: tukar terus tanpa putaran.

## 3. Pemetaan variable lama → token baru (`app/global.css`)

| Lama | Nilai lama | Baru |
|---|---|---|
| `--font` | Montserrat | `var(--font-sans)` (Manrope) |
| `--text`, `--dark` | #151618 | `var(--color-foreground)` |
| `--bg` | #fff | `var(--color-background)` |
| `--white` | #fff | `var(--color-card)` |
| `--dark-card` | #0c0d11 | `var(--color-primary)` |
| `--tag-bg` | #efeef0 | `var(--color-muted)` |
| `--tag-hover` | #e6e6ea | `var(--color-muted-strong)` |
| `--input-bg` | #f2f0f2 | `var(--color-muted)` (atau field putih + border, lihat Field/Search) |
| `--line` | #ceced0 | `var(--color-border)` |
| `--accent` | #314bff | `var(--color-link)` |
| `--orange` | #ff6b35 | `var(--color-verdict-waspada-dot)` |
| `--red` | #e51c23 | `var(--color-brand)` |
| `--radius` | 26px | `var(--radius-card)` (20px); pill → `var(--radius-full)` |
| `--gap` | 16px | kekal / `12px` untuk grid editorial |

Lepas tu cari hex keras dalam `global.css` (contoh `#6d6d72`, `#e2e2e5`, `#8a8a8f`, `#4a4a4f`, `#f5f5f7`, `#111215`, `#0d0e12`) dan gantikan dengan token semantik paling hampir (`--color-muted-foreground`, `--color-border`, `--color-muted`, `--color-primary`).

Warna verdict dalam page Artikel lama (`#e51c23`, `#1d8a4e`, `#f56300`, `#0071e3`) → guna token verdict di 2.1.

---

## 4. Komponen (spec)

✅ **Komponen asas siap** dalam `components/ui/` (import dari `@/components/ui`) dengan CSS dalam `app/ui.css` (kelas `ui-*`, token semantik sahaja, font Manrope):
- `Button` (`variant`: filled | outline | ghost, `icon`, `href`, `disabled`) + `ButtonGroup`
- `Chip` (`href?`) + `ChipRow` (`label` cth. "Popular:")
- `Tabs` (`items`, `value`, `onChange`, `label`) — ikut corak ARIA tabs (anak panah, Home/End)
- `Verdict` (`type`: palsu | waspada | makluman | benar | penjelasan→benar, `tone`: default | single, `agency`)
- `SearchField` (`label`, `hideLabel`, `placeholder`, `buttonLabel`, `value`+`onChange(text)` atau `defaultValue`, `error`, `action` atau `onSubmit(query)`)
- `Tabs` `mode="toggle"` → `role=group` + `aria-pressed` (tiada tab panel)
- `NavLink` (`href`, `current`) — link nav tanpa border, padding sisi `--space-control-x` (20). State: rehat weight 400 transparent · hover bg `--color-accent` (pointer sahaja) · tekan scale .97 · halaman aktif weight 500, tanpa fill · fokus ring standard
- `LanguageMenu` (`items` [{value, label, lang, flag}], `value`, `onChange`, `label`, `groupLabel`, `align`) — pill bendera bulat 24 + chevron (border `--color-border`, bg `--color-secondary`); panel `--radius-menu` + `--shadow-float`, label kumpulan caption muted, item bendera + nama, terpilih bg `--color-accent`. Masuk 150ms opacity+scale .96 dari sudut trigger. Bendera: `public/images/flags/*.svg`
- `DropdownMenu` (`label`, `items` [{label, href, current}], `current`, `align`) — trigger NavLink + chevron, panel pautan. `.ui-dropdown__item` boleh `<a>` atau `<button>` (chrome butang browser dibuang: tiada border/bg, lebar penuh)
- Menu mudah alih: label kumpulan (cth. Tentang Kami) sama saiz/warna dengan Utama/Artikel; anak pautan `--text-label-sm` (14), muted, inden 32
- Menu Kongsi: muncul 150ms opacity + scale .96 dari tengah atas (butang Kongsi)
- `Button`/`Chip`/`NavLink` dengan `href` render `<a>` biasa (tiada kebergantungan Next.js) supaya boleh guna di CMS/extension.

Untuk CMS/extension: salin `app/tokens.css` + `app/ui.css` (+ `components/ui/` jika React). Sudah dipasang: **Header** dan **Hero** (lihat di bawah). Komponen lain belum.

### Button
- Asas: `height 44px; min-height 44px; padding 10px 20px; radius pill; Label/16; gap 8px` (ikon 16px).
- `filled`: bg `--color-primary`, text `--color-primary-foreground`; hover bg `--color-primary-hover`.
- `outline`: bg `--color-background`, border `.5px solid --color-border-strong`; hover bg `--color-muted`.
- `ghost`: bg `--color-background`, text underline; hover bg `--color-muted`.
- `focus` (semua): `border: 2px solid --color-ring`.
- `disabled`: bg `--color-muted-strong`, border `.5px --color-border-strong`, text `--color-muted-foreground`.
- Pasangan button: gap 8px. Props: `variant`, `size?`, `icon?`, `href?`.

### Chip
`height 44 (padding 9.5px 12px + border .5px); radius pill; bg --color-background; border .5px --color-border; Label/16`. Hover `--color-muted`. Didahului label "Popular:" Body/14 Smoke.

### Tabs/Segmented
Container `padding 3px; gap 2px; radius pill; bg --color-background; border .5px --color-border`. Item = Chip; item terpilih bg `--color-card` + border `.5px --color-border`.

### Field/Search
`height 56; padding 0 6px 0 20px; radius pill; bg --color-background; border 1px --color-border-strong; gap 12`. Ikon carian 18px Smoke, placeholder Body/16 Smoke, Button filled "Semak" di kanan. Focus: `border 2px --color-ring` + `box-shadow 0 0 0 1.5px --color-ring`. Label atas: 14 Medium Ink.

### Verdict
`min-height 44; padding 8px; gap 8; radius pill; bg --color-background`. Dot 8px (warna dot) + halo `0 0 0 3px <dot> @18%` + perkataan Verdict/13 + agensi Body/13 Smoke (`· KPDN`).
- `tone="default"`: perkataan Ink.
- `tone="single"`: perkataan guna warna text verdict.
- Selalu dot + perkataan + agensi (WCAG 1.4.1). Varian: `palsu | waspada | makluman | benar` (page Artikel ada juga "Penjelasan" — petakan ke `benar`).

### Nav/Header ✅
Dilaksanakan dalam `components/Header.js`, data dalam `data/content.js` (`navLinks`, `claimLink`):
- Kiri logo 133×40 · tengah `NavLink` **Utama**, **Artikel** + `DropdownMenu` **Tentang Kami ▾** (Tentang kami, Logo) · kanan `LanguageMenu` (Bahasa Melayu / English) + `Button` filled **Salur Kepada Kami**.
- Bar: bg `--color-background`, border bawah 1px `--color-border`, padding 16 / 96 (48 ≤1280, 24 ≤900, 16 ≤600), gap 24.
- Item aktif: pill `--color-muted` (dropdown trigger aktif bila salah satu anaknya halaman semasa).
- Bahasa: `LanguageMenu` (pill bendera, padding sisi `--space-control-x`, panel di kanan).
- Jarak antara item nav dan antara butang di kanan: token `--space-nav-gap` (8).
- Dropdown: panel bg `--color-background`, border 1px `--color-border`, radius `--radius-md`, padding 8, `--shadow-float`; item 44px, padding 10 16, radius 8, hover/aktif `--color-muted`. Tutup dengan Escape (fokus balik ke trigger), klik luar, atau blur.
- ≤1100px: nav jadi panel (butang menu 44×44); anak dropdown disenarai di bawah label kumpulan. ≤600px: butang "Salur Kepada Kami" pindah ke dalam panel, logo max 140.
- Font: semua label header (NavLink, dropdown, BM/EN, butang "Salur Kepada Kami") guna **Manrope** (`--font-sans`). Kawalan UI lain juga Manrope (Inter dibuang).
- "Hubungi kami" belum dalam dropdown — tiada page `/contact/` lagi.

Baseline asal dari Figma:
- Wide: `padding 16; flex space-between; bg --color-background`. Logo 133×40 dalam slot 160×56. Nav items: Chip tanpa border (active bg `--color-muted`), gap 4: Utama, Artikel, Tentang Kami ▾ (dropdown), Berita dan Galeri, Salur Kepada Kami. Kanan: Language switcher + Button filled "Tanya AIFA".
- Compact (<1100): baris 1 logo + utilities, baris 2 nav.
- Dropdown menu: `padding 8; radius 12; bg canvas; border 1px --color-border`; item 44px, padding 10px 16px, Label/16. Item: Tentang kami, Logo, Hubungi kami.
- Language switcher **guna token** (bg `--color-muted`, aktif `--color-primary`).

### Hero ✅
`components/Hero.js` + `components/Carousel.js`. Hero: padding atas 96, gap 48; heading group gap 16.
- Tajuk Display/56 Medium, **2 baris**: "Tidak pasti? / Semak sebelum kongsi." (≤600px: `--text-38`, baris mengalir dengan `text-wrap: balance`, tetap 2 baris).
- Lede 18/32 Medium `--color-text-secondary`, **2 baris** (69 + 69 aksara): "Portal rujukan rasmi yang disahkan terus oleh kementerian dan agensi. / Tampal tajuk mesej tular di sini, atau tanya AIFA 24 jam di WhatsApp." (≤760px mengalir bebas).
- `SearchField` max 800, placeholder "Contoh: bantuan tunai WhatsApp", ralat bawah field.
- Bawah search (gap 16): `ChipRow` "Carian popular:" (Body/14 `--color-muted-foreground`) + 4 `Chip`: Bantuan tunai · RON95 · Hujan lebat · Lesen memandu. Setiap kata kunci mesti pulangkan sekurang-kurangnya satu semakan; klik = cari terus (`/article?q=`).

### HeroCarousel ✅
- Slide 960×480 (lebar `min(960, 100vw − 128)`), radius `--radius-card`, gap 20; slide tengah di tengah, jiran kiri/kanan mengintai.
- **Hanya slide tengah tunjuk teks** (eyebrow, tajuk, teks, CTA, kaunter); slide sisi imej sahaja dengan scrim gelap 25%. Teks muncul selepas slide berhenti (fade .5s, delay .6s).
- Kandungan: kiri 64, lebar max 484, gap 16. Eyebrow Verdict/13 putih + dot 8px warna `--color-verdict-*-dot` (halo 3px 25%) — "PALSU · KPDN". Tajuk Heading/48 Medium putih 2 baris (`title` + `titleEm`). Teks Body/16 putih, max 400. CTA pill `--color-background` + teks `--color-foreground` + anak panah.
- Overlay: `linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.05) 85%)`.
- Kawalan: pill dots bg `--color-muted` h48 padding 20 gap 12; dot 8 `--color-border-strong`, aktif 32 lebar dengan isian progres `--color-foreground` 6s; butang jeda/main 48 bulat `--color-muted`.
- **Autoplay 6s**; jeda/main; mula dijeda jika `prefers-reduced-motion`. Seret/swipe, trackpad, kekunci ←/→ (gallery boleh difokus). Klik slide sisi = bawa ke tengah; klik slide tengah = buka artikel.
- ≤900px: lebar `100vw − 64`, tajuk 36/42. ≤700px: imej atas (16:10), teks bawah, tajuk 28/34, slide sisi 50% opacity.
- Tajuk seksyen lama "Semakan Fakta Popular" dibuang.

### Footer ✅
Border-top 1px `--color-border`, padding 96 atas / 32 bawah, sisi 96 (48 ≤1280, 24 ≤900, 16 ≤600), gap 64. Kiri: logo 180 + teks Medium 18/24 (max 400). Kanan: 3 kolum lebar 180, gap 48 — **Sosial** (teks sahaja, buka di tab baharu), **Semak & Lapor** (Semak Fakta, AIFA, Salur Kepada Kami), **Sebenarnya.my** (Tentang Kami, Berita dan Galeri). Tajuk kolum 14 semibold UPPERCASE `--tracking-label` `--color-muted-foreground`; pautan 16/24 Medium, gap 12, garis bawah semasa hover. Hak cipta 14/21 `--color-muted-foreground`. ≤1100 bertindan; ≤600 kolum 2 sebaris.

### Halaman Tentang Kami ✅
- **Hero:** kad foto `--radius-lg`, padding 56/40/64, tinggi min(755px, 85svh). Atas: "Ikuti kami" 36/42 + 4 butang sosial 48 bulat (`--color-card`, ikon jenama 24). Bawah: tajuk 48/52 + lead 24/32, putih.
- **Empat fungsi:** tajuk 56 rata kanan. Kiri: kad pilihan 560×440 `--color-muted-strong` (36/42, nombor `/01` tnum, teks 18/28) + butang ‹ › 44 + bar kemajuan 3px (ibu jari 25%, gelongsor .45s `--ease-in-out`). Kanan: 3 kad kecil `--color-muted` (24/32, 16/24) — klik untuk pilih. Kandungan masuk .32s `--ease` (opacity + 6px + blur 2px), kad kecil berperingkat 40ms. Reduced motion: pudar sahaja.
- **Berita dan Galeri:** tajuk 56/60, intro 24/32. Berita 3 kad (border 1px, tag pil muted 14/20, tajuk 24/32). Galeri = akordion elastik foto sahaja (lihat Kemas kini 21 Nov, malam). Hover kad berita (mouse sahaja): imej skala 1.03.
- **Logo:** `LogoKit headingLevel={2}` — gaya sama dengan page `/logo` (tajuk 36/42, pratonton 475 muted, butang `Button` filled).

### Halaman detail artikel ✅
Padding 32 atas / 96 bawah, sisi 81 (48 ≤1280, 24 ≤900, 16 ≤600). "Semua artikel" 16/24 Medium + ikon 20. Tag: `Verdict tone="single"` dengan agensi + pil kategori 14/20 Medium, kedua-duanya border .5px `--color-border`, tinggi 44. Tajuk 48/52 Medium `--tracking-display` (32/36 ≤600), subtajuk 18/28 `--color-text-secondary`, meta 14/21 `--color-muted-foreground` + butang Kongsi (border 1px, 16/24 Medium, ikon 20). Imej 1100 × 2:1, `--radius-card` (4:3 ≤600). Lajur bacaan 680: lead 18/28, garis pemisah, "Penjelasan rasmi" 24/32 Medium.

### Halaman Artikel ✅
- Sisi `--articles-side` 96 / 48 / 24 / 16, padding atas 40, bawah 96.
- **Penapis:** carian pill 44 (border 1px `--color-border-strong`, ikon Search 18, input Manrope 16) + 2 `<select>` asli bergaya pill 44 (border `--color-border`, label 16 Medium, ChevronDown Lucide) + kiraan 14 `--color-muted-foreground`. Chip kategori pill 44 bg `--color-muted`, label 16 Medium, dot verdict 7px; terpilih = `--color-primary` + `--color-primary-foreground`; baris boleh skrol dengan butang ‹ › 44 bila melimpah.
- **Hasil:** jika >4 hasil — kad utama (960:440, tinggi 560, radius 20, scrim bawah, tajuk 28/36 Medium putih, tarikh 14) + senarai sisi 4 item (thumb 160×122 radius 12, tajuk 20/26 Medium, tarikh 14); kemudian grid 4 kolum (3 ≤1280, 2 ≤900, 1 ≤600), gap 32/24. Kad grid: bg `--color-muted`, radius 20, padding 8/8/20, foto 220 radius 12, tajuk 20/26, tarikh 14.
- Pill verdict atas foto: bg `--color-background` 90%, dot `--color-verdict-*-dot`, perkataan 13 semibold UPPERCASE `--color-verdict-*`. Status `benar` dilabel **"Penjelasan"**.
- Seluruh kad boleh diklik (pautan tajuk `::after`), cincin fokus pada kad.

### Tanya AIFA (floating)
Pill `padding 10px 22px 10px 18px; min-height 44`, ikon chat 24px + "Tanya AIFA" Label/16. Dalam artwork merah `#e51c23` + shadow merah — **bercanggah dengan rule "Red bukan warna aksi"**. Cadangan: Button filled Ink + `--shadow-float` (sahkan dengan user).

### Kad
- **Article card (page Artikel):** lebar 230; imej 276 tinggi radius 26→`--radius-card`; pill verdict kiri atas (bg white 90% + blur 10, padding 6px 10px, dot 7px, 13 SemiBold); avatar agensi 30px bulat kiri bawah; tajuk Heading/20; tarikh Body/14 @60%.
- **FactCheckCard ✅ (Home "Semakan fakta terkini"):** `components/FlipCard.js`, 340×480, radius `--radius-card`. Flip dikekalkan: hover tetikus, klik/tap, Enter/Space (fokus pindah ke sisi yang kelihatan), `rotateY(180deg)` .6s `cubic-bezier(.77,0,.175,1)`, tiada animasi jika reduced motion.
  - Depan: foto penuh; scrim atas tipis (0.35→0, 120px) di belakang logo dan scrim bawah pekat (0.8→0.55→0, 300px) di bawah teks supaya teks putih kekal ≥4.5:1 atas sebarang foto; **logo agensi 44 putih (logo 30, atau monogram) di kanan atas**; **pill verdict (dot + PERKATAAN 13 semibold) + tajuk 24/125% Medium putih di bawah** (inset 24); tiada ikon panah.
  - Belakang: bg `--color-muted`, border 1px `--color-border`, padding 24; `● PALSU · MCMC` (perkataan warna `--color-verdict-*`) + avatar 36; tajuk 20/130% Medium; ringkasan 16/24 `--color-text-secondary`; meta 13 `--color-muted-foreground` "Disemak {tarikh}" + "Sumber: kenyataan rasmi {agensi}" atas garisan; CTA penuh lebar tinggi 48, padding 6/6/6/20, `--color-primary`, label 16 Medium "Baca semakan" + bulatan ↗ putih 36 (konsentrik dengan radius pill); hover `--color-primary-hover` + ikon geser 2px ↗; tekan `scale .96`. Kedua-dua sisi tepat 480px (`box-sizing: border-box`) supaya tinggi kad tidak berubah semasa flip; ringkasan max 4 baris.
- **Seksyen "Semakan fakta terkini" ✅:** `components/Latest.js`. Padding atas/bawah 96 (64 ≤1280, 48 ≤600), sisi `--latest-side` 96 / 48 ≤1280 / 24 ≤900 / 16 ≤600 untuk tajuk dan butang sahaja — **baris kad full-bleed hingga tepi skrin** (seperti hero carousel), kad pertama sejajar dengan tajuk; gap 48; tajuk Heading/36 Medium **2 baris seimbang (22 + 22 aksara): "Semakan fakta terkini, / disahkan agensi rasmi."** (≤600px baris mengalir dengan `text-wrap: balance`, kekal 2 baris). Baris kartu = **gelangsar automatik tanpa hujung** (12 semakan terbaru, setiap satu gambar unik): kad duduk atas "cincin" — kad yang keluar di kiri masuk semula di kanan, tiada salinan pendua. Kelajuan 36px/s; **hover tetikus = perlahan hingga berhenti, mouse leave = laju semula** (ease ~0.2s). Juga berhenti semasa kad diflip, fokus papan kekunci di dalam (kad yang difokus dibawa ke pandangan), diseret (sentuh/pen), dan sentiasa di bawah `prefers-reduced-motion`. Butang ‹ › 44 bulat (border `--color-border`) gelongsor tepat satu kad; "Lihat lagi" `Button` outline dengan border `--color-foreground`, di tengah.
- **Feature card / WSIS:** bg `--color-muted`, radius 20, padding 46 44; stats Stat/32 Light + caption 12 Smoke.
- **Fungsi card (Tentang Kami):** tinggi 280, padding 24, radius 20, bg subtle; tajuk Heading/24 + nombor "/01" Body/16; teks Body/16 Smoke.
- **Logo download card:** border 1px `--color-border`, radius 20; area pratonton bg subtle; bawah: Heading/36 + Body/16 @80% + meta 14 @60% + Button filled "Muat turun" (ikon muat turun).

### Carousel "Semakan fakta popular" (Hero carousel)
Slide 960×480 radius 20, gap 20, slide aktif di tengah. Overlay `linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,.05) 85%)`. Eyebrow Verdict/13 Smoke ("Palsu · KPDN"), tajuk Heading/48 Medium putih, teks Body/16 putih, Button canvas + ikon panah. Butang prev/next 48 bulat Ink + border Stone. Bawah: pill dots bg subtle (dot 8, aktif 48 lebar) + butang Jeda 56.

### Media sosial carousel
Kad 220×560 radius 20 (bg gradient ikut platform), kad aktif 920 lebar + `0 24px 50px rgba(0,0,0,.45)`. Progress bar 680×4. Butang 48 bulat bg subtle.

### Lain-lain section
- Band/Closing: border atas+bawah, padding 86 0, Heading/32 + pasangan Button (outline "Salur kepada kami" + filled "Semak dakwaan").
- Band/Announcement: tinggi 48, radius 12, bg subtle, dot Violet 8 + Body/14 + Button outline.
- Timeline (Tentang Kami): garis 2px Stone, dot 12 Kebenaran Red + halo putih 5px, tajuk Heading/24, teks Body/16 @80%, gap 44.
- Sumber kenyataan rasmi: border-top, padding 36 0, label 12 + baris logo agensi (tinggi 48, gap 56, opacity .92).

---

## 5. Pemetaan page → komponen

| Route | Komponen |
|---|---|
| `/` | `Hero`, `Carousel`, `Latest` + `FlipCard`, `Viewership`, `Bento`, `Stories` |
| `/article` | `Articles` |
| `/article/[slug]` | `ArticleDetail` |
| `/about-us` | `AboutUs`, `SphereGallery`, `LogoKit` |
| semua | `Header`, `Footer`, `Chatbot`, `ClaimForm` |

Node Figma (rujukan awal sahaja): `/` `3:203` · `/article` `20:3033` · `/about-us` `4:1359` · `/article/[slug]` `4:1876` · design system `14:14`–`14:1347`.

Gambar: guna aset sedia ada dalam `public/images/` dahulu; aset baru dari Figma perlu dimuat turun ke `public/` (URL Figma MCP tamat 7 hari).

---

## 6. Urutan kerja dicadangkan

1. Branch baru dari `endahbyu` (contoh `design-system`).
2. ✅ Tukar font ke Manrope dalam `layout.js` (Inter dibuang 21 Nov 2026).
3. ✅ Tambah `app/tokens.css` (bahagian 2) dan import.
4. ✅ Petakan variable lama dalam `:root` `global.css` (bahagian 3). Semak visual setiap page masih perlu.
5. ✅ Bina `components/ui/` (Button, Chip, Tabs, Verdict, SearchField). Belum: guna dalam komponen sedia ada.
6. ✅ Header + Hero. Belum: Footer, Tanya AIFA.
7. Kemas section ikut page (bahagian 4 & 5), satu commit setiap section.
8. Ganti hex keras yang tinggal dengan token.
9. `npm run build` (export statik mesti lulus), semak dengan `npm run dev`, `npm run lint:ds`, dan semak visual desktop + 390px.
10. Buka PR ke `endahbyu`.

## 7. Perkara terbuka (sahkan dengan user)
- Warna butang Tanya AIFA (merah vs Ink).
- Page Artikel masih guna Montserrat dan radius 26 — tukar ke Manrope / 20 (cadangan: ya).
- Perlu mode Dark sekarang atau kemudian.

## Home — bagian bawah

- **Tentang ringkas** (`.viewership`, `.partners`): sisi `--brief-side` 96 → 48 (≤1280) → 24 (≤960) → 16 (≤600). Kicker 24 Medium, lead 20/130%. Angka statistik `clamp(48px, 5vw, 72px)` Medium, keterangan 16 Light. Label mitra 14 semibold uppercase `--color-muted-foreground`, jarak logo 40, ticker tetap.
- **Aktiviti media sosial terkini** (`.activity`): padding sisi 96, gap 32, judul Heading/36 Medium.
- **WSIS PromoBanner** (`components/Bento.js`, `.wsis-banner`): baris flex tinggi 560, gap 24. Kartu cerita flex 1.62, padding 48, `--radius-lg`, latar `--color-black`; eyebrow merah merek (bukan aksi); CTA pil terang 44px, label 16/24 Medium, ikon Lucide `ArrowRight`, scale .96 saat ditekan → `/about-us/#berita-galeri`. Media flex 1, border 1px, `--radius-lg`. Menumpuk di ≤1100.
- **SocialCarousel** (`components/Stories.js`): tanpa judul sendiri (judul dari `.activity`). Ukuran dari lebar viewport: kecil = 15.3%, besar = sisa, gap 8; ≤700: kecil max(16%, 56), besar min(80%, 380). Kartu `--radius-lg`, progress track `--color-muted-strong` / bar `--color-foreground`, tombol bulat 44px outline dengan focus ring.

## Catatan halaman (Tentang Kami, Artikel, detail artikel)

- **Artikel** (`components/Articles.js`): baris kartu utama + senarai sisi dibuang; semua hasil dalam grid kartu 4 kolom. Chip kategori hanya `Semua` + empat keputusan (Palsu, Penjelasan, Waspada, Makluman). Tajuk kartu kini `box-sizing: border-box` supaya padding kanan 12 dihormati.
- **Detail artikel**: kolum bacaan `.post-body` 514px, 18/28.
- **Tentang Kami › About** (`.about-intro`, data `aboutIntro`): pill label 14 Medium berbingkai `--color-border`; lead 24/32 lebar 700. Tiga kartu tinggi 340, gap 12, `--radius-card`: (1) `--color-primary` dengan teks 24 Medium + bahagian `--color-muted-foreground` dan penunjuk status (suis hiasan, `--color-link`); (2) `--color-muted-strong` dengan pill 16/24 Medium; (3) `--color-muted` dengan angka 40 Light + bar putus-putus keputusan (dikira daripada `articles`). Baris fakta: judul 20 Medium tengah, angka 40 Light, label 14 `--color-muted-foreground`. ≤1100 kartu menindan, fakta 2×2.
- Bahagian "Bagaimana kami menyemak fakta" dibuang daripada halaman kerana tiada dalam canvas (data `howItWorks` dikekalkan).
- **Mobile fixes**: `.about-intro__lead` `flex: none` ≤1100 (flex-basis 700 jadi tinggi dalam kolum); `.about-fn-card` `flex: none` ≤700 (kad kecil Empat fungsi runtuh ke 48px); `.articles-card` `box-sizing: border-box` (kad melimpah 28px daripada slot grid).
- **Hero carousel**: teks hanya pada slaid tengah (slaid sisi: gambar sahaja, fade .2s keluar / .3s masuk); pembilang `03 / 05` 14px tnum dalam pill hitam 60% di kanan bawah slaid aktif (disembunyikan ≤600). Slaid RON95 guna foto pam minyak.

## Fasa 5 — Pembersihan (21 Nov 2026)

- `global.css`: ~700 baris CSS mati dibuang (disahkan dengan perbandingan tangkapan skrin piksel demi piksel, desktop 1624 + mobile 390, semua halaman).
- Tiada hex keras lagi kecuali warna jenama platform (`.story-instagram` …) dan `#000` dalam `mask-image`. Alias lama `:root` dibuang; `:root` dalam `global.css` kini hanya pembantu layout & motion (`--side`, `--max-width`, `--ease`, `--slide`, `--ease-in-out`, `--duration-page`, `--fade`).
- Overlay media: `--gradient-scrim-media` (hero, kiri→kanan), `--gradient-scrim-media-wide`, `--gradient-scrim-bottom` (FlipCard), `--gradient-scrim-bottom-short` (hero mobile), `--gradient-scrim-top`.
- Berat font: semua melalui `--font-weight-*`; tiada 700. Asas `h1–h6` = Medium 500.
- Radius: semua melalui `--radius-*` kecuali bulatan `50%`.
- Saiz: tiada `rem`; saiz font luar skala dipetakan (15→16, 11→12, 27→28, 22→24, 19→20, 12.5→13, 18.5→18). Pengecualian: monogram agensi 9px.
- Ralat borang (ClaimForm) = `--color-destructive`; fokus input AIFA = `--color-ring`; hover pautan AIFA = `--color-link`. Merah AIFA yang tinggal (togol, avatar, bubble pengguna, butang hantar) menunggu keputusan warna Tanya AIFA.

## Motion, lint dan aksesibiliti (21 Nov 2026)

- **Token motion** (`app/tokens.css`): `--duration-fast` 150ms (hover, warna, tekan) · `--duration-base` 250ms · `--duration-slow` 450ms · `--duration-page` 1.2s (transisi route sahaja). `--ease-out` cubic-bezier(.23,1,.32,1) = lalai untuk masuk/gerak/reveal · `--ease-in-out` (morf atas skrin, cth. ikon menu) · `--ease-emphasized` (anjakan kecil anak panah CTA) · `--ease-page` (transisi route sahaja).
- **`npm run lint:ds`** (`scripts/lint-ds.mjs`): hex, primitif palet, pustaka ikon lain, ikon Lucide tanpa `<Icon>`, `rem`, berat font luar skala, font selain Manrope, `transition: all`, warna lalai shadcn. Pengecualian: komen `ds-allow: <sebab>` pada baris yang sama. Exit 1 bila ada masalah (sedia untuk CI).
- **Kontras:** semua teks pada 4 halaman lulus WCAG AA (diimbas pada runtime terhadap latar sebenar). Tanya AIFA kini `--color-brand-strong` (#C8211C, 5.56:1 dengan putih) — masih merah, tetapi dulu 4.30:1 gagal AA. Nombor "/01" Empat fungsi = `--color-text-secondary`.
- **Fokus:** carousel media sosial (`.stories-viewport`) kini ada cincin fokus.

## Kad artikel gaya baharu (21 Nov 2026, rujukan elevenlabs.io)

`components/Articles.js › GridCard`, `.articles-card` dalam `global.css`.

- Kad: latar `--color-card`, border 1px `--color-border`, radius `--radius-card` (20), `overflow: hidden`, tiada bayang.
- Foto: full-bleed di atas (dipotong oleh radius kad), `aspect-ratio: 16 / 10`, latar `--color-muted-strong` sementara imej dimuat.
- Pill verdict atas foto: putih solid `--color-card`, 16px dari tepi, padding 8/12; teks kekal 13 Semibold UPPERCASE warna verdict.
- Avatar agensi: kiri bawah foto, 16px dari tepi.
- Badan (`.articles-card__body`): padding 20/24/24 (mobile 16/20/20), jarak 8; tajuk 20/26 Medium (mobile 18/24); tarikh 14 **Medium** `--color-muted-foreground`.
- Hover (pointer halus sahaja): foto zoom 1.03 (`--ease-out`), border → `--color-border-strong` (`--duration-fast`). Fokus papan kekunci: cincin pada kad (`:focus-within`).

## Keputusan 21 Nov 2026

- **Ikut `design.md`**: kad media sosial kini hitam polos (gradient platform dibuang); teks meta (tarikh kad, `.fc-meta`, `.story-meta`, `.post-meta`, meta kad logo) = Medium 500.
- Tanya AIFA = `--color-brand-strong` (kekal).
- Skop: laman web sahaja — CMS & extension dibuang dari plan.

## Kemas kini 21 Nov 2026 (petang)

- **Semakan fakta terkini:** butang "Lihat lagi" dibuang ().
- **Logo:** halaman `/logo` dibuang. Seksyen Logo dalam Tentang Kami ada `id="logo"`; menu Tentang Kami › Logo → `/about-us/#logo`. `PageTransition` kini mendarat pada `#hash` selepas transisi (dulu sentiasa ke atas).
- **Kad artikel:** border kini `--color-muted-strong` (hairline lembut); **tiada hover pada border** — hover hanya zoom foto 1.03.
- **Tentang Kami, seksyen 2 (About):** label + lead, tiga kad (cerita, pill agensi, statistik + bar keputusan Palsu/Penjelasan/Makluman) dan baris fakta dalam angka. Label kiri atas ialah **teks eyebrow biasa** (14 Medium, `--color-muted-foreground`), bukan pill.
- **Empat fungsi:** autoplay setiap 5s (`AUTOPLAY_MS`); berhenti bila hover atau fokus, bila tab tersembunyi, dan tiada autoplay dengan `prefers-reduced-motion`. Pilihan manual mula semula pemasa. `aria-live` hanya `polite` bila pengguna yang mengawal.
- **Galeri media sosial** (`components/Stories.js`, `.social-gallery`), menggantikan slider:
  - 5 kad sebaris (Instagram, Threads, X, TikTok, Facebook), tinggi 560, gap 8, `--radius-lg`. Kad terbuka `flex-grow: 4`, kad lipat `1`. Hover / fokus / ketik membuka kad.
  - Gerakan: lebar 600ms `--ease-out`; foto 1.1 → 1 dalam 800ms; kad lipat malap `brightness(.5)` (hover .7); teks naik 12px + pudar masuk selepas 180ms, keluar 150ms tanpa jeda; ikon platform kembali selepas 300ms.
  - Scrim baharu `--gradient-scrim-card` supaya teks putih terbaca atas foto/infografik yang sibuk.
  - Kad lipat: ikon platform sahaja. Kad terbuka: lencana platform + tarikh, tajuk 28/34, ringkasan 2 baris, CTA pill putih "Buka di {platform}" (44px, tekan `scale(.97)`).
  - Mobile (≤700): lajur menegak tinggi 720; ringkasan disembunyikan. `prefers-reduced-motion`: tiada transisi.
  - Data `stories` kini ada `image` + `alt` untuk setiap kad; Facebook ditambah (pautan ke halaman Facebook). Pemain video/embed dibuang — CTA membuka hantaran asal.

## Kemas kini 21 Nov 2026 (malam)

- **Galeri Tentang Kami** (`components/SphereGallery.js`, `.sphere-*`): sfera 3D foto bulat (port SphereImageGrid), menggantikan grid/akordion.
  - 36 nod (6 foto galeri berulang) atas sfera Fibonacci, jitter berbenih (tiada `Math.random`, selamat SSR). Pentas segi empat hingga 960px; jejari 0.4×, nod 0.18× saiz pentas, skala ikut kedalaman + jarak dari tengah, nod bertindih dikecilkan.
  - Gerakan ditulis terus ke DOM dari satu gelung rAF (tiada render semula React setiap bingkai); berhenti bila di luar skrin.
  - Auto-putar ~7°/s, terus berputar semasa hover (seperti kod asal); berhenti hanya semasa fokus papan kekunci, seret, dialog terbuka atau `prefers-reduced-motion`. Seret (pointer capture selepas 4px) dengan momentum (decay .94); seretan tidak membuka foto. Sentuh: `touch-action: pan-y` — leret mendatar memutar, menegak menatal halaman.
  - Nod: butang bulat, border 2px putih 20%, `--shadow-float`; hover (mouse) skala 1.2, tekan .97, fokus outline `--color-ring`.
  - Klik/ketuk → `<dialog>` asli, **foto sahaja tanpa kotak teks** (alt = kapsyen), butang tutup 44px ikon X; Esc/backdrop menutup. Masuk: opacity + scale .96 → 1, 300ms `--ease-out`; backdrop 200ms. Reduced motion: fade sahaja.
  - Petunjuk 14/20 `--color-muted-foreground`: "Seret untuk memutar, pilih foto untuk membesarkan."
- **Galeri media sosial — kad terlipat** (`.social-card__tint`): kembali seperti sebelum galeri elastik — panel dakwat dengan gradient warna platform (Instagram, Threads, X, TikTok, Facebook; `ds-allow: platform brand colour`) dan ikon platform 48px di tengah (32px ≤700). Foto hanya kelihatan pada kad terbuka.
  - Buka: tint pudar 250ms `ease`, ikon pudar + skala .8 dalam 120ms. Tutup: tint dan ikon kembali selepas 250–300ms, bila baris sudah stabil. Hover (mouse) pada kad terlipat: tint brightness 1.35.
  - Ini menyimpang daripada keputusan design.md "tiada gradient pada kad" atas permintaan pengguna (21 Nov 2026).

## Scroll motion — line reveal tajuk
`components/ScrollMotion.js` (dipasang di Utama, Tentang Kami, detail artikel). Tajuk dalam senarai `lineBlocks` dipecah per baris (GSAP SplitText, `mask: 'lines'`) dan naik dari `yPercent 100` ke 0: 0.9s, `power4.out`, stagger 0.08, sekali sahaja apabila atas tajuk sampai 85% viewport. Mask setiap baris diberi padding .14em/.2em (margin negatif sama) supaya huruf tinggi dan descender tidak terpotong; selepas animasi, split di-revert jadi teks biasa. Teks badan, kad dan data tidak bergerak. `prefers-reduced-motion` mematikan semua. Pembaca skrin mendapat `aria-label` penuh dari SplitText.

## Halaman baharu (21 Nov 2026)
- `/submit-claim/` (`app/submit-claim/page.js`): lawatan terus (pautan dikongsi, tab baharu) dapat halaman "Lapor berita tular" dan borang pop-up `ClaimForm` terbuka sendiri. Klik dalam laman masih buka pop-up tanpa navigasi.
- 404 (`app/not-found.js`): header + footer, eyebrow "Ralat 404", tajuk display, dua jalan keluar (Utama filled, Artikel outline). Gaya `.page-notice`.

## Pembaikan audit MEDIUM (21 Nov 2026)
- **Tajuk seksyen:** satu peranan untuk semua halaman (`.latest-checks__title`, `.activity__title`, `.about-title`, `.about-fn-title`, `.logo-kit-title`): 36/42, weight 500, rata kiri; telefon 28/34. Display 400 hanya untuk hero. Sub-tajuk dalam seksyen (`.about-subtitle`) 24/32.
- **Outline tajuk:** carousel hero ada `<h2 class="sr-only">Semakan fakta pilihan</h2>` supaya slaid H3 tidak melangkau tahap.
- **Semibold (600)** hanya untuk label verdict (dan wordmark logo). Eyebrow, badge, heading footer, label AIFA, tajuk keputusan AIFA, tajuk borang: 500. `b, strong`: 500 (deklarasi rosak `…semibold)er` dibaiki).
- **Satu butang filled per skrin:** muat turun Logo/Ikon kini `variant="outline"`. Butang header "Salur Kepada Kami" jadi outline di Utama sahaja (hero "Semak" ialah aksi utama di sana); halaman lain kekal filled.
- **Merah jenama** tidak lagi dipakai sebagai teks (eyebrow WSIS → `--color-muted-foreground-inverse`). Tanya AIFA kekal merah (keputusan #4 terbuka) tetapi tanpa glow merah dan tanpa lompat: `--shadow-float`, hover sedikit gelap, tekan scale .97.
- **Poster WSIS** (`img[src*="wsis"]`) guna `object-fit: contain` atas `--color-card` supaya teks poster tidak terpotong.
- **Kad foto "275 juta+":** lapisan 20% + scrim kecerunan hanya di separuh atas (60% → 45% → 0 pada 80%). Diukur pada piksel sebenar: kapsyen ≥ 4.75:1 (desktop) / 5.32:1 (telefon) pada titik paling terang.
- **Galeri sfera:** kawasan tekan halimunan ≥ 24 px pada skrin (`--node-hit` dari JS, `.sphere-node::after`).
