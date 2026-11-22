'use client';

import { useEffect } from 'react';

/**
 * PageEnter: one entrance per page, on load only (docs/design.md › Motion). Nothing reveals on
 * scroll: sections below the first screen are simply there, so content is never left hidden and no
 * scroll listener runs.
 *
 * The page head enters as a short sequence, 100ms apart: the hero H1 rises line by line out of a
 * mask (--duration-slower, the 600ms ceiling), then each following chunk fades in with 4px of blur
 * and a 12px rise over 300ms. Easing is --ease-out. Web Animations API, transform/opacity/filter
 * only; `fill: backwards` keeps a chunk hidden only during its own delay, so without JS (or if the
 * animation is cancelled) everything is visible. Reduced motion: no entrance at all.
 */

// The hero H1's lines (Utama): mask rise. The Typewriter lives inside, so the DOM is never rebuilt.
const LINES = '.hero-title > span';

// The first-screen chunks of each page, in reading order. Only the ones present on a page run.
const CHUNKS = [
  // Utama
  '.hero-lede',
  '.hero-search-group',
  // Tentang Kami
  '.about-hero-card',
  // Artikel
  '.post-title',
  '.post-subtitle',
  '.post-meta',
];

const STEP = 100; // ms between chunks
const CHUNK_MS = 300;

export default function PageEnter() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = getComputedStyle(document.documentElement);
    const ease = root.getPropertyValue('--ease-out').trim() || 'cubic-bezier(.23, 1, .32, 1)';
    // Chrome may serialise the token as "0.6s" instead of "600ms": read the unit
    const slower = root.getPropertyValue('--duration-slower').trim();
    const lineMs = (slower.endsWith('ms') ? parseFloat(slower) : parseFloat(slower) * 1000) || 600;

    const anims = [];
    let delay = 0;

    document.querySelectorAll(LINES).forEach((line) => {
      anims.push(
        line.animate(
          [
            { transform: 'translateY(100%)', clipPath: 'inset(0 0 100% 0)' },
            { transform: 'none', clipPath: 'inset(0 0 0 0)' },
          ],
          { duration: lineMs, delay, easing: ease, fill: 'backwards' },
        ),
      );
      delay += STEP;
    });

    CHUNKS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        anims.push(
          el.animate(
            [
              { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
              { opacity: 1, transform: 'none', filter: 'none' },
            ],
            { duration: CHUNK_MS, delay, easing: ease, fill: 'backwards' },
          ),
        );
        delay += STEP;
      });
    });

    return () => anims.forEach((a) => a.cancel());
  }, []);

  return null;
}
