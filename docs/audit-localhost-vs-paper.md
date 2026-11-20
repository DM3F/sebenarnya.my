# Audit: localhost vs Paper canvas

Tarikh semakan asal: 21 November 2026, pada commit `90560b7`.
Status dikemas kini: 21 November 2026, selepas commit `3d629f7` dan `70eac60`.
Dibandingkan: `http://localhost:3000` (branch `endahbyu`) dengan fail Paper `sebenarnya.my` › page **Artwork** (artboard Home, Artikel, detail artikel, Tentang Kami).
Cara semak: tangkapan skrin desktop (1624px) dan mobile (390px, emulasi peranti), serta nilai yang dibaca terus dari DOM dan Paper (`get_computed_styles`).

Legend: ✅ selesai / sepadan · ⏸️ dibiarkan atas keputusan · ❓ perlu keputusan · ℹ️ bukan pepijat

---

## Ringkasan — status

| # | Halaman | Isu | Status |
|---|---|---|---|
| 1 | Home | Hero carousel: semua 5 slaid tunjuk teks; permintaan = hanya slaid tengah | ✅ `70eac60`: slaid sisi gambar sahaja |
| 2 | Home | Slaid "RON95 tidak naik 20 sen esok." guna foto jalan bandar; Paper = pam minyak | ✅ `70eac60`: guna foto pam yang sama dengan Paper |
| 3 | Tentang Kami | Tajuk langkah "Bagaimana kami menyemak fakta" 27.36px weight 600 | ✅ Tidak relevan lagi, seksyen dibuang (`3d629f7`) |
| 4 | Artikel | Chip kategori: kod 16 chip; Paper 5 | ✅ `3d629f7`: Semua, Palsu, Penjelasan, Waspada, Makluman |
| 5 | Tentang Kami | Seksyen 6 langkah ada dalam kod, tiada dalam Paper | ✅ `3d629f7`: dibuang dari halaman (data `howItWorks` dikekalkan) |
| 6 | Tentang Kami | Seksyen "About" ada dalam Paper, tiada dalam kod | ✅ `3d629f7`: susun atur Paper, kandungan Sebenarnya.my (bukan teks templat tenis) |
| 7 | Detail artikel | Lebar kolum isi: Paper 514px, kod 680px | ✅ `3d629f7`: 514px |
| 8 | Home | Kad "Semakan fakta terkini": Paper foto kembar, kod 12 foto unik | ⏸️ Dibiarkan (keputusan "leave it") |
| 9 | Home | Pembilang slaid "04 / 05" pada slaid aktif tiada dalam kod (tidak dicatat dalam audit asal) | ✅ `70eac60`: ditambah, disembunyikan ≤600px |
| 10 | Semua | Butang Tanya AIFA merah, sedangkan merah bukan warna tindakan | ❓ Perlu keputusan: merah atau hitam |

---

## 1. Home (`/`)

### ✅ Diselesaikan
1. **Hero carousel — teks hanya pada slaid tengah.** Slaid sisi kini gambar sahaja. Teks pudar keluar dalam .2s dan masuk dalam .3s, tiada animasi untuk `prefers-reduced-motion`.
2. **Foto slaid RON95** — slaid guna `budimadani.jpg` (foto pam minyak yang sama dengan aset Paper). Artikel RON95 sendiri mengekalkan fotonya supaya gambar artikel kekal unik.
3. **Pembilang slaid** "03 / 05" — 14px tnum, pill hitam 60%, kanan bawah slaid aktif (Paper › HeroSlide / Active › Counter).

### ⏸️ Dibiarkan
4. Kad "Semakan fakta terkini": Paper ada 3 foto kembar (WhatsApp); kod 12 foto unik.

### ℹ️ Bukan pepijat
5. Angka statistik: pada 1624px, angka 72px dan akhiran 30px (`.42em`), sama dengan Paper. Pada skrin lebih kecil ia mengecil melalui `clamp(48px, 5vw, 72px)`.
6. Jalur logo "Kenyataan rasmi daripada": kod render 20 imej kerana senarai diduplikasi untuk ticker bergerak tanpa putus.

### ❓ Perlu keputusan
7. Butang Tanya AIFA masih merah (juga di Artikel, detail dan Tentang Kami).

### ✅ Sepadan
- Header, hero (tajuk, lede 2 baris, carian, chip "Carian popular").
- Semakan fakta terkini: tajuk 2 baris, baris kad full-bleed, gelangsar automatik, flip tanpa ubah tinggi.
- Tentang ringkas, Aktiviti media sosial (kad WSIS "Juara Dunia" + carousel sosial), footer.
- Mobile 390px: tiada limpahan mendatar.

---

## 2. Artikel (`/article/`)

### ✅ Diselesaikan
1. **Susun atur** mengikut Paper terkini: baris kad utama + senarai sisi dibuang; semua hasil dalam grid kad 4 kolum.
2. **Chip kategori:** 5 chip, susunan Palsu → Penjelasan → Waspada → Makluman.
3. **Kad melimpah:** setiap kad 28px lebih tinggi daripada slot grid (tiada `box-sizing: border-box`), jadi jarak antara baris nampak terlalu besar. Dibetulkan dalam `70eac60`.
4. **Tajuk kad** menyentuh tepi kanan kad. Dibetulkan dengan `box-sizing: border-box` pada tajuk (`3d629f7`).

### ℹ️ Bukan pepijat
5. Kiraan "32 artikel" vs Paper "12 artikel": kod guna data sebenar; Paper hanya contoh 12 kad.
6. Grid tiada kad kembar (Paper ada 2 kad zakat kembar sebagai contoh).
7. Pada skrin lebih kecil daripada 1624px, lebar kad mengecil (responsif).

---

## 3. Detail artikel (`/article/pautan-bantuan-tunai-whatsapp-palsu/`)

### ✅ Diselesaikan
1. **Lebar kolum isi:** 514px seperti Paper.

### ℹ️ Bukan pepijat
2. **Butang "Kongsi" 46px:** Paper juga 46px (min-height 44 + padding 10 + border 1px). Catatan audit asal ("Paper 44px") tersilap.
3. Garis pemisah antara lede dan "Penjelasan rasmi" wujud dalam kod (disahkan dalam tangkapan skrin).

---

## 4. Tentang Kami (`/about-us/`)

### ✅ Diselesaikan
1. **Seksyen "About"** ditambah di bawah hero dengan susun atur Paper:
   - Pill "Tentang kami" dan lead 24/32 (lebar 700).
   - Tiga kad tinggi 340: kad hitam (semakan berasaskan sumber rasmi), kad kelabu dengan pill "Bersama lebih 20 agensi", dan kad "20+ Agensi rakan" dengan bar Palsu/Penjelasan/Waspada yang dikira daripada data artikel.
   - Baris fakta: 275 juta+, 1,016, 200 ribu, 20+.

   Teks templat tenis tidak disalin.
2. **"Bagaimana kami menyemak fakta"** dibuang dari halaman. Isu tajuk 27.36px weight 600 turut hilang bersamanya.
3. **Mobile:**
   - Lead "Tentang kami" tidak lagi meninggalkan ruang kosong ~560px.
   - Kad kecil "Empat fungsi" tidak lagi runtuh ke 48px dan bertindih.

### ℹ️ Sengaja berbeza
4. "Facts" di bawah footer dalam Paper (baris fakta pendua) tidak dilaksanakan; ia kelihatan seperti elemen tertinggal di luar halaman.
5. Hero: Paper "Folow us" (Inggeris, salah ejaan); kod "Ikuti kami". Paper perlu dikemas.

### ✅ Sepadan
- Tajuk "Empat fungsi utama kami" dan "Berita dan Galeri" 56px Medium, sama dengan Paper.
- Hero dengan pautan sosial, Empat fungsi, Berita dan Galeri, Logo Sebenarnya.my, anchor `#berita-galeri`.

---

## Nota
- Halaman `/logo/` tidak dibandingkan (tiada artboard Logo berasingan dalam Paper › Artwork).
- Butiran nilai token untuk setiap perubahan ada dalam `docs/design-system-handoff.md`.

---

# Laporan kerja malam — 21 November 2026

Ditulis untuk dibaca pagi ini. Semua commit di branch `endahbyu`, sudah di-push. `npm run build` lulus setiap kali.

## 1. Keputusan `design.md` diterapkan (kod + Paper + dokumen)

| Keputusan | Kod | Paper | Commit |
|---|---|---|---|
| Manrope sahaja | Inter & `--font-ui` dibuang dari `layout.js`, `tokens.css`, `ui.css`, `global.css` | Token `--font-ui` kini alias `--font-sans` (Manrope) | `f0884b3` |
| Display 48+ weight 400 | Token baharu `--font-weight-display`; dipakai 7 tajuk display | Token sama dicipta; 13 tajuk display (Artwork + Design system) | `f0884b3` |
| Angka statistik 400 | Home (275 juta+ …) dan Tentang Kami | 12 nod angka (kapsyen kekal Light) | `f0884b3` |

Juga dalam Paper: "Folow us" → "Ikuti kami" pada artboard Tentang Kami.

**Kesan yang anda akan nampak:** tajuk besar lebih ringan (editorial); semua butang/input kini Manrope.

## 2. Fasa 5 — Pembersihan CSS (`829cd5f`)

Setiap langkah disahkan dengan **perbandingan tangkapan skrin piksel demi piksel** (Home, Artikel, detail, Tentang Kami × desktop 1624 + mobile 390) sebelum vs selepas.

- **~700 baris CSS mati dibuang** (kad/posts lama, pill-form, bento, layout Artikel lama, seksyen 6 langkah, `.btn`). Hasil: 0 piksel berubah.
- **Hex keras → token semantik.** Yang tinggal hanya warna jenama platform pada kad story (Instagram/X/TikTok…) dan `#000` dalam `mask-image` (alpha sahaja).
- **Alias lama `:root`** (`--text`, `--white`, `--red`, `--dark`…) dibuang; semua guna token semantik.
- **Token overlay media baharu:** `--gradient-scrim-media`, `-media-wide`, `-bottom`, `-bottom-short`, `-top`.
- **Berat font:** semua melalui token; **tiada 700 lagi**. Asas `h1–h6` = 500.
- **Radius:** semua melalui `--radius-*`.
- **Tiada `rem` lagi.** Saiz luar skala dipetakan ke skala (15→16, 11→12, 27→28 …). Pengecualian: monogram agensi 9px.
- **ClaimForm** kini guna komponen `Button` (dulu `.btn` yang bertukar **merah** bila hover — melanggar peraturan).
- Ralat borang = `--color-destructive`; fokus input AIFA = cincin violet (dulu merah); hover pautan AIFA = `--color-link`.

**Satu-satunya perubahan visual yang disengajakan:** judul & ringkasan kad media sosial (judul 700→500, saiz 27→28 / 15→16, `text-wrap: balance` supaya tiada perkataan yatim).

## 3. Penyelarasan butiran dengan `design.md` (`381c6f1`)

Audit automatik (skrip Playwright) memeriksa setiap elemen di 4 halaman × 2 saiz: butang pill 44 + label 16/500, tiada 700, tiada teks < 12px, tiada merah pada aksi, tiada bayang kad, tiada glyph ↗ →, tiada tajuk UPPERCASE, font Manrope. **Semua lulus.** Pembetulan:
- Ikon dalam butang 16px (butang bulat ‹ ›, Kongsi, Empat fungsi, "Semua artikel") — dulu 20px.
- Trek meter "Empat fungsi" 4px (dulu 3px; `design.md`: 4–8px).
- Teks footer = body: graphite, Regular, line-height 1.55 (dulu hitam Medium 1.33).
- Ticker logo "Kenyataan rasmi" berhenti bila `prefers-reduced-motion`.

## 4. Perlu keputusan anda (konflik Paper ↔ `design.md`)

1. **Kad media sosial bergradient warna platform.** `design.md`: "tiada gradient pada kad". Paper: ada (cahaya Instagram ungu, TikTok hijau…). **Dibiarkan ikut Paper** — pilih: kekal, atau tukar ke hitam polos.
2. **Tanya AIFA merah** (togol, avatar, bubble pengguna, butang hantar). `design.md` §8 #4: biarkan buat masa ini.
3. **Tarikh/meta** dalam kad artikel Regular 400; `design.md` meta = 500. Dibiarkan ikut Paper.
4. Paper masih ada **template lain** (tenis "Horizon", Spintip, Krea…) dengan Inter di halaman lain — bukan reka bentuk Sebenarnya, tidak disentuh. Blok tenis di Tentang Kami dalam Paper juga masih perlu diganti teks sebenar.

## 5. Lanjutan `plan.md` (selepas `design.md`)

| Item plan | Hasil | Commit |
|---|---|---|
| Fasa 1 · Token motion | `--duration-fast/base/slow/page`, `--ease-out`, `--ease-in-out`, `--ease-emphasized`, `--ease-page` dalam `tokens.css`; semua `cubic-bezier` keras & `--ease`/`--slide` lama diganti | `576d3c9` |
| Fasa 1 · Token overlay media | `--gradient-scrim-*` (5 token) | `829cd5f` |
| Fasa 9 · `npm run lint:ds` | Skrip Node tanpa dependency, 9 peraturan. Diuji dengan fail "pelanggar" sementara — semua peraturan menangkapnya. Kini **bersih** | `576d3c9` |
| Fasa 6 · Kontras | Imbasan runtime semua teks × 4 halaman: **semua lulus WCAG AA** | `576d3c9` |
| Fasa 6 · Fokus keyboard | Tab melalui setiap halaman; satu kawalan tiada cincin (carousel media sosial) — dibetulkan | `576d3c9` |
| Fasa 6 · Reduced motion | Autoplay hero & semakan fakta, ticker logo, transisi halaman — semua berhenti | `381c6f1` |

**Pembetulan aksesibiliti yang anda akan nampak:**
- **Tanya AIFA** sedikit lebih gelap (`#C8211C`). Masih merah (ikut keputusan), tetapi teks putih kini 5.56:1 — dulu 4.30:1, gagal AA.
- Nombor "/01" kad Empat fungsi sedikit lebih gelap.

## 6. Nota teknikal

- Dev server anda di port 3000 berhenti sekitar 01:30 (terminal ditutup / laptop tidur). Untuk semakan, saya jalankan server sementara di **port 3100** dan sudah dihentikan. Jalankan `npm run dev` seperti biasa.
- Semua semakan visual guna Playwright + Chrome sistem (tiada pemasangan baharu dalam projek).

## 7. Belum dibuat (perlu reka bentuk Paper atau keputusan anda)

- Fasa 2: Button kecil / "on media", icon button bulat, field/textarea/select, pagination dots & avatar sebagai komponen kongsi, katalog `/design-system`.
- Fasa 3: Band (Closing/Announcement), Timeline, logo 7 agensi baharu (perlu fail logo), item "Hubungi kami" (perlu page `/contact/`).
- Fasa 7–8 (CMS, extension, shadcn): menunggu keputusan stack & cara kongsi pakej.
- PR `endahbyu` → `main`: menunggu arahan anda.
