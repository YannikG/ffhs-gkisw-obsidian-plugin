import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import meta from '../manifest.meta.json';
import {
  getObsidianManifest,
  PLUGIN_DISPLAY_NAME,
  PLUGIN_ID,
  validateManifest,
} from './manifest.js';

const manifestPath = join(process.cwd(), 'manifest.json');

describe('validateManifest', () => {
  it('accepts committed manifest.json with required fields including author', () => {
    const raw = JSON.parse(readFileSync(manifestPath, 'utf8')) as unknown;
    const manifest = validateManifest(raw);
    expect(manifest.id).toBe(PLUGIN_ID);
    expect(manifest.name).toBe(PLUGIN_DISPLAY_NAME);
    expect(manifest.version.length).toBeGreaterThan(0);
    expect(manifest.minAppVersion.length).toBeGreaterThan(0);
    expect(manifest.description.length).toBeGreaterThan(0);
    expect(manifest.author).toContain('Gian Luca Tehrani');
    expect(manifest.isDesktopOnly).toBe(true);
  });

  it('manifest.json matches manifest.meta.json', () => {
    const onDisk = JSON.parse(readFileSync(manifestPath, 'utf8')) as unknown;
    expect(onDisk).toEqual(meta);
    expect(getObsidianManifest()).toEqual(validateManifest(onDisk));
  });

  it('rejects manifest missing minAppVersion', () => {
    expect(() =>
      validateManifest({
        id: PLUGIN_ID,
        name: 'Test',
        version: '0.1.0',
        description: 'x',
        author: 'Team',
        isDesktopOnly: true,
      }),
    ).toThrow(/minAppVersion/);
  });

  it('rejects manifest missing author', () => {
    expect(() =>
      validateManifest({
        id: PLUGIN_ID,
        name: 'Test',
        version: '0.1.0',
        minAppVersion: '1.0.0',
        description: 'x',
        isDesktopOnly: true,
      }),
    ).toThrow(/author/);
  });

  it('rejects manifest id that does not match PLUGIN_ID', () => {
    expect(() =>
      validateManifest({
        id: 'wrong-plugin-id',
        name: 'Test',
        version: '0.1.0',
        minAppVersion: '1.0.0',
        description: 'x',
        author: 'Team',
        isDesktopOnly: true,
      }),
    ).toThrow(/Manifest id must be/);
  });
});
