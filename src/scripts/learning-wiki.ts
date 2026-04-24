import * as d3 from 'd3';
import { marked } from 'marked';
import katex from 'katex';

marked.setOptions({ breaks: true });

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

// Add slug ids to rendered <h1>-<h6> headings so [[#Heading]] anchors can scroll to them.
function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[1-6])>([\s\S]*?)<\/\1>/g,
    (_, tag: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, '');
      return `<${tag} id="${slugifyHeading(text)}">${inner}</${tag}>`;
    },
  );
}

interface WikiNote {
  id: string;
  folder: string;
  content: string;
}

declare global {
  interface Window {
    __WIKI_NOTES__: WikiNote[];
  }
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  folder: string;
  content: string;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

// ── Read notes baked into the page by Astro ──
const NOTES: WikiNote[] = window.__WIKI_NOTES__ || [];

if (NOTES.length === 0) {
  // Nothing to render — empty state is shown by the Astro template
  throw new Error('No wiki notes found');
}

// ── Wiki-link edges extracted from note content ──
function extractEdges(notes: WikiNote[]): SimLink[] {
  const ids = new Set(notes.map((n) => n.id));
  const edges: SimLink[] = [];
  const seen = new Set<string>();
  notes.forEach((note) => {
    const matches = note.content.matchAll(/\[\[([^\]]+)\]\]/g);
    for (const m of matches) {
      // Strip alias: [[Note|Display]] -> "Note"
      let target = m[1].split('|')[0].trim();
      // Skip same-note heading refs: [[#Heading]]
      if (target.startsWith('#')) continue;
      // Strip heading anchor: [[Note#Heading]] -> "Note"
      target = target.split('#')[0].trim();
      if (target && target !== note.id && ids.has(target)) {
        const key = [note.id, target].sort().join('||');
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ source: note.id, target });
        }
      }
    }
  });
  return edges;
}

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
let selectedId: string | null = null;
let searchQuery = '';

const edges = extractEdges(NOTES);

// ─────────────────────────────────────────
// LEFT PANEL — Folder tree
// ─────────────────────────────────────────
interface FolderNode {
  name: string;
  path: string;
  folders: Map<string, FolderNode>;
  notes: WikiNote[];
}

function makeFolder(name: string, path: string): FolderNode {
  return { name, path, folders: new Map(), notes: [] };
}

function buildFolderTree(notes: WikiNote[]): FolderNode {
  const root = makeFolder('', '');
  for (const note of notes) {
    if (!note.folder) {
      root.notes.push(note);
      continue;
    }
    const segments = note.folder.split('/');
    let cursor = root;
    let accPath = '';
    for (const seg of segments) {
      accPath = accPath ? `${accPath}/${seg}` : seg;
      if (!cursor.folders.has(seg)) {
        cursor.folders.set(seg, makeFolder(seg, accPath));
      }
      cursor = cursor.folders.get(seg)!;
    }
    cursor.notes.push(note);
  }
  return root;
}

const collapsedFolders = new Set<string>();

function collectMatchingNotes(
  folder: FolderNode,
  query: string,
  out: WikiNote[],
) {
  const q = query.toLowerCase();
  for (const n of folder.notes) {
    if (!query || n.id.toLowerCase().includes(q)) out.push(n);
  }
  for (const child of folder.folders.values()) {
    collectMatchingNotes(child, query, out);
  }
}

function renderFolder(
  folder: FolderNode,
  container: HTMLElement,
  query: string,
) {
  const folders = [...folder.folders.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const notes = [...folder.notes].sort((a, b) => a.id.localeCompare(b.id));

  for (const child of folders) {
    const matches: WikiNote[] = [];
    collectMatchingNotes(child, query, matches);
    if (query && matches.length === 0) continue;

    const wrap = document.createElement('div');
    wrap.className = 'tree-folder';

    const label = document.createElement('div');
    label.className = 'tree-folder-label';
    const isCollapsed = collapsedFolders.has(child.path) && !query;
    label.textContent = `${isCollapsed ? '▸' : '▾'} ${child.name}`;
    label.addEventListener('click', () => {
      if (collapsedFolders.has(child.path)) collapsedFolders.delete(child.path);
      else collapsedFolders.add(child.path);
      buildTree();
    });
    wrap.appendChild(label);

    const children = document.createElement('div');
    children.className = 'tree-children' + (isCollapsed ? ' collapsed' : '');
    renderFolder(child, children, query);
    wrap.appendChild(children);
    container.appendChild(wrap);
  }

  for (const note of notes) {
    if (query && !note.id.toLowerCase().includes(query.toLowerCase())) continue;
    const item = document.createElement('div');
    item.className = 'tree-note' + (note.id === selectedId ? ' active' : '');
    item.dataset.id = note.id;
    item.textContent = note.id;
    item.title = note.folder ? `${note.folder}/${note.id}` : note.id;
    item.addEventListener('click', () => selectNote(note.id));
    container.appendChild(item);
  }
}

function buildTree() {
  const tree = document.getElementById('file-tree')!;
  while (tree.firstChild) tree.removeChild(tree.firstChild);
  const root = buildFolderTree(NOTES);
  renderFolder(root, tree, searchQuery);
}

// ─────────────────────────────────────────
// MATH RENDERING
// ─────────────────────────────────────────
// Math must be extracted BEFORE marked runs. Otherwise marked HTML-escapes `&`
// to `&amp;` (breaking matrix column separators) and processes CommonMark
// backslash escapes (`\\` → `\`, which kills matrix row breaks). Private-use
// Unicode chars mark the slots since they never appear in source text and
// marked passes them through unchanged.
interface ExtractedMath {
  display: boolean;
  tex: string;
}

const MATH_OPEN = '';
const MATH_CLOSE = '';
const MATH_SLOT_RE = /M(\d+)/g;

function extractMath(src: string): { text: string; blocks: ExtractedMath[] } {
  const blocks: ExtractedMath[] = [];
  const codeBlocks: string[] = [];

  // Protect fenced and inline code so math-like `$..$` inside code stays literal.
  let text = src.replace(/```[\s\S]*?```|`[^`\n]+`/g, (m) => {
    codeBlocks.push(m);
    return `${MATH_OPEN}C${codeBlocks.length - 1}${MATH_CLOSE}`;
  });

  // Display math: $$...$$
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

  // Restore code untouched.
  text = text.replace(/C(\d+)/g, (_, i: string) => codeBlocks[Number(i)]);

  return { text, blocks };
}

function restoreMath(html: string, blocks: ExtractedMath[]): string {
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

// ─────────────────────────────────────────
// RIGHT PANEL — Note content
// ─────────────────────────────────────────
function openNote(id: string) {
  const note = NOTES.find((n) => n.id === id);
  if (!note) return;

  const noteIds = new Set(NOTES.map((n) => n.id));

  // 1. Convert image embeds (![[...]]) to <img> tags, strip non-image embeds
  let processed = note.content.replace(
    /!\[\[([^\]]+)\]\]/g,
    (_, inner: string) => {
      const parts = inner.split('|');
      const filename = parts[0].trim();
      const width = parts[1]?.trim();
      const ext = filename.split('.').pop()?.toLowerCase();
      if (
        ext === 'png' ||
        ext === 'jpg' ||
        ext === 'jpeg' ||
        ext === 'gif' ||
        ext === 'svg' ||
        ext === 'webp'
      ) {
        const style = width ? ` style="max-width:${width}px"` : '';
        return `\n\n<img src="/wiki-images/${filename}" alt="${filename}"${style}>\n\n`;
      }
      return ''; // strip non-image embeds
    },
  );

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

      const exists = noteIds.has(cleanTarget);
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

  document.getElementById('note-title')!.textContent = note.id;

  // 3. Extract math BEFORE marked runs, so `&` and `\\` inside $$...$$ survive
  //    HTML-escaping and CommonMark backslash-escape handling.
  const { text: markdownWithMathSlots, blocks: mathBlocks } =
    extractMath(processed);

  let html = marked.parse(markdownWithMathSlots) as string;
  html = addHeadingIds(html);
  html = restoreMath(html, mathBlocks);

  document.getElementById('note-body')!.innerHTML = html;
  document.getElementById('right-panel')!.classList.add('open');
}

// ── Wiki-link click handler (event delegation on note body) ──
function scrollToHeading(slug: string) {
  const body = document.getElementById('note-body')!;
  const h = body.querySelector(
    `[id="${CSS.escape(slug)}"]`,
  ) as HTMLElement | null;
  if (!h) return;
  const container = document.querySelector(
    '.right-panel-content',
  ) as HTMLElement | null;
  if (!container) return;
  const top =
    h.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;
  container.scrollTo({ top, behavior: 'smooth' });
  highlightSection(h);
}

function highlightSection(heading: HTMLElement) {
  const level = parseInt(heading.tagName.slice(1), 10);
  const section: HTMLElement[] = [heading];
  let el = heading.nextElementSibling as HTMLElement | null;
  while (el) {
    const m = el.tagName.match(/^H([1-6])$/);
    if (m && parseInt(m[1], 10) <= level) break;
    section.push(el);
    el = el.nextElementSibling as HTMLElement | null;
  }
  for (const node of section) node.classList.add('section-highlight');
  window.setTimeout(() => {
    for (const node of section) node.classList.remove('section-highlight');
  }, 1600);
}

document.getElementById('note-body')!.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('.wiki-link:not(.unresolved)');
  if (!link) return;
  e.preventDefault();
  const el = link as HTMLElement;
  const targetId = el.dataset.noteId;
  const heading = el.dataset.heading;

  if (!targetId && heading) {
    scrollToHeading(heading);
    return;
  }
  if (!targetId) return;

  if (targetId === selectedId && heading) {
    scrollToHeading(heading);
    return;
  }
  selectNote(targetId);
  pulseNode(targetId);
  if (heading) {
    // Wait for markdown render, then scroll to heading.
    requestAnimationFrame(() => scrollToHeading(heading));
  }
});

function closeNote() {
  document.getElementById('right-panel')!.classList.remove('open');
  selectedId = null;
  buildTree();
  updateGraphSelection();
}

document.getElementById('close-btn')!.addEventListener('click', closeNote);

function selectNote(id: string) {
  selectedId = id;
  openNote(id);
  buildTree();
  updateGraphSelection();
}

// ─────────────────────────────────────────
// D3 FORCE GRAPH
// ─────────────────────────────────────────
const svg = d3.select('#graph-svg');
const container = document.getElementById('graph-panel')!;

let simulation: d3.Simulation<SimNode, SimLink>;
let nodeGroup: d3.Selection<SVGGElement, SimNode, SVGGElement, unknown>;
let linkGroup: d3.Selection<SVGLineElement, SimLink, SVGGElement, unknown>;
let gMain: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

function initGraph() {
  svg.selectAll('*').remove();

  const W = container.clientWidth;
  const H = container.clientHeight;

  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 3])
    .on('zoom', (e) => gMain.attr('transform', e.transform));

  svg.call(zoom as any);

  gMain = svg.append('g');

  const nodes: SimNode[] = NOTES.map((n) => ({ ...n }));
  const links: SimLink[] = edges.map((e) => ({ ...e }));

  document.getElementById('node-count')!.textContent =
    `${nodes.length} notes · ${links.length} connections`;

  simulation = d3
    .forceSimulation<SimNode, SimLink>(nodes)
    .force(
      'link',
      d3
        .forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance(120),
    )
    .force('charge', d3.forceManyBody().strength(-220))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(45));

  linkGroup = gMain
    .append('g')
    .attr('class', 'links')
    .selectAll<SVGLineElement, SimLink>('line')
    .data(links)
    .join('line')
    .attr('class', 'link');

  nodeGroup = gMain
    .append('g')
    .attr('class', 'nodes')
    .selectAll<SVGGElement, SimNode>('g')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .call(
      d3
        .drag<SVGGElement, SimNode>()
        .on('start', (e, d) => {
          if (!e.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on('end', (e, d) => {
          if (!e.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }),
    )
    .on('click', (_e, d) => selectNote(d.id));

  nodeGroup
    .append('circle')
    .attr('r', 10)
    .attr('fill', (d) =>
      d.id === selectedId ? 'var(--accent-color)' : 'var(--primary-color)',
    )
    .on('mouseover', function () {
      d3.select(this).attr('r', 13);
    })
    .on('mouseout', function (this: SVGCircleElement, _e, d) {
      d3.select(this).attr('r', d.id === selectedId ? 13 : 10);
    });

  nodeGroup
    .append('text')
    .attr('class', 'node-label')
    .attr('dy', '1.8em')
    .text((d) => (d.id.length > 18 ? d.id.slice(0, 16) + '…' : d.id));

  simulation.on('tick', () => {
    linkGroup
      .attr('x1', (d) => (d.source as SimNode).x!)
      .attr('y1', (d) => (d.source as SimNode).y!)
      .attr('x2', (d) => (d.target as SimNode).x!)
      .attr('y2', (d) => (d.target as SimNode).y!);
    nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
  });
}

function updateGraphSelection() {
  if (!nodeGroup) return;
  nodeGroup
    .selectAll<SVGCircleElement, SimNode>('circle')
    .attr('fill', (d) =>
      d.id === selectedId ? 'var(--accent-color)' : 'var(--primary-color)',
    )
    .attr('r', (d) => (d.id === selectedId ? 13 : 10));
}

// Pan graph to node + play pulse ring animation
function pulseNode(id: string) {
  if (!nodeGroup || !gMain) return;

  const simNodes = simulation.nodes();
  const target = simNodes.find((n) => n.id === id);
  if (!target) return;

  const W = container.clientWidth;
  const H = container.clientHeight;
  const scale = 1.4;
  const tx = W / 2 - target.x! * scale;
  const ty = H / 2 - target.y! * scale;

  svg
    .transition()
    .duration(500)
    .call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity.translate(tx, ty).scale(scale),
    );

  // Pulse ring: append a temporary circle that expands and fades
  const pulse = gMain
    .append('circle')
    .attr('cx', target.x!)
    .attr('cy', target.y!)
    .attr('r', 10)
    .attr('fill', 'none')
    .attr('stroke', 'var(--accent-color)')
    .attr('stroke-width', 2)
    .attr('opacity', 1);

  pulse.transition().duration(600).attr('r', 32).attr('opacity', 0).remove();
}

// ─────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────
document
  .getElementById('search')!
  .addEventListener('input', function (this: HTMLInputElement) {
    searchQuery = this.value.trim();
    buildTree();

    // Dim non-matching nodes in graph
    if (!nodeGroup) return;
    nodeGroup
      .selectAll<SVGCircleElement, SimNode>('circle')
      .attr('opacity', (d) =>
        !searchQuery || d.id.toLowerCase().includes(searchQuery.toLowerCase())
          ? 1
          : 0.2,
      );
    nodeGroup
      .selectAll<SVGTextElement, SimNode>('text')
      .attr('opacity', (d) =>
        !searchQuery || d.id.toLowerCase().includes(searchQuery.toLowerCase())
          ? 1
          : 0.2,
      );
  });

// ─────────────────────────────────────────
// MOBILE TOGGLE
// ─────────────────────────────────────────
document.getElementById('mobile-toggle')!.addEventListener('click', () => {
  document.getElementById('left-panel')!.classList.toggle('mobile-open');
});

// ─────────────────────────────────────────
// SIDEBAR TOGGLE
// ─────────────────────────────────────────
const shell = document.getElementById('wiki-shell')!;
const leftPanel = document.getElementById('left-panel')!;
const toggleBtn = document.getElementById('sidebar-toggle')!;
let sidebarOpen = true;

toggleBtn.addEventListener('click', () => {
  sidebarOpen = !sidebarOpen;
  leftPanel.classList.toggle('collapsed', !sidebarOpen);
  shell.classList.toggle('panel-collapsed', !sidebarOpen);
  toggleBtn.textContent = sidebarOpen ? '◀' : '▶';
  toggleBtn.title = sidebarOpen ? 'Hide sidebar' : 'Show sidebar';
  // Re-center graph after transition
  setTimeout(() => {
    if (simulation) simulation.alphaTarget(0.05).restart();
  }, 250);
});

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
buildTree();
initGraph();

// Re-init on resize
window.addEventListener('resize', () => {
  if (simulation) simulation.stop();
  initGraph();
});
