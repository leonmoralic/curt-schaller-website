// Standalone Zod schemas for content collections.
// Defined in a separate module so they can be imported from tests without
// triggering Astro's `astro:content` virtual module.
import { z } from 'astro/zod';

// Der Redaktionseditor schreibt fuer leer gelassene Felder `null` oder einen
// leeren Text — nicht "gar nicht vorhanden". Zods `.optional()` akzeptiert
// aber nur `undefined`. Ohne diese Helfer bricht der Build, sobald jemand ein
// optionales Feld leer laesst, und zwar fuer die GESAMTE Website: es wird dann
// nichts mehr ausgeliefert, ohne dass die Redaktion davon etwas merkt.
const optText = () =>
  z.preprocess(
    (v) => (typeof v === 'string' && v !== '' ? v : undefined),
    z.string().optional(),
  );
const optZahl = () =>
  z.preprocess(
    (v) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined),
    z.number().optional(),
  );
const optFlag = () =>
  z.preprocess((v) => v === true, z.boolean());
const liste = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(schema));
// Auswahlfelder: der Editor schreibt fuer "keine Auswahl" einen leeren Text.
// Alles, was nicht auf der Liste steht, gilt als nicht gesetzt — ein
// unerwarteter Wert darf die Website niemals offline nehmen.
const optAuswahl = <T extends string>(werte: readonly T[]) =>
  z.any().transform((v) => (werte.includes(v) ? (v as T) : undefined));

// Der Sprachcode steckt bereits im Dateinamen (de.md / en.md) und wird von
// keinem Bauteil gelesen.
const langPrefix = z.enum(['de', 'en']).nullish();

export const heroSchema = z.object({
  lang: langPrefix,
  kicker: z.string(),
  headlineLines: liste(
    z.object({ text: z.string(), emphasis: optFlag() }),
  ),
  stats: liste(
    z.object({
      label: z.string(),
      value: z.string(),
      count: optZahl(),
      suffix: optText(),
    }),
  ),
  image: z.string(),
  imageAlt: z.string(),
});

export const aboutSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  timeline: liste(
    z.object({
      year: z.string(),
      yearSuffix: optText(),
      // Titel und Text duerfen fehlen: eine Station, die in einer Sprache noch
      // nicht uebersetzt ist, soll den Build nicht anhalten. Sie wird beim
      // Rendern uebersprungen, bis sie gefuellt ist.
      title: optText(),
      body: optText(),
      current: optFlag(),
      // Welche Auszeichnung an dieser Station erscheint. Frueher haing die
      // Oscar-Statue am `current`-Schalter — dadurch wanderte sie mit, sobald
      // eine neuere Station dazukam.
      awardIcon: optAuswahl(['oscar', 'emmy'] as const),
    }),
  ),
});

export const inventionsSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  entries: liste(
    z.object({
      name: z.string(),
      year: z.number(),
      principle: z.string(),
      patents: liste(z.string()),
      award: optText(),
    }),
  ),
  // Auch ein ganzer optionaler Block darf leer sein, ohne den Build zu stoppen.
  patentBlock: z.preprocess(
    (v) => (v && typeof v === 'object' ? v : undefined),
    z
    .object({
      heading: z.string(),
      intro: z.string(),
      families: liste(
        z.object({
          title: z.string(),
          note: optText(),
          patents: liste(
            z.object({
              id: z.string(),
              active: optFlag(),
            }),
          ),
        }),
      ),
    })
    .optional(),
  ),
});

export const practiceSchema = z.object({
  lang: langPrefix,
  title: z.string(),
  entries: liste(
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
  links: liste(z.object({ label: z.string(), href: z.string().url() })),
});

// Gestaltung. Bewusst NICHT zweisprachig: die Schriftwahl gilt fuer die
// ganze Website, nicht je Sprachfassung.
export const designSchema = z.object({
  fontPairing: z.any().transform((v) => (v === 'inter-tight' ? v : 'fraunces')),
});
