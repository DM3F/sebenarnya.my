import { Inbox } from 'lucide-react';
import Icon from './Icon';

/**
 * EmptyState — a list or table with nothing in it yet: say what will appear and how to add the first one.
 *   icon (Lucide) · title · description · action (e.g. <Button>)
 */
export default function EmptyState({ icon = Inbox, title, description, action, className = '' }) {
  return (
    <div className={`ui-empty ${className}`.trim()}>
      <Icon icon={icon} size="display" />
      <div className="ui-empty__text">
        <p className="ui-empty__title">{title}</p>
        {description && <p className="ui-empty__description">{description}</p>}
      </div>
      {action}
    </div>
  );
}
