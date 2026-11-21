import Icon from './Icon';

/**
 * Badge — non-interactive pill label (category, source, award, platform).
 *   variant: muted (default) · outline · media (on photos and dark panels)
 *   size:    default (28) · lg (44, sits in a row of 44px controls)
 */
export default function Badge({ variant = 'muted', size = 'default', icon, className = '', children, ...props }) {
  const cls = ['ui-badge', `ui-badge--${variant}`, size !== 'default' && `ui-badge--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} {...props}>
      {icon && <Icon icon={icon} />}
      {children}
    </span>
  );
}
