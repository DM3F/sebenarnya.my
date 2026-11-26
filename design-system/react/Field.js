'use client';

import { cloneElement, isValidElement, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from './Icon';

/**
 * Form fields, modelled on shadcn/ui's Label / Input / Textarea / Select / Field.
 * Plain native elements underneath (keyboard, autofill and mobile pickers work).
 *
 *   <Field label="E-mel" required hint="…" error={err}>
 *     <Input type="email" name="email" autoComplete="email" />
 *   </Field>
 *
 * Field wires id, aria-invalid and aria-describedby into its single child.
 */
export function Field({ label, required, hint, error, hideLabel = false, className = '', children }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id ?? id,
        required: children.props.required ?? required,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })
    : children;
  return (
    <div className={`ui-field ${className}`.trim()}>
      <label htmlFor={children?.props?.id ?? id} className={hideLabel ? 'ui-sr-only' : 'ui-label'}>
        {label}
        {required && <span className="ui-label__required" aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={hintId} className="ui-field__hint">
          {hint}
        </p>
      )}
      {control}
      {error && (
        <p id={errorId} className="ui-field__error">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldSize = (base, size) => (size === 'sm' || size === 'lg' ? ` ${base}--${size}` : '');

/** Input — `pill` for toolbar/search-style fields, `icon` for a leading Lucide icon, `size` sm · md (default) · lg. */
export function Input({ pill = false, icon, size = 'md', className = '', ...props }) {
  const input = (
    <input className={`ui-input${pill ? ' ui-input--pill' : ''}${fieldSize('ui-input', size)} ${className}`.trim()} {...props} />
  );
  if (!icon) return input;
  return (
    <span className="ui-input-wrap">
      <Icon icon={icon} />
      {input}
    </span>
  );
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`ui-textarea ${className}`.trim()} {...props} />;
}

/** Select — native <select> with the system chevron replaced by Lucide. `size` sm · md (default) · lg. */
export function Select({ pill = false, size = 'md', className = '', children, ...props }) {
  return (
    <span className={`ui-select${pill ? ' ui-select--pill' : ''}${fieldSize('ui-select', size)} ${className}`.trim()}>
      <select className="ui-select__control" {...props}>
        {children}
      </select>
      <Icon icon={ChevronDown} />
    </span>
  );
}
