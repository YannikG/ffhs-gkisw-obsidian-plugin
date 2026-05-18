import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PLUGIN_ID, validateManifest } from './manifest.js';

const manifestPath = join(process.cwd(), 'manifest.json');

describe('validateManifest', () => {
  it('accepts committed manifest.json with required fields', () => {
    const raw = JSON.parse(readFileSync(manifestPath, 'utf8')) as unknown;
    const manifest = validateManifest(raw);
    expect(manifest.id).toBe(PLUGIN_ID);
    expect(manifest.name.length).toBeGreaterThan(0);
    expect(manifest.version.length).toBeGreaterThan(0);
    expect(manifest.minAppVersion.length).toBeGreaterThan(0);
  });

  it('rejects manifest missing minAppVersion', () => {
    expect(() =>
      validateManifest({
        id: PLUGIN_ID,
        name: 'Test',
        version: '0.1.0',
      }),
    ).toThrow(/minAppVersion/);
  });

  it('rejects manifest id that does not match PLUGIN_ID', () => {
    expect(() =>
      validateManifest({
        id: 'wrong-plugin-id',
        name: 'Test',
        version: '0.1.0',
        minAppVersion: '1.0.0',
      }),
    ).toThrow(/Manifest id must be/);
  });
});
