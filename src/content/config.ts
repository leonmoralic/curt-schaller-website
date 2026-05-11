import { defineCollection } from 'astro:content';
import {
  heroSchema,
  aboutSchema,
  inventionsSchema,
  awardsSchema,
  filmographySchema,
  workshopsSchema,
  contactSchema,
} from './schemas';

export const heroCollection = defineCollection({ type: 'content', schema: heroSchema });
export const aboutCollection = defineCollection({ type: 'content', schema: aboutSchema });
export const inventionsCollection = defineCollection({ type: 'data', schema: inventionsSchema });
export const awardsCollection = defineCollection({ type: 'data', schema: awardsSchema });
export const filmographyCollection = defineCollection({ type: 'data', schema: filmographySchema });
export const workshopsCollection = defineCollection({ type: 'content', schema: workshopsSchema });
export const contactCollection = defineCollection({ type: 'data', schema: contactSchema });

export const collections = {
  hero: heroCollection,
  about: aboutCollection,
  inventions: inventionsCollection,
  awards: awardsCollection,
  filmography: filmographyCollection,
  workshops: workshopsCollection,
  contact: contactCollection,
};
