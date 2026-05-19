import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Unit tests run in Node; `obsidian` resolves to a stub (see README § Tests). */
export default defineConfig({
  resolve: {
    alias: {
      obsidian: path.resolve(rootDir, 'src/test-utils/obsidian-stub.ts'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
