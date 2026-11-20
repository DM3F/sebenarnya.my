/**
 * Icon — the one way to draw an icon in this design system.
 * Every UI icon comes from Lucide (https://lucide.dev, `lucide-react`), passed as `icon`:
 *
 *   import { ArrowRight } from 'lucide-react';
 *   <Icon icon={ArrowRight} />            // 16px, decorative
 *   <Icon icon={Search} size={20} />
 *
 * Defaults keep every icon consistent:
 * - stroke 1.75px at any size (absoluteStrokeWidth), matching Medium 500 labels
 * - colour = currentColor, so it follows the text/semantic token it sits in
 * - decorative (aria-hidden); the control around it carries the accessible name
 *
 * Brand logos (Facebook, Instagram, TikTok…) are not in Lucide and stay as brand SVGs.
 */
export default function Icon({ icon: Glyph, size = 16, strokeWidth = 1.75, className = '', ...props }) {
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      aria-hidden="true"
      focusable="false"
      className={`ui-icon ${className}`.trim()}
      {...props}
    />
  );
}
