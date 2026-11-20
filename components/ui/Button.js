import Link from 'next/link';

/**
 * Button — pill control. Variants: filled (default), outline, ghost.
 * Pass `href` to render a link that looks like a button.
 */
export default function Button({ variant = 'filled', icon, href, className = '', children, ...props }) {
  const cls = `ui-btn ui-btn--${variant} ${className}`.trim();
  const content = (
    <>
      {icon}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {content}
    </button>
  );
}

export function ButtonGroup({ className = '', children }) {
  return <div className={`ui-btn-group ${className}`.trim()}>{children}</div>;
}
