export interface Project {
  title: string;
  description: string;
  categories: string[];
  githubUrl: string;
  websiteUrl?: string;
  imageUrl?: string;
}

const allProjects: Project[] = [
  {
    title: 'SHOPPING-CART',
    description: 'Shopping cart application powered by React and Redux Toolkit',
    categories: ['building-the-wheel'],
    githubUrl: 'https://github.com/g7xu/SHOPPING-CART',
    websiteUrl: 'https://g7xu.dev/SHOPPING-CART',
    imageUrl: '/images/projects/shopping-cart.png',
  },
  {
    title: 'Product-Management-APP',
    description: 'Product management app with React',
    categories: ['building-the-wheel'],
    githubUrl: 'https://github.com/g7xu/Product-Management-APP',
    websiteUrl: 'https://g7xu.dev/Product-Management-APP/',
    imageUrl: '/images/projects/product-management.png',
  },
  {
    title: 'Task-Management-APP',
    description: 'Task management app with React',
    categories: ['building-the-wheel'],
    githubUrl: 'https://github.com/g7xu/Task-Management-APP',
    websiteUrl: 'https://g7xu.dev/Task-Management-APP/',
    imageUrl: '/images/projects/task-management.png',
  },
  {
    title: 'guoxuan-devKit',
    description:
      'Automated macOS developer-environment setup toolkit — from a fresh Mac to `git push` in under 20 minutes',
    categories: ['building-the-wheel'],
    githubUrl: 'https://github.com/g7xu/guoxuan-devKit',
  },

  {
    title: "I'm not sure, but.. . ",
    description:
      'User speak-aloud study exploring effective practices for novice data scientists',
    categories: ['spotlight', 'data-science'],
    githubUrl: 'https://github.com/dstl-lab/Code-Comprehension-User-Study',
    websiteUrl: 'https://g7xu.dev/Code-Comprehension-User-Study/',
    imageUrl: '/images/projects/im-not-sure-but.png',
  },
  {
    title: 'ICU Sepsis Decision Support',
    description:
      'Full-stack web application providing ML-backed sepsis risk predictions for ICU patients',
    categories: ['spotlight', 'full-stack-applications'],
    githubUrl: 'https://github.com/g7xu/icu-sepsis-decision-support',
    websiteUrl: 'https://icu-sepsis-detect.g7xu.dev/',
    imageUrl: '/images/projects/icu-sepsis.png',
  },
  {
    title: 'Data_vis_LSUS',
    description:
      'Data visualization exploring how sunshine impacts life expectancy in US',
    categories: ['data-science'],
    githubUrl: 'https://github.com/g7xu/Data_vis_LSUS',
    imageUrl: '/images/projects/data-vis-lsus.png',
  },
  {
    title: 'Secret Life of Blood Glucose',
    description:
      'Interactive visualization explaining challenges faced by individuals with Type 2 Diabetes',
    categories: ['spotlight', 'data-science'],
    githubUrl: 'https://github.com/g7xu/secret-life-of-blood-glucose',
    websiteUrl: 'https://g7xu.dev/secret-life-of-blood-glucose/',
    imageUrl: '/images/projects/secret-life-of-blood-glucose.png',
  },
  {
    title: 'CellMaker_DataParser',
    description:
      'Data parser that converts raw CellMarker data to JSON format. Used in production in mygene.info',
    categories: ['data-science'],
    githubUrl: 'https://github.com/g7xu/CellMaker_DataParser',
    imageUrl: '/images/projects/cellmaker-dataparser.png',
  },
  {
    title: 'Dual-Lens',
    description:
      'Data visualization demonstrating deceptive vs earnest techniques. Top 5% project in class',
    categories: ['data-science'],
    githubUrl: 'https://github.com/g7xu/Dual-Lens',
    imageUrl: '/images/projects/dual-lens.png',
  },
];

export function getProjectsByCategory(category: string): Project[] {
  return allProjects.filter((p) => p.categories.includes(category));
}
