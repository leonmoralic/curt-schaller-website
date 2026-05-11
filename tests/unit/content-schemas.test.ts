import { describe, it, expect } from 'vitest';
import {
  filmographySchema,
  awardsSchema,
  inventionsSchema,
  heroSchema,
  contactSchema,
} from '../../src/content/schemas';

describe('content schemas', () => {
  it('accepts a valid filmography entry', () => {
    const parsed = filmographySchema.parse({
      lang: 'de',
      title: 'Filmografie',
      entries: [
        { year: 2024, title: 'Dune: Part Two', director: 'Denis Villeneuve', role: 'Consultant' },
      ],
    });
    expect(parsed.entries[0].title).toBe('Dune: Part Two');
  });

  it('rejects filmography with invalid role', () => {
    expect(() =>
      filmographySchema.parse({
        lang: 'de',
        title: 'Filmografie',
        entries: [{ year: 2024, title: 'X', director: 'Y', role: 'Director' }],
      }),
    ).toThrow();
  });

  it('accepts a valid award entry', () => {
    const parsed = awardsSchema.parse({
      lang: 'en',
      title: 'Awards',
      entries: [{ year: 2025, title: 'Academy Sci-Tech Award', body: 'For TRINITY 2.' }],
    });
    expect(parsed.entries[0].year).toBe(2025);
  });

  it('accepts an invention with patents array', () => {
    const parsed = inventionsSchema.parse({
      lang: 'de',
      title: 'Erfindungen',
      entries: [
        { name: 'TRINITY 1', year: 2014, principle: 'Hybrid stabilization', patents: ['DE10...'] },
      ],
    });
    expect(parsed.entries[0].patents).toHaveLength(1);
  });

  it('defaults patents to an empty array when omitted', () => {
    const parsed = inventionsSchema.parse({
      lang: 'de',
      title: 'Erfindungen',
      entries: [{ name: 'TRINITY 2', year: 2024, principle: 'Hybrid stabilization' }],
    });
    expect(parsed.entries[0].patents).toEqual([]);
  });

  it('requires a valid email in contact schema', () => {
    expect(() =>
      contactSchema.parse({
        lang: 'de',
        title: 'Kontakt',
        email: 'not-an-email',
        location: 'München',
      }),
    ).toThrow();
  });

  it('accepts hero frontmatter with stats', () => {
    const parsed = heroSchema.parse({
      lang: 'de',
      kicker: 'Test kicker',
      headlineLines: [{ text: 'Line one' }],
      stats: [{ label: 'Years', value: '30+', count: 30, suffix: '+' }],
      image: '/images/curt-hero.jpg',
      imageAlt: 'Portrait',
    });
    expect(parsed.headlineLines[0].emphasis).toBe(false);
    expect(parsed.stats[0].count).toBe(30);
  });
});
