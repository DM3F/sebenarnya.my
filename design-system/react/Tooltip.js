'use client';

import { cloneElement, useEffect, useId, useRef, useState } from 'react';

/**
 * Tooltip — a short name for an icon-only control, never essential information.
 *   <Tooltip content="Padam"><IconButton icon={Trash} label="Padam" /></Tooltip>
 * Shows after 400ms of hover or at once on keyboard focus; Escape hides it (WCAG 1.4.13).
 * Touch has no hover, so the control's own label must carry the meaning.
 *   side: top (default) · bottom
 */
export default function Tooltip({ content, side = 'top', children }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const timer = useRef(null);
  const hide = () => { clearTimeout(timer.current); setOpen(false); };
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <span
      className={`ui-tooltip${side === 'bottom' ? ' ui-tooltip--bottom' : ''}`}
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(true), 400);
      }}
      onPointerLeave={hide}
      onFocus={(e) => e.target.matches(':focus-visible') && setOpen(true)}
      onBlur={hide}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span role="tooltip" id={id} className="ui-tooltip__bubble" hidden={!open}>{content}</span>
    </span>
  );
}
