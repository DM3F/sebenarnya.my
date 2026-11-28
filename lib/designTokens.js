// Server-only: reads design-system/tokens.css at build time so the /design-system page lists
// exactly the tokens the code defines (nothing to keep in sync by hand).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// "/* ══ 2. SEMANTIC — colour ═══" → { tier: 'semantic', group: 'colour' }
// "/* ── Palette (do not use in components) ───" → { group: 'Palette (do not use in components)' }
function heading(line) {
  const tier = line.match(/══\s*(?:\d\.\s*)?([A-Z]+)\b(?:\s*[—:]\s*([^═]+))?/);
  if (tier) return { tier: tier[1].toLowerCase(), group: (tier[2] || tier[1]).trim().replace(/\s+$/, '') };
  const sub = line.match(/──\s*([^─]+?)\s*─/);
  if (sub) return { group: sub[1].trim() };
  return null;
}

export function readTokens() {
  const css = readFileSync(join(process.cwd(), 'design-system', 'tokens.css'), 'utf8');
  const lines = css.split('\n');
  const tokens = [];
  let tier = 'base';
  let group = 'Fonts';
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    if (inComment) {
      if (t.includes('*/')) inComment = false;
      continue;
    }
    if (t.startsWith('/*')) {
      const h = heading(t);
      if (h) {
        if (h.tier) tier = h.tier;
        group = h.group;
      }
      if (!t.includes('*/')) inComment = true;
      continue;
    }
    if (t.startsWith('@media')) break; // breakpoint overrides: the page reads live values instead

    const decl = t.match(/^--([\w-]+)\s*:\s*(.*)$/);
    if (!decl) continue;
    let [, name, rest] = decl;
    // Multi-line values (e.g. --transition-colors) run until the semicolon
    while (!rest.includes(';') && i + 1 < lines.length) rest += ' ' + lines[++i].trim();
    const semi = rest.indexOf(';');
    const value = rest.slice(0, semi).trim().replace(/\s+/g, ' ');
    const comment = (rest.slice(semi + 1).match(/\/\*\s*(.*?)\s*\*\//) || [])[1] || '';
    tokens.push({ name, value, comment, tier, group });
  }
  return tokens;
}
