import { describe, expect, it } from 'vitest';
import {
  addHeadingIds,
  convertWikiSyntax,
  extractGraph,
  extractMath,
  restoreMath,
  slugifyHeading,
} from './wiki-parse';

const note = (id: string, content: string) => ({ id, folder: '', content });

describe('slugifyHeading', () => {
  it('lowercases, drops punctuation and hyphenates whitespace', () => {
    expect(slugifyHeading('  Hello, World!  ')).toBe('hello-world');
    expect(slugifyHeading('Two   spaces-and hyphen')).toBe(
      'two-spaces-and-hyphen',
    );
  });
});

describe('addHeadingIds', () => {
  it('slugs the text of a heading and ignores inner tags', () => {
    expect(addHeadingIds('<h2>My <em>Title</em></h2><p>x</p>')).toBe(
      '<h2 id="my-title">My <em>Title</em></h2><p>x</p>',
    );
  });
});

describe('extractGraph', () => {
  const known = new Set(['A', 'B']);

  it('resolves an alias to the note it names', () => {
    const { edges } = extractGraph(
      [note('A', '[[B|shown]]'), note('B', '')],
      known,
    );
    expect(edges).toEqual([{ source: 'A', target: 'B' }]);
  });

  it('reads a table-escaped alias pipe as an alias', () => {
    const { edges, unresolvedIds } = extractGraph(
      [note('A', '| [[B\\|shown]] |'), note('B', '')],
      known,
    );
    expect(edges).toEqual([{ source: 'A', target: 'B' }]);
    expect(unresolvedIds).toEqual([]);
  });

  it('counts a pair of notes once, in either direction', () => {
    const { edges } = extractGraph(
      [note('A', '[[B]] [[B#h]]'), note('B', '[[A]]')],
      known,
    );
    expect(edges).toHaveLength(1);
  });

  it('skips self links, same-note headings and embeds', () => {
    const { edges } = extractGraph(
      [note('A', '[[A]] [[#local]] ![[B]]'), note('B', '')],
      known,
    );
    expect(edges).toEqual([]);
  });

  it('reports targets with no note as unresolved edges', () => {
    const { edges, unresolvedIds } = extractGraph(
      [note('A', '[[Ghost]]')],
      known,
    );
    expect(edges).toEqual([{ source: 'A', target: 'Ghost' }]);
    expect(unresolvedIds).toEqual(['Ghost']);
  });
});

describe('extractMath and restoreMath', () => {
  it('collects display math before inline math', () => {
    const { blocks, text } = extractMath('a $x+y$ b $$ z $$');
    expect(blocks).toEqual([
      { display: true, tex: 'z' },
      { display: false, tex: 'x+y' },
    ]);
    expect(text).not.toContain('$');
  });

  it('leaves dollar signs inside code alone', () => {
    const source = '`$a$` and\n```\n$b$\n```';
    const { blocks, text } = extractMath(source);
    expect(blocks).toEqual([]);
    expect(text).toBe(source);
  });

  it('does not pair dollars across lines', () => {
    expect(extractMath('costs $5\nand $6').blocks).toEqual([]);
  });

  it('keeps matrix separators intact for KaTeX', () => {
    const tex = '\\begin{matrix} a & b \\\\ c & d \\end{matrix}';
    expect(extractMath(`$$${tex}$$`).blocks[0].tex).toBe(tex);
  });

  it('renders each slot back as KaTeX markup', () => {
    const { text, blocks } = extractMath('$x$ and $$y$$');
    const html = restoreMath(text, blocks);
    expect(html).toContain('class="katex"');
    expect(html).toContain('katex-display');
  });
});

describe('convertWikiSyntax', () => {
  const known = new Set(['Note']);
  const convert = (source: string) => convertWikiSyntax(source, known);

  it('turns image embeds into images under /wiki-images/', () => {
    expect(convert('![[a.png]]')).toContain(
      '<img src="/wiki-images/a.png" alt="a.png">',
    );
  });

  it('applies an embed width as a max width', () => {
    expect(convert('![[a.svg|300]]')).toContain('style="max-width:300px"');
  });

  it('removes embeds that are not images', () => {
    expect(convert('![[Note#^block]]')).toBe('');
  });

  it('links a known note', () => {
    expect(convert('[[Note]]')).toBe(
      '<a class="wiki-link" data-note-id="Note" title="Go to: Note">Note</a>',
    );
  });

  it('shows the alias when there is one', () => {
    expect(convert('[[Note|Shown]]')).toContain('>Shown</a>');
  });

  it('carries a heading anchor as a slug', () => {
    expect(convert('[[Note#My Head]]')).toContain('data-heading="my-head"');
  });

  it('drops block references from the anchor', () => {
    const html = convert('[[Note#^abc]]');
    expect(html).toContain('data-note-id="Note"');
    expect(html).not.toContain('data-heading');
  });

  it('links a same-note heading by its text', () => {
    expect(convert('[[#My Head]]')).toBe(
      '<a class="wiki-link heading-link" data-heading="my-head" title="Jump to: My Head">My Head</a>',
    );
  });

  it('reads a table-escaped alias pipe on links and embeds', () => {
    expect(convert('[[Note\\|Shown]]')).toBe(
      '<a class="wiki-link" data-note-id="Note" title="Go to: Note">Shown</a>',
    );
    expect(convert('![[a.svg\\|300]]')).toContain(
      '<img src="/wiki-images/a.svg" alt="a.svg" style="max-width:300px">',
    );
  });

  it('marks a missing note as unresolved and not navigable', () => {
    const html = convert('[[Ghost]]');
    expect(html).toContain('class="wiki-link unresolved"');
    expect(html).toContain('title="Note not found: Ghost"');
    expect(html).not.toContain('data-note-id');
  });
});
