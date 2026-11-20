'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FlipCard from './FlipCard';
import { Button } from '@/components/ui';
import Icon from '@/components/ui/Icon';
import { articles } from '@/data/content';
import { agencyInitials, articleHref } from '@/lib/articles';
import { withBase } from '@/lib/basePath';

const COUNT = 12; // newest fact-checks in the loop; every one has its own photo
const SPEED = 36; // px per second while gliding
const EASE_RATE = 5; // how quickly the glide speeds up / slows down (1/s)
const NUDGE_TAU = 0.12; // seconds; prev/next buttons glide one card with this time constant
const DRAG_THRESHOLD = 6; // px before a press becomes a drag (so taps still flip a card)

const HOVER_OPEN_DELAY = 90; // ms the pointer must rest on a card before it flips
const HOVER_CLOSE_DELAY = 140; // ms grace after leaving, so moving to the next card swaps cleanly

const dateFmt = new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

// Newest fact-checks, shaped for the fact-check card
const latest = [...articles]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, COUNT)
  .map((a) => ({
    title: a.title,
    summary: a.lead,
    image: a.image,
    alt: a.alt,
    status: a.status,
    agency: { ...a.agency, short: a.agency.name.split(' (')[0], initials: agencyInitials(a.agency.name) },
    date: a.date,
    dateLabel: dateFmt.format(new Date(`${a.date}T00:00:00`)),
    href: articleHref(a),
  }));

/**
 * "Semakan fakta terkini" (Paper › Home).
 * An endless, slowly gliding row of FactCheckCards: the cards sit on a ring and the
 * one that leaves on the left re-enters on the right, so the row never ends and never
 * shows a duplicate.
 * - Mouse hover pauses it (eases to a stop); leaving resumes it (eases back up).
 * - It also holds still while a card is flipped, while keyboard focus is inside,
 *   while being dragged, and always under prefers-reduced-motion.
 * - Prev/next glide exactly one card; touch and pen can drag the row.
 */
export default function Latest() {
  const viewRef = useRef(null);
  const railRef = useRef(null);
  const st = useRef({ x: 0, v: 0, nudge: 0, setW: 0, step: 0, hover: false, focus: false, open: false, drag: null, moved: false, reduce: false });

  // One card open at a time; hover waits a beat so sweeping across the row doesn't flip every card
  const [open, setOpen] = useState(null);
  const hoverTimer = useRef(0);
  const hover = (href, on) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(
      () => setOpen((cur) => (on ? href : cur === href ? null : cur)),
      on ? HOVER_OPEN_DELAY : HOVER_CLOSE_DELAY
    );
  };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  useEffect(() => {
    st.current.open = open !== null;
  }, [open]);

  // Each card is placed on a ring: its slot (index × step) plus the shared offset, wrapped
  // into one set's width. No duplicate cards, so every visible card is real and interactive.
  const paint = () => {
    const s = st.current;
    const cards = railRef.current.children;
    if (!s.setW) return;
    s.x = ((s.x % s.setW) + s.setW) % s.setW - s.setW; // keep x in (-setW, 0]
    for (let i = 0; i < cards.length; i++) {
      const base = i * s.step;
      let pos = base + s.x;
      if (pos < -s.step) pos += s.setW; // fell off the left edge: re-enter on the right
      cards[i].style.transform = `translate3d(${pos - base}px, 0, 0)`;
    }
  };

  // Measure one card step (width + gap) and one full set
  const measure = useCallback(() => {
    const cards = railRef.current.children;
    const s = st.current;
    s.step = cards[1].offsetLeft - cards[0].offsetLeft;
    s.setW = s.step * cards.length;
    paint();
  }, []);

  // Glide loop
  useEffect(() => {
    const s = st.current;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setReduce = () => { s.reduce = mq.matches; };
    setReduce();
    mq.addEventListener('change', setReduce);
    measure();
    window.addEventListener('resize', measure);

    let raf = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const running = !s.hover && !s.focus && !s.open && !s.drag && !s.reduce;
      const target = running ? -SPEED : 0;
      s.v += (target - s.v) * Math.min(1, dt * EASE_RATE);
      if (Math.abs(s.v) < 0.05 && !running) s.v = 0;
      const glide = s.nudge * (1 - Math.exp(-dt / NUDGE_TAU));
      s.nudge -= glide;
      if (Math.abs(s.nudge) < 0.1) s.nudge = 0;
      if (!s.drag) s.x += s.v * dt + glide;
      paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener('change', setReduce);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // Drag with touch / pen (mouse users hover to pause and use the buttons)
  useEffect(() => {
    const view = viewRef.current;
    const s = st.current;
    const down = (e) => {
      if (e.pointerType === 'mouse' || e.button !== 0) return;
      s.drag = { x0: e.clientX, y0: e.clientY, base: s.x, id: e.pointerId, active: false };
      s.moved = false;
    };
    const move = (e) => {
      const d = s.drag;
      if (!d) return;
      const dx = e.clientX - d.x0;
      if (!d.active) {
        if (Math.abs(e.clientY - d.y0) > Math.abs(dx)) { s.drag = null; return; } // vertical scroll wins
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        d.active = true;
        s.moved = true;
        try { view.setPointerCapture(d.id); } catch {}
      }
      s.x = d.base + dx;
      s.nudge = 0;
      paint();
    };
    const up = () => { s.drag = null; };
    // A drag must not also flip the card under the finger
    const click = (e) => {
      if (!s.moved) return;
      s.moved = false;
      e.preventDefault();
      e.stopPropagation();
    };
    view.addEventListener('pointerdown', down);
    view.addEventListener('pointermove', move);
    view.addEventListener('pointerup', up);
    view.addEventListener('pointercancel', up);
    view.addEventListener('click', click, true);
    return () => {
      view.removeEventListener('pointerdown', down);
      view.removeEventListener('pointermove', move);
      view.removeEventListener('pointerup', up);
      view.removeEventListener('pointercancel', up);
      view.removeEventListener('click', click, true);
    };
  }, []);

  // Keyboard: bring the focused card fully into view (the row is paused while focus is inside)
  const onFocus = (e) => {
    const s = st.current;
    s.focus = true;
    const card = e.target.closest('.fc');
    if (!card) return;
    const viewW = viewRef.current.clientWidth;
    const rect = card.getBoundingClientRect();
    const viewRect = viewRef.current.getBoundingClientRect();
    if (rect.left < viewRect.left || rect.right > viewRect.left + viewW) {
      s.nudge = 0;
      s.x -= rect.left - viewRect.left;
      paint();
    }
  };
  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) st.current.focus = false;
  };

  const go = (dir) => {
    const s = st.current;
    if (s.reduce) {
      s.x -= dir * s.step;
      paint();
    } else {
      s.nudge -= dir * s.step;
    }
  };

  const card = (post) => (
    <FlipCard
      key={post.href}
      post={post}
      flipped={open === post.href}
      onHover={(on) => hover(post.href, on)}
      onToggle={() => setOpen((cur) => (cur === post.href ? null : post.href))}
    />
  );

  return (
    <section className="latest-checks" aria-labelledby="latest-checks-title">
      <h2 id="latest-checks-title" className="latest-checks__title">Semakan fakta terkini</h2>

      <div className="latest-checks__carousel">
        <div
          className="latest-checks__track"
          ref={viewRef}
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') st.current.hover = true; }}
          onPointerLeave={(e) => { if (e.pointerType === 'mouse') st.current.hover = false; }}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <div className="latest-checks__rail" ref={railRef}>
            {latest.map((post) => card(post))}
          </div>
        </div>

        <div className="latest-checks__controls">
          <button type="button" className="latest-checks__nav" aria-label="Semakan sebelumnya" onClick={() => go(-1)}>
            <Icon icon={ChevronLeft} />
          </button>
          <button type="button" className="latest-checks__nav" aria-label="Semakan seterusnya" onClick={() => go(1)}>
            <Icon icon={ChevronRight} />
          </button>
        </div>
      </div>

      <Button variant="outline" href={withBase('/article/')} className="latest-checks__more">
        Lihat lagi
      </Button>
    </section>
  );
}
