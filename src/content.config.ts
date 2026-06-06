import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const philosophy = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/philosophy' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    summary: z.string(),
    description: z.string(),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    image: z.string().optional(),
  }),
});

export const collections = { blog, philosophy, work };
