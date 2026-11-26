'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, Calendar, Check, CloudUpload, Download, Flag, Link as LinkIcon, MessageSquareText, Plus, Search, Share, X,
} from 'lucide-react';
import {
  Badge, Button, ButtonGroup, Chip, ChipRow, DropdownMenu, Field, Icon, IconButton, Input, LanguageMenu, NavLink,
  SearchField, Select, Tabs, Textarea, Verdict,
} from '@/components/ui';
import { withBase } from '@/lib/basePath';
import DesignSystemDashboard from '@/components/DesignSystemDashboard';

/* Living style guide: every swatch, specimen and component below is drawn with the real
   tokens (app/tokens.css), styles (app/ui.css) and components (components/ui/). Values in
   grey are measured in the browser, so fluid sizes show what this screen width gets. */

const SECTIONS = [
  ['warna', 'Warna'],
  ['tipografi', 'Tipografi'],
  ['saiz', 'Saiz & jarak'],
  ['bentuk', 'Bentuk & kesan'],
  ['ikon', 'Ikon'],
  ['komponen', 'Komponen'],
  ['dashboard', 'Komponen dashboard'],
  ['gerakan', 'Gerakan'],
  ['susun-atur', 'Susun atur'],
  ['semua-token', 'Semua token'],
];

// The names lint-ds treats as primitives: only tokens.css may read them
const isPrimitive = (n) =>
  /^color-(white|black|grey-\d+|red|red-dark|blue|azure|green|green-dark)$/.test(n)
  || /^(text-\d+|leading-[\w-]+|spacing-\d+)$/.test(n)
  || /^radius-(sm|input|md|lg|full)$/.test(n);

/* ── Live measuring ─────────────────────────────────────────────────────── */

// Re-render on resize so measured values follow the fluid tokens
function useViewportWidth() {
  const [w, setW] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setW(window.innerWidth)); };
    update();
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', update); };
  }, []);
  return w;
}

const round = (n) => (Math.round(n * 10) / 10).toString();

// Length token → px on this screen (probe element takes the token as its width)
function Px({ value, vw }) {
  const ref = useRef(null);
  const [px, setPx] = useState('');
  useLayoutEffect(() => {
    if (ref.current) setPx(`${round(ref.current.getBoundingClientRect().width)}px`);
  }, [value, vw]);
  return (
    <>
      <span ref={ref} className="dsg-probe" style={{ width: value }} aria-hidden="true" />
      <span className="dsg-live">{px}</span>
    </>
  );
}

// Height of the first element inside, as rendered
function Measured({ vw, children, label }) {
  const ref = useRef(null);
  const [h, setH] = useState('');
  useLayoutEffect(() => {
    const el = ref.current?.firstElementChild;
    if (el) setH(`${round(el.getBoundingClientRect().height)}px`);
  }, [vw]);
  return (
    <figure className="dsg-measured">
      <div ref={ref} className="dsg-measured__item">{children}</div>
      <figcaption>
        <code className="dsg-code">{label}</code> <span className="dsg-live">{h}</span>
      </figcaption>
    </figure>
  );
}

/* ── Colour maths (WCAG 2.2 contrast) ───────────────────────────────────── */

function parseColour(str) {
  let m = str.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
  }
  m = str.match(/color\(srgb ([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
    return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p[3] ?? 1 };
  }
  return null;
}

const toHex = ({ r, g, b }) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
});
function luminance({ r, g, b }) {
  const f = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(fg, bg) {
  const a = luminance(over(fg, bg));
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Resolve tokens to colours through a probe (handles var() chains and color-mix())
function useColours(names, vw) {
  const ref = useRef(null);
  const [map, setMap] = useState({});
  const key = names.join(',');
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const out = {};
    for (const n of names) {
      el.style.color = `var(--${n})`;
      const c = parseColour(getComputedStyle(el).color);
      if (c) out[n] = c;
    }
    setMap(out);
  }, [key, vw]); // eslint-disable-line react-hooks/exhaustive-deps
  const probe = <span ref={ref} className="dsg-probe" aria-hidden="true" />;
  return [map, probe];
}

/* ── Building blocks ────────────────────────────────────────────────────── */

function Section({ id, title, lead, children }) {
  return (
    <section className="dsg-section" id={id} aria-labelledby={`${id}-title`}>
      <header className="dsg-section__head">
        <h2 className="dsg-section__title" id={`${id}-title`}>{title}</h2>
        {lead && <p className="dsg-section__lead">{lead}</p>}
      </header>
      {children}
    </section>
  );
}

function Group({ title, note, children }) {
  return (
    <div className="dsg-group">
      <div className="dsg-group__head">
        <h3 className="dsg-group__title">{title}</h3>
        {note && <p className="dsg-group__note">{note}</p>}
      </div>
      {children}
    </div>
  );
}

function Demo({ code, dark, children, wide }) {
  return (
    <figure className={`dsg-demo${wide ? ' dsg-demo--wide' : ''}`}>
      <div className={`dsg-demo__stage${dark ? ' dsg-demo__stage--dark' : ''}`}>{children}</div>
      {code && <figcaption><code className="dsg-code">{code}</code></figcaption>}
    </figure>
  );
}

const Tok = ({ children }) => <code className="dsg-code">--{children}</code>;

/* ── Sections ───────────────────────────────────────────────────────────── */

const COLOUR_GROUPS = [
  ['Permukaan', 'Kanvas, permukaan terangkat, band dan isian kawalan. Elevation datang daripada nada, bukan bayang.',
    /^color-(background|card|muted|muted-strong|secondary|secondary-hover|accent|disabled|surface-[\w-]+|scrim|primary|primary-hover)$/],
  ['Teks', 'Tinta untuk tajuk dan label, graphite untuk perenggan panjang, smoke untuk meta. Varian -inverse untuk atas gelap atau foto.',
    /^color-(foreground|text-secondary|muted-foreground|primary-foreground|secondary-foreground|disabled-foreground|link|destructive|[\w-]+-inverse)$/],
  ['Tepi & fokus', 'Garis rambut untuk kad dan pill, tepi kuat (3:1) untuk medan. Fokus sentiasa tinta.',
    /^color-(border|border-strong|input|ring|hairline|hairline-strong)$/],
  ['Jenama & verdict', 'Satu-satunya warna kromatik. Merah jenama bukan untuk aksi; warna verdict sentiasa bersama perkataannya.',
    /^color-(brand[\w-]*|verdict-[\w-]+)$/],
];

const CONTRAST_PAIRS = [
  ['foreground', 'background', 4.5, 'Tajuk, label'],
  ['text-secondary', 'background', 4.5, 'Perenggan'],
  ['muted-foreground', 'background', 4.5, 'Meta, placeholder'],
  ['muted-foreground', 'muted', 4.5, 'Meta atas band'],
  ['foreground', 'card', 4.5, 'Teks atas permukaan putih'],
  ['primary-foreground', 'primary', 4.5, 'Butang filled'],
  ['destructive', 'background', 4.5, 'Ralat'],
  ['verdict-palsu', 'background', 4.5, 'Verdict Palsu'],
  ['verdict-makluman', 'background', 4.5, 'Verdict Makluman'],
  ['verdict-benar', 'background', 4.5, 'Verdict Benar'],
  ['foreground-inverse', 'surface-media', 4.5, 'Teks atas gelap'],
  ['text-secondary-inverse', 'surface-media', 4.5, 'Perenggan atas gelap'],
  ['muted-foreground-inverse', 'surface-media', 4.5, 'Meta atas gelap'],
  ['input', 'background', 3, 'Tepi medan (bukan teks)'],
];

function Colours({ tokens, vw }) {
  const semantic = tokens.filter((t) => t.name.startsWith('color-') && !isPrimitive(t.name) && !/folder|tile/.test(t.name));
  const palette = tokens.filter((t) => t.name.startsWith('color-') && isPrimitive(t.name));
  const names = [...new Set([...semantic, ...palette].map((t) => t.name).concat(CONTRAST_PAIRS.flatMap(([a, b]) => [`color-${a}`, `color-${b}`])))];
  const [colours, probe] = useColours(names, vw);
  const grouped = COLOUR_GROUPS.map(([title, note, re]) => [title, note, semantic.filter((t) => re.test(t.name))]);
  const placed = new Set(grouped.flatMap(([, , list]) => list.map((t) => t.name)));
  const rest = semantic.filter((t) => !placed.has(t.name));
  if (rest.length) grouped.push(['Lain-lain', null, rest]);

  const swatch = (t) => {
    const c = colours[t.name];
    return (
      <li key={t.name} className="dsg-swatch">
        <span className="dsg-swatch__chip" style={{ background: `var(--${t.name})` }} />
        <span className="dsg-swatch__name"><Tok>{t.name}</Tok></span>
        <span className="dsg-live">
          {c ? `${toHex(c)}${c.a < 1 ? ` · ${Math.round(c.a * 100)}%` : ''}` : ''}
        </span>
        {t.comment && <span className="dsg-swatch__note">{t.comment}</span>}
      </li>
    );
  };

  return (
    <Section id="warna" title="Warna" lead="97% akromatik hangat. Komponen hanya membaca token semantik; palet di bawah hanya untuk tokens.css.">
      {probe}
      {grouped.map(([title, note, list]) => (
        <Group key={title} title={title} note={note}>
          <ul className="dsg-swatches">{list.map(swatch)}</ul>
        </Group>
      ))}

      <Group title="Pasangan kontras" note="Diukur dalam pelayar daripada token sebenar. Teks perlu 4.5:1 (WCAG AA); tepi kawalan perlu 3:1.">
        <div className="dsg-table-wrap">
          <table className="dsg-table">
            <thead><tr><th>Contoh</th><th>Teks / tepi</th><th>Latar</th><th>Nisbah</th><th>Guna</th></tr></thead>
            <tbody>
              {CONTRAST_PAIRS.map(([fg, bg, min, use]) => {
                const a = colours[`color-${fg}`];
                const b = colours[`color-${bg}`];
                const ratio = a && b ? contrast(a, b) : null;
                return (
                  <tr key={fg + bg}>
                    <td>
                      <span className="dsg-pair" style={{ color: `var(--color-${fg})`, background: `var(--color-${bg})` }}>Aa</span>
                    </td>
                    <td><Tok>{`color-${fg}`}</Tok></td>
                    <td><Tok>{`color-${bg}`}</Tok></td>
                    <td>
                      {ratio && (
                        <span className={`dsg-ratio${ratio >= min ? '' : ' dsg-ratio--fail'}`}>
                          {ratio.toFixed(2)}:1 {ratio >= min ? 'Lulus' : `Gagal (perlu ${min}:1)`}
                        </span>
                      )}
                    </td>
                    <td>{use}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Group>

      <Group title="Palet (primitive)" note="Jangan guna dalam komponen: lint-ds menolaknya. Tukar nilai di sini untuk menukar jenama.">
        <ul className="dsg-swatches dsg-swatches--compact">{palette.map(swatch)}</ul>
      </Group>
    </Section>
  );
}

const SAMPLES = {
  display: 'Tidak pasti? Semak sebelum kongsi.',
  'heading-lg': 'Semakan fakta terkini',
  heading: 'Cara Sebenarnya.my membantu',
  title: 'Bantuan tunai melalui WhatsApp',
  intro: 'Portal rujukan rasmi yang disahkan terus oleh kementerian dan agensi.',
  article: 'Kenyataan rasmi agensi menjelaskan bahawa mesej tersebut tidak benar dan orang ramai dinasihatkan supaya tidak berkongsi pautan yang diterima.',
  body: 'Tampal tajuk mesej tular di sini, atau tanya AIFA 24 jam di WhatsApp.',
  'body-sm': 'Disemak 24 Nov 2026 · Sumber: kenyataan rasmi KPDN',
  label: 'Salur Kepada Kami',
  'label-sm': 'Muat naik fail',
  eyebrow: 'Semak & lapor',
  badge: 'Kewangan',
  verdict: 'Palsu',
  caption: '24 Nov 2026 · Foto: Bernama',
  stat: '12.4 juta',
};
const UPPER = new Set(['eyebrow', 'verdict']);

function Typography({ tokens, vw }) {
  const roles = tokens.filter((t) => /^text-[a-z][\w-]*$/.test(t.name) && !t.name.includes('--'));
  return (
    <Section id="tipografi" title="Tipografi" lead="Manrope sahaja. Saiz teks hanya melalui peranan (--text-*); peranan besar fluid antara 375 dan 1280px tanpa media query.">
      <ul className="dsg-type-list">
        {roles.map((t) => <TypeRole key={t.name} token={t} vw={vw} />)}
      </ul>
    </Section>
  );
}

function TypeRole({ token, vw }) {
  const role = token.name.replace(/^text-/, '');
  const ref = useRef(null);
  const [m, setM] = useState(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const s = getComputedStyle(ref.current);
    setM({ size: parseFloat(s.fontSize), lh: parseFloat(s.lineHeight) / parseFloat(s.fontSize), weight: s.fontWeight });
  }, [vw]);
  const style = {
    '--dsg-size': `var(--${token.name})`,
    '--dsg-lh': `var(--${token.name}--line-height)`,
    '--dsg-weight': `var(--${token.name}--font-weight, var(--font-weight-regular))`,
    '--dsg-ls': `var(--${token.name}--letter-spacing, 0)`,
  };
  return (
    <li className="dsg-type">
      <div className="dsg-type__meta">
        <Tok>{token.name}</Tok>
        {m && <span className="dsg-live">{round(m.size)}px · {round(m.lh)} · {m.weight}</span>}
        {token.comment && <span className="dsg-type__note">{token.comment}</span>}
      </div>
      <p ref={ref} className={`dsg-type__sample${UPPER.has(role) ? ' dsg-type__sample--upper' : ''}`} style={style}>
        {SAMPLES[role] ?? 'Semak sebelum kongsi.'}
      </p>
    </li>
  );
}

function Sizes({ tokens, vw }) {
  const pick = (re) => tokens.filter((t) => re.test(t.name));
  return (
    <Section id="saiz" title="Saiz & jarak" lead="Pilih jarak ikut hubungan, bukan nombor. Nilai kelabu ialah saiz pada lebar skrin ini; ubah saiz tetingkap untuk melihat nilai fluid berubah.">
      <Group title="Skala kawalan" note="Setiap butang, chip, tab, medan dan carian mengambil tinggi daripada skala ini. Sasaran sentuh kekal 44px.">
        <div className="dsg-row">
          <Measured vw={vw} label='size="sm"'><Button size="sm" variant="outline">Kecil</Button></Measured>
          <Measured vw={vw} label='size="md"'><Button variant="outline">Sederhana</Button></Measured>
          <Measured vw={vw} label='size="lg"'><Button size="lg" variant="outline">Besar</Button></Measured>
        </div>
        <TokenBars list={pick(/^size-control/)} vw={vw} axis="height" />
      </Group>

      <Group title="Jarak kandungan" note="Dalam kumpulan 8 · antara kumpulan 16 · antara kad 16 → 24 · tajuk → kandungan 24 → 40 · antara seksyen 64 → 120.">
        <TokenBars list={[...pick(/^gap-/), ...pick(/^space-section$/)]} vw={vw} />
      </Group>

      <Group title="Saiz kad" note="Saiz kad menentukan padding dan radius serentak. Gap dalam kad tidak pernah lebih besar daripada padding.">
        <div className="dsg-cards">
          {[['sm', 'pad-card-sm', 'radius-card', 'Kad sempit (< 280px)'], ['md', 'pad-card', 'radius-card', 'Lalai, kad dalam grid'], ['lg', 'pad-card-lg', 'radius-card-lg', 'Feature, modal, panel']].map(([size, pad, radius, use]) => (
            <div key={size} className="dsg-card-demo" style={{ padding: `var(--${pad})`, borderRadius: `var(--${radius})` }}>
              <Badge size="sm">{size}</Badge>
              <p className="dsg-card-demo__title">{use}</p>
              <p className="dsg-card-demo__meta"><Tok>{pad}</Tok> <Px value={`var(--${pad})`} vw={vw} /> · <Tok>{radius}</Tok></p>
            </div>
          ))}
        </div>
      </Group>

      <Group title="Jarak kawalan & lain-lain">
        <TokenBars list={pick(/^space-(?!section)/)} vw={vw} />
      </Group>

      <Group title="Skala spacing (primitive)" note="Hanya untuk geometri dalam satu komponen (gap ≤ 12, padding, offset).">
        <TokenBars list={pick(/^spacing-\d+$/)} vw={vw} compact />
      </Group>
    </Section>
  );
}

function TokenBars({ list, vw, compact }) {
  return (
    <ul className={`dsg-bars${compact ? ' dsg-bars--compact' : ''}`}>
      {list.map((t) => (
        <li key={t.name} className="dsg-bar">
          <span className="dsg-bar__name"><Tok>{t.name}</Tok></span>
          <span className="dsg-bar__track"><span className="dsg-bar__fill" style={{ width: `var(--${t.name})` }} /></span>
          <span className="dsg-bar__value"><Px value={`var(--${t.name})`} vw={vw} /></span>
          {!compact && t.comment && <span className="dsg-bar__note">{t.comment}</span>}
        </li>
      ))}
    </ul>
  );
}

function Shape({ tokens }) {
  const radii = tokens.filter((t) => /^radius-/.test(t.name) && !isPrimitive(t.name));
  const shadows = tokens.filter((t) => /^shadow-/.test(t.name));
  return (
    <Section id="bentuk" title="Bentuk & kesan" lead="Pill untuk apa yang ditekan, kotak membulat lembut untuk apa yang dibaca. Garis rambut, bukan bayang.">
      <Group title="Radius">
        <ul className="dsg-tiles">
          {radii.map((t) => (
            <li key={t.name} className="dsg-tile">
              <span className="dsg-tile__shape" style={{ borderRadius: `var(--${t.name})` }} />
              <Tok>{t.name}</Tok>
              {t.comment && <span className="dsg-tile__note">{t.comment}</span>}
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Bayang" note="Hanya untuk yang terapung: menu, modal, butang AIFA. Kad tidak berbayang.">
        <ul className="dsg-tiles">
          {shadows.map((t) => (
            <li key={t.name} className="dsg-tile">
              <span className="dsg-tile__shape dsg-tile__shape--raised" style={{ boxShadow: `var(--${t.name})` }} />
              <Tok>{t.name}</Tok>
              {t.comment && <span className="dsg-tile__note">{t.comment}</span>}
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Tepi, fokus & tekan">
        <div className="dsg-row">
          <Demo code="--border-width (1px)"><span className="dsg-edge" /></Demo>
          <Demo code="--border-width-hairline (.5px)"><span className="dsg-edge dsg-edge--hairline" /></Demo>
          <Demo code="--focus-ring-* (2px, offset 2px)"><span className="dsg-focus"><Button variant="outline" tabIndex={-1}>Fokus</Button></span></Demo>
          <Demo code="--focus-ring-color-inverse" dark><span className="dsg-focus dsg-focus--inverse"><Button variant="media" tabIndex={-1}>Fokus</Button></span></Demo>
          <Demo code=":active → --press-scale (.97)"><Button variant="secondary">Tekan saya</Button></Demo>
        </div>
      </Group>
    </Section>
  );
}

const ICON_SIZES = [['sm', '14 · dalam badge, meta 12–13'], ['md', '16 · sebelah label, dalam butang (lalai)'], ['lg', '20 · medan, carian'], ['xl', '24 · butang ikon sahaja'], ['display', '40 · keadaan kosong, zon muat naik']];

function Icons() {
  return (
    <Section id="ikon" title="Ikon" lead="Lucide sahaja, melalui <Icon>. Garis 1.75px pada semua saiz, warna ikut teks, saiz ikut nama (bukan nombor).">
      <ul className="dsg-tiles">
        {ICON_SIZES.map(([size, use]) => (
          <li key={size} className="dsg-tile">
            <span className="dsg-tile__icon"><Icon icon={Search} size={size} /></span> {/* ds-allow: specimen loops over the named sizes */}
            <code className="dsg-code">{`size="${size}"`}</code>
            <span className="dsg-tile__note">{use}</span>
          </li>
        ))}
      </ul>
      <div className="dsg-row dsg-row--icons" aria-label="Contoh ikon yang dipakai">
        {[ArrowRight, Search, X, Check, Plus, Download, Share, LinkIcon, Calendar, Flag, CloudUpload, MessageSquareText].map((g, i) => (
          <Icon key={i} icon={g} size="lg" />
        ))}
      </div>
    </Section>
  );
}

const LANGS = [{ value: 'BM', label: 'Bahasa Melayu', lang: 'ms' }, { value: 'EN', label: 'English', lang: 'en' }];

function Components({ vw }) {
  const [chip, setChip] = useState('semua');
  const [tab, setTab] = useState('terkini');
  const [mode, setMode] = useState('grid');
  const [lang, setLang] = useState('BM');
  const dialog = useRef(null);
  const photo = withBase('/images/posts/car.jpg');

  const openModal = () => { dialog.current?.showModal(); dialog.current?.focus(); };

  return (
    <Section id="komponen" title="Komponen" lead="Import daripada @/components/ui. API ikut shadcn/ui (variant + size). Kelas halaman boleh meletakkan komponen, tetapi tidak menukar rupanya.">
      <Group title="Button" note="Satu butang filled per pandangan. Aksi tidak pernah merah.">
        <div className="dsg-demos">
          {['filled', 'outline', 'secondary', 'ghost', 'link'].map((v) => (
            <Demo key={v} code={`<Button variant="${v}">`}>
              <Button variant={v}>Semak dakwaan</Button>
              <Button variant={v} iconEnd={ArrowRight}>Baca lagi</Button>
              <Button variant={v} disabled>Tidak aktif</Button>
            </Demo>
          ))}
          <Demo code='<Button variant="media"> atas foto / gelap' dark>
            <Button variant="media" iconEnd={ArrowRight}>Baca semakan</Button>
          </Demo>
          <Demo code='size="sm" · "md" · "lg"'>
            <Button size="sm">Kecil</Button>
            <Button>Sederhana</Button>
            <Button size="lg">Besar</Button>
          </Demo>
          <Demo code="icon · iconEnd · <ButtonGroup>">
            <ButtonGroup>
              <Button variant="outline" icon={Download}>Muat turun</Button>
              <Button variant="outline" icon={Share}>Kongsi</Button>
            </ButtonGroup>
          </Demo>
          <Demo code='<IconButton label="…" size="icon-sm | icon | icon-lg">'>
            <IconButton icon={X} label="Tutup" size="icon-sm" />
            <IconButton icon={X} label="Tutup" />
            <IconButton icon={X} label="Tutup" size="icon-lg" />
            <IconButton icon={Plus} label="Tambah" variant="filled" />
          </Demo>
        </div>
      </Group>

      <Group title="Chip" note="Cadangan dan penapis. Terpilih = tinta. Titik verdict untuk penapis verdict.">
        <div className="dsg-demos">
          <Demo code='<ChipRow label="Carian popular:">' wide>
            <ChipRow label="Carian popular:">
              <Chip>Bantuan tunai</Chip>
              <Chip>RON95</Chip>
              <Chip>Hujan lebat</Chip>
            </ChipRow>
          </Demo>
          <Demo code="pressed · dot" wide>
            {[['semua', 'Semua'], ['palsu', 'Palsu'], ['makluman', 'Makluman'], ['benar', 'Benar']].map(([id, label]) => (
              <Chip key={id} pressed={chip === id} dot={id === 'semua' ? undefined : id} onClick={() => setChip(id)}>{label}</Chip>
            ))}
          </Demo>
          <Demo code='size="sm" · "md" · "lg"'>
            <Chip size="sm">Kecil</Chip>
            <Chip>Sederhana</Chip>
            <Chip size="lg">Besar</Chip>
          </Demo>
        </div>
      </Group>

      <Group title="Badge & Verdict" note="Bukan kawalan: tidak boleh diklik. Verdict sentiasa titik + perkataan (+ agensi), tidak pernah warna sahaja.">
        <div className="dsg-demos">
          {['muted', 'outline'].map((v) => (
            <Demo key={v} code={`<Badge variant="${v}" size="sm | md | lg">`}>
              <Badge variant={v} size="sm">Kecil</Badge>
              <Badge variant={v}>Kewangan</Badge>
              <Badge variant={v} size="lg" icon={Calendar}>24 Nov 2026</Badge>
            </Demo>
          ))}
          <Demo code='<Badge variant="media">' dark>
            <Badge variant="media">Video</Badge>
            <Badge variant="media" size="lg">Instagram</Badge>
          </Demo>
          <Demo code='<Verdict type="…" agency="…">' wide>
            <Verdict type="palsu" agency="KPDN" />
            <Verdict type="makluman" agency="MOH" />
            <Verdict type="benar" agency="JPJ" />
          </Demo>
          <Demo code='tone="single" · variant="tint" · "plain"' wide>
            <Verdict type="palsu" tone="single" />
            <Verdict type="makluman" variant="tint" />
            <Verdict type="benar" variant="plain" tone="single" />
          </Demo>
          <Demo code='variant="overlay" (atas foto)' wide>
            <span className="dsg-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" />
              <Verdict type="palsu" variant="overlay" agency="MCMC" />
            </span>
          </Demo>
        </div>
      </Group>

      <Group title="Tabs" note='mode="tabs" untuk menukar paparan (anak panah papan kekunci); mode="toggle" untuk tetapan.'>
        <div className="dsg-demos">
          <Demo code='<Tabs mode="tabs">'>
            <Tabs label="Susun" value={tab} onChange={setTab}
              items={[{ value: 'terkini', label: 'Terkini' }, { value: 'popular', label: 'Popular' }, { value: 'lama', label: 'Lama' }]} />
          </Demo>
          <Demo code='<Tabs mode="toggle">'>
            <Tabs label="Paparan" mode="toggle" value={mode} onChange={setMode}
              items={[{ value: 'grid', label: 'Grid' }, { value: 'senarai', label: 'Senarai' }]} />
          </Demo>
        </div>
      </Group>

      <Group title="Carian" note='size="lg" (xl, carian utama sahaja) · "md" · "sm" (toolbar). buttonLabel={null} untuk tapisan langsung.'>
        <div className="dsg-demos dsg-demos--stack">
          <Measured vw={vw} label='<SearchField size="lg">'>
            <SearchField hideLabel placeholder="Contoh: bantuan tunai WhatsApp" onSubmit={() => {}} />
          </Measured>
          <Measured vw={vw} label='<SearchField size="md">'>
            <SearchField hideLabel size="md" onSubmit={() => {}} />
          </Measured>
          <Measured vw={vw} label='<SearchField size="sm" buttonLabel={null}>'>
            <SearchField hideLabel size="sm" buttonLabel={null} placeholder="Tapis artikel…" onSubmit={() => {}} />
          </Measured>
          <Demo code="error" wide>
            <SearchField label="Cari dakwaan" error="Masukkan sekurang-kurangnya 3 aksara." onSubmit={() => {}} />
          </Demo>
        </div>
      </Group>

      <Group title="Borang" note="Field menyambung id, aria-invalid dan aria-describedby kepada medan di dalamnya. Label sentiasa kelihatan.">
        <div className="dsg-form">
          <Field label="Nama penuh" required hint="Seperti dalam kad pengenalan.">
            <Input name="nama" autoComplete="name" />
          </Field>
          <Field label="E-mel" error="Format e-mel tidak sah.">
            <Input type="email" name="email" defaultValue="nama@" />
          </Field>
          <Field label="Kategori">
            <Select name="kategori" defaultValue="kewangan">
              <option value="kewangan">Kewangan</option>
              <option value="kesihatan">Kesihatan</option>
              <option value="cuaca">Cuaca</option>
            </Select>
          </Field>
          <Field label="Tapis" hideLabel>
            <Input pill icon={Search} placeholder="Input pill dengan ikon" />
          </Field>
          <Field label="Butiran dakwaan" className="dsg-form__full">
            <Textarea name="butiran" placeholder="Tampal mesej atau terangkan dakwaan…" />
          </Field>
          <div className="dsg-form__full dsg-row">
            <Measured vw={vw} label='<Input size="sm">'><Input size="sm" placeholder="sm" aria-label="Contoh saiz sm" /></Measured>
            <Measured vw={vw} label="<Input>"><Input placeholder="md" aria-label="Contoh saiz md" /></Measured>
            <Measured vw={vw} label='<Input size="lg">'><Input size="lg" placeholder="lg" aria-label="Contoh saiz lg" /></Measured>
          </div>
        </div>
      </Group>

      <Group title="Navigasi & menu" note="Satu permukaan menu untuk dropdown nav, bahasa dan Kongsi: 150ms masuk dari sudut pencetus.">
        <div className="dsg-demos">
          <Demo code="<NavLink current>">
            <NavLink href="#komponen" current>Utama</NavLink>
            <NavLink href="#komponen">Artikel</NavLink>
          </Demo>
          <Demo code="<DropdownMenu>">
            <DropdownMenu label="Lompat ke" items={[{ label: 'Warna', href: '#warna' }, { label: 'Tipografi', href: '#tipografi' }, { label: 'Ikon', href: '#ikon' }]} />
          </Demo>
          <Demo code="<LanguageMenu>">
            <LanguageMenu items={LANGS} value={lang} onChange={setLang} groupLabel="Bahasa" align="start" />
          </Demo>
        </div>
      </Group>

      <Group title="Modal" note=".ui-modal pada <dialog> dengan showModal(): scrim tinta 60%, radius kad besar, 250ms masuk dan keluar.">
        <Demo code='<dialog className="ui-modal">'>
          <Button variant="outline" onClick={openModal}>Buka modal</Button>
        </Demo>
        <dialog
          ref={dialog}
          tabIndex={-1}
          className="ui-modal dsg-modal"
          aria-labelledby="dsg-modal-title"
          onClick={(e) => e.target === e.currentTarget && dialog.current.close()}
        >
          <h2 className="dsg-modal__title" id="dsg-modal-title">Salur kepada kami</h2>
          <p className="dsg-modal__text">Contoh modal. Tutup dengan butang, Escape, atau klik pada scrim.</p>
          <ButtonGroup>
            <Button onClick={() => dialog.current.close()}>Faham</Button>
            <Button variant="outline" onClick={() => dialog.current.close()}>Batal</Button>
          </ButtonGroup>
        </dialog>
      </Group>
    </Section>
  );
}

function Motion({ tokens }) {
  const [on, setOn] = useState(false);
  const durations = tokens.filter((t) => /^duration-/.test(t.name));
  const eases = tokens.filter((t) => /^ease-/.test(t.name));
  return (
    <Section id="gerakan" title="Gerakan" lead="Bergerak dengan tujuan, 150–600ms, ease-out. Satu entrance per halaman semasa dimuat. prefers-reduced-motion mematikan pergerakan.">
      <div className="dsg-row">
        <Button variant="outline" onClick={() => setOn((v) => !v)} aria-pressed={on}>{on ? 'Kembali' : 'Main'}</Button>
      </div>
      <Group title="Tempoh">
        <ul className={`dsg-motion${on ? ' is-on' : ''}`}>
          {durations.map((t) => (
            <li key={t.name} className="dsg-motion__row">
              <span className="dsg-motion__label"><Tok>{t.name}</Tok> <span className="dsg-live">{t.value}</span></span>
              <span className="dsg-motion__track">
                <span className="dsg-motion__dot" style={{ '--dsg-duration': `var(--${t.name})`, '--dsg-ease': 'var(--ease-out)' }} />
              </span>
              {t.comment && <span className="dsg-motion__note">{t.comment}</span>}
            </li>
          ))}
        </ul>
      </Group>
      <Group title="Easing" note="Sama tempoh (--duration-slower), lengkung berbeza.">
        <ul className={`dsg-motion${on ? ' is-on' : ''}`}>
          {eases.map((t) => (
            <li key={t.name} className="dsg-motion__row">
              <span className="dsg-motion__label"><Tok>{t.name}</Tok></span>
              <span className="dsg-motion__track">
                <span className="dsg-motion__dot" style={{ '--dsg-duration': 'var(--duration-slower)', '--dsg-ease': `var(--${t.name})` }} />
              </span>
              {t.comment && <span className="dsg-motion__note">{t.comment}</span>}
            </li>
          ))}
        </ul>
      </Group>
    </Section>
  );
}

const BREAKPOINTS = [
  ['1280', 'xl', 'Gutter halaman 96 → 48'],
  ['1100', 'lg', 'Nav runtuh ke header kompak'],
  ['900', 'md', 'Grid dan susun atur sebelah-menyebelah jadi satu lajur'],
  ['600', 'sm', 'Telefon: gutter 16, helaian skrin penuh'],
];

function Layout({ tokens, vw }) {
  const layers = tokens.filter((t) => /^z-/.test(t.name));
  const measures = tokens.filter((t) => /^measure-/.test(t.name));
  const active = BREAKPOINTS.filter(([w]) => vw && vw <= Number(w)).map(([, n]) => n).pop();
  return (
    <Section id="susun-atur" title="Susun atur" lead="Empat breakpoint sahaja (max-width, mobile terakhir). Lapisan z-index global melalui token.">
      <Group title="Breakpoint" note={vw ? `Skrin ini ${vw}px${active ? `: breakpoint ${active} aktif` : ': desktop penuh'}.` : null}>
        <div className="dsg-table-wrap">
          <table className="dsg-table">
            <thead><tr><th>Lebar</th><th>Nama</th><th>Apa yang berubah</th></tr></thead>
            <tbody>
              {BREAKPOINTS.map(([w, n, what]) => (
                <tr key={w} className={active === n ? 'is-active' : undefined}><td>≤ {w}px</td><td>{n}</td><td>{what}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>
      <Group title="Lapisan & lebar baca">
        <div className="dsg-table-wrap">
          <table className="dsg-table">
            <thead><tr><th>Token</th><th>Nilai</th><th>Guna</th></tr></thead>
            <tbody>
              {[...layers, ...measures].map((t) => (
                <tr key={t.name}><td><Tok>{t.name}</Tok></td><td>{t.value}</td><td>{t.comment}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>
    </Section>
  );
}

function AllTokens({ tokens }) {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = new Map();
    for (const t of tokens) {
      if (needle && !`${t.name} ${t.value} ${t.comment}`.toLowerCase().includes(needle)) continue;
      if (!out.has(t.group)) out.set(t.group, []);
      out.get(t.group).push(t);
    }
    return [...out];
  }, [tokens, q]);
  const count = groups.reduce((n, [, list]) => n + list.length, 0);

  return (
    <Section id="semua-token" title="Semua token" lead={`Senarai penuh daripada app/tokens.css (${tokens.length} token), dibaca semasa build. Primitive hanya untuk tokens.css.`}>
      <div className="dsg-row">
        <Field label="Cari token" hideLabel>
          <Input pill icon={Search} placeholder="Cari token, nilai atau catatan…" value={q} onChange={(e) => setQ(e.target.value)} />
        </Field>
        <span className="dsg-live" aria-live="polite">{count} token</span>
      </div>
      {groups.map(([group, list]) => (
        <Group key={group} title={group}>
          <div className="dsg-table-wrap">
            <table className="dsg-table dsg-table--tokens">
              <thead><tr><th>Token</th><th>Nilai</th><th>Catatan</th></tr></thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.name}>
                    <td>
                      <Tok>{t.name}</Tok>
                      {isPrimitive(t.name) && <Badge size="sm" variant="outline">primitive</Badge>}
                    </td>
                    <td className="dsg-table__value">{t.value}</td>
                    <td>{t.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Group>
      ))}
    </Section>
  );
}

export default function DesignSystemGuide({ tokens }) {
  const vw = useViewportWidth();
  return (
    <>
      <section className="dsg-section dsg-intro" aria-labelledby="dsg-title">
        <p className="dsg-intro__eyebrow">Rujukan dalaman</p>
        <h1 className="dsg-intro__title" id="dsg-title">Design system</h1>
        <p className="dsg-intro__lead">
          Satu sistem untuk laman web, CMS dashboard dan browser extension. Semua di halaman ini dirender
          daripada kod sebenar: <code className="dsg-code">app/tokens.css</code>, <code className="dsg-code">app/ui.css</code> dan{' '}
          <code className="dsg-code">components/ui/</code>. Jika dokumen bercanggah dengan halaman ini, halaman ini yang betul.
          Peraturan penuh: <code className="dsg-code">docs/design-system-rules.md</code>.
        </p>
        {vw > 0 && <p className="dsg-live">Lebar skrin sekarang: {vw}px. Saiz fluid berubah antara 375 dan 1280px.</p>}
        <nav aria-label="Kandungan halaman">
          <ChipRow>
            {SECTIONS.map(([id, label]) => <Chip key={id} href={`#${id}`} size="sm">{label}</Chip>)}
          </ChipRow>
        </nav>
      </section>

      <Colours tokens={tokens} vw={vw} />
      <Typography tokens={tokens} vw={vw} />
      <Sizes tokens={tokens} vw={vw} />
      <Shape tokens={tokens} />
      <Icons />
      <Components vw={vw} />
      <DesignSystemDashboard />
      <Motion tokens={tokens} />
      <Layout tokens={tokens} vw={vw} />
      <AllTokens tokens={tokens} />
    </>
  );
}
