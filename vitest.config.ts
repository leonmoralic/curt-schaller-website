import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // tests/e2e/ gehoert Playwright. Ohne diese Zeile greift Vitest die Datei
    // ebenfalls auf, kann sie nicht ausfuehren und meldet einen Fehlschlag —
    // was echte Fehler in der Ausgabe untergehen laesst.
    include: ['tests/unit/**/*.{test,spec}.{ts,mts,js,mjs}'],
  },
});
