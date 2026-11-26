import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import Button from './Button';
import Icon from './Icon';

// 1 … 4 5 6 … 20: first, last, and the pages either side of the current one
export function pageList(page, count) {
  const keep = new Set([1, count, page - 1, page, page + 1].filter((n) => n >= 1 && n <= count));
  const out = [];
  let prev = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (n - prev > 1) out.push(n - prev === 2 ? prev + 1 : 'gap-' + n);
    out.push(n);
    prev = n;
  }
  return out;
}

/**
 * Pagination — move through pages of a list.
 *   page (1-based) · pageCount · onPageChange(page) · label (names the nav)
 *   href(page) renders links instead of buttons (for server-rendered lists).
 */
export default function Pagination({ page, pageCount, onPageChange, href, label = 'Penomboran halaman', className = '' }) {
  if (pageCount <= 1) return null;
  const go = (n) => (href ? { href: href(n) } : { onClick: () => onPageChange?.(n) });
  return (
    <nav aria-label={label} className={`ui-pagination ${className}`.trim()}>
      <ul className="ui-pagination__list">
        <li>
          <Button variant="quiet" icon={ChevronLeft} disabled={page <= 1} {...(page > 1 ? go(page - 1) : {})}>Sebelum</Button>
        </li>
        {pageList(page, pageCount).map((n) => (
          <li key={n}>
            {typeof n === 'string' ? (
              <span className="ui-pagination__ellipsis" aria-hidden="true"><Icon icon={Ellipsis} /></span>
            ) : (
              <Button
                variant="quiet"
                size="icon"
                aria-current={n === page ? 'page' : undefined}
                aria-label={`Halaman ${n}`}
                {...go(n)}
              >
                {n}
              </Button>
            )}
          </li>
        ))}
        <li>
          <Button variant="quiet" iconEnd={ChevronRight} disabled={page >= pageCount} {...(page < pageCount ? go(page + 1) : {})}>Seterusnya</Button>
        </li>
      </ul>
    </nav>
  );
}
