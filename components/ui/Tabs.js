'use client';

import { useRef } from 'react';

/**
 * Tabs — segmented control (also used as the language switcher).
 * Controlled: pass `items` [{ value, label, title? }], `value` and `onChange`.
 * Arrow keys move between items (WAI-ARIA tabs pattern, automatic activation).
 */
export default function Tabs({ items, value, onChange, label, className = '' }) {
  const refs = useRef([]);

  const onKeyDown = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let next = step !== undefined ? (i + step + items.length) % items.length : null;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange?.(items[next].value);
  };

  return (
    <div role="tablist" aria-label={label} className={`ui-tabs ${className}`.trim()}>
      {items.map((item, i) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            title={item.title}
            className="ui-tab"
            onClick={() => onChange?.(item.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
