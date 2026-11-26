import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import Icon from './Icon';

/**
 * Table — data rows, parts mirror shadcn/ui:
 *   <Table label="Semakan terkini">
 *     <TableHeader><TableRow><TableHead sort="descending" onSort={…}>Tarikh</TableHead>…</TableRow></TableHeader>
 *     <TableBody><TableRow selected>…<TableCell align="num">1,204</TableCell></TableRow></TableBody>
 *   </Table>
 * The frame scrolls sideways on its own; `label` names it for screen readers and makes it
 * keyboard-scrollable. Row height = --size-row (48, or 40 in compact density).
 */
const cx = (...c) => c.filter(Boolean).join(' ');

export function Table({ label, caption, className = '', children, ...props }) {
  return (
    <div className="ui-table-wrap" role={label ? 'region' : undefined} aria-label={label} tabIndex={label ? 0 : undefined}>
      <table className={cx('ui-table', className)} {...props}>
        {caption && <caption className="ui-table__caption">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export const TableHeader = ({ className = '', ...props }) => <thead className={cx('ui-table__header', className)} {...props} />;
export const TableBody = ({ className = '', ...props }) => <tbody className={cx('ui-table__body', className)} {...props} />;
export const TableFooter = ({ className = '', ...props }) => <tfoot className={cx('ui-table__footer', className)} {...props} />;
export const TableCaption = ({ className = '', ...props }) => <caption className={cx('ui-table__caption', className)} {...props} />;

/** `selected` marks the row (aria-selected) for row selection. */
export function TableRow({ selected, className = '', ...props }) {
  return <tr className={cx('ui-table__row', className)} aria-selected={selected === undefined ? undefined : selected} {...props} />;
}

const SORT_ICON = { ascending: ArrowUp, descending: ArrowDown };

/**
 * TableHead — a column heading.
 *   align="num" right-aligns numbers · check for a selection column
 *   sort: ascending · descending · none, with onSort() → the heading becomes a button
 */
export function TableHead({ align, check, sort, onSort, className = '', children, ...props }) {
  return (
    <th
      scope="col"
      aria-sort={onSort ? (sort ?? 'none') : undefined}
      className={cx('ui-table__head', align === 'num' && 'ui-table__head--num', check && 'ui-table__head--check', className)}
      {...props}
    >
      {onSort ? (
        <button type="button" className="ui-table__sort" onClick={onSort}>
          {children}
          <Icon icon={SORT_ICON[sort] ?? ArrowUpDown} size="sm" />
        </button>
      ) : children}
    </th>
  );
}

export function TableCell({ align, check, className = '', ...props }) {
  return <td className={cx('ui-table__cell', align === 'num' && 'ui-table__cell--num', check && 'ui-table__cell--check', className)} {...props} />;
}
