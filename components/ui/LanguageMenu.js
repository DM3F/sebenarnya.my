'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from './Icon';

/**
 * LanguageMenu — pill showing the language code (BM / EN) that opens a short list of codes.
 *   items: [{ value, label, lang }]   value = code shown ("BM"), label = full name (accessible name only)
 *   value / onChange: controlled selection; groupLabel: small heading in the menu.
 * Closes on Escape (focus returns to the trigger), outside click, blur and selection.
 */
export default function LanguageMenu({ items, value, onChange, label = 'Bahasa', groupLabel, align = 'end', className = '' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();
  const current = items.find((i) => i.value === value) ?? items[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (v) => {
    onChange?.(v);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={`ui-lang ui-lang--${align} ${className}`.trim()}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        className="ui-lang__trigger"
        aria-label={`${current.value} — ${label}: ${current.label}`} /* visible code first (WCAG 2.5.3) */
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ui-lang__code">{current.value}</span>
        <Icon icon={ChevronDown} className="ui-lang__chevron" />
      </button>
      <div id={menuId} className="ui-lang__menu" hidden={!open}>
        {groupLabel && <p className="ui-lang__group">{groupLabel}</p>}
        <ul>
          {items.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                className="ui-lang__item"
                lang={item.lang}
                aria-label={`${item.value} — ${item.label}`}
                aria-pressed={item.value === value}
                onClick={() => pick(item.value)}
              >
                {item.value}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
