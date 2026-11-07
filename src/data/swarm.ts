/**
 * The cursor crowd that builds the home page on a first visit. One
 * <cursor-swarm> per screen-sized region (first screen, projects, footer),
 * so the cursors finish, leave, and come back when the next region scrolls
 * into view. The gate, play-once and skip logic live in scripts/swarm.ts.
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
  // Build the whole region at once; with 'viewport' a region that is taller
  // than the screen never finishes and the cursors hover idle instead.
  scope: 'all',
  linger: '1800',
};

/** The region that is on screen at load. scripts/swarm.ts starts it. */
export const firstScreenSwarm = { ...crowd, trigger: 'manual' };

/**
 * A region below the fold. scripts/swarm.ts starts it on its first visible
 * pixel. Not the element's own trigger="visible": that waits for the region
 * to reach 12% into the viewport, which a short last region such as the
 * footer never does on a tall screen, so it would stay hidden for good.
 * `data-swarm-ignore` keeps the enclosing first-screen swarm from treating
 * it as content of its own.
 */
export const scrolledSwarm = {
  ...crowd,
  trigger: 'manual',
  'data-swarm-ignore': true,
};
