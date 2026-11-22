'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * FlipWord: a word that keeps flipping to the next one, letter by letter (3D stagger flip,
 * after Originkit "3D Stagger Flip"), on the Web Animations API with no extra library.
 *
 * Transform-only, so it stays on the compositor:
 * - The new word goes into the layout once, at the start of the flip. Its letters roll in from
 *   below (rotateX −90° → 0) while the old word, laid over it, rolls away (0 → 90°), one letter
 *   after another, like the faces of small cubes.
 * - The word sits in a slot as wide as the longest word, so the text before it stays put. On phones,
 *   where the word is centred on its own line, it FLIP-glides to its new centre over the flip.
 * - Holds each word, pauses while the tab is hidden or the word is off screen.
 * - Reduced motion: the word changes in place, no flip.
 * - Decorative: aria-hidden; the parent gives screen readers the full text.
 */
const DEPTH = '0.55em'; // half the line box: the cube's radius
const OUT = [
  { transform: `translateZ(-${DEPTH}) rotateX(0deg) translateZ(${DEPTH})` },
  { transform: `translateZ(-${DEPTH}) rotateX(90deg) translateZ(${DEPTH})` },
];
const IN = [
  { transform: `translateZ(-${DEPTH}) rotateX(-90deg) translateZ(${DEPTH})` },
  { transform: `translateZ(-${DEPTH}) rotateX(0deg) translateZ(${DEPTH})` },
];
const EASE = 'cubic-bezier(0.2, 0, 0, 1)'; // spring stand-in, no bounce

// Viewport x of the first text in an element (where a centred line starts)
const textLeft = (el) => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  const node = walker.nextNode();
  if (!node) return el.getBoundingClientRect().left;
  const range = document.createRange();
  range.selectNodeContents(node);
  return range.getBoundingClientRect().left;
};

export default function FlipWord({ words, hold = 2200, duration = 420, stagger = 24, className = '' }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(null); // word rolling away during a flip
  const rootRef = useRef(null);
  const rowRef = useRef(null);
  const outRef = useRef(null);
  const before = useRef(null); // positions measured just before the flip renders
  const anims = useRef([]);

  const word = words[index];

  // Flip start: the new word is laid out, nothing painted yet. Play letters + FLIP the line.
  useLayoutEffect(() => {
    if (leaving === null || !before.current) return;
    const row = rowRef.current;
    const line = rootRef.current.closest('[data-flip-line]') ?? rootRef.current.parentElement;
    const lineDx = before.current.text - textLeft(line);
    const rowDx = before.current.row - row.getBoundingClientRect().left - lineDx;
    const total = duration + stagger * (Math.max(word.length, leaving.length) - 1);
    const slide = (dx) => [{ transform: `translateX(${dx}px)` }, { transform: 'translateX(0)' }];

    const list = [];
    if (lineDx) list.push(line.animate(slide(lineDx), { duration: total, easing: EASE }));
    if (rowDx) list.push(row.animate(slide(rowDx), { duration: total, easing: EASE }));
    [...outRef.current.children].forEach((el, k) =>
      list.push(el.animate(OUT, { duration, delay: k * stagger, easing: EASE, fill: 'forwards' }))
    );
    [...row.querySelectorAll(':scope > .flip-word__char')].forEach((el, k) =>
      list.push(el.animate(IN, { duration, delay: k * stagger, easing: EASE, fill: 'backwards' }))
    );
    anims.current = list;

    let live = true;
    Promise.all(list.map((a) => a.finished))
      .then(() => live && setLeaving(null))
      .catch(() => {});
    return () => { live = false; };
  }, [leaving, word, duration, stagger]);

  // Flip done: drop the old word and its held animations
  useLayoutEffect(() => {
    if (leaving !== null) return;
    anims.current.forEach((a) => a.cancel());
    anims.current = [];
  }, [leaving]);

  // Timer: hold, then flip to the next word
  useEffect(() => {
    const root = rootRef.current;
    if (!root || words.length < 2 || leaving !== null) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let timer;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);

    const flip = () => {
      if (document.hidden || !visible) { timer = setTimeout(flip, 600); return; }
      const nextIndex = (index + 1) % words.length;
      if (reduce) { setIndex(nextIndex); return; }
      const line = root.closest('[data-flip-line]') ?? root.parentElement;
      before.current = { text: textLeft(line), row: rowRef.current.getBoundingClientRect().left };
      setLeaving(word);
      setIndex(nextIndex);
    };

    timer = setTimeout(flip, hold);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, [index, leaving, word, words.length, hold]);

  return (
    <span ref={rootRef} className={`flip-word ${className}`.trim()} aria-hidden="true">
      <span ref={rowRef} className="flip-word__row">
        {[...word].map((c, k) => (
          <span key={`${index}-${k}`} className="flip-word__char">{c}</span>
        ))}
        <span ref={outRef} className="flip-word__out">
          {leaving !== null && [...leaving].map((c, k) => (
            <span key={k} className="flip-word__char">{c}</span>
          ))}
        </span>
      </span>
      {/* Invisible copies of every word, stacked in the same grid cell: the slot is as wide as the
          longest word, so the text before it never moves when the word changes length */}
      {words.map((w) => (
        <span key={w} className="flip-word__ghost">{w}</span>
      ))}
    </span>
  );
}
