import { ChevronRight } from 'lucide-react';
import Icon from './Icon';

/**
 * Breadcrumb — where this page sits. items [{ label, href? }]; the last item is the
 * current page (aria-current). Pass `linkAs={Link}` for a router link.
 */
export default function Breadcrumb({ items, linkAs: LinkTag = 'a', label = 'Laluan halaman', className = '' }) {
  return (
    <nav aria-label={label} className={`ui-breadcrumb ${className}`.trim()}>
      <ol className="ui-breadcrumb__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${i}-${item.label}`} className="ui-breadcrumb__item">
              {last || !item.href ? (
                <span className={last ? 'ui-breadcrumb__page' : undefined} aria-current={last ? 'page' : undefined}>{item.label}</span>
              ) : (
                <LinkTag href={item.href} className="ui-breadcrumb__link">{item.label}</LinkTag>
              )}
              {!last && <Icon icon={ChevronRight} size="sm" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
