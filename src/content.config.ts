import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Amelia's posts, carried over word for word from pelvy.app.
const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    image: image().optional(),
    imageAlt: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const collections = { posts };
