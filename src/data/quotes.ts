export interface Quote {
  /** The quote text itself. */
  text: string;
  /** Attribution — shown muted, revealed on hover. Omit for anonymous. */
  author?: string;
  /** 1–5: drives font size & placement priority (default 3). 5 renders in accent; ≤2 muted. */
  weight?: number;
  /** Optional source (book, talk, etc.) — reserved for future use. */
  source?: string;
}

// Add your quotes here. The cloud auto-shrinks so they all fit, no matter how many.
// Example:
//   { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci', weight: 5 },
export const quotes: Quote[] = [
  {
    text: 'In me the tiger sniffs the rose.',
    author: 'Siegfried Sassoon',
    weight: 4,
  },
  {
    text: '真正的强大不是对抗，而是允许发生。允许遗憾愚蠢，丑恶，虚伪，允许付出没有回报。',
    author: '莫言',
    weight: 4,
  },
  {
    text: 'You can’t connect the dots looking forward; you can only connect them looking backward. So you have to trust that the dots will somehow connect in your future.',
    author: 'Steve Jobs',
    weight: 4,
  },
  {
    text: '君子应该像天宇一样运行不息，即使颠沛流离，也不屈不挠；如果你是君子，接物度要像大地一样，没有什么东西不能承载。',
    author: '邓亚萍',
    weight: 4,
  },
  {
    text: 'There is hope in dreams, imagination, and in the courage of those who wish to make those dreams a reality.',
    author: 'Jonas Salk',
    weight: 4,
  },
  { text: '夫事以秘成，言以泄败。', author: '韩非子 · 说难', weight: 4 },
  {
    text: '没有度量的努力，叫自我感动，甚至叫自欺欺人。',
    author: 'Chenyang Zhao',
    weight: 4,
    source: 'https://www.linkedin.com/in/chayennezhao/',
  },
  { text: '莫愁前路无知己，天下谁人不识君。', author: '高适', weight: 4 },
  {
    text: '井蛙不可以语于海者，拘于虚也；夏虫不可以语于冰者，笃于时也。',
    author: '庄子 · 秋水',
    weight: 4,
  },
];
