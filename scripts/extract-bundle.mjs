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
  // Match the @font-face block referencing this uuid; capture subset, family, style, weight.
  const re = new RegExp(`/\\*\\s*([a-z-]+)\\s*\\*/\\s*@font-face\\s*\\{[^}]*?font-family:\\s*['"]([^'"]+)['"][^}]*?font-style:\\s*([a-z]+)[^}]*?font-weight:\\s*(\\d+)[^}]*?src:\\s*url\\(["']${uuid}["']\\)`, 'i');
  const m = template.match(re);
  if (!m) return null;
  const [, subset, family, style, weight] = m;
  return `${family.toLowerCase().replace(/\s+/g, '-')}-${style}-${weight}-${subset}.woff2`;
}

export function extractInlineImages(template) {
  // Inline data URLs in the template HTML, e.g. <img src="data:image/jpeg;base64,....">
  const re = /<img[^>]*src=["']data:image\/([a-z+]+);base64,([^"']+)["']/gi;
  const out = [];
  for (const m of template.matchAll(re)) {
    const mime = `image/${m[1]}`;
    const bytes = Uint8Array.from(Buffer.from(m[2], 'base64'));
    out.push({ mime, bytes });
  }
  return out;
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
      console.log(`font  -> public/fonts/${name}`);
    } else if (asset.mime === 'image/jpeg' && !heroFound) {
      await writeFile(path.join(root, 'public/images/curt-hero.jpg'), Buffer.from(asset.bytes));
      heroFound = true;
      console.log('image -> public/images/curt-hero.jpg');
    } else {
      const ext = MIME_EXT[asset.mime] || 'bin';
      const target = path.join(root, 'public/images', `extra-${uuid.slice(0, 8)}.${ext}`);
      await writeFile(target, Buffer.from(asset.bytes));
      console.log(`extra -> ${target}`);
    }
  }

  // Also extract inline data: image URLs from the template (the vorlage embeds the hero JPEG here).
  const inlineImages = extractInlineImages(template);
  let inlineIdx = 0;
  for (const img of inlineImages) {
    if (img.mime === 'image/jpeg' && !heroFound) {
      await writeFile(path.join(root, 'public/images/curt-hero.jpg'), Buffer.from(img.bytes));
      heroFound = true;
      console.log('image -> public/images/curt-hero.jpg (inline)');
    } else {
      const ext = MIME_EXT[img.mime] || 'bin';
      const target = path.join(root, 'public/images', `inline-${inlineIdx++}.${ext}`);
      await writeFile(target, Buffer.from(img.bytes));
      console.log(`inline -> ${target}`);
    }
  }

  const ofl = `Copyright 2017 The Fraunces Project Authors
Copyright 2014 Colophon Foundry

Licensed under the SIL Open Font License, Version 1.1.
Full text: https://openfontlicense.org/open-font-license-official-text/
`;
  await writeFile(path.join(root, 'public/fonts/OFL.txt'), ofl);
  console.log('license -> public/fonts/OFL.txt');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}
