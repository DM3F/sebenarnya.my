/**
 * Card — a surface that groups one subject. Parts mirror shadcn/ui:
 *   <Card variant="outline" size="sm">
 *     <CardHeader>
 *       <CardTitle>Semakan minggu ini</CardTitle>
 *       <CardDescription>7 hari terakhir</CardDescription>
 *       <CardAction><Button size="sm" variant="ghost">Lihat semua</Button></CardAction>
 *     </CardHeader>
 *     <CardContent>…</CardContent>
 *     <CardFooter>…</CardFooter>
 *   </Card>
 *   variant: muted (default, taupe) · outline (canvas + edge) · raised (white + edge)
 *   size:    sm · md (default) · lg — padding and radius travel together
 */
const cx = (...c) => c.filter(Boolean).join(' ');

export function Card({ variant = 'muted', size = 'md', as: Tag = 'div', className = '', ...props }) {
  return <Tag className={cx('ui-card', variant !== 'muted' && `ui-card--${variant}`, size !== 'md' && `ui-card--${size}`, className)} {...props} />;
}

export function CardHeader({ className = '', children, ...props }) {
  // Title + description stack on the left; a CardAction sits top-right
  const kids = Array.isArray(children) ? children : [children];
  const action = kids.filter((c) => c?.type === CardAction);
  const rest = kids.filter((c) => c?.type !== CardAction);
  return (
    <div className={cx('ui-card__header', className)} {...props}>
      <div className="ui-card__heading">{rest}</div>
      {action}
    </div>
  );
}

export function CardTitle({ as: Tag = 'h3', className = '', ...props }) {
  return <Tag className={cx('ui-card__title', className)} {...props} />;
}

export function CardDescription({ className = '', ...props }) {
  return <p className={cx('ui-card__description', className)} {...props} />;
}

export function CardAction({ className = '', ...props }) {
  return <div className={cx('ui-card__action', className)} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={cx('ui-card__content', className)} {...props} />;
}

export function CardFooter({ className = '', ...props }) {
  return <div className={cx('ui-card__footer', className)} {...props} />;
}
