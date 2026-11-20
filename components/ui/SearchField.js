'use client';

import { useId } from 'react';
import Button from './Button';

function SearchIcon() {
  return (
    <svg className="ui-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/**
 * SearchField — pill search with a filled submit button.
 * Renders a <form role="search">; `onSubmit` receives the query string.
 * `label` is shown above the field; when omitted it is kept for screen readers.
 */
export default function SearchField({
  label = 'Cari dakwaan',
  hideLabel = false,
  placeholder = 'Cari dakwaan, topik atau kata kunci…',
  buttonLabel = 'Semak',
  name = 'q',
  defaultValue,
  action,
  onSubmit,
  className = '',
}) {
  const id = useId();
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
      <div className="ui-search">
        <SearchIcon />
        <input id={id} name={name} type="search" defaultValue={defaultValue} placeholder={placeholder} className="ui-search__input" autoComplete="off" />
        <Button type="submit">{buttonLabel}</Button>
      </div>
    </form>
  );
}
