'use client';

// Galeri (Tentang Kami): photos on a 3D sphere, ported from SphereImageGrid.
// Differences from the original, on purpose:
// - Positions are written to the DOM from one rAF loop (refs), so React never re-renders per frame.
// - Fibonacci layout is deterministic (seeded jitter), so server and client agree.
// - Pointer events + capture after a 4px threshold: a drag never fires a click, a tap still opens.
// - touch-action: pan-y — on phones a horizontal swipe spins, a vertical one scrolls the page.
// - Auto-rotate keeps going on hover (as the original); it pauses only while keyboard-focused, dragged, off-screen, in the dialog, or under reduced motion.
// - The dialog is a native <dialog> showing the photo only (no text box), Esc and backdrop close it.
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui';

const NODES = 36; // photos repeat around the sphere so it never looks sparse
const MAX_SIZE = 960;
const RADIUS = 0.4; // × stage size
const NODE = 0.18; // × stage size, before depth scaling
const DRAG = 0.4; // degrees per px
const DECAY = 0.94;
const MAX_SPEED = 6;
const AUTO_SPEED = 0.12; // degrees per frame (~7°/s)

const seeded = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rad = (d) => (d * Math.PI) / 180;

// Fibonacci sphere, same pole handling as the original, minus Math.random
function layout(count) {
  const golden = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: count }, (_, i) => {
    let phi = (Math.acos(1 - (2 * (i + 0.5)) / count) * 180) / Math.PI;
    const bonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
    phi = phi < 90 ? Math.max(5, phi - bonus) : Math.min(175, phi + bonus);
    phi = 15 + (phi / 180) * 150 + (seeded(i + 1) - 0.5) * 10;
    const theta = (((2 * Math.PI) / golden) * i * 180) / Math.PI + (seeded(i + 99) - 0.5) * 20;
    return { theta: rad(theta), phi: rad(clamp(phi, 0, 180)) };
  });
}

export default function SphereGallery({ items }) {
  const nodes = Array.from({ length: NODES }, (_, i) => items[i % items.length]);
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const nodeRefs = useRef([]);
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(null);

  // Mutable motion state lives in a ref: changing it must not re-render
  const motion = useRef({ rx: -12, ry: 0, vx: 0, vy: 0, size: 0, focus: false, drag: null, dragged: false, visible: false, open: false });

  useEffect(() => {
    const m = motion.current;
    const points = layout(NODES);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = 0;

    const paint = () => {
      const size = m.size;
      if (!size) return;
      const r = size * RADIUS;
      const base = size * NODE;
      const cx = Math.cos(rad(m.rx)), sx = Math.sin(rad(m.rx));
      const cy = Math.cos(rad(m.ry)), sy = Math.sin(rad(m.ry));

      const pos = points.map(({ theta, phi }) => {
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.cos(phi);
        let z = r * Math.sin(phi) * Math.sin(theta);
        [x, z] = [x * cy + z * sy, -x * sy + z * cy]; // Y axis (horizontal drag)
        [y, z] = [y * cx - z * sx, y * sx + z * cx]; // X axis (vertical drag)
        const fade = z > -10 ? 1 : clamp((z + 30) / 20, 0, 1);
        const centre = Math.max(0.3, 1 - Math.min(Math.hypot(x, y) / r, 1) * 0.7);
        const depth = (z + r) / (2 * r);
        return { x, y, z, fade, scale: centre * Math.max(0.5, 0.8 + depth * 0.3) };
      });

      // Shrink nodes that would overlap a neighbour on screen
      pos.forEach((p, i) => {
        if (p.fade <= 0) return;
        let s = p.scale;
        pos.forEach((o, j) => {
          if (i === j || o.fade <= 0) return;
          const min = (base * p.scale + base * o.scale) / 2 + 6;
          const d = Math.hypot(p.x - o.x, p.y - o.y);
          if (d > 0 && d < min) s = Math.min(s, s * Math.max(0.4, 1 - ((min - d) / min) * 0.6));
        });
        p.final = Math.max(0.25, s);
      });

      pos.forEach((p, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const shown = p.fade > 0;
        el.style.width = el.style.height = `${base}px`;
        const s = p.final ?? p.scale;
        el.style.transform = `translate3d(${size / 2 + p.x - base / 2}px, ${size / 2 + p.y - base / 2}px, 0) scale(${s})`;
        // On-screen size = base × s; CSS keeps the hit area ≥ 24px (WCAG 2.5.8) from these two
        el.style.setProperty('--node-hit', `${Math.max(base, 24 / s)}px`);
        el.style.opacity = p.fade;
        el.style.zIndex = Math.round(1000 + p.z);
        el.style.visibility = shown ? 'visible' : 'hidden';
      });
    };

    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 16.67, 3) : 1;
      last = now;
      if (!m.drag) {
        const auto = !reduce.matches && !m.focus && !m.open ? AUTO_SPEED : 0;
        m.vx *= Math.pow(DECAY, dt);
        m.vy *= Math.pow(DECAY, dt);
        if (Math.abs(m.vx) < 0.01) m.vx = 0;
        if (Math.abs(m.vy) < 0.01) m.vy = 0;
        m.rx = clamp(m.rx + m.vx * dt, -70, 70);
        m.ry = (m.ry + (m.vy + auto) * dt) % 360;
      }
      paint();
      frame = m.visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (!frame && m.visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    // Size the stage to the column, up to 960px
    const ro = new ResizeObserver(([entry]) => {
      m.size = Math.min(entry.contentRect.width, MAX_SIZE);
      stageRef.current.style.width = stageRef.current.style.height = `${m.size}px`;
      paint();
    });
    ro.observe(wrapRef.current);

    // Only animate while on screen
    const io = new IntersectionObserver(([entry]) => {
      m.visible = entry.isIntersecting;
      start();
    });
    io.observe(stageRef.current);

    m.start = start;
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Drag to rotate, with momentum on release
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const m = motion.current;
    m.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, type: e.pointerType };
    m.dragged = false;
    m.vx = m.vy = 0;
  };
  const onPointerMove = (e) => {
    const m = motion.current;
    const d = m.drag;
    if (!d || d.id !== e.pointerId) return;
    if (!m.dragged) {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 4) return;
      m.dragged = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const dx = e.clientX - d.x;
    const dy = d.type === 'touch' ? 0 : e.clientY - d.y; // touch: vertical belongs to page scroll
    m.vy = clamp(dx * DRAG, -MAX_SPEED, MAX_SPEED);
    m.vx = clamp(-dy * DRAG, -MAX_SPEED, MAX_SPEED);
    m.ry = (m.ry + m.vy) % 360;
    m.rx = clamp(m.rx + m.vx, -70, 70);
    d.x = e.clientX;
    d.y = e.clientY;
    m.start?.();
  };
  const onPointerUp = () => {
    motion.current.drag = null;
  };
  // A drag that ends over a photo must not open it
  const onClickCapture = (e) => {
    if (motion.current.dragged) {
      e.stopPropagation();
      e.preventDefault();
      motion.current.dragged = false;
    }
  };

  const open = (item) => {
    setSelected(item);
    motion.current.open = true;
    dialogRef.current?.showModal();
    dialogRef.current?.focus(); // no focus ring on the close button at open
    document.documentElement.style.overflow = 'hidden';
  };
  const onClose = () => {
    motion.current.open = false;
    motion.current.focus = false; // focus returns to the photo on close; keep spinning
    document.documentElement.style.overflow = '';
  };

  return (
    <div className="sphere-gallery" ref={wrapRef}>
      <div
        className="sphere-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onFocus={(e) => (motion.current.focus = e.target.matches(':focus-visible'))}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && (motion.current.focus = false)}
      >
        {nodes.map((item, i) => (
          <button
            type="button"
            className="sphere-node"
            key={i}
            ref={(el) => (nodeRefs.current[i] = el)}
            aria-label={`Besarkan foto: ${item.caption}`}
            onClick={() => open(item)}
          >
            <span className="sphere-node__disc">
              <img src={item.image} alt="" draggable={false} loading={i < 8 ? 'eager' : 'lazy'} />
            </span>
          </button>
        ))}
      </div>
      <p className="sphere-hint">Seret untuk memusingkan, pilih foto untuk melihatnya lebih besar.</p>

      <dialog
        tabIndex={-1}
        className="sphere-dialog"
        ref={dialogRef}
        aria-label={selected?.caption}
        onClose={onClose}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
      >
        {selected && <img src={selected.image} alt={selected.caption} />}
        <IconButton variant="media" icon={X} label="Tutup foto" className="sphere-dialog__close" onClick={() => dialogRef.current.close()} />
      </dialog>
    </div>
  );
}
