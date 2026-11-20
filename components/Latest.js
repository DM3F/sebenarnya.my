'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import FlipCard from './FlipCard';
import { Button } from '@/components/ui';
import { articles } from '@/data/content';
import { articleHref } from '@/lib/articles';
import { withBase } from '@/lib/basePath';

const dateFmt = new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

// The 6 newest articles, shaped for the fact-check card
const latest = [...articles]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 6)
  .map((a) => ({
    title: a.title,
    summary: a.lead,
    image: a.image,
    alt: a.alt,
    status: a.status,
    agency: { ...a.agency, short: a.agency.name.split(' (')[0] },
    date: a.date,
    dateLabel: dateFmt.format(new Date(`${a.date}T00:00:00`)),
    href: articleHref(a),
  }));

function Chevron({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M10 3.5 5.5 8l4.5 4.5' : 'M6 3.5 10.5 8 6 12.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * "Semakan fakta terkini" (Paper › Home): heading, a horizontally scrolling
 * row of FactCheckCards (scroll-snap, swipe/trackpad), prev/next buttons and
 * "Lihat lagi".
 */
export default function Latest() {
  const trackRef = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft <= 2, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const scroll = (dir) => {
    // Scroll to the next/previous card's snap point (not a raw pixel step, which
    // mandatory snapping can round past a card)
    const t = trackRef.current;
    const cards = [...t.children];
    const origin = cards[0].offsetLeft;
    const current = cards.findIndex((c) => c.offsetLeft - origin >= t.scrollLeft - 2);
    const target = cards[Math.max(0, Math.min(cards.length - 1, current + dir))];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.scrollTo({ left: target.offsetLeft - origin, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section className="latest-checks" aria-labelledby="latest-checks-title">
      <h2 id="latest-checks-title" className="latest-checks__title">Semakan fakta terkini</h2>

      <div className="latest-checks__carousel">
        <div className="latest-checks__track" ref={trackRef} onScroll={update}>
          {latest.map((post) => (
            <FlipCard key={post.href} post={post} />
          ))}
        </div>

        <div className="latest-checks__controls">
          <button
            type="button"
            className="latest-checks__nav"
            aria-label="Semakan sebelumnya"
            disabled={edge.start}
            onClick={() => scroll(-1)}
          >
            <Chevron dir="prev" />
          </button>
          <button
            type="button"
            className="latest-checks__nav"
            aria-label="Semakan seterusnya"
            disabled={edge.end}
            onClick={() => scroll(1)}
          >
            <Chevron dir="next" />
          </button>
        </div>
      </div>

      <Button variant="outline" href={withBase('/article/')} className="latest-checks__more">
        Lihat lagi
      </Button>
    </section>
  );
}
