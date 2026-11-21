'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Chip, IconButton, Input, SearchField, Select, Verdict } from '@/components/ui';
import { articles, articleStatus } from '@/data/content';
import { matchesQuery } from '@/lib/searchArticles';
import { agencyInitials, articleHref, formatDate } from '@/lib/articles';

const DATE_OPTIONS = [
  { id: 'all', label: 'Semua tarikh' },
  { id: '7', label: '7 hari lepas' },
  { id: '30', label: '30 hari lepas' },
  { id: '90', label: '3 bulan lepas' },
  { id: 'year', label: 'Tahun ini' },
  { id: 'custom', label: 'Pilih tarikh' },
];

// Result order. Titles compare in Malay so A–Z follows the alphabet, ignoring case.
const SORT_OPTIONS = [
  { id: 'newest', label: 'Terbaru dahulu', compare: (a, b) => b.date.localeCompare(a.date) },
  { id: 'oldest', label: 'Terlama dahulu', compare: (a, b) => a.date.localeCompare(b.date) },
  { id: 'az', label: 'Tajuk A–Z', compare: (a, b) => a.title.localeCompare(b.title, 'ms', { sensitivity: 'base' }) },
  { id: 'za', label: 'Tajuk Z–A', compare: (a, b) => b.title.localeCompare(a.title, 'ms', { sensitivity: 'base' }) },
];

// Category chips: three verdicts only
const CHIP_IDS = ['palsu', 'benar', 'makluman'];

const pad = (n) => String(n).padStart(2, '0');

// Local date as YYYY-MM-DD, so dates can be compared as plain strings
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Earliest/latest date (YYYY-MM-DD) allowed by the date filter
function dateBounds(range, from, to) {
  const today = new Date();
  if (range === 'custom') return { min: from, max: to };
  if (range === 'year') return { min: `${today.getFullYear()}-01-01` };
  if (range === 'all') return {};
  const start = new Date(today);
  start.setDate(today.getDate() - (Number(range) - 1));
  return { min: toISO(start) };
}

function filterArticles(query, category, range, from, to, sort) {
  const { min, max } = dateBounds(range, from, to);
  const { compare } = SORT_OPTIONS.find((o) => o.id === sort) || SORT_OPTIONS[0];
  return articles
    .filter((a) => matchesQuery(a, query))
    .filter((a) => category === 'all' || a.status === category || a.categories.includes(category))
    .filter((a) => (!min || a.date >= min) && (!max || a.date <= max))
    .sort(compare);
}

/**
 * Artikel page.
 * Filters: search, date range, sort, result count, category chips.
 * Results: a 4-column card grid.
 */
export default function Articles() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [range, setRange] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('newest');

  // Category row scrolling: which arrows can be used
  const barRef = useRef(null);
  const [scroll, setScroll] = useState({ overflow: false, prev: false, next: false });

  const updateScroll = () => {
    const bar = barRef.current;
    if (!bar) return;
    const max = bar.scrollWidth - bar.clientWidth;
    setScroll({ overflow: max > 1, prev: bar.scrollLeft > 1, next: bar.scrollLeft < max - 1 });
  };

  const scrollBar = (dir) => {
    const bar = barRef.current;
    bar.scrollBy({ left: dir * bar.clientWidth * 0.7, behavior: 'smooth' });
  };

  useEffect(() => {
    updateScroll();
    const observer = new ResizeObserver(updateScroll);
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  // Keyword from the hero search (/article?q=...)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setQuery(q);
  }, []);

  // Keep ?q= in the URL in sync, so the results can be shared or reloaded
  const changeQuery = (value) => {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set('q', value.trim());
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  };

  const list = filterArticles(query, category, range, from, to, sort);
  const chips = CHIP_IDS.map((id) => ({ id, label: articleStatus[id]?.label ?? id }));

  const reset = () => {
    changeQuery('');
    setCategory('all');
    setRange('all');
    setFrom('');
    setTo('');
    setSort('newest');
  };

  return (
    <section className="articles">
      {/* Page heading for screen readers only */}
      <h1 className="sr-only">Artikel semakan fakta</h1>

      <div className="articles-filters">
        {/* Search + date range + sort + count */}
        <div className="articles-toolbar">
          <SearchField
            size="sm"
            label="Cari artikel"
            hideLabel
            placeholder="Cari artikel…"
            buttonLabel={null}
            value={query}
            onChange={changeQuery}
            onSubmit={() => {}}
            className="articles-search"
          />

          <Select pill aria-label="Tapis mengikut tarikh" value={range} onChange={(e) => setRange(e.target.value)} className="articles-select">
            {DATE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </Select>

          <Select pill aria-label="Susun mengikut" value={sort} onChange={(e) => setSort(e.target.value)} className="articles-select">
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </Select>

          <p className="articles-count" aria-live="polite">{list.length} artikel</p>
        </div>

        {range === 'custom' && (
          <div className="articles-range">
            <label className="ui-field">
              <span className="ui-label">Dari</span>
              <Input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label className="ui-field">
              <span className="ui-label">Hingga</span>
              <Input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
            </label>
          </div>
        )}

        {/* Category chips: one line, scrolls sideways with the arrows when it overflows */}
        <div className={`articles-chips${scroll.overflow ? ' has-overflow' : ''}`}>
          <IconButton
            icon={ChevronLeft}
            label="Kategori sebelumnya"
            className="articles-chips__arrow"
            disabled={!scroll.prev}
            onClick={() => scrollBar(-1)}
          />

          <div
            className={`articles-chips__bar${scroll.prev ? ' fade-start' : ''}${scroll.next ? ' fade-end' : ''}`}
            ref={barRef}
            role="toolbar"
            aria-label="Tapis mengikut kategori"
            onScroll={updateScroll}
          >
            {[{ id: 'all', label: 'Semua' }, ...chips].map((c) => (
              <Chip
                key={c.id}
                dot={articleStatus[c.id] ? c.id : undefined}
                pressed={category === c.id}
                onClick={(e) => {
                  setCategory(c.id);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                }}
              >
                {c.label}
              </Chip>
            ))}
          </div>

          <IconButton
            icon={ChevronRight}
            label="Kategori seterusnya"
            className="articles-chips__arrow"
            disabled={!scroll.next}
            onClick={() => scrollBar(1)}
          />
        </div>
      </div>

      {/* Results */}
      {list.length > 0 ? (
        <ul className="articles-grid">
          {list.map((a) => (
            <li key={a.slug}>
              <GridCard article={a} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="articles-empty" role="status">
          <p>
            {query.trim()
              ? `Tiada artikel dijumpai untuk “${query.trim()}”. Cuba kata kunci lain atau ubah tapisan.`
              : 'Tiada artikel untuk tapisan ini.'}
          </p>
          <Button variant="outline" onClick={reset}>Set semula tapisan</Button>
        </div>
      )}
    </section>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────────────── */

// Verdict pill over a photo: dot + uppercase word, colour from the verdict tokens
function VerdictTag({ status }) {
  return <Verdict type={status} variant="overlay" label={articleStatus[status]?.label} className="verdict-tag" />;
}

function AgencyAvatar({ agency }) {
  return (
    <span className="agency-avatar" title={agency.name}>
      {agency.image ? (
        <img src={agency.image} alt={agency.name} loading="lazy" />
      ) : (
        <span className="agency-avatar__initials" role="img" aria-label={agency.name}>
          {agencyInitials(agency.name)}
        </span>
      )}
    </span>
  );
}

// The title link stretches over the whole card, so the card is one click target
function GridCard({ article }) {
  return (
    <article className="articles-card">
      <div className="articles-card__media">
        <img src={article.image} alt={article.alt} loading="lazy" />
        <VerdictTag status={article.status} />
        <AgencyAvatar agency={article.agency} />
      </div>
      <div className="articles-card__body">
        <h3 className="articles-card__title">
          <Link href={articleHref(article)} className="card-link">{article.title}</Link>
        </h3>
        <time className="articles-card__date" dateTime={article.date}>{formatDate(article.date)}</time>
      </div>
    </article>
  );
}
