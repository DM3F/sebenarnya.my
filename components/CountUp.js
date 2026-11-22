'use client';

import { useEffect, useRef } from 'react';

const DURATION = 2000; // ms
const format = (n, sep) => (sep ? Math.round(n).toLocaleString('en-US') : String(Math.round(n)));

/**
 * CountUp — a statistic that counts from 0 to `value` once it scrolls into view.
 * - Width is locked first (in tabular figures) so nothing around it moves while it counts.
 * - Tabular figures only while counting; settles on proportional figures, which read tighter
 *   at display size (tabular "1" leaves a wide gap in Manrope).
 * - Server HTML and reduced motion show the final number straight away.
 */
export default function CountUp({ value, sep = false, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame;
    el.classList.add('is-counting');
    el.style.setProperty('--count-w', `${el.getBoundingClientRect().width}px`);

    const run = () => {
      const start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / DURATION);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // ease-out expo
        el.textContent = format(value * eased, sep);
        if (p < 1) frame = requestAnimationFrame(step);
        else {
          el.classList.remove('is-counting');
          el.style.removeProperty('--count-w');
        }
      };
      el.textContent = '0';
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, sep]);

  return (
    <span ref={ref} className={`count ${className}`.trim()}>
      {format(value, sep)}
    </span>
  );
}
