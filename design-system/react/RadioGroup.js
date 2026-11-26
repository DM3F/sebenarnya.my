'use client';

import { useId } from 'react';

/**
 * RadioGroup — pick one of a few options, all visible. Native radios in a <fieldset>.
 *   label (the question, rendered as the legend) · hideLabel · name
 *   items [{ value, label, hint?, disabled? }] · value / defaultValue · onValueChange(value)
 *   orientation: vertical (default) · horizontal
 * More than ~5 options: use Select.
 */
export default function RadioGroup({
  label, hideLabel = false, name, items, value, defaultValue, onValueChange, orientation = 'vertical', disabled, className = '',
}) {
  const autoId = useId();
  const group = name ?? autoId;
  return (
    <fieldset className={`ui-radio-group${orientation === 'horizontal' ? ' ui-radio-group--row' : ''} ${className}`.trim()} disabled={disabled}>
      <legend className={hideLabel ? 'ui-sr-only' : 'ui-label ui-radio-group__legend'}>{label}</legend>
      {items.map((item) => {
        const id = `${autoId}-${item.value}`;
        const hintId = item.hint ? `${id}-hint` : undefined;
        const controlled = value !== undefined;
        return (
          <label key={item.value} className={`ui-choice${item.disabled || disabled ? ' ui-choice--disabled' : ''}`} htmlFor={id}>
            <span className="ui-choice__control">
              <input
                id={id}
                type="radio"
                className="ui-radio"
                name={group}
                value={item.value}
                disabled={item.disabled}
                aria-describedby={hintId}
                {...(controlled ? { checked: value === item.value } : { defaultChecked: defaultValue === item.value })}
                onChange={(e) => e.target.checked && onValueChange?.(item.value)}
              />
              <span className="ui-radio-dot" aria-hidden="true" />
            </span>
            <span className="ui-choice__text">
              {item.label}
              {hintId && <span id={hintId} className="ui-choice__hint">{item.hint}</span>}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
