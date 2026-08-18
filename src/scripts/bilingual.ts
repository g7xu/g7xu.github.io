/**
 * Bilingual toggle spans: `<span class="bilingual" data-alt="…">visible text</span>`.
 *
 * The visible text is the span's default language and `data-alt` holds the
 * other variant; a click or Enter/Space exchanges them. Both variants are
 * plain text — the exchange replaces textContent.
 *
 * Authors write only `class` and `data-alt`; role, tabindex, title and `lang`
 * are added by upgradeBilingualSpans.
 */

import { langFor } from '../utils/lang';

/** Matches the transform/opacity transitions on `.bilingual` in global.css. */
const LIFT_MS = 140;

/** Long enough to outlast the width transition before inline styles are dropped. */
const SETTLE_MS = 220;

const SELECTOR = '.bilingual[data-alt]';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function spanFrom(event: Event): HTMLElement | null {
  const target = event.target;
  return target instanceof Element
    ? target.closest<HTMLElement>(SELECTOR)
    : null;
}

/**
 * Give every span in `root` its interactive affordances. Safe to re-run, and
 * required after markup is injected at runtime (the learning wiki renders
 * notes into the DOM long after load).
 */
export function upgradeBilingualSpans(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(SELECTOR).forEach((span) => {
    span.setAttribute('role', 'button');
    span.tabIndex = 0;
    span.title = 'Switch language';
    if (!span.hasAttribute('lang')) {
      span.setAttribute('lang', langFor(span.textContent ?? ''));
    }
  });
}

function exchange(span: HTMLElement, incoming: string): void {
  span.dataset.alt = span.textContent ?? '';
  span.textContent = incoming;
  span.setAttribute('lang', langFor(incoming));
}

/**
 * Lift the outgoing text out, exchange the text, and bring the incoming text
 * up from below. The two languages rarely measure the same, so the span's
 * width is animated between the measured values — otherwise the rest of the
 * line jumps at the moment of the exchange.
 */
function toggle(span: HTMLElement): void {
  const alt = span.dataset.alt;
  if (alt === undefined || span.dataset.swapping) return;

  if (reducedMotion.matches) {
    exchange(span, alt);
    return;
  }

  span.dataset.swapping = 'true';
  span.style.width = `${span.getBoundingClientRect().width}px`;
  span.classList.add('is-out');

  // Timed rather than driven by transitionend, which would not fire if the
  // span were hidden mid-swap and would strand it invisible.
  setTimeout(() => {
    span.classList.add('no-anim');
    span.classList.remove('is-out');
    span.classList.add('is-enter');
    exchange(span, alt);

    const held = span.style.width;
    span.style.width = 'auto';
    const target = span.getBoundingClientRect().width;
    span.style.width = held;

    void span.offsetWidth;

    span.classList.remove('no-anim');
    span.classList.remove('is-enter');
    span.style.width = `${target}px`;

    setTimeout(() => {
      span.style.width = '';
      delete span.dataset.swapping;
    }, SETTLE_MS);
  }, LIFT_MS);
}

const root = document.documentElement;

// BaseLayout and the learning wiki both pull this module in; a second
// registration would toggle every span twice per click.
if (!root.dataset.bilingualInit) {
  root.dataset.bilingualInit = 'true';

  document.addEventListener('click', (event) => {
    const span = spanFrom(event);
    if (span) toggle(span);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const span = spanFrom(event);
    if (!span) return;
    event.preventDefault();
    toggle(span);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      upgradeBilingualSpans(),
    );
  } else {
    upgradeBilingualSpans();
  }
}
