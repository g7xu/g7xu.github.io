import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Other-language title; when set, the post heading becomes a bilingual toggle. */
    titleAlt: z.string().optional(),
    /** Omit on a post that is still just a title. */
    excerpt: z.string().optional(),
    /** Essays are long-form; notes and seeds keep lightweight writing first-class. */
    format: z.enum(['essay', 'note', 'seed']).default('essay'),
    date: z.string(),
    category: z.string(),
    coverImage: z.string().optional(),
    author: z
      .object({
        name: z.string(),
        avatar: z.string(),
      })
      .default({ name: 'Jason Xu', avatar: '/images/bio-photo.png' }),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
