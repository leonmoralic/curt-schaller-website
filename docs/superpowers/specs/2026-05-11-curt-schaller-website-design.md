# Curt O. Schaller — Personal Website (Design Spec)

**Status:** Approved by user, awaiting written review
**Date:** 2026-05-11
**Owner:** Leon Moralic (build) · Curt O. Schaller (subject, content review)
**Source of truth for design:** `/Users/leonmoralic/Downloads/Curt O. Schaller - Standalone.html` (bundled React reference page)

---

## 1. Project Summary

Build Curt O. Schaller's bilingual (DE/EN) personal website as a polished editorial one-pager. The existing standalone HTML file serves as visual reference for the hero block; we expand it into a full personal site with 6 additional sections, retain the visual language (dark editorial + gold accent, Fraunces italic + DM Mono), and ship it as a maintainable Astro project deployed to Vercel.

**Subject:** Curt O. Schaller (*1964, Munich) — cinematographer, Steadicam operator, inventor of the ARRI TRINITY camera stabilization systems, Academy Sci-Tech Award 2025 recipient.

**Goals:**
- Deployable, fast, accessible bilingual personal site
- Editorial design fidelity to the reference vorlage
- Maintainable content via Markdown content collections (no CMS)

**Non-goals:** see Section 9.

---

## 2. Information Architecture

One-pager, scroll-driven. Top to bottom:

| # | Section | Purpose | Key elements |
|---|---|---|---|
| 0 | Topbar | Persistent identifier + language toggle + ambient detail | Mark with pulse-dot, `DE · EN` toggle, animated ticker of keywords |
| 1 | Hero | Establish person + headline achievement | Kicker (Academy Award Sci-Tech 2025), split headline "The hand behind the motion." (EN, fixed across both langs), bio sub-paragraph, counter stats (30+ / 1964 / 2025), portrait photo |
| 2 | About / Bio | Long-form career narrative | 2–3 paragraphs + key-year timeline |
| 3 | Inventions / R&D | Unique-selling section: the work that won the Oscar | TRINITY 1 + TRINITY 2 cards with concept, principle, patent/award status |
| 4 | Awards & Recognition | Awards list anchored by Oscar | Academy Sci-Tech 2025 (full citation excerpt) + further industry awards/mentions |
| 5 | Selected Works / Filmography | Curated proof-of-work | 10–15 entries: year · title · director · role (Operator / Consultant / DOP) |
| 6 | Workshops & Teaching | Active offer / availability | What he teaches, target audience, format |
| 7 | Contact | Single CTA | `curt@cos-cam.com` mailto, Munich — Worldwide tagline, optional LinkedIn / IMDb |
| 8 | Footer | Legal | © Curt O. Schaller MMXXV, Impressum + Datenschutz links, mini-mark |

Section order rationale: Hero establishes person + Oscar → About gives biographical context → Inventions explains *why* the Oscar → Awards lists recognition (anchored, not floating) → Filmography proves operator work → Workshops as active offer → Contact closes.

---

## 3. Content Drafting Plan

Curt is a real public figure. All draft content is researched from public sources, marked with inline source comments, and **subject to Curt's review before go-live**.

**Sources (in order of authority):**
1. AMPAS Sci-Tech 2025 official citation (verbatim where quoted)
2. ARRI press releases for TRINITY 1 / TRINITY 2
3. IMDb credits (filmography, curated — not bulk imported)
4. Industry interviews (FDTimes, Cinematography World, AbelCine) for tone reference and biographical anchors
5. LinkedIn / `cos-cam.com` if available, for self-description

**Conventions:**
- Inline source notes in Markdown: `<!-- SOURCE: ARRI Press 2024-09 -->` or `<!-- VERIFY: cross-check with Curt -->`
- Third person, sober tone, occasional English editorial phrases (matches vorlage register)
- No invented quotes, no speculative biography, no private-life detail
- Missing facts → explicit `[…]` placeholder with comment

**Per-section volume targets:**
- About: ~250 words per language
- Inventions: ~150 words + bullet list
- Awards: compact list (year · title · body)
- Filmography: 10–15 curated rows
- Workshops: ~100 words per language
- Contact: minimal

---

## 4. i18n

Astro built-in i18n routing, two languages, both fully translated (no partial fallback).

- `/` → server-side redirect, honors `Accept-Language`, default DE
- `/de/` → German one-pager
- `/en/` → English one-pager
- Both languages must be complete at launch. During dev, a missing translation is a build-time error (no silent fallback).
- Section IDs are language-neutral (`#about`, `#inventions`, …) so the language toggle swaps URL while preserving scroll target
- Toggle placement: topbar right side, format `DE · EN`, active state gold + bold, inactive grey
- Selected language persists in `localStorage`; next visit honors stored preference over `Accept-Language`
- SEO: `<html lang>` correct per page, `<link rel="alternate" hreflang>` pair, distinct `<title>`/`<meta description>` per language
- No third language. No i18n library — Astro native only.

---

## 5. Visual System

### Design tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0907` | Page background |
| `--bg-2` | `#13110d` | Alternating section background |
| `--gold` | `#c8a558` | Primary accent (lines, highlights, pulse) |
| `--gold-2` | `#8a7f6c` | Secondary accent (subtext) |
| `--ink` | `#e8e3d6` | Body text on dark |
| `--mute` | `#5e574a` | Captions, labels |
| `--rule` | `rgba(200,165,88,0.18)` | Hairline dividers |

### Typography
- **Fraunces** italic 300/400 — display, hero, section titles
- **DM Mono** 300/400/500 — kickers, labels, ticker, stats, technical captions
- Body fallback stack: `'Fraunces', Georgia, 'Times New Roman', serif`
- Mono fallback stack: `'DM Mono', ui-monospace, 'SF Mono', Menlo, monospace`
- Self-hosted woff2 (extracted from vorlage), `font-display: swap`, preloaded
- OFL.txt shipped under `public/fonts/`

### Layout grid
- Desktop: 12 columns, 16px gutter, max 1280px container
- Mobile: single column, 24px padding

### Component inventory
`Topbar`, `LanguageToggle`, `Ticker`, `Hero`, `Section` (generic wrapper with number + title), `TimelineItem`, `InventionCard`, `AwardRow`, `FilmRow`, `WorkshopBlock`, `ContactBlock`, `Footer`.

### Animations (GSAP + ScrollTrigger)

| Animation | Section | Trigger | Effect |
|---|---|---|---|
| Ticker | Topbar | always-on | CSS translate-loop, no GSAP |
| Spotlight | Hero | mousemove | Radial gradient follows cursor (CSS + JS), no GSAP |
| Reveal | all sections | ScrollTrigger, element at 80% viewport | `y: 30, opacity: 0 → 0, 1`, stagger 0.08s |
| Headline split | Hero | onLoad | Lines staggered in with y-drift |
| Counter-up | Hero stats | ScrollTrigger | Numbers count from 0 to target |
| Pulse dot | Topbar mark | always-on | CSS `@keyframes`, no JS |
| Sticky section number | section markers | ScrollTrigger pin | `01`, `02` sticks to left rail, fades when section exits |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables ScrollTrigger animations and ticker; content renders statically.

### Performance budget
- LCP < 2s (hero image priority, fonts preloaded with `font-display: swap`)
- Total JS (incl. GSAP + ScrollTrigger) < 40 KB gzipped
- Lighthouse Performance > 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

---

## 6. Project Structure

```
curt-schaller-website/
├── astro.config.mjs              # i18n config, integrations
├── package.json
├── tsconfig.json
├── public/
│   ├── fonts/                    # Fraunces + DM Mono woff2 + OFL.txt
│   ├── images/
│   │   ├── curt-hero.jpg
│   │   └── og-image.jpg
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── pages/
│   │   ├── index.astro           # redirect to /de/ or /en/
│   │   ├── de/index.astro
│   │   └── en/index.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Topbar.astro
│   │   ├── LanguageToggle.astro
│   │   ├── Ticker.astro
│   │   ├── Hero.astro
│   │   ├── Section.astro
│   │   ├── About.astro
│   │   ├── Inventions.astro
│   │   ├── Awards.astro
│   │   ├── Filmography.astro
│   │   ├── Workshops.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── content/
│   │   ├── config.ts             # Zod schemas per section
│   │   └── sections/
│   │       ├── de/{hero,about,inventions,awards,filmography,workshops,contact}.md
│   │       └── en/{…}.md
│   ├── scripts/
│   │   ├── animations.ts         # GSAP init, reveal, counter, split
│   │   ├── spotlight.ts
│   │   └── languageToggle.ts
│   └── styles/
│       ├── tokens.css
│       ├── base.css
│       └── components/           # one CSS file per component, scoped
└── scripts/
    └── extract-bundle.mjs        # one-off: unpack vorlage assets
```

**Data flow:** Markdown section loaded via `getCollection('sections')` filtered by language → frontmatter → component props; body → Astro markdown renderer.

**Per-section storage type:**
| Section | Type | Reason |
|---|---|---|
| `hero` | markdown body + frontmatter (kicker, stats) | mixed prose + structured stats |
| `about` | markdown body + frontmatter (timeline entries) | prose dominant, timeline structured |
| `inventions` | `type: 'data'` (Zod) — array of invention cards | fully structured |
| `awards` | `type: 'data'` — array of award rows | fully structured |
| `filmography` | `type: 'data'` — array of entries | fully structured |
| `workshops` | markdown body | prose dominant |
| `contact` | frontmatter only (email, location, links) | no body needed |

**Example schema:**
```ts
filmography: defineCollection({
  type: 'data',
  schema: z.object({
    entries: z.array(z.object({
      year: z.number(),
      title: z.string(),
      director: z.string(),
      role: z.enum(['Operator', 'Consultant', 'DOP', 'Other']),
      note: z.string().optional(),
    }))
  })
})
```

---

## 7. Asset Extraction

The vorlage embeds 19 assets (fonts + hero photo) as base64+gzip inside the `__bundler/manifest` script tag. One-off extraction:

**Script:** `scripts/extract-bundle.mjs` (Node, not shipped to production)
1. Read `Curt O. Schaller - Standalone.html`
2. Parse `__bundler/manifest` JSON
3. For each `uuid → {data, mime, compressed}`: base64-decode → if compressed, gunzip → map MIME to extension
4. Write fonts to `public/fonts/` (named per `@font-face` entries in vorlage CSS), hero photo to `public/images/curt-hero.jpg`
5. Drop OFL license text into `public/fonts/OFL.txt`

**Expected assets:**
- Fraunces italic 300/400 — latin / latin-ext / vietnamese subsets (6 files)
- DM Mono 300/400/500 — latin / latin-ext (6 files)
- 1× hero JPEG portrait
- Any additional assets surfacing during unpacking get audited: kept under `public/images/` only if used by the new site; otherwise dropped (we do not carry vorlage-internal scaffolding)

**Licensing:**
- Fraunces + DM Mono: SIL Open Font License — commercial + self-hosted OK, OFL.txt included
- Hero photo: rights assumed via vorlage origin — **Curt confirms before launch**

**Not extracted:** React+Babel runtime, bundler loader, inline mega-CSS (we restyle cleanly in `src/styles/`).

---

## 8. Deployment

- **Host:** Vercel, auto-deploy from GitHub `main`
- **Domain:** TBD — candidates: `curtoschaller.com`, `curt-schaller.com`, or existing `cos-cam.com`. Until decided: default `*.vercel.app`
- **Previews:** Vercel per-PR preview URLs (standard)
- **Build cmd:** `npm run build` → `dist/`
- **HTTPS / CDN:** Vercel standard

### SEO & meta
- Per-language `<title>`, `<meta description>` (from each language's hero content)
- OpenGraph + Twitter Card with `og-image.jpg`
- `sitemap.xml` via `@astrojs/sitemap`
- `robots.txt`
- `hreflang` cross-links DE ↔ EN

### Privacy / legal (DSGVO)
- Impressum (`/impressum`) and Datenschutz (`/datenschutz`) as separate static pages, linked from footer
- Standard German templates filled with Curt's data — final text from Curt
- **No** cookies, **no** tracking → no cookie banner required

---

## 9. Out of Scope (YAGNI)

Explicitly **not** in this build:
- No CMS — content in Markdown, edits via Git/PR
- No backend, no API routes
- No contact form with server — `mailto:` only
- No analytics at launch (revisit later: Plausible or Vercel Analytics, both DSGVO-friendly)
- No newsletter, no booking tool
- No user auth
- No blog (could be added later as separate Astro collection)
- No third language (DE/EN only)
- No animations beyond the 7 defined in Section 5
- No PWA / service worker / offline

---

## 10. Acceptance Criteria

1. `/de/` and `/en/` render all 6 content sections + hero + footer without console errors
2. Language toggle works, `localStorage` persistence verified across reloads
3. All animations run at 60fps on a 2020-era laptop; `prefers-reduced-motion` honored
4. Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
5. Cross-browser: Safari + Chrome + Firefox (current), iOS Safari + Android Chrome
6. Vercel deploy green, preview URL reachable
7. Impressum + Datenschutz pages exist (even if text final from Curt)
8. All draft content marked with source comments; Curt review pass complete before launch

---

## 11. Open Points (decide later, do not block Phase 1)

- Final domain
- Analytics yes/no, and which tool
- Maintenance model: Leon as middleman vs. Curt edits repo directly
- Optional Phase 2: press kit ZIP download (bio + photos)
- Optional Phase 2: third language

---

## 12. Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Scope vs. vorlage | Option B — expand vorlage with 6 sections | One-pager not enough for personal site of this subject |
| Content source | Option C — research public sources, draft for review | Real person, public material exists, faster than waiting for Curt |
| Stack | Astro | Component structure without runtime overhead; native i18n |
| Architecture sub-approach | B — Astro + GSAP | Headroom for future animations beyond reveals |
| Language | D — bilingual DE/EN with toggle | International audience, no double-maintenance via toggle UX |
| Assets | A — extract from vorlage | Photo + fonts already correct; revisit later if Curt sends higher-res |
