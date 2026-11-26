/**
 * Sebenarnya design system — Tailwind CSS 3.4 preset (browser extension).
 *
 * Every class reads a token from tokens.css through var(), so a change in tokens.css
 * (a colour, a radius, a control height) reaches the extension with no code change.
 * The class names are read from tokens.css when Tailwind starts: a new token is a new
 * class automatically.
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('./design-system/tailwind-preset.cjs')],
 *     content: ['./src/**\/*.{ts,tsx,html}'],
 *   };
 *
 *   /* the extension's CSS entry *\/
 *   @import './design-system/tokens.css';   → the values
 *   @tailwind base;
 *   @import './design-system/base.css';     → body type and colour, form controls
 *   @tailwind components;
 *   @tailwind utilities;
 *
 * The preset REPLACES Tailwind's colours, type sizes, spacing, radius, weights and
 * breakpoints instead of extending them, so off-system values (bg-red-500, text-sm,
 * p-4 = 1rem, rounded-lg, font-bold, md: min-width) do not exist. Everything is px:
 * rem would follow the host page's root size inside a content script.
 *
 * Class cheat sheet (full list: docs/README.md › Browser extension):
 *   colour     bg-background  text-foreground  text-muted-foreground  border-border
 *              bg-primary  text-primary-foreground  hover:bg-primary-hover
 *              text-verdict-palsu  bg-verdict-palsu-dot …
 *   type       text-display  text-heading  text-title  text-body  text-body-sm
 *              text-label  text-caption  text-verdict …  (size + line height + weight)
 *   size       h-control  h-control-sm  h-control-lg  size-avatar  w-dot …
 *   spacing    gap-inline  gap-text  gap-group  gap-cards  gap-block
 *              p-card  p-card-sm  p-card-lg  px-control-x  py-section …
 *              numbers are px and match --spacing-N: p-16 = 16px, gap-8 = 8px
 *   shape      rounded-control  rounded-badge  rounded-card  rounded-card-lg
 *              rounded-field  rounded-media  rounded-full (circles only)
 *   effects    shadow-float  shadow-overlay  duration-fast  ease-out  z-dropdown
 *   focus      outline-focus outline-offset-focus outline-ring
 *   screens    xl: lg: md: sm: are MAX-width (1280 / 1100 / 900 / 600), mobile last
 */
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

// tokens.css sits next to this file in the package, or in app/ inside the website repo
function tokenNames(file) {
  const candidates = [file, join(__dirname, 'tokens.css'), join(__dirname, '..', 'app', 'tokens.css')].filter(Boolean);
  const path = candidates.find((p) => existsSync(p));
  if (!path) throw new Error('Sebenarnya Tailwind preset: tokens.css not found (pass { tokensPath }).');
  const css = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...new Set([...css.matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]))];
}

// The same primitives lint-ds keeps out of components
const isPrimitive = (n) =>
  /^color-(white|black|grey-\d+|red|red-dark|blue|azure|green|green-dark)$/.test(n)
  || /^(text-\d+|leading-[\w-]+)$/.test(n)
  || /^radius-(sm|input|md|lg)$/.test(n);

const v = (name) => `var(--${name})`;
const pick = (names, re, key = (m) => m[1]) =>
  Object.fromEntries(names.map((n) => [n, n.match(re)]).filter(([n, m]) => m && !isPrimitive(n)).map(([n, m]) => [key(m), v(n)]));

function createPreset({ tokensPath } = {}) {
  const names = tokenNames(tokensPath);

  // Semantic colours only; component-specific ones (folder, tile) stay in their component
  const colors = {
    transparent: 'transparent',
    current: 'currentColor',
    inherit: 'inherit',
    ...pick(names, /^color-((?!folder|tile)[\w-]+)$/),
  };

  // Type roles: size + line height + weight (+ tracking) in one class, e.g. text-heading
  const roles = names.filter((n) => /^text-[a-z][\w-]*$/.test(n) && !n.includes('--') && !isPrimitive(n));
  const fontSize = Object.fromEntries(roles.map((n) => {
    const extra = { lineHeight: v(`${n}--line-height`) };
    if (names.includes(`${n}--font-weight`)) extra.fontWeight = v(`${n}--font-weight`);
    if (names.includes(`${n}--letter-spacing`)) extra.letterSpacing = v(`${n}--letter-spacing`);
    return [n.slice('text-'.length), [v(n), extra]];
  }));

  // Spacing: px steps (p-16 = 16px = --spacing-16) + relationship roles + sizes
  const spacing = {
    0: '0px',
    px: '1px',
    ...pick(names, /^spacing-(\d+)$/),
    ...pick(names, /^space-([\w-]+)$/),             // px-control-x, py-section, px-page-x … (before gap-*: a gap role wins a name clash)
    ...pick(names, /^gap-([\w-]+)$/),               // gap-group → gap-group, p-group …
    ...pick(names, /^pad-(card[\w-]*)$/),           // p-card, p-card-sm, p-card-lg
    ...pick(names, /^size-([\w-]+)$/),              // h-control, size-avatar, w-dot …
    ...pick(names, /^(avatar-inset)$/),
  };

  const borderRadius = {
    none: '0px',
    full: v('radius-full'),                         // circles only
    ...pick(names, /^radius-(?!full$)([\w-]+)$/),   // rounded-control, rounded-badge, rounded-card …
  };

  const fontWeight = pick(names, /^font-weight-([\w-]+)$/);

  return {
    theme: {
      // Max-width, mobile last — the same four breakpoints as the website
      screens: { xl: { max: '1280px' }, lg: { max: '1100px' }, md: { max: '900px' }, sm: { max: '600px' } },
      colors,
      fontFamily: { sans: v('font-sans') },
      fontSize,
      fontWeight,
      spacing,
      borderRadius,
      borderWidth: { 0: '0px', DEFAULT: v('border-width'), hairline: v('border-width-hairline') },
      letterSpacing: { normal: '0', label: v('tracking-label') },
      lineHeight: { none: '1', heading: 'var(--leading-heading)', body: 'var(--leading-body)' },
      boxShadow: { none: 'none', ...pick(names, /^shadow-([\w-]+)$/) },
      transitionDuration: { 0: '0ms', ...pick(names, /^duration-([\w-]+)$/) },
      transitionTimingFunction: { linear: 'linear', ...pick(names, /^ease-([\w-]+)$/) },
      zIndex: { auto: 'auto', ...Object.fromEntries([-1, 0, 1, 2, 3, 4, 5].map((n) => [n, String(n)])), ...pick(names, /^z-([\w-]+)$/) },
      maxWidth: ({ theme }) => ({ none: 'none', full: '100%', ...theme('spacing'), ...pick(names, /^measure-([\w-]+)$/) }),
      outlineWidth: { 0: '0px', focus: v('focus-ring-width') },
      outlineOffset: { 0: '0px', focus: v('focus-ring-offset') },
      outlineColor: ({ theme }) => ({ ...theme('colors'), focus: v('focus-ring-color'), 'focus-inverse': v('focus-ring-color-inverse') }),
      scale: { 0: '0', 100: '1', press: v('press-scale') },
      backdropBlur: { none: '0', overlay: v('blur-overlay') },
      extend: {},
    },
  };
}

module.exports = createPreset();
module.exports.createPreset = createPreset;
