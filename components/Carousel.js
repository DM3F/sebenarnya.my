'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { heroSlides } from '@/data/content';
import { articleHref, getArticle } from '@/lib/articles';
import { withBase } from '@/lib/basePath';
import { ArrowRight } from 'lucide-react';
import { PauseFilled, PlayFilled } from '@/components/ui/filledIcons';
import { Button, IconButton, Verdict } from '@/components/ui';

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
const HALF = Math.floor(COUNT / 2);
const DELAY = 6000; // autoplay interval, matches the dot fill animation in global.css
const START = Math.min(2, COUNT - 1); // open on the 3rd slide
const TAU = 0.11; // seconds; exponential ease toward the target (interruptible, no fixed duration)

const wrap = (n) => ((n % COUNT) + COUNT) % COUNT;

/**
 * Hero carousel.
 * Infinite loop: slides are placed around a continuous position, so there is no first or last.
 * Auto-advances every 6s; only the centre slide shows its text.
 * Pause button, dots, drag/swipe with momentum, trackpad and arrow keys.
 * Reduced motion: no autoplay and moves jump instead of gliding.
 */
export default function Carousel() {
  const galRef = useRef(null);
  const slideRefs = useRef([]);
  const st = useRef({ pos: START, target: START, raf: 0, last: 0, drag: null, w: 0, h: 0, vw: 0, gap: 20, idx: START, reduce: false });
  const [index, setIndex] = useState(START);
  const [tick, setTick] = useState(0); // bumps on every move so the timer and dot fill restart
  const [playing, setPlaying] = useState(true);

  // Lay every slide out around the current position
  const layout = useCallback(() => {
    const s = st.current;
    const { w, vw, gap } = s;
    if (!w || !vw) return;
    const step = w + gap;
    const base = Math.floor(s.pos);
    const frac = s.pos - base;

    for (let i = 0; i < COUNT; i++) {
      const el = slideRefs.current[i];
      if (!el) continue;
      const slot = wrap(i - base + HALF) - HALF; // -HALF … HALF around the centre
      const x = slot * step - frac * step; // slide centre relative to the stage centre
      el.style.transform = `translate3d(${(x - w / 2).toFixed(2)}px,0,0)`;
      const hidden = Math.abs(x) - w / 2 > vw / 2 + 40;
      el.style.visibility = hidden ? 'hidden' : '';

    }

    const idx = wrap(Math.round(s.pos));
    if (idx !== s.idx) {
      s.idx = idx;
      setIndex(idx);
    }
  }, []);

  // Glide pos toward target each frame until it settles
  const animate = useCallback(() => {
    const s = st.current;
    if (s.raf) return;
    s.last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - s.last) / 1000));
      s.last = now;
      if (!s.drag) s.pos += (s.target - s.pos) * (s.reduce ? 1 : 1 - Math.exp(-dt / TAU));
      if (!s.drag && Math.abs(s.target - s.pos) < 5e-4) s.pos = s.target;
      layout();
      s.raf = !s.drag && s.pos === s.target ? 0 : requestAnimationFrame(frame);
    };
    s.raf = requestAnimationFrame(frame);
  }, [layout]);

  // Move by a number of slides (wraps forever)
  const step = useCallback((n) => {
    const s = st.current;
    s.target = Math.round(s.target) + n;
    setTick((t) => t + 1);
    animate();
  }, [animate]);

  // Go to slide i the short way round
  const go = useCallback((i) => {
    const s = st.current;
    const from = Math.round(s.target);
    const diff = wrap(i - from + HALF) - HALF;
    step(diff);
  }, [step]);

  // Measure, and re-measure on resize
  useEffect(() => {
    const s = st.current;
    const gal = galRef.current;
    s.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (s.reduce) setPlaying(false);
    const measure = () => {
      const phone = window.matchMedia('(max-width: 700px)').matches;
      s.gap = phone ? 12 : 20;
      const first = slideRefs.current[0];
      s.w = first?.offsetWidth ?? 0;
      s.h = Math.max(...slideRefs.current.map((el) => el?.offsetHeight ?? 0));
      s.vw = gal.clientWidth;
      gal.style.setProperty('--h', `${s.h}px`);
      layout();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(gal);
    measure();
    gal.classList.add('ready');
    return () => {
      ro.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [layout]);

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => step(1), DELAY);
    return () => clearTimeout(t);
  }, [playing, index, tick, step]);

  // Drag / swipe with momentum, trackpad two-finger swipe, arrow keys
  useEffect(() => {
    const gal = galRef.current;
    const s = st.current;
    let swallow = false;
    let wheelTimer;

    const down = (e) => {
      if (!e.isPrimary || e.button !== 0) return;
      swallow = false;
      s.drag = { x: e.clientX, y: e.clientY, pos: s.pos, t: e.timeStamp, v: 0, moved: false, id: e.pointerId };
    };

    const move = (e) => {
      const d = s.drag;
      if (!d || !e.isPrimary) return;
      const dx = e.clientX - d.x;
      if (!d.moved) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(e.clientY - d.y) > Math.abs(dx)) { s.drag = null; return; }
        d.moved = true;
        gal.classList.add('drag');
        try { gal.setPointerCapture(d.id); } catch {}
        animate();
      }
      const next = d.pos - dx / (s.w + s.gap);
      const dt = Math.max(8, e.timeStamp - d.t) / 1000;
      d.v = d.v * 0.3 + ((next - s.pos) / dt) * 0.7;
      d.t = e.timeStamp;
      s.pos = s.target = next;
    };

    const end = () => {
      const d = s.drag;
      if (!d) return;
      s.drag = null;
      gal.classList.remove('drag');
      if (d.moved) {
        // A quick flick is enough; otherwise it needs 12% of a slide
        const delta = s.pos - d.pos;
        const flick = Math.abs(d.v) > 0.6 ? Math.sign(d.v) : 0;
        const dir = Math.abs(delta) > 0.12 ? Math.sign(delta) : flick;
        s.target = Math.round(d.pos) + dir;
        swallow = true;
        setTick((t) => t + 1);
      }
      animate();
    };

    // Swallow the click that follows a drag. A click on a side slide brings it to
    // the centre; a click on the centre slide opens its article.
    const click = (e) => {
      if (swallow) {
        swallow = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.target.closest('.hcta')) return;
      const slide = e.target.closest('.slide');
      if (!slide) return;
      const i = +slide.dataset.i;
      if (i === s.idx) window.location.href = slides[i].href;
      else go(i);
    };

    const key = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      step(e.key === 'ArrowRight' ? 1 : -1);
    };

    // Trackpad: follow the fingers, then snap to the nearest slide
    const wheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      s.pos = s.target = s.pos + e.deltaX / (s.w + s.gap);
      animate();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        s.target = Math.round(s.pos);
        setTick((t) => t + 1);
        animate();
      }, 140);
    };

    gal.addEventListener('pointerdown', down);
    gal.addEventListener('pointermove', move);
    gal.addEventListener('pointerup', end);
    gal.addEventListener('pointercancel', end);
    gal.addEventListener('click', click, true);
    gal.addEventListener('keydown', key);
    gal.addEventListener('wheel', wheel, { passive: false });
    return () => {
      clearTimeout(wheelTimer);
      gal.removeEventListener('pointerdown', down);
      gal.removeEventListener('pointermove', move);
      gal.removeEventListener('pointerup', end);
      gal.removeEventListener('pointercancel', end);
      gal.removeEventListener('click', click, true);
      gal.removeEventListener('keydown', key);
      gal.removeEventListener('wheel', wheel);
    };
  }, [animate, go, step]);

  const togglePlay = () => {
    if (!playing) step(1);
    setPlaying(!playing);
  };

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="Semakan fakta pilihan">
      <div className="gal" ref={galRef} tabIndex={0} aria-live={playing ? 'off' : 'polite'}>
        <div className="gtrack">
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
                ref={(el) => (slideRefs.current[i] = el)}
              >
                <div className="curve">
                  <img
                    src={s.image}
                    alt=""
                    draggable={false}
                    style={s.position ? { objectPosition: s.position } : undefined}
                  />
                  <div className="ct">
                    <Verdict type={s.type} variant="plain" label={s.verdict} agency={s.agency} className="ey" />
                    <h3>
                      {s.title}
                      <br />
                      {s.titleEm}
                    </h3>
                    <p>{s.text}</p>
                    <Button
                      variant="media"
                      href={s.href}
                      iconEnd={ArrowRight}
                      className="hcta"
                      draggable={false}
                      tabIndex={cur ? 0 : -1}
                    >
                      {s.cta}
                    </Button>
                  </div>
                </div>
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
        <IconButton
          variant="secondary"
          size="icon-lg"
          icon={playing ? PauseFilled : PlayFilled}
          label={playing ? 'Jeda slaid' : 'Main slaid'}
          className="play"
          onClick={togglePlay}
        />
      </div>
    </section>
  );
}
