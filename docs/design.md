# DESIGN.md — Sebenarnya.my

Arah rasa (taste) dan bahasa visual. Dokumen ini menjawab **"seperti apa rasanya"**; angka teknis (token, ukuran komponen) ada di [`design-system-handoff.md`](design-system-handoff.md).

Referensi rasa: **elevenlabs.io** — diambil *bahasa visualnya saja* (ketenangan, material, cara warna dipakai, ritme ruang). Layout, struktur halaman, ilustrasi, dan kontennya **tidak** disalin.

---

## 1. Identity

**Produknya:** portal semakan fakta rasmi Malaysia. Orang datang dalam keadaan ragu — baru menerima mesej tular — dan pergi dengan jawapan yang jelas: *Palsu, Waspada, Makluman, atau Penjelasan*, beserta sumber rasminya.

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
| Fokus / pautan | Violet spark `#3A46F5` | Cincin fokus, pautan teks dalam artikel. Kecil dan jarang. |
| Jenama | Merah Kebenaran `#E8302A` | Logo dan elemen identiti (sfera/atmosfera). Bukan untuk butang, nav, atau ralat biasa. |
| Verdict — Palsu | titik `#E8302A`, teks `#C8211C` | Hanya pada label verdict. |
| Verdict — Waspada | titik `#E08A00`, teks `#A35A00` | Hanya pada label verdict. |
| Verdict — Makluman | titik `#3A46F5`, teks `#2F5FD0` | Hanya pada label verdict. |
| Verdict — Penjelasan | titik `#1FA463`, teks `#137A49` | Hanya pada label verdict. |

**Peraturan rasa:**
- Satu "percikan" warna per pandangan sudah cukup. Jika satu skrin ada lebih dari dua warna kromatik di luar verdict, ada yang salah.
- Warna verdict **sentiasa** bersama perkataannya (dot + PERKATAAN) — warna tidak pernah bekerja sendirian.
- Foto boleh berwarna penuh; antaramuka di sekelilingnya tetap akromatik supaya foto yang "bercakap".
- Gradient hanya pada satu tempat: sfera / medan atmosfera jenama (lembut, kabur, seperti cahaya). Tidak pada butang, kad, atau latar seksyen.

---

## 3. Typography

**Satu keluarga font: Manrope.** Satu suara dari tajuk hero hingga label butang dan angka. Kontras dicipta melalui **saiz dan warna**, bukan dengan menukar font atau menebalkan huruf.

> Nota: Inter dan `--font-ui` sudah dibuang dari kod (21 Nov 2026). Manrope satu-satunya keluarga.

| Peranan | Saiz / line-height | Weight | Nota |
|---|---|---|---|
| Display | 48–56 / 1.1 | **400** | Tajuk hero. Tracking −0.02em. Besar tetapi ringan — rasa "editorial". |
| Heading | 24–36 / 1.2 | 500 | Tajuk seksyen dan kad. |
| Angka besar (statistik) | 40–72 / 1.0 | **400** | Weight normal, bukan bold. Unit (juta+, ribu) separuh saiz, sejajar baseline. Angka tabular. |
| Body | 16–18 / 1.55 | 400 | Graphite. Lebar baris maks ±68 aksara. |
| Label (butang, nav, chip) | 16 / 24 | 500 | Sentence case. |
| Eyebrow / meta | 13–14 / 1.4 | 500 | Smoke. Verdict: 13 semibold UPPERCASE, tracking +0.04em. |

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
- Semua butang **pill**, tinggi 44px, label 16 Medium.
- **Filled** (tinta hitam, teks putih) — satu sahaja per skrin, untuk aksi paling penting.
- **Outline** (kanvas + border 1px) dan **ghost** (tanpa border) untuk aksi sekunder.
- Atas foto: pill putih/kanvas dengan teks tinta.
- Ikon Lucide 16px, garis 1.75px, di hujung label (anak panah) atau di awal (muat turun, kongsi).
- Tekan: scale 0.96–0.98. Hover: nada sedikit cerah. Fokus: cincin violet 2px.

### Kawalan lain
- Segmented control / tab: bekas pill kanvas dengan border nipis; item terpilih "naik" ke putih dengan border halus — tiada warna.
- Carian: pill besar, border kuat, ikon kiri, butang filled di kanan.
- Chip: pill 44px latar taupe; terpilih = tinta hitam.

---

## 5. Density

**Lapang — rendah ketumpatan, tinggi keyakinan.**

- Ruang kosong ialah bahan utama. Seksyen dipisah oleh 96px (64 tablet, 48 telefon); tepi halaman 96px pada desktop.
- Satu idea per seksyen: satu tajuk, satu baris kandungan, satu aksi. Jangan tumpuk tiga grid dalam satu skrin.
- Dalam kumpulan rapat (8–16px), antara kumpulan sekurang-kurangnya 2× lebih jauh. Ruang yang membina struktur, bukan garis.
- Teks kecil (13–14px) boleh padat; tajuk dan angka besar mesti diberi ruang bernafas di sekeliling.
- Kad dalam grid: 3–4 sebaris pada desktop, sentiasa sama tinggi. Tiada kad mini 6 sebaris.
- Bila ragu: buang satu elemen, bukan kecilkan semua.

---

## 6. Dials

Skala 1–3 (1 = rendah, 3 = tinggi).

| Dial | Nilai | Maksud |
|---|---|---|
| **ENERGY** | **1** | Tenang. Akromatik, tajuk ringan, satu percikan warna. Tiada ilustrasi ramai, tiada sticker, tiada emoji. Energi datang hanya daripada foto dan verdict. |
| **RHYTHM** | **2** | Teratur tetapi tidak membosankan. Grid yang konsisten, diselang dengan satu elemen besar per seksyen (kad utama, angka besar, carousel full-bleed). Tajuk kiri / kandungan kanan diulang sebagai motif. |
| **MOTION** | **2** | Bergerak dengan tujuan. Carousel dan baris kad meluncur perlahan (autoplay, berhenti bila hover/fokus), flip kad, zoom foto halus. Easing ease-out kuat, 150–600ms. Tiada parallax, tiada animasi masuk setiap elemen, dan `prefers-reduced-motion` mematikan semua gerakan autoplay. |

---

## 7. Do / Don't

| Do | Don't |
|---|---|
| Biarkan foto dan verdict jadi satu-satunya warna | Butang merah, latar seksyen berwarna, gradient pada kad |
| Tajuk besar weight 400–500 | Bold 700 untuk "menarik perhatian" |
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
| 1 | Keluarga font | **Manrope sahaja.** Buang Inter / `--font-ui`. | ✅ Siap: kod, handoff, Paper (`--font-ui` dalam Paper kini alias `--font-sans`). |
| 2 | Display weight | **400** untuk tajuk display (hero, tajuk besar). Heading kekal 500. | ✅ Siap: kod, handoff, Paper (token `--font-weight-display` dicipta dalam Paper). |
| 3 | Angka besar | **400** untuk semua angka statistik. | ✅ Siap: kod, handoff, Paper (angka statistik guna `--font-weight-display`; kapsyen kekal Light). |
| 4 | Tanya AIFA | **Biarkan merah buat masa ini** (belum ada idea). | Kekal terbuka di `plan.md`. |
| 5 | Chart & meter | Garis panduan §4 jadi titik mula bila diperlukan (cth. dashboard CMS). | Belum ada dalam sistem. |

Bila 1–3 dilaksana, kemas kini serentak: `app/tokens.css`, Paper (artboard 03 · Typography scale + semua artboard), `design-system-handoff.md` §2.3, dan kod.
