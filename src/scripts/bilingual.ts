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

/** Matches the opacity transition on `.bilingual` in global.css. */
const FADE_MS = 120;

const SELECTOR = '.bilingual[data-alt]';

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

function toggle(span: HTMLElement): void {
  const alt = span.dataset.alt;
  if (alt === undefined || span.classList.contains('is-swapping')) return;

  span.classList.add('is-swapping');
  // Timed rather than driven by transitionend, which never fires under
  // prefers-reduced-motion and would strand the span invisible.
  setTimeout(() => {
    span.dataset.alt = span.textContent ?? '';
    span.textContent = alt;
    span.setAttribute('lang', langFor(alt));
    span.classList.remove('is-swapping');
  }, FADE_MS);
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
