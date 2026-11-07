/**
 * The cursor crowd that builds the home page on a first visit, as a tour
 * that pans the window down the page (scripts/swarm.ts). One <cursor-swarm>
 * wraps the whole page and builds whatever the window shows as it moves; a
 * second, small one wraps the header and is built last.
 */

/**
 * Who shows up to build the page. Each page view draws `cursors` of these at
 * random (scripts/swarm.ts), so the crew differs from visit to visit. Keep
 * entries short; they sit in a name tag beside a 22px cursor.
 */
export const SWARM_CREW = [
  'Claude',
  'Opus',
  'Sonnet',
  'Haiku',
  'ChatGPT',
  'GPT-5',
  'Codex',
  'Gemini',
  'Llama',
  'DeepSeek',
  'Qwen',
  'Kimi',
  'Jason',
  'Xueheng Zhou',
];

/** Six agents in the workshop palette: rust, ink, coffee, slate, espresso, dark rust. */
const crowd = {
  cursors: '6',
  colors: '#c2410c,#2f5f8f,#8a7359,#475569,#3a2a1d,#9a3412',
  // Build only what is on screen, so nothing is finished before the pan
  // brings it into view; the cursors speed up if the window outruns them.
  scope: 'viewport',
  // Brisk, so a region is built in roughly the time it crosses the screen.
  speed: '1.7',
  linger: '1200',
  trigger: 'manual',
};

/** The whole page. Its cursor layer spans the page, so nothing clips them. */
export const pageSwarm = crowd;

/**
 * The header. It stays untouched during the pan, because a sticky bar being
 * drawn while the page moves under it looks wrong, and is built last, once
 * the window is back at the top. `data-swarm-ignore` keeps the page swarm
 * off it; the class gives it its sticky box and room for its cursors
 * (styles/swarm.css).
 */
export const headerSwarm = {
  ...crowd,
  'data-swarm-ignore': true,
  'data-swarm-at-end': true,
  class: 'swarm-header',
};
