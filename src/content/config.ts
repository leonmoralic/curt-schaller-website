import { defineCollection } from 'astro:content';
import {
  heroSchema,
  aboutSchema,
  inventionsSchema,
  practiceSchema,
  contactSchema,
} from './schemas';

export const heroCollection = defineCollection({ type: 'content', schema: heroSchema });
export const aboutCollection = defineCollection({ type: 'content', schema: aboutSchema });
export const inventionsCollection = defineCollection({ type: 'data', schema: inventionsSchema });
export const practiceCollection = defineCollection({ type: 'data', schema: practiceSchema });
export const contactCollection = defineCollection({ type: 'data', schema: contactSchema });

export const collections = {
  hero: heroCollection,
  about: aboutCollection,
  inventions: inventionsCollection,
  practice: practiceCollection,
  contact: contactCollection,
};
