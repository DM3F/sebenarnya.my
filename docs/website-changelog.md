# Sebenarnya.my website — catatan implementasi & sejarah

> **Bukan spesifikasi design system.** Fail ini ialah log kerja **laman web** sebenarnya.my: keputusan per halaman, ukuran seksyen, dan sejarah perubahan sejak Nov 2026. Banyak nilai di bawah sudah **usang** (cth. `--color-ring` biru, override tipe mobile, `--radius-lg`) dan disimpan hanya sebagai sejarah.
>
> Untuk design system (dipakai juga oleh CMS dashboard dan browser extension), baca:
> - [`README.md`](README.md) — peta dokumen dan cara guna di produk lain
> - [`design.md`](design.md) — rasa visual
> - [`design-system-rules.md`](design-system-rules.md) — token, komponen, lint
> - `app/tokens.css`, `app/ui.css`, `components/ui/` — **sumber kebenaran**; jika fail ini bercanggah dengan kod, kod yang betul.
>
> Rujukan awal (sejarah sahaja): Figma `wxC95N2gmMWvBOWU1K7Nsy`. Fail Paper `sebenarnya.my` bukan lagi rujukan.

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
`--color-white #FFFFFF` · `--color-grey-99 #FDFCFC` (eggshell) · `--color-grey-95 #F5F3F1` (warm taupe) · `--color-grey-91 #EBE8E4` (stone) · `--color-grey-82 #D7D2CC` (pill edge) · `--color-grey-50 #878179` (field edge) · `--color-grey-43 #6F6A63` (smoke) · `--color-grey-41 #6B6A68` · `--color-grey-25 #44403B` (graphite) · `--color-black #000` · `--color-red #E8302A` · `--color-red-dark #C8211C` · `--color-blue #3A46F5` · `--color-azure #2F5FD0` · `--color-green #1FA463` · `--color-green-dark #137A49`

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
| `--color-ring` | blue | fokus |
| `--color-link` | blue | pautan |
| `--color-destructive` | red-dark | teks ralat, field tidak sah |
| `--color-brand` / `-strong` | red / red-dark | logo, sphere — BUKAN aksi |
| `--color-brand-spark` | blue | hiasan |
| `--color-hairline` | rgba(0,0,0,.05) | garis halus |
| `--color-verdict-{palsu,makluman,benar}` | red-dark / azure / green-dark | perkataan verdict (tone single) |
| `--color-verdict-*-dot` | red / orange / blue / green | titik verdict |

Saiz kawalan ikut **skala kawalan fluid** (375 → 1280px): `sm` `--size-control-sm` 32→36 · `md` `--size-control` 40→44 (lalai) · `lg` `--size-control-lg` 44→48 · `xl` `--size-control-xl` 48→56 (search utama + Tanya AIFA sahaja). Padding sisi `--space-control-x-sm/-x/-x-lg` 12→16 · 16→20 · 20→24. Sasaran sentuh kekal 44 (`::after`). Radius `--radius-full`.
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

**Peraturan: semua label interaktif (button, nav, tab, chip, dropdown, CTA, link footer) = 16 / 24 Medium** — tiada label 18px. **Semua tajuk guna Medium 500** (Display H1, tajuk seksyen, tajuk slaid carousel, award, heading, title), dibaca daripada `--font-weight` peranannya, tidak pernah ditulis tangan. **Angka statistik guna 400** melalui `--font-weight-display` (kini untuk angka sahaja). Regular 400 untuk body; Light 300 hanya untuk kapsyen statistik. Tiada 700+.

Token: komponen **hanya** guna type role `--text-{display,heading-lg,heading,title,intro,article,body,body-sm,label,label-sm,eyebrow,badge,verdict,caption,stat}` (+ `--line-height`, `--font-weight`, `--letter-spacing`). Role besar fluid dengan `clamp()` (375 → 1280px), tiada media query untuk type. Jadual penuh: `docs/design-system-rules.md` › Type roles. Primitive (`--text-12…48`, `--leading-heading` 1.2, `--leading-body` 1.5; tracking 0 kecuali `--tracking-label` untuk UPPERCASE) hanya dalam tokens.css.

Mobile (<600px): Display → `--text-38`/`--leading-42`, Heading/36 → `--text-30`/`--leading-36`, Heading/32 → `--text-28`/`--leading-34` (tukar dalam media query komponen). Body kekal 400, max 68ch.

> **Peraturan kini (ganti senarai di bawah):** komponen guna role jarak `--gap-inline/text/group/cards/block` dan saiz kad `--pad-card-sm/-/lg` + `--radius-card` / `--radius-card-lg`. Lihat `docs/design-system-rules.md` › Spacing & radius roles.

### 2.4 Spacing (4px base) — `--spacing-*`
`2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 44, 48, 56, 64, 72, 96, 120`
- 8: gap pill berpasangan/chip · 12: gutter grid · 16: inset, margin mobile · 20: padding sisi pill · 24: title→body panel · 32: padding kad · 40: bawah header section · 64: padding stage · 96: hero top.

**Ritma halaman (token peranan, `app/tokens.css`) — semua halaman guna yang sama:**
| Token | Desktop | ≤1280 | ≤1024 | ≤900 | ≤600 | Guna |
|---|---|---|---|---|---|---|
| `--space-page-x` | 96 | 48 | 48 | 24 | 16 | Gutter halaman: header, setiap seksyen, footer (`--side` ialah alias) |
| `--space-section` | 120 | ≈120 | ≈104 | ≈96 | 64 → ≈78 | Fluid `clamp(64, 40.8px + 6.188vw, 120)`: 64 @375 → 120 @1280, ≈3× `--gap-block`. Jarak antara seksyen; `.main` ialah flex column dengan `row-gap` ini + `padding-bottom` sebelum footer; padding atas footer |
| `--space-page-top` | 40 | 40 | 40 | 40 | 24 | Header → blok pertama pada halaman tanpa hero (Artikel, detail) |

Seksyen **tidak** ada padding atas/bawah sendiri; jarak datang dari `.main`. Kumpulan rapat dapat separuh (`.hero + .hero-carousel`, `.hero-carousel + .partners`: −½ `--space-section`). Seksyen baharu: cukup `padding-inline: var(--space-page-x)`.

### 2.5 Radius
`--radius-sm: 4px` · `--radius-input: 8px` · `--radius-md: 12px` (thumbnail, media, dropdown) · `--radius-card: 20px` (kad, stage, panel) · `--radius-lg: 24px` (feature card, hero stage) · `--radius-full: 9999px` (SEMUA button, tab, chip, search).

### 2.6 Effects
```css
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
- Dipakai: ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown/Left/Right, Search, X, MessageSquareText, Flag, Check, Link, CloudUpload, Share, Download, Calendar, Play (butang jeda dan `filledIcons` dibuang 22 Nov 2026).
- **Pengecualian:** logo jenama (Facebook, Instagram, Threads, X, TikTok) bukan dalam Lucide → kekal SVG jenama (`data/content.js`).
- Jangan guna glyph teks (↗ → ‹ ›), SVG tulis tangan atau set ikon lain. Jangan override `stroke-width` dalam CSS.

### 2.7 Layout
Page max `--max-width`, sisi `--space-page-x` (96 → 48 ≤1280 → 24 ≤900 → 16 ≤600). Editorial grid 12 kolum, gap 12 (heading span 7, copy col 9–12). Breakpoints (nombor dalam media query; tiada token kerana media query tak boleh baca variable): 1100 header kompak · 900 susun atur bertindan · 600 telefon.

---

### 2.x Motion — page transition
- `components/PageTransition.js` (dalam `app/layout.js`): tangkap klik link dalaman, jalankan `document.startViewTransition`, lalu `router.push`. Link `/submit-claim/`, tab baru, link luar dan hash tidak disentuh.
- CSS: crossfade bawaan pelayar, `::view-transition-group(root)` `--duration-base` (250ms) `--ease-out`. Opacity sahaja, jadi sama untuk reduced motion. Halaman baru main entrance sendiri (`PageEnter`). (Dulu 1.2s naik + wipe; `--duration-page` dan `--ease-page` dibuang, 23 Nov 2026.)
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
- `Verdict` (`type`: palsu | makluman | benar, `tone`: default | single, `agency`) — hanya tiga verdict
- `SearchField` (`label`, `hideLabel`, `placeholder`, `buttonLabel`, `value`+`onChange(text)` atau `defaultValue`, `error`, `action` atau `onSubmit(query)`)
- `Tabs` `mode="toggle"` → `role=group` + `aria-pressed` (tiada tab panel)
- `NavLink` (`href`, `current`) — link nav tanpa border, padding sisi `--space-control-x` (20). State: rehat weight 400 transparent · hover bg `--color-accent` (pointer sahaja) · tekan scale .97 · halaman aktif weight 500, tanpa fill · fokus ring standard
- `LanguageMenu` (`items` [{value, label, lang, flag}], `value`, `onChange`, `label`, `groupLabel`, `align`) — pill bendera bulat 24 + chevron (border `--color-border`, bg `--color-secondary`); panel `--radius-menu` + `--shadow-float`, label kumpulan caption muted, item bendera + nama, terpilih bg `--color-accent`. Masuk 150ms opacity+scale .96 dari sudut trigger. Bendera: `public/images/flags/*.svg`
- `DropdownMenu` (`label`, `items` [{label, href, current}], `current`, `align`) — trigger NavLink + chevron, panel pautan. `.ui-dropdown__item` boleh `<a>` atau `<button>` (chrome butang browser dibuang: tiada border/bg, lebar penuh)
- Menu mudah alih: label kumpulan (cth. Tentang Kami) sama saiz/warna dengan Utama/Artikel; anak pautan `--text-label-sm` (14), muted, inden 32
- Menu Kongsi: `.ui-menu` (sama dengan dropdown nav dan bahasa), muncul 150ms opacity + scale .96 dari tengah atas (butang Kongsi)
- `Button`/`Chip`/`NavLink` dengan `href` render `<a>` biasa (tiada kebergantungan Next.js) supaya boleh guna di CMS/extension.

Untuk CMS/extension: salin `app/tokens.css` + `app/ui.css` (+ `components/ui/` jika React). Sudah dipasang: **Header** dan **Hero** (lihat di bawah). Komponen lain belum.

### Button
- Asas (`md`): `height --size-control` (40 telefon → 44 desktop); `padding 0 --space-control-x` (16→20); radius pill; Label/16; gap 8px (ikon 16px).
- Saiz: `sm` 32→36, padding 12→16, Label/14 · `md` (lalai) · `lg` 44→48, padding 20→24 · `icon-sm` / `icon` / `icon-lg` segi empat sama dengan tinggi masing-masing. Di bawah 44px, `::after` halimunan kekalkan sasaran sentuh 44.
- `filled`: bg `--color-primary`, text `--color-primary-foreground`; hover bg `--color-primary-hover`.
- `outline`: bg `--color-background`, border `.5px solid --color-border-strong`; hover bg `--color-muted`.
- `ghost`: bg `--color-background`, text underline; hover bg `--color-muted`.
- `focus` (semua): `border: 2px solid --color-ring`.
- `disabled`: bg `--color-muted-strong`, border `.5px --color-border-strong`, text `--color-muted-foreground`.
- Pasangan button: gap 8px. Props: `variant`, `size?` (sm · md · lg · icon-sm · icon · icon-lg), `icon?`, `href?`.

### Chip
Tinggi sama dengan Button: `sm` 32→36 (Label/14) · `md` 40→44 (lalai) · `lg` 44→48; radius pill; bg `--color-secondary`; Label/16. Hover `--color-secondary-hover`. Didahului label "Popular:" Body/14 Smoke.

### Tabs/Segmented
Container setinggi satu kawalan `md` (`--tabs-height`), `padding 2px; gap 2px; radius pill`. Tab = `track − 2 × (2 + border)`, jadi seluruh kawalan sama tinggi dengan Button di sebelahnya. Item terpilih bg `--color-card` + border `--color-border`.

### Field/Search
Saiz: `lg` (lalai, `--size-control-xl` 48→56) · `md` (44→48) · `sm` (40→44, toolbar). `padding 0 4px 0 --space-control-x; radius pill; bg --color-background; border 1px --color-border-strong; gap 12`. Ikon carian 18px Smoke, placeholder Body/16 Smoke, Button filled "Semak" di kanan, tingginya = `search − 2 × (4 + border)` (38 telefon → 46 desktop), jadi jarak 4px sama di atas, bawah dan kanan. Focus: `border 2px --color-ring` + `box-shadow 0 0 0 1.5px --color-ring`. Label atas: 14 Medium Ink.

### Verdict
Skala badge, bukan kawalan: `pill` (lalai) = badge `lg` 32, padding `0 12 0 10`; `overlay` / `tint` = badge `md` 24, padding `0 10 0 8`. Gap 8; radius pill; bg `--color-background`. Dot 8px (warna dot) + halo `0 0 0 3px <dot> @18%` + perkataan Verdict/13 + agensi Body/13 Smoke (`· KPDN`).
- `tone="default"`: perkataan Ink.
- `tone="single"`: perkataan guna warna text verdict.
- Selalu dot + perkataan + agensi (WCAG 1.4.1). Varian: `palsu | makluman | benar` sahaja (label: Palsu, Makluman, Benar).

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
- **Berita dan Galeri (kemas kini 22 Nov, marquee):** kepala di tengah (tajuk bahagian + intro). Dua baris foto berita (`aboutNews.marquee`, data demo + foto janaan AI) bergerak berlawanan arah ~28px/s: baris atas ke kiri, bawah ke kanan, gelung tanpa lompatan (dua set sama, `translateX(-50%)`). Kad lebar 529×340 (foto + tag + tajuk 20px) dan kad sempit 166×340 (foto + tag), jarak 10px, jejari `--radius-card`, kaki gelap `--gradient-scrim-bottom` supaya teks putih ≥ 4.5:1. Berhenti semasa hover/fokus dan dengan butang jeda (WCAG 2.2.2); dengan reduced motion baris tidak bergerak dan boleh digulung tangan. Tinggi kad 340 / 280 (≤1100) / 220 (≤600). Di bawahnya sfera foto; tajuk "Galeri" `sr-only`.
- **Logo:** `LogoKit headingLevel={2}` — gaya sama dengan page `/logo` (tajuk 36/42, pratonton 475 muted, butang `Button` filled).

### Halaman detail artikel ✅
Padding 32 atas / 96 bawah, sisi 81 (48 ≤1280, 24 ≤900, 16 ≤600). "Semua artikel" 16/24 Medium + ikon 20. Tag: `Verdict tone="single"` dengan agensi + pil kategori 14/20 Medium, kedua-duanya border .5px `--color-border`, tinggi 44. Tajuk 48/52 Medium `--tracking-display` (32/36 ≤600), subtajuk 18/28 `--color-text-secondary`, meta 14/21 `--color-muted-foreground` + butang Kongsi (border 1px, 16/24 Medium, ikon 20). Imej 1100 × 2:1, `--radius-card` (4:3 ≤600). Lajur bacaan 680: lead 18/28, garis pemisah, "Penjelasan rasmi" 24/32 Medium.

### Halaman Artikel ✅
- Sisi `--articles-side` 96 / 48 / 24 / 16, padding atas 40, bawah 96.
- **Penapis:** carian pill 44 (border 1px `--color-border-strong`, ikon Search 18, input Manrope 16) + 2 `<select>` asli bergaya pill 44 (border `--color-border`, label 16 Medium, ChevronDown Lucide) + kiraan 14 `--color-muted-foreground`. Chip kategori pill 44 bg `--color-muted`, label 16 Medium, dot verdict 7px; terpilih = `--color-primary` + `--color-primary-foreground`; baris boleh skrol dengan butang ‹ › 44 bila melimpah.
- **Hasil:** jika >4 hasil — kad utama (960:440, tinggi 560, radius 20, scrim bawah, tajuk 28/36 Medium putih, tarikh 14) + senarai sisi 4 item (thumb 160×122 radius 12, tajuk 20/26 Medium, tarikh 14); kemudian grid 4 kolum (3 ≤1280, 2 ≤900, 1 ≤600), gap 32/24. Kad grid: bg `--color-muted`, radius 20, padding 8/8/20, foto 220 radius 12, tajuk 20/26, tarikh 14.
- Pill verdict atas foto: bg `--color-background` 90%, dot `--color-verdict-*-dot`, perkataan 13 semibold UPPERCASE `--color-verdict-*`. Status `benar` dilabel **"Benar"**.
- Seluruh kad boleh diklik (pautan tajuk `::after`), cincin fokus pada kad.

### Tanya AIFA (floating)
Pill `padding 10px 22px 10px 18px; min-height 44`, ikon chat 24px + "Tanya AIFA" Label/16. Dalam artwork merah `#e51c23` + shadow merah — **bercanggah dengan rule "Red bukan warna aksi"**. Cadangan: Button filled Ink + `--shadow-float` (sahkan dengan user).

### Kad
- **Article card (page Artikel):** lebar 230; imej 276 tinggi radius 26→`--radius-card`; pill verdict kiri atas (bg white 90% + blur 10, padding 6px 10px, dot 7px, 13 SemiBold); avatar agensi 30px bulat kiri bawah; tajuk Heading/20; tarikh Body/14 @60%.
- **FactCheckCard ✅ (Home "Semakan fakta terkini"):** `components/FlipCard.js`, 340×480, radius `--radius-card`. Flip dikekalkan: hover tetikus, klik/tap, Enter/Space (fokus pindah ke sisi yang kelihatan), `rotateY(180deg)` .6s `cubic-bezier(.77,0,.175,1)`, tiada animasi jika reduced motion.
  - Depan: foto penuh; scrim atas tipis (0.35→0, 120px) di belakang logo dan scrim bawah pekat (0.8→0.55→0, 300px) di bawah teks supaya teks putih kekal ≥4.5:1 atas sebarang foto; **logo agensi 44 putih (logo 30, atau monogram) di kanan atas**; **pill verdict (dot + PERKATAAN 13 semibold) + tajuk 24/125% Medium putih di bawah** (inset 24); tiada ikon panah.
  - Belakang: bg `--color-muted`, border 1px `--color-border`, padding 24; `● PALSU · MCMC` (perkataan warna `--color-verdict-*`) + avatar 36; tajuk 20/130% Medium; ringkasan 16/24 `--color-text-secondary`; meta 13 `--color-muted-foreground` "Disemak {tarikh}" + "Sumber: kenyataan rasmi {agensi}" atas garisan; CTA penuh lebar tinggi 48, padding 6/6/6/20, `--color-primary`, label 16 Medium "Baca semakan" + bulatan ↗ putih 36 (konsentrik dengan radius pill); hover `--color-primary-hover` + ikon geser 2px ↗; tekan `scale .96`. Kedua-dua sisi tepat 480px (`box-sizing: border-box`) supaya tinggi kad tidak berubah semasa flip; ringkasan max 4 baris.
- **Seksyen "Semakan fakta terkini" ✅:** `components/Latest.js`. Padding atas/bawah 96 (64 ≤1280, 48 ≤600), sisi `--latest-side` 96 / 48 ≤1280 / 24 ≤900 / 16 ≤600 untuk tajuk dan butang sahaja — **baris kad full-bleed hingga tepi skrin** (seperti hero carousel), kad pertama sejajar dengan tajuk; gap 48; tajuk Heading/36 Medium **2 baris seimbang (22 + 22 aksara): "Semakan fakta terkini, / disahkan agensi rasmi."** (≤600px baris mengalir dengan `text-wrap: balance`, kekal 2 baris). Baris kartu = **gelangsar automatik tanpa hujung** (12 semakan terbaru, setiap satu gambar unik): kad duduk atas "cincin" — kad yang keluar di kiri masuk semula di kanan, tiada salinan pendua. Kelajuan 36px/s; **hover tetikus = perlahan hingga berhenti, mouse leave = laju semula** (ease ~0.2s). Juga berhenti semasa kad diflip, fokus papan kekunci di dalam (kad yang difokus dibawa ke pandangan), diseret (sentuh/pen), dan sentiasa di bawah `prefers-reduced-motion`. Butang ‹ › 44 bulat (border `--color-border`) gelongsor tepat satu kad; "Lihat lagi" `Button` outline dengan border `--color-foreground`, di tengah.
- **Seksyen yang sama di bawah halaman artikel ✅:** `<Latest status={article.status} exclude={article.slug} />` di `app/article/[slug]/page.js`. Gaya, gelangsar dan flip sama seperti di Home; hanya semakan dengan **verdict yang sama** (palsu / benar / makluman), tanpa artikel yang sedang dibaca. Tajuk + sub-tajuk ikut verdict, dari `articleStatus[status].related` di `data/content.js`: Palsu "Dakwaan palsu lain", Benar "Fakta benar lain", Makluman "Makluman lain". Senarai pendek (cth. 3 benar) diulang hingga ≥ 8 kad supaya cincin tidak berlubang.
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
- Bahagian "Bagaimana kami menyemak fakta" dibuang daripada halaman kerana tiada dalam canvas (data `howItWorks` kemudian dibuang, 23 Nov 2026).
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
- **Tajuk seksyen:** satu peranan untuk semua halaman (`.latest-checks__title`, `.activity__title`, `.about-title`, `.about-fn-title`, `.logo-kit-title`): 28 → 36 fluid, weight 500, rata kiri. Display H1 juga 500. Sub-tajuk dalam seksyen (`.about-subtitle`) 24/32.
- **Outline tajuk:** carousel hero ada `<h2 class="sr-only">Semakan fakta pilihan</h2>` supaya slaid H3 tidak melangkau tahap.
- **Semibold (600)** hanya untuk label verdict (dan wordmark logo). Eyebrow, badge, heading footer, label AIFA, tajuk keputusan AIFA, tajuk borang: 500. `b, strong`: 500 (deklarasi rosak `…semibold)er` dibaiki).
- **Satu butang filled per skrin:** muat turun Logo/Ikon kini `variant="outline"`. Butang header "Salur Kepada Kami" jadi outline di Utama sahaja (hero "Semak" ialah aksi utama di sana); halaman lain kekal filled.
- **Merah jenama** tidak lagi dipakai sebagai teks (eyebrow WSIS → `--color-muted-foreground-inverse`). Tanya AIFA kekal merah (keputusan #4 terbuka) tetapi tanpa glow merah dan tanpa lompat: `--shadow-float`, hover sedikit gelap, tekan scale .97.
- **Poster WSIS** (`img[src*="wsis"]`) guna `object-fit: contain` atas `--color-card` supaya teks poster tidak terpotong.
- **Kad foto "275 juta+":** lapisan 20% + scrim kecerunan hanya di separuh atas (60% → 45% → 0 pada 80%). Diukur pada piksel sebenar: kapsyen ≥ 4.75:1 (desktop) / 5.32:1 (telefon) pada titik paling terang.
- **Galeri sfera:** kawasan tekan halimunan ≥ 24 px pada skrin (`--node-hit` dari JS, `.sphere-node::after`).

## Seksyen "Cara Sebenarnya.my membantu" (Utama, sebelum Aktiviti media sosial)
`components/KenaliSebenarnya.js`, gaya `.kenali*` (dulu `HowItWorks.js` / `.how*`) dalam `app/global.css`. Grid bento 3 kolum (`grid-template-areas`):
saluran | foto tinggi (3 baris) | empat verdict · cerita foto | foto | stat "24 jam" (2 baris) · agensi | foto | stat.
Tablet (≤1024) 2 kolum, telefon (≤600) satu kolum. Gap kad `--spacing-20` (telefon 12), padding kad 32 (telefon 24), radius `--radius-card`.
- Kad baca: latar taupe `--color-muted`, tanpa bayang. Satu kad tinta (stat) dengan angka besar weight 400 + unit separuh saiz (sama skala dengan statistik viewership).
- Foto: full-bleed, hover zoom 1.03 (pointer sahaja). Kapsyen putih atas scrim bawah (80% → 55% → 0), diukur ≥ 6.4:1 pada piksel paling terang di 1440/768/390.
- Verdict guna komponen `Verdict` (dot + perkataan). Ikon Lucide dalam cakera kanvas 48.
- Tajuk seksyen guna peranan tajuk seksyen dikongsi (`.how__title`). Animasi: tajuk naik per baris; kad masuk melalui ScrollMotion dengan stagger tidak sekata 60–300 ms; `prefers-reduced-motion` matikan.
- Disesuaikan daripada contoh BentoGridShowcase (Tailwind/shadcn/framer-motion): susun atur sahaja; tiada kebergantungan baharu.

## Seksyen Logo — folder format (Tentang Kami, paling bawah sebelum footer)
`components/LogoKit.js` + `components/FormatFolder.js`, gaya `.logo-kit*`, `.logo-card*`, `.folder*`, `.logo-terms*` dalam `app/global.css`. Reka bentuk daripada kanvas Wonder ("Logo Kit Section").
- Susun atur: tajuk + intro di tengah; grid 2 kolum (gap 32; satu kolum ≤900) — kad `--color-muted`, radius `--radius-lg`, padding 32 (telefon 20): tajuk 36/42 (28/34 telefon) · keterangan 16 · meta 14 → pratonton (logo 356×107 / ikon 134×134, di tengah) → folder format. Kotak "Terma penggunaan logo" di bawah (`--color-border`, radius `--radius-card`, padding 32, teks 16/21, jarak atas 56).
- **Folder:** dilukis pada pentas 391×286 dan diskala ke lebar kad dengan nisbah tanpa unit daripada container query (`tan(atan2(100cqw, 391px))`) — tiada JS resize. Plat belakang `--color-folder-back`, poket depan `--color-folder-front` (tepi `--color-folder-edge`), pil ikon mini `--color-folder-pill`. Tiga jubin 101×101 (JPEG, PNG, SVG; ikon fail di `public/images/formats/*.svg`) di kedudukan kanvas. Warna mengikut kanvas Logo Kit Section: poket `rgb(71 67 64 / .95)`, pil `#766e69`, teks cip `--color-accent`; padding kad 48, jarak antara bahagian 64, kad terma `--color-muted`. Token baharu dalam `tokens.css`: `--color-folder-*`, `--gradient-tile-jpeg/svg`, `--color-tile-png`, `--color-tile-svg-mini`, `--shadow-tile` (bayang jubin mengikut kanvas — pengecualian kepada "elevation dari tone").
- Muat turun: chip PNG / SVG / JPEG (`<a download>`, aria-label "Muat turun Logo (PNG)"). Fail: `logo.*` dan `icon-download.*` dalam `public/images/logo/`. **JPEG** = latar putih. **SVG masih membungkus PNG** (bukan vektor) sehingga artwork vektor asal dibekalkan.
- Gerak (daripada komponen IconFolder yang ditampal, nilai asal): masuk sekali apabila 30% kelihatan — kad naik 34 px + skala .92 → rehat dalam .9s `cubic-bezier(.2,.8,.2,1)`, jubin menyusul dengan delay .35s + .08s setiap satu. Sebaran: hover tetikus, ketuk, atau fokus papan kekunci pada chip → kad naik 6 px + skala 1.02, poket turun 6 px, jubin merebak 10.5 px × jarak dari tengah, naik 4 px, condong ×1.2 (.6s, delay .04s setiap satu). Hover satu jubin: naik 26 px, skala 1.1, jubin lain skala .96 + saturasi .75 / kecerahan .85, label format muncul dan chip padanan disorot. Penyimpangan kecil: selepas kemasukan (1.6s) hover tidak lagi guna delay .35s supaya tindak balas serta-merta. Chip: `:active` skala .97, `:focus-visible` outline putih.
- `prefers-reduced-motion`: tiada kemasukan, tiada pergerakan (jubin kekal condong asal).
- Jubin ialah hiasan (`aria-hidden`); kawalan sebenar ialah pautan muat turun.

## Hierarki tipografi satu sistem (21 Nov 2026)
- Saiz maksimum 48px (H1 halaman). Peranan: display 48 · section 36 · heading 24 · title 20 · lead 18 · body 16 · small 14 · eyebrow 13; angka statistik 48. Tablet/telefon turun ikut token (`app/tokens.css` › Type roles). `body` kini 16 (dulu 20 dan bocor ke elemen tanpa saiz).
- 63 deklarasi saiz ad hoc dibuang daripada kelas komponen; saiz kini datang dari blok "Type roles" di hujung `app/global.css`. Komponen baharu: pilih peranan, jangan tulis `font-size` sendiri.

## Logo media sosial + pop-up pratonton (Utama › Cara Sebenarnya.my membantu)
- `components/SocialPeek.js`: baris logo platform (Instagram, Threads, X, TikTok, Facebook; ikon Simple Icons dari `socialLinks`), butang 48px kanvas, hover tinta.
- Tekan logo → `<dialog>` modal (`showModal`): backdrop 60% hitam, panel putih `--radius-card`, masuk opacity + scale .96 (200–250ms). Isi: badge platform + tarikh, tajuk (peranan heading), ringkasan, butang outline "Buka di …", media 9:16 di kanan.
- Media: `video` tempatan (Instagram) → `embed` rasmi platform (Threads, X, TikTok; dimuat hanya bila pop-up dibuka) → imej muka depan (Facebook, pautan halaman). Data dalam `stories` (`data/content.js`).
- Escape, butang tutup dan klik backdrop menutup; fokus kembali ke logo yang membukanya. Telefon: satu kolum, media 48dvh.
- Kad verdict seksyen ini kini tiga sahaja: Palsu, Makluman, Penjelasan (jenis `benar`).

## WSIS dipindah ke "Cara Sebenarnya.my membantu" (21 Nov 2026)
- **Poster WSIS** (`/images/bento/wsis-prize-award.webp`, persegi) duduk di kad kiri tengah (kawasan `story`, dulu foto warga emas), `object-fit: contain` atas `--color-card` + garis rambut `--color-border`: trofi dan tulisan poster tidak pernah terpotong. Kad min 300px tinggi (poster ≈300px di desktop); telefon: kad persegi. Kad tinggi tengah kekal foto "Tanya sebelum kongsi."
- Kad tinta (dulu "24 jam") kini **Juara Dunia**: eyebrow 13 UPPERCASE + ikon trofi, tajuk peranan section (36/400, telefon 28), satu baris konteks (lead, putih 60%), butang `media` "Ketahui lebih lanjut" → `/about-us/#berita-galeri`. Teks penuh kekal di Tentang Kami › Berita.
- Banner WSIS (`components/Bento.js`) dan gayanya dibuang; "Aktiviti media sosial terkini" kini galeri media sosial sahaja.

## Seksyen dibuang + semakan bahasa (22 Nov 2026)
- Dibuang: **Empat fungsi utama kami** (Tentang Kami; data `whatWeDo`, komponen dan gayanya) dan **Aktiviti media sosial terkini** (Utama; `components/Stories.js` dan gaya `.activity` / `.social-card`). Nota lama tentang kedua-duanya di atas kini sejarah sahaja. Pratonton media sosial kekal melalui logo dalam kad "Ikuti kami" (`SocialPeek`). Kelas `.about-fn-controls/-arrows/-track` kekal kerana dipakai oleh Berita dan Galeri.
- Bahasa: semua teks antara muka dalam Bahasa Melayu baku (rujukan istilah laman MCMC). Dibetulkan: "Temukan" → "temui", "tangkap layar" → "tangkapan skrin", "Terbaru/Terlama dahulu" → "Terkini/Terawal dahulu", "nak"/"jumpa" → "hendak"/"menemui", "Semak Tentang Kami" → "Ketahui tentang kami". "dari" hanya untuk tempat/masa, "daripada" untuk sumber.

- **Hero Tentang Kami (22 Nov 2026, ikut Wonder › About Hero Section):** gambar baharu `public/images/about/hero-2026.jpg` (menara kaca, 1600w, dari 3276×4096) dengan `filter: brightness(.66)` (= lapisan hitam 34%) + scrim dari bawah (60% → 40% → 0 pada 65%) di belakang tajuk dan perenggan; diukur pada piksel paling terang: perenggan ≥ 6.9:1, tajuk ≥ 3.4:1. Tajuk max 12em (2–3 baris), perenggan max 47em. Jenis dan jarak kekal ikut peranan tapak (display 48, body, label), bukan nilai Wonder (40/20/24).

## Berita (Tentang Kami) + angka statistik (22 Nov 2026)
- **Berita, desktop:** kad besar kiri = berita aktif; kad kecil kanan = giliran seterusnya. Bila maju (autoplay 5s / ›), kandungan berita seterusnya masuk ke kad besar dari kanan dan setiap kad kecil beralih satu slot ke kiri (`news-in`: translateX 40px → 0 + opacity, 380ms `--ease-out`, stagger 50ms). ‹ membalikkan arah (`data-dir="back"`). Saiz kad tidak berubah (480×488 besar). Reduced motion: pudar sahaja.
- **Berita, telefon (≤700):** hanya kad besar dipaparkan; autoplay berulang tanpa henti (WCAG 2.2.2: butang jeda kekal).
- **Angka:** komponen `components/CountUp.js` dipakai di Utama (statistik) dan Tentang Kami (fakta + "20+"): kira dari 0 bila masuk viewport (2s ease-out expo), lebar dikunci dan angka tabular hanya semasa mengira; selepas itu angka proporsional + `--text-stat--letter-spacing` (−0.02em) supaya "1,016" tidak renggang. Reduced motion: terus nilai akhir.

## Kenali Sebenarnya.my: nama dan kad Juara Dunia (22 Nov 2026)
- Komponen `components/KenaliSebenarnya.js`, kelas `.kenali` / `.kenali__*` (dulu `HowItWorks` / `.how`). Kawasan grid kini ikut isi: `channels · photo · visitors · poster · award · social` (dulu `main · story · stat · agencies`).
- Kad Juara Dunia: eyebrow → "Juara Dunia" (peranan section, 400) → sub "dalam Kepercayaan Digital & Semakan Fakta Awam" (peranan title 20/500, putih) → perenggan penuh (body 16, putih 60%) dengan fakta **33 juta rakyat** dan **lebih 20 agensi persekutuan** dalam `<strong>` putih 500 → butang "Ketahui lebih lanjut".

## Peranan jarak + jenis diluaskan ke modal, borang, menu dan footer (22 Nov 2026)
- **Borang Lapor (modal):** kad besar: padding `--pad-card` (atas/bawah) × `--pad-card-lg` (sisi); medan `--gap-group` (16) baris dan lajur; tajuk → deskripsi `--gap-text`; zon seret, fail dan "Saluran aduan lain" `--pad-card-sm` + `--radius-media`; paparan "dihantar" `--pad-card-lg`. Telefon: `--pad-card-sm` seluruhnya.
- **Panel AIFA:** kepala `--pad-card-sm`, avatar ↔ tajuk `--gap-inline`; tajuk panel kini peranan title (20/500) sama seperti tajuk borang Lapor; mesej dan hasil `--gap-cards`, gelembung `--radius-media`; cadangan boleh berbalut (tidak terkeluar panel di telefon).
- **Pop-up pratonton:** badge guna `--space-badge-x` / `--space-inline-tight`; ruang butang tutup di telefon = `--size-control` + `--gap-inline`.
- **Menu Kongsi + menu telefon:** ikut peranan menu dropdown: padding `--space-inline`, radius `--radius-menu`, item `--space-field-x` sisi dengan tinggi kawalan.
- **Footer:** blok `--gap-block` (24 → 40 fluid), tajuk lajur → senarai `--gap-group` (16), antara pautan `--gap-cards` (16 → 24 fluid).

## Verdict diseragamkan: Palsu · Makluman · Benar (22 Nov 2026)
- Hanya tiga verdict wujud: **Palsu** (`palsu`), **Makluman** (`makluman`), **Benar** (`benar`). Label "Penjelasan" ditukar kepada **Benar** di mana-mana (penapis Artikel, kad flip, kad Kenali Sebenarnya.my, badge). Alias `penjelasan` dibuang; jenis yang tidak dikenali jatuh ke `makluman`.
- **Waspada dibuang** daripada sistem: tiada lagi `--color-verdict-waspada(-dot)`, `.ui-verdict--waspada`, `.ui-chip--waspada`, `.fc--waspada`. Primitif `--color-orange*` kekal dalam palet tetapi tiada peranan verdict.
- Nota lama di atas yang menyebut Waspada / "Penjelasan" sebagai label verdict kini sejarah sahaja. Tajuk bahagian artikel "Penjelasan rasmi" dan tajuk artikel bukan label verdict dan kekal.

## Grid kad Artikel (22 Nov 2026, ikut Wonder › Container)
- **Grid cecair:** `repeat(auto-fill, minmax(max(min(100%, var(--media-min) + 2 × --cell-pad-x), 25% − 1px), 1fr))` dengan `--media-min: 320px` → 1 kolum telefon, 2 (tablet, ≈768–1100), 3 (laptop, foto ≈350–440 nisbah 420 × 230), 4 (≥≈1520); tidak pernah lebih 4.
- **Garis rambut berterusan** antara kolum dan baris: setiap sel lukis garis kanan + bawah `--color-muted-strong`; pembungkus `.articles-results` (overflow hidden) + margin negatif menyembunyikan garis tepi luar. Ruang dalam sel: `--cell-pad` atas/bawah `--gap-block` (24 → 40 fluid), `--cell-pad-x` kiri/kanan `--pad-card` (24) supaya foto lebih lebar; telefon `--pad-card` atas/bawah, tiada garis tegak.
- **Kad terbuka** (tiada latar/border): foto nisbah 42:23 (420 × 230) radius `--radius-card` dengan logo agensi di dalamnya (kiri bawah); di bawah foto baris meta `Verdict tint · tarikh · N minit bacaan` (caption 12, smoke) lalu tajuk (peranan title). Hover: foto zoom 1.03.
- **`Verdict` varian `tint`** (baharu, `app/ui.css`): pill 28px di atas warna verdict 22% atas putih.
- **Masa baca:** `readingMinutes()` (`lib/articles.js`): perkataan tajuk + lead + penjelasan ÷ 200, minimum 1.

- **Pemilih bahasa (22 Nov 2026):** tiada bendera lagi. Butang memaparkan kod bahasa (`BM` / `EN`, peranan label 16/500) + chevron; menu senarai kod sahaja, tanpa tajuk "Bahasa" (lebar 3 × `--size-control`). Nama penuh kekal dalam nama aksesibel ("BM — Bahasa Melayu"). Fail `public/images/flags/` dibuang.

- **Kad pengunjung, Kenali Sebenarnya.my (22 Nov 2026):** menggantikan kad "Tiga jawapan yang jelas" (`.kenali__card--visitors`, kawasan grid `visitors`). Tajuk "Lebih 130 pengunjung setiap hari" (peranan title, nombor guna `CountUp`). Di bawah, dipin ke dasar kad seperti ikon kad saluran: empat avatar bulat bertindih (`--size-control` 44, tindih 12, gelang 2px warna kad) + "menyemak fakta bersama kami" (body-sm, secondary). Avatar dipotong daripada foto karusel sedia ada → `public/images/avatars/visitor-1…4.webp` (96 × 96, hiasan, `alt=""`).

- **H1 Utama, verdict berputar (22 Nov 2026, dikemas kini):** baris kedua "Semak dakwaan **palsu**" (huruf kecil). Perkataan berputar palsu → benar → makluman dengan flip 3D huruf demi huruf (`components/FlipWord.js`, Web Animations API). **Transform sahaja:** perkataan baharu masuk ke susun atur sekali; hurufnya bergolek masuk dari bawah (rotateX −90° → 0) sementara perkataan lama, ditindih di atasnya, bergolek keluar (0 → 90°). Perkataan duduk dalam slot selebar perkataan terpanjang (salinan halimunan `.flip-word__ghost` bertindan dalam satu sel grid), jadi "Semak dakwaan" kekal di tempatnya dan perkataan tumbuh ke kanan; baris dipusatkan mengikut "makluman". Di telefon (perkataan di baris sendiri, berpusat) perkataan meluncur ke tengah baharu dengan FLIP. Masa: 700 ms setiap huruf, sela 40 ms, `cubic-bezier(0.2, 0, 0, 1)`; tahan 2.2 s. Berhenti apabila tab tersembunyi/di luar skrin; gerakan dikurangkan = tukar tanpa flip. Berat sama dengan teks H1 lain (display), ink. Pembaca skrin: "Semak dakwaan palsu, benar atau makluman". Telefon (≤600): verdict di baris sendiri. Animasi masuk H1 = tween transform + clip-path pada span baris (bukan SplitText).

- **Tentang Kami, 22 Nov 2026:** (1) Marquee Berita tiada lagi butang jeda/main (`.marquee__bar`, `.is-stopped` dibuang); hover masih menjeda, gerakan dikurangkan masih menghentikan dan membolehkan skrol tangan. (2) Kad logo tanpa teks kelihatan: nama, keterangan dan meta fail dibuang; nama kekal sebagai `h3.sr-only` untuk pembaca skrin. Kad = pratonton + folder format, padding `--pad-card-lg`, jarak `--gap-group`; pratonton tanpa `min-height`: tinggi fail + `--pad-card` atas/bawah, jadi ruang di atas logo ≈ ruang di bawahnya (desktop 60/63, telefon 48/51). Tajuk folder ikut kad: "Muat turun logo" / "Muat turun ikon" (`folderTitle` dalam `logoPage.items`, jatuh ke `formatTitle`). Desktop: subgrid 2 baris supaya pratonton dan folder sejajar antara dua kad.

- **Folder format, teks ikut peranan (22 Nov 2026):** folder dilukis atas pentas 391 px lalu diskala ke lebar kad (`--s`), jadi teksnya dulu ikut terskala (tajuk ≈ 26 px desktop / 16 px telefon, cip ≈ 18 / 11 px). Kini tajuk + cip dalam `.folder__text` yang diskala balik `scale(1 / --s)`: tajuk = peranan **title** (20, fluid 18 di telefon), cip = **label-sm** (14) dengan ikon muat turun 14, jarak tajuk → cip `--gap-group`, antara cip `--space-inline-tight`. Kedudukan (34 / 18 dari bucu poket) kekal dalam unit pentas.

- **22 Nov 2026:** (1) Flip verdict H1: animasi flip kekal 700 ms / sela 40 ms; masa diam (dwell) antara perkataan dipendekkan 2.2 s → 1.2 s. (2) Seksyen "Semakan fakta terkini" kini guna kepala yang sama dengan Kenali Sebenarnya.my dan Berita: tajuk tengah "Semakan fakta terkini" + lead satu baris "Setiap jawapan disahkan terus oleh kementerian dan agensi berkaitan." (`.latest-checks__head`, lead = peranan body, secondary).

- **Kad maklumat AIFA, hero Tentang Kami (22 Nov 2026):** `.about-hero-aifa` diletak `position: absolute` di kanan atas kad hero dengan inset sama seperti blok "Ikuti kami" (atas `--spacing-56`, tepi `--spacing-40`), lebar `min(330px, 34%)`, gap `--spacing-12`. Dua `.aifa-card`: media (latar `--color-card`, padding 8, ruang 16:9 radius `--radius-media` + kapsyen body-sm secondary; kini poster `berita-aifa.jpg`, ganti `<img>` dengan embed video Instagram di `.aifa-card__media`) dan info (latar `--color-muted-strong`, tajuk label 16/500, teks body-sm secondary). Hover angkat 2px; mati di `prefers-reduced-motion`. ≤1100px (tablet + telefon) kad disembunyikan. Teks di `aboutHero.aifa` (`data/content.js`). Tajuk kad ialah `<p>`, bukan `<h2>`, kerana ia datang sebelum `<h1>` dalam DOM.

- **Kad AIFA hero Tentang Kami (22 Nov 2026):** gambar diganti video reel AIFA (`public/images/about/aifa-reel.mp4`, 1276×718, 58 s) — `autoplay muted loop playsInline`, poster `aifa-reel-poster.jpg` (juga latar fallback). Seluruh bingkai ialah pautan ke reel Instagram (tab baharu, label "Tonton video AIFA di Instagram"). Gerakan dikurangkan: video disembunyikan, poster dipaparkan.

- **22 Nov 2026:** (1) Kad info AIFA (hero Tentang Kami) kini latar graphite `--color-text-secondary` (#44403B): tajuk putih 10.3:1, teks putih 80% 7.3:1. (2) Header: `min-height: 72px` dibuang — dengan box-sizing content-box ia ditambah di atas padding 16 (header 104 px). Kini tinggi = logo + 16 atas/bawah = 86 px.

- **Pembaikan mobile & lain-lain (22 Nov 2026):**
  - **Borang Salur Kepada Kami (mobile):** pautan dalam menu kompak kini menutup menu (borang dibuka tanpa navigasi, dan pautan #hash halaman sama tidak menukar laluan, jadi menu dulu kekal terbuka di belakang borang).
  - **Hero AIFA Tentang Kami:** disembunyikan ≤1100px (tablet + telefon; dulu ≤600, dan 601–900 masuk aliran).
  - **Semua butang jeda dibuang:** karusel hero Utama (`.gctl .play`) dan baris "Semakan fakta terkini". Karusel masih berhenti semasa hover/fokus/seret; gerakan dikurangkan menghentikannya.
  - **Butang tutup (X) tanpa cincin biru semasa dibuka:** dialog (borang, pratonton sosial, foto sfera) kini memfokus dirinya sendiri (`tabIndex={-1}` + `dialog.focus()`, `dialog:focus { outline: none }`), jadi butang tutup tidak dibuka dengan cincin fokus. Tab masih menunjukkan cincin seperti biasa.
  - **Kad logo fluid:** grid `auto-fit, minmax(min(100%, 320px), 1fr)` (2 lajur dari ≈700px), folder maks 480px di tengah; folder ≤340px (container query): cip lebih rapat, tajuk → cip `--gap-text`, pil ikon kecil disembunyikan — cip kekal satu baris dalam poket hingga 320px.
  - **Artikel:** anak panah bar cip kategori disembunyikan ≤600px (leret sahaja).
  - **H1 Utama sentiasa dua baris** (telefon juga): setiap baris `nowrap`, saiz = `min(--text-display, (100vw − 2 × --side) / 12.8)` (≈12.3em setiap baris), jadi 22.5px @320, 28px @390, 39px @768, 48px desktop. Verdict tidak lagi di baris sendiri di telefon.

- **Ritma seksyen fluid (22 Nov 2026):** `--space-section` kini `clamp(64, 40.8px + 6.188vw, 120)` (dulu langkah 96 · 64 · 48) dan `--gap-block` `clamp(24, 17.37px + 1.768vw, 40)` (dulu tetap 40), jadi antara seksyen ≈ 3× tajuk → kandungan pada setiap lebar. Breakpoint `--space-section` ≤1024 / ≤600 dibuang. "Semakan fakta terkini": kepala → kandungan `--gap-block` (dulu 48), rel kad `--gap-cards` (dulu 24). Peraturan mati `.latest` dibuang.

- **Folder format, mudah alih (22 Nov 2026):** pil ikon mini (`.folder__pill`, token `--color-folder-pill`, `--color-tile-svg-mini`) dibuang. Ikon muat turun pada chip kekal Lucide `Download` 14px (`Icon`). Skala pentas (`--s` = lebar kad / 391) kini diukur dengan `ResizeObserver` dalam `FormatFolder.js` dan ditulis sebagai gaya inline; `tan(atan2())` hanya dipakai bila pelayar menyokongnya (`@supports`), dengan sandaran `--s: .85`. Sebelum ini Safari tanpa `tan(atan2())` tidak mengira skala lalu folder terpotong. Nota 455 di atas tentang "nisbah tanpa unit daripada container query" kini hanya laluan sokongan, bukan satu-satunya.

- **Weight tajuk + gap kad (22 Nov 2026):** semua tajuk kini 500 (dulu Display H1, tajuk slaid carousel dan award 400); blok tajuk baca `--text-*--font-weight` peranan, weight tulis tangan dibuang. `--font-weight-display` (400) kini untuk angka statistik sahaja. `--gap-cards` `clamp(16, 12.69px + 0.884vw, 24)` (dulu 12); turut dipakai oleh senarai pautan footer, log AIFA dan statistik viewership.

- **Empat breakpoint, lapisan z-index, lebar baca (22 Nov 2026):** hanya `max-width` 1280 · 1100 · 900 · 600 dibenarkan (`lint:ds` › `breakpoint`). Nilai lama dipetakan ke atas: 1024 → 1100 (agensi, grid Kenali, kad AIFA hero Tentang Kami), 768 / 760 / 960 → 900 (agensi, lede hero, viewership, pop-up sneak-peek), 700 / 480 → 600 (karusel hero, panel AIFA). Nota lama dalam dokumen ini yang menyebut ≤1024, ≤960, ≤768, ≤760, ≤700 atau ≤480 kini merujuk breakpoint baharu itu. Lapisan: `--z-sticky` 10 header · `--z-dropdown` 20 menu / share · `--z-overlay` 30 · `--z-floating` 40 Tanya AIFA · `--z-skip` 50 skip link; dalam komponen hanya −1…5 (`lint:ds` › `z-index`; hover logo agensi kini 5). Lebar baca: `--measure-text` 68ch (`.post-subtitle`, `.logo-terms__body`), `--measure-head` 720px (kepala Semakan fakta terkini, Kenali).

- **H1 Utama di telefon lebih besar daripada H2 (23 Nov 2026):** ≤600px baris H1 boleh berbalut (3–4 baris: "Tidak pasti? / Jangan kongsi / Semak / dakwaan <verdict>"); hanya kumpulan "dakwaan + verdict" (`.hero-title__verdict`, `nowrap`, ≈9.2em termasuk slot selebar "makluman") tidak pernah terpisah. Saiz `min(--text-display, (100vw − 2 × --side) / 9.6)`: 30px @320, 32px @360, 32.3px @390, 33px @430, jadi sentiasa melebihi H2 (28) dan kumpulan itu sentiasa muat dalam lebar kandungan (diukur di Chrome, tiada limpahan). >600px kekal dua baris `nowrap` seperti dahulu (nota di atas "sentiasa dua baris" kini hanya untuk >600px).

- **Kad poster Kenali, telefon (23 Nov 2026):** ≤600 kad kekal segi empat (`aspect-ratio: 1`) tanpa `min-height` 300. Gabungan kedua-duanya memaksa lebar kad 332px pada 320 (kandungan 288) dan halaman boleh ditolak ke sisi. Kini tiada limpahan pada 320 / 390 / 600 (diukur di Chrome).

- **Butiran: fokus, ikon, avatar, gerakan, border (23 Nov 2026):** satu cincin fokus `--focus-ring-width` 2 · `--focus-ring-color` · `--focus-ring-offset` 2 (atas foto / permukaan gelap `--focus-ring-color-inverse`); offset 3/4px lama kini 2. Ikon ikut nama `<Icon size="sm|md|lg|xl|display">` = 14 / 16 / 20 / 24 / 40 (`--size-icon-lg` 18 → 20: ikon carian, medan, logo sosial; ikon selesai borang 28 → 24). Avatar `--size-avatar-sm` 32 (dulu 30 / 36) dan `--size-avatar` 40 (dulu 44 pada kad flip), logo di dalam `--avatar-inset` 4. Gerakan: `--duration-fast` 150 · `base` 250 · `slow` 450 · `slower` 700 (baharu) + `--ease-*`; koreografi folder logo kekal `ds-allow`. Border `--border-width` 1 / `--border-width-hairline` .5. `lint:ds`: `raw-motion`, `focus-ring`, `raw-border`, `icon-size`.

- **H1 Utama di telefon, empat baris tetap (23 Nov 2026, ganti nota "lebih besar daripada H2" di atas):** ≤600px H1 sentiasa "Tidak pasti? / Jangan kongsi / Semak dakwaan / <verdict>". Setiap bahagian ialah `.hero-title__part` (blok, `nowrap`); verdict di baris sendiri, berpusat (`.flip-word` grid, baris `justify-self: center`), dan FlipWord meluncurkannya ke tengah baharu apabila panjang perkataan berubah. Baris terlebar "Semak dakwaan" ≈7.5em, jadi saiz `min(--text-display, (100vw − 2 × --side) / 7.8)` = 32px dari 320 (36px @600), sentiasa melebihi H2 (28–30). >600px kekal dua baris. `.hero-title__verdict` dibuang. Juga: token `--size-icon-xl: 20px` berganda dibuang (kini 24 sahaja).

- **Pembaikan review PR #12 + audit warna (23 Nov 2026):**
  - **Sfera vs Tanya AIFA:** `.sphere-stage` kini `isolation: isolate`, jadi node (z inline ≈1000) kekal dalam pentas dan tidak lagi menutup butang AIFA (`--z-floating` 40). Diuji di Chrome pada 320 / 390 / 1440.
  - **Viewership** jadi satu kolum pada ≤1100 (dulu ≤900; pada 901–960 kolum kiri hanya ≈200px).
  - **Motion:** `--duration-slower` 700 → 600ms, had atas `design.md` (150–600ms): zoom foto hover, scrim carousel, flip buka, scroll reveal.
  - **Hierarki warna teks** (tinta = tajuk, graphite = perenggan/lead, smoke = meta): lead Tentang Kami dan badan kad terma logo kini graphite (tajuk kekal tinta); keterangan di bawah angka statistik di Utama kini smoke 16 (sama seperti Tentang Kami; weight Light mati dibuang); label carta Tentang Kami smoke; agensi "· MCMC" di belakang kad flip smoke; lede hero weight 400 (dulu 500).
  - **Token ikut peranan:** `--color-surface-inverse` (graphite, latar kad info AIFA, dulu token teks), `--color-text-secondary-inverse` (putih 80%, teks badan atas gelap, kembar graphite; `--color-muted-foreground-inverse` 60% kembar smoke), `--color-folder-chip` (teks cip folder, dulu `--color-accent` yang ialah token permukaan).
  - `.fc-avatar--sm`: `outline` lutsinar supaya cincin kekal dalam forced-colors. `design.md`: Lead = Graphite (dulu tertulis Smoke).

- **Gerakan: satu entrance per halaman (23 Nov 2026):** `ScrollMotion.js` (GSAP ScrollTrigger + SplitText + IntersectionObserver, ±20 elemen muncul semasa skrol) diganti `PageEnter.js` (Web Animations API, tanpa GSAP). Hanya kepala halaman masuk semasa dimuat, 100ms berturutan: Utama = H1 hero baris demi baris dari topeng (`--duration-slower` 600ms) → lede → carian; Tentang Kami = kad hero; Artikel = tajuk → subtajuk → meta. Setiap bahagian: opacity + blur 4px + naik 12px, 300ms `--ease-out`; `fill: backwards`, jadi tanpa JS semuanya kelihatan. Gerakan dikurangkan: tiada entrance. CSS `.motion .reveal`, topeng `.split-line` dan `.about-subtitle` mati dibuang. `design.md` (MOTION) kini membenarkan bentuk ini; pop-in folder logo kekal sebagai koreografi komponen.
- **Cip muat turun folder logo = butang kecil (23 Nov 2026):** dulu label-sm 14 + ikon 14, tinggi 31, padding 12. Kini spesifikasi `ui-btn--sm`: `--text-label` 16/500, ikon `md` 16, tinggi `--size-control-sm` 36, padding `--space-control-x-sm` 16, jarak `--gap-inline` 8 (label↔ikon dan antara cip). Tajuk "Muat turun …" kekal `--text-title` (18→20), jadi cip dibaca sebagai aksinya. Folder ≤340: padding 12; folder ≤300: ikon disembunyikan supaya tiga cip kekal satu baris dalam poket (tajuk sudah kata "Muat turun", nama aksesibel cip menyebut fail). Diukur di Chrome 320–1440: satu baris, dalam poket.

- **H1 Utama: verdict kini Typewriter (23 Nov 2026, ganti flip 3D huruf demi huruf):** `components/Typewriter.js` (ganti `FlipWord.js`). Kitaran: tahan 2.5s → padam huruf demi huruf (backspace, 40ms) → jeda 400ms → taip perkataan seterusnya (80ms ± 30ms sehuruf, supaya terasa ditaip manusia): palsu → benar → makluman. Caret teks (`.typewriter__caret`): bar nipis .06em × .82em, warna tinta tajuk; berkelip 530ms hidup / 530ms mati (kadar OS, `step-end`) hanya semasa perkataan berehat, pejal semasa menaip / memadam (`data-busy`). Slot selebar "makluman" + caret (salinan halimunan dalam satu sel grid), jadi "Semak dakwaan" dan tinggi H1 tidak berubah; di telefon slot berpusat di barisnya dan perkataan ditaip dari permulaan slot. Perkataan pertama ada dalam HTML pelayan. Berhenti bila tab tersembunyi / hero di luar skrin. Gerakan dikurangkan: tiada taip, perkataan bertukar penuh selepas setiap tahan, caret tidak berkelip. Diukur di Chrome 320 / 390 / 1440: urutan betul, caret pejal semasa menaip, tiada anjakan susun atur, tiada limpahan.

- **Fokus = tinta, bukan biru (23 Nov 2026):** `--color-ring` dan `--color-link` kini `--color-foreground` (dulu `--color-blue` #3A46F5 "violet spark"). Satu token ini menukar semua keadaan fokus: bar carian (`.ui-search:focus-within`, sempadan + cincin 1px tinta), medan, butang, cip, menu, kad. Permukaan gelap / foto guna `--focus-ring-color-inverse` (putih): `.ui-btn--media` (CTA carousel, CTA award, tutup foto sfera), slaid carousel, pautan "Ikuti kami", cip folder. Kad media AIFA kekal tinta (ia dalam kad putih). Asas baharu `:where(:focus-visible)` (spesifisiti 0) supaya elemen tanpa gaya sendiri (cth. `<summary>` di Lapor) tidak lagi guna biru pelayar. Hover pautan AIFA kini tinta. Biru kekal hanya untuk titik verdict Makluman dan avatar AIFA. Diuji di Chrome: Tab melalui Utama (53 hentian), Tentang Kami (51), Artikel (58), detail artikel (35), Lapor (9) — tiada cincin biru; cincin tinta atas kanvas 20.5:1.

- **Ruang atas header (23 Nov 2026):** pautan langkau "Langkau ke kandungan" (`a.ui-btn.ui-skip-link`) sepatutnya `position: fixed`, tetapi `.ui-btn { position: relative }` (kemudian dalam `ui.css`, spesifisiti sama) menang, jadi pautan halimunan itu kekal dalam aliran dan menolak header 44px ke bawah di setiap halaman. Kini `.ui-btn.ui-skip-link` (dua kelas). Header bermula pada 0, logo 16px dari atas (padding header 16, seperti spesifikasi). Pautan langkau masih muncul di kiri atas (8/8) pada Tab pertama, cincin tinta.

- **Kad flip di iOS Safari (23 Nov 2026):** `backface-visibility: hidden` tidak cukup di WebKit: anak muka depan yang ada lapisan sendiri (blok verdict + tajuk `position: absolute; z-index`, avatar agensi, butang flip) tembus ke muka belakang, terbalik ("NAMULKAM", logo di kiri atas, tajuk atas "Baca semakan"). Kini muka yang berpaling juga `visibility: hidden`, ditukar tepat bila kad tegak (90°): tutup (lengkung simetri) pada 50% `--duration-slow`; buka (`--ease-out` kuat) pada 13% `--duration-slower` (79ms, diselesaikan daripada lengkung). Diukur di Chrome: suis berlaku pada 94°, satu bingkai selepas tegak. Papan kekunci: fokus berpindah ke "Baca semakan" sebaik muka belakang kelihatan (`FlipCard.js` menunggu sehingga ~1s). Gerakan dikurangkan: suis serta-merta. Belum diuji pada peranti iOS sebenar.

- **Audit design system: overlay, menu, jarak dan motion (23 Nov 2026):**
  - **Satu resepi modal `.ui-modal`** (`app/ui.css`) untuk borang Lapor, pratonton sosial dan foto sfera: permukaan `--color-card`, `--radius-card-lg`, `--shadow-overlay` (token baharu), backdrop `--color-scrim` (token baharu, tinta 60%), masuk 250ms opacity + scale .96 dan **keluar** .98 (transition, boleh disampuk). Dulu empat gaya: bayang `rgba(21,22,24,…)` mentah, backdrop 55/60/70%, masuk 450 atau 250ms, tiga daripadanya hilang serta-merta bila ditutup. Panel AIFA: `--shadow-overlay` + pop 250ms yang sama, juga keluar (`display` allow-discrete).
  - **Satu permukaan menu `.ui-menu`** untuk dropdown nav, bahasa dan Kongsi: `--color-background`, border, `--radius-menu`, padding `--space-inline`, `--shadow-float`, pop 150ms dari tepi pemicu. Dulu dropdown nav tiada animasi dan Kongsi berlatar `--color-card` dengan CSS salinan penuh di `global.css`.
  - **Token baharu:** `--color-surface-media` (latar foto/video, kad hero gelap; ganti `--color-black` di FlipCard, carousel, hero Tentang Kami), `--color-scrim`, `--shadow-overlay`. Lint `palette-primitive` kini juga menangkap `--color-black`.
  - **Jarak:** gap antara kumpulan/blok (≥16px) kini peranan (`--gap-text/inline/group/cards/block`), bukan `--spacing-*`; override breakpoint yang menyalin nilai fluid dibuang (hero, Semakan terkini, Kenali, Artikel, artikel, footer). Lint baharu `group-gap-primitive`. Kepala seksyen: tajuk → lead `--gap-text` (8); tajuk seksyen → kandungan `--gap-block` (40 → 24) di semua halaman, termasuk Logo (dulu 72) dan "Semakan fakta terkini" telefon (dulu 32). H1 display → lede `--gap-group` (16) di kedua-dua hero. Diukur: antara seksyen 120 (1440) / 65 (390) di semua halaman.
  - **Motion:** transisi route 1.2s → crossfade 250ms; hover logo agensi dan kad AIFA kini hanya untuk tetikus (`hover: hover`); titik carousel tidak lagi menganimasi `width` (snap; bar isi menunjukkan kemajuan).
  - **Kod mati:** `gsap` dibuang dari `package.json`, blok `@media` kosong, `--fade`, komen tanpa peraturan.
  - **Verdict H1 telefon di tengah optik:** ≤600px baris verdict sendiri, jadi `.typewriter__row` kini `justify-self: center` + `margin-inline-start: .12em` (separuh daripada kursor dan jaraknya), supaya huruf "palsu", "benar" dan "makluman" tepat di paksi tengah H1 (diukur 0.0px pada 320/390/600). Desktop tidak berubah (verdict mengikut "Semak dakwaan").

- **Urutan Utama + jubin folder logo (23 Nov 2026):**
  - **Utama:** seksyen "Pusat semakan fakta MCMC sejak 2017" (`Viewership`) kini paling bawah, selepas Kenali Sebenarnya.my dan tepat sebelum footer. Ritma kekal 120 (1440) / 65 (390) antara setiap seksyen.
  - **Folder format (Logo):** jubin JPEG/PNG/SVG kini semua putih (`--color-tile` = `--color-card`); warna datang daripada ikon fail. Token `--gradient-tile-jpeg`, `--color-tile-png`, `--gradient-tile-svg` dibuang. `--shadow-tile` dilembutkan untuk jubin putih (garis .5px 8% + 0 12px 32px 14%).
  - **H1 hero Tentang Kami** disemak: guna peranan `--text-display` sama seperti H1 Utama dan artikel (48 / 39 / 32 px pada 1440 / 768 / 390, 500, 1.2); lead 16/24 400 seperti lead lain. Konsisten.

- **Hero Tentang Kami: lead diredupkan + fakta dalam angka satu kolum (23 Nov 2026):**
  - Lead hero (`.about-hero-text p`) kini `--color-text-secondary-inverse` (putih 80%, kembar graphite), jadi tajuk > lead seperti halaman lain. Scrim ≤600 sedikit lebih kuat dan tinggi (70% → 50% pada 50% → lutsinar pada 80%) kerana lead lebih banyak baris di telefon. Diukur pada piksel foto sebenar (piksel paling terang di bawah teks): lead ≥ 6.2:1 dari 320 hingga 1440; H1 ≥ 4:1 (teks besar, had 3:1).
  - "Beberapa fakta tentang kami dalam angka": `.about-intro__facts-row` kini `flex-direction: column` di semua saiz skrin (satu fakta setiap baris, di tengah), jarak `--gap-block`. Grid 2 kolum ≤1100 dibuang.
  - Petunjuk di bawah galeri sfera (`.sphere-hint`) kini `text-align: center`; ≤600px dua baris tetap: "Seret untuk memusingkan," / "pilih foto untuk melihatnya lebih besar." (dua `<span>` jadi block).

- **Bar verdict "Agensi rakan" (Tentang Kami) mengisi sekali bila kelihatan (23 Nov 2026):** `useFillOnView` dalam `AboutUs.js` (IntersectionObserver, 50% kelihatan, sekali sahaja). Setiap bar Palsu / Benar / Makluman didedahkan kiri → kanan dengan `clip-path: inset(0 100% 0 0 round …)` → `inset(0)` (hujung bulat kekal; `scaleX` akan memampatkannya), `--duration-slower` `--ease-out`, stagger tidak sekata 0 / 75 / 135ms. Tiada gerakan berterusan: data yang dibaca tidak patut bergerak. Tanpa JS dan `prefers-reduced-motion`: bar penuh serta-merta. Diuji 1440 / 390.

- **Kad Juara Dunia (Kenali Sebenarnya.my, Utama), 23 Nov 2026:** butang "Ketahui lebih lanjut" dibuang; kad kini eyebrow, tajuk, subtajuk dan teks sahaja. `.kenali__award-cta` dan import `Button` / `ArrowRight` yang tidak dipakai turut dibuang.

- **Fakta dalam angka (23 Nov 2026):** satu lajur (satu fakta sebaris) hanya untuk telefon ≤600px. Desktop: satu baris `space-around`; tablet ≤1100px: grid 2 × 2.

- **"Ikuti kami" fluid (23 Nov 2026):** bulatan media sosial `--follow-disc: clamp(--size-control-sm 36, 29.5px + 1.55vw, --size-control-lg 48)` — 36 @≤390, 41 @768, 48 @≥1200; ikon = separuh bulatan (18 → 24). `::before` membesarkan kawasan sentuh kembali ke 44 (`--size-hit-area`). Senarai boleh `wrap`.

- **Statistik Utama, pusat optik (23 Nov 2026):** angka + keterangan dalam setiap kad `.viewership-stat` kini di tengah (mendatar dan menegak), `text-align: center`. Padding bawah = `--pad-card` + 24, jadi kumpulan teks duduk 12px di atas pusat geometri (≈5% tinggi kad), iaitu pusat optik. Kad foto: satu lapisan rata **35%** hitam (atas permintaan; 50–60% terlalu gelap) + halo pada huruf sahaja (`text-shadow` 16px 80% + 6px 70% + 2px 50%). Diukur pada latar 4px di sekeliling huruf: p95 ≈ 5.3–6.1:1 (angka dan keterangan). Piksel paling terang: angka ≥ 4.0:1 (lulus AA teks besar 3:1); keterangan 3.9:1 desktop / 3.05:1 telefon — **di bawah AA 4.5:1 pada titik paling terang foto**. Jika perlu lulus penuh: 50% lapisan (≥4.72:1).


## Pembersihan untuk handover (23 Nov 2026)
Diaudit dengan skrip (token ditakrif vs `var()` dirujuk; kelas CSS vs token `className` sebenar dalam JS, termasuk awalan dinamik seperti `ui-btn--${variant}`; `@keyframes` vs `animation`; aset `public/` vs laluan dalam kod).
- **Token dibuang (tiada pengguna):** `--color-grey-62`, `--color-orange`, `--color-orange-dark`, `--color-selected`, `--font-weight-light`, `--shadow-subtle(-2/-3)`, `--gradient-scrim-card`, `--container-page`, `--container-rail`, `--size-icon-xl`, `--size-icon-display`, `--breakpoint-*` (diganti komen rujukan dalam `tokens.css`: 600 · 900 · 1100).
- **Token dikekalkan walaupun belum dirujuk:** sub-token peranan tipografi (`--text-*--font-weight`, `--text-eyebrow--letter-spacing`) supaya setiap peranan lengkap; `--color-brand`, `--spacing-28` (langkah skala), `--z-overlay` (skala z).
- **CSS mati dibuang:** slider/posts/agencies lama (`.slider`, `.posts`, `.agencies`, `.agency*`, `@keyframes slideUp/agencySlide`), sisa galeri media sosial (dua komen tidak tertutup yang menelan peraturan), fungsi Tentang Kami (`.about-fn-*`, `@keyframes about-fn-in/fade`), `.card`, `.fc-dot`, `.verdict-tag`, `.kenali__title-icon`, komen `.section-label.big-title`.
- **JS/data dibuang:** `components/ui/filledIcons.js` (tiada butang jeda lagi), eksport `howItWorks`, bendera `paused` dalam `Latest.js`.
- **Aset dibuang (≈5.9 MB):** 7 foto `posts/sebenarnya-*` tidak dirujuk, `about/hero.jpg`, `about/berita-wsis.webp`, `carousel/hero-ktmb|str|lesen.jpg`, 6 potret `carousel/human-*.jpg` (avatar pengunjung sudah dipotong ke `images/avatars/`), `bento/gold-award-medal.webp`, `public/fonts/inter/` (Manrope sahaja, via `next/font`).
- **Pustaka UI dikekalkan walaupun tidak dipakai di laman** (untuk CMS + sambungan pelayar): `Tabs`, `ButtonGroup`, varian `Button` `link` / `icon-sm` / `icon-lg`, `Badge` `lg`, `Verdict` `single`.
- Selepas pembersihan: `lint:ds` bersih, build lulus, tiada imej yang dirujuk hilang dalam `out/`, pendakap CSS seimbang.

## Skala saiz komponen sm · md · lg (23 Nov 2026, rujukan shadcn/ui + elevenlabs.io)

Masalah: di telefon butang, search, chip dan badge terasa terlalu besar dan tidak konsisten (Button 44, search 56, Verdict 44, Tabs 50, Badge 28/44, dan `global.css` menulis 44/48/52/56 secara manual).

- **Satu skala kawalan fluid** dalam `tokens.css`: `sm` 32→36 · `md` 40→44 · `lg` 44→48 · `xl` 48→56, dari 375px ke 1280px dengan `clamp()` (formula sama dengan peranan taip). Desktop kekal seperti dahulu; telefon 4–8px lebih padat. Padding sisi ikut skala (`--space-control-x-sm/-x/-x-lg`).
- **Sasaran sentuh 44 kekal:** `.ui-btn::after` dan `.ui-chip::after` membesar ke `--size-hit-area` apabila kawalan lebih pendek.
- **Skala badge (tetap, bukan sasaran):** `--size-badge-sm` 20 · `--size-badge` 24 · `--size-badge-lg` 32. `Badge` size sm/md/lg; `Verdict` pill = lg 32, overlay/tint = md 24. `.peek-modal__badge` = badge lg.
- **API:** `Button` size sm · md · **lg (baharu)** · icon-sm · icon · icon-lg. `Chip` size sm · md · lg (baharu). `Badge` sm · md · lg (lg dahulu 44, kini 32). `SearchField` lg (lalai) · **md (baharu)** · sm. `Input` / `Select` size sm · md · lg (baharu). `'default'` masih diterima sebagai md.
- **Kawalan bersarang diterbitkan:** butang "Semak" = `search − 2 × (inset 4 + border)`; tab = `track − 2 × (segment + border)`; bulatan ikon `.fc-read` = `lg − 2 × 6`.
- **`global.css` kini guna token:** `.menu-toggle` md, `.fc-read` lg, `.social-peek__logo` + `.kenali__icons` lg, titik carousel lg, `.aifa-toggle` xl (override 52px telefon dibuang), `.aifa-links a` sm, `.folder__chip` sm dengan Label/14, `.post-back` hit-area.
- Diukur pada runtime (Chrome headless, 375 / 1280): Button 40 / 44, Chip 40 / 44, search Home 48 / 56 (butang 38 / 46), search Artikel 40 / 44, Select 40 / 44, Verdict pill 32, overlay/tint 24, Badge 24, `.fc-read` 44 / 48, logo sosial 44 / 48. `::after` setiap kawalan 40px = 44.

## Audit ukuran hardcode + lint diperluas (23 Nov 2026)

- **Press:** semua `:active` kini `var(--press-scale)` (.97); dahulu .94 / .95 / .96 / .97 bercampur (`.fc-read`, `.aifa-toggle`, `.about-hero-follow`, `.sphere-node`, `.social-peek__logo`, `.ui-navlink`, `.ui-lang__trigger`).
- **Disc ikon borang aduan:** `.claim-icon` dan `.claim-file-icon` = `--size-control` (40→44; override 38px telefon dibuang), `.claim-done-icon` = `--size-control-xl` (48→56), bulat `--radius-full`.
- **Titik:** taip AIFA dan titik carousel = `--size-dot` (8); titik aktif = 4 × dot.
- **Menu:** Kongsi `--size-menu` (220, dahulu 180); panel nav ringkas `--size-menu-lg` (260, token baharu).
- **Token baharu:** `--color-hairline-strong` (cincin logo kecil atas foto), `--radius-tail` (sudut bubble chat), `--underline-offset` (4) + `--underline-thickness` (1) untuk setiap garis bawah (footer, "Semua artikel", borang, `Button` link/ghost).
- **Breakpoint:** `@media (min-width: 901px)` pada Logo kit ditukar ke asas desktop + `@media (max-width: 900px)`; render sama (grid/subgrid ≥901, flex ≤900).
- **`lint:ds` baharu:** `raw-colour-fn`, `press-scale`, `control-size` (32–56px), `dot-size`, `underline`, `breakpoint-direction`; `raw-radius` kini baca juga `border-*-*-radius`. Diuji pada commit sebelum ini: 26 temuan, kini bersih.
- **Sengaja tidak diubah:** geometri ilustrasi FormatFolder, saiz flip card / slaid hero / marquee, lebar bacaan (400–1500px) dan ukuran panel AIFA / modal aduan: perlu keputusan reka bentuk (skala measure + knob panel) dahulu.
