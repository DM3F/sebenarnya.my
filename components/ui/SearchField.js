'use client';

import { useId } from 'react';
import Button from './Button';
import { Search } from 'lucide-react';
import Icon from './Icon';

/**
 * SearchField — pill search with a filled submit button, in a <form role="search">.
 * Uncontrolled by default; pass `value` + `onChange(text)` to control it.
 * `onSubmit(query)` receives the trimmed query (default submit is prevented).
 * `error` shows a message under the field and marks the input invalid.
 * `label` is shown above the field; with `hideLabel` it is kept for screen readers.
 */
export default function SearchField({
  label = 'Cari dakwaan',
  hideLabel = false,
  placeholder = 'Cari dakwaan, topik atau kata kunci…',
  buttonLabel = 'Semak',
  name = 'q',
  value,
  defaultValue,
  onChange,
  error,
  action,
  onSubmit,
  className = '',
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const handleSubmit = (e) => {
    if (!onSubmit) return;
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget).get(name)?.toString().trim() ?? '');
  };
  return (
    <form role="search" action={action} onSubmit={handleSubmit} className={`ui-field ${className}`.trim()}>
      <label htmlFor={id} className={hideLabel ? 'ui-sr-only' : 'ui-field__label'}>
        {label}
      </label>
      <div className="ui-search" data-invalid={error ? '' : undefined}>
        <Icon icon={Search} size={18} className="ui-search__icon" />
        <input
          id={id}
          name={name}
          type="search"
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="ui-search__input"
          autoComplete="off"
        />
        <Button type="submit">{buttonLabel}</Button>
      </div>
      {error && (
        <p id={errorId} className="ui-field__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
