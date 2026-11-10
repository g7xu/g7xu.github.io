import katex from 'katex';

export interface WikiNote {
  id: string;
  folder: string;
  content: string;
}

export interface WikiEdge {
  source: string;
  target: string;
}

type NoteLookup = { has(id: string): boolean };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

// Add slug ids to rendered <h1>-<h6> headings so [[#Heading]] anchors can scroll to them.
export function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[1-6])>([\s\S]*?)<\/\1>/g,
    (_, tag: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, '');
      return `<${tag} id="${slugifyHeading(text)}">${inner}</${tag}>`;
    },
  );
}

// ── Wiki-link edges extracted from note content. Targets that don't match
//    any note become pale "unresolved" phantom nodes, like Obsidian. ──
export function extractGraph(
  notes: WikiNote[],
  known: NoteLookup,
): {
  edges: WikiEdge[];
  unresolvedIds: string[];
} {
  const edges: WikiEdge[] = [];
  const seen = new Set<string>();
  const unresolved = new Set<string>();
  notes.forEach((note) => {
    const matches = note.content.matchAll(/(?<!!)\[\[([^\]]+)\]\]/g);
    for (const m of matches) {
      // Strip alias: [[Note|Display]] -> "Note"
      let target = m[1].split('|')[0].trim();
      // Skip same-note heading refs: [[#Heading]]
      if (target.startsWith('#')) continue;
      // Strip heading anchor: [[Note#Heading]] -> "Note"
      target = target.split('#')[0].trim();
      if (!target || target === note.id) continue;
      const key = [note.id, target].sort().join('||');
      if (seen.has(key)) continue;
      seen.add(key);
      if (!known.has(target)) unresolved.add(target);
      edges.push({ source: note.id, target });
    }
  });
  return { edges, unresolvedIds: [...unresolved] };
}

// Math must be extracted BEFORE marked runs. Otherwise marked HTML-escapes `&`
// to `&amp;` (breaking matrix column separators) and processes CommonMark
// backslash escapes (`\\` → `\`, which kills matrix row breaks). Private-use
// Unicode chars mark the slots since they never appear in source text and
// marked passes them through unchanged.
export interface ExtractedMath {
  display: boolean;
  tex: string;
}

const MATH_OPEN = '';
const MATH_CLOSE = '';
const MATH_SLOT_RE = /M(\d+)/g;

export function extractMath(src: string): {
  text: string;
  blocks: ExtractedMath[];
} {
  const blocks: ExtractedMath[] = [];
  const codeBlocks: string[] = [];

  // Protect fenced and inline code so math-like `$..$` inside code stays literal.
  let text = src.replace(/```[\s\S]*?```|`[^`\n]+`/g, (m) => {
    codeBlocks.push(m);
    return `${MATH_OPEN}C${codeBlocks.length - 1}${MATH_CLOSE}`;
  });

  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => {
    blocks.push({ display: true, tex: tex.trim() });
    return `${MATH_OPEN}M${blocks.length - 1}${MATH_CLOSE}`;
  });

  // Inline math: $...$  (not adjacent to another $; no newlines inside)
  text = text.replace(
    /(?<!\$)\$(?!\$)([^\n$]+?)(?<!\$)\$(?!\$)/g,
    (_, tex: string) => {
      blocks.push({ display: false, tex: tex.trim() });
      return `${MATH_OPEN}M${blocks.length - 1}${MATH_CLOSE}`;
    },
  );

  text = text.replace(/C(\d+)/g, (_, i: string) => codeBlocks[Number(i)]);

  return { text, blocks };
}

export function restoreMath(html: string, blocks: ExtractedMath[]): string {
  return html.replace(MATH_SLOT_RE, (_, i: string) => {
    const { display, tex } = blocks[Number(i)];
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
      });
    } catch {
      return `<span class="math-error">${tex}</span>`;
    }
  });
}

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']);

/** Rewrites Obsidian embed and link syntax as HTML; runs before marked. */
export function convertWikiSyntax(content: string, notes: NoteLookup): string {
  // 1. Convert image embeds (![[...]]) to <img> tags, strip non-image embeds
  let processed = content.replace(/!\[\[([^\]]+)\]\]/g, (_, inner: string) => {
    const parts = inner.split('|');
    const filename = parts[0].trim();
    const width = parts[1]?.trim();
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (IMAGE_EXTENSIONS.has(ext)) {
      const style = width ? ` style="max-width:${width}px"` : '';
      return `\n\n<img src="/wiki-images/${filename}" alt="${filename}"${style}>\n\n`;
    }
    return '';
  });

  // 2. Convert [[Note|Alias]], [[Note]], [[#Heading]], [[Note#Heading]] into clickable spans
  processed = processed.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_, target, alias) => {
      const rawTarget = target.trim();
      const hashIdx = rawTarget.indexOf('#');
      const notePart =
        hashIdx === -1 ? rawTarget : rawTarget.slice(0, hashIdx).trim();
      const headingPart =
        hashIdx === -1
          ? ''
          : rawTarget
              .slice(hashIdx + 1)
              .split('^')[0]
              .trim();
      const cleanTarget = notePart.split('^')[0].trim();
      const display = alias
        ? alias.trim()
        : headingPart && !cleanTarget
          ? headingPart
          : rawTarget;

      // Same-note heading reference: [[#Heading]]
      if (!cleanTarget && headingPart) {
        const slug = slugifyHeading(headingPart);
        return `<a class="wiki-link heading-link" data-heading="${slug}" title="Jump to: ${headingPart}">${display}</a>`;
      }

      const exists = notes.has(cleanTarget);
      const cls = exists ? 'wiki-link' : 'wiki-link unresolved';
      const dataAttrs = exists
        ? `data-note-id="${cleanTarget}"${headingPart ? ` data-heading="${slugifyHeading(headingPart)}"` : ''}`
        : '';
      const title = exists
        ? `Go to: ${cleanTarget}${headingPart ? ' § ' + headingPart : ''}`
        : `Note not found: ${cleanTarget}`;
      return `<a class="${cls}" ${dataAttrs} title="${title}">${display}</a>`;
    },
  );

  return processed;
}
