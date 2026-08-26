/**
 * Der Redaktionseditor schreibt fuer ein leer gelassenes Feld je nach Typ
 * einen leeren Text, `null` oder gar nichts. Lehnt ein Schema einen dieser
 * Werte ab, bricht der Build — und dann wird die GESAMTE Website nicht mehr
 * ausgeliefert, obwohl nur ein einzelnes optionales Feld leer war.
 *
 * Das ist dreimal passiert (count: null, unuebersetzte Station, awardIcon: '').
 * Diese Tests halten die Regel fest: Was die Redaktion legitim speichern kann,
 * darf den Build nie anhalten.
 */
import { describe, it, expect } from 'vitest';
import {
  heroSchema,
  aboutSchema,
  inventionsSchema,
  practiceSchema,
  contactSchema,
  designSchema,
} from '../../src/content/schemas';

// Die drei Schreibweisen, die der Editor fuer "leer" verwendet.
const LEER = ['', null, undefined] as const;

describe('Schemas vertragen leer gelassene Felder', () => {
  it.each(LEER)('Kennzahl ohne Hochzaehl-Ziel (%p)', (leer) => {
    const parsed = heroSchema.parse({
      kicker: 'K', headlineLines: [{ text: 'A' }],
      stats: [{ label: 'L', value: '40+', count: leer, suffix: leer }],
      image: '/i.png', imageAlt: 'alt',
    });
    expect(parsed.stats[0].count).toBeUndefined();
  });

  it.each(LEER)('Station ohne Auszeichnung (%p)', (leer) => {
    const parsed = aboutSchema.parse({
      title: 'T',
      timeline: [{ year: '2001', title: 'A', body: 'B', awardIcon: leer, yearSuffix: leer }],
    });
    expect(parsed.timeline[0].awardIcon).toBeUndefined();
  });

  it('Station, die in dieser Sprache noch nicht uebersetzt ist', () => {
    const parsed = aboutSchema.parse({
      title: 'T',
      timeline: [{ year: '2026' }],
    });
    expect(parsed.timeline[0].title).toBeUndefined();
  });

  it.each(LEER)('Erfindung ohne Auszeichnungstext (%p)', (leer) => {
    expect(() => inventionsSchema.parse({
      title: 'T',
      entries: [{ name: 'N', year: 2001, principle: 'P', patents: leer, award: leer }],
      patentBlock: leer,
    })).not.toThrow();
  });

  it.each(LEER)('Kontakt ohne weiterfuehrende Links (%p)', (leer) => {
    const parsed = contactSchema.parse({
      title: 'T', letter: 'L', signature: 'S', email: 'a@b.de',
      buttonLabel: 'B', location: 'M', links: leer,
    });
    expect(parsed.links).toEqual([]);
  });

  it.each(LEER)('Leistung ohne Eintraege (%p)', (leer) => {
    const parsed = practiceSchema.parse({ title: 'T', entries: leer, email: 'a@b.de' });
    expect(parsed.entries).toEqual([]);
  });

  it.each([...LEER, 'unbekannt'])('Schriftwahl faellt auf Fraunces zurueck (%p)', (wert) => {
    expect(designSchema.parse({ fontPairing: wert }).fontPairing).toBe('fraunces');
  });
});

describe('Die echten Inhaltsdateien erfuellen ihr Schema', async () => {
  const fs = await import('node:fs');
  const yaml = await import('js-yaml').catch(() => null);
  const paare = [
    ['hero', heroSchema], ['about', aboutSchema], ['inventions', inventionsSchema],
    ['practice', practiceSchema], ['contact', contactSchema],
  ] as const;

  for (const [name, schema] of paare) {
    for (const lang of ['de', 'en'] as const) {
      it(`${name}/${lang}`, () => {
        const md = `src/content/${name}/${lang}.md`;
        const json = `src/content/${name}/${lang}.json`;
        let daten: unknown;
        if (fs.existsSync(json)) {
          daten = JSON.parse(fs.readFileSync(json, 'utf8'));
        } else {
          if (!yaml) return; // js-yaml nicht vorhanden, dann still ueberspringen
          const roh = fs.readFileSync(md, 'utf8');
          daten = yaml.load(roh.slice(4, roh.indexOf('\n---', 3)));
        }
        expect(() => schema.parse(daten)).not.toThrow();
      });
    }
  }
});
