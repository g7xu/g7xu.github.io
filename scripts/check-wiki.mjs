// Fails the build on wiki content the client renderer would silently show
// broken. Syntax handling follows openNote and extractGraph in learning-wiki.ts.
//
// Dangling wiki-links only warn: the graph draws them as unresolved nodes, and
// they often mark notes still to be written.

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const NOTES_DIR = 'obs_notes/public';
const ATTACHMENTS_DIR = 'obs_notes/attachments';
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']);

const cleanLinkTarget = (target) => target.trim().replace(/\\$/, '');

/** Paths are `/`-separated and relative to `root`; throws if `root` is missing. */
function listFiles(root) {
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path
        .relative(root, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join('/'),
    );
}

const notePaths = listFiles(NOTES_DIR).filter((file) => file.endsWith('.md'));
// Compared exactly rather than with existsSync: macOS ignores case locally,
// but the deployed site does not.
const attachments = new Set(listFiles(ATTACHMENTS_DIR));
const noteIds = new Set(notePaths.map((file) => path.basename(file, '.md')));

const errors = [];
const danglingSources = new Map();

if (notePaths.length === 0) {
  errors.push(`no notes found under ${NOTES_DIR}/`);
}

for (const file of notePaths) {
  const id = path.basename(file, '.md');
  const content = readFileSync(path.join(NOTES_DIR, file), 'utf-8');

  for (const [, inner] of content.matchAll(/!\[\[([^\]]+)\]\]/g)) {
    const filename = cleanLinkTarget(inner.split('|')[0]);
    const extension = filename.split('.').pop().toLowerCase();
    if (IMAGE_EXTENSIONS.has(extension) && !attachments.has(filename)) {
      errors.push(`${file}: missing image ${filename}`);
    }
  }

  for (const [, inner] of content.matchAll(/(?<!!)\[\[([^\]]+)\]\]/g)) {
    const target = cleanLinkTarget(inner.split('|')[0])
      .split('#')[0]
      .split('^')[0]
      .trim();
    if (target && target !== id && !noteIds.has(target)) {
      danglingSources.set(target, danglingSources.get(target) ?? id);
    }
  }
}

if (danglingSources.size > 0) {
  console.warn(
    `check-wiki: ${danglingSources.size} dangling wiki-link target(s)`,
  );
  for (const [target, source] of danglingSources) {
    console.warn(`  ${target} (first linked from ${source})`);
  }
}

if (errors.length > 0) {
  console.error(`check-wiki: ${errors.length} error(s)`);
  for (const error of errors) {
    console.error(`  ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`check-wiki: ${notePaths.length} notes OK`);
}
