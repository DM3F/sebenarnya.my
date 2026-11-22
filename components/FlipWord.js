'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * FlipWord: a word that keeps flipping to the next one, letter by letter.
 * 3D stagger flip (after Originkit "3D Stagger Flip"), rebuilt on the Web Animations API, no extra library.
 * - Each letter is a tiny cube: the current letter is on the front face, the next letter on the top face.
 *   The cube turns 90° on X, one letter after another (stagger), revealing the next word.
 * - Each letter box also eases its width from the old letter to the new one, so words of different
 *   length (PALSU → MAKLUMAN) grow and shrink smoothly and a centred line never jumps.
 * - Holds each word, pauses while the tab is hidden or the word is off screen.
 * - Reduced motion: the word changes in place, no flip.
 * - Decorative: aria-hidden; the parent gives screen readers the full text.
 */
const REST = 'translateZ(-0.5lh) rotateX(0deg)';
const FLIPPED = 'translateZ(-0.5lh) rotateX(90deg)';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // strong ease-out, settles like a damped spring

export default function FlipWord({ words, hold = 2200, duration = 640, stagger = 55, className = '' }) {
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState(null); // { WORD: [px per letter] }
  const rootRef = useRef(null);
  const measureRef = useRef(null);
  const boxesRef = useRef([]);
  const animsRef = useRef([]);

  const current = words[index];
  const next = words[(index + 1) % words.length];
  const count = Math.max(current.length, next.length);

  // Measure every letter of every word in the live font (fluid size, so again on resize / font load)
  const measure = useCallback(() => {
    const box = measureRef.current;
    if (!box) return;
    const out = {};
    for (const word of box.children) {
      out[word.dataset.word] = [...word.children].map((c) => c.getBoundingClientRect().width);
    }
    // Only store real changes: a new object would restart the timer below
    setWidths((prev) => (JSON.stringify(prev) === JSON.stringify(out) ? prev : out));
  }, []);

  useLayoutEffect(() => {
    measure();
    document.fonts?.ready.then(measure);
    addEventListener('resize', measure); // font size is fluid (clamp on vw)
    return () => removeEventListener('resize', measure);
  }, [measure]);

  // New word on the front faces: drop the finished animations so the cubes sit back at rest
  useLayoutEffect(() => {
    animsRef.current.forEach((a) => a.cancel());
    animsRef.current = [];
  }, [index]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || words.length < 2) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let timer;
    let cancelled = false;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);

    const flip = () => {
      if (cancelled) return;
      if (document.hidden || !visible) { timer = setTimeout(flip, 600); return; }
      if (reduce || !widths) { setIndex((i) => (i + 1) % words.length); return; }

      const from = widths[current] ?? [];
      const to = widths[next] ?? [];
      animsRef.current = boxesRef.current.slice(0, count).map((el, k) =>
        el.animate(
          [
            { transform: REST, width: `${from[k] ?? 0}px` },
            { transform: FLIPPED, width: `${to[k] ?? 0}px` },
          ],
          { duration, delay: k * stagger, easing: EASE, fill: 'forwards' }
        )
      );
      Promise.all(animsRef.current.map((a) => a.finished))
        .then(() => !cancelled && setIndex((i) => (i + 1) % words.length))
        .catch(() => {});
    };

    timer = setTimeout(flip, hold);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      io.disconnect();
    };
  }, [index, widths, current, next, count, words.length, hold, duration, stagger]);

  const restWidths = widths?.[current];

  return (
    <span ref={rootRef} className={`flip-word ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }, (_, k) => (
        <span
          key={k}
          ref={(el) => { boxesRef.current[k] = el; }}
          className="flip-word__char"
          style={restWidths ? { width: `${restWidths[k] ?? 0}px` } : undefined}
        >
          <span className="flip-word__face">{current[k] ?? '\u00a0'}</span>
          <span className="flip-word__face flip-word__face--next">{next[k] ?? ''}</span>
        </span>
      ))}
      {/* Off-screen ruler: one row per word, one span per letter */}
      <span ref={measureRef} className="flip-word__measure">
        {words.map((w) => (
          <span key={w} data-word={w}>
            {[...w].map((c, k) => <span key={k}>{c}</span>)}
          </span>
        ))}
      </span>
    </span>
  );
}
