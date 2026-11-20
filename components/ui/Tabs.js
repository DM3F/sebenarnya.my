'use client';

import { useRef } from 'react';

/**
 * Tabs — segmented pill control.
 * Controlled: pass `items` [{ value, label, title?, lang? }], `value` and `onChange`.
 *
 * mode="tabs"   (default) role=tablist/tab, for switching views; arrow keys move
 *               and select (WAI-ARIA tabs pattern, automatic activation).
 * mode="toggle" role=group with aria-pressed buttons, for settings such as the
 *               language switcher where there are no tab panels.
 */
export default function Tabs({ items, value, onChange, label, mode = 'tabs', className = '' }) {
  const refs = useRef([]);
  const isTabs = mode === 'tabs';

  const onKeyDown = (e, i) => {
    if (!isTabs) return;
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
    <div role={isTabs ? 'tablist' : 'group'} aria-label={label} className={`ui-tabs ${className}`.trim()}>
      {items.map((item, i) => {
        const selected = item.value === value;
        const state = isTabs
          ? { role: 'tab', 'aria-selected': selected, tabIndex: selected ? 0 : -1 }
          : { 'aria-pressed': selected };
        return (
          <button
            key={item.value}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            {...state}
            lang={item.lang}
            title={item.title}
            aria-label={item.title}
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
