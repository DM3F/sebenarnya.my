# Sebenarnya.my — Design System Plan

Checklist kerja design system. Kemas kini fail ini **dalam commit yang sama** setiap kali satu item siap (catatan halaman web: `docs/website-changelog.md`).

> **Sumber kebenaran:** kod dalam repo ini (`app/tokens.css`, `app/ui.css`, `components/ui/`) bersama [`design.md`](design.md) dan [`design-system-rules.md`](design-system-rules.md). Fail Paper `sebenarnya.my` **bukan lagi rujukan**: kanvasnya tidak sama dengan design semasa. Jangan salin nilai atau susun atur daripada Paper.
- Spec penuh: [`design-system-rules.md`](design-system-rules.md) · peta dokumen: [`README.md`](README.md) · sejarah web: [`website-changelog.md`](website-changelog.md).
- Branch: `endahbyu`.
- Skop: laman web Sebenarnya.my (Next.js 16, CSS biasa). Sejak 25 Nov 2026 design system juga disediakan untuk **CMS dashboard** dan **browser extension**: lihat *Handover ke produk lain* di bawah dan [`README.md`](README.md).

**Peraturan tetap**
- Komponen hanya guna **token semantik** (`--color-background`, `--color-foreground`, `--color-muted*`, `--color-border*`, `--color-primary*`, `--color-ring`, `--color-verdict-*`…) + skala `--text-*`, `--leading-*`, `--spacing-*`, `--radius-*`.
- Font: **Manrope sahaja** (kandungan, tajuk, navigasi dan kawalan UI). Display 48+ dan angka statistik **400** (`--font-weight-display`); heading 24–36 dan label **Medium 500**. Tiada 700+. Rujuk [`design.md`](design.md).
- Merah Kebenaran bukan warna aksi (button, link, nav).
- Ikon: **Lucide** sahaja, melalui `components/ui/Icon.js` (garis 1.75px `absoluteStrokeWidth`, currentColor, `aria-hidden`). Logo jenama (Facebook, TikTok…) kekal SVG jenama.
- Semua label interaktif (button, nav, tab, chip, dropdown, CTA, link footer) = **16 / 24 Medium**.
- Unit **px** sahaja dalam token dan komponen (tiada `rem`): laman web set `html { font-size: 62.5% }`.

Legend: `[x]` siap & dipush · `[~]` separa · `[ ]` belum · `[?]` perlu keputusan user

---

## Fasa 1 — Fondasi (tokens & font)

- [x] Font Manrope via `next/font` (`app/layout.js`); Inter dibuang
- [x] `app/tokens.css`: primitive, semantic, type scale, weight, spacing, radius, shadow, container, skala mobile
- [x] Petakan variable lama `:root` dalam `global.css` ke token
- [x] Peraturan berat tajuk dalam dokumen (display 400, heading 500 — ikut `design.md`)
- [x] **Satu set nama token** dalam `app/tokens.css` (namespace Tailwind v4 + warna semantik gaya shadcn), tiga lapis: primitive → semantic → component.
- [x] Token untuk overlay media: `--gradient-scrim-media`, `-media-wide`, `-bottom`, `-bottom-short`, `-top`
- [x] Token motion dalam `tokens.css`: `--duration-fast/base/slow/page`, `--ease-out` (lalai), `--ease-in-out`, `--ease-emphasized`, `--ease-page`. `--ease`/`--slide` lama dibuang; tiada `cubic-bezier` keras lagi kecuali lengkung flip FlipCard
- [?] Mode dark — sekarang atau kemudian.

## Fasa 2 — Komponen asas (`components/ui/`, `app/ui.css`)

- [x] Button (filled, outline, ghost, disabled, `href`)
- [x] Chip + ChipRow
- [x] Tabs (mode tabs & toggle)
- [x] Verdict (palsu, waspada, makluman, benar; tone default/single)
- [x] SearchField (controlled, error)
- [x] NavLink
- [x] Dropdown menu (`DropdownMenu`) — untuk "Tentang Kami ▾"
- [x] Ikon: Lucide (`lucide-react` ^0.577) melalui `Icon`; semua SVG tulis tangan diganti (kecuali logo jenama)
- [x] Button: saiz `sm` + varian `media` (butang kanvas atas imej) + `secondary`, `iconEnd`
- [x] Icon button bulat: `IconButton` (44 / 36 / 48), dipakai di carousel, Latest, Tentang Kami, Artikel, dialog
- [x] Field / Input / Textarea / Select (`components/ui/Field.js`) — dipakai di ClaimForm, Artikel, AIFA
- [ ] Pagination dots sebagai komponen kongsi (kini hanya dalam HeroCarousel).
- [ ] Avatar agensi (30 / 40px)

## Fasa 3 — Komponen jenama & corak

- [x] Nav/Header: dropdown "Tentang Kami ▾", nav Utama/Artikel, segmented BM/EN; font label Manrope
- [ ] Nav/Header: item "Hubungi kami" (perlu page `/contact/`)
- [x] Footer — semua halaman
- [x] Tanya AIFA floating button — merah gelap `--color-brand-strong` (5.56:1, lulus AA), diputuskan 21 Nov 2026
- [x] Article card (grid Artikel), gaya baharu ala elevenlabs.io: kad putih + border, foto full-bleed, pill verdict putih
- [x] FactCheckCard / Flip card: satu kad terbuka pada satu masa, hover intent 90/140ms, buka 0.7s ease-out, tutup 0.45s
- [x] Seksyen "Semakan fakta terkini": gelangsar automatik tanpa hujung, berhenti bila hover, butang ‹ › (butang "Lihat lagi" dibuang)
- [x] 20 artikel baharu (Oktober 2026) dengan gambar unik; monogram agensi bila tiada logo
- [ ] Logo agensi baharu: MOF, JAIS, Kesultanan Pahang, PMO, JPM, Caltex, KTMB (kini monogram)
- [x] HeroCarousel: infinite loop, teks pada slaid tengah sahaja, pembilang slaid, autoplay + dots + jeda
- [x] Page transition antara route (`components/PageTransition.js`, View Transitions API)
- [x] PromoBanner / Award (WSIS)
- [x] Galeri media sosial (Aktiviti media sosial): 5 kad elastik tanpa slider, kad terlipat = panel gradient platform + ikon di tengah
- [x] Galeri Tentang Kami: sfera 3D foto bulat (seret + auto-putar), klik → dialog foto sahaja tanpa teks
- [x] AgencyLogoStrip (Sumber kenyataan rasmi)
- [ ] Band: Closing, Announcement
- [ ] Timeline (Tentang Kami)
- [ ] Fungsi card, Feature card, Logo download card

## Fasa 4 — Halaman

| Route | Artboard | Status |
|---|---|---|
| `/` | Home | [x] Header, Hero (+ carian popular), HeroCarousel, Semakan fakta terkini, Tentang ringkas, Aktiviti media sosial (WSIS + SocialCarousel), footer |
| `/article` | Artikel | [x] Kod: penapis (5 chip keputusan), grid kad 4 kolum, footer (`components/Articles.js`, `components/Footer.js`) |
| `/article/[slug]` | detail artikel page | [x] Kod: Verdict + pil kategori, tajuk 48/52, meta + Kongsi, imej 1100×550, lajur bacaan 514 (`components/ArticleDetail.js`) |
| `/about-us` | Tentang Kami | [x] Kod: Hero (foto + Ikuti kami), About, Empat fungsi, Berita dan Galeri, Logo (`components/AboutUs.js`, `LogoKit.js`). "Bagaimana kami menyemak" dibuang. |
| ~~`/logo`~~ | — | Dibuang (21 Nov 2026). Logo kini seksyen `#logo` dalam Tentang Kami; menu Tentang Kami › Logo menuju `/about-us/#logo` |

- [x] Hero: tajuk baru "Tidak pasti? Jangan kongsi / Semak dakwaan, Temukan kebenaran"

## Keputusan arah visual (docs/design.md, 21 Nov 2026)

- [x] Satu keluarga font: Manrope sahaja — kod, handoff
- [x] Display (tajuk besar) weight 400 — kod, handoff
- [x] Angka statistik weight 400 — kod, handoff
- [x] Tanya AIFA merah gelap `--color-brand-strong` (diputuskan 21 Nov 2026)
- [x] Bila ragu, **ikut design.md** (kad media sosial tanpa gradient, meta 500)

## Fasa 5 — Pembersihan

- [x] Ganti hex keras dalam `global.css` dengan token semantik (kecuali warna jenama platform pada kad story dan `#000` dalam `mask-image`, yang hanya alpha). Alias lama `:root` (`--text`, `--white`, `--red`…) dibuang
- [x] Ganti `font-weight: 700` (tiada dalam skala; guna 500/600). Semua berat kini token `--font-weight-*`
- [x] Ganti radius keras dengan token `--radius-*` (bulatan `50%` kekal)
- [x] Tiada `rem` lagi dalam `ui.css` dan `global.css`; saiz font luar skala dipetakan ke `--text-*` (kecuali monogram agensi 9px)
- [x] Tiada `transition: all` lagi
- [x] Buang CSS lama yang tidak dipakai lagi: ~700 baris (posts/kad lama, pill-form, bento, layout Artikel lama, `hiw`, `.btn`). ClaimForm kini guna `Button`

## Fasa 6 — Kualiti & serahan (laman web)

- [x] Semakan visual setiap page desktop (1440) + mobile (390), axe WCAG 2.2 AA bersih (22 Nov)
- [x] Aksesibiliti: kontras (semua teks lulus AA — diimbas pada runtime), fokus keyboard (Tab melalui setiap halaman), `prefers-reduced-motion` (autoplay & ticker berhenti)
- [x] `npm run build` (export statik) lulus
- [ ] Halaman katalog komponen `/design-system` (dev sahaja) — rujukan visual
- [ ] PR `endahbyu` → `main`

---

## Fasa 9 — Semakan konsistensi (boleh dijalankan)

Jalankan sebelum setiap PR (`npm run lint:ds`). Semua mesti kosong kecuali yang dinyatakan.

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

```

- [x] Jadikan senarai di atas skrip `npm run lint:ds` (`scripts/lint-ds.mjs`, Node tanpa dependency; pengecualian ditanda `ds-allow:` pada baris yang sama). Kini: bersih
- [ ] Jalankan dalam CI pada PR (Fasa 6)

### Semakan visual manual

| Semak | Web |
|---|:-:|
| Font: Manrope sahaja; display 400 | [x] |
| Label interaktif 16/24 Medium | [ ] |
| Verdict: 4 warna + dot sama di semua tempat | [ ] |
| Button / chip / tab bulat penuh; input 8px; card 20px | [ ] |
| Fokus 2px `--color-ring` kelihatan pada semua kawalan | [x] |
| Ikon Lucide 1.75px, warna ikut teks | [ ] |
| Merah hanya untuk jenama / ralat, bukan aksi | [~] AIFA (keputusan terbuka) |
| `prefers-reduced-motion` mematikan gerakan | [x] |
| Mobile 375 tidak terpotong | [x] 390 |

---

## Keputusan terbuka

- [?] Mode dark: bila
- [ ] **Logo SVG** — user akan hantar fail SVG rasmi (logo + ikon). Bila sampai: letak dalam `public/images/logo/`, tambah pilihan muat turun SVG di samping PNG (`logoPage.items` dalam `data/content.js`, `components/LogoKit.js`).
- [ ] **Terma penggunaan logo** — teks sekarang ialah DEMO (`logoPage.terms`). Ganti dengan teks rasmi MCMC sebelum lancar.

## Handover ke produk lain (25 Nov 2026)

Urutan dipersetujui. Butiran jurang per produk: [`README.md`](README.md) › Known gaps.

**Stack produk lain (jawapan 26 Nov 2026):**

| Produk | Framework | Bahasa | Styling | shadcn / Radix |
|---|---|---|---|---|
| CMS dashboard | Next.js | TypeScript | CSS biasa | Belum guna |
| Browser extension | React | TypeScript | Tailwind CSS 3.4 | Belum guna |

- Semua repo **berasingan** (laman web, CMS, extension), jadi design system perlu jadi pakej berversi yang dipasang oleh setiap repo.
- Belum ada pustaka komponen di mana-mana produk: `components/ui/` ialah standard, shadcn/ui hanya rujukan API dan aksesibiliti (diterjemah ke CSS biasa + token kita).
- Mode dark **tidak diperlukan** buat masa ini.
- Permukaan UI extension (popup / side panel / content script) belum diketahui. Fokus design system: reka bentuk UI/UX dan token; mode scoped (Shadow DOM) hanya jika extension ternyata guna content script.

- [x] 1. Kemas dokumen: kontradiksi `design.md` dibetulkan (fokus violet → tinta, tinggi 44 → skala kawalan, jadual tipografi ikut `tokens.css`, tajuk 500), `design-system-handoff.md` → `website-changelog.md` (sejarah web, bukan spec), `README.md` netral produk.
- [x] 2. Halaman style guide `/design-system`: semua token dan komponen dirender daripada kod sebenar (noindex, tiada pautan dalam nav).
- [x] 3a. `app/base.css`: lalai elemen (body, tajuk, pautan, kawalan borang) dikeluarkan daripada `global.css`, jadi `tokens.css` + `base.css` + `ui.css` boleh berdiri sendiri. Disahkan: 0 perbezaan computed style pada 5,683 elemen (4 halaman).
- [x] 3b. Peranan bentuk: kontrol pill di `global.css` (9) dan `.ui-lang__trigger` kini `--radius-control`; badge (`.ui-badge`, `.ui-verdict` + 4 pil foto) guna token baharu `--radius-badge`; `--radius-full` hanya untuk bulatan; `--radius-media` diterbitkan daripada `--radius-card` − 8. Satu baris dalam `tokens.css` kini mengubah setiap kawalan, badge atau kad. Disahkan: 0 perbezaan computed style pada laman web.
- [ ] 3. Ekstrak pakej `design-system` (tokens, base, ui, React + jenis TypeScript `.d.ts`, fonts, lint), diterbitkan untuk repo berasingan; laman web guna dahulu. `lint:ds` dalam CI + tangkapan skrin `/design-system` sebagai ujian regresi visual.
- [x] 4a. Preset Tailwind CSS 3.4 untuk extension (`design-system/tailwind-preset.cjs`): setiap token jadi kelas yang membaca `var()`, nama kelas dibaca daripada `tokens.css`, nilai luar sistem (`bg-red-500`, `text-sm`, `rounded-lg`) tidak wujud, tiada rem. Diuji dengan Tailwind 3.4.17. Juga: `--font-sans` kini ada fallback `'Manrope'` (sebelum ini jatuh ke Times di luar Next.js).
- [x] 4b. Mode compact + komponen dashboard: `data-density="compact"` (hanya nilai token: kawalan 32/36/40/44, baris jadual 40, padding kad 12/16/24, hit area 24 untuk desktop). Komponen baharu (API shadcn, elemen asli, tiada Radix): Card, Table (sort + pilihan baris), Checkbox, Switch, RadioGroup, Pagination, Breadcrumb, Alert, Toast, Tooltip, Skeleton, Avatar, EmptyState, Separator; varian Button `quiet`. Token baharu: `--color-success` (status sistem, bukan verdict), `--size-row`, `--size-check`, `--size-switch`, `--size-toast`, `--size-sidebar`, `--radius-check`, `--spacing-36`. Semua dalam `/design-system` › Komponen dashboard, termasuk panel CMS dalam lalai vs compact.
- [x] 4c. App shell: `AppShell`, `Sidebar` (+ Header, Content, Group, Item dengan `count`, Footer), `SidebarTrigger`, `Topbar`, `PageContent`, `PageHeader`. Compact secara lalai. ≤900 sidebar jadi laci: fokus masuk dan kembali, Escape / scrim / pautan menutup, halaman di belakang `inert`. Komponen design system sahaja: menu dan halaman diisi oleh repo CMS.
- [x] 4d. Dialog: `Dialog` (tugas pendek, saiz sm/md/lg) dan `ConfirmDialog` / `confirmDialog()` (role alertdialog, tiada tutup scrim, onConfirm async dengan label menunggu dan ralat dalam dialog, destructive: fokus mula pada Batal + tanda amaran pada ikon, butang tindakan tetap tinta). Fokus kekal pada butang semasa menunggu (aria-disabled, bukan disabled).
- [ ] 4e. Seterusnya untuk CMS: carta dan meter.
- [ ] 4. Fon Manrope dibundel untuk extension. Mode scoped (Shadow DOM) hanya jika extension guna content script.
- [ ] 5. Mode dark: **ditangguh** (tidak diperlukan, 26 Nov 2026).
- [ ] 6. Pilihan: Figma variables, text styles dan komponen dijana daripada kod.
