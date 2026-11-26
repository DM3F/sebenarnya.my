/**
 * Icon — the one way to draw an icon in this design system.
 * Every UI icon comes from Lucide (https://lucide.dev, `lucide-react`), passed as `icon`:
 *
 *   import { ArrowRight } from 'lucide-react';
 *   <Icon icon={ArrowRight} />            // md 16px, decorative
 *   <Icon icon={Search} size="lg" />      // 20px
 *
 * Sizes (match --size-icon-* in tokens.css; numbers are not allowed):
 *   sm 14 badges, small meta · md 16 next to a label, in buttons (default)
 *   lg 20 fields, search, icon-only list items · xl 24 icon-only buttons, status marks
 *   display 40 empty states, upload zones
 *
 * Defaults keep every icon consistent:
 * - stroke 1.75px at any size (absoluteStrokeWidth), matching Medium 500 labels
 * - colour = currentColor, so it follows the text/semantic token it sits in
 * - decorative (aria-hidden); the control around it carries the accessible name
 *
 * Brand logos (Facebook, Instagram, TikTok…) are not in Lucide and stay as brand SVGs.
 */
const SIZES = { sm: 14, md: 16, lg: 20, xl: 24, display: 40 };

export default function Icon({ icon: Glyph, size = 'md', strokeWidth = 1.75, className = '', ...props }) {
  return (
    <Glyph
      size={SIZES[size] ?? SIZES.md}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      aria-hidden="true"
      focusable="false"
      className={`ui-icon ${className}`.trim()}
      {...props}
    />
  );
}
