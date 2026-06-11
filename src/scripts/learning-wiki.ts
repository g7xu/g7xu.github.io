import * as d3 from 'd3';
import { marked } from 'marked';
import katex from 'katex';
import { calloutExtension } from './wiki-callouts';
import {
  multiColumnExtension,
  padMultiColumnMarkers,
} from './wiki-multi-column';

marked.setOptions({ breaks: true });
marked.use({ extensions: [calloutExtension, multiColumnExtension] });

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
  unresolved?: boolean;
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

// ── Wiki-link edges extracted from note content. Targets that don't match
//    any note become pale "unresolved" phantom nodes, like Obsidian. ──
function extractGraph(notes: WikiNote[]): {
  edges: SimLink[];
  unresolvedIds: string[];
} {
  const ids = new Set(notes.map((n) => n.id));
  const edges: SimLink[] = [];
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
      if (!ids.has(target)) unresolved.add(target);
      edges.push({ source: note.id, target });
    }
  });
  return { edges, unresolvedIds: [...unresolved] };
}

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
let selectedId: string | null = null;
let searchQuery = '';

const { edges, unresolvedIds } = extractGraph(NOTES);
const unresolvedSet = new Set(unresolvedIds);

// ── Adjacency map + degree, used for node sizing and hover highlighting ──
const neighbors = new Map<string, Set<string>>();
for (const n of NOTES) neighbors.set(n.id, new Set());
for (const id of unresolvedIds) neighbors.set(id, new Set());
for (const e of edges) {
  const s = e.source as string;
  const t = e.target as string;
  neighbors.get(s)?.add(t);
  neighbors.get(t)?.add(s);
}

// Node radius grows with link count (sqrt so hubs don't dwarf the graph).
// Obsidian's ratio between leaf and hub is ~1:2.5, not larger.
function nodeRadius(id: string): number {
  if (unresolvedSet.has(id)) return 4;
  const degree = neighbors.get(id)?.size ?? 0;
  return 5 + Math.min(Math.sqrt(degree) * 1.8, 9);
}

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

  // 3. Pad multi-column markers with blank lines so marked treats them as
  //    standalone blocks (otherwise paragraph continuation absorbs them).
  processed = padMultiColumnMarkers(processed);

  // 4. Extract math BEFORE marked runs, so `&` and `\\` inside $$...$$ survive
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
const svg = d3.select<SVGSVGElement, unknown>('#graph-svg');
const container = document.getElementById('graph-panel')!;

let simulation: d3.Simulation<SimNode, SimLink>;
let nodeGroup: d3.Selection<SVGGElement, SimNode, SVGGElement, unknown>;
let linkGroup: d3.Selection<SVGLineElement, SimLink, SVGGElement, unknown>;
let gMain: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown>;

function initGraph() {
  svg.selectAll('*').remove();

  const W = container.clientWidth;
  const H = container.clientHeight;

  zoomBehavior = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.25, 4])
    .on('zoom', (e) => {
      gMain.attr('transform', e.transform);
      // Labels fade in as you zoom closer, like Obsidian's graph view
      const k: number = e.transform.k;
      // Hidden at the fitted overview, fully visible past ~1.6x — matches
      // Obsidian, where labels only appear once you zoom in.
      const labelOpacity = Math.max(0, Math.min(1, (k - 0.9) / 0.7));
      svg.style('--label-opacity', String(labelOpacity));
    });

  svg.call(zoomBehavior as any);

  gMain = svg.append('g');

  const nodes: SimNode[] = [
    ...NOTES.map((n) => ({ ...n })),
    ...unresolvedIds.map((id) => ({
      id,
      folder: '',
      content: '',
      unresolved: true,
    })),
  ];
  const links: SimLink[] = edges.map((e) => ({ ...e }));

  document.getElementById('node-count')!.textContent =
    `${NOTES.length} notes · ${links.length} connections`;

  // Obsidian's force profile: long link distance + strong repulsion +
  // weak center gravity, and NO collision force. The repulsion alone
  // spaces nodes, leaving the airy whitespace Obsidian has; orphan and
  // leaf notes drift into a wide ring around the central cluster.
  simulation = d3
    .forceSimulation<SimNode, SimLink>(nodes)
    .force(
      'link',
      d3
        .forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance(150),
    )
    .force('charge', d3.forceManyBody().strength(-800))
    .force('x', d3.forceX(W / 2).strength(0.05))
    .force('y', d3.forceY(H / 2).strength(0.05));

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
    .attr('class', (d) => (d.unresolved ? 'node unresolved' : 'node'))
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
    .on('click', (_e, d) => {
      if (!d.unresolved) selectNote(d.id);
    })
    .on('mouseenter', (_e, d) => highlightNeighborhood(d.id))
    .on('mouseleave', clearHighlight);

  nodeGroup.append('circle').attr('r', (d) => nodeRadius(d.id));

  nodeGroup
    .append('text')
    .attr('class', 'node-label')
    .attr('y', (d) => nodeRadius(d.id) + 14)
    .text((d) => (d.id.length > 18 ? d.id.slice(0, 16) + '…' : d.id));

  function ticked() {
    linkGroup
      .attr('x1', (d) => (d.source as SimNode).x!)
      .attr('y1', (d) => (d.source as SimNode).y!)
      .attr('x2', (d) => (d.target as SimNode).x!)
      .attr('y2', (d) => (d.target as SimNode).y!);
    nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  simulation.on('tick', ticked);

  // Settle the layout off-screen so the graph loads already formed,
  // then fit the whole graph into the viewport (Obsidian opens fitted).
  simulation.stop();
  for (let i = 0; i < 300; i++) simulation.tick();
  ticked();
  updateGraphSelection();
  zoomToFit(W, H);
}

function zoomToFit(W: number, H: number) {
  const nodes = simulation.nodes();
  if (nodes.length === 0) return;
  const pad = 70;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x!);
    maxX = Math.max(maxX, n.x!);
    minY = Math.min(minY, n.y!);
    maxY = Math.max(maxY, n.y!);
  }
  const w = maxX - minX + pad * 2;
  const h = maxY - minY + pad * 2;
  const scale = Math.min(1.1, W / w, H / h);
  const tx = W / 2 - (scale * (minX + maxX)) / 2;
  const ty = H / 2 - (scale * (minY + maxY)) / 2;
  svg.call(
    zoomBehavior.transform as any,
    d3.zoomIdentity.translate(tx, ty).scale(scale),
  );
}

// ── Hover highlighting: light up the hovered node, its neighbors and the
//    links between them; fade everything else (Obsidian-style) ──
function highlightNeighborhood(id: string) {
  if (!nodeGroup) return;
  const hood = neighbors.get(id) ?? new Set<string>();
  svg.classed('hovering', true);
  nodeGroup
    .classed('focus', (d) => d.id === id)
    .classed('neighbor', (d) => hood.has(d.id));
  linkGroup.classed(
    'link-active',
    (l) => (l.source as SimNode).id === id || (l.target as SimNode).id === id,
  );
}

function clearHighlight() {
  if (!nodeGroup) return;
  svg.classed('hovering', false);
  nodeGroup.classed('focus', false).classed('neighbor', false);
  linkGroup.classed('link-active', false);
}

function updateGraphSelection() {
  if (!nodeGroup) return;
  nodeGroup.classed('selected', (d) => d.id === selectedId);
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
      zoomBehavior.transform as any,
      d3.zoomIdentity.translate(tx, ty).scale(scale),
    );

  // Pulse ring: append a temporary circle that expands and fades
  const r = nodeRadius(id);
  const pulse = gMain
    .append('circle')
    .attr('cx', target.x!)
    .attr('cy', target.y!)
    .attr('r', r)
    .attr('fill', 'none')
    .attr('stroke', 'var(--accent)')
    .attr('stroke-width', 2)
    .attr('opacity', 1);

  pulse
    .transition()
    .duration(600)
    .attr('r', r + 24)
    .attr('opacity', 0)
    .remove();
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
    const q = searchQuery.toLowerCase();
    nodeGroup.classed(
      'search-dim',
      (d) => !!searchQuery && !d.id.toLowerCase().includes(q),
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
