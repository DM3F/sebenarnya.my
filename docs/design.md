# DESIGN.md — Sebenarnya.my

Arah rasa (taste) dan bahasa visual. Dokumen ini menjawab **"seperti apa rasanya"**; angka teknis (token, ukuran komponen) ada di [`design-system-rules.md`](design-system-rules.md) dan `app/tokens.css`. Jika dokumen ini bercanggah dengan kod, **kod yang betul**. Peta dokumen: [`README.md`](README.md).

Referensi rasa: **elevenlabs.io** — diambil *bahasa visualnya saja* (ketenangan, material, cara warna dipakai, ritme ruang). Layout, struktur halaman, ilustrasi, dan kontennya **tidak** disalin.

---

## 1. Identity

**Produknya:** portal semakan fakta rasmi Malaysia. Orang datang dalam keadaan ragu — baru menerima mesej tular — dan pergi dengan jawapan yang jelas: *Palsu, Makluman atau Benar*, beserta sumber rasminya.

**Rasanya:** tenang, yakin, editorial. Seperti majalah yang dicetak di kertas krem hangat, bukan dashboard kerajaan dan bukan media sosial yang ribut. Antaramuka menyingkir supaya **dakwaan, verdict, dan sumber rasmi** yang bercakap.

- **Tenang, bukan dingin.** Putih hangat (eggshell), hitam tinta, kelabu batu. Tiada biru korporat, tiada gradient pelangi.
- **Yakin tanpa menjerit.** Tajuk besar tetapi ringan; tiada huruf tebal untuk "meyakinkan". Kepastian datang daripada kejelasan, bukan berat huruf.
- **Warna = makna.** Warna hanya muncul bila ia membawa maklumat (verdict) atau identiti (logo, sfera). Selebihnya akromatik.
- **Manusiawi.** Foto sebenar, bahasa Melayu yang biasa, sudut membulat lembut. Rasmi tetapi tidak birokratik.

Kata kunci: *warm paper · ink · quiet authority · one spark of colour*.

---

## 2. Palette

Hampir semuanya akromatik hangat (±97%). Warna kromatik dikunci pada peranan tertentu.

### Neutral (kanvas)

| Peranan | Warna | Bila dipakai |
|---|---|---|
| Kanvas | `#FDFCFC` eggshell | Latar halaman, latar kawalan (carian, chip, butang outline). Bukan putih tulen — sedikit hangat. |
| Permukaan terangkat | `#FFFFFF` | Hanya untuk sesuatu yang perlu "naik" dari kanvas: panel terpilih dalam segmented control, dropdown. |
| Panggung (stage) | `#F5F3F1` warm taupe | Band, latar kad artikel, kawasan yang membingkai kandungan. Elevation datang dari **nada**, bukan bayang. |
| Inset / pembahagi | `#EBE8E4` stone | Garis halus, isian disabled, thumbnail kosong, trek progress. |
| Tepi | `#D7D2CC` | Border pill dan kad (0.5–1px). |
| Tepi kuat | `#878179` | Border field input (kontras 3:1). |
| Teks redup | `#6F6A63` smoke | Eyebrow, meta, tarikh, placeholder, ikon. |
| Teks badan kuat | `#44403B` graphite | Perenggan panjang, lede. |
| Tinta | `#000000` | Tajuk, label, butang utama. |
| Hiasan sahaja | `#A59F97` ash | Garis/ornamen. **Jangan untuk teks.** |

### Kromatik (dikunci)

| Peranan | Warna | Bila dipakai |
|---|---|---|
| Aksi utama | Tinta `#000` | Satu butang terisi per skrin (cth. "Salur Kepada Kami", "Semak"). Aksi **tidak pernah merah**. |
| Fokus / pautan | Tinta `#000` (atas gelap / foto: putih) | Cincin fokus 2px (offset 2) dan sempadan medan semasa fokus; pautan teks = tinta + garis bawah. **Tiada biru/violet** pada fokus atau pautan. |
| Jenama | Merah Kebenaran `#E8302A` | Logo dan elemen identiti (sfera/atmosfera). Bukan untuk butang, nav, atau ralat biasa. |
| Verdict — Palsu | titik `#E8302A`, teks `#C8211C` | Hanya pada label verdict. |
| Verdict — Makluman | titik `#3A46F5`, teks `#2F5FD0` | Hanya pada label verdict. |
| Verdict — Benar | titik `#1FA463`, teks `#137A49` | Hanya pada label verdict. |

**Peraturan rasa:**
- Satu "percikan" warna per pandangan sudah cukup. Jika satu skrin ada lebih dari dua warna kromatik di luar verdict, ada yang salah.
- Warna verdict **sentiasa** bersama perkataannya (dot + PERKATAAN) — warna tidak pernah bekerja sendirian.
- Foto boleh berwarna penuh; antaramuka di sekelilingnya tetap akromatik supaya foto yang "bercakap".
- Gradient hanya pada satu tempat: sfera / medan atmosfera jenama (lembut, kabur, seperti cahaya). Tidak pada butang, kad, atau latar seksyen.

---

## 3. Typography

**Satu keluarga font: Manrope.** Satu suara dari tajuk hero hingga label butang dan angka. Kontras dicipta melalui **saiz dan warna**, bukan dengan menukar font atau menebalkan huruf.

> Nota: Inter dan `--font-ui` sudah dibuang dari kod (21 Nov 2026). Manrope satu-satunya keluarga.

| Peranan | Saiz (375 → 1280px) / line-height | Weight | Dipakai untuk |
|---|---|---|---|
| Display | 32 → 48 fluid / 1.2 | **500** | H1 halaman sahaja (hero, detail artikel, Tentang Kami). **48px ialah saiz paling besar di laman.** |
| Section | 28 → 36 fluid / 1.2 | 500 | H2 seksyen, tajuk slaid carousel dan banner WSIS: semua sama weight dengan Display. |
| Heading | 20 → 24 fluid / 1.2 | 500 | Tajuk ciri / sub-tajuk dalam seksyen, tajuk kad besar, tajuk pop-up. |
| Title | 18 → 20 fluid / 1.2 | 500 | Tajuk kad. |
| Angka (statistik) | 36 → 48 fluid / 1.2 | **400** | Semua angka statistik. Unit (juta+, ribu, jam) 0.42em. Angka tabular. |
| Lead | 16 / 1.5 | 400 | Perenggan pengenalan di bawah tajuk. Sama saiz dengan Body; dibezakan dengan warna Graphite (bukan tinta) dan ruang. |
| Article | 16 → 18 fluid / 1.5 | 400 | Body dalam lajur bacaan artikel sahaja. |
| Body | 16 / 1.5 | 400 | Teks badan (`body` = 16). Graphite. Lebar baris maks ±68 aksara. |
| Label (butang, nav, chip) | 16 / 1.5 (kecil: 14) | 500 | Sentence case. |
| Small / meta | 14 / 1.5 · kapsyen 12 / 1.5 | 400–500 | Tarikh, meta, label kecil. Smoke. |
| Eyebrow | 13 / 1.5 | 500 (verdict 600) | UPPERCASE, tracking +0.04em (satu-satunya tracking bukan 0): verdict, eyebrow, heading footer. |

Token peranan ada dalam `app/tokens.css` (`--text-display`, `--text-heading-lg` = Section, `--text-heading`, `--text-title`, `--text-intro`, `--text-article` (body artikel sahaja, 16 → 18), `--text-body` (16, termasuk Lead), `--text-stat` = Angka … + `--line-height`). Saiz besar kini **fluid** dengan `clamp()` antara 375px dan 1280px, jadi setiap saiz ialah satu julat yang licin (cth. Display 32 → 48), tanpa media query. Blok "Type roles" di hujung `app/global.css` memetakan setiap kelas kepada peranannya. Jadual penuh: `docs/design-system-rules.md` › Type roles.

**Font weight:** semua tajuk 500 (Display hero, tajuk seksyen, heading, title) supaya jelas berbeza daripada body 400; angka statistik 400; 600 hanya untuk verdict.

**Line-height & tracking:** semua tajuk 1.2, semua teks lain 1.5. Tracking 0 di mana-mana (Manrope sudah seimbang); kecuali label UPPERCASE kecil (+0.04em).

**Peraturan rasa:**
- Tiada weight 700+ di mana-mana. Penekanan = saiz, warna tinta vs smoke, atau ruang kosong.
- Tajuk pendek, dipecah sengaja kepada 2 baris yang seimbang.
- Huruf besar (UPPERCASE) hanya untuk label kecil (verdict, eyebrow footer) — tidak untuk tajuk.
- Angka statistik ialah "tajuk" bahagian itu: biarkan ia besar, ringan, dan bernafas; kapsyen di bawahnya kecil dan redup.

---

## 4. Komponen

Bahasa bentuk: **pill untuk apa yang ditekan, kotak membulat lembut untuk apa yang dibaca.** Garis rambut, bukan bayang.

### Card
- Sudut 20px (kad besar 24px). Latar warm taupe di atas kanvas eggshell — kad "duduk" di atas kertas, tidak terapung.
- Tiada bayang pada keadaan rehat. Jika perlu pemisahan, guna border 0.5–1px `#D7D2CC` atau lapisan nada.
- Media dalam kad: sudut 12px (konsentrik dengan padding 8px kad).
- Foto boleh full-bleed dengan scrim gelap lembut di bahagian teks; teks putih atas foto mesti lulus 4.5:1.
- Hover: foto zoom halus (1.03), bukan kad melompat atau bayang membesar.

### Chart
- Monokrom secara lalai: garis/bar tinta atau graphite atas kanvas, grid garis rambut `#EBE8E4`, label 13–14 smoke.
- Satu siri sahaja boleh berwarna — dan warnanya mesti bermakna (cth. verdict). Selebihnya kelabu.
- Tiada 3D, tiada gradient isian, tiada legenda berwarna-warni. Label terus pada garis/bar (direct labelling) lebih baik daripada legenda.
- Angka dalam chart guna angka tabular Manrope, weight 400.

### Meter (progress / skor / kiraan)
- Trek: pill nipis (4–8px) `#EBE8E4`; isian: tinta `#000`.
- Untuk status (cth. semakan dalam proses) boleh guna warna verdict pada isian — hanya jika ia membawa makna.
- Nilai di sebelah meter: angka besar weight 400 + unit kecil; tiada peratusan berganda.
- Meter autoplay (cth. titik carousel) mengisi secara linear; berhenti bila dijeda.

### Butang
- Semua butang **pill**, label 16 Medium. Tinggi ikut skala kawalan fluid: `sm` 32 → 36 · `md` 40 → 44 (lalai) · `lg` 44 → 48; sasaran sentuh sentiasa 44.
- **Filled** (tinta hitam, teks putih) — satu sahaja per skrin, untuk aksi paling penting.
- **Outline** (kanvas + border 1px) dan **ghost** (tanpa border) untuk aksi sekunder.
- Atas foto: pill putih/kanvas dengan teks tinta.
- Ikon Lucide 16px, garis 1.75px, di hujung label (anak panah) atau di awal (muat turun, kongsi).
- Tekan: scale 0.97 (`--press-scale`). Hover: nada sedikit cerah. Fokus: cincin tinta 2px, offset 2px (putih atas foto/gelap). Tiada biru atau violet.

### Kawalan lain
- Segmented control / tab: bekas pill kanvas dengan border nipis; item terpilih "naik" ke putih dengan border halus — tiada warna.
- Carian: pill besar, border kuat, ikon kiri, butang filled di kanan.
- Chip: pill latar taupe, tinggi sama dengan butang (skala `sm` · `md` · `lg`); terpilih = tinta hitam.

---

## 5. Density

**Lapang — rendah ketumpatan, tinggi keyakinan.**

- Ruang kosong ialah bahan utama. Seksyen dipisah oleh 64 → 120px (fluid, telefon → desktop), kira-kira 3× jarak tajuk → kandungan (24 → 40); tepi halaman 96px pada desktop.
- Satu idea per seksyen: satu tajuk, satu baris kandungan, satu aksi. Jangan tumpuk tiga grid dalam satu skrin.
- Dalam kumpulan rapat (8–16px), antara kumpulan sekurang-kurangnya 2× lebih jauh. Ruang yang membina struktur, bukan garis.
- Teks kecil (13–14px) boleh padat; tajuk dan angka besar mesti diberi ruang bernafas di sekeliling.
- Kad dalam grid: 3–4 sebaris pada desktop, sentiasa sama tinggi. Tiada kad mini 6 sebaris.
- **Jarak ikut hubungan, bukan nombor:** dalam satu kumpulan teks 8, antara kumpulan dalam kad 16, antara kad 16 → 24, tajuk seksyen → kandungan 24 → 40, antara seksyen 64 → 120.
- **Saiz kad menentukan padding + radius serentak:** kecil 16/20, biasa 24/20 (default), besar 32→24/24 (feature, modal). Gap dalam kad tidak pernah lebih besar daripada padding kad. Jadual penuh: `docs/design-system-rules.md` › Spacing & radius roles.
- Bila ragu: buang satu elemen, bukan kecilkan semua.
- **Empat breakpoint sahaja:** 1280 · 1100 · 900 · 600. Lebar baca perenggan maksimum 68ch; kepala seksyen berpusat 720px.

---

## 6. Dials

Skala 1–3 (1 = rendah, 3 = tinggi).

| Dial | Nilai | Maksud |
|---|---|---|
| **ENERGY** | **1** | Tenang. Akromatik, tajuk ringan, satu percikan warna. Tiada ilustrasi ramai, tiada sticker, tiada emoji. Energi datang hanya daripada foto dan verdict. |
| **RHYTHM** | **2** | Teratur tetapi tidak membosankan. Grid yang konsisten, diselang dengan satu elemen besar per seksyen (kad utama, angka besar, carousel full-bleed). Tajuk kiri / kandungan kanan diulang sebagai motif. |
| **MOTION** | **2** | Bergerak dengan tujuan. Carousel dan baris kad meluncur perlahan (autoplay, berhenti bila hover/fokus), flip kad, zoom foto halus. Easing ease-out kuat, 150–600ms. **Satu entrance per halaman, semasa dimuat sahaja** (`components/PageEnter.js`): kepala halaman masuk berturutan 100ms (H1 hero naik baris demi baris dari topeng 600ms; lede, carian, tajuk artikel: opacity + blur 4px + naik 12px, 300ms). Tiada reveal semasa skrol: seksyen di bawah skrin pertama sudah sedia ada, jadi tiada kandungan tersembunyi dan tiada pendengar skrol. Pertukaran halaman = crossfade 250ms sahaja (aksi paling kerap). Menu dan modal: satu gaya masing-masing (menu 150ms, modal 250ms masuk dan keluar). Pengecualian: pop-in folder logo (koreografi komponen sendiri). Tiada parallax, dan `prefers-reduced-motion` mematikan semua gerakan autoplay. |

---

## 7. Do / Don't

| Do | Don't |
|---|---|
| Biarkan foto dan verdict jadi satu-satunya warna | Butang merah, latar seksyen berwarna, gradient pada kad |
| Tajuk weight 500, angka besar 400 | Bold 700 untuk "menarik perhatian" |
| Angka statistik besar dan ringan | Angka tebal dalam kotak berwarna |
| Pill untuk semua aksi | Butang segi empat tajam bercampur pill |
| Elevation melalui nada (eggshell → taupe → stone) | Bayang berlapis pada setiap kad |
| Satu butang filled per skrin | Tiga butang hitam bersebelahan |
| Ruang kosong sebagai pemisah | Garis pembahagi di antara setiap blok |
| Ikon Lucide garis nipis | Emoji, glyph teks (↗ →), set ikon bercampur |

---

## 8. Keputusan & jurang dengan implementasi sekarang

Keputusan (21 Nov 2026):

| # | Perkara | Keputusan | Status implementasi |
|---|---|---|---|
| 1 | Keluarga font | **Manrope sahaja.** Buang Inter / `--font-ui`. | ✅ Siap. |
| 2 | Display weight | Semua tajuk **500** (termasuk display); body dan angka statistik 400. | ✅ Siap. |
| 3 | Angka besar | **400** untuk semua angka statistik. | ✅ Siap (`--font-weight-display`). Tiada weight 300 lagi. |
| 4 | Tanya AIFA | **Biarkan merah buat masa ini** (belum ada idea). | Kekal terbuka di `plan.md`. |
| 5 | Chart & meter | Garis panduan §4 jadi titik mula bila diperlukan (cth. dashboard CMS). | Belum ada dalam sistem. |

Setiap keputusan baharu: kemas kini serentak `app/tokens.css`, `design-system-rules.md` dan fail ini.
