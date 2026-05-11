import { describe, it, expect } from 'vitest';
import {
  inventionsSchema,
  heroSchema,
  contactSchema,
  practiceSchema,
  aboutSchema,
} from '../../src/content/schemas';

describe('content schemas', () => {
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

  it('accepts a practice entry with mailSubject', () => {
    const parsed = practiceSchema.parse({
      lang: 'de',
      title: 'Practice.',
      email: 'curt@cos-cam.com',
      entries: [
        {
          titleItalic: 'Workshops',
          titleRest: '& Trainings',
          body: 'Intensive Trainings.',
          tag: 'München · DACH',
          mailSubject: 'Anfrage: Workshop',
        },
      ],
    });
    expect(parsed.entries[0].titleItalic).toBe('Workshops');
    expect(parsed.email).toBe('curt@cos-cam.com');
  });

  it('rejects practice with invalid email', () => {
    expect(() =>
      practiceSchema.parse({
        lang: 'de',
        title: 'Practice.',
        email: 'not-an-email',
        entries: [],
      }),
    ).toThrow();
  });

  it('accepts about timeline with current flag', () => {
    const parsed = aboutSchema.parse({
      lang: 'de',
      title: 'Vita',
      timeline: [
        { year: '2025', title: 'Oscar', body: 'Sci-Tech', current: true },
        { year: '1984', title: 'Bavaria', body: 'Training' },
      ],
    });
    expect(parsed.timeline[0].current).toBe(true);
    expect(parsed.timeline[1].current).toBe(false);
  });
});
