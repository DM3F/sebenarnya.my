/** Separator — a hairline between groups. `decorative` (default) hides it from screen readers. */
export default function Separator({ orientation = 'horizontal', decorative = true, className = '' }) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={`ui-separator ui-separator--${orientation} ${className}`.trim()}
    />
  );
}
