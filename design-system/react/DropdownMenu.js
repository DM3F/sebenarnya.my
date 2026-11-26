'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from './Icon';

/**
 * DropdownMenu — nav-style disclosure: a pill trigger with a chevron that opens
 * a list of links. `items` [{ label, href, current? }]; `current` marks the
 * trigger as the active section. Closes on Escape, outside click and blur.
 * Renders plain <a> links (no framework dependency).
 */
export default function DropdownMenu({ label, items, current = false, align = 'start', className = '' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

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

  return (
    <div
      ref={rootRef}
      className={`ui-dropdown ui-dropdown--${align} ${className}`.trim()}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        className="ui-navlink ui-dropdown__trigger"
        aria-expanded={open}
        aria-controls={menuId}
        data-current={current ? '' : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <Icon icon={ChevronDown} className="ui-dropdown__chevron" />
      </button>
      <ul id={menuId} className="ui-menu ui-dropdown__menu" hidden={!open}>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="ui-dropdown__item" aria-current={item.current ? 'page' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
