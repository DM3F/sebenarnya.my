import { CircleAlert, CircleCheck, Info } from 'lucide-react';
import Icon from './Icon';

const ICONS = { default: Info, success: CircleCheck, destructive: CircleAlert };

/**
 * Alert — a message that stays on the page (a form error summary, a notice above a table).
 * For a short confirmation that goes away by itself, use toast().
 *   variant: default · success · destructive (destructive is announced at once: role="alert")
 *   title · children (description) · action (e.g. a link Button) · icon (Lucide, optional)
 */
export default function Alert({ variant = 'default', title, icon, action, className = '', children }) {
  return (
    <div
      role={variant === 'destructive' ? 'alert' : 'status'}
      className={`ui-alert${variant !== 'default' ? ` ui-alert--${variant}` : ''} ${className}`.trim()}
    >
      <Icon icon={icon ?? ICONS[variant] ?? Info} size="lg" />
      <div className="ui-alert__body">
        {title && <p className="ui-alert__title">{title}</p>}
        {children && <div className="ui-alert__description">{children}</div>}
      </div>
      {action && <div className="ui-alert__action">{action}</div>}
    </div>
  );
}
