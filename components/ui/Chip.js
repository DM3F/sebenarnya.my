import Link from 'next/link';

/** Chip — small pill for suggestions/filters. Pass `href` for a link. */
export default function Chip({ href, className = '', children, ...props }) {
  const cls = `ui-chip ${className}`.trim();
  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
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
