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
