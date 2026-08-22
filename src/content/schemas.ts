// Standalone Zod schemas for content collections.
// Defined in a separate module so they can be imported from tests without
// triggering Astro's `astro:content` virtual module.
import { z } from 'astro/zod';

// Optional: der Sprachcode steckt bereits im Dateinamen (de.md / en.md) und
// wird von keinem Bauteil gelesen. Optional, damit der Build nicht bricht,
// wenn der Redaktions-Editor das Feld beim Speichern nicht mitschreibt.
const langPrefix = z.enum(['de', 'en']).optional();

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
  timeline: z.array(
    z.object({
      year: z.string(),
      yearSuffix: z.string().optional(),
      title: z.string(),
      body: z.string(),
      current: z.boolean().default(false),
    }),
  ),
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
  patentBlock: z
    .object({
      heading: z.string(),
      intro: z.string(),
      families: z.array(
        z.object({
          title: z.string(),
          note: z.string().optional(),
          patents: z.array(
            z.object({
              id: z.string(),
              active: z.boolean().default(false),
            }),
          ),
        }),
      ),
    })
    .optional(),
});

export const practiceSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  entries: z.array(
    z.object({
      titleItalic: z.string(),
      titleRest: z.string(),
      body: z.string(),
      tag: z.string(),
      mailSubject: z.string(),
    }),
  ),
  email: z.string().email(),
});

export const contactSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  letter: z.string(),
  signature: z.string(),
  email: z.string().email(),
  buttonLabel: z.string(),
  location: z.string(),
  links: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .default([]),
});
