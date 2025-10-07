export type TaggedItem = {
  title: string;
  description: string;
  image: string;
  url?: string;
  tags: string[];
  featured?: boolean;
  external?: boolean;
  paperUrl?: string;
  studyUrl?: string;
};

export const featuredProjects: TaggedItem[] = [
  {
    title: 'Secret Life of Blood Glucose',
    description:
      'An interactive visualization about blood glucose and diabetes',
    image: '/assets/images/SLOBG_cover_pic.png',
    url: 'https://g7xu.github.io/secret-life-of-blood-glucose/',
    tags: ['Data Science', 'Data Visualization'],
    featured: true,
    external: true,
  },
  {
    title: 'Trend Bubble 🫧🫧🫧',
    description:
      'A real-time dashboard of trending datasets from Kaggle',
    image: '/assets/images/trend_bubble_cover_pic.png',
    url: 'https://g7xu.github.io/Trend_Bubble/',
    tags: ['Data Science', 'Data Visualization', 'Data Pipeline'],
    featured: true,
    external: true,
  },
];

export const researchProjects: TaggedItem[] = [
  {
    title:
      'DSTL Lab: Investigation on Effective Data Analytical Strategies',
    description:
      'User speak-aloud study exploring effective practices for novice data scientists',
    image: '/assets/images/dstl_project_pic.png',
    paperUrl: '/assets/files/2025_sigcse_experts_vs_novices_SIGCSE.pdf',
    studyUrl: 'https://github.com/dstl-lab/Code-Comprehension-User-Study',
    tags: ['Data Science', 'Education', 'Exploratory Data Analysis'],
    featured: true,
  },
];
