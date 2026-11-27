// Builds the installable package into design-system/dist and packs it (.tgz).
//   npm run build:ds
// Sources stay where the website uses them; dist is generated, never edited.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { transformSync } from 'esbuild';

const DS = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(DS, 'dist');
const ROOT = join(DS, '..');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'react'), { recursive: true });
mkdirSync(join(OUT, 'bin'), { recursive: true });

for (const f of ['tokens.css', 'base.css', 'ui.css', 'tailwind-preset.cjs', 'package.json']) cpSync(join(DS, f), join(OUT, f));
cpSync(join(DS, 'react', 'index.d.ts'), join(OUT, 'react', 'index.d.ts'));
cpSync(join(ROOT, 'scripts', 'lint-ds.mjs'), join(OUT, 'bin', 'lint-ds.mjs'));
cpSync(join(DS, 'PACKAGE_README.md'), join(OUT, 'README.md'));
cpSync(join(DS, 'CHANGELOG.md'), join(OUT, 'CHANGELOG.md'));

// JSX → plain ESM with the automatic runtime. One file in, one file out ('use client' kept),
// relative imports get their .js extension so bundlers in "type": "module" mode resolve them.
for (const name of readdirSync(join(DS, 'react')).filter((n) => n.endsWith('.js'))) {
  const src = readFileSync(join(DS, 'react', name), 'utf8');
  const { code } = transformSync(src, { loader: 'jsx', jsx: 'automatic', format: 'esm', target: 'es2020', sourcefile: name });
  const fixed = code.replace(/(from\s+['"])(\.\/[\w-]+)(['"])/g, '$1$2.js$3');
  const directive = /^\s*['"]use client['"]/.test(src) && !/^\s*['"]use client['"]/.test(fixed) ? '"use client";\n' : '';
  writeFileSync(join(OUT, 'react', name), directive + fixed);
}

const tgz = execSync('npm pack --silent', { cwd: OUT }).toString().trim();
cpSync(join(OUT, tgz), join(DS, tgz));
console.log(`Built design-system/dist and design-system/${tgz}`);
