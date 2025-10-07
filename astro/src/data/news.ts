export type NewsItem = {
  date: string;
  displayDate: string;
  title: string;
  excerpt: string;
};

export const recentNews: NewsItem[] = [
  {
    date: '2025-07-14',
    displayDate: 'Jul 14, 2025',
    title: 'AI Engineer Intern',
    excerpt:
      'Starting my role as an AI Engineer Intern at Cadre.AI, a consulting firm.',
  },
  {
    date: '2024-12-23',
    displayDate: 'Dec 23, 2024',
    title: 'Launching the Website',
    excerpt: 'Launching of my personal website!',
  },
];
