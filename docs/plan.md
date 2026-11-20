# Sebenarnya.my — Design System Plan

Checklist kerja design system. Kemas kini fail ini **dalam commit yang sama** setiap kali satu item siap (sama seperti `docs/design-system-handoff.md`).

- Sumber design: Paper `sebenarnya.my` (`01M7VAW17RGCJXGYKR590PX12M`) — page *Design system* (artboard 01–12) dan *Artwork* (Home, Artikel, Tentang Kami, Mesej… ).
- Spec penuh: [`design-system-handoff.md`](design-system-handoff.md).
- Branch: `endahbyu`.
- Pengguna design system: **(1) laman web** (Next.js 16, CSS biasa) · **(2) CMS dashboard** · **(3) browser extension**.

**Peraturan tetap**
- Komponen hanya guna **token semantik** (`--color-background`, `--color-foreground`, `--color-muted*`, `--color-border*`, `--color-primary*`, `--color-ring`, `--color-verdict-*`…) + skala `--text-*`, `--leading-*`, `--spacing-*`, `--radius-*`. Nama token sama di Paper dan kod.
- Font: **Manrope sahaja** (kandungan, tajuk, navigasi dan kawalan UI). Display 48+ dan angka statistik **400** (`--font-weight-display`); heading 24–36 dan label **Medium 500**. Tiada 700+. Rujuk [`design.md`](design.md).
- Merah Kebenaran bukan warna aksi (button, link, nav).
- Ikon: **Lucide** sahaja, melalui `components/ui/Icon.js` (garis 1.75px `absoluteStrokeWidth`, currentColor, `aria-hidden`). Logo jenama (Facebook, TikTok…) kekal SVG jenama.
- Semua label interaktif (button, nav, tab, chip, dropdown, CTA, link footer) = **16 / 24 Medium**.
- Komponen yang **tiada** dalam design system → ambil dari **shadcn/ui**, kemudian sesuaikan ikut [Fasa 8](#fasa-8--shadcnui-untuk-komponen-yang-tiada). Komponen sendiri sentiasa menang jika kedua-duanya wujud.
- Unit **px** sahaja dalam token dan komponen kongsi (tiada `rem`): laman web set `html { font-size: 62.5% }`, dan extension hidup di dalam page orang lain — `rem` akan pecah di kedua-duanya.

Legend: `[x]` siap & dipush · `[~]` separa · `[ ]` belum · `[?]` perlu keputusan user

---

## Fasa 1 — Fondasi (tokens & font)

- [x] Font Manrope via `next/font` (`app/layout.js`); Inter dibuang
- [x] `app/tokens.css`: primitive, semantic, type scale, weight, spacing, radius, shadow, container, skala mobile
- [x] Petakan variable lama `:root` dalam `global.css` ke token
- [x] Peraturan berat tajuk dalam dokumen (display 400, heading 500 — ikut `design.md`)
- [x] **Satu set nama token Paper ↔ kod** — ikut nama Paper (Tailwind v4 + shadcn). Shadow kekal dalam kod sahaja.
- [x] Token untuk overlay media: `--gradient-scrim-media`, `-media-wide`, `-bottom`, `-bottom-short`, `-top`
- [x] Token motion dalam `tokens.css`: `--duration-fast/base/slow/page`, `--ease-out` (lalai), `--ease-in-out`, `--ease-emphasized`, `--ease-page`. `--ease`/`--slide` lama dibuang; tiada `cubic-bezier` keras lagi kecuali lengkung flip FlipCard
- [ ] Pakej token boleh-guna-semula (lihat [Fasa 7.1](#71-pakej-kongsi))
- [?] Mode dark (Paper artboard 11 · Forms & themes) — sekarang atau kemudian. **CMS sangat mungkin perlukan ini**; shadcn guna class `.dark`.

## Fasa 2 — Komponen asas (`components/ui/`, `app/ui.css`)

- [x] Button (filled, outline, ghost, disabled, `href`)
- [x] Chip + ChipRow
- [x] Tabs (mode tabs & toggle)
- [x] Verdict (palsu, waspada, makluman, benar; tone default/single)
- [x] SearchField (controlled, error)
- [x] NavLink
- [x] Dropdown menu (`DropdownMenu`) — untuk "Tentang Kami ▾"
- [x] Ikon: Lucide (`lucide-react` ^0.577) melalui `Icon`; semua SVG tulis tangan diganti (kecuali logo jenama)
- [ ] Button: saiz kecil + varian "on media" (butang putih atas imej, cth. "Baca semakan")
- [ ] Icon button bulat (prev/next carousel 48px, jeda 56px)
- [ ] Field teks biasa / textarea / select (Paper 12 › Inputs) — guna dalam ClaimForm
- [ ] Pagination dots sebagai komponen kongsi (kini hanya dalam HeroCarousel). Pembilang "03 / 05" dipulihkan pada slaid aktif ikut Paper
- [ ] Avatar agensi (30 / 40px)
- [ ] Semak semula ketepatan dengan Paper 12 › Button, Inputs, Verdict (nilai tepat via `get_computed_styles`)

## Fasa 3 — Komponen jenama & corak (Paper 06, 12 › Card / Home patterns)

- [x] Nav/Header (ikut Paper Home): dropdown "Tentang Kami ▾", nav Utama/Artikel, segmented BM/EN; font label Manrope
- [ ] Nav/Header: item "Hubungi kami" (perlu page `/contact/`)
- [x] Footer (Paper 12 › Footer) — semua halaman
- [?] Tanya AIFA floating button — merah (artwork) vs Ink + `--shadow-float` (peraturan)
- [x] Article card (grid Artikel). Kad utama + senarai sisi dibuang ikut Paper terkini
- [x] FactCheckCard / Flip card: satu kad terbuka pada satu masa, hover intent 90/140ms, buka 0.7s ease-out, tutup 0.45s
- [x] Seksyen "Semakan fakta terkini": gelangsar automatik tanpa hujung, berhenti bila hover, butang ‹ ›, Lihat lagi
- [x] 20 artikel baharu (Oktober 2026) dengan gambar unik; monogram agensi bila tiada logo
- [ ] Logo agensi baharu: MOF, JAIS, Kesultanan Pahang, PMO, JPM, Caltex, KTMB (kini monogram)
- [x] HeroCarousel: infinite loop, teks pada slaid tengah sahaja (ikut Paper), pembilang slaid, autoplay + dots + jeda
- [x] Page transition antara route (`components/PageTransition.js`, View Transitions API)
- [x] PromoBanner / Award (WSIS)
- [x] SocialCarousel (Aktiviti media sosial)
- [x] AgencyLogoStrip (Sumber kenyataan rasmi)
- [ ] Band: Closing, Announcement
- [ ] Timeline (Tentang Kami)
- [ ] Fungsi card, Feature card, Logo download card

## Fasa 4 — Halaman (Paper › Artwork)

| Route | Artboard | Status |
|---|---|---|
| `/` | Home | [x] Header, Hero (+ carian popular), HeroCarousel, Semakan fakta terkini, Tentang ringkas, Aktiviti media sosial (WSIS + SocialCarousel), footer |
| `/article` | Artikel | [x] Paper + kod: penapis (5 chip keputusan), grid kad 4 kolum, footer (`components/Articles.js`, `components/Footer.js`) |
| `/article/[slug]` | detail artikel page | [x] Paper + kod: Verdict + pil kategori, tajuk 48/52, meta + Kongsi, imej 1100×550, lajur bacaan 514 (`components/ArticleDetail.js`) |
| `/about-us` | Tentang Kami | [x] Kod: Hero (foto + Ikuti kami), About (susun atur Paper, kandungan Sebenarnya.my), Empat fungsi, Berita dan Galeri, Logo (`components/AboutUs.js`, `LogoKit.js`). "Bagaimana kami menyemak" dibuang (tiada dalam Paper). Teks templat tenis dalam Paper masih perlu diganti di Paper |
| `/logo` | (Logo) | [ ] |

- [x] Hero: tajuk baru "Tidak pasti? Jangan kongsi / Semak dakwaan, Temukan kebenaran"
- [ ] Hero: kemas kini tajuk yang sama di Paper

## Keputusan arah visual (docs/design.md, 21 Nov 2026)

- [x] Satu keluarga font: Manrope sahaja — kod, handoff, Paper
- [x] Display (tajuk besar) weight 400 — kod, handoff, Paper (`--font-weight-display`)
- [x] Angka statistik weight 400 — kod, handoff, Paper
- [~] Tanya AIFA kekal merah buat masa ini (belum ada keputusan warna)

## Fasa 5 — Pembersihan

- [x] Ganti hex keras dalam `global.css` dengan token semantik (kecuali warna jenama platform pada kad story dan `#000` dalam `mask-image`, yang hanya alpha). Alias lama `:root` (`--text`, `--white`, `--red`…) dibuang
- [x] Ganti `font-weight: 700` (tiada dalam skala; guna 500/600). Semua berat kini token `--font-weight-*`
- [x] Ganti radius keras dengan token `--radius-*` (bulatan `50%` kekal)
- [x] Tiada `rem` lagi dalam `ui.css` dan `global.css`; saiz font luar skala dipetakan ke `--text-*` (kecuali monogram agensi 9px)
- [x] Tiada `transition: all` lagi
- [x] Buang CSS lama yang tidak dipakai lagi: ~700 baris (posts/kad lama, pill-form, bento, layout Artikel lama, `hiw`, `.btn`). ClaimForm kini guna `Button`

## Fasa 6 — Kualiti & serahan (laman web)

- [x] Semakan visual setiap page desktop (1624) + mobile (390) berbanding Paper — lihat [`audit-localhost-vs-paper.md`](audit-localhost-vs-paper.md)
- [x] Aksesibiliti: kontras (semua teks lulus AA — diimbas pada runtime), fokus keyboard (Tab melalui setiap halaman), `prefers-reduced-motion` (autoplay & ticker berhenti)
- [x] `npm run build` (export statik) lulus
- [ ] Halaman katalog komponen `/design-system` (dev sahaja) — rujukan visual untuk CMS/extension
- [ ] PR `endahbyu` → `main`

---

## Fasa 7 — Guna semula: CMS dashboard & browser extension

### 7.1 Pakej kongsi

Satu sumber, tiga pengguna. Jangan salin token secara manual ke repo lain.

```
design-system/
  tokens.css          ← dipindah dari app/tokens.css (sumber tunggal)
  ui.css              ← dipindah dari app/ui.css (komponen asas, CSS biasa)
  shadcn-bridge.css   ← peta token kita → nama variable shadcn (7.3)
  fonts/              ← Manrope woff2 (untuk extension; web guna next/font)
  components/         ← Button, Chip, Tabs, Verdict, SearchField, NavLink, DropdownMenu, Icon
  README.md           ← cara import untuk setiap pengguna
```

- [ ] Pindah `tokens.css` + `ui.css` + `components/ui/*` ke `design-system/`; laman web import dari situ (tiada perubahan visual)
- [?] Cara kongsi ke repo CMS/extension: **monorepo** (pnpm workspace, paling mudah dijaga) · pakej npm privat · git submodule
- [ ] Versi pakej (semver) + CHANGELOG ringkas: token baru = minor, nama token berubah/dibuang = major
- [ ] Fail `fonts.css` dengan `@font-face` Manrope untuk persekitaran tanpa `next/font` (extension). `--font-manrope` diisi oleh fail ini.

### 7.2 CMS dashboard

Mod **Operate**: kebolehbacaan, kepadatan dan konsistensi lebih penting daripada ekspresi. Jenama hadir dalam butiran (verdict, font, radius), bukan hiasan.

- [?] Stack CMS: Next.js 16 App Router (sama dengan laman web) — sahkan
- [?] Tailwind v4 dalam CMS (diperlukan oleh shadcn). Laman web **kekal CSS biasa**; token kita sudah ikut namespace Tailwind v4, jadi `tokens.css` boleh terus jadi `@theme`
- [ ] Ketumpatan: skala kawalan CMS (tinggi button/input 36–40px vs 48px laman web) — tambah token `--control-h-sm` / `--control-h-md` dan bukan nilai keras
- [ ] Label kawalan CMS: kekal **16/24 Medium**, atau benarkan **14/20 Medium** untuk jadual & toolbar padat [?] — putuskan sekali, catat dalam handoff
- [ ] Komponen CMS yang guna design system sedia ada: Button, Chip (filter), Tabs, Verdict (status artikel), SearchField, DropdownMenu, Icon
- [ ] Senarai komponen shadcn yang perlu (lihat 7.4) dipasang & disesuaikan
- [ ] Verdict pada jadual/senarai: guna `Verdict tone="single"` yang sama — jangan buat badge status baru
- [ ] Mode dark (jika diputuskan di Fasa 1)

### 7.3 Browser extension

- [ ] Popup / side panel: import `tokens.css` + `fonts.css` + `ui.css` terus (tiada Tailwind diperlukan)
- [ ] UI yang disuntik ke page lain (content script): render dalam **Shadow DOM**; token di-scope ke `:host` (bukan `:root`) supaya tidak bocor ke/dari page hos
- [ ] Tiada reset global (`*`, `html`, `body`) dalam CSS extension — scope bawah `:host` atau satu class akar
- [ ] Font di-bundle dalam extension (`fonts/`), bukan Google Fonts (CSP & privasi)
- [ ] Ikon: `lucide-react` (React) atau `lucide` (vanilla) — tetap 1.75px, currentColor
- [ ] `z-index` & `position: fixed` untuk lapisan yang disuntik: satu token `--z-overlay` sahaja
- [ ] Komponen utama: Verdict, Button, Tooltip, Toast (Sonner), Popover

### 7.4 Inventori komponen ikut pengguna

| Komponen | Sumber | Web | CMS | Extension |
|---|---|:-:|:-:|:-:|
| Button, Chip, Tabs, Verdict, SearchField, NavLink, DropdownMenu, Icon | **Design system** | ✓ | ✓ | ✓ (sebahagian) |
| Input, Textarea, Select, Checkbox, Radio, Switch, Label | shadcn → sesuaikan (Paper 12 › Inputs dulu) | ClaimForm | ✓ | — |
| Dialog, AlertDialog, Sheet | shadcn | ClaimForm | ✓ | — |
| Table / Data table (TanStack) | shadcn | — | ✓ | — |
| Form (react-hook-form + zod) | shadcn | ClaimForm | ✓ | — |
| Popover, Tooltip, Command / Combobox | shadcn | — | ✓ | ✓ |
| Calendar / Date picker | shadcn | — | ✓ | — |
| Toast (Sonner) | shadcn | — | ✓ | ✓ |
| Sidebar, Breadcrumb, Pagination | shadcn | — | ✓ | — |
| Avatar, Badge, Skeleton, Separator, Card, Alert | shadcn → semak dulu dengan Paper (Avatar agensi, Article card) | ✓ | ✓ | ✓ |

Peraturan: jika Paper ada spec untuk komponen itu, **Paper menang** — shadcn hanya jadi asas kod (struktur, a11y, keyboard).

---

## Fasa 8 — shadcn/ui untuk komponen yang tiada

### 8.1 Pemasangan (sekali, setiap projek)

- [ ] `npx shadcn@latest init` — gaya `new-york`, `tsx: false` (projek guna JS), `iconLibrary: "lucide"`, `cssVariables: true`
- [ ] **Alias berasingan** dalam `components.json` supaya shadcn tidak menimpa `components/ui/` kita:
  `"ui": "@/components/shadcn"` — komponen kita kekal di `@/components/ui`
- [ ] Baca `node_modules/next/dist/docs/` untuk perubahan Next 16 sebelum pasang (AGENTS.md); semak shadcn serasi React 19.3

### 8.2 Jambatan token (`shadcn-bridge.css`)

shadcn baca variable tanpa awalan (`--background`, `--primary`…). Petakan ke token semantik kita — **jangan** tulis nilai baru:

| shadcn | Token kita | Nota |
|---|---|---|
| `--background` / `--foreground` | `--color-background` / `--color-foreground` | |
| `--card` / `--card-foreground` | `--color-card` / `--color-foreground` | |
| `--popover` / `--popover-foreground` | `--color-card` / `--color-foreground` | dropdown kita guna card + `--color-border` |
| `--primary` / `--primary-foreground` | `--color-primary` / `--color-primary-foreground` | Ink, **bukan** merah |
| `--secondary` / `--secondary-foreground` | `--color-muted` / `--color-foreground` | |
| `--muted` / `--muted-foreground` | `--color-muted` / `--color-muted-foreground` | |
| `--accent` / `--accent-foreground` | `--color-muted` / `--color-foreground` | hover baris menu = muted, sama dengan nav aktif |
| `--destructive` | `--color-destructive` | |
| `--border` / `--input` | `--color-border` / `--color-border-strong` | field edge 3:1 |
| `--ring` | `--color-ring` | |
| `--radius` | `--radius-input` (8px) | shadcn kira `sm/md/lg` dari sini; button & chip override ke `--radius-full` |
| `--chart-1…5` | [?] belum ada token carta | tambah di Fasa 1 jika CMS ada carta |
| `--sidebar-*` | `--color-muted`, `--color-foreground`, `--color-border`, `--color-ring` | |

- [ ] Tulis `shadcn-bridge.css` (light + `.dark` bila dark mode diputuskan)
- [ ] Tiada `oklch(...)` lalai shadcn tertinggal dalam `globals.css` CMS — padam blok warna lalai selepas `init`

### 8.3 Senarai semak penyesuaian (setiap komponen shadcn yang ditambah)

Salin blok ini ke PR untuk setiap komponen:

- [ ] Warna hanya melalui variable jambatan / token semantik — tiada `bg-zinc-*`, `text-neutral-*`, hex atau `oklch` dalam fail komponen
- [ ] Label kawalan: `font-sans` (Manrope) **16/24 Medium** (shadcn lalai `text-sm` 14px — tukar), atau saiz CMS yang diputuskan di 7.2
- [ ] Radius: button / chip / tab / search = `--radius-full`; input = `--radius-input`; dropdown / popover = `--radius-md`; card / dialog = `--radius-card`
- [ ] Tinggi kawalan ikut token (`--control-h-*`), bukan `h-9` / `h-10` keras
- [ ] Fokus: `outline: 2px solid var(--color-ring); outline-offset: 3px` (sama dengan `ui.css`) — ganti `ring-[3px] ring-ring/50` lalai shadcn
- [ ] Ikon: melalui `Icon` (1.75px, `absoluteStrokeWidth`) — shadcn lalai `size-4` stroke 2; tukar
- [ ] Motion: guna token motion; popover/dropdown `transform-origin` ikut trigger, masuk ≤ 200ms ease-out, keluar lebih cepat; dialog kekal di tengah; `prefers-reduced-motion` dihormati
- [ ] Bayang: hanya `--shadow-subtle*` / `--shadow-float` (lapisan terapung sahaja)
- [ ] Merah Kebenaran tidak dipakai untuk aksi; `destructive` guna `--color-destructive`
- [ ] Teks UI dalam Bahasa Melayu (label, aria-label, placeholder, mesej kosong & ralat)
- [ ] Ditambah ke katalog `/design-system` + satu baris dalam `design-system-handoff.md` § Komponen

---

## Fasa 9 — Semakan konsistensi (boleh dijalankan)

Jalankan sebelum setiap PR, di setiap projek (web, CMS, extension). Semua mesti kosong kecuali yang dinyatakan.

```bash
# 1. Hex / rgb keras dalam komponen (token sahaja; tokens.css dikecualikan)
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(' components design-system/components --include=*.js --include=*.css | grep -v tokens.css

# 2. Palette primitif dipakai terus dalam komponen
grep -rnE 'var\(--color-(grey-[0-9]+|red|red-dark|blue|azure|orange|green)[^-a-z]' components design-system/components app/ui.css

# 3. Pustaka ikon lain selain Lucide
grep -rnE "from ['\"](react-icons|@heroicons|@radix-ui/react-icons|@tabler|phosphor)" components app

# 4. Ikon Lucide dipakai tanpa <Icon> (mesti melalui wrapper)
grep -rn "from 'lucide-react'" components app | grep -v 'components/ui/Icon.js'   # semak: setiap fail mesti render <Icon icon={...}>

# 5. rem dalam komponen kongsi
grep -rnE '[0-9.]+rem\b' design-system app/ui.css

# 6. Berat font di luar skala (400/500/600)
grep -rnE 'font-weight:\s*(700|800|900|bold)' app design-system

# 7. transition: all
grep -rn 'transition: all' app design-system

# 8. Warna lalai shadcn tertinggal (CMS)
grep -rnE 'oklch\(|(bg|text|border)-(zinc|neutral|slate|gray|stone)-[0-9]' components/shadcn app
```

- [x] Jadikan senarai di atas skrip `npm run lint:ds` (`scripts/lint-ds.mjs`, Node tanpa dependency; pengecualian ditanda `ds-allow:` pada baris yang sama). Kini: bersih
- [ ] Jalankan dalam CI pada PR (Fasa 6)

### Semakan visual manual (setiap pengguna)

| Semak | Web | CMS | Extension |
|---|:-:|:-:|:-:|
| Font: Manrope sahaja; display 400 | [x] | [ ] | [ ] |
| Label interaktif 16/24 Medium (atau saiz CMS yang diputuskan) | [ ] | [ ] | [ ] |
| Verdict: 4 warna + dot sama di semua tempat | [ ] | [ ] | [ ] |
| Button / chip / tab bulat penuh; input 8px; card 20px | [ ] | [ ] | [ ] |
| Fokus 2px `--color-ring` kelihatan pada semua kawalan | [x] | [ ] | [ ] |
| Ikon Lucide 1.75px, warna ikut teks | [ ] | [ ] | [ ] |
| Merah hanya untuk jenama / ralat, bukan aksi | [~] AIFA (keputusan terbuka) | [ ] | [ ] |
| `prefers-reduced-motion` mematikan gerakan | [x] | [ ] | [ ] |
| Mobile 375 / popup extension 360 tidak terpotong | [x] 390 | — | [ ] |

---

## Keputusan terbuka

- [?] Warna Tanya AIFA
- [?] Mode dark: bila (CMS mungkin perlukan dahulu)
- [?] Cara kongsi pakej: monorepo · npm privat · submodule (7.1)
- [?] Stack CMS: Next.js 16 + Tailwind v4 + shadcn (7.2)
- [?] Saiz label kawalan CMS: 16/24 atau 14/20 untuk jadual padat (7.2)
- [?] Token carta (`--chart-1…5`) jika CMS ada graf (8.2)
