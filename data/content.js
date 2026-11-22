// All page content lives here, so sections can be edited without touching markup.

import { withBase } from '@/lib/basePath';

const post = (file) => withBase(`/images/posts/${file}`);

const agency = {
  kpm: 'KPM (Kementerian Pendidikan Malaysia)',
  pdrm: 'PDRM (Polis Diraja Malaysia)',
  jbpm: 'JBPM (Jabatan Bomba dan Penyelamat Malaysia)',
  jpj: 'JPJ (Jabatan Pengangkutan Jalan Malaysia)',
  mcmc: 'MCMC (Suruhanjaya Komunikasi dan Multimedia Malaysia)',
  kkmm: 'KKMM (Kementerian Komunikasi dan Multimedia Malaysia)',
  kpdn: 'KPDN (Kementerian Perdagangan Dalam Negeri)',
  met: 'METMalaysia (Jabatan Meteorologi Malaysia)',
  jpa: 'JPA (Jabatan Perkhidmatan Awam)',
  mof: 'MOF (Kementerian Kewangan Malaysia)',
  jais: 'JAIS (Jabatan Agama Islam Selangor)',
  pahang: 'Kesultanan Pahang',
  pm: 'Pejabat Perdana Menteri',
  jpm: 'JPM (Jabatan Perdana Menteri, Hal Ehwal Agama)',
  caltex: 'Caltex Malaysia',
  ktmb: 'KTMB (Keretapi Tanah Melayu Berhad)',
  jpnpp: 'JPNPP (Jabatan Pendidikan Negeri Pulau Pinang)',
  jpns: 'JPN Selangor (Jabatan Pendidikan Negeri Selangor)',
  jpwpkl: 'JPWPKL (Jabatan Pendidikan WP Kuala Lumpur)',
};

/* Header navigation.
   An item with `children` renders as a dropdown (the parent has no page of its own). */
export const navLinks = [
  { label: 'Utama', href: '/' },
  { label: 'Artikel', href: '/article/' },
  {
    label: 'Tentang Kami',
    children: [
      { label: 'Tentang kami', href: '/about-us/' },
      { label: 'Berita dan Galeri', href: '/about-us/#berita-galeri' },
      { label: 'Logo', href: '/about-us/#logo' }, // Logo section on Tentang Kami (no page of its own)
    ],
  },
];

/* The header's single filled action (also listed in the compact menu on phones) */
export const claimLink = { label: 'Salur Kepada Kami', href: '/submit-claim/' };

/* Stories carousel (latest social media posts) */
// Five cards, one per platform (components/Stories.js, elastic gallery).
// `platform` = id in `socialLinks` (icon + label); `href` = the post or profile;
// `image` + `alt` = the cover; `date` is optional (omit for a profile link).
// Pop-up preview (components/SocialPeek.js): `video` = local clip, else `embed` = the platform's
// official embed URL (loaded only when the pop-up opens), else the cover image.
export const stories = [
  {
    platform: 'instagram',
    title: 'Sebelum kongsi, tanya AIFA dahulu',
    summary: 'WhatsApp AIFA di 03-8688 7997 atau layari Sebenarnya.my. AIFA akan semak dan jawab guna sumber yang sahih.',
    date: '7 Ogo 2025',
    href: 'https://www.instagram.com/reel/DNCUauizeUu/',
    image: withBase('/images/stories/instagram-aifa.jpg'),
    video: withBase('/images/stories/instagram-aifa.mp4'), // sneak-peek clip (pop-up)
    alt: 'Video Instagram: tanya AIFA sebelum berkongsi',
  },
  {
    platform: 'threads',
    title: 'Selamat Hari Malaysia!',
    summary: 'Bersama kita raikan perpaduan, pelihara kepercayaan dan utamakan kebenaran. Semak dahulu di portal Sebenarnya.my sebelum kongsi.',
    date: '15 Sep 2026',
    href: 'https://www.threads.com/@sebenarnya.myofficial/post/DdTV7PQlCdu',
    embed: 'https://www.threads.com/@sebenarnya.myofficial/post/DdTV7PQlCdu/embed',
    image: withBase('/images/about/galeri-1.jpg'),
    alt: 'Dua orang menyemak mesej di telefon bersama-sama',
  },
  {
    platform: 'x',
    title: 'Cara semak maklumat dengan AIFA',
    summary: 'Terima kandungan yang meragukan? Jangan panik, jangan sebarkan. Semak melalui AIFA di portal Sebenarnya.my atau imbas kod QR.',
    date: '12 Jun 2025',
    href: 'https://x.com/sebenarnyaMY/status/1933107075279966676',
    embed: 'https://platform.twitter.com/embed/Tweet.html?id=1933107075279966676&dnt=true&lang=ms',
    image: withBase('/images/stories/x-aifa.jpg'),
    alt: 'Infografik empat langkah semak maklumat dengan AIFA melalui WhatsApp 03-8688 7997',
  },
  {
    platform: 'tiktok',
    title: 'Tonton di TikTok Sebenarnya.my',
    summary: 'Video terkini daripada @sebenarnyamy. Tidak pasti, jangan kongsi.',
    date: '14 Sep 2025',
    href: 'https://www.tiktok.com/@sebenarnyamy/video/7549728480137596167',
    embed: 'https://www.tiktok.com/embed/v2/7549728480137596167',
    image: withBase('/images/about/galeri-4.jpg'),
    alt: 'Lelaki tersenyum sambil memegang telefon',
  },
  {
    platform: 'facebook',
    title: 'Ikuti Sebenarnya.my di Facebook',
    summary: 'Semakan fakta, makluman rasmi dan kempen kesedaran setiap hari. Semak dahulu sebelum kongsi.',
    href: 'https://www.facebook.com/share/1HB1gmU1o8/?mibextid=wwXIfr',
    image: withBase('/images/about/berita-warga-emas.jpg'),
    alt: 'Warga emas belajar menyemak maklumat di tablet bersama anak muda',
  },
];

/* Social media (footer links + story card icons) */
// `href` = profile page; `icon` = Simple Icons path (24x24 viewBox)
export const socialLinks = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1HB1gmU1o8/?mibextid=wwXIfr',
    icon: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/sebenarnya.myofficial?mdxt=MTUyYjZxMW85b3A4NA==',
    icon: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
  },
  {
    id: 'threads',
    label: 'Threads',
    href: 'https://www.threads.com/@sebenarnya.myofficial?igshid=NTc4MTIwNjQ2YQ==',
    icon: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z',
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/sebenarnyamy?s=11&t=q1rdZJ8gebZLKyWQ4h2kYA',
    icon: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@sebenarnyamy?_r=1&_t=ZS-9BKgyXbbDaJ',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
];

/* Footer */
export const footerColumns = [
  {
    title: 'Semak dan Lapor',
    links: [
      { label: 'Artikel', href: '/article/' },
      { label: 'AIFA', href: '/aifa/' },
      { label: 'Salur Kepada Kami', href: '/submit-claim/' },
    ],
  },

  {
    title: 'Sebenarnya.my',
    links: [
      { label: 'Tentang Kami', href: '/about-us/' },
      { label: 'Berita dan Galeri', href: '/about-us/#berita-galeri' },
    ],
  },
];

// Hero carousel (components/Carousel.js)
// `slug` = article in `articles` below; the slide links to /article/<slug>
// `image` = optional override (defaults to the article's image)
// `position` = image focus point on a dark slide, `wide` = image sits on the right 74%
export const heroSlides = [
  {
    slug: 'pembaharuan-lesen-memandu-dalam-talian',
    image: withBase('/images/carousel/license.png'),
    position: '72% 50%',
    eyebrow: 'Makluman | JPJ',
    title: 'Perbaharui lesen',
    titleEm: 'terus dalam talian.',
    text: 'Pembaharuan lesen memandu hanya melalui portal rasmi JPJ, bukan pautan dalam mesej.',
    cta: 'Baca makluman',
  },
  {
    slug: 'pautan-bantuan-tunai-whatsapp-palsu',
    eyebrow: 'Palsu | MCMC',
    title: 'Pautan bantuan tunai',
    titleEm: 'di WhatsApp itu palsu.',
    text: 'Laman tiruan itu meminta butiran kad pengenalan dan akaun bank anda. Jangan isi.',
    cta: 'Baca semakan',
  },
  {
    slug: 'amaran-hujan-lebat-pantai-timur-november',
    image: withBase('/images/carousel/hero-cuaca.jpg'),
    eyebrow: 'Makluman | METMalaysia',
    title: 'Hujan lebat tiga hari',
    titleEm: 'di Pantai Timur.',
    text: 'Amaran hujan lebat dari 12 hingga 14 November 2026. Ikuti kemas kini rasmi.',
    cta: 'Baca amaran',
  },
  {
    slug: 'harga-petrol-ron95-naik-20-sen-palsu',
    eyebrow: 'Palsu | KPDN',
    title: 'RON95 tidak naik',
    titleEm: '20 sen esok.',
    text: 'Mesej yang tular itu palsu. Harga bahan api diumumkan secara rasmi setiap minggu.',
    image: post('budimadani.jpg'), // petrol pump photo (the article keeps its own)
    cta: 'Baca semakan',
  },
  {
    slug: 'gambar-kebakaran-hutan-pahang-gambar-lama',
    eyebrow: 'Palsu | JBPM',
    title: 'Gambar kebakaran hutan',
    titleEm: 'itu gambar lama.',
    text: 'Gambar yang tular bukan dari Pahang minggu ini. Semak sebelum anda berkongsi.',
    cta: 'Baca semakan',
  },
];

// Viewership stats (components/Viewership.js), in display order (2 × 2 cards)
// `sep` = thousands separator (1,016); `suffix` = sign after the number (20+);
// `image` = card with a photo background and light text
export const viewershipStats = [
  { value: 1016, sep: true, text: 'Artikel semakan dari Januari 2022 hingga Mei 2026.' },
  { value: 20, suffix: '+', text: 'Kementerian dan agensi yang mengesahkan semakan kami.' },
  { value: 200, unit: 'ribu', text: 'Mesej diproses Aifa, pembantu AI, sejak Januari 2025.' },
  { value: 275, unit: 'juta+', image: '/images/about/viewership-bg.jpg', text: 'Lawatan ke portal dari Mac 2017 hingga September 2021.' },
];

/* About us page (app/about-us) */
const aboutImg = (name) => withBase(`/images/about/${name}`);

// Hero: photo card with "Ikuti kami" + social icons on top, title and lead at the bottom.
// `social` = ids from `socialLinks`, in display order.
export const aboutHero = {
  follow: 'Ikuti kami',
  social: ['instagram', 'threads', 'x', 'facebook'],
  title: 'Portal semakan fakta rasmi Malaysia, sejak 2017.',
  lead:
    'Dilancarkan oleh MCMC pada 14 Mac 2017, Sebenarnya.my menyemak berita tular, dakwaan dan khabar angin dengan merujuk sumber serta kenyataan rasmi agensi kerajaan. Matlamat kami mudah: membantu rakyat Malaysia semak dahulu, sebelum berkongsi.',
  image: aboutImg('hero.jpg'),
};

// Statement under the hero (Tentang Kami, section 2): two short lines, one idea.
export const aboutIntro = {
  label: 'Tentang kami',
  lead: 'Di Sebenarnya.my, kami bukan sekadar menyemak berita — kami melindungi kepercayaan. Sejak 2017, kami menjadi rujukan rakyat untuk maklumat sahih, daripada khabar angin harian hingga isu nasional.',
  card: {
    strong: 'Semakan berasaskan sumber rasmi',
    muted: 'setiap dakwaan dirujuk kepada agensi yang berkaitan sebelum',
    end: 'jawapan diterbitkan.',
  },
  pill: 'Bersama lebih 20 agensi',
  pillImage: '/images/about/agencies-bg.jpg',
  verdicts: {
    value: '20+',
    title: 'Agensi rakan',
    text: 'Kementerian dan agensi persekutuan yang mengesahkan dakwaan bersama kami.',
  },
  factsTitle: 'Beberapa fakta tentang kami dalam angka',
  facts: [
    { value: '275 juta+', label: 'Lawatan ke portal' },
    { value: '1,016', label: 'Artikel semakan' },
    { value: '200 ribu', label: 'Mesej diproses Aifa' },
    { value: '20+', label: 'Agensi rakan' },
  ],
};

// News and gallery. News `ratio` = image aspect ratio; gallery = 3D sphere (SphereGallery.js), `caption` is the photo's accessible name.
export const aboutNews = {
  title: 'Berita dan Galeri',
  intro: 'Ikuti perkembangan terkini, pengiktirafan dan aktiviti Sebenarnya.my bersama masyarakat.',
  lead: 'Semua yang anda perlukan untuk menyemak kesahihan maklumat — daripada kenyataan rasmi agensi hingga saluran untuk melaporkan dakwaan yang meragukan.',
  news: [
    {
      tag: 'Anugerah',
      title: 'Sebenarnya.my diiktiraf di Anugerah WSIS PBB, Geneva',
      text: 'Pengiktirafan antarabangsa tertinggi dalam kepercayaan digital dan semakan fakta awam, bersama lebih 20 agensi persekutuan.',
      image: aboutImg('berita-wsis.webp'),
      alt: 'Poster Anugerah WSIS 2026 di Geneva',
      ratio: '1 / 1',
      focus: '0% 34%', // crop of the large card: keeps the trophy in view
    },
    {
      tag: 'Inisiatif',
      title: 'AIFA bantu orang ramai menyemak fakta dengan lebih pantas',
      text: 'Pembantu AIFA menjawab soalan tentang dakwaan tular dan memandu pengguna kepada semakan rasmi.',
      image: aboutImg('berita-aifa.jpg'),
      alt: 'Wanita memegang telefon pintar',
      ratio: '43 / 24',
    },
    {
      tag: 'Program',
      title: 'Program celik maklumat bersama warga emas',
      text: 'Sesi bersemuka membimbing warga emas mengenal pasti mesej palsu sebelum dikongsi dalam kumpulan keluarga.',
      image: aboutImg('berita-warga-emas.jpg'),
      alt: 'Warga emas belajar menggunakan tablet bersama seorang wanita',
      ratio: '43 / 24',
    },
  ],
  galleryTitle: 'Galeri',
  gallery: [
    { image: aboutImg('galeri-1.jpg'), caption: 'Semak dahulu, sebelum berkongsi' },
    { image: aboutImg('galeri-2.jpg'), caption: 'Sesi dialog komuniti' },
    { image: aboutImg('galeri-3.jpg'), caption: 'Perkongsian bersama warga emas' },
    { image: aboutImg('galeri-4.jpg'), caption: 'Kempen kesedaran penipuan dalam talian' },
    { image: aboutImg('galeri-5.jpg'), caption: 'Bual santai di kopitiam' },
    { image: aboutImg('galeri-6.jpg'), caption: 'Celik digital setiap hari' },
  ],
};

// How it works (components/AboutUs.js).
// `cta.href` opens the claim form pop-up (see components/ClaimForm.js).
export const howItWorks = {
  title: 'Bagaimana kami menyemak fakta',
  intro: 'Daripada laporan anda sehingga hasil semakan diterbitkan, inilah enam langkah yang kami lalui.',
  steps: [
    { title: 'Terima laporan', text: 'Anda hantar dakwaan, pautan atau tangkapan skrin.' },
    { title: 'Analisis awal', text: 'AI menyaring dan mengelaskan maklumat.' },
    { title: 'Semakan agensi', text: 'Agensi berkaitan menyiasat laporan.' },
    { title: 'Pengesahan', text: 'Agensi mengesahkan hasil siasatan.' },
    { title: 'Penerbitan', text: 'Hasil yang diluluskan diterbitkan di Sebenarnya.my.' },
    { title: 'Penyebaran', text: 'Hasil semakan dikongsi untuk membendung berita palsu.' },
  ],
};

/* Logo page (app/logo, components/LogoKit.js) */
// `src` is the preview, `file` is what gets downloaded, `filename` is the name it saves as.
// icon.png is really a WebP file, so the icon downloads from icon-download.png (a true PNG copy).
export const logoPage = {
  title: 'Logo Sebenarnya.my',
  intro: 'Muat turun logo dan ikon Sebenarnya.my untuk digunakan dalam bahan media, pembentangan dan hebahan.',
  // Each item: preview + three downloads (PNG is the original; JPEG has a white ground;
  // the SVG wraps the PNG until the vector artwork is supplied).
  items: [
    {
      name: 'Logo',
      text: 'Logo penuh bersama slogan “Tidak Pasti Jangan Kongsi”.',
      src: withBase('/images/logo/logo.png'),
      width: 356,
      height: 107,
      meta: 'PNG · 356 × 107 px · 37 KB',
      formats: [
        { label: 'PNG', file: withBase('/images/logo/logo.png'), filename: 'sebenarnya-logo.png' },
        { label: 'SVG', file: withBase('/images/logo/logo.svg'), filename: 'sebenarnya-logo.svg' },
        { label: 'JPEG', file: withBase('/images/logo/logo.jpg'), filename: 'sebenarnya-logo.jpg' },
      ],
    },
    {
      name: 'Ikon',
      text: 'Ikon segi empat untuk ruang kecil seperti gambar profil.',
      src: withBase('/images/logo/icon-download.png'),
      width: 116,
      height: 116,
      meta: 'PNG · 134 × 134 px · 20 KB',
      formats: [
        { label: 'PNG', file: withBase('/images/logo/icon-download.png'), filename: 'sebenarnya-ikon.png' },
        { label: 'SVG', file: withBase('/images/logo/icon-download.svg'), filename: 'sebenarnya-ikon.svg' },
        { label: 'JPEG', file: withBase('/images/logo/icon-download.jpg'), filename: 'sebenarnya-ikon.jpg' },
      ],
    },
  ],
  formatTitle: 'Format',
  // DEMO copy — replace with MCMC's official terms before launch (docs/plan.md).
  terms: {
    title: 'Terma penggunaan logo',
    intro:
      'Logo dan ikon Sebenarnya.my dimiliki oleh Suruhanjaya Komunikasi dan Multimedia Malaysia (MCMC). Dengan memuat turun fail ini, anda bersetuju dengan terma berikut.',
    items: [
      'Gunakan logo untuk merujuk atau mempromosikan Sebenarnya.my, seperti dalam laporan berita, pembentangan dan bahan pendidikan.',
      'Gunakan fail asal tanpa mengubah warna, bentuk, huruf atau slogan.',
      'Beri ruang kosong di sekeliling logo, sekurang-kurangnya setinggi huruf “S”.',
      'Pastikan penggunaan anda tidak memberi gambaran bahawa MCMC menyokong produk, perkhidmatan atau pendapat anda.',
      'Dapatkan kebenaran bertulis daripada MCMC sebelum menggunakan logo untuk tujuan komersial.',
    ],
    note: 'MCMC boleh meminta anda berhenti menggunakan logo jika terma ini tidak dipatuhi.',
  },
};

// Collaborators ticker (components/Collaborators.js)
const partnerLogo = (name) => withBase(`/images/logo/partners/${name}.png`);

export const partners = [
  { name: 'Kementerian Kewangan Malaysia', logo: partnerLogo('mof') },
  { name: 'Jabatan Meteorologi Malaysia', logo: partnerLogo('met') },
  { name: 'Jabatan Pengangkutan Jalan Malaysia', logo: partnerLogo('jpj') },
  { name: 'Keretapi Tanah Melayu Berhad', logo: partnerLogo('ktmb') },
  { name: 'Jabatan Agama Islam Selangor', logo: partnerLogo('jais') },
  { name: 'Jabatan Pendidikan Wilayah Persekutuan Kuala Lumpur', logo: partnerLogo('jpwpkl') },
  { name: 'Jabatan Pendidikan Negeri Pulau Pinang', logo: partnerLogo('jpnpp') },
  { name: 'Jabatan Pendidikan Negeri Selangor', logo: partnerLogo('jpn') },
  { name: 'Caltex Malaysia', logo: partnerLogo('caltex') },
  { name: 'Kesultanan Pahang', logo: partnerLogo('pahang') },
];

/* Articles page (app/article/page.js) */

// Category labels. The filter bar shows the three verdicts only (components/Articles.js).
export const articleCategories = [
  { id: 'palsu', label: 'Palsu' },
  { id: 'benar', label: 'Penjelasan' },
  { id: 'makluman', label: 'Makluman' },
  { id: 'bencana', label: 'Bencana' },
  { id: 'ekonomi', label: 'Ekonomi' },
  { id: 'keselamatan', label: 'Keselamatan' },
  { id: 'pendidikan', label: 'Pendidikan' },
  { id: 'pengangkutan', label: 'Pengangkutan' },
  { id: 'urus-tadbir', label: 'Urus Tadbir' },
  { id: 'integriti-pilihan-raya', label: 'Integriti Pilihan Raya' },
  { id: 'agama', label: 'Agama' },
  { id: 'jenayah', label: 'Jenayah' },
  { id: 'kesihatan', label: 'Kesihatan' },
  { id: 'kepenggunaan', label: 'Kepenggunaan' },
];

// Tag shown on each card
// Verdict labels; colours come from the --color-verdict-* tokens (components/ui/Verdict.js)
export const articleStatus = {
  palsu: { label: 'Palsu' },
  makluman: { label: 'Makluman' },
  benar: { label: 'Penjelasan' },
};

const agencyLogo = (name) => withBase(`/images/authors/agency-${name}.webp`);

// `status` = card tag (palsu / makluman / benar)
// `categories` = filter-bar ids this article also appears under
// `date` = YYYY-MM-DD
// `slug` = page address (/article/<slug>); `lead` + `explanation` = article body
export const articles = [
  {
    title: 'Mesej pautan pendaftaran bantuan tunai di WhatsApp adalah palsu',
    slug: 'pautan-bantuan-tunai-whatsapp-palsu',
    lead: 'Satu mesej yang tular di WhatsApp mendakwa orang ramai boleh mendaftar untuk bantuan tunai melalui pautan yang dikongsi. Suruhanjaya Komunikasi dan Multimedia Malaysia (MCMC) mengesahkan mesej tersebut adalah palsu.',
    explanation: 'Pautan dalam mesej itu membawa kepada laman tiruan yang meminta nombor kad pengenalan dan butiran akaun bank. Pendaftaran bantuan kerajaan hanya dibuat melalui portal rasmi dan tidak pernah dihantar melalui mesej berantai.',
    image: post('fakechat.jpg'),
    alt: 'Dua orang menyemak mesej di telefon',
    status: 'palsu',
    categories: ['jenayah', 'kepenggunaan'],
    date: '2026-11-09',
    agency: { name: agency.mcmc, image: agencyLogo('mcmc') },
  },
  {
    title: 'Amaran hujan lebat di Pantai Timur dari 12 hingga 14 November',
    slug: 'amaran-hujan-lebat-pantai-timur-november',
    lead: 'Jabatan Meteorologi Malaysia (METMalaysia) mengeluarkan amaran hujan lebat yang dijangka melanda beberapa kawasan di Pantai Timur dari 12 hingga 14 November 2026.',
    explanation: 'Kawasan yang terlibat termasuk Kelantan, Terengganu dan utara Pahang. Orang ramai dinasihatkan untuk sentiasa merujuk saluran rasmi METMalaysia bagi kemas kini terkini dan tidak bergantung pada mesej yang dikongsi semula.',
    image: post('rain.jpg'),
    alt: 'Jalan bandar dan penunggang basikal',
    status: 'makluman',
    categories: ['bencana'],
    date: '2026-11-05',
    agency: { name: agency.met, image: agencyLogo('met') },
  },
  {
    title: 'Sekolah di Selangor beroperasi seperti biasa minggu ini',
    slug: 'sekolah-selangor-beroperasi-seperti-biasa',
    lead: 'Kementerian Pendidikan Malaysia (KPM) mengesahkan semua sekolah di Selangor beroperasi seperti biasa minggu ini, berikutan mesej tular yang mendakwa sekolah akan ditutup.',
    explanation: 'Sebarang penutupan sekolah akan diumumkan secara rasmi oleh KPM atau Jabatan Pendidikan Negeri. Ibu bapa dinasihatkan untuk merujuk pengumuman rasmi sekolah dan tidak mempercayai mesej yang tidak bersumber.',
    image: post('sebenarnya-fc-public-waiting.jpg'),
    alt: 'Ibu bapa menunggu di ruang legar',
    status: 'benar',
    categories: ['pendidikan'],
    date: '2026-10-30',
    agency: { name: agency.kpm, image: agencyLogo('kpm') },
  },
  {
    title: 'Video vaksin baharu menyebabkan penyakit kulit adalah tidak benar',
    slug: 'video-vaksin-penyakit-kulit-tidak-benar',
    lead: 'Sebuah video yang tular mendakwa vaksin baharu menyebabkan penyakit kulit. Kementerian Kesihatan Malaysia (KKM) mengesahkan dakwaan tersebut adalah tidak benar.',
    explanation: 'Video itu menggunakan rakaman lama yang tidak berkaitan dengan sebarang program vaksinasi. Semua vaksin yang digunakan di Malaysia telah melalui penilaian keselamatan oleh pihak berkuasa kesihatan.',
    image: post('vaccine.jpg'),
    alt: 'Penyampai merakam video penerangan',
    status: 'palsu',
    categories: ['kesihatan'],
    date: '2026-10-28',
    agency: { name: 'KKM (Kementerian Kesihatan Malaysia)', image: agencyLogo('kkm') },
  },
  {
    title: 'Pembaharuan lesen memandu kini boleh dibuat secara dalam talian',
    slug: 'pembaharuan-lesen-memandu-dalam-talian',
    lead: 'Jabatan Pengangkutan Jalan Malaysia (JPJ) memaklumkan bahawa pembaharuan lesen memandu kini boleh dibuat secara dalam talian melalui portal rasmi JPJ.',
    explanation: 'Pemohon hanya perlu log masuk ke portal rasmi JPJ dan membuat bayaran secara dalam talian. JPJ tidak menggunakan pihak ketiga atau pautan yang dihantar melalui mesej untuk urusan pembaharuan lesen.',
    image: post('license.jpg'),
    alt: 'Kaunter perkhidmatan awam',
    status: 'makluman',
    categories: ['pengangkutan'],
    date: '2026-10-22',
    agency: { name: agency.jpj, image: agencyLogo('jpj') },
  },
  {
    title: 'Dakwaan harga petrol RON95 naik 20 sen esok adalah palsu',
    slug: 'harga-petrol-ron95-naik-20-sen-palsu',
    lead: 'Satu mesej tular mendakwa harga petrol RON95 akan naik 20 sen seliter bermula esok. Kementerian Perdagangan Dalam Negeri (KPDN) mengesahkan dakwaan tersebut adalah palsu.',
    explanation: 'Harga bahan api diumumkan secara rasmi setiap minggu oleh kerajaan. Orang ramai tidak perlu beratur panjang di stesen minyak berdasarkan mesej yang tidak disahkan.',
    image: post('sebenarnya-fc-urban-road.jpg'),
    alt: 'Terminal pembayaran tanpa tunai',
    status: 'palsu',
    categories: ['ekonomi', 'kepenggunaan'],
    date: '2026-10-14',
    agency: { name: agency.kpdn, image: agencyLogo('kpdn') },
  },
  {
    title: 'Penjelasan JPA berhubung tarikh pembayaran gaji penjawat awam',
    slug: 'penjelasan-jpa-tarikh-gaji-penjawat-awam',
    lead: 'Jabatan Perkhidmatan Awam (JPA) memberi penjelasan berhubung tarikh pembayaran gaji penjawat awam bagi bulan ini, susulan pertanyaan orang ramai di media sosial.',
    explanation: 'Gaji penjawat awam akan dibayar mengikut jadual biasa yang telah diumumkan. Sebarang perubahan tarikh pembayaran hanya akan dimaklumkan melalui pekeliling dan saluran rasmi JPA.',
    image: post('sebenarnya-fc-digital-desk.jpg'),
    alt: 'Telefon pintar dan buku nota di atas meja',
    status: 'benar',
    categories: ['urus-tadbir'],
    date: '2026-09-20',
    agency: { name: agency.jpa, image: agencyLogo('jpa') },
  },
  {
    title: 'Waspada panggilan telefon menyamar sebagai pegawai polis',
    slug: 'waspada-panggilan-menyamar-pegawai-polis',
    lead: 'Polis Diraja Malaysia (PDRM) mengingatkan orang ramai supaya berwaspada terhadap panggilan telefon daripada individu yang menyamar sebagai pegawai polis.',
    explanation: 'Penipu biasanya mendakwa mangsa terlibat dalam kes jenayah dan meminta wang dipindahkan ke akaun tertentu. PDRM tidak pernah meminta orang ramai memindahkan wang melalui panggilan telefon.',
    image: post('call.jpg'),
    alt: 'Menyemak telefon di kedai kopi',
    status: 'makluman',
    categories: ['keselamatan', 'jenayah'],
    date: '2026-08-12',
    agency: { name: agency.pdrm, image: agencyLogo('pdrm') },
  },
  {
    title: 'Dakwaan undi pos boleh dibuat melalui aplikasi mesej adalah palsu',
    slug: 'undi-pos-aplikasi-mesej-palsu',
    lead: 'Satu hantaran tular mendakwa pengundi boleh membuang undi pos melalui aplikasi mesej. Dakwaan ini disahkan palsu.',
    explanation: 'Undi pos hanya boleh dibuat mengikut prosedur rasmi Suruhanjaya Pilihan Raya (SPR). Tiada sebarang aplikasi mesej digunakan untuk membuang undi, dan pengundi tidak perlu berkongsi maklumat peribadi melalui pautan.',
    image: post('chat.jpg'),
    alt: 'Perbualan di kedai kopi',
    status: 'palsu',
    categories: ['integriti-pilihan-raya', 'urus-tadbir'],
    date: '2026-06-03',
    agency: { name: agency.kkmm, image: agencyLogo('kkmm') },
  },
  {
    title: 'Penjelasan rasmi berhubung kutipan zakat secara dalam talian',
    slug: 'penjelasan-kutipan-zakat-dalam-talian',
    lead: 'Jabatan Penerangan Malaysia (JAPEN) memberi penjelasan berhubung kutipan zakat secara dalam talian yang dibincangkan secara meluas di media sosial.',
    explanation: 'Bayaran zakat secara dalam talian adalah sah apabila dibuat melalui portal rasmi pusat zakat negeri. Orang ramai dinasihatkan agar tidak membuat bayaran melalui akaun peribadi atau pautan yang tidak disahkan.',
    image: post('sebenarnya-fc-senior-dialogue.jpg'),
    alt: 'Warga emas berbual di ruang komuniti',
    status: 'benar',
    categories: ['agama'],
    date: '2026-03-18',
    agency: { name: 'JAPEN (Jabatan Penerangan Malaysia)', image: agencyLogo('japen') },
  },
  {
    title: 'Gambar kebakaran hutan di Pahang yang tular adalah gambar lama',
    slug: 'gambar-kebakaran-hutan-pahang-gambar-lama',
    lead: 'Gambar kebakaran hutan yang didakwa berlaku di Pahang minggu ini telah tular di media sosial. Jabatan Bomba dan Penyelamat Malaysia (JBPM) mengesahkan gambar tersebut adalah gambar lama.',
    explanation: 'Gambar itu dirakam beberapa tahun lalu di lokasi lain dan tidak berkaitan dengan sebarang kejadian semasa. Tiada laporan kebakaran hutan besar di Pahang bagi tempoh tersebut.',
    image: post('terbakar.jpg'),
    alt: 'Menyemak gambar tular di telefon',
    status: 'palsu',
    categories: ['bencana', 'keselamatan'],
    date: '2026-11-07',
    agency: { name: agency.jbpm, image: agencyLogo('bomba') },
  },
  {
    title: 'Pemeriksaan kesihatan percuma di klinik kesihatan sepanjang Disember',
    slug: 'pemeriksaan-kesihatan-percuma-disember',
    lead: 'Kementerian Kesihatan Malaysia (KKM) memaklumkan pemeriksaan kesihatan percuma akan ditawarkan di klinik kesihatan terpilih sepanjang Disember 2026.',
    explanation: 'Pemeriksaan merangkumi tekanan darah, gula dalam darah dan kolesterol. Senarai klinik yang terlibat boleh disemak di laman web rasmi KKM, dan tiada sebarang pendaftaran melalui pautan pihak ketiga.',
    image: post('clinic.jpg'),
    alt: 'Ruang menunggu klinik kesihatan',
    status: 'makluman',
    categories: ['kesihatan', 'kepenggunaan'],
    date: '2026-07-15',
    agency: { name: 'KKM (Kementerian Kesihatan Malaysia)', image: agencyLogo('kkm') },
  },
  {
    title: 'Dakwaan jadual bayaran STR Fasa 4 pada 30 Oktober 2026 adalah tidak benar',
    slug: 'dakwaan-jadual-bayaran-str-fasa-4-pada-30-oktober',
    lead: 'Menurut kenyataan Kementerian Kewangan Malaysia (MOF), jadual bayaran Sumbangan Tunai Rahmah (STR) Fasa 4 yang tular di media sosial mendakwa pembayaran akan dibuat pada 30 Oktober 2026 adalah tidak benar. Sebarang maklumat rasmi mengenai tarikh dan kaedah pembayaran STR hanya akan diumumkan melalui saluran rasmi Kementerian Kewangan atau portal rasmi STR.',
    image: post('bayaranstr.jpg'),
    alt: 'Ilustrasi: jadual bayaran STR yang tular',
    status: 'palsu',
    categories: ['ekonomi'],
    date: '2026-10-29',
    agency: { name: agency.mof, image: null },
  },
  {
    title: 'Pengujian siren Sistem Amaran Awal Tsunami Malaysia pada 28 Oktober 2026',
    slug: 'pengujian-siren-sistem-amaran-awal-tsunami-malaysia-pada-28',
    lead: 'Menurut Jabatan Meteorologi Malaysia (MET Malaysia), pengujian Siren Sistem Amaran Awal Tsunami Malaysia (SAATNM) akan dijalankan di lokasi terpilih pada 28 Oktober 2026. Penduduk di kawasan sekeliling diminta untuk tidak panik sekiranya mendengar bunyi siren berkenaan semasa ujian dijalankan.',
    image: post('siren.jpg'),
    alt: 'Siren amaran awal tsunami',
    status: 'makluman',
    categories: ['bencana'],
    date: '2026-10-27',
    agency: { name: agency.met, image: agencyLogo('met') },
  },
  {
    title: 'Belanjawan 2027: BUDI MADANI terus meringankan kos bahan api rakyat',
    slug: 'belanjawan-2027-budi-madani-terus-meringankan-kos-bahan-api',
    lead: 'Menurut Kementerian Kewangan Malaysia (MOF), kerajaan meneruskan usaha meringankan beban rakyat menerusi inisiatif BUDI MADANI di bawah Belanjawan 2027 bagi memastikan penyaluran subsidi bahan api disasarkan secara adil dan saksama.',
    image: post('budimadani.jpg'),
    alt: 'Ilustrasi: inisiatif BUDI MADANI',
    status: 'makluman',
    categories: ['ekonomi'],
    date: '2026-10-26',
    agency: { name: agency.mof, image: null },
  },
  {
    title: 'Video tular libatkan Tengku Mahkota Pahang di Indonesia adalah tidak benar',
    slug: 'video-tular-libatkan-tengku-mahkota-pahang-di-indonesia-adalah',
    lead: 'Menurut Kesultanan Pahang, Istana Pahang menafikan dakwaan yang tular menerusi sebuah video di media sosial mengenai penglibatan Tengku Mahkota Pahang di Indonesia. Orang ramai digesa agar tidak menyebarkan maklumat tidak sahih.',
    image: post('fakevideo.jpg'),
    alt: 'Ilustrasi: video tular di media sosial',
    status: 'palsu',
    categories: ['urus-tadbir'],
    date: '2026-10-25',
    agency: { name: agency.pahang, image: null },
  },
  {
    title: 'Waspada ramalan cuaca signifikan di Semenanjung dari 24 hingga 26 Oktober 2026',
    slug: 'waspada-ramalan-cuaca-signifikan-di-semenanjung-dari-24-hingga',
    lead: 'Menurut Jabatan Meteorologi Malaysia (MET Malaysia), amaran ramalan cuaca signifikan dikeluarkan bagi beberapa kawasan di Semenanjung Malaysia bermula 24 hingga 26 Oktober 2026.',
    image: post('heavyrain.jpg'),
    alt: 'Hujan lebat di kawasan bandar',
    status: 'makluman',
    categories: ['bencana'],
    date: '2026-10-23',
    agency: { name: agency.met, image: agencyLogo('met') },
  },
  {
    title: 'Kerajaan arah henti guna aplikasi navigasi milik Israel',
    slug: 'kerajaan-arah-henti-guna-aplikasi-navigasi-milik-israel',
    lead: 'Menurut YAB Perdana Menteri, Dato’ Seri Anwar Ibrahim, kerajaan mengarahkan agar penggunaan aplikasi navigasi tertentu yang mempunyai kaitan atau kepemilikan entiti Israel dihentikan demi faktor keselamatan serta prinsip dasar negara.',
    image: post('waze.jpg'),
    alt: 'Aplikasi navigasi pada telefon pintar',
    status: 'makluman',
    categories: ['urus-tadbir',  'keselamatan'],
    date: '2026-10-22',
    agency: { name: agency.pm, image: null },
  },
  {
    title: 'Sekolah Agama Negeri di Selangor beroperasi seperti biasa pada 21 Oktober 2026',
    slug: 'sekolah-agama-negeri-di-selangor-beroperasi-seperti-biasa-pada',
    lead: 'Menurut Jabatan Agama Islam Selangor (JAIS), pengoperasian Sekolah Agama Negeri (SAN) di Selangor berjalan seperti biasa pada 21 Oktober 2026 mengikut ketetapan dan panduan keselamatan semasa.',
    image: post('school1.jpg'),
    alt: 'Murid di kawasan sekolah',
    status: 'makluman',
    categories: ['pendidikan',  'agama'],
    date: '2026-10-21',
    agency: { name: agency.jais, image: null },
  },
  {
    title: 'Iklan lesen memandu tanpa ujian JPJ adalah tidak benar',
    slug: 'iklan-lesen-memandu-tanpa-ujian-jpj-adalah-tidak-benar',
    lead: 'Menurut Jabatan Pengangkutan Jalan Malaysia (JPJ), JPJ menafikan sekeras-kerasnya kewujudan iklan yang menawarkan perkhidmatan kelulusan lesen memandu tanpa perlu menduduki ujian.',
    image: post('drivingschool.jpg'),
    alt: 'Kereta latihan sekolah memandu',
    status: 'palsu',
    categories: ['pengangkutan',  'jenayah'],
    date: '2026-10-20',
    agency: { name: agency.jpj, image: agencyLogo('jpj') },
  },
  {
    title: 'Status pengoperasian institusi pendidikan di Pulau Pinang',
    slug: 'status-pengoperasian-institusi-pendidikan-di-pulau-pinang',
    lead: 'Menurut kenyataan Jabatan Pendidikan Negeri Pulau Pinang (JPNPP), status pengoperasian institusi pendidikan di negeri Pulau Pinang adalah berpandukan pemantauan keadaan cuaca dan arahan keselamatan terkini.',
    image: post('school4.jpg'),
    alt: 'Bangunan sekolah',
    status: 'makluman',
    categories: ['pendidikan'],
    date: '2026-10-20',
    agency: { name: agency.jpnpp, image: agencyLogo('kpm') },
  },
  {
    title: 'Pengoperasian institusi pendidikan di bawah JPN Selangor',
    slug: 'pengoperasian-institusi-pendidikan-di-bawah-jpn-selangor',
    lead: 'Menurut kenyataan Jabatan Pendidikan Negeri Selangor (JPN Selangor), pengoperasian sekolah-sekolah di bawah JPN Selangor berjalan mengikut ketetapan rasmi dan nasihat pihak berkuasa tempatan.',
    image: post('school5.jpg'),
    alt: 'Kawasan sekolah',
    status: 'makluman',
    categories: ['pendidikan'],
    date: '2026-10-19',
    agency: { name: agency.jpns, image: agencyLogo('kpm') },
  },
  {
    title: 'Semua institusi pendidikan KPM di WP Kuala Lumpur beroperasi seperti biasa',
    slug: 'semua-institusi-pendidikan-kpm-di-wp-kuala-lumpur-beroperasi',
    lead: 'Menurut kenyataan Jabatan Pendidikan Wilayah Persekutuan Kuala Lumpur (JPWPKL), semua institusi pendidikan di bawah Kementerian Pendidikan Malaysia (KPM) di WP Kuala Lumpur beroperasi seperti biasa mengikut jadual persekolahan yang telah ditetapkan.',
    image: post('school.jpg'),
    alt: 'Murid di sekolah',
    status: 'makluman',
    categories: ['pendidikan'],
    date: '2026-10-19',
    agency: { name: agency.jpwpkl, image: agencyLogo('kpm') },
  },
  {
    title: 'Pengujian siren SAATNM di Kuala Kurau, Perak pada 19 Oktober 2026',
    slug: 'pengujian-siren-saatnm-di-kuala-kurau-perak-pada-19',
    lead: 'Menurut kenyataan Jabatan Meteorologi Malaysia (MET Malaysia), pengujian Siren Sistem Amaran Awal Tsunami Malaysia (SAATNM) dijalankan di Kuala Kurau, Perak pada 19 Oktober 2026. Penduduk di kawasan sekeliling dinasihatkan agar tidak panik sepanjang ujian dijalankan.',
    image: post('siren2.jpg'),
    alt: 'Menara siren amaran tsunami',
    status: 'makluman',
    categories: ['bencana'],
    date: '2026-10-18',
    agency: { name: agency.met, image: agencyLogo('met') },
  },
  {
    title: 'Dakwaan bayaran QR dikenakan caj perkhidmatan pada 1 November 2026 adalah tidak benar',
    slug: 'dakwaan-bayaran-qr-dikenakan-caj-perkhidmatan-pada-1-november',
    lead: 'Menurut kenyataan Kementerian Kewangan Malaysia (MOF), dakwaan bahawa sebarang pembayaran menggunakan kod QR akan dikenakan caj perkhidmatan bermula 1 November 2026 adalah tidak benar dan mengelirukan.',
    image: post('extrafee.jpg'),
    alt: 'Ilustrasi: bayaran menggunakan kod QR',
    status: 'palsu',
    categories: ['ekonomi',  'kepenggunaan'],
    date: '2026-10-17',
    agency: { name: agency.mof, image: null },
  },
  {
    title: 'Perkembangan terkini siasatan kualiti bahan api RON95',
    slug: 'perkembangan-terkini-siasatan-kualiti-bahan-api-ron95',
    lead: 'Menurut kenyataan Caltex Malaysia, pihak Caltex mengambil maklum berkenaan isu kualiti bahan api RON95 dan sedang menjalankan siasatan terperinci bersama pihak berkuasa bagi memastikan kualiti produk memenuhi piawaian yang ditetapkan.',
    image: post('gas.jpg'),
    alt: 'Pam minyak di stesen minyak',
    status: 'makluman',
    categories: ['kepenggunaan'],
    date: '2026-10-16',
    agency: { name: agency.caltex, image: null },
  },
  {
    title: 'Pengujian siren SAATNM di Mersing, Johor pada 16 Oktober 2026',
    slug: 'pengujian-siren-saatnm-di-mersing-johor-pada-16-oktober',
    lead: 'Menurut kenyataan Jabatan Meteorologi Malaysia (MET Malaysia), pengujian Siren Sistem Amaran Awal Tsunami Malaysia (SAATNM) telah dijalankan di Mersing, Johor pada 16 Oktober 2026 bagi memastikan sistem amaran sentiasa berada dalam keadaan bersiap sedia.',
    image: post('siren3.jpg'),
    alt: 'Siren amaran di pesisir pantai',
    status: 'makluman',
    categories: ['bencana'],
    date: '2026-10-15',
    agency: { name: agency.met, image: agencyLogo('met') },
  },
  {
    title: 'Penjelasan KTMB berhubung kenderaan memasuki landasan di Stesen Pelabuhan Klang',
    slug: 'penjelasan-ktmb-berhubung-kenderaan-memasuki-landasan-di-stesen-pelabuhan',
    lead: 'Menurut kenyataan Keretapi Tanah Melayu Berhad (KTMB), pihak KTMB memberikan penjelasan berhubung pencerobohan sebuah kenderaan awam ke kawasan landasan di Stesen Pelabuhan Klang dan mengingatkan orang ramai agar sentiasa mematuhi garis panduan keselamatan.',
    image: post('car.jpg'),
    alt: 'Kenderaan di kawasan landasan kereta api',
    status: 'benar',
    categories: ['pengangkutan',  'keselamatan'],
    date: '2026-10-13',
    agency: { name: agency.ktmb, image: null },
  },
  {
    title: 'Harga petrol tanpa subsidi turun 5 sen, diesel tanpa subsidi turun 10 sen seliter',
    slug: 'harga-petrol-tanpa-subsidi-turun-5-sen-diesel-tanpa',
    lead: 'Menurut kenyataan Kementerian Kewangan (MOF), berdasarkan formula Automatic Pricing Mechanism (APM), harga runcit petrol tanpa subsidi diturunkan sebanyak 5 sen seliter manakala diesel tanpa subsidi diturunkan sebanyak 10 sen seliter.',
    image: post('petrol.jpg'),
    alt: 'Muncung pam petrol',
    status: 'makluman',
    categories: ['ekonomi',  'kepenggunaan'],
    date: '2026-10-12',
    agency: { name: agency.mof, image: null },
  },
  {
    title: 'Institusi pendidikan KPM di WP Kuala Lumpur diteruskan seperti biasa',
    slug: 'institusi-pendidikan-kpm-di-wp-kuala-lumpur-diteruskan-seperti',
    lead: 'Menurut kenyataan Jabatan Pendidikan WP Kuala Lumpur (JPWPKL), pengoperasian semua institusi pendidikan di bawah KPM di WP Kuala Lumpur diteruskan seperti biasa.',
    image: post('school3.jpg'),
    alt: 'Bilik darjah sekolah',
    status: 'makluman',
    categories: ['pendidikan'],
    date: '2026-10-11',
    agency: { name: agency.jpwpkl, image: agencyLogo('kpm') },
  },
  {
    title: 'JPM (Hal Ehwal Agama) kecam serangan ke atas Lapangan Terbang Antarabangsa King Khalid',
    slug: 'jpm-hal-ehwal-agama-kecam-serangan-ke-atas-lapangan',
    lead: 'Menurut kenyataan Jabatan Perdana Menteri (Hal Ehwal Agama), kerajaan mengecam keras sebarang serangan yang mensasarkan infrastruktur awam seperti Lapangan Terbang Antarabangsa King Khalid.',
    image: post('attack.jpg'),
    alt: 'Ilustrasi: lapangan terbang',
    status: 'makluman',
    categories: ['agama',  'keselamatan'],
    date: '2026-10-10',
    agency: { name: agency.jpm, image: null },
  },
  {
    title: 'Semua institusi pendidikan di bawah JPWPKL dibuka semula',
    slug: 'semua-institusi-pendidikan-di-bawah-jpwpkl-dibuka-semula',
    lead: 'Merujuk kenyataan media Jabatan Pendidikan WP Kuala Lumpur (JPWPKL), semua institusi pendidikan di bawah pentadbiran JPWPKL telah dibuka semula sepenuhnya mengikut SOP keselamatan dan kesihatan yang ditetapkan.',
    image: post('school2.jpg'),
    alt: 'Murid kembali ke sekolah',
    status: 'makluman',
    categories: ['pendidikan'],
    date: '2026-10-09',
    agency: { name: agency.jpwpkl, image: agencyLogo('kpm') },
  },
];
