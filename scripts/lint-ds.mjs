#!/usr/bin/env node
/**
 * Design-system consistency check (docs/plan.md › Fasa 9).
 * Usage:
 *   npm run lint:ds
 * Exits 1 when any rule finds a problem, so it can run in CI.
 *
 * Allowed exceptions are marked in the source with a comment on the same line:
 *   /* ds-allow: <reason> *\/   or   // ds-allow: <reason>
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SOURCE_DIRS = ['app', 'components', 'lib', 'design-system'].filter((d) => existsSync(join(ROOT, d)));
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', '.git']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(css|js|jsx|mjs|ts|tsx)$/.test(name)) out.push(path);
  }
  return out;
}

const files = SOURCE_DIRS.flatMap((d) => walk(join(ROOT, d))).map((f) => ({
  path: relative(ROOT, f).split(sep).join('/'),
  lines: readFileSync(f, 'utf8').split('\n'),
}));

// Every custom property defined in tokens.css (for the unknown-role check)
const TOKENS = new Set(
  files.filter((f) => /(^|\/)tokens\.css$/.test(f.path))
    .flatMap((f) => [...f.lines.join('\n').matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1])),
);

const isTokens = (p) => /(^|\/)tokens\.css$/.test(p);
const isCss = (p) => p.endsWith('.css');
const isIconWrapper = (p) => /components\/ui\/Icon\.js$/.test(p);

// Strip comments (rough, per line) so rules don't fire on documentation
const code = (line) => line.replace(/\/\*.*?\*\//g, '').replace(/(^|[^:])\/\/.*$/, '$1');

const rules = [
  {
    id: 'hex-colour',
    why: 'Hard-coded colour; use a semantic token (tokens.css is exempt; mask-image alpha is fine).',
    test: (l, p) => !isTokens(p) && isCss(p) && /#[0-9a-fA-F]{3,8}\b/.test(code(l)) && !/mask-image|--fade-/.test(l),
  },
  {
    id: 'palette-primitive',
    why: 'Palette primitive used directly; use a semantic token (--color-foreground, --color-border…).',
    test: (l, p) => !isTokens(p) && /var\(--color-(grey-\d+|red|red-dark|blue|azure|orange|orange-dark|green|green-dark|white)\)/.test(code(l)),
    allow: (l) => /--color-(white|black)\)/.test(l) && /token|alias/.test(l),
  },
  {
    id: 'icon-library',
    why: 'Only Lucide icons are allowed.',
    test: (l) => /from ['"](react-icons|@heroicons|@radix-ui\/react-icons|@tabler|phosphor-react|@phosphor-icons)/.test(l),
  },
  {
    id: 'icon-wrapper',
    why: 'Lucide icon rendered without <Icon>; use components/ui/Icon.js (1.75px, aria-hidden).',
    // A JSX tag that starts with a Lucide-style PascalCase name imported from lucide-react
    test: (l, p, file) => !isIconWrapper(p) && file.lucide.size > 0 && [...file.lucide].some((n) => new RegExp(`<${n}[\\s/>]`).test(l)),
  },
  {
    id: 'ui-raw-length',
    why: 'components/ui layer (app/ui.css) takes no raw lengths; use a semantic token (--size-*, --space-*, --radius-*).',
    test: (l, p) => /(^|\/)app\/ui\.css$/.test(p) && /(^|[^\w-])\d*\.?\d+px\b/.test(code(l)),
  },
  {
    id: 'type-primitive',
    why: 'Type scale step used outside tokens.css; use a type role (--text-body, --text-heading…), never --text-16 / --leading-*.',
    test: (l, p) => !isTokens(p) && /var\(--(text-\d+|leading-[\w-]+|type-[\w-]+)\)/.test(code(l)),
  },
  {
    id: 'unknown-type-role',
    why: 'Type role not defined in tokens.css (typo or invented role); pick an existing --text-* role.',
    test: (l, p) => !isTokens(p) && [...code(l).matchAll(/var\(--(text-[a-z][\w-]*)\)/g)].some((m) => !TOKENS.has(m[1])),
  },
  {
    id: 'letter-spacing',
    why: 'Tracking is 0 (Manrope as drawn). Only UPPERCASE labels take var(--tracking-label) or a role\'s --letter-spacing.',
    test: (l, p) => !isTokens(p) && isCss(p) && /letter-spacing:/.test(code(l))
      && !/letter-spacing:\s*(0|normal|inherit|var\(--tracking-label\)|var\(--text-[\w-]+--letter-spacing\))\s*[;}]/.test(code(l)),
  },
  {
    id: 'raw-font-size',
    why: 'Raw font-size; use a type role (--text-*). Percent/em for relative tweaks are fine.',
    test: (l, p) => !isTokens(p) && /font-size:\s*(\d*\.?\d+px|clamp\(|calc\()/.test(code(l)),
  },
  {
    id: 'raw-line-height',
    why: 'line-height in px; use the role\'s --text-*--line-height or a unitless number.',
    test: (l, p) => !isTokens(p) && isCss(p) && /line-height:\s*\d*\.?\d+px/.test(code(l)),
  },
  {
    id: 'inline-font-size',
    why: 'fontSize in JSX; put type in CSS with a role class.',
    test: (l, p) => !isCss(p) && /fontSize\s*:/.test(code(l)),
  },
  {
    id: 'raw-spacing',
    why: 'Raw px in padding/margin/gap; use a spacing role (--gap-*, --pad-card*, --space-*) or a --spacing-* step.',
    test: (l, p) => !isTokens(p) && isCss(p)
      && /(?:^|[\s{;])(padding|margin|gap|row-gap|column-gap)(-[a-z-]+)?\s*:[^;]*\b[1-9]\d*(\.\d+)?px/.test(code(l)),
  },
  {
    id: 'raw-radius',
    why: 'Raw px border-radius; use --radius-card / --radius-card-lg / --radius-media / --radius-control.',
    test: (l, p) => !isTokens(p) && isCss(p) && /border-radius:[^;]*\b[1-9]\d*(\.\d+)?px/.test(code(l)),
  },
  {
    id: 'card-radius-primitive',
    why: 'Use --radius-card-lg for large cards, not the --radius-lg step.',
    test: (l, p) => !isTokens(p) && isCss(p) && /var\(--radius-lg\)/.test(code(l)),
  },
  {
    id: 'breakpoint',
    why: 'Off-system breakpoint; use max-width 1280 / 1100 / 900 / 600 (min-width = those + 1).',
    test: (l, p) => isCss(p) && /@media/.test(l)
      && [...code(l).matchAll(/(max|min)-width:\s*(\d+)px/g)].some(([, k, n]) =>
        !(k === 'max' ? [1280, 1100, 900, 600] : [1281, 1101, 901, 601]).includes(Number(n))),
  },
  {
    id: 'z-index',
    why: 'Global z-index must be a layer token (--z-sticky/dropdown/overlay/floating/skip); plain numbers only -1…5 inside a component.',
    test: (l, p) => !isTokens(p) && isCss(p) && /z-index:\s*(\d{2,}|[6-9]|-[2-9]|-\d{2,})\b/.test(code(l)),
  },
  {
    id: 'raw-motion',
    why: 'Raw duration or easing; use --duration-fast/base/slow/slower/page and --ease-*. Ambient loops of 2s+ are fine.',
    test: (l, p) => !isTokens(p) && isCss(p) && /(transition|animation)[\w-]*\s*:/.test(code(l))
      && (/(?<![\w.-])(0?\.\d+|1(\.\d+)?)s\b|(?<![\w-])\d{1,4}ms\b/.test(code(l))
        || /(?<![\w(-])(ease|ease-in|ease-out|ease-in-out)(?![\w-])/.test(code(l))),
  },
  {
    id: 'focus-ring',
    why: 'Focus ring must use --focus-ring-width / --focus-ring-color(-inverse) / --focus-ring-offset.',
    test: (l, p) => !isTokens(p) && isCss(p)
      && (/outline:\s*\.?\d*[1-9]/.test(code(l))
        || /outline-offset:\s*-?\d+px/.test(code(l))
        || /outline:\s*var\(--focus-ring-width\)\s+solid\s+var\(--(?!focus-ring-color)/.test(code(l))),
  },
  {
    id: 'raw-border',
    why: 'Raw border width; use var(--border-width). Decorative rings carry ds-allow.',
    test: (l, p) => !isTokens(p) && isCss(p) && /border(-top|-bottom|-left|-right)?:\s*\.?\d*[1-9]\d*(\.\d+)?px/.test(code(l)),
  },
  {
    id: 'icon-size',
    why: 'Icon size by name: <Icon size="sm|md|lg|xl|display">, never a number.',
    test: (l, p) => !isCss(p) && /<Icon\b[^>]*\bsize=\{/.test(code(l)),
  },
  {
    id: 'rem',
    why: 'rem breaks inside the extension and with the 62.5% root; use px tokens.',
    test: (l, p) => isCss(p) && /\d(\.\d+)?rem\b/.test(code(l)),
  },
  {
    id: 'font-weight',
    why: 'Weight outside the scale; use --font-weight-* (no 700+).',
    test: (l, p) => isCss(p) && /font-weight:\s*(\d+|bold|bolder)\b/.test(code(l)) && !isTokens(p),
  },
  {
    id: 'font-family',
    why: 'Only Manrope (--font-sans).',
    test: (l, p) => {
      if (isTokens(p)) return false;
      const m = code(l).match(/font-family:\s*([^;}]+)/);
      return (m && !/^(var\(--font-sans\)|inherit)\s*$/.test(m[1].trim())) || /['"]Inter['"]/.test(l);
    },
  },
  {
    id: 'transition-all',
    why: 'Name the properties you animate.',
    test: (l) => /transition:\s*all\b/.test(code(l)),
  },
];

for (const f of files) {
  f.lucide = new Set();
  const text = f.lines.join('\n');
  const m = text.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
  if (m) m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => f.lucide.add(n));
}

let problems = 0;
for (const rule of rules) {
  const hits = [];
  for (const f of files) {
    f.lines.forEach((line, i) => {
      if (/ds-allow:/.test(line)) return;
      if (rule.test(line, f.path, f) && !(rule.allow && rule.allow(line))) hits.push(`  ${f.path}:${i + 1}  ${line.trim().slice(0, 110)}`);
    });
  }
  if (hits.length) {
    problems += hits.length;
    console.log(`\n✗ ${rule.id} (${hits.length}) — ${rule.why}\n${hits.join('\n')}`);
  } else {
    console.log(`✓ ${rule.id}`);
  }
}

console.log(problems ? `\n${problems} problem(s).` : '\nDesign system: clean.');
process.exit(problems ? 1 : 0);
