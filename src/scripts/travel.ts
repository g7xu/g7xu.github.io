// ---- Level-of-detail drill: globe → country → state grid → city grid ----
const svg = document.getElementById(
  'us-map',
) as unknown as SVGSVGElement | null;
const backBtn = document.getElementById('map-back');
const VB_W = 975;
const VB_H = 610;

if (svg && backBtn) {
  let k = 1;
  let tx = 0;
  let ty = 0;
  // History of views so "Zoom out" steps back one level at a time.
  // levelIdx: 0 = world, 1 = country, 2 = state grid, 3 = city (zoomed county)
  const stack: { k: number; tx: number; ty: number; levelIdx: number }[] = [];
  let levelIdx = 0;

  const setView = (nk: number, ntx: number, nty: number) => {
    k = nk;
    tx = ntx;
    ty = nty;
    svg.style.setProperty('--k', String(k));
    // Precompute 1/k in JS so pins counter-scale with a plain multiply (no
    // division-in-calc, which can render inconsistently and balloon a pin).
    svg.style.setProperty('--inv-k', String(1 / k));
    svg.style.setProperty('--tx', String(tx));
    svg.style.setProperty('--ty', String(ty));
  };

  const CLUSTER_THRESH = 22; // screen px under which pins are "stacked"
  const MAX_LEVEL = 3;
  const pinEls = Array.from(document.querySelectorAll<SVGGElement>('.pin'));
  const pinPts = pinEls.map((el) => ({
    el,
    x: Number(el.dataset.x),
    y: Number(el.dataset.y),
  }));

  const applyOffset = (i: number, ox: number, oy: number) => {
    const fan = pinPts[i].el.querySelector<SVGGElement>('.pin-fan');
    if (fan) fan.style.transform = `translate(${ox}px, ${oy}px)`;
  };

  const setClusterState = (i: number, count: number, bounds?: string) => {
    const el = pinPts[i].el;
    if (count > 1 && bounds) {
      el.dataset.origLabel ??= el.getAttribute('aria-label') ?? '';
      el.setAttribute('aria-label', `${count} coffee shops — zoom in`);
      el.dataset.clusterBounds = bounds;
      const num = el.querySelector('.pin-count text');
      if (num) num.textContent = String(count);
      el.classList.add('cluster');
    } else {
      if (el.dataset.origLabel) {
        el.setAttribute('aria-label', el.dataset.origLabel);
      }
      el.classList.remove('cluster');
    }
  };

  // Declutter: shops too close together at the current zoom collapse into
  // ONE pin with a count badge (the maps "cluster" pattern); clicking it
  // zooms in a level. Only at the deepest level does anything still stacked
  // (e.g. two shops on the same downtown block) fan out with a small leg
  // instead, so every shop stays visible and clickable.
  const updateDeclutter = () => {
    // Chained greedy clustering on screen distance (n is tiny).
    const used = new Set<number>();
    const clusters: number[][] = [];
    for (let i = 0; i < pinPts.length; i++) {
      if (used.has(i)) continue;
      const group = [i];
      used.add(i);
      let grew = true;
      while (grew) {
        grew = false;
        for (let j = 0; j < pinPts.length; j++) {
          if (used.has(j)) continue;
          const near = group.some(
            (m) =>
              Math.hypot(
                (pinPts[m].x - pinPts[j].x) * k,
                (pinPts[m].y - pinPts[j].y) * k,
              ) < CLUSTER_THRESH,
          );
          if (near) {
            group.push(j);
            used.add(j);
            grew = true;
          }
        }
      }
      clusters.push(group);
    }

    for (const group of clusters) {
      // Screen-space centroid of the cluster (shared pan cancels out).
      const cx = group.reduce((a, m) => a + pinPts[m].x, 0) / group.length;
      const cy = group.reduce((a, m) => a + pinPts[m].y, 0) / group.length;

      if (group.length === 1) {
        const m = group[0];
        pinPts[m].el.classList.remove('clustered-hidden');
        setClusterState(m, 1);
        applyOffset(m, 0, 0);
      } else if (levelIdx >= MAX_LEVEL) {
        // Deepest zoom: can't drill further, so fan the stack out.
        const radius = 9 + group.length * 2;
        group.forEach((m, gi) => {
          const el = pinPts[m].el;
          el.classList.remove('clustered-hidden');
          setClusterState(m, 1);
          // Two pins fan left/right (reads best for teardrops).
          const angle =
            group.length === 2
              ? gi * Math.PI
              : -Math.PI / 2 + (gi * 2 * Math.PI) / group.length;
          applyOffset(
            m,
            (cx - pinPts[m].x) * k + radius * Math.cos(angle),
            (cy - pinPts[m].y) * k + radius * Math.sin(angle),
          );
        });
      } else {
        // Collapse the stack into one badge pin at the centroid.
        let rep = group[0];
        let best = Infinity;
        for (const m of group) {
          const d = Math.hypot(pinPts[m].x - cx, pinPts[m].y - cy);
          if (d < best) {
            best = d;
            rep = m;
          }
        }
        const xs = group.map((m) => pinPts[m].x);
        const ys = group.map((m) => pinPts[m].y);
        const bounds = `${Math.min(...xs)},${Math.min(...ys)},${Math.max(...xs)},${Math.max(...ys)}`;
        for (const m of group) {
          const el = pinPts[m].el;
          if (m === rep) {
            el.classList.remove('clustered-hidden');
            setClusterState(m, group.length, bounds);
            applyOffset(m, (cx - pinPts[m].x) * k, (cy - pinPts[m].y) * k);
          } else {
            el.classList.add('clustered-hidden');
            setClusterState(m, 1);
            applyOffset(m, 0, 0);
          }
        }
      }
    }
  };

  // Animate the view with ONE rAF loop so the map and the pin counter-scale
  // stay perfectly in sync every frame (no mid-zoom "ballooning pin").
  let raf = 0;
  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const animateView = (tk: number, ttx: number, tty: number, dur = 620) => {
    cancelAnimationFrame(raf);
    const k0 = k,
      tx0 = tx,
      ty0 = ty;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = easeInOut(p);
      setView(k0 + (tk - k0) * e, tx0 + (ttx - tx0) * e, ty0 + (tty - ty0) * e);
      if (p < 1) raf = requestAnimationFrame(step);
      else updateDeclutter(); // re-cluster pins for the settled zoom
    };
    raf = requestAnimationFrame(step);
  };
  const classForLevel = (i: number) =>
    i === 0 ? 'lod-world' : i === 1 ? 'lod-country' : 'lod-state';
  const setLevel = (i: number) => {
    levelIdx = i;
    svg.classList.remove('lod-world', 'lod-country', 'lod-state');
    svg.classList.add(classForLevel(i));
    backBtn.hidden = i === 0;
  };

  const frameTarget = (bounds: string, pad: number, maxK: number) => {
    const [x0, y0, x1, y1] = bounds.split(',').map(Number);
    const bw = Math.max(1, x1 - x0);
    const bh = Math.max(1, y1 - y0);
    const nk = Math.min(VB_W / (bw * pad), VB_H / (bh * pad), maxK);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    return { k: nk, tx: VB_W / 2 - nk * cx, ty: VB_H / 2 - nk * cy };
  };

  // Go to a target view. Going DEEPER remembers the current view first;
  // clicking within the same level just re-centers (no runaway history,
  // so one "Zoom out" per real level — not per click).
  const goTo = (
    target: { k: number; tx: number; ty: number },
    toIdx: number,
  ) => {
    if (toIdx > levelIdx) {
      stack.push({ k, tx, ty, levelIdx });
      setLevel(toIdx);
    }
    animateView(target.k, target.tx, target.ty);
    (document.activeElement as HTMLElement | null)?.blur?.();
  };

  const zoomOut = () => {
    const prev = stack.pop();
    if (!prev) return;
    animateView(prev.k, prev.tx, prev.ty);
    setLevel(prev.levelIdx);
  };

  const bindDrill = (
    selector: string,
    pad: number,
    maxK: number,
    toIdx: number,
  ) => {
    document.querySelectorAll<SVGPathElement>(selector).forEach((el) => {
      const go = () => {
        const b = el.getAttribute('data-bounds');
        if (b) goTo(frameTarget(b, pad, maxK), toIdx);
      };
      el.addEventListener('click', go);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });
    });
  };
  bindDrill('.country.has-pin', 1.3, 14, 1); // world → country
  bindDrill('.state.has-pin', 1.3, 26, 2); // country → state grid
  bindDrill('.county.has-pin', 1.4, 60, 3); // state → city

  // Clicking a cluster badge pin zooms into that cluster's bounds, one
  // level at a time (same zoom caps as the region drills). Registered
  // before the collage's own pin handler, so stopImmediatePropagation
  // keeps a cluster click from opening a single shop's collage.
  const DRILL_MAX_K = [14, 26, 60];
  pinEls.forEach((el) => {
    const drill = (e: Event) => {
      if (!el.classList.contains('cluster')) return;
      e.stopImmediatePropagation();
      const b = el.dataset.clusterBounds;
      if (b) {
        goTo(
          frameTarget(b, 1.4, DRILL_MAX_K[Math.min(levelIdx, 2)]),
          levelIdx + 1,
        );
      }
    };
    el.addEventListener('click', drill);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (el.classList.contains('cluster')) e.preventDefault();
        drill(e);
      }
    });
  });

  backBtn.addEventListener('click', zoomOut);
  document.addEventListener('keydown', (e) => {
    const collageOpen =
      document.getElementById('collage-overlay')?.hidden === false;
    if (e.key === 'Escape' && stack.length > 0 && !collageOpen) zoomOut();
  });

  // Click empty space (ocean, or any non-shop region) → zoom out one level.
  // Zoom-in targets (a shop region or a pin) are ignored here; they drill in.
  svg.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t.closest('.has-pin') || t.closest('.pin')) return;
    if (stack.length > 0) zoomOut();
  });

  setLevel(0);
  updateDeclutter();
}

// ---- Coffee-shop collage ----
const overlay = document.getElementById('collage-overlay');
if (overlay) {
  const panels = Array.from(overlay.querySelectorAll<HTMLElement>('.collage'));

  const open = (id: string) => {
    panels.forEach((panel) => (panel.hidden = panel.dataset.id !== id));
    overlay.hidden = false;
    document.body.classList.add('collage-open');
  };
  const close = () => {
    overlay.hidden = true;
    panels.forEach((panel) => (panel.hidden = true));
    document.body.classList.remove('collage-open');
  };

  document.querySelectorAll<HTMLElement>('.pin').forEach((pin) => {
    const id = pin.dataset.id;
    if (!id) return;
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      open(id);
    });
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(id);
      }
    });
  });

  overlay
    .querySelectorAll<HTMLElement>('[data-close]')
    .forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
}
