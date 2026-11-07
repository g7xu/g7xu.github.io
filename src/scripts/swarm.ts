/**
 * First-visit swarm: a crowd of named cursors builds the page in front of the
 * visitor, once, as a guided tour. Whether it runs at all is decided before
 * first paint by the inline gate in BaseLayout, which sets `html.swarm-live`
 * only when the visitor has not seen it and allows motion. This module does
 * the rest: define the element, lock the page, start the first screen, pan
 * the window slowly down to the end of the page while each later region
 * starts as it comes into view, wait for the last cursors to leave, glide
 * back to the top, and hand the page back. The visitor watches; Escape or
 * the Skip button ends the tour on the finished page.
 *
 * The element is defined only on a live visit. Once defined, <cursor-swarm>
 * hides its content as soon as it connects, even with trigger="manual", so on
 * every other visit it must stay an unknown element that renders its children
 * as plain markup. A no-JS visitor gets the same plain markup.
 *
 * `?swarm` in the URL forces a run regardless of the stored flag.
 */
import type { CursorSwarm } from 'cursor-swarm';
import { SWARM_CREW } from '../data/swarm';

export const SWARM_SEEN_KEY = 'swarm-seen';

/** The pan down the page, in pixels per second, bounded so a short page is
 * not over in a blink and a long phone page does not take a minute. */
const PAN_PX_PER_S = 70;
const PAN_MIN_S = 12;
const PAN_MAX_S = 30;
/** A region starts once its content is this far up from the bottom edge. */
const REGION_LEAD_PX = 80;

const root = document.documentElement;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/** Linear in the middle, eased over the first and last tenth. */
const easeEnds = (t: number) => {
  if (t < 0.1) return (t * t) / 0.2;
  if (t > 0.9) return 1 - ((1 - t) * (1 - t)) / 0.2;
  return 0.05 + (t - 0.1) * (0.9 / 0.8);
};

/** `count` distinct names from the crew, in random order. */
function pickCrew(count: number): string[] {
  const pool = [...SWARM_CREW];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

type Tour = { cancelled: boolean };

/** Scroll the window to `top`, slower the further it is, 1.2 s to 3.2 s. */
function glideTo(top: number, tour: Tour): Promise<void> {
  return new Promise((resolve) => {
    const from = scrollY;
    const distance = top - from;
    const ms = Math.min(3200, Math.max(1200, Math.abs(distance) * 1.4));
    const t0 = performance.now();
    const step = (now: number) => {
      if (tour.cancelled) return resolve();
      const t = Math.min(1, (now - t0) / ms);
      scrollTo(0, from + distance * easeInOut(t));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

/**
 * Pan from the top to the end of the page at a steady pace, starting each
 * region in `pending` the moment its content rises into view.
 */
function panDown(pending: Set<CursorSwarm>, tour: Tour): Promise<void> {
  return new Promise((resolve) => {
    const end = root.scrollHeight - innerHeight;
    const seconds = Math.min(
      PAN_MAX_S,
      Math.max(PAN_MIN_S, end / PAN_PX_PER_S),
    );
    const t0 = performance.now();
    const step = (now: number) => {
      if (tour.cancelled) return resolve();
      const t = Math.min(1, (now - t0) / (seconds * 1000));
      scrollTo(0, end * easeEnds(t));
      const reach = innerHeight - REGION_LEAD_PX;
      for (const el of pending) {
        const content = el.firstElementChild ?? el;
        if (content.getBoundingClientRect().top <= reach) {
          pending.delete(el);
          el.play();
        }
      }
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

function ended(el: CursorSwarm): Promise<void> {
  return new Promise((resolve) => {
    if (el.state === 'done') resolve();
    else el.addEventListener('swarmend', () => resolve(), { once: true });
  });
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

  // The outermost swarm is the first screen; the nested ones are the regions
  // below the fold, visited in page order.
  const first = swarms.find((el) => !el.parentElement?.closest('cursor-swarm'));
  if (!first) return;
  const later = swarms.filter((el) => el !== first);
  const skipButton = document.querySelector<HTMLElement>('.swarm-skip');
  const tour: Tour = { cancelled: false };

  // While the tour runs the page is inert: no focus, no clicks, no key
  // scrolling. Pointer position still reaches the cursors through window
  // events, so the finale can gather around it.
  first.inert = true;
  const unlock = () => {
    first.inert = false;
    root.classList.replace('swarm-live', 'swarm-done');
    skipButton?.remove();
  };
  const skip = () => {
    if (tour.cancelled) return;
    tour.cancelled = true;
    for (const el of swarms) if (el.state !== 'done') el.finish();
    scrollTo(0, 0);
    unlock();
  };
  skipButton?.addEventListener('click', skip);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') skip();
  });

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

  first.play();
  const pending = new Set(later);
  await panDown(pending, tour);
  if (tour.cancelled) return;
  // A region the pan never reached (a page shorter than the window) starts now.
  for (const el of pending) el.play();
  await Promise.all(swarms.map(ended));
  if (tour.cancelled) return;
  await glideTo(0, tour);
  if (!tour.cancelled) unlock();
}

run();
