/**
 * Chip — taupe pill for suggestions and filters.
 *   href:    renders a link
 *   pressed: makes it a toggle (aria-pressed); selected = ink fill
 *   dot:     verdict key (palsu | waspada | makluman | benar) for a filter dot
 */
export default function Chip({ href, pressed, dot, className = '', children, ...props }) {
  const cls = ['ui-chip', dot && `ui-chip--${dot === 'penjelasan' ? 'benar' : dot}`, className].filter(Boolean).join(' ');
  const content = (
    <>
      {dot && <span className="ui-chip__dot" aria-hidden="true" />}
      {children}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} aria-pressed={pressed} {...props}>
      {content}
    </button>
  );
}

/** ChipRow — optional leading label ("Popular:") followed by chips. */
export function ChipRow({ label, className = '', children }) {
  return (
    <div className={`ui-chip-row ${className}`.trim()}>
      {label && <span className="ui-chip-row__label">{label}</span>}
      {children}
    </div>
  );
}
