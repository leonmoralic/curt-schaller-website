# Curt O. Schaller Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (DE/EN) editorial one-pager personal website for Curt O. Schaller, extracting assets from the existing standalone HTML vorlage and deploying to Vercel.

**Architecture:** Astro 5 static site with built-in i18n routing (`/de/` and `/en/`), Markdown content collections (Zod-typed), GSAP + ScrollTrigger animations as Astro client islands, vanilla CSS with design tokens. Two language-mirrored one-pagers share components and styles; section IDs are language-neutral for the toggle. No backend, no CMS — content lives in `src/content/sections/{de,en}/`.

**Tech Stack:** Astro 5 · TypeScript · GSAP 3 + ScrollTrigger · Vitest (unit) · Playwright (e2e smoke) · Vercel (host) · pnpm

**Source spec:** `docs/superpowers/specs/2026-05-11-curt-schaller-website-design.md`

**Vorlage path:** `/Users/leonmoralic/Downloads/Curt O. Schaller - Standalone.html`

---

## File Map

```
curt-schaller-website/
├── astro.config.mjs                     # Task 2
├── package.json                          # Task 1
├── tsconfig.json                         # Task 1
├── pnpm-lock.yaml
├── .gitignore                            # Task 1
├── vercel.json                           # Task 31
├── public/
│   ├── fonts/                            # Task 3 (extracted)
│   │   ├── fraunces-italic-300.woff2
│   │   ├── ... (12 font files)
│   │   └── OFL.txt
│   ├── images/
│   │   ├── curt-hero.jpg                 # Task 3 (extracted)
│   │   └── og-image.jpg                  # Task 29
│   ├── favicon.svg                       # Task 1
│   └── robots.txt                        # Task 27
├── scripts/
│   └── extract-bundle.mjs                # Task 3
├── src/
│   ├── pages/
│   │   ├── index.astro                   # Task 26 (redirect)
│   │   ├── de/index.astro                # Task 20
│   │   ├── en/index.astro                # Task 20
│   │   ├── impressum.astro               # Task 28
│   │   └── datenschutz.astro             # Task 28
│   ├── layouts/
│   │   └── BaseLayout.astro              # Task 5
│   ├── components/
│   │   ├── Topbar.astro                  # Task 9
│   │   ├── LanguageToggle.astro          # Task 10
│   │   ├── Ticker.astro                  # Task 11
│   │   ├── Hero.astro                    # Task 8
│   │   ├── Section.astro                 # Task 12
│   │   ├── About.astro                   # Task 13
│   │   ├── Inventions.astro              # Task 14
│   │   ├── Awards.astro                  # Task 15
│   │   ├── Filmography.astro             # Task 16
│   │   ├── Workshops.astro               # Task 17
│   │   ├── Contact.astro                 # Task 18
│   │   └── Footer.astro                  # Task 19
│   ├── content/
│   │   ├── config.ts                     # Task 6
│   │   └── sections/
│   │       ├── de/*.md                   # Tasks 7, 13-18
│   │       └── en/*.md                   # Tasks 7, 13-18
│   ├── scripts/
│   │   ├── animations.ts                 # Task 21-23
│   │   ├── spotlight.ts                  # Task 24
│   │   └── languageToggle.ts             # Task 10
│   └── styles/
│       ├── tokens.css                    # Task 4
│       ├── base.css                      # Task 5
│       └── components/                   # per-component CSS
├── tests/
│   ├── unit/
│   │   ├── extract-bundle.test.mjs       # Task 3
│   │   └── content-schemas.test.ts       # Task 6
│   └── e2e/
│       └── smoke.spec.ts                 # Task 30
└── docs/
    └── superpowers/
        ├── specs/2026-05-11-...md
        └── plans/2026-05-11-...md (this file)
```

**Decomposition principle:** Each section gets one task (content + component + minimal CSS, in that order — TDD friendly because content schema fails first). Animations are isolated to a single file (`animations.ts`) and added in dedicated tasks so the static site is fully functional before motion is layered on. Tests live next to features.

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `.gitignore`, `public/favicon.svg`, `src/pages/index.astro` (placeholder)

- [ ] **Step 1: Initialize pnpm and Astro deps**

Run from project root:
```bash
cd /Users/leonmoralic/curt-schaller-website
pnpm init
pnpm add -D astro@^5 typescript @types/node
pnpm add gsap@^3.12
```

- [ ] **Step 2: Write tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

- [ ] **Step 3: Write minimal astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
});
```

- [ ] **Step 4: Write .gitignore**

```
node_modules
dist
.astro
.DS_Store
.env
.env.local
.vercel
playwright-report
test-results
```

- [ ] **Step 5: Add scripts to package.json**

In `package.json`, set:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check"
}
```

- [ ] **Step 6: Add placeholder index.astro**

`src/pages/index.astro`:
```astro
---
---
<html lang="de">
  <head><meta charset="utf-8"><title>Curt O. Schaller</title></head>
  <body><p>Scaffold OK</p></body>
</html>
```

- [ ] **Step 7: Add minimal favicon**

`public/favicon.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#c8a558"/></svg>
```

- [ ] **Step 8: Verify dev server**

Run:
```bash
pnpm dev
```
Expected: server starts on `http://localhost:4321`, "Scaffold OK" visible. Stop with Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: scaffold Astro project with TypeScript"
```

---

## Task 2: Configure i18n routing

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/pages/de/index.astro`, `src/pages/en/index.astro`
- Delete (or repurpose later): `src/pages/index.astro` placeholder will be rewritten in Task 26

- [ ] **Step 1: Update astro.config.mjs with i18n**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
```

- [ ] **Step 2: Create /de/ placeholder page**

`src/pages/de/index.astro`:
```astro
---
---
<html lang="de">
  <head><meta charset="utf-8"><title>Curt O. Schaller (DE)</title></head>
  <body><p>DE page</p></body>
</html>
```

- [ ] **Step 3: Create /en/ placeholder page**

`src/pages/en/index.astro`:
```astro
---
---
<html lang="en">
  <head><meta charset="utf-8"><title>Curt O. Schaller (EN)</title></head>
  <body><p>EN page</p></body>
</html>
```

- [ ] **Step 4: Verify routing**

Run `pnpm dev`. Visit:
- `http://localhost:4321/de/` → "DE page"
- `http://localhost:4321/en/` → "EN page"

Both must return 200. Stop server.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/pages/
git commit -m "feat: configure i18n routing for de and en"
```

---

## Task 3: Asset extraction script + unit test

**Files:**
- Create: `scripts/extract-bundle.mjs`
- Create: `tests/unit/extract-bundle.test.mjs`
- Output (generated): `public/fonts/*.woff2`, `public/fonts/OFL.txt`, `public/images/curt-hero.jpg`

- [ ] **Step 1: Add test runner**

```bash
pnpm add -D vitest
```

Update `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Write failing test for extractor**

`tests/unit/extract-bundle.test.mjs`:
```js
import { describe, it, expect } from 'vitest';
import { parseBundle } from '../../scripts/extract-bundle.mjs';

describe('parseBundle', () => {
  it('decodes base64 asset without compression', async () => {
    const html = `<script type="__bundler/manifest">${JSON.stringify({
      'uuid-1': { data: Buffer.from('hello').toString('base64'), mime: 'text/plain', compressed: false }
    })}</script><script type="__bundler/template">"<html></html>"</script>`;
    const out = await parseBundle(html);
    expect(out.assets['uuid-1'].bytes).toEqual(new Uint8Array([104, 101, 108, 108, 111]));
    expect(out.assets['uuid-1'].mime).toBe('text/plain');
  });

  it('gunzips compressed asset', async () => {
    const { gzipSync } = await import('node:zlib');
    const original = Buffer.from('compressed content');
    const compressed = gzipSync(original).toString('base64');
    const html = `<script type="__bundler/manifest">${JSON.stringify({
      'uuid-2': { data: compressed, mime: 'application/octet-stream', compressed: true }
    })}</script><script type="__bundler/template">"<html></html>"</script>`;
    const out = await parseBundle(html);
    expect(Buffer.from(out.assets['uuid-2'].bytes).toString()).toBe('compressed content');
  });
});
```

- [ ] **Step 3: Run test, verify it fails**

```bash
pnpm test tests/unit/extract-bundle.test.mjs
```
Expected: FAIL — "Cannot find module" or "parseBundle is not a function".

- [ ] **Step 4: Implement extract-bundle.mjs**

`scripts/extract-bundle.mjs`:
```js
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';

const MIME_EXT = {
  'font/woff2': 'woff2',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

export async function parseBundle(html) {
  const manifestMatch = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
  const templateMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
  if (!manifestMatch || !templateMatch) throw new Error('manifest or template script tag missing');

  const manifest = JSON.parse(manifestMatch[1]);
  const template = JSON.parse(templateMatch[1]);
  const assets = {};

  for (const [uuid, entry] of Object.entries(manifest)) {
    let bytes = Uint8Array.from(Buffer.from(entry.data, 'base64'));
    if (entry.compressed) bytes = Uint8Array.from(gunzipSync(bytes));
    assets[uuid] = { bytes, mime: entry.mime };
  }
  return { assets, template };
}

function detectFontName(template, uuid) {
  // Find the @font-face block that references this uuid in src: url("uuid").
  // The block contains font-family, font-style, font-weight, plus a unicode-range
  // comment ("/* latin */") just before the @font-face. We use those to name the file.
  const re = new RegExp(`/\\*\\s*([a-z-]+)\\s*\\*/\\s*@font-face\\s*\\{[^}]*?font-family:\\s*['"]([^'"]+)['"][^}]*?font-style:\\s*([a-z]+)[^}]*?font-weight:\\s*(\\d+)[^}]*?src:\\s*url\\(["']${uuid}["']\\)`, 'i');
  const m = template.match(re);
  if (!m) return null;
  const [, subset, family, style, weight] = m;
  return `${family.toLowerCase().replace(/\s+/g, '-')}-${style}-${weight}-${subset}.woff2`;
}

async function main() {
  const src = process.argv[2] || '/Users/leonmoralic/Downloads/Curt O. Schaller - Standalone.html';
  const root = process.argv[3] || path.resolve(new URL('..', import.meta.url).pathname);
  const html = await readFile(src, 'utf8');
  const { assets, template } = await parseBundle(html);

  await mkdir(path.join(root, 'public/fonts'), { recursive: true });
  await mkdir(path.join(root, 'public/images'), { recursive: true });

  let heroFound = false;
  for (const [uuid, asset] of Object.entries(assets)) {
    if (asset.mime === 'font/woff2') {
      const name = detectFontName(template, uuid) || `unknown-${uuid.slice(0, 8)}.woff2`;
      await writeFile(path.join(root, 'public/fonts', name), Buffer.from(asset.bytes));
      console.log(`font  → public/fonts/${name}`);
    } else if (asset.mime === 'image/jpeg' && !heroFound) {
      await writeFile(path.join(root, 'public/images/curt-hero.jpg'), Buffer.from(asset.bytes));
      heroFound = true;
      console.log('image → public/images/curt-hero.jpg');
    } else {
      const ext = MIME_EXT[asset.mime] || 'bin';
      const target = path.join(root, 'public/images', `extra-${uuid.slice(0, 8)}.${ext}`);
      await writeFile(target, Buffer.from(asset.bytes));
      console.log(`extra → ${target}`);
    }
  }

  const ofl = `Copyright 2017 The Fraunces Project Authors
Copyright 2014 Colophon Foundry

Licensed under the SIL Open Font License, Version 1.1.
Full text: https://openfontlicense.org/open-font-license-official-text/
`;
  await writeFile(path.join(root, 'public/fonts/OFL.txt'), ofl);
  console.log('license → public/fonts/OFL.txt');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}
```

- [ ] **Step 5: Run tests, verify they pass**

```bash
pnpm test tests/unit/extract-bundle.test.mjs
```
Expected: 2 passed.

- [ ] **Step 6: Run extractor against real vorlage**

```bash
node scripts/extract-bundle.mjs
```
Expected: Console lists ~12 font files + 1 hero image + license. Check `ls public/fonts/` and `ls public/images/`.

- [ ] **Step 7: Manually audit extras**

If any `extra-*` files appeared in `public/images/`, open them with `open public/images/extra-*` and decide: keep (rename meaningfully) or delete. Document keepers.

- [ ] **Step 8: Commit**

```bash
git add scripts tests public/fonts public/images package.json
git commit -m "feat: extract fonts and hero image from vorlage bundle"
```

---

## Task 4: Design tokens CSS

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Write tokens.css**

`src/styles/tokens.css`:
```css
:root {
  /* Color */
  --bg: #0a0907;
  --bg-2: #13110d;
  --gold: #c8a558;
  --gold-2: #8a7f6c;
  --ink: #e8e3d6;
  --mute: #5e574a;
  --rule: rgba(200, 165, 88, 0.18);

  /* Typography */
  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-mono: 'DM Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  /* Type scale */
  --fs-hero: clamp(3rem, 8vw, 6rem);
  --fs-section: clamp(1.75rem, 4vw, 3rem);
  --fs-body: 1.0625rem;
  --fs-mono: 0.8125rem;
  --fs-caption: 0.6875rem;

  /* Spacing */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-6: 3rem;
  --space-8: 4rem;
  --space-12: 6rem;
  --space-16: 8rem;

  /* Layout */
  --container: 1280px;
  --gutter: 1rem;
  --pad-x-mobile: 1.5rem;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 200ms;
  --dur-med: 600ms;
  --dur-slow: 1200ms;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add design tokens"
```

---

## Task 5: Base styles, font-face, BaseLayout

**Files:**
- Create: `src/styles/base.css`, `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write base.css with @font-face**

`src/styles/base.css`:
```css
@font-face {
  font-family: 'Fraunces';
  font-style: italic;
  font-weight: 300;
  font-display: swap;
  src: url('/fonts/fraunces-italic-300-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Fraunces';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/fraunces-italic-400-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('/fonts/dm-mono-normal-300-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF;
}
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/dm-mono-normal-400-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF;
}
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/dm-mono-normal-500-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--fs-body);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--pad-x-mobile);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> Note: actual font filenames depend on the extraction script output in Task 3. After running the script, adjust the `src:` URLs in this file to match real filenames. If the extractor produced `latin-ext` files, add a second `@font-face` block per weight with the matching `unicode-range`.

- [ ] **Step 2: Write BaseLayout**

`src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/tokens.css';
import '../styles/base.css';

interface Props {
  lang: 'de' | 'en';
  title: string;
  description: string;
}

const { lang, title, description } = Astro.props;
const path = Astro.url.pathname.replace(/^\/(de|en)/, '');
---
<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" hreflang="de" href={`https://example.com/de${path}`} />
    <link rel="alternate" hreflang="en" href={`https://example.com/en${path}`} />
    <link rel="alternate" hreflang="x-default" href={`https://example.com/de${path}`} />
    <link rel="preload" as="font" type="font/woff2" href="/fonts/fraunces-italic-300-latin.woff2" crossorigin />
    <link rel="preload" as="font" type="font/woff2" href="/fonts/dm-mono-normal-400-latin.woff2" crossorigin />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="/images/og-image.jpg" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Wire BaseLayout into both placeholder pages**

`src/pages/de/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout lang="de" title="Curt O. Schaller — Visitenkarte" description="Curt O. Schaller — Erfinder des ARRI TRINITY, Academy Award Preisträger.">
  <p style="padding: 4rem; font-family: var(--font-display); font-style: italic; font-size: 3rem; color: var(--gold);">DE</p>
</BaseLayout>
```

Mirror for `src/pages/en/index.astro` with English title.

- [ ] **Step 4: Verify in browser**

`pnpm dev`. Visit `/de/` — should show gold italic "DE" on dark background. Visit `/en/`. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/styles src/layouts src/pages
git commit -m "feat: add base styles, font-face, BaseLayout"
```

---

## Task 6: Content collection schemas

**Files:**
- Create: `src/content/config.ts`, `tests/unit/content-schemas.test.ts`

- [ ] **Step 1: Write failing schema test**

`tests/unit/content-schemas.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { filmographyCollection, awardsCollection, inventionsCollection } from '../../src/content/config';

describe('content schemas', () => {
  it('accepts a valid filmography entry', () => {
    const parsed = filmographyCollection.schema.parse({
      entries: [{ year: 2024, title: 'Dune: Part Two', director: 'Denis Villeneuve', role: 'Consultant' }],
    });
    expect(parsed.entries[0].title).toBe('Dune: Part Two');
  });

  it('rejects filmography with invalid role', () => {
    expect(() => filmographyCollection.schema.parse({
      entries: [{ year: 2024, title: 'X', director: 'Y', role: 'Director' }],
    })).toThrow();
  });

  it('accepts a valid award entry', () => {
    const parsed = awardsCollection.schema.parse({
      entries: [{ year: 2025, title: 'Academy Sci-Tech Award', body: 'For TRINITY 2.' }],
    });
    expect(parsed.entries[0].year).toBe(2025);
  });

  it('accepts an invention with patents array', () => {
    const parsed = inventionsCollection.schema.parse({
      entries: [{ name: 'TRINITY 1', year: 2014, principle: 'Hybrid stabilization', patents: ['DE10...'] }],
    });
    expect(parsed.entries[0].patents).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
pnpm test tests/unit/content-schemas.test.ts
```
Expected: FAIL — "Cannot find module '../../src/content/config'".

- [ ] **Step 3: Write config.ts**

`src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

const langPrefix = z.enum(['de', 'en']);

const heroCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lang: langPrefix,
    kicker: z.string(),
    headlineLines: z.array(z.object({ text: z.string(), emphasis: z.boolean().default(false) })),
    stats: z.array(z.object({ label: z.string(), value: z.string(), count: z.number().optional(), suffix: z.string().optional() })),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

const aboutCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lang: langPrefix,
    title: z.string(),
    timeline: z.array(z.object({ year: z.string(), label: z.string() })),
  }),
});

const inventionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    lang: langPrefix,
    title: z.string(),
    entries: z.array(z.object({
      name: z.string(),
      year: z.number(),
      principle: z.string(),
      patents: z.array(z.string()).default([]),
      award: z.string().optional(),
    })),
  }),
});

const awardsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    lang: langPrefix,
    title: z.string(),
    entries: z.array(z.object({
      year: z.number(),
      title: z.string(),
      body: z.string(),
      source: z.string().optional(),
    })),
  }),
});

const filmographyCollection = defineCollection({
  type: 'data',
  schema: z.object({
    lang: langPrefix,
    title: z.string(),
    entries: z.array(z.object({
      year: z.number(),
      title: z.string(),
      director: z.string(),
      role: z.enum(['Operator', 'Consultant', 'DOP', 'Other']),
      note: z.string().optional(),
    })),
  }),
});

const workshopsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lang: langPrefix,
    title: z.string(),
  }),
});

const contactCollection = defineCollection({
  type: 'data',
  schema: z.object({
    lang: langPrefix,
    title: z.string(),
    email: z.string().email(),
    location: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

export const collections = {
  hero: heroCollection,
  about: aboutCollection,
  inventions: inventionsCollection,
  awards: awardsCollection,
  filmography: filmographyCollection,
  workshops: workshopsCollection,
  contact: contactCollection,
};

export {
  heroCollection,
  aboutCollection,
  inventionsCollection,
  awardsCollection,
  filmographyCollection,
  workshopsCollection,
  contactCollection,
};
```

- [ ] **Step 4: Run tests, verify pass**

```bash
pnpm test tests/unit/content-schemas.test.ts
```
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/content/config.ts tests/unit/content-schemas.test.ts
git commit -m "feat: add Zod content schemas with tests"
```

---

## Task 7: Hero content (DE + EN)

**Files:**
- Create: `src/content/sections/hero/de.md`, `src/content/sections/hero/en.md`

Layout choice: Astro content collections by default expect files at `src/content/<collectionName>/*`. Use filename (`de.md`, `en.md`) for language. The `lang` frontmatter field is redundant but keeps validation explicit.

- [ ] **Step 1: Write hero/de.md**

`src/content/sections/hero/de.md`:
```markdown
---
lang: de
kicker: Academy Award — Sci-Tech 2025
headlineLines:
  - { text: "The hand", emphasis: false }
  - { text: "behind", emphasis: true }
  - { text: "the motion.", emphasis: false }
stats:
  - { label: "Jahre am Set", value: "30+", count: 30, suffix: "+" }
  - { label: "München", value: "1964" }
  - { label: "Oscar · Sci-Tech", value: "2025" }
image: /images/curt-hero.jpg
imageAlt: Curt O. Schaller, Portrait
---

**Curt O. Schaller** (*&nbsp;1964, München) ist Kameramann, Steadicam&nbsp;Operator und Entwickler der ARRI-Kamerastabilisierungs-Systeme. 2025 wurde er für Konzept, Design und Entwicklung des TRINITY&nbsp;2 mit dem Academy Scientific and Engineering Award ausgezeichnet.

<!-- SOURCE: vorlage hero, AMPAS Sci-Tech Citation 2025 -->
```

- [ ] **Step 2: Write hero/en.md**

`src/content/sections/hero/en.md`:
```markdown
---
lang: en
kicker: Academy Award — Sci-Tech 2025
headlineLines:
  - { text: "The hand", emphasis: false }
  - { text: "behind", emphasis: true }
  - { text: "the motion.", emphasis: false }
stats:
  - { label: "Years on set", value: "30+", count: 30, suffix: "+" }
  - { label: "Munich", value: "1964" }
  - { label: "Oscar · Sci-Tech", value: "2025" }
image: /images/curt-hero.jpg
imageAlt: Curt O. Schaller, portrait
---

**Curt O. Schaller** (b.&nbsp;1964, Munich) is a cinematographer, Steadicam operator, and the developer of ARRI's camera stabilization systems. In 2025 he received the Academy Scientific and Engineering Award for the concept, design, and development of TRINITY&nbsp;2.

<!-- SOURCE: vorlage hero, AMPAS Sci-Tech Citation 2025 -->
```

> Note: `src/content/sections/` was the planned layout, but Astro content collections expect `src/content/<collection>/*`. Use `src/content/hero/de.md`, etc. Update `config.ts` collection names accordingly: keep `hero`, `about`, etc., and store files under `src/content/<name>/<lang>.md`.

- [ ] **Step 3: Adjust file locations**

Move files: `src/content/hero/de.md`, `src/content/hero/en.md`. Verify schema validates by running:
```bash
pnpm astro sync
```
Expected: no errors. If errors, fix frontmatter to match schema.

- [ ] **Step 4: Commit**

```bash
git add src/content/hero
git commit -m "content: add hero section DE and EN"
```

---

## Task 8: Hero component

**Files:**
- Create: `src/components/Hero.astro`, `src/styles/components/hero.css`

- [ ] **Step 1: Write hero.css**

`src/styles/components/hero.css`:
```css
.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  padding: var(--space-12) 0 var(--space-16);
  position: relative;
}
@media (min-width: 900px) {
  .hero { grid-template-columns: 1.2fr 1fr; align-items: end; }
}
.hero__kicker {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: var(--space-3);
}
.hero__kicker .star { color: var(--gold); }
.hero__title {
  font-family: var(--font-display);
  font-weight: 300;
  font-style: italic;
  font-size: var(--fs-hero);
  line-height: 0.95;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-bottom: var(--space-4);
}
.hero__title .line { display: block; overflow: hidden; }
.hero__title em {
  font-style: italic;
  color: var(--gold);
  font-weight: 400;
}
.hero__sub {
  font-family: var(--font-display);
  font-size: 1.125rem;
  line-height: 1.55;
  color: var(--ink);
  opacity: 0.92;
  max-width: 56ch;
  margin-bottom: var(--space-6);
}
.hero__sub b { font-weight: 500; color: var(--gold); }
.hero__creds {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.08em;
  color: var(--gold-2);
  text-transform: uppercase;
}
.hero__creds div { display: flex; flex-direction: column; gap: 0.25em; }
.hero__creds b {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 2rem;
  letter-spacing: -0.01em;
  color: var(--gold);
  text-transform: none;
}
.hero__img {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid var(--rule);
}
.hero__img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(15%) contrast(1.05); }
```

- [ ] **Step 2: Write Hero.astro**

`src/components/Hero.astro`:
```astro
---
import { getEntry } from 'astro:content';
import '../styles/components/hero.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const hero = await getEntry('hero', lang);
if (!hero) throw new Error(`Missing hero content for ${lang}`);
const { Content } = await hero.render();
const { kicker, headlineLines, stats, image, imageAlt } = hero.data;
---
<section class="hero container" id="hero">
  <div class="hero__copy">
    <div class="hero__kicker reveal d1"><span class="star">★</span>{kicker}</div>
    <h1 class="hero__title reveal d2" data-split>
      {headlineLines.map((line) => (
        <span class="line">{line.emphasis ? <em>{line.text}</em> : line.text}</span>
      ))}
    </h1>
    <p class="hero__sub reveal d3"><Content /></p>
    <div class="hero__creds reveal d4">
      {stats.map((s) => (
        <div>
          <b data-count={s.count ?? ''} data-suffix={s.suffix ?? ''}>{s.value}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  </div>
  <div class="hero__img reveal d2">
    <img src={image} alt={imageAlt} width="800" height="1000" />
  </div>
</section>
```

- [ ] **Step 3: Wire Hero into both pages**

`src/pages/de/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
---
<BaseLayout lang="de" title="Curt O. Schaller — Visitenkarte" description="Curt O. Schaller — Erfinder des ARRI TRINITY, Academy Award Preisträger.">
  <Hero lang="de" />
</BaseLayout>
```

Mirror for `en` with English meta.

- [ ] **Step 4: Verify in browser**

`pnpm dev`. Visit `/de/` — hero block visible with kicker, headline (italic gold "behind"), bio, stats, image. Verify same on `/en/`. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/styles/components/hero.css src/pages
git commit -m "feat: hero component with bilingual content"
```

---

## Task 9: Topbar component (mark only, toggle and ticker come next)

**Files:**
- Create: `src/components/Topbar.astro`, `src/styles/components/topbar.css`

- [ ] **Step 1: Write topbar.css**

`src/styles/components/topbar.css`:
```css
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--pad-x-mobile);
  background: color-mix(in oklab, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
}
.topbar__mark {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  color: var(--ink);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.topbar__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 0 var(--gold);
  animation: pulse 2.4s var(--ease-out) infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(200, 165, 88, 0.55); }
  70% { box-shadow: 0 0 0 14px rgba(200, 165, 88, 0); }
  100% { box-shadow: 0 0 0 0 rgba(200, 165, 88, 0); }
}
```

- [ ] **Step 2: Write Topbar.astro**

`src/components/Topbar.astro`:
```astro
---
import '../styles/components/topbar.css';
---
<header class="topbar">
  <div class="topbar__mark">
    <span class="topbar__dot" aria-hidden="true"></span>
    Curt O. Schaller
  </div>
  <slot name="ticker" />
  <slot name="toggle" />
</header>
```

- [ ] **Step 3: Wire Topbar into both pages above Hero**

Insert `<Topbar />` immediately inside `<BaseLayout>` in both `de/index.astro` and `en/index.astro`.

- [ ] **Step 4: Verify**

`pnpm dev`. Topbar visible at top, pulse-dot animating, sticky on scroll. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Topbar.astro src/styles/components/topbar.css src/pages
git commit -m "feat: topbar with sticky mark and pulse dot"
```

---

## Task 10: LanguageToggle component + script

**Files:**
- Create: `src/components/LanguageToggle.astro`, `src/styles/components/language-toggle.css`, `src/scripts/languageToggle.ts`

- [ ] **Step 1: Write language-toggle.css**

`src/styles/components/language-toggle.css`:
```css
.lang-toggle {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.lang-toggle a {
  color: var(--mute);
  padding: 0.25em 0.5em;
  border-radius: 2px;
  transition: color var(--dur-fast) var(--ease-out);
}
.lang-toggle a:hover { color: var(--ink); }
.lang-toggle a.active { color: var(--gold); font-weight: 500; }
.lang-toggle__sep { color: var(--rule); }
```

- [ ] **Step 2: Write LanguageToggle.astro**

`src/components/LanguageToggle.astro`:
```astro
---
import '../styles/components/language-toggle.css';

interface Props { current: 'de' | 'en' }
const { current } = Astro.props;
const path = Astro.url.pathname;
const stripped = path.replace(/^\/(de|en)/, '') || '/';
const dePath = `/de${stripped === '/' ? '' : stripped}`;
const enPath = `/en${stripped === '/' ? '' : stripped}`;
---
<nav class="lang-toggle" aria-label="Language">
  <a href={dePath} class={current === 'de' ? 'active' : ''} data-lang="de" data-preserve-hash>DE</a>
  <span class="lang-toggle__sep">·</span>
  <a href={enPath} class={current === 'en' ? 'active' : ''} data-lang="en" data-preserve-hash>EN</a>
</nav>
<script>
  import '../scripts/languageToggle.ts';
</script>
```

- [ ] **Step 3: Write languageToggle.ts**

`src/scripts/languageToggle.ts`:
```ts
const STORAGE_KEY = 'cos.lang';

function persistAndNavigate(link: HTMLAnchorElement) {
  const lang = link.dataset.lang;
  if (!lang) return;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  const hash = window.location.hash;
  if (hash && link.dataset.preserveHash !== undefined) {
    link.setAttribute('href', link.getAttribute('href')! + hash);
  }
}

document.querySelectorAll<HTMLAnchorElement>('.lang-toggle a').forEach((a) => {
  a.addEventListener('click', () => persistAndNavigate(a));
});

// Auto-redirect from `/` based on stored preference is handled server-side in /index.astro;
// nothing to do here on subpages.
```

- [ ] **Step 4: Wire toggle into Topbar slot**

In both `de/index.astro` and `en/index.astro`, change Topbar usage to:
```astro
<Topbar>
  <LanguageToggle slot="toggle" current="de" />
</Topbar>
```
(`current="en"` in the EN page.)

- [ ] **Step 5: Verify**

`pnpm dev`. `/de/` shows DE active gold, EN grey. Click EN → navigates to `/en/`, gold flips. Refresh page — language toggle still works. Verify localStorage:
```js
// In browser console
localStorage.getItem('cos.lang')
```
Expected: `"en"` after click. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/LanguageToggle.astro src/styles/components/language-toggle.css src/scripts/languageToggle.ts src/pages
git commit -m "feat: language toggle with localStorage persistence"
```

---

## Task 11: Ticker component

**Files:**
- Create: `src/components/Ticker.astro`, `src/styles/components/ticker.css`

- [ ] **Step 1: Write ticker.css**

`src/styles/components/ticker.css`:
```css
.ticker {
  flex: 1;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
}
.ticker__track {
  display: inline-flex;
  gap: 1.5em;
  white-space: nowrap;
  animation: ticker-scroll 48s linear infinite;
  color: var(--gold-2);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.ticker__track span:nth-child(even) { color: var(--rule); }
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .ticker__track { animation: none; }
}
```

- [ ] **Step 2: Write Ticker.astro**

`src/components/Ticker.astro`:
```astro
---
import '../styles/components/ticker.css';

interface Props { items: string[] }
const { items } = Astro.props;
const doubled = [...items, ...items];
---
<div class="ticker" aria-hidden="true">
  <div class="ticker__track">
    {doubled.map((text, i) => (
      <Fragment>
        <span>{text}</span>
        {i < doubled.length - 1 && <span>·</span>}
      </Fragment>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Wire Ticker into DE page**

`src/pages/de/index.astro`:
```astro
<Topbar>
  <Ticker slot="ticker" items={["Personal Card", "MMXXV", "curt@cos-cam.com", "München — Worldwide", "ARRI TRINITY 2", "Academy Award 2025"]} />
  <LanguageToggle slot="toggle" current="de" />
</Topbar>
```

Mirror EN with English equivalents (`"Munich — Worldwide"`).

- [ ] **Step 4: Verify**

`pnpm dev`. Ticker scrolls smoothly, fades at edges. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Ticker.astro src/styles/components/ticker.css src/pages
git commit -m "feat: animated topbar ticker"
```

---

## Task 12: Section wrapper with sticky number

**Files:**
- Create: `src/components/Section.astro`, `src/styles/components/section.css`

- [ ] **Step 1: Write section.css**

`src/styles/components/section.css`:
```css
.section {
  position: relative;
  padding: var(--space-16) 0;
  border-top: 1px solid var(--rule);
}
.section--alt { background: var(--bg-2); }
.section__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}
@media (min-width: 900px) {
  .section__inner { grid-template-columns: 200px 1fr; }
}
.section__rail {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-2);
  position: sticky;
  top: calc(var(--space-8));
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.section__num { font-size: 1.1rem; color: var(--gold); font-weight: 500; }
.section__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: var(--fs-section);
  line-height: 1.05;
  color: var(--ink);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-6);
}
.section__title em { color: var(--gold); font-style: italic; }
```

- [ ] **Step 2: Write Section.astro**

`src/components/Section.astro`:
```astro
---
import '../styles/components/section.css';

interface Props {
  id: string;
  num: string;
  label: string;
  title: string;
  alt?: boolean;
}
const { id, num, label, title, alt = false } = Astro.props;
---
<section class:list={['section', alt && 'section--alt']} id={id}>
  <div class="container section__inner">
    <aside class="section__rail reveal">
      <span class="section__num">{num}</span>
      <span>{label}</span>
    </aside>
    <div class="section__body">
      <h2 class="section__title reveal" set:html={title} />
      <slot />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Section.astro src/styles/components/section.css
git commit -m "feat: section wrapper with sticky number rail"
```

---

## Task 13: About section (content + component)

**Files:**
- Create: `src/content/about/de.md`, `src/content/about/en.md`, `src/components/About.astro`, `src/styles/components/about.css`

- [ ] **Step 1: Write about/de.md**

`src/content/about/de.md`:
```markdown
---
lang: de
title: "Eine Karriere <em>in Bewegung.</em>"
timeline:
  - { year: "1964", label: "Geboren in München" }
  - { year: "ab 1990", label: "Steadicam Operator, internationale Produktionen" }
  - { year: "2014", label: "TRINITY 1 — Konzept & Entwicklung mit ARRI" }
  - { year: "2024", label: "TRINITY 2 — Markteinführung" }
  - { year: "2025", label: "Academy Sci-Tech Award" }
---

Curt O. Schaller arbeitet seit über drei Jahrzehnten als Steadicam-Operator auf internationalen Produktionen. Sein technisches Interesse an der Mechanik der Kamerabewegung führte zur Entwicklung neuer Stabilisierungssysteme — zunächst als Modifikationen am Set, später in enger Zusammenarbeit mit ARRI als marktreife Produkte.

Das TRINITY-System verbindet aktive Gimbal-Stabilisierung mit klassischer Steadicam-Mechanik und erlaubt Bewegungen, die zuvor nur mit deutlich aufwendigeren Setups möglich waren. Mit TRINITY 2 — dem 2024 vorgestellten Nachfolger — wurde der Funktionsumfang erweitert und das Gewicht reduziert.

2025 erhielt Schaller für Konzept, Design und Entwicklung des TRINITY 2 den Academy Scientific and Engineering Award. Er lebt in München und arbeitet weltweit.

<!-- SOURCE: ARRI press releases TRINITY 1 (2014) and TRINITY 2 (2024); AMPAS citation 2025. VERIFY: with Curt before launch. -->
```

- [ ] **Step 2: Write about/en.md**

`src/content/about/en.md`:
```markdown
---
lang: en
title: "A career <em>in motion.</em>"
timeline:
  - { year: "1964", label: "Born in Munich" }
  - { year: "from 1990", label: "Steadicam operator, international productions" }
  - { year: "2014", label: "TRINITY 1 — concept and development with ARRI" }
  - { year: "2024", label: "TRINITY 2 — launch" }
  - { year: "2025", label: "Academy Sci-Tech Award" }
---

Curt O. Schaller has worked as a Steadicam operator on international productions for over three decades. His technical interest in the mechanics of camera motion led him to develop new stabilization systems — first as on-set modifications, later as production-ready products in close cooperation with ARRI.

The TRINITY system combines active gimbal stabilization with classical Steadicam mechanics, enabling movements previously possible only with much larger setups. TRINITY 2, introduced in 2024, expanded the feature set while reducing weight.

In 2025, Schaller received the Academy Scientific and Engineering Award for the concept, design, and development of TRINITY 2. He is based in Munich and works worldwide.

<!-- SOURCE: ARRI press releases TRINITY 1 (2014) and TRINITY 2 (2024); AMPAS citation 2025. VERIFY: with Curt before launch. -->
```

- [ ] **Step 3: Write about.css**

`src/styles/components/about.css`:
```css
.about__body { display: flex; flex-direction: column; gap: var(--space-4); max-width: 64ch; }
.about__body p { font-size: 1.0625rem; line-height: 1.65; color: var(--ink); opacity: 0.92; }
.about__timeline {
  margin-top: var(--space-8);
  display: grid;
  gap: 0;
  border-top: 1px solid var(--rule);
}
.about__timeline li {
  display: grid;
  grid-template-columns: 160px 1fr;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.about__timeline .year { color: var(--gold); }
.about__timeline .label { color: var(--ink); opacity: 0.85; }
```

- [ ] **Step 4: Write About.astro**

`src/components/About.astro`:
```astro
---
import { getEntry } from 'astro:content';
import Section from './Section.astro';
import '../styles/components/about.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const about = await getEntry('about', lang);
if (!about) throw new Error(`Missing about content for ${lang}`);
const { Content } = await about.render();
const { title, timeline } = about.data;
const labels = { de: { num: '01', label: 'About' }, en: { num: '01', label: 'About' } };
---
<Section id="about" num={labels[lang].num} label={labels[lang].label} title={title}>
  <div class="about__body reveal"><Content /></div>
  <ul class="about__timeline reveal">
    {timeline.map((t) => (
      <li><span class="year">{t.year}</span><span class="label">{t.label}</span></li>
    ))}
  </ul>
</Section>
```

- [ ] **Step 5: Wire About into both pages**

Add `<About lang="de" />` after `<Hero>` in DE page, similar for EN.

- [ ] **Step 6: Verify**

`pnpm dev`. Scroll to About section — title, body paragraphs, timeline list with gold years all render correctly in both languages. Stop.

- [ ] **Step 7: Commit**

```bash
git add src/content/about src/components/About.astro src/styles/components/about.css src/pages
git commit -m "feat: about section with timeline DE and EN"
```

---

## Task 14: Inventions section

**Files:**
- Create: `src/content/inventions/de.json`, `.../en.json`, `src/components/Inventions.astro`, `src/styles/components/inventions.css`

`type: 'data'` collections require JSON or YAML, not Markdown.

- [ ] **Step 1: Write inventions/de.json**

`src/content/inventions/de.json`:
```json
{
  "lang": "de",
  "title": "Erfindungen & <em>Entwicklung.</em>",
  "entries": [
    {
      "name": "TRINITY 1",
      "year": 2014,
      "principle": "Erstes Hybrid-System aus aktiver Gimbal-Stabilisierung und klassischer Steadicam-Mechanik. Ermöglicht stufenlos Bewegungen aus jeder Kameraposition — vom Boden bis über Kopf — ohne Setupwechsel.",
      "patents": [],
      "award": ""
    },
    {
      "name": "TRINITY 2",
      "year": 2024,
      "principle": "Nachfolger-Generation mit reduziertem Gewicht, erweiterten Stabilisierungs-Modi und überarbeiteter Bedienlogik. Konzept, Design und Entwicklung von Curt O. Schaller in Zusammenarbeit mit ARRI.",
      "patents": [],
      "award": "Academy Scientific and Engineering Award 2025"
    }
  ]
}
```

- [ ] **Step 2: Write inventions/en.json**

`src/content/inventions/en.json`:
```json
{
  "lang": "en",
  "title": "Inventions & <em>development.</em>",
  "entries": [
    {
      "name": "TRINITY 1",
      "year": 2014,
      "principle": "The first hybrid system combining active gimbal stabilization with classical Steadicam mechanics. Enables continuous camera movement from any position — floor to overhead — without setup changes.",
      "patents": [],
      "award": ""
    },
    {
      "name": "TRINITY 2",
      "year": 2024,
      "principle": "Next-generation successor with reduced weight, expanded stabilization modes, and refined operating logic. Concept, design, and development by Curt O. Schaller in cooperation with ARRI.",
      "patents": [],
      "award": "Academy Scientific and Engineering Award 2025"
    }
  ]
}
```

- [ ] **Step 3: Write inventions.css**

`src/styles/components/inventions.css`:
```css
.inventions { display: grid; gap: var(--space-6); }
.invention {
  border-top: 1px solid var(--rule);
  padding-top: var(--space-4);
  display: grid;
  gap: var(--space-2);
}
.invention__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
}
.invention__name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 2rem;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.invention__year {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.18em;
  color: var(--gold);
}
.invention__principle {
  font-size: 1.0625rem;
  line-height: 1.6;
  max-width: 60ch;
  color: var(--ink);
  opacity: 0.92;
}
.invention__award {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.5em;
}
.invention__award::before { content: "★"; }
```

- [ ] **Step 4: Write Inventions.astro**

`src/components/Inventions.astro`:
```astro
---
import { getEntry } from 'astro:content';
import Section from './Section.astro';
import '../styles/components/inventions.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const inv = await getEntry('inventions', lang);
if (!inv) throw new Error(`Missing inventions content for ${lang}`);
const { title, entries } = inv.data;
---
<Section id="inventions" num="02" label="Inventions" title={title} alt>
  <div class="inventions">
    {entries.map((e) => (
      <article class="invention reveal">
        <header class="invention__head">
          <h3 class="invention__name">{e.name}</h3>
          <span class="invention__year">{e.year}</span>
        </header>
        <p class="invention__principle">{e.principle}</p>
        {e.award && <span class="invention__award">{e.award}</span>}
      </article>
    ))}
  </div>
</Section>
```

- [ ] **Step 5: Wire and verify**

Add `<Inventions lang="de" />` (and EN) after `<About>` in both pages. `pnpm dev`, verify rendering, stop.

- [ ] **Step 6: Commit**

```bash
git add src/content/inventions src/components/Inventions.astro src/styles/components/inventions.css src/pages
git commit -m "feat: inventions section with TRINITY 1 and 2"
```

---

## Task 15: Awards section

**Files:**
- Create: `src/content/awards/de.json`, `.../en.json`, `src/components/Awards.astro`, `src/styles/components/awards.css`

- [ ] **Step 1: Write awards/de.json**

`src/content/awards/de.json`:
```json
{
  "lang": "de",
  "title": "Auszeichnungen & <em>Anerkennung.</em>",
  "entries": [
    {
      "year": 2025,
      "title": "Academy Scientific and Engineering Award",
      "body": "Verliehen von der Academy of Motion Picture Arts and Sciences für die Konzeption, das Design und die Entwicklung des TRINITY 2 Camera Stabilizer Systems.",
      "source": "AMPAS Sci-Tech Awards 2025"
    }
  ]
}
```

- [ ] **Step 2: Write awards/en.json**

`src/content/awards/en.json`:
```json
{
  "lang": "en",
  "title": "Awards & <em>recognition.</em>",
  "entries": [
    {
      "year": 2025,
      "title": "Academy Scientific and Engineering Award",
      "body": "Awarded by the Academy of Motion Picture Arts and Sciences for the concept, design, and development of the TRINITY 2 Camera Stabilizer System.",
      "source": "AMPAS Sci-Tech Awards 2025"
    }
  ]
}
```

> Additional awards: leave the entries array at one item for the launch. Add more after Curt's review. Each new entry follows the same shape.

- [ ] **Step 3: Write awards.css**

`src/styles/components/awards.css`:
```css
.awards { display: grid; gap: 0; }
.award {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--rule);
}
.award:first-child { border-top: 1px solid var(--rule); }
.award__year {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.18em;
  color: var(--gold);
}
.award__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 1.5rem;
  color: var(--ink);
  margin-bottom: 0.5em;
}
.award__body {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ink);
  opacity: 0.88;
  max-width: 64ch;
}
.award__source {
  display: block;
  margin-top: 0.5em;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-2);
}
```

- [ ] **Step 4: Write Awards.astro**

`src/components/Awards.astro`:
```astro
---
import { getEntry } from 'astro:content';
import Section from './Section.astro';
import '../styles/components/awards.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const a = await getEntry('awards', lang);
if (!a) throw new Error(`Missing awards content for ${lang}`);
const { title, entries } = a.data;
---
<Section id="awards" num="03" label="Awards" title={title}>
  <div class="awards">
    {entries.map((e) => (
      <div class="award reveal">
        <span class="award__year">{e.year}</span>
        <div>
          <div class="award__title">{e.title}</div>
          <p class="award__body">{e.body}</p>
          {e.source && <span class="award__source">{e.source}</span>}
        </div>
      </div>
    ))}
  </div>
</Section>
```

- [ ] **Step 5: Wire and verify**

Add `<Awards lang="…" />` after `<Inventions>` in both pages. `pnpm dev`, scroll, verify, stop.

- [ ] **Step 6: Commit**

```bash
git add src/content/awards src/components/Awards.astro src/styles/components/awards.css src/pages
git commit -m "feat: awards section"
```

---

## Task 16: Filmography section

**Files:**
- Create: `src/content/filmography/de.json`, `.../en.json`, `src/components/Filmography.astro`, `src/styles/components/filmography.css`

- [ ] **Step 1: Draft filmography/de.json (placeholders, marked VERIFY)**

`src/content/filmography/de.json`:
```json
{
  "lang": "de",
  "title": "Ausgewählte <em>Arbeiten.</em>",
  "entries": [
    { "year": 2024, "title": "[Film Title]", "director": "[Director]", "role": "Operator", "note": "VERIFY" },
    { "year": 2022, "title": "[Film Title]", "director": "[Director]", "role": "Operator", "note": "VERIFY" },
    { "year": 2020, "title": "[Film Title]", "director": "[Director]", "role": "Operator", "note": "VERIFY" }
  ]
}
```

> The plan ships with placeholders flagged `VERIFY`. The executing agent must, before commit, replace the three entries with real picks from IMDb / public sources (10-15 entries target). If unable to verify, keep placeholders and surface to user for Curt's input.

- [ ] **Step 2: Draft filmography/en.json (mirror DE; titles stay original where applicable)**

Same shape, English `role` enum. Mirror placeholders.

- [ ] **Step 3: Write filmography.css**

`src/styles/components/filmography.css`:
```css
.films { display: grid; gap: 0; border-top: 1px solid var(--rule); }
.film {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 120px;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: background var(--dur-fast) var(--ease-out);
}
.film:hover { background: rgba(200, 165, 88, 0.04); }
.film__year { color: var(--gold); }
.film__title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.125rem;
  letter-spacing: 0;
  text-transform: none;
  color: var(--ink);
}
.film__director { color: var(--ink); opacity: 0.7; }
.film__role { color: var(--gold-2); text-align: right; }
@media (max-width: 760px) {
  .film { grid-template-columns: 60px 1fr; }
  .film__director, .film__role { grid-column: 2; }
}
```

- [ ] **Step 4: Write Filmography.astro**

`src/components/Filmography.astro`:
```astro
---
import { getEntry } from 'astro:content';
import Section from './Section.astro';
import '../styles/components/filmography.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const f = await getEntry('filmography', lang);
if (!f) throw new Error(`Missing filmography content for ${lang}`);
const { title, entries } = f.data;
const sorted = [...entries].sort((a, b) => b.year - a.year);
---
<Section id="filmography" num="04" label="Selected Works" title={title} alt>
  <div class="films">
    {sorted.map((e) => (
      <div class="film reveal">
        <span class="film__year">{e.year}</span>
        <span class="film__title">{e.title}</span>
        <span class="film__director">{e.director}</span>
        <span class="film__role">{e.role}</span>
      </div>
    ))}
  </div>
</Section>
```

- [ ] **Step 5: Wire and verify**

Add to both pages. `pnpm dev`, verify table renders + hover highlight works, stop.

- [ ] **Step 6: Commit**

```bash
git add src/content/filmography src/components/Filmography.astro src/styles/components/filmography.css src/pages
git commit -m "feat: filmography section (placeholders flagged VERIFY)"
```

---

## Task 17: Workshops section

**Files:**
- Create: `src/content/workshops/de.md`, `src/content/workshops/en.md`, `src/components/Workshops.astro`, `src/styles/components/workshops.css`

- [ ] **Step 1: Write workshops/de.md**

`src/content/workshops/de.md`:
```markdown
---
lang: de
title: "Workshops & <em>Lehre.</em>"
---

Curt gibt regelmäßig Workshops und Trainings für professionelle Steadicam- und Stabilizer-Operator. Inhalte reichen von Setup-Grundlagen über fortgeschrittene TRINITY-Anwendung bis zu Set-spezifischen Problemlösungen.

Zielgruppe: aktive Operator, Kameraassistenz, DOPs mit eigenem Operating-Anspruch. Format: mehrtägige Einzel- oder Kleingruppen-Trainings, vor Ort oder bei ARRI München.

<!-- VERIFY: aktuelle Format-Beschreibung, Termine, Preise — mit Curt klären. -->

Anfragen direkt an `curt@cos-cam.com`.
```

- [ ] **Step 2: Write workshops/en.md (mirror)**

- [ ] **Step 3: Write workshops.css**

`src/styles/components/workshops.css`:
```css
.workshops__body { max-width: 60ch; }
.workshops__body p { font-size: 1.0625rem; line-height: 1.65; margin-bottom: var(--space-3); color: var(--ink); opacity: 0.92; }
.workshops__body p:last-child {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.08em;
  color: var(--gold);
  text-transform: uppercase;
}
.workshops__body code {
  font-family: var(--font-mono);
  background: rgba(200, 165, 88, 0.08);
  padding: 0.1em 0.4em;
  border-radius: 2px;
  color: var(--gold);
}
```

- [ ] **Step 4: Write Workshops.astro**

`src/components/Workshops.astro`:
```astro
---
import { getEntry } from 'astro:content';
import Section from './Section.astro';
import '../styles/components/workshops.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const w = await getEntry('workshops', lang);
if (!w) throw new Error(`Missing workshops content for ${lang}`);
const { Content } = await w.render();
const { title } = w.data;
---
<Section id="workshops" num="05" label="Workshops" title={title}>
  <div class="workshops__body reveal"><Content /></div>
</Section>
```

- [ ] **Step 5: Wire and verify**

Add to both pages, verify rendering, stop server.

- [ ] **Step 6: Commit**

```bash
git add src/content/workshops src/components/Workshops.astro src/styles/components/workshops.css src/pages
git commit -m "feat: workshops section"
```

---

## Task 18: Contact section

**Files:**
- Create: `src/content/contact/de.json`, `.../en.json`, `src/components/Contact.astro`, `src/styles/components/contact.css`

- [ ] **Step 1: Write contact/de.json**

`src/content/contact/de.json`:
```json
{
  "lang": "de",
  "title": "Kontakt & <em>Anfragen.</em>",
  "email": "curt@cos-cam.com",
  "location": "München — Worldwide",
  "links": [
    { "label": "IMDb", "href": "https://www.imdb.com/name/nm0769952/" }
  ]
}
```

> The IMDb URL is a placeholder template; the executing agent must verify the actual nm-ID matches Curt's IMDb page before commit. If unverifiable, leave the `links` array empty and surface to user.

- [ ] **Step 2: Write contact/en.json (mirror)**

- [ ] **Step 3: Write contact.css**

`src/styles/components/contact.css`:
```css
.contact { display: grid; gap: var(--space-4); }
.contact__email {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--gold);
  text-decoration: none;
  display: inline-block;
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur-fast) var(--ease-out);
}
.contact__email:hover { border-bottom-color: var(--gold); }
.contact__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-2);
}
.contact__meta a { color: var(--gold-2); border-bottom: 1px solid var(--rule); }
.contact__meta a:hover { color: var(--ink); }
```

- [ ] **Step 4: Write Contact.astro**

`src/components/Contact.astro`:
```astro
---
import { getEntry } from 'astro:content';
import Section from './Section.astro';
import '../styles/components/contact.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const c = await getEntry('contact', lang);
if (!c) throw new Error(`Missing contact content for ${lang}`);
const { title, email, location, links } = c.data;
---
<Section id="contact" num="06" label="Contact" title={title} alt>
  <div class="contact reveal">
    <a class="contact__email" href={`mailto:${email}`}>{email}</a>
    <div class="contact__meta">
      <span>{location}</span>
      {links.map((l) => <a href={l.href} rel="noopener noreferrer" target="_blank">{l.label}</a>)}
    </div>
  </div>
</Section>
```

- [ ] **Step 5: Wire and verify**

Add to both pages, verify, stop.

- [ ] **Step 6: Commit**

```bash
git add src/content/contact src/components/Contact.astro src/styles/components/contact.css src/pages
git commit -m "feat: contact section"
```

---

## Task 19: Footer

**Files:**
- Create: `src/components/Footer.astro`, `src/styles/components/footer.css`

- [ ] **Step 1: Write footer.css**

`src/styles/components/footer.css`:
```css
.footer {
  border-top: 1px solid var(--rule);
  padding: var(--space-6) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--mute);
}
.footer__inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-3); }
.footer__links { display: flex; gap: var(--space-3); }
.footer__links a { color: var(--mute); }
.footer__links a:hover { color: var(--ink); }
```

- [ ] **Step 2: Write Footer.astro**

`src/components/Footer.astro`:
```astro
---
import '../styles/components/footer.css';

interface Props { lang: 'de' | 'en' }
const { lang } = Astro.props;
const labels = {
  de: { impressum: 'Impressum', privacy: 'Datenschutz' },
  en: { impressum: 'Imprint', privacy: 'Privacy' },
};
const l = labels[lang];
---
<footer class="footer">
  <div class="container footer__inner">
    <span>© Curt O. Schaller — MMXXV</span>
    <nav class="footer__links">
      <a href="/impressum">{l.impressum}</a>
      <a href="/datenschutz">{l.privacy}</a>
    </nav>
  </div>
</footer>
```

- [ ] **Step 3: Wire and commit**

Add `<Footer lang="..." />` at bottom of both pages.

```bash
git add src/components/Footer.astro src/styles/components/footer.css src/pages
git commit -m "feat: footer with legal links"
```

---

## Task 20: Final page assembly + ordering pass

**Files:** modify `src/pages/de/index.astro`, `src/pages/en/index.astro`

- [ ] **Step 1: Final DE page**

`src/pages/de/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Topbar from '../../components/Topbar.astro';
import Ticker from '../../components/Ticker.astro';
import LanguageToggle from '../../components/LanguageToggle.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Inventions from '../../components/Inventions.astro';
import Awards from '../../components/Awards.astro';
import Filmography from '../../components/Filmography.astro';
import Workshops from '../../components/Workshops.astro';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';
---
<BaseLayout lang="de" title="Curt O. Schaller — Visitenkarte" description="Curt O. Schaller — Erfinder des ARRI TRINITY 2, Academy Award Preisträger Sci-Tech 2025. Steadicam Operator, Workshops, R&D.">
  <Topbar>
    <Ticker slot="ticker" items={["Personal Card", "MMXXV", "curt@cos-cam.com", "München — Worldwide", "ARRI TRINITY 2", "Academy Award 2025"]} />
    <LanguageToggle slot="toggle" current="de" />
  </Topbar>
  <main>
    <Hero lang="de" />
    <About lang="de" />
    <Inventions lang="de" />
    <Awards lang="de" />
    <Filmography lang="de" />
    <Workshops lang="de" />
    <Contact lang="de" />
  </main>
  <Footer lang="de" />
</BaseLayout>
```

- [ ] **Step 2: Final EN page (mirror with English meta)**

- [ ] **Step 3: Verify both pages full-scroll**

`pnpm dev`. Walk both URLs top to bottom, all sections present and styled. Stop.

- [ ] **Step 4: Commit**

```bash
git add src/pages
git commit -m "feat: final page assembly DE and EN"
```

---

## Task 21: GSAP setup + reveal animations

**Files:**
- Create: `src/scripts/animations.ts`
- Modify: `src/layouts/BaseLayout.astro` to include the script

- [ ] **Step 1: Write animations.ts (reveals only)**

`src/scripts/animations.ts`:
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  initReveals();
}

function initReveals() {
  const elements = document.querySelectorAll<HTMLElement>('.reveal');
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });
}
```

- [ ] **Step 2: Include script in BaseLayout**

Insert before `</body>` in `BaseLayout.astro`:
```astro
<script>
  import '../scripts/animations.ts';
</script>
```

- [ ] **Step 3: Add CSS fallback so .reveal stays visible without JS**

Append to `src/styles/base.css`:
```css
.reveal { opacity: 1; transform: none; }
@media (prefers-reduced-motion: no-preference) {
  html.js .reveal { opacity: 0; transform: translateY(30px); }
}
```

In `BaseLayout.astro`, add early inline script in `<head>`:
```astro
<script is:inline>document.documentElement.classList.add('js');</script>
```

- [ ] **Step 4: Verify**

`pnpm dev`. Scroll through page — elements fade and rise into view as they enter viewport. Toggle OS reduced-motion (macOS: Settings → Accessibility → Display → Reduce motion). Reload — content visible without animation. Stop.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/animations.ts src/layouts/BaseLayout.astro src/styles/base.css
git commit -m "feat: GSAP reveal animations with reduced-motion fallback"
```

---

## Task 22: Headline split animation

**Files:** modify `src/scripts/animations.ts`

- [ ] **Step 1: Add split-headline function**

In `animations.ts`, append before the `if (!prefersReduced)` block:
```ts
function initHeadlineSplit() {
  const headline = document.querySelector<HTMLElement>('[data-split]');
  if (!headline) return;
  const lines = headline.querySelectorAll<HTMLElement>('.line');
  gsap.fromTo(
    lines,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.15 }
  );
}
```

Add to the conditional block:
```ts
if (!prefersReduced) {
  initReveals();
  initHeadlineSplit();
}
```

- [ ] **Step 2: Verify**

`pnpm dev`. Load `/de/` — headline lines drop in staggered after page load. Stop.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/animations.ts
git commit -m "feat: headline split-line animation"
```

---

## Task 23: Counter-up animation

**Files:** modify `src/scripts/animations.ts`

- [ ] **Step 1: Add counter function**

In `animations.ts`:
```ts
function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  counters.forEach((el) => {
    const target = parseInt(el.dataset.count || '0', 10);
    if (!target) return;
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
    });
  });
}
```

Add to conditional:
```ts
if (!prefersReduced) {
  initReveals();
  initHeadlineSplit();
  initCounters();
}
```

- [ ] **Step 2: Verify**

Scroll to Hero stats. "30+" counts up from 0 to 30. "1964" and "2025" stay static (no `data-count`). Stop.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/animations.ts
git commit -m "feat: counter-up animation for hero stats"
```

---

## Task 24: Spotlight cursor effect

**Files:**
- Create: `src/scripts/spotlight.ts`
- Modify: `src/components/Hero.astro` (add wrapper class), `src/styles/components/hero.css`

- [ ] **Step 1: Write spotlight.ts**

`src/scripts/spotlight.ts`:
```ts
const hero = document.querySelector<HTMLElement>('.hero');
if (hero) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mx', `${x}%`);
      hero.style.setProperty('--my', `${y}%`);
    });
  }
}
```

- [ ] **Step 2: Add spotlight CSS to hero.css**

Append:
```css
.hero {
  --mx: 50%;
  --my: 30%;
}
.hero::before {
  content: "";
  position: absolute;
  inset: -10%;
  pointer-events: none;
  background: radial-gradient(circle at var(--mx) var(--my), rgba(200, 165, 88, 0.10), transparent 35%);
  transition: background-position var(--dur-fast) linear;
  z-index: 0;
}
.hero > * { position: relative; z-index: 1; }
```

- [ ] **Step 3: Include script in BaseLayout**

Add another `<script>` block:
```astro
<script>
  import '../scripts/spotlight.ts';
</script>
```

- [ ] **Step 4: Verify**

`pnpm dev`. Move cursor over Hero — soft gold glow follows. Stop.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/spotlight.ts src/styles/components/hero.css src/layouts/BaseLayout.astro
git commit -m "feat: cursor-following spotlight in hero"
```

---

## Task 25: Root redirect (/) with Accept-Language

**Files:** modify `src/pages/index.astro`

- [ ] **Step 1: Replace placeholder with redirect**

`src/pages/index.astro`:
```astro
---
const accept = Astro.request.headers.get('accept-language') || '';
const prefersEn = /^en/i.test(accept) && !/^de/i.test(accept);
return Astro.redirect(prefersEn ? '/en/' : '/de/');
---
```

- [ ] **Step 2: Verify**

`pnpm dev`. Visit `http://localhost:4321/` — redirects to `/de/` (your browser locale). Test with curl:
```bash
curl -I -H "Accept-Language: en-US" http://localhost:4321/
```
Expected: `Location: /en/`. Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: root redirect honors Accept-Language"
```

---

## Task 26: SEO sitemap + robots.txt

**Files:**
- Modify: `astro.config.mjs`
- Create: `public/robots.txt`

- [ ] **Step 1: Install sitemap integration**

```bash
pnpm add @astrojs/sitemap
```

- [ ] **Step 2: Update astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com', // replace with real domain at deploy
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [sitemap({
    i18n: { defaultLocale: 'de', locales: { de: 'de', en: 'en' } },
  })],
});
```

- [ ] **Step 3: Write robots.txt**

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap-index.xml
```

- [ ] **Step 4: Build and verify**

```bash
pnpm build
ls dist/sitemap-*.xml
```
Expected: at least one `sitemap-*.xml` exists with `/de/` and `/en/` entries.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs public/robots.txt package.json
git commit -m "feat: sitemap and robots.txt"
```

---

## Task 27: Impressum + Datenschutz pages

**Files:**
- Create: `src/pages/impressum.astro`, `src/pages/datenschutz.astro`
- Create: `src/styles/components/legal.css`

- [ ] **Step 1: Write legal.css**

`src/styles/components/legal.css`:
```css
.legal {
  max-width: 70ch;
  padding: var(--space-12) var(--pad-x-mobile);
  margin: 0 auto;
}
.legal h1 {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: var(--fs-section);
  margin-bottom: var(--space-4);
  color: var(--ink);
}
.legal h2 {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  margin: var(--space-4) 0 var(--space-2);
}
.legal p { margin-bottom: var(--space-3); line-height: 1.6; color: var(--ink); opacity: 0.9; }
.legal a { color: var(--gold); border-bottom: 1px solid var(--rule); }
```

- [ ] **Step 2: Write impressum.astro**

`src/pages/impressum.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Topbar from '../components/Topbar.astro';
import Footer from '../components/Footer.astro';
import '../styles/components/legal.css';
---
<BaseLayout lang="de" title="Impressum — Curt O. Schaller" description="Impressum / Imprint">
  <Topbar />
  <main class="legal">
    <h1>Impressum</h1>
    <h2>Angaben gemäß § 5 TMG</h2>
    <p>
      Curt O. Schaller<br>
      [Straße + Hausnummer]<br>
      [PLZ Ort]<br>
      Deutschland
    </p>
    <h2>Kontakt</h2>
    <p>E-Mail: <a href="mailto:curt@cos-cam.com">curt@cos-cam.com</a></p>
    <h2>Verantwortlich für den Inhalt</h2>
    <p>Curt O. Schaller (Anschrift wie oben)</p>
    <h2>Haftungsausschluss</h2>
    <p>Inhalte dieser Seite wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann keine Gewähr übernommen werden.</p>
  </main>
  <Footer lang="de" />
</BaseLayout>
```

> `[Straße + Hausnummer]` and `[PLZ Ort]` placeholders MUST be filled with Curt's actual business address before launch. Flagged as launch-blocker.

- [ ] **Step 3: Write datenschutz.astro**

`src/pages/datenschutz.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Topbar from '../components/Topbar.astro';
import Footer from '../components/Footer.astro';
import '../styles/components/legal.css';
---
<BaseLayout lang="de" title="Datenschutz — Curt O. Schaller" description="Datenschutzerklärung">
  <Topbar />
  <main class="legal">
    <h1>Datenschutzerklärung</h1>
    <h2>1. Allgemeines</h2>
    <p>Diese Website verarbeitet keine personenbezogenen Daten über das hinaus, was technisch zum Auslieferung der Seite notwendig ist. Es kommen keine Cookies, kein Tracking und keine Analytics zum Einsatz.</p>
    <h2>2. Server-Logs</h2>
    <p>Der Hosting-Provider (Vercel) speichert technische Zugriffsdaten (IP-Adresse, Zeitpunkt, abgerufene Seite, Browser-Information) für maximal 24 Stunden zur Abwehr von Angriffen.</p>
    <h2>3. Kontakt per E-Mail</h2>
    <p>Wenn Sie uns per E-Mail kontaktieren, werden Ihre Daten zur Bearbeitung der Anfrage verarbeitet und nach Abschluss gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
    <h2>4. Ihre Rechte</h2>
    <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten. Anfragen an: <a href="mailto:curt@cos-cam.com">curt@cos-cam.com</a></p>
    <h2>5. Verantwortlicher</h2>
    <p>Curt O. Schaller, Anschrift siehe Impressum.</p>
  </main>
  <Footer lang="de" />
</BaseLayout>
```

> Standard German template, conservative. Curt may want a lawyer-vetted version before launch. Flagged.

- [ ] **Step 4: Verify**

`pnpm dev`. Visit `/impressum` and `/datenschutz`, verify rendering. Footer links work. Stop.

- [ ] **Step 5: Commit**

```bash
git add src/pages/impressum.astro src/pages/datenschutz.astro src/styles/components/legal.css
git commit -m "feat: impressum and datenschutz legal pages (templates, address pending)"
```

---

## Task 28: OG image

**Files:** Create `public/images/og-image.jpg`

- [ ] **Step 1: Generate OG image**

Approach: use the extracted `curt-hero.jpg` cropped to 1200x630 with a gold-text overlay. For first launch, simplest: copy the hero photo and resize.

```bash
# Requires `sips` (preinstalled on macOS) or ImageMagick
sips -z 630 1200 -c 630 1200 public/images/curt-hero.jpg --out public/images/og-image.jpg
```

Verify: `open public/images/og-image.jpg` — image is 1200×630.

If sips crops awkwardly, manually export from any image editor at 1200×630, save as `public/images/og-image.jpg`.

- [ ] **Step 2: Commit**

```bash
git add public/images/og-image.jpg
git commit -m "feat: OG image for social sharing"
```

---

## Task 29: Playwright e2e smoke tests

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
pnpm add -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Write playwright.config.ts**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4321/de/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
```

- [ ] **Step 3: Write smoke.spec.ts**

`tests/e2e/smoke.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

const SECTIONS = ['hero', 'about', 'inventions', 'awards', 'filmography', 'workshops', 'contact'];

for (const lang of ['de', 'en'] as const) {
  test(`${lang}: all sections render`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    for (const id of SECTIONS) {
      const el = page.locator(`#${id}`);
      await expect(el).toBeVisible();
    }
  });

  test(`${lang}: mailto link present`, async ({ page }) => {
    await page.goto(`/${lang}/`);
    const mailto = page.locator('a[href^="mailto:curt@"]');
    await expect(mailto).toBeVisible();
  });
}

test('language toggle switches and persists', async ({ page }) => {
  await page.goto('/de/');
  await page.locator('.lang-toggle a[data-lang="en"]').click();
  await expect(page).toHaveURL(/\/en\//);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('root redirects based on Accept-Language', async ({ request }) => {
  const r = await request.get('/', { headers: { 'Accept-Language': 'en-US' }, maxRedirects: 0 });
  expect(r.status()).toBe(302);
  expect(r.headers().location).toBe('/en/');
});

test('robots.txt served', async ({ request }) => {
  const r = await request.get('/robots.txt');
  expect(r.status()).toBe(200);
  expect(await r.text()).toContain('Sitemap');
});
```

Add to `package.json` scripts:
```json
"test:e2e": "playwright test"
```

- [ ] **Step 4: Run e2e tests**

```bash
pnpm test:e2e
```
Expected: all green. If any failing, fix the corresponding feature, re-run.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e package.json
git commit -m "test: playwright e2e smoke tests"
```

---

## Task 30: Vercel deploy config

**Files:** Create `vercel.json`

- [ ] **Step 1: Write vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "trailingSlash": true,
  "cleanUrls": true,
  "redirects": [
    { "source": "/index.html", "destination": "/", "permanent": true }
  ]
}
```

- [ ] **Step 2: Verify local build**

```bash
pnpm build
pnpm preview
```
Visit `http://localhost:4321/` — full site renders from production build. Stop.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat: Vercel deploy configuration"
```

- [ ] **Step 4: Push to GitHub (manual step, ask user)**

Stop and prompt user: "Repo ready to push. Create GitHub repo `curt-schaller-website` and run `git remote add origin <url> && git push -u origin main`. After push, link the repo in Vercel dashboard for auto-deploy. Confirm when done."

---

## Task 31: Lighthouse audit + acceptance verification

**Files:** none (verification only)

- [ ] **Step 1: Run Lighthouse on production preview**

```bash
pnpm build && pnpm preview &
sleep 3
npx lighthouse http://localhost:4321/de/ --preset=desktop --output=json --output-path=./lh-de.json --chrome-flags="--headless"
npx lighthouse http://localhost:4321/en/ --preset=desktop --output=json --output-path=./lh-en.json --chrome-flags="--headless"
```

- [ ] **Step 2: Check scores meet spec**

```bash
node -e "for (const f of ['lh-de.json','lh-en.json']) { const r=require('./'+f).categories; console.log(f, r.performance.score, r.accessibility.score, r['best-practices'].score, r.seo.score); }"
```
Expected per page: performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, seo ≥ 0.95.

If any score below threshold, fix specific failures listed in the JSON (often: missing alt text, low-contrast color, missing meta tags). Re-run Lighthouse.

- [ ] **Step 3: Verify acceptance criteria from spec section 10**

Manually confirm each:
1. `/de/` and `/en/` render all 6 content sections + hero + footer without console errors — open browser console, scroll through, look for red.
2. Language toggle works, `localStorage` persistence verified across reloads — toggle, reload, check `localStorage.getItem('cos.lang')`.
3. Animations 60fps — open DevTools Performance tab, scroll, check no long tasks > 50ms.
4. Lighthouse thresholds — already done in step 2.
5. Cross-browser — open in Safari, Chrome, Firefox. Then `xcrun simctl` for iOS Safari or actual device.
6. Vercel preview reachable — confirmed in Task 30 step 4.
7. Impressum + Datenschutz exist — visit both.
8. Content marked VERIFY — search:
```bash
grep -rn "VERIFY" src/content/
```
Surface list to user for Curt's review.

- [ ] **Step 4: Clean up lighthouse artifacts**

```bash
rm lh-de.json lh-en.json
```

- [ ] **Step 5: Final commit**

```bash
git commit --allow-empty -m "chore: acceptance verification complete"
```

- [ ] **Step 6: Hand off to user**

Report to user:
- Live preview URL (Vercel)
- List of items still marked `VERIFY` (filmography entries, IMDb link, workshops details)
- Impressum address + Datenschutz lawyer-review reminder
- Domain choice still pending

---

## Self-review

**Spec coverage check:**
- IA (spec §2): Tasks 8, 13–19, 20 — all 7 content sections covered
- Content drafting (§3): tasks 7, 13–18 include source comments and VERIFY flags
- i18n (§4): Tasks 2, 10, 25 — routing + toggle + Accept-Language redirect
- Visual system (§5): Tasks 4, 5 (tokens, base, fonts), 21–24 (animations)
- Project structure (§6): Tasks 1, 6 establish the layout
- Asset extraction (§7): Task 3 with unit tests
- Deployment (§8): Tasks 26, 30
- Acceptance criteria (§10): Tasks 29, 31

**Placeholder scan:** 3 intentional placeholders flagged with explicit VERIFY/launch-blocker callouts: filmography entries (Task 16), IMDb URL (Task 18), Impressum address (Task 27). These are surfaced to user in Task 31 hand-off. No accidental TBDs in step bodies.

**Type consistency:** Component prop signatures (`lang: 'de' | 'en'`) consistent across all section components. `getEntry(collectionName, lang)` pattern uniform.

**Known compromises:**
- Filmography placeholders need real entries before launch (Task 16 flags this; Task 31 surfaces it)
- Hero photo rights assumed from vorlage; Task 31 reminds user to confirm with Curt
- OG image is a simple crop; can be replaced with a designed one later (not launch-blocker)
