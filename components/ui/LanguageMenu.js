'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from './Icon';

/**
 * LanguageMenu — flag pill that opens a grouped list of languages.
 *   items: [{ value, label, lang, flag }]   flag = image URL (round-cropped)
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
        aria-label={`${label}: ${current.label}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <img className="ui-lang__flag" src={current.flag} alt="" />
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
                aria-pressed={item.value === value}
                onClick={() => pick(item.value)}
              >
                <img className="ui-lang__flag" src={item.flag} alt="" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
