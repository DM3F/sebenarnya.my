'use client';

import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { withBase } from '@/lib/basePath';

/**
 * FormatFolder — the folder card of the Logo section (Tentang Kami › Logo).
 * Look: the Wonder canvas ("Icon Folder Card"). Motion: the pasted IconFolder component:
 *   - pops in once when it scrolls into view (translateY 34 + scale .92 → rest, .9s, then tiles fan out in turn)
 *   - mouse hover, tap, or keyboard focus on a format link spreads the tiles wider and lifts the card
 *   - hovering one tile lifts it, dims the others and highlights its link
 * The tiles are decorative (aria-hidden); the real controls are the download links.
 * Reduced motion: no pop-in, no movement (see global.css).
 */

// Design coordinates are the canvas card: 391 × 286. CSS scales the stage to the card width.
// `k` = distance from the middle tile (spread direction); `iconRot` = the small tilt of the file icon inside.
const TILES = [
  { key: 'JPEG', icon: '/images/formats/jpeg.svg', k: -1, x: 54.5, y: 62.25, rot: -12.5, iconRot: 0.44 },
  { key: 'PNG', icon: '/images/formats/png.svg', k: 0, x: 139.34, y: 44.25, rot: -4.17, iconRot: 1.87 },
  { key: 'SVG', icon: '/images/formats/svg.svg', k: 1, x: 235.89, y: 62.74, rot: 12.5, iconRot: 1.8 },
];

export default function FormatFolder({ title, subject, formats }) {
  const rootRef = useRef(null);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(null); // stage scale = card width / 391, measured so old Safari (no tan(atan2())) never clips the card
  const [armed, setArmed] = useState(false); // pop-in is only hidden once JS runs (no-JS / reduced motion: always visible)
  const [shown, setShown] = useState(false);
  const [settled, setSettled] = useState(false); // entrance finished: hover motion uses shorter delays
  const [open, setOpen] = useState(false); // tap toggle
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hi, setHi] = useState(null); // tile key under the mouse

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    let timer;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setShown(true);
        timer = setTimeout(() => setSettled(true), 1600);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !('ResizeObserver' in window)) return;
    const measure = () => setScale(el.getBoundingClientRect().width / 391);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const wide = open || hover || focus;
  const mouse = (fn) => (e) => e.pointerType === 'mouse' && fn();

  return (
    <div className="folder-wrap" ref={wrapRef}>
      <div
        ref={rootRef}
        className="folder"
        data-armed={armed || undefined}
        data-shown={shown || undefined}
        data-settled={settled || undefined}
        data-wide={wide || undefined}
        style={scale ? { '--s': scale } : undefined}
        onPointerEnter={mouse(() => setHover(true))}
        onPointerLeave={() => {
          setHover(false);
          setHi(null);
        }}
        onClick={(e) => !e.target.closest('a') && setOpen((o) => !o)}
        onFocus={() => setFocus(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocus(false)}
      >
        <div className="folder__stage">
          <div className="folder__card">
            <div className="folder__glow" aria-hidden="true" />

            <svg className="folder__back" viewBox="0 0 420 272" aria-hidden="true">
              <path d="M0 48A24 24 0 0 1 24 24L206 24C231.3 24 226.7 0 252 0L396 0A24 24 0 0 1 420 24L420 248A24 24 0 0 1 396 272L24 272A24 24 0 0 1 0 248Z" />
            </svg>

            {TILES.map((t, i) => (
              <div
                key={t.key}
                className="folder__tile"
                data-state={hi === null ? undefined : hi === t.key ? 'hi' : 'dim'}
                style={{ '--x': `${t.x}px`, '--y': `${t.y}px`, '--rot': `${t.rot}deg`, '--k': t.k, '--i': i }}
                aria-hidden="true"
              >
                <div className="folder__lift">
                  <div
                    className="folder__face"
                    data-format={t.key}
                    onPointerEnter={mouse(() => setHi(t.key))}
                    onPointerLeave={() => setHi((h) => (h === t.key ? null : h))}
                  >
                    <img
                      className="folder__icon"
                      data-format={t.key}
                      src={withBase(t.icon)}
                      alt=""
                      draggable={false}
                      style={{ rotate: `${t.iconRot}deg` }}
                    />
                  </div>
                  <span className="folder__label">{t.key}</span>
                </div>
              </div>
            ))}

            <div className="folder__pocket">
              <svg className="folder__pocket-shape" viewBox="0 0 420 180" aria-hidden="true">
                <path d="M0 24A24 24 0 0 1 24 0L176 0C201.3 0 196.7 24 222 24L396 24A24 24 0 0 1 420 48L420 156A24 24 0 0 1 396 180L24 180A24 24 0 0 1 0 156Z" />
              </svg>

              {/* Text is counter-scaled out of the stage scale, so it renders at the type roles (title / label-sm) at any card width */}
              <div className="folder__text">
                <p className="folder__title">{title}</p>

                <div className="folder__tags">
                  {formats.map((f) => (
                    <a
                      key={f.label}
                      className="folder__chip"
                      data-active={hi === f.label || undefined}
                      href={f.file}
                      download={f.filename}
                      aria-label={`Muat turun ${subject} (${f.label})`}
                      onPointerEnter={mouse(() => setHi(f.label))}
                      onPointerLeave={() => setHi((h) => (h === f.label ? null : h))}
                    >
                      {f.label}
                      <Icon icon={Download} size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
