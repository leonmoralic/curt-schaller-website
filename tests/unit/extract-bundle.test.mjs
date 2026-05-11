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
