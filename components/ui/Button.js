/**
 * Button — pill control. Variants: filled (default), outline, ghost.
 * Pass `href` to render a plain <a> that looks like a button (no framework
 * dependency, so it also works in the CMS and the browser extension).
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
      <a href={href} className={cls} {...props}>
        {content}
      </a>
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
