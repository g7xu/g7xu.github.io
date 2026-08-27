export interface Quote {
  text: string;
  /** Attribution; rendered muted and faded in only while the quote is hovered. */
  author?: string;
  /**
   * 1–5 (default 3). The single knob per quote: heavier means larger type,
   * wider wrap, and a spot nearer the center; 5 renders in the accent color,
   * ≤2 muted. Equal weights place in array order, earliest nearest the center.
   * Exact values live at SIZE in quote-cloud.ts.
   */
  weight?: number;
  /** Provenance for the record only — never rendered. Book, talk, or URL. */
  source?: string;
}

// The cloud rescales to fit every entry in the viewport, so length here is unbounded.
export const quotes: Quote[] = [
  {
    text: '人生・工作的结果 = 思维方式 × 热情 × 能力',
    author: 'Kazuo Inamori (稻盛和夫)',
    weight: 4,
  },
  {
    text: 'In me the tiger sniffs the rose.',
    author: 'Siegfried Sassoon',
    weight: 5,
  },
  {
    text: '真正的强大不是对抗，而是允许发生。允许遗憾愚蠢，丑恶，虚伪，允许付出没有回报。',
    author: '莫言',
    weight: 4,
  },
  {
    text: '没有度量的努力，叫自我感动，甚至叫自欺欺人。',
    author: 'Chenyang Zhao',
    weight: 4,
    source: 'https://www.linkedin.com/in/chayennezhao/',
  },
  { text: '夫事以秘成，言以泄败。', author: '韩非子 · 说难', weight: 4 },
  {
    text: '君子应该像天宇一样运行不息，即使颠沛流离，也不屈不挠；如果你是君子，接物度要像大地一样，没有什么东西不能承载。',
    author: '邓亚萍',
    weight: 4,
  },
  {
    text: 'Pressure is a privilege. It comes only to those who earn it.',
    author: 'Billie Jean King',
    weight: 4,
  },
  {
    text: 'You can’t connect the dots looking forward; you can only connect them looking backward. So you have to trust that the dots will somehow connect in your future.',
    author: 'Steve Jobs',
    weight: 4,
  },
  {
    text: 'There is hope in dreams, imagination, and in the courage of those who wish to make those dreams a reality.',
    author: 'Jonas Salk',
    weight: 4,
  },
  { text: '莫愁前路无知己，天下谁人不识君。', author: '高适', weight: 4 },
  {
    text: '井蛙不可以语于海者，拘于虚也；夏虫不可以语于冰者，笃于时也。',
    author: '庄子 · 秋水',
    weight: 4,
  },
  {
    text: '王侯将相宁有种乎！',
    author: '陈胜',
    source: '史记 · 陈涉世家',
    weight: 4,
  },
];
