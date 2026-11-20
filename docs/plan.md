# Sebenarnya.my — Design System Plan

Checklist kerja design system. Kemas kini fail ini **dalam commit yang sama** setiap kali satu item siap (sama seperti `docs/design-system-handoff.md`).

- Sumber design: Paper `sebenarnya.my` (`01M7VAW17RGCJXGYKR590PX12M`) — page *Design system* (artboard 01–12) dan *Artwork* (Home, Artikel, Tentang Kami, Mesej… ).
- Spec penuh: [`design-system-handoff.md`](design-system-handoff.md).
- Branch: `endahbyu`.
- Skop: **laman web Sebenarnya.my sahaja** (Next.js 16, CSS biasa). CMS dashboard dan browser extension di luar skop tugasan ini (dibuang dari plan, 21 Nov 2026).

**Peraturan tetap**
- Komponen hanya guna **token semantik** (`--color-background`, `--color-foreground`, `--color-muted*`, `--color-border*`, `--color-primary*`, `--color-ring`, `--color-verdict-*`…) + skala `--text-*`, `--leading-*`, `--spacing-*`, `--radius-*`. Nama token sama di Paper dan kod.
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
- [x] **Satu set nama token Paper ↔ kod** — ikut nama Paper (Tailwind v4 + shadcn). Shadow kekal dalam kod sahaja.
- [x] Token untuk overlay media: `--gradient-scrim-media`, `-media-wide`, `-bottom`, `-bottom-short`, `-top`
- [x] Token motion dalam `tokens.css`: `--duration-fast/base/slow/page`, `--ease-out` (lalai), `--ease-in-out`, `--ease-emphasized`, `--ease-page`. `--ease`/`--slide` lama dibuang; tiada `cubic-bezier` keras lagi kecuali lengkung flip FlipCard
- [?] Mode dark (Paper artboard 11 · Forms & themes) — sekarang atau kemudian.

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
- [x] Tanya AIFA floating button — merah gelap `--color-brand-strong` (5.56:1, lulus AA), diputuskan 21 Nov 2026
- [x] Article card (grid Artikel), gaya baharu ala elevenlabs.io: kad putih + border, foto full-bleed, pill verdict putih. Kod + Paper
- [x] FactCheckCard / Flip card: satu kad terbuka pada satu masa, hover intent 90/140ms, buka 0.7s ease-out, tutup 0.45s
- [x] Seksyen "Semakan fakta terkini": gelangsar automatik tanpa hujung, berhenti bila hover, butang ‹ › (butang "Lihat lagi" dibuang)
- [x] 20 artikel baharu (Oktober 2026) dengan gambar unik; monogram agensi bila tiada logo
- [ ] Logo agensi baharu: MOF, JAIS, Kesultanan Pahang, PMO, JPM, Caltex, KTMB (kini monogram)
- [x] HeroCarousel: infinite loop, teks pada slaid tengah sahaja (ikut Paper), pembilang slaid, autoplay + dots + jeda
- [x] Page transition antara route (`components/PageTransition.js`, View Transitions API)
- [x] PromoBanner / Award (WSIS)
- [x] Galeri media sosial (Aktiviti media sosial): 5 kad elastik tanpa slider — kod; **Paper belum dikemas kini**
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
| ~~`/logo`~~ | — | Dibuang (21 Nov 2026). Logo kini seksyen `#logo` dalam Tentang Kami; menu Tentang Kami › Logo menuju `/about-us/#logo` |

- [x] Hero: tajuk baru "Tidak pasti? Jangan kongsi / Semak dakwaan, Temukan kebenaran"
- [ ] Hero: kemas kini tajuk yang sama di Paper

## Keputusan arah visual (docs/design.md, 21 Nov 2026)

- [x] Satu keluarga font: Manrope sahaja — kod, handoff, Paper
- [x] Display (tajuk besar) weight 400 — kod, handoff, Paper (`--font-weight-display`)
- [x] Angka statistik weight 400 — kod, handoff, Paper
- [x] Tanya AIFA merah gelap `--color-brand-strong` (diputuskan 21 Nov 2026)
- [x] Konflik Paper ↔ design.md: **ikut design.md** (kad media sosial tanpa gradient, meta 500)

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
