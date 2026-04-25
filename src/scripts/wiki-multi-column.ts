import type { TokenizerAndRendererExtension, Tokens } from 'marked';

interface MultiColumnToken extends Tokens.Generic {
  type: 'multiColumn';
  raw: string;
  gridTemplate: string;
  columnTokens: Tokens.Generic[][];
}

const START_RE = /^--- start-multi-column[ \t]*\n/;
const END_RE = /\n--- end-multi-column\b[^\n]*(?:\n|$)/;
const COLUMN_BREAK_RE = /\n--- column-break[ \t-]*\n/g;
const SETTINGS_CLOSER_RE = /^---[ \t]*$/;
const SETTING_LINE_RE = /^([A-Za-z][A-Za-z0-9 _-]*?)\s*:\s*(.*)$/;
const NEXT_MARKER_RE = /^--- (?:column-break|end-multi-column)\b/;

const MARKER_LINE_RE =
  /^(--- (?:start-multi-column|column-break|end-multi-column)\b[^\n]*)$/gm;

// Marked's paragraph rule lazily absorbs unindented continuation lines, and the
// `---` settings closer would otherwise be parsed as a setext heading underline.
// Surrounding marker lines with blank lines forces them to start their own
// blocks so the multi-column tokenizer can claim the region.
export function padMultiColumnMarkers(src: string): string {
  return src.replace(MARKER_LINE_RE, '\n$1\n');
}

function parseSettings(lines: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of lines) {
    const m = line.match(SETTING_LINE_RE);
    if (!m) continue;
    const key = m[1].toLowerCase().replace(/\s+/g, ' ').trim();
    out[key] = m[2].trim();
  }
  return out;
}

function parseSizes(raw: string | undefined): number[] | null {
  if (!raw) return null;
  const inner = raw.replace(/^\[/, '').replace(/\]$/, '');
  const parts = inner
    .split(/[\s,]+/)
    .map((p) => parseFloat(p))
    .filter((n) => Number.isFinite(n) && n > 0);
  return parts.length ? parts : null;
}

function splitSettingsAndBody(inner: string): {
  settings: Record<string, string>;
  body: string;
} {
  const stripped = inner.replace(/^\n+/, '');
  const lines = stripped.split('\n');
  if (lines.length === 0 || !SETTING_LINE_RE.test(lines[0])) {
    return { settings: {}, body: stripped };
  }
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (SETTINGS_CLOSER_RE.test(line)) {
      const candidate = lines.slice(0, i);
      const allSettings = candidate
        .filter((l) => l.trim())
        .every((l) => SETTING_LINE_RE.test(l));
      if (!allSettings) break;
      const body = lines
        .slice(i + 1)
        .join('\n')
        .replace(/^\n+/, '');
      return { settings: parseSettings(candidate), body };
    }
    if (NEXT_MARKER_RE.test(line)) break;
  }
  return { settings: {}, body: inner };
}

function gridTemplate(columnCount: number, sizes: number[] | null): string {
  if (sizes && sizes.length === columnCount) {
    return sizes.map((s) => `${s}fr`).join(' ');
  }
  return `repeat(${columnCount}, 1fr)`;
}

export const multiColumnExtension: TokenizerAndRendererExtension = {
  name: 'multiColumn',
  level: 'block',
  start(src: string) {
    const idx = src.search(/^--- start-multi-column/m);
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src: string): MultiColumnToken | undefined {
    const startMatch = src.match(START_RE);
    if (!startMatch || startMatch.index !== 0) return undefined;

    const afterStart = src.slice(startMatch[0].length);
    const endMatch = afterStart.match(END_RE);
    if (!endMatch || endMatch.index === undefined) return undefined;

    const innerRaw = afterStart.slice(0, endMatch.index);
    const raw = src.slice(
      0,
      startMatch[0].length + endMatch.index + endMatch[0].length,
    );

    const { settings, body } = splitSettingsAndBody(innerRaw);

    const columns = body
      .split(COLUMN_BREAK_RE)
      .map((c) => c.replace(/^\n+|\n+$/g, ''));

    let columnCount = parseInt(settings['number of columns'] || '', 10);
    if (!Number.isFinite(columnCount) || columnCount < 1) {
      columnCount = columns.length;
    }
    while (columns.length < columnCount) columns.push('');

    const sizes = parseSizes(settings['column size']);
    const template = gridTemplate(columnCount, sizes);

    const columnTokens: Tokens.Generic[][] = columns.map((col) => {
      const tokens: Tokens.Generic[] = [];
      this.lexer.blockTokens(col, tokens);
      return tokens;
    });

    return {
      type: 'multiColumn',
      raw,
      gridTemplate: template,
      columnTokens,
    };
  },
  renderer(token) {
    const t = token as MultiColumnToken;
    const inner = t.columnTokens
      .map(
        (toks) =>
          `<div class="multi-column-col">${this.parser.parse(toks)}</div>`,
      )
      .join('');
    return `<div class="multi-column" style="grid-template-columns: ${t.gridTemplate};">${inner}</div>`;
  },
};
