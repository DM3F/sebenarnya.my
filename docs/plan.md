# Sebenarnya.my — Design System Plan

Checklist kerja design system. Kemas kini fail ini **dalam commit yang sama** setiap kali satu item siap (sama seperti `docs/design-system-handoff.md`).

- Sumber design: Paper `sebenarnya.my` (`01M7VAW17RGCJXGYKR590PX12M`) — page *Design system* (artboard 01–12) dan *Artwork* (Home, Artikel, Tentang Kami, Mesej… ).
- Spec penuh: [`design-system-handoff.md`](design-system-handoff.md).
- Branch: `endahbyu`.

**Peraturan tetap**
- Komponen hanya guna **token semantik** (`--surface-*`, `--text-*`, `--border-*`, `--action-*`, `--focus-*`, `--verdict-*`, `--brand-*`, `--control-*`). Design system ini akan dipakai juga di **CMS dashboard** dan **browser extension**.
- Font: **Manrope** untuk kandungan/tajuk, **Inter** untuk UI. Semua tajuk besar **Medium 500**.
- Merah Kebenaran bukan warna aksi (button, link, nav).

Legend: `[x]` siap & dipush · `[ ]` belum · `[?]` perlu keputusan user

---

## Fasa 1 — Fondasi (tokens & font)

- [x] Font Manrope + Inter via `next/font` (`app/layout.js`)
- [x] `app/tokens.css`: primitive, semantic, type scale, weight, spacing, radius, shadow, container, skala mobile
- [x] Petakan variable lama `:root` dalam `global.css` ke token
- [x] Peraturan "tajuk besar = Medium 500" dalam dokumen
- [ ] **Selaraskan nama token Paper ↔ kod.** Paper guna `--color-background`, `--color-muted`, `--color-primary`, `--text-18`, `--spacing-*`, `--radius-full`…; kod guna `--surface-canvas`, `--surface-subtle`, `--action-fill`, `--text-label-18`, `--space-*`, `--radius-pill`. Pilih satu set nama dan guna di kedua-dua tempat (penting untuk CMS/extension).
- [ ] Token untuk overlay media (gradient hero carousel, teks putih atas imej)
- [ ] Token motion (`--duration-*`, `--ease-*`) — sekarang `--ease`/`--slide` lama dalam `global.css`
- [ ] Pakej token boleh-guna-semula: `tokens.css` + `ui.css` dalam folder tersendiri (cth. `design-system/`) supaya CMS/extension boleh import tanpa salin manual
- [?] Mode dark (Paper artboard 11 · Forms & themes) — sekarang atau kemudian

## Fasa 2 — Komponen asas (`components/ui/`, `app/ui.css`)

- [x] Button (filled, outline, ghost, disabled, `href`)
- [x] Chip + ChipRow
- [x] Tabs (mode tabs & toggle)
- [x] Verdict (palsu, waspada, makluman, benar; tone default/single)
- [x] SearchField (controlled, error)
- [x] NavLink
- [ ] Button: saiz kecil + varian "on media" (butang putih atas imej, cth. "Baca semakan")
- [ ] Icon button bulat (prev/next carousel 48px, jeda 56px)
- [ ] Dropdown menu (item 44px, radius 12) — untuk "Tentang Kami ▾"
- [ ] Field teks biasa / textarea / select (Paper 12 › Inputs) — guna dalam ClaimForm
- [ ] Badge/Counter ("04 / 05") dan Pagination dots
- [ ] Avatar agensi (30 / 40px)
- [ ] Semak semula ketepatan dengan Paper 12 › Button, Inputs, Verdict (nilai tepat via `get_computed_styles`)

## Fasa 3 — Komponen jenama & corak (Paper 06, 12 › Card / Home patterns)

- [x] Nav/Header (ikut Paper Home)
- [ ] Nav/Header: dropdown "Tentang Kami ▾" (perlu ubah `navLinks`)
- [ ] Footer (Paper 12 › Footer)
- [?] Tanya AIFA floating button — merah (artwork) vs Ink + `--shadow-float` (peraturan)
- [ ] Article card (Paper 12 › Card)
- [ ] FactCheckCard / Flip card + states (Paper 06 › FactCheckCard – States)
- [ ] HeroCarousel (Paper 12 › Home patterns)
- [ ] PromoBanner / Award (WSIS)
- [ ] SocialCarousel (Aktiviti media sosial)
- [ ] AgencyLogoStrip (Sumber kenyataan rasmi)
- [ ] Band: Closing, Announcement
- [ ] Timeline (Tentang Kami)
- [ ] Fungsi card, Feature card, Logo download card

## Fasa 4 — Halaman (Paper › Artwork)

| Route | Artboard | Status |
|---|---|---|
| `/` | Home | [~] Header + Hero siap; section lain belum |
| `/article` | Artikel | [ ] |
| `/article/[slug]` | Mesej pautan pendaftaran… | [ ] |
| `/about-us` | Tentang Kami | [ ] |
| `/logo` | (Logo) | [ ] |

- [ ] Hero: teks kecil bawah tajuk (Paper masih placeholder — tunggu copy)

## Fasa 5 — Pembersihan

- [ ] Ganti **65** hex keras dalam `global.css` dengan token semantik
- [ ] Ganti **16** `font-weight: 700` (tiada dalam skala; guna 500/600)
- [ ] Ganti radius 26/28px dengan `--radius-card` / `--radius-card-lg`
- [ ] Ganti `rem` dalam komponen yang dipindah ke `ui.css` → px token
- [ ] Buang CSS lama yang tidak dipakai lagi (`.btn`, `.pill-form`, `.lang-switch`…) bila semua pengguna sudah pindah

## Fasa 6 — Kualiti & serahan

- [ ] Semakan visual setiap page desktop + mobile (375) berbanding Paper
- [ ] Aksesibiliti: kontras, fokus, keyboard, `prefers-reduced-motion`
- [ ] `npm run build` (export statik) lulus
- [ ] Halaman katalog komponen (dev sahaja) atau Storybook ringan untuk CMS/extension
- [ ] PR `endahbyu` → `main`

## Keputusan terbuka

- [?] Warna Tanya AIFA
- [?] Mode dark: bila
- [?] Struktur nav: dropdown "Tentang Kami" (Tentang kami, Logo, Hubungi kami)
- [?] Nama token akhir (Paper vs kod) — lihat Fasa 1
