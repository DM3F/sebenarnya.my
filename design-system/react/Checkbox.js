'use client';

import { useEffect, useId, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import Icon from './Icon';

/**
 * Checkbox — native <input type="checkbox"> drawn with tokens.
 *   label (required, also when hidden: it is the accessible name) · hint · hideLabel
 *   checked / defaultChecked · indeterminate (a "some selected" header box)
 *   onCheckedChange(checked) or onChange(event)
 * The hit area is --size-hit-area (44, or 24 in compact density) without growing the box.
 */
export default function Checkbox({
  label, hint, hideLabel = false, indeterminate = false, onCheckedChange, onChange, disabled, id, className = '', ...props
}) {
  const ref = useRef(null);
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint && !hideLabel ? `${inputId}-hint` : undefined;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={`ui-choice${disabled ? ' ui-choice--disabled' : ''} ${className}`.trim()} htmlFor={inputId}>
      <span className="ui-choice__control">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="ui-checkbox"
          disabled={disabled}
          aria-describedby={hintId}
          onChange={(e) => { onChange?.(e); onCheckedChange?.(e.target.checked); }}
          {...props}
        />
        <Icon icon={Check} size="sm" className="ui-choice__mark ui-choice__mark--check" />
        <Icon icon={Minus} size="sm" className="ui-choice__mark ui-choice__mark--dash" />
      </span>
      <span className={hideLabel ? 'ui-sr-only' : 'ui-choice__text'}>
        {label}
        {hintId && <span id={hintId} className="ui-choice__hint">{hint}</span>}
      </span>
    </label>
  );
}
