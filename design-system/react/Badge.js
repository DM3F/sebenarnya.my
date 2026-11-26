import Icon from './Icon';

/**
 * Badge — non-interactive pill label (category, source, award, platform).
 *   variant: muted (default) · outline · media (on photos and dark panels)
 *   size:    sm (20, 12px text) · md (24, default) · lg (32, 14px text)
 */
export default function Badge({ variant = 'muted', size = 'md', icon, className = '', children, ...props }) {
  const cls = ['ui-badge', `ui-badge--${variant}`, size !== 'md' && size !== 'default' && `ui-badge--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} {...props}>
      {icon && <Icon icon={icon} />}
      {children}
    </span>
  );
}
