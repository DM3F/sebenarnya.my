/**
 * Skeleton — the shape of content that is still loading. Size it like the content it stands for.
 *   variant: block (default) · text (one line) · circle (avatar)
 *   width / height: any CSS length, e.g. "60%" or "var(--size-avatar)"
 * Mark the region that is loading with aria-busy="true"; the skeleton itself is hidden from screen readers.
 */
export default function Skeleton({ variant = 'block', width, height, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`ui-skeleton${variant !== 'block' ? ` ui-skeleton--${variant}` : ''} ${className}`.trim()}
      style={{ width, height }}
    />
  );
}
