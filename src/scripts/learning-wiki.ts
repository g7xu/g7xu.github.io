import * as d3 from 'd3';
import { marked } from 'marked';

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
      const target = m[1].trim();
      if (ids.has(target)) {
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
function buildTree() {
  const tree = document.getElementById('file-tree')!;
  tree.innerHTML = '';

  const filtered = NOTES.filter((n) =>
    n.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  filtered.forEach((note) => {
    const item = document.createElement('div');
    item.className = 'tree-note' + (note.id === selectedId ? ' active' : '');
    item.dataset.id = note.id;
    item.textContent = note.id;
    item.title = note.id;
    item.addEventListener('click', () => selectNote(note.id));
    tree.appendChild(item);
  });
}

// ─────────────────────────────────────────
// RIGHT PANEL — Note content
// ─────────────────────────────────────────
function openNote(id: string) {
  const note = NOTES.find((n) => n.id === id);
  if (!note) return;

  const noteIds = new Set(NOTES.map((n) => n.id));

  // 1. Strip image/file embeds (![[...]]) — no graph value
  let processed = note.content.replace(/!\[\[[^\]]*\]\]/g, '');

  // 2. Convert [[Note|Alias]] and [[Note]] into clickable spans
  processed = processed.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_, target, alias) => {
      const cleanTarget = target.split('#')[0].split('^')[0].trim();
      const display = alias ? alias.trim() : cleanTarget;
      const exists = noteIds.has(cleanTarget);
      const cls = exists ? 'wiki-link' : 'wiki-link unresolved';
      const dataAttr = exists ? `data-note-id="${cleanTarget}"` : '';
      const title = exists
        ? `Go to: ${cleanTarget}`
        : `Note not found: ${cleanTarget}`;
      return `<a class="${cls}" ${dataAttr} title="${title}">${display}</a>`;
    },
  );

  document.getElementById('note-title')!.textContent = note.id;
  document.getElementById('note-body')!.innerHTML = marked.parse(
    processed,
  ) as string;
  document.getElementById('right-panel')!.classList.add('open');
}

// ── Wiki-link click handler (event delegation on note body) ──
document.getElementById('note-body')!.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('.wiki-link:not(.unresolved)');
  if (!link) return;
  e.preventDefault();
  const targetId = (link as HTMLElement).dataset.noteId;
  if (!targetId) return;
  selectNote(targetId);
  pulseNode(targetId);
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
