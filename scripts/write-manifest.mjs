#!/usr/bin/env node
/**
 * Writes root manifest.json from manifest.meta.json (single source for id, author, version, …).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const metaPath = join(repoRoot, 'manifest.meta.json');
const outPath = join(repoRoot, 'manifest.json');

const REQUIRED = ['id', 'name', 'version', 'minAppVersion', 'description', 'author'];

const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
for (const field of REQUIRED) {
  if (typeof meta[field] !== 'string' || meta[field].length === 0) {
    throw new Error(`manifest.meta.json: missing or invalid "${field}"`);
  }
}
if (typeof meta.isDesktopOnly !== 'boolean') {
  throw new Error('manifest.meta.json: missing or invalid "isDesktopOnly"');
}

writeFileSync(outPath, `${JSON.stringify(meta, null, 2)}\n`);
