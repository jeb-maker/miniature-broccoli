import { cpSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const from = resolve(root, 'src/tokens');
const to = resolve(root, 'dist/tokens');

mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true });
console.log('Copied tokens to dist/tokens');
