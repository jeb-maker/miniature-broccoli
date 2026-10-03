#!/usr/bin/env node
/**
 * Verify every top-level src/components/*.ts entry has:
 * - package.json exports["./name"]
 * - a reasonable mention in jsx.d.ts (mb-name tag)
 * - a reasonable mention in src/types.ts (MbName / mb-name)
 *
 * Subfolders (e.g. src/components/table/*) are ignored — only the public entry
 * (table.ts) is required.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'src/components');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const jsx = readFileSync(join(root, 'jsx.d.ts'), 'utf8');
const types = readFileSync(join(root, 'src/types.ts'), 'utf8');

const entries = readdirSync(componentsDir)
  .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
  .map((name) => name.replace(/\.ts$/, ''))
  .sort();

const exportsMap = pkg.exports ?? {};
const errors = [];

function toPascal(kebab) {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

for (const name of entries) {
  const exportKey = `./${name}`;
  if (!(exportKey in exportsMap)) {
    errors.push(`missing package.json exports["${exportKey}"] for src/components/${name}.ts`);
  }

  const tag = `mb-${name}`;
  if (!jsx.includes(`'${tag}'`) && !jsx.includes(`"${tag}"`)) {
    errors.push(`jsx.d.ts missing IntrinsicElements entry for '${tag}'`);
  }

  const typeName = `Mb${toPascal(name)}`;
  const hasTypeExport = types.includes(typeName) || types.includes(`'${tag}'`);
  if (!hasTypeExport) {
    errors.push(`src/types.ts missing type/tag mention for ${typeName} / '${tag}'`);
  }
}

if (errors.length) {
  console.error('check:exports failed:\n');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  console.error(`\nChecked ${entries.length} component entries.`);
  process.exit(1);
}

console.log(`check:exports ok (${entries.length} entries: ${entries.join(', ')})`);
