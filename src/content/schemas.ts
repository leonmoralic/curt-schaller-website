// Standalone Zod schemas for content collections.
// Defined in a separate module so they can be imported from tests without
// triggering Astro's `astro:content` virtual module.
import { z } from 'astro/zod';

const langPrefix = z.enum(['de', 'en']);

export const heroSchema = z.object({
  lang: langPrefix,
  kicker: z.string(),
  headlineLines: z.array(
    z.object({ text: z.string(), emphasis: z.boolean().default(false) }),
  ),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      count: z.number().optional(),
      suffix: z.string().optional(),
    }),
  ),
  image: z.string(),
  imageAlt: z.string(),
});

export const aboutSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  timeline: z.array(z.object({ year: z.string(), label: z.string() })),
});

export const inventionsSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  entries: z.array(
    z.object({
      name: z.string(),
      year: z.number(),
      principle: z.string(),
      patents: z.array(z.string()).default([]),
      award: z.string().optional(),
    }),
  ),
});

export const awardsSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  entries: z.array(
    z.object({
      year: z.number(),
      title: z.string(),
      body: z.string(),
      source: z.string().optional(),
    }),
  ),
});

export const filmographySchema = z.object({
  lang: langPrefix,
  title: z.string(),
  entries: z.array(
    z.object({
      year: z.number(),
      title: z.string(),
      director: z.string(),
      role: z.enum(['Operator', 'Consultant', 'DOP', 'Other']),
      note: z.string().optional(),
    }),
  ),
});

export const workshopsSchema = z.object({
  lang: langPrefix,
  title: z.string(),
});

export const contactSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  email: z.string().email(),
  location: z.string(),
  links: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .default([]),
});
