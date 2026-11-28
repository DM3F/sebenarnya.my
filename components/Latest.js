'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import FlipCard from './FlipCard';
import { articles, articleStatus } from '@/data/content';
import { agencyInitials, articleHref } from '@/lib/articles';
import { IconButton } from '@/components/ui';

const COUNT = 12; // newest fact-checks, split over the two rows; every one has its own photo
const MIN_RING = 8; // a short row is repeated up to this many cards so the ring fills wide screens
const SPEED = 36; // px per second while gliding
const EASE_RATE = 5; // how quickly the glide speeds up / slows down (1/s)
const DRAG_THRESHOLD = 6; // px before a press becomes a drag (so taps still flip a card)
const SEEK_TAU = 0.18; // s; exponential ease when a dot sends the rows to a card (interruptible)

const HOVER_OPEN_DELAY = 90; // ms the pointer must rest on a card before it flips
const HOVER_CLOSE_DELAY = 140; // ms grace after leaving, so moving to the next card swaps cleanly

const dateFmt = new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

const DEFAULT_HEAD = {
  title: 'Semakan fakta terkini',
  lead: 'Setiap jawapan disahkan terus oleh kementerian dan agensi berkaitan.',
};

// Newest fact-checks, shaped for the fact-check card.
// `status` keeps one verdict only; `exclude` drops the article being read.
function pickLatest(status, exclude) {
  return articles
    .filter((a) => (!status || a.status === status) && a.slug !== exclude)
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
}

// Repeat whole rounds so a ring never shows a gap; each copy gets its own id
function fillRing(list, row) {
  if (!list.length) return [];
  const rounds = Math.ceil(MIN_RING / list.length);
  return Array.from({ length: rounds }, (_, r) => list.map((p) => ({ ...p, id: `${p.href}#${row}-${r}` }))).flat();
}

// Two rows: alternate cards so each row mixes old and new; one row only when there is one card.
// `lead` is the first row's own cards (before fillRing repeats them): one progress dot each.
function splitRows(list) {
  if (list.length < 2) return { rows: [fillRing(list, 0)], lead: list };
  const halves = [0, 1].map((row) => list.filter((_, i) => i % 2 === row));
  return { rows: halves.map((h, row) => fillRing(h, row)), lead: halves[0] };
}

/**
 * "Semakan fakta terkini" on the home page. Under an article (`status` + `exclude`)
 * it shows only fact-checks with the same verdict, headed by `articleStatus[status].related`.
 * Two endless, slowly gliding rows of FlipCards moving in opposite directions; the
 * second row starts half a card over so the rows stagger.
 * - A row eases to a stop under the mouse or while keyboard focus is inside it.
 * - Both rows hold still while a card is flipped, and when paused with the pause button
 *   (WCAG 2.2.2). Under prefers-reduced-motion they start paused; the button can still play.
 * - Progress dots follow the first row: the long dot is the card at its left edge and fills
 *   as it glides off. A dot glides both rows to that card.
 * - Touch and pen can drag a row.
 */
export default function Latest({ status, exclude }) {
  const [{ rows, lead }] = useState(() => splitRows(pickLatest(status, exclude)));
  const head = (status && articleStatus[status]?.related) || DEFAULT_HEAD;

  // One card open at a time; hover waits a beat so sweeping across a row doesn't flip every card
  const [open, setOpen] = useState(null);
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open !== null;
  }, [open]);

  const hoverTimer = useRef(0);
  const hover = (id, on) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(
      () => setOpen((cur) => (on ? id : cur === id ? null : cur)),
      on ? HOVER_OPEN_DELAY : HOVER_CLOSE_DELAY
    );
  };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  // Play / pause for both rows; reduced motion starts paused
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPlaying(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Progress dots: the first row reports where it is (in cards); the fill is written straight
  // to the DOM each frame, React only re-renders when the active dot changes
  const [active, setActive] = useState(0);
  const fillRef = useRef(null);
  const progress = useRef(0);
  const onProgress = useCallback((p) => {
    progress.current = p;
    const whole = Math.floor(p + 0.005); // a row resting on a card counts as that card, not 99.9% of the last
    setActive(whole % lead.length);
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.max(0, p - whole).toFixed(4)})`;
  }, [lead.length]);
  const seekers = useRef([]);
  const goTo = (i) => {
    const n = lead.length;
    const d = ((((i - progress.current) % n) + n + n / 2) % n) - n / 2; // shortest way round, in cards
    seekers.current.forEach((seek) => seek?.(d));
  };

  const card = (post) => (
    <FlipCard
      key={post.id}
      post={post}
      flipped={open === post.id}
      onHover={(on) => hover(post.id, on)}
      onToggle={() => setOpen((cur) => (cur === post.id ? null : post.id))}
    />
  );

  return (
    <section className="latest-checks" aria-labelledby="latest-checks-title">
      <div className="latest-checks__head">
        <h2 id="latest-checks-title" className="latest-checks__title">{head.title}</h2>
        <p className="latest-checks__lead">{head.lead}</p>
      </div>

      <div className="latest-checks__carousel">
        {rows.map((posts, i) => (
          <GlideRow
            key={i}
            posts={posts}
            dir={i % 2 ? 1 : -1}
            stagger={i % 2 ? 0.5 : 0}
            openRef={openRef}
            playingRef={playingRef}
            onProgress={i === 0 ? onProgress : undefined}
            seekRef={(fn) => (seekers.current[i] = fn)}
            card={card}
          />
        ))}
      </div>

      {lead.length > 1 && (
        <div className="latest-checks__controls">
          <IconButton
            variant="secondary"
            size="icon-lg"
            icon={playing ? Pause : Play}
            label={playing ? 'Jeda pergerakan kad' : 'Mainkan pergerakan kad'}
            onClick={() => setPlaying((p) => !p)}
          />
          <div className="latest-checks__dots" role="group" aria-label="Pilih semakan">
            {lead.map((post, i) => (
              <button
                key={post.href}
                type="button"
                aria-label={`Semakan ${i + 1}: ${post.title}`}
                aria-current={i === active || undefined}
                className={i === active ? 'on' : undefined}
                onClick={() => goTo(i)}
              >
                {i === active && <i ref={fillRef} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * One endless row. Each card sits on a ring: its slot (index × step) plus the shared
 * offset, wrapped into one set's width. No duplicate DOM, so every visible card is real
 * and interactive. `dir` −1 glides left, 1 glides right; `stagger` starts the row that
 * many cards over.
 */
function GlideRow({ posts, dir, stagger, openRef, playingRef, onProgress, seekRef, card }) {
  const viewRef = useRef(null);
  const railRef = useRef(null);
  const st = useRef({ x: 0, v: 0, setW: 0, step: 0, hover: false, focus: false, drag: null, moved: false, reduce: false, placed: false, seek: null });

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
    onProgress?.(-s.x / s.step); // cards glided past, 0 … ring length
  };

  // A dot asks this row to move `d` cards (the rows move opposite ways, so the shift follows `dir`)
  useEffect(() => {
    seekRef((d) => {
      const s = st.current;
      if (!s.step) return;
      s.seek = (s.seek ?? 0) + dir * d * s.step;
      s.v = 0;
    });
    return () => seekRef(null);
  }, [seekRef, dir]);

  // Measure one card step (width + gap) and one full set
  const measure = useCallback(() => {
    const cards = railRef.current.children;
    const s = st.current;
    if (cards.length < 2) return;
    s.step = cards[1].offsetLeft - cards[0].offsetLeft;
    s.setW = s.step * cards.length;
    if (!s.placed) {
      s.x = -stagger * s.step;
      s.placed = true;
    }
    paint();
  }, [stagger]);

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
      if (s.seek !== null) {
        if (s.drag) s.seek = null; // a finger takes over
        else {
          const move = s.reduce || Math.abs(s.seek) < 0.5 ? s.seek : s.seek * (1 - Math.exp(-dt / SEEK_TAU));
          s.x += move;
          s.seek = s.seek === move ? null : s.seek - move;
          paint();
        }
      }
      const running = playingRef.current && !s.hover && !s.focus && !openRef.current && !s.drag && s.seek === null;
      const target = running ? dir * SPEED : 0;
      s.v += (target - s.v) * Math.min(1, dt * EASE_RATE);
      if (Math.abs(s.v) < 0.05 && !running) s.v = 0;
      if (!s.drag && s.v) {
        s.x += s.v * dt;
        paint();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener('change', setReduce);
      window.removeEventListener('resize', measure);
    };
  }, [measure, dir, openRef, playingRef]);

  // Drag with touch / pen (mouse users hover to pause)
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
    const el = e.target.closest('.fc');
    if (!el) return;
    const viewW = viewRef.current.clientWidth;
    const rect = el.getBoundingClientRect();
    const viewRect = viewRef.current.getBoundingClientRect();
    if (rect.left < viewRect.left || rect.right > viewRect.left + viewW) {
      s.x -= rect.left - viewRect.left;
      paint();
    }
  };
  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) st.current.focus = false;
  };

  return (
    <div
      className="latest-checks__track"
      ref={viewRef}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') st.current.hover = true; }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') st.current.hover = false; }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="latest-checks__rail" ref={railRef}>
        {posts.map((post) => card(post))}
      </div>
    </div>
  );
}
