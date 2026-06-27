#!/usr/bin/env node
/**
 * Sets the release version in manifest.meta.json (SSOT for the manifest).
 *
 * Usage:
 *   node scripts/set-release-version.mjs <version>
 *
 * Version source order: argv[1] > RELEASE_VERSION > GITHUB_REF_NAME.
 * A leading "v" is stripped (Git-Tag `v1.2.3` -> `1.2.3`).
 * Accepts Semver (MAJOR.MINOR.PATCH, optional Prerelease-Suffix).
 *
 * The build (`npm run build`) writes manifest.json from manifest.meta.json.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const metaPath = join(repoRoot, 'manifest.meta.json');

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

const rawVersion = process.argv[2] ?? process.env.RELEASE_VERSION ?? process.env.GITHUB_REF_NAME;

if (!rawVersion) {
  throw new Error(
    'No version given. Pass an argument or set RELEASE_VERSION / GITHUB_REF_NAME (e.g. v1.0.0).',
  );
}

const version = rawVersion.trim().replace(/^v/, '');

if (!SEMVER.test(version)) {
  throw new Error(`Invalid Semver version: "${rawVersion}" (expected e.g. 1.0.0).`);
}

const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
  throw new Error('manifest.meta.json: expected a JSON object');
}
meta.version = version;
writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);

console.log(`manifest.meta.json: version set to ${version}`);
