'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { heroSlides } from '@/data/content';
import { articleHref, getArticle } from '@/lib/articles';
import { withBase } from '@/lib/basePath';

// Each slide points at an article; it links to that article and falls back to its image.
// `eyebrow` is "Verdict | Agency" (e.g. "Palsu | KPDN"); the verdict sets the dot colour.
const VERDICTS = ['palsu', 'waspada', 'makluman', 'benar'];
const slides = heroSlides.map((s) => {
  const article = getArticle(s.slug);
  const [verdict = '', agency = ''] = s.eyebrow.split('|').map((x) => x.trim());
  const type = verdict.toLowerCase();
  return {
    ...s,
    verdict,
    agency,
    type: VERDICTS.includes(type) ? type : 'makluman',
    href: withBase(articleHref(article)),
    image: s.image || article.image,
  };
});

const COUNT = slides.length;
const DELAY = 6000; // autoplay interval, matches the dot fill animation in global.css
const GAP = 20; // .gtrack gap
const START = Math.min(2, COUNT - 1); // open on the 3rd slide

const pad = (n) => String(n).padStart(2, '0');

/**
 * Hero carousel (Paper › Home › HeroCarousel).
 * Auto-advances every 6s; only the centre slide shows its text, the neighbours
 * peek in as images. Pause button, dots, drag/swipe, trackpad and arrow keys.
 * Starts paused when the user prefers reduced motion.
 */
export default function Carousel() {
  const galRef = useRef(null);
  const trackRef = useRef(null);
  const indexRef = useRef(START);
  const [index, setIndex] = useState(START);
  const [tick, setTick] = useState(0); // bumps on every move so the timer and dot fill restart
  const [playing, setPlaying] = useState(true);

  const slideW = () => {
    const first = trackRef.current?.firstElementChild;
    return first ? first.getBoundingClientRect().width + GAP : 0;
  };

  const go = useCallback((i) => {
    const next = (i + COUNT) % COUNT;
    indexRef.current = next;
    setIndex(next);
    setTick((t) => t + 1);
  }, []);

  // Respect reduced motion: no autoplay
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

  // Move the track
  useEffect(() => {
    trackRef.current.style.transform = `translateX(${-index * slideW()}px)`;
  }, [index, tick]);

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(indexRef.current + 1), DELAY);
    return () => clearTimeout(t);
  }, [playing, index, tick, go]);

  // Re-align on resize
  useEffect(() => {
    const onResize = () => go(indexRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [go]);

  // Drag / swipe with mouse, pen or finger; trackpad two-finger swipe; arrow keys
  useEffect(() => {
    const gal = galRef.current;
    const track = trackRef.current;
    let start = null;
    let moved = false;
    let wheelLock = false;

    const down = (e) => {
      if (e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, base: -indexRef.current * slideW(), id: e.pointerId };
      moved = false;
    };

    const move = (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!moved) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { start = null; return; }
        moved = true;
        gal.classList.add('drag');
        try { gal.setPointerCapture(start.id); } catch {}
      }
      const i = indexRef.current;
      const edge = (i === 0 && dx > 0) || (i === COUNT - 1 && dx < 0) ? 0.35 : 1;
      track.style.transform = `translateX(${start.base + dx * edge}px)`;
    };

    const end = (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      start = null;
      gal.classList.remove('drag');
      if (!moved) return;
      const w = slideW();
      const i = indexRef.current;
      if (dx < -w * 0.12) go(Math.min(i + 1, COUNT - 1));
      else if (dx > w * 0.12) go(Math.max(i - 1, 0));
      else go(i);
    };

    // Swallow the click that follows a drag. A click on a side slide brings it to
    // the centre; a click on the centre slide opens its article.
    const click = (e) => {
      if (moved) {
        moved = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.target.closest('.hcta')) return;
      const slide = e.target.closest('.slide');
      if (!slide) return;
      const i = +slide.dataset.i;
      if (i === indexRef.current) window.location.href = slides[i].href;
      else go(i);
    };

    const key = (e) => {
      if (e.key === 'ArrowRight') go(indexRef.current + 1);
      if (e.key === 'ArrowLeft') go(indexRef.current - 1);
    };

    const wheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      go(indexRef.current + (e.deltaX > 0 ? 1 : -1));
      setTimeout(() => { wheelLock = false; }, 800);
    };

    gal.addEventListener('pointerdown', down);
    gal.addEventListener('pointermove', move);
    gal.addEventListener('pointerup', end);
    gal.addEventListener('pointercancel', end);
    gal.addEventListener('click', click, true);
    gal.addEventListener('keydown', key);
    gal.addEventListener('wheel', wheel, { passive: false });
    return () => {
      gal.removeEventListener('pointerdown', down);
      gal.removeEventListener('pointermove', move);
      gal.removeEventListener('pointerup', end);
      gal.removeEventListener('pointercancel', end);
      gal.removeEventListener('click', click, true);
      gal.removeEventListener('keydown', key);
      gal.removeEventListener('wheel', wheel);
    };
  }, [go]);

  const togglePlay = () => {
    if (!playing) go(indexRef.current + 1);
    setPlaying(!playing);
  };

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="Semakan fakta pilihan">
      <div className="gal" ref={galRef} tabIndex={0} aria-live={playing ? 'off' : 'polite'}>
        {/* Initial offset in CSS so the page loads already on START, with no slide-in from the first card */}
        <div className="gtrack" ref={trackRef} style={{ transform: `translateX(calc(${-START} * (var(--w) + ${GAP}px)))` }}>
          {slides.map((s, i) => {
            const cur = i === index;
            return (
              <div
                key={s.href}
                className={`slide hs${s.position ? ' dk' : ''}${s.wide ? ' wd' : ''}${cur ? ' cur' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} daripada ${COUNT}`}
                aria-hidden={!cur}
                data-i={i}
              >
                <img
                  src={s.image}
                  alt=""
                  draggable={false}
                  style={s.position ? { objectPosition: s.position } : undefined}
                />
                {/* Text shows on the centre slide only */}
                <div className="ct">
                  <span className={`ey ey--${s.type}`}>
                    <span className="ey-dot" aria-hidden="true" />
                    {s.verdict}
                    {s.agency && <> · {s.agency}</>}
                  </span>
                  <h3>
                    {s.title}
                    <br />
                    {s.titleEm}
                  </h3>
                  <p>{s.text}</p>
                  <a className="hcta" href={s.href} draggable={false} tabIndex={cur ? 0 : -1}>
                    {s.cta}
                    <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
                      <path d="M1 6h11M8 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                {cur && (
                  <span className="hcnt">
                    {pad(index + 1)} / {pad(COUNT)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`gctl${playing ? '' : ' paused'}`}>
        <div className="dots" role="tablist" aria-label="Pilih slaid">
          {slides.map((s, i) => (
            <button
              key={s.href}
              type="button"
              role="tab"
              aria-label={`Slaid ${i + 1}: ${s.title} ${s.titleEm}`}
              aria-selected={i === index}
              className={i === index ? 'on run' : undefined}
              onClick={() => go(i)}
            >
              <i key={i === index ? tick : undefined} />
            </button>
          ))}
        </div>
        <button type="button" className="play" aria-label={playing ? 'Jeda slaid' : 'Main slaid'} onClick={togglePlay}>
          <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
            {playing ? (
              <>
                <rect x="2" y="2" width="3" height="12" rx="1" />
                <rect x="9" y="2" width="3" height="12" rx="1" />
              </>
            ) : (
              <path d="M3 2v12l10-6z" />
            )}
          </svg>
        </button>
      </div>
    </section>
  );
}
