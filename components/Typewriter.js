'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Typewriter: a word that is typed out one character at a time behind a text caret, held, deleted
 * (backspace) and replaced by the next one — palsu → benar → makluman → palsu…
 *
 * - The first word is in the server HTML, so the heading is whole without JS; the cycle starts by
 *   holding it.
 * - Typing ≈80ms a character with a little human jitter; deleting is quicker (40ms), the way a
 *   person holds backspace. Hold 2.5s on a full word, a short beat on the empty slot.
 * - The caret blinks only while the word rests (hold and the empty beat); while characters are
 *   going in or out it stays solid, like a real text cursor.
 * - The word sits in a slot as wide as the longest word (invisible copies stacked in one grid cell),
 *   so the text before it never moves and the line never changes height.
 * - Pauses while the tab is hidden or the hero is off screen. Reduced motion: no typing, the word
 *   swaps whole after each hold and the caret stays still.
 * - Decorative: aria-hidden; the heading gives screen readers the full text.
 */
const TYPE_MS = 80;
const JITTER_MS = 30; // ± around TYPE_MS
const DELETE_MS = 40;
const HOLD_MS = 2500;
const EMPTY_MS = 400;

export default function Typewriter({ words, className = '' }) {
  const [text, setText] = useState(words[0]);
  const [busy, setBusy] = useState(false); // characters going in or out: caret solid
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || words.length < 2) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);

    let timer;
    let index = 0;
    let shown = words[0];
    const wait = (fn, ms) => { timer = setTimeout(() => (document.hidden || !visible ? wait(fn, 600) : fn()), ms); };
    const show = (value, typing) => { shown = value; setText(value); setBusy(typing); };

    const hold = () => wait(reduce ? swap : erase, HOLD_MS);
    const swap = () => { index = (index + 1) % words.length; show(words[index], false); hold(); };
    const erase = () => {
      if (shown.length === 0) { setBusy(false); wait(type, EMPTY_MS); return; }
      show(shown.slice(0, -1), true);
      wait(erase, DELETE_MS);
    };
    const type = () => {
      const next = words[(index + 1) % words.length];
      if (shown.length === next.length) { index = (index + 1) % words.length; setBusy(false); hold(); return; }
      show(next.slice(0, shown.length + 1), true);
      wait(type, TYPE_MS + Math.round((Math.random() * 2 - 1) * JITTER_MS));
    };

    hold();
    return () => { clearTimeout(timer); io.disconnect(); };
  }, [words]);

  return (
    <span ref={rootRef} className={`typewriter ${className}`.trim()} data-busy={busy || undefined} aria-hidden="true">
      <span className="typewriter__row">
        {text}
        <span className="typewriter__caret" />
      </span>
      {/* Invisible copies of every word (with room for the caret) stacked in the same grid cell:
          the slot is as wide as the longest word, so nothing around it moves */}
      {words.map((w) => (
        <span key={w} className="typewriter__ghost">
          {w}
          <span className="typewriter__caret" />
        </span>
      ))}
    </span>
  );
}
