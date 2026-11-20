/** NavLink — borderless pill link for navigation; `current` marks the active page. */
export default function NavLink({ href, current = false, className = '', children, ...props }) {
  return (
    <a href={href} aria-current={current ? 'page' : undefined} className={`ui-navlink ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}
