import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
