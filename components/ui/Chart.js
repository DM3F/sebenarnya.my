'use client';

import { useId } from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import Icon from './Icon';

/*
 * Charts and meters (design.md §4): monochrome, one series in ink, hairline grid, direct
 * labels used sparingly, no legend for a single series (the title names it). Text uses
 * text tokens, never the data colour. Every chart carries its numbers as text too (a value
 * column or a screen-reader table), so nothing depends on seeing the shape.
 * Two measures with different scales get two charts: never a second axis.
 */

const nf = (n) => Number(n).toLocaleString('ms-MY');
// Axis ticks: in full under 10,000, compact above (10K, 20K)
const tickFmt = (n) => (Math.abs(n) >= 10000 ? new Intl.NumberFormat('ms-MY', { notation: 'compact' }).format(n) : nf(n));
// A round ceiling for the axis: 1, 2, 2.5, 5 or 10 × a power of ten
function niceMax(v) {
  if (!(v > 0)) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

/**
 * Meter — how far along, or how much of a whole (a score, a quota, progress of a review).
 *   value · max (100) · label · valueText (what is read out and shown, default "62%") · hint
 */
export function Meter({ value, max = 100, label, valueText, hint, className = '' }) {
  const id = useId();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const text = valueText ?? `${Math.round(pct)}%`;
  return (
    <div className={`ui-meter ${className}`.trim()}>
      <div className="ui-meter__head">
        <span className="ui-meter__label" id={`${id}-l`}>{label}</span>
        <span className="ui-meter__value">{text}</span>
      </div>
      <div
        role="meter"
        aria-labelledby={`${id}-l`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={text}
        className="ui-meter__track"
      >
        <span className="ui-meter__fill" style={{ inlineSize: `${pct}%` }} />
      </div>
      {hint && <span className="ui-meter__hint">{hint}</span>}
    </div>
  );
}

/**
 * BarList — a ranked list with a bar under each value (semakan per agensi, top claims).
 * The numbers are printed, so the bars only show proportion.
 *   title · data [{ label, value, href? }] (sorted for you, largest first) · format(value) · limit
 */
export function BarList({ title, data, format = nf, limit, className = '' }) {
  const rows = [...data].sort((a, b) => b.value - a.value).slice(0, limit ?? data.length);
  const max = Math.max(...rows.map((r) => r.value), 0) || 1;
  return (
    <figure className={`ui-barlist ${className}`.trim()}>
      {title && <figcaption className="ui-chart__title">{title}</figcaption>}
      <ul className="ui-barlist__list">
        {rows.map((r) => (
          <li key={r.label} className="ui-barlist__row">
            {r.href ? <a className="ui-barlist__label" href={r.href}>{r.label}</a> : <span className="ui-barlist__label">{r.label}</span>}
            <span className="ui-barlist__value">{format(r.value)}</span>
            <span className="ui-barlist__bar" aria-hidden="true"><span style={{ inlineSize: `${(r.value / max) * 100}%` }} /></span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/**
 * BarChart — one measure over time or across a few categories (semakan sehari, 14 hari).
 *   title · description · data [{ label, value }] in display order · format(value)
 *   Hover a column for its value; the latest value is labelled on its cap. A screen-reader
 *   table carries every value. Up to ~31 columns; more than that, aggregate (weeks).
 */
export function BarChart({ title, description, data, format = nf, className = '' }) {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const ticks = [max, max / 2, 0];
  const every = Math.ceil(data.length / 8); // at most ~8 x labels, so they never collide
  const last = data.length - 1;
  return (
    <figure className={`ui-chart ${className}`.trim()}>
      {(title || description) && (
        <figcaption className="ui-chart__head">
          {title && <span className="ui-chart__title">{title}</span>}
          {description && <span className="ui-chart__description">{description}</span>}
        </figcaption>
      )}
      <div className="ui-chart__body" aria-hidden="true">
        <div className="ui-chart__axis">
          {ticks.map((t) => <span key={t}>{tickFmt(t)}</span>)}
        </div>
        <div className="ui-chart__plot">
          {ticks.map((t) => <span key={t} className="ui-chart__grid" style={{ insetBlockEnd: `${(t / max) * 100}%` }} />)}
          <div className="ui-chart__cols">
            {data.map((d, i) => (
              <div key={d.label} className="ui-chart__col">
                <span className="ui-chart__bar" style={{ blockSize: `${(d.value / max) * 100}%` }}>
                  {i === last && <span className="ui-chart__cap">{format(d.value)}</span>}
                </span>
                <span className="ui-chart__tip"><span>{d.label}</span><strong>{format(d.value)}</strong></span>
              </div>
            ))}
          </div>
        </div>
        <div className="ui-chart__xaxis">
          {data.map((d, i) => <span key={d.label}>{i === last || (i % every === 0 && last - i >= every) ? d.label : ''}</span>)}
        </div>
      </div>
      <table className="ui-sr-only">
        {title && <caption>{title}</caption>}
        <tbody>{data.map((d) => <tr key={d.label}><th scope="row">{d.label}</th><td>{format(d.value)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

/**
 * Stat — one number that matters, its change, and an optional trend line.
 *   label · value (already formatted) · delta (number, e.g. 12.5 = +12.5%) · deltaLabel ("berbanding minggu lepas")
 *   trend [numbers] draws a sparkline (decorative: the delta text says the same in words)
 *   Change is told by sign, arrow and words; not by red and green (a rise is not always good).
 */
export function Stat({ label, value, delta, deltaLabel, trend, className = '' }) {
  const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : '';
  return (
    <div className={`ui-stat ${className}`.trim()}>
      <span className="ui-stat__label">{label}</span>
      <span className="ui-stat__value">{value}</span>
      {delta != null && (
        <span className="ui-stat__delta">
          <Icon icon={dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus} size="sm" />
          <span>{sign}{nf(Math.abs(delta))}%{deltaLabel ? ` ${deltaLabel}` : ''}</span>
        </span>
      )}
      {trend?.length > 1 && <Sparkline data={trend} />}
    </div>
  );
}

/** Sparkline — a 2px trend line with a soft wash and the latest point marked. Decorative. */
export function Sparkline({ data, className = '' }) {
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const span = hi - lo || 1;
  // 0–100 viewBox; 4% headroom top and bottom so the line and dot never touch the edge
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, 96 - ((v - lo) / span) * 92]);
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const [ex, ey] = pts[pts.length - 1];
  return (
    <span className={`ui-sparkline ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
        <polygon className="ui-sparkline__area" points={`0,100 ${line} 100,100`} />
        <polyline className="ui-sparkline__line" points={line} />
      </svg>
      <span className="ui-sparkline__dot" style={{ insetInlineStart: `${ex}%`, insetBlockStart: `${ey}%` }} />
    </span>
  );
}
