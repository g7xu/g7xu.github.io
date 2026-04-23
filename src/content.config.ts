import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    category: z.string(),
    coverImage: z.string().optional(),
    author: z
      .object({
        name: z.string().default('Jason Xu'),
        avatar: z.string().default('/images/bio-photo.png'),
      })
      .default({}),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
