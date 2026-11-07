/**
 * First-visit swarm: a crowd of named cursors builds the page in front of the
 * visitor, once. Whether it runs at all is decided before first paint by the
 * inline gate in BaseLayout, which sets `html.swarm-live` only when the
 * visitor has not seen it and allows motion. This module does the rest:
 * define the element, play, remember, and let any click or key jump to the
 * finished page.
 *
 * The element is defined only on a live visit. Once defined, <cursor-swarm>
 * hides its content as soon as it connects, even with trigger="manual", so on
 * every other visit it must stay an unknown element that renders its children
 * as plain markup. A no-JS visitor gets the same plain markup.
 *
 * `?swarm` in the URL forces a run regardless of the stored flag.
 */
export const SWARM_SEEN_KEY = 'swarm-seen';

const root = document.documentElement;

async function run() {
  const el = document.querySelector('cursor-swarm');
  if (!el || !root.classList.contains('swarm-live')) return;

  await import('cursor-swarm');
  await customElements.whenDefined('cursor-swarm');

  try {
    localStorage.setItem(SWARM_SEEN_KEY, '1');
  } catch {
    // Private mode or blocked storage: the swarm simply plays again next time.
  }

  const skip = () => {
    if (el.state === 'building') el.finish();
  };
  window.addEventListener('pointerdown', skip, { capture: true });
  window.addEventListener('keydown', skip, { capture: true });

  // The element hides every piece of content itself at swarmstart; until then
  // the arming class keeps the finished page from flashing (see swarm.css).
  el.addEventListener(
    'swarmstart',
    () => root.classList.remove('swarm-arming'),
    {
      once: true,
    },
  );
  el.addEventListener(
    'swarmend',
    () => {
      window.removeEventListener('pointerdown', skip, { capture: true });
      window.removeEventListener('keydown', skip, { capture: true });
      root.classList.remove('swarm-live');
    },
    { once: true },
  );

  el.play();
}

run();
