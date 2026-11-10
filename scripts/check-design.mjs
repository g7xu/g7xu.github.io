// Enforces the CLAUDE.md design anti-patterns that a text search can decide.
// Shadows and card layouts have intentional exceptions, so review keeps those.

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SOURCE_DIR = 'src';
const SOURCE_FILE = /\.(astro|css|ts)$/;

const BANNED = [
  {
    label: 'SaaS-blue color',
    pattern:
      /#(007acc|3b82f6|2563eb|1d4ed8|6366f1|4f46e5|4338ca)\b|\bindigo\b/gi,
  },
  {
    label: 'Inter font',
    pattern: /font[-\w]*\s*:[^;{}]*\bInter\b|['"]Inter\b|family=Inter\b/g,
  },
];

const files = readdirSync(SOURCE_DIR, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && SOURCE_FILE.test(entry.name))
  .map((entry) => path.join(entry.parentPath, entry.name));

const violations = [];

for (const file of files) {
  const source = readFileSync(file, 'utf-8');
  for (const { label, pattern } of BANNED) {
    for (const match of source.matchAll(pattern)) {
      const line = source.slice(0, match.index).split('\n').length;
      violations.push(`${file}:${line}: ${label}: ${match[0]}`);
    }
  }
}

if (violations.length > 0) {
  console.error(`check-design: ${violations.length} violation(s)`);
  for (const violation of violations) {
    console.error(`  ${violation}`);
  }
  process.exitCode = 1;
} else {
  console.log(`check-design: ${files.length} files OK`);
}
