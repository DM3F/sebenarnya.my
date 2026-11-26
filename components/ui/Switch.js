'use client';

import { useId } from 'react';

/**
 * Switch — an on/off setting that applies at once (no Save button). Native checkbox with role="switch".
 *   label · hint · hideLabel · checked / defaultChecked · onCheckedChange(checked) or onChange(event)
 * For a choice submitted with a form, use Checkbox instead.
 */
export default function Switch({ label, hint, hideLabel = false, onCheckedChange, onChange, disabled, id, className = '', ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint && !hideLabel ? `${inputId}-hint` : undefined;
  return (
    <label className={`ui-choice ui-choice--switch${disabled ? ' ui-choice--disabled' : ''} ${className}`.trim()} htmlFor={inputId}>
      <span className="ui-choice__control">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          className="ui-switch"
          disabled={disabled}
          aria-describedby={hintId}
          onChange={(e) => { onChange?.(e); onCheckedChange?.(e.target.checked); }}
          {...props}
        />
      </span>
      <span className={hideLabel ? 'ui-sr-only' : 'ui-choice__text'}>
        {label}
        {hintId && <span id={hintId} className="ui-choice__hint">{hint}</span>}
      </span>
    </label>
  );
}
