import { isValidElement } from 'react';
import Icon from './Icon';

// Accept a Lucide component (preferred) or a ready element (<Icon icon={X} />)
const renderIcon = (icon, className) =>
  isValidElement(icon) ? icon : <Icon icon={icon} className={className} />;

/**
 * Button — pill control, API modelled on shadcn/ui.
 *
 *   variant: filled (default) · outline · secondary · ghost · media · link
 *            `media` = canvas pill for photos and dark panels.
 *   size:    sm · md (default) · lg · icon-sm · icon · icon-lg — fluid heights from the control
 *            scale in tokens.css: sm 32→36 · md 40→44 · lg 44→48 (phone → desktop).
 *            Anything under 44px keeps a 44px touch target.
 *   icon:    Lucide component placed before the label (e.g. Download, Share)
 *   iconEnd: Lucide component after the label (e.g. ArrowRight); nudges on hover
 *   href:    renders an <a>. Pass `as={Link}` to use next/link.
 *
 * Icon-only buttons (size icon*) must get an `aria-label`.
 */
export default function Button({
  variant = 'filled',
  size = 'default',
  icon,
  iconEnd,
  href,
  as,
  className = '',
  children,
  ...props
}) {
  const cls = ['ui-btn', `ui-btn--${variant}`, size !== 'default' && size !== 'md' && `ui-btn--${size}`, className]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {icon && renderIcon(icon)}
      {children}
      {iconEnd && renderIcon(iconEnd, 'ui-btn__icon-end')}
    </>
  );
  if (href) {
    const Tag = as ?? 'a';
    return (
      <Tag href={href} className={cls} {...props}>
        {content}
      </Tag>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {content}
    </button>
  );
}

/** IconButton — Button with only an icon. `label` becomes the accessible name. */
export function IconButton({ icon, label, size = 'icon', variant = 'outline', ...props }) {
  return <Button variant={variant} size={size} icon={icon} aria-label={label} {...props} />;
}

export function ButtonGroup({ className = '', children }) {
  return <div className={`ui-btn-group ${className}`.trim()}>{children}</div>;
}
