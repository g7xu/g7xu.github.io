import type { Quote } from '../data/quotes';

declare global {
  interface Window {
    __QUOTES__?: Quote[];
  }
}

interface FontVariant {
  family: string;
  weight: number;
  italic: boolean;
}

interface Item {
  q: Quote;
  i: number;
  w: number;
  h: number;
  el: HTMLElement;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

// a palette of fonts/styles — each quote gets a deterministic variant for visual variety
const FONTS: FontVariant[] = [
  { family: "'Manrope', sans-serif", weight: 600, italic: false },
  { family: "'Lora', serif", weight: 400, italic: false },
  { family: "'Lora', serif", weight: 400, italic: true },
  { family: "'Playfair Display', serif", weight: 500, italic: false },
  { family: "'Playfair Display', serif", weight: 700, italic: false },
  { family: "'Spectral', serif", weight: 400, italic: true },
  { family: "'JetBrains Mono', monospace", weight: 400, italic: false },
  { family: "'Manrope', sans-serif", weight: 700, italic: false },
];

const SIZE: Record<number, number> = { 1: 15, 2: 18, 3: 23, 4: 30, 5: 42 }; // weight -> base px

// small deterministic pseudo-random so the layout is stable (no Math.random)
function rng(seed: number): number {
  const x = Math.sin(seed * 99.13 + 7.7) * 43758.5453;
  return x - Math.floor(x); // 0..1
}

function intersects(a: Box, b: Box, pad: number): boolean {
  return !(
    a.x + a.w + pad < b.x ||
    b.x + b.w + pad < a.x ||
    a.y + a.h + pad < b.y ||
    b.y + b.h + pad < a.y
  );
}

const QUOTES: Quote[] = window.__QUOTES__ ?? [];
const stage = document.getElementById('qc-stage');
const world = document.getElementById('qc-world');
const measure = document.getElementById('qc-measure');

if (stage && world && measure && QUOTES.length > 0) {
  initQuoteCloud(stage, world, measure);
}

function initQuoteCloud(
  stage: HTMLElement,
  world: HTMLElement,
  measure: HTMLElement,
): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.body.classList.add('qc-reduce');

  // view state
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let contentBox = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  function applyTransform(): void {
    world.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  // Keep the stage below the sticky navbar so quotes are never hidden under it.
  // (The navbar grows taller when it wraps on narrow screens, so measure it live.)
  function layoutStage(): void {
    const nav = document.querySelector('.navbar');
    const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    stage.style.top = navH + 'px';
  }

  function buildEl(q: Quote, i: number): HTMLElement {
    const fig = document.createElement('figure');
    const w = q.weight ?? 3;
    const font = FONTS[Math.floor(rng(i + 1) * FONTS.length)];
    const jitter = 0.82 + rng(i + 40) * 0.5; // 0.82–1.32 size variety
    fig.className =
      'quote' + (w >= 5 ? ' quote--accent' : w <= 2 ? ' quote--muted' : '');
    fig.style.fontFamily = font.family;
    fig.style.fontWeight = String(font.weight);
    fig.style.fontStyle = font.italic ? 'italic' : 'normal';
    fig.style.fontSize = Math.round((SIZE[w] ?? SIZE[3]) * jitter) + 'px';
    fig.style.maxWidth = Math.round(150 + w * 40) + 'px';

    const text = document.createElement('span');
    text.className = 'q-text';
    text.textContent = q.text;
    const meta = document.createElement('figcaption');
    meta.className = 'q-meta';
    meta.textContent = q.author ? '— ' + q.author : '';
    fig.append(text, meta);
    return fig;
  }

  function fitAll(animate: boolean): void {
    // center/fit within the stage (below the navbar), not the whole window
    const VW = stage.clientWidth;
    const VH = stage.clientHeight;
    const cw = contentBox.maxX - contentBox.minX || 1;
    const ch = contentBox.maxY - contentBox.minY || 1;
    const ccx = (contentBox.minX + contentBox.maxX) / 2;
    const ccy = (contentBox.minY + contentBox.maxY) / 2;
    // shrink so EVERYTHING fits in the window (more quotes -> smaller scale)
    const fit = Math.min(VW / cw, VH / ch) * 0.9;

    if (animate) {
      // start zoomed into the center, then pull back to reveal the whole cloud
      scale = fit * 2.6;
      panX = VW / 2 - ccx * scale;
      panY = VH / 2 - ccy * scale;
      world.style.transition = 'none';
      applyTransform();
      void world.offsetWidth; // force reflow so the next change animates
      world.style.transition = 'transform 1.3s cubic-bezier(0.22, 0.7, 0.2, 1)';
    }

    scale = fit;
    panX = VW / 2 - ccx * scale;
    panY = VH / 2 - ccy * scale;
    applyTransform();

    if (animate) {
      window.setTimeout(() => {
        world.style.transition = 'none';
      }, 1350);
    }
  }

  function pack(intro: boolean): void {
    world.replaceChildren();
    measure.replaceChildren();

    // largest first so big quotes anchor the center
    const items: Item[] = QUOTES.map((q, i) => ({
      q,
      i,
      w: 0,
      h: 0,
      el: buildEl(q, i),
    })).sort((a, b) => (b.q.weight ?? 3) - (a.q.weight ?? 3));

    // measure each at its real wrapped size
    for (const it of items) {
      const el = it.el;
      el.style.position = 'static';
      el.style.display = 'inline-block';
      measure.appendChild(el);
      const r = el.getBoundingClientRect();
      it.w = Math.ceil(r.width);
      it.h = Math.ceil(r.height);
      measure.removeChild(el);
      el.style.position = '';
      el.style.display = '';
      // lock width to the measured value so the absolutely-positioned element re-wraps
      // identically (otherwise #qc-world has no width and it reflows narrower/taller)
      el.style.width = it.w + 'px';
      if (!intro) el.classList.add('in'); // appear immediately, no reveal flash
    }

    // shape the spiral into an ellipse matching the stage aspect ratio, so the cloud
    // fills the visible area instead of forming a centered circle ("ball").
    const aspect = stage.clientWidth / stage.clientHeight;
    const ax = Math.sqrt(aspect);
    const ay = 1 / Math.sqrt(aspect);

    // place along an Archimedean spiral from world origin (0,0), collision-free.
    const placed: Box[] = [];
    const box = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    for (const it of items) {
      const pad = 4 + rng(it.i + 5) * 8; // 4–12px — small, just enough to breathe
      const angOff = rng(it.i + 11) * 6.28;
      const dens = 1.5; // tight, consistent spiral => dense packing, fewer holes
      let pos: Box | null = null;
      for (let t = 0; t < 9000; t += 0.1) {
        const r = dens * t;
        const px = Math.cos(t + angOff) * r * ax - it.w / 2;
        const py = Math.sin(t + angOff) * r * ay - it.h / 2;
        const cand: Box = { x: px, y: py, w: it.w, h: it.h };
        if (!placed.some((p) => intersects(cand, p, pad))) {
          pos = cand;
          break;
        }
      }
      if (!pos) pos = { x: -it.w / 2, y: -it.h / 2, w: it.w, h: it.h };
      placed.push(pos);

      it.el.style.left = pos.x + 'px';
      it.el.style.top = pos.y + 'px';
      world.appendChild(it.el);

      box.minX = Math.min(box.minX, pos.x);
      box.minY = Math.min(box.minY, pos.y);
      box.maxX = Math.max(box.maxX, pos.x + pos.w);
      box.maxY = Math.max(box.maxY, pos.y + pos.h);

      it.el.addEventListener('mouseenter', () => {
        world.classList.add('has-focus');
        it.el.classList.add('is-focus');
      });
      it.el.addEventListener('mouseleave', () => {
        world.classList.remove('has-focus');
        it.el.classList.remove('is-focus');
      });
    }

    contentBox = box;
    fitAll(intro && !reduce);

    // center-out staggered reveal (items are already largest-first = center-out)
    if (intro && !reduce) {
      items.forEach((it, k) => {
        window.setTimeout(() => it.el.classList.add('in'), 250 + k * 16);
      });
    }
  }

  // ---- zoom (toward a point) ----
  function zoomAt(mx: number, my: number, factor: number): void {
    const wx = (mx - panX) / scale;
    const wy = (my - panY) / scale;
    scale = Math.max(0.05, Math.min(8, scale * factor));
    panX = mx - wx * scale;
    panY = my - wy * scale;
    applyTransform();
  }

  stage.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      // smooth, gentle zoom proportional to scroll delta. Clamp the delta (mouse wheels
      // report large notches) and keep the coefficient small so a notch is only ~3–4%.
      const delta = Math.max(-60, Math.min(60, e.deltaY));
      const factor = Math.exp(-delta * 0.0006);
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor);
    },
    { passive: false },
  );

  // ---- pan (drag) + pinch (two-pointer) ----
  const pointers = new Map<number, { x: number; y: number }>();
  let dragging = false;
  let sx = 0;
  let sy = 0;
  let pinchDist = 0;

  stage.addEventListener('pointerdown', (e: PointerEvent) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.setPointerCapture(e.pointerId);
    if (pointers.size === 1) {
      dragging = true;
      sx = e.clientX - panX;
      sy = e.clientY - panY;
      stage.classList.add('dragging');
    } else if (pointers.size === 2) {
      dragging = false;
      stage.classList.remove('dragging');
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });

  stage.addEventListener('pointermove', (e: PointerEvent) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist > 0) {
        const rect = stage.getBoundingClientRect();
        zoomAt(
          (a.x + b.x) / 2 - rect.left,
          (a.y + b.y) / 2 - rect.top,
          dist / pinchDist,
        );
      }
      pinchDist = dist;
      return;
    }

    if (dragging) {
      panX = e.clientX - sx;
      panY = e.clientY - sy;
      applyTransform();
    }
  });

  function endPointer(e: PointerEvent): void {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (pointers.size === 0) {
      dragging = false;
      stage.classList.remove('dragging');
    }
    if (stage.hasPointerCapture?.(e.pointerId))
      stage.releasePointerCapture(e.pointerId);
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  // ---- zoom buttons (zoom toward the stage center) ----
  const cx = (): number => stage.clientWidth / 2;
  const cy = (): number => stage.clientHeight / 2;
  document
    .getElementById('qc-zoom-in')
    ?.addEventListener('click', () => zoomAt(cx(), cy(), 1.18));
  document
    .getElementById('qc-zoom-out')
    ?.addEventListener('click', () => zoomAt(cx(), cy(), 1 / 1.18));
  document
    .getElementById('qc-zoom-reset')
    ?.addEventListener('click', () => fitAll(!reduce));

  // Measurements depend on the exact webfonts. `document.fonts.ready` alone is not enough:
  // it only waits for fonts already in use, and nothing uses the display fonts until pack()
  // appends quotes — so it resolves with fallback metrics, then the real (wider) fonts swap
  // in and break the packing. Force-load every variant first, then pack.
  function ready(): Promise<unknown> {
    if (!document.fonts) return Promise.resolve();
    const loads = FONTS.map((f) =>
      document.fonts
        .load(`${f.italic ? 'italic ' : ''}${f.weight} 40px ${f.family}`)
        .catch(() => {}),
    );
    return Promise.all(loads).then(() => document.fonts.ready);
  }
  layoutStage();
  ready().then(() => pack(true));

  // debounced full re-pack on resize so the cloud reshapes to the new window aspect
  let rt = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => {
      layoutStage();
      pack(false);
    }, 150);
  });
}
