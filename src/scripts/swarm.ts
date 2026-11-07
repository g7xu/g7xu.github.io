/**
 * First-visit swarm: a crowd of named cursors builds the page in front of the
 * visitor, once. Whether it runs at all is decided before first paint by the
 * inline gate in BaseLayout, which sets `html.swarm-live` only when the
 * visitor has not seen it and allows motion. This module does the rest:
 * define the element, start the first screen, remember, and let any click or
 * key jump to the finished page. Regions below the fold (data/swarm.ts) start
 * themselves when scrolled into view.
 *
 * The element is defined only on a live visit. Once defined, <cursor-swarm>
 * hides its content as soon as it connects, even with trigger="manual", so on
 * every other visit it must stay an unknown element that renders its children
 * as plain markup. A no-JS visitor gets the same plain markup.
 *
 * `?swarm` in the URL forces a run regardless of the stored flag.
 */
import { SWARM_CREW } from '../data/swarm';

export const SWARM_SEEN_KEY = 'swarm-seen';

const root = document.documentElement;

/** `count` distinct names from the crew, in random order. */
function pickCrew(count: number): string[] {
  const pool = [...SWARM_CREW];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

async function run() {
  const swarms = [...document.querySelectorAll('cursor-swarm')];
  if (!swarms.length || !root.classList.contains('swarm-live')) return;

  await import('cursor-swarm');
  await customElements.whenDefined('cursor-swarm');

  try {
    localStorage.setItem(SWARM_SEEN_KEY, '1');
  } catch {
    // Private mode or blocked storage: the swarm simply plays again next time.
  }

  // The same crew works every region of this page view.
  const crew = pickCrew(swarms[0].cursors);
  for (const el of swarms) el.names = crew;

  const skip = () => {
    for (const el of swarms) if (el.state === 'building') el.finish();
  };
  window.addEventListener('pointerdown', skip, { capture: true });
  window.addEventListener('keydown', skip, { capture: true });

  // Each element hides its own content on the frame after it connects; the
  // arming class (swarm.css) covers the gap until then, and comes off one
  // frame after the first region starts so the later regions are hidden too.
  document.addEventListener(
    'swarmstart',
    () => {
      requestAnimationFrame(() => root.classList.remove('swarm-arming'));
    },
    { once: true },
  );

  // Entrance animations stay off until every region has had its turn. A
  // region the visitor never scrolls to keeps the class on, which is harmless.
  document.addEventListener('swarmend', () => {
    if (swarms.every((el) => el.state === 'done')) {
      window.removeEventListener('pointerdown', skip, { capture: true });
      window.removeEventListener('keydown', skip, { capture: true });
      root.classList.remove('swarm-live');
    }
  });

  // The outermost swarm is the first screen; every nested one is a region
  // below the fold that starts as soon as any of it scrolls into view.
  const first = swarms.find((el) => !el.parentElement?.closest('cursor-swarm'));
  // Watch each region's content, not the element: swarm.css pads the element
  // upward over the gap above it, so the element itself is in view too early.
  const onScrollIn = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      onScrollIn.unobserve(entry.target);
      entry.target.closest('cursor-swarm')?.play();
    }
  });
  for (const el of swarms) {
    if (el !== first) onScrollIn.observe(el.firstElementChild ?? el);
  }
  first?.play();
}

run();
