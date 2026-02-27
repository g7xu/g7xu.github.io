export interface Project {
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
  featured: boolean;
  external: boolean;
}

export interface ResearchProject {
  title: string;
  description: string;
  image: string;
  paper_url: string;
  study_url: string;
  tags: string[];
  featured: boolean;
}

export const featuredProjects: Project[] = [
  {
    title: 'Secret Life of Blood Glucose',
    description:
      'An interactive visualization about blood glucose and diabetes',
    image: '/images/SLOBG_cover_pic.png',
    url: 'https://g7xu.github.io/secret-life-of-blood-glucose/',
    tags: ['Data Science', 'Data Visualization'],
    featured: true,
    external: true,
  },
  {
    title: 'Trend Bubble \uD83E\uDEB7\uD83E\uDEB7\uD83E\uDEB7',
    description: 'A real-time dashboard of trending datasets from Kaggle',
    image: '/images/trend_bubble_cover_pic.png',
    url: 'https://g7xu.github.io/Trend_Bubble/',
    tags: ['Data Science', 'Data Visualization', 'Data Pipeline'],
    featured: true,
    external: true,
  },
];

export const researchProjects: ResearchProject[] = [
  {
    title: 'DSTL Lab: Investigation on Effective Data Analytical Strategies',
    description:
      'User speak-aloud study exploring effective practices for novice data scientists',
    image: '/images/dstl_project_pic.png',
    paper_url: '/files/2025_sigcse_experts_vs_novices_SIGCSE.pdf',
    study_url: 'https://github.com/dstl-lab/Code-Comprehension-User-Study',
    tags: ['Data Science', 'Education', 'Exploratory Data Analysis'],
    featured: true,
  },
];
