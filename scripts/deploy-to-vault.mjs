#!/usr/bin/env node
/**
 * Build plugin and copy artifacts into a test vault.
 *
 * Usage:
 *   npm run deploy -- "<vault-or-plugin-path>"
 *
 * Path resolution:
 *   - Vault root → <vault>/.obsidian/plugins/<manifest.id>/
 *   - .obsidian → <path>/plugins/<manifest.id>/
 *   - .obsidian/plugins → <path>/<manifest.id>/
 *   - .../plugins/<manifest.id> → used as-is
 *
 * Paths with spaces must be quoted in the shell.
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(repoRoot, 'manifest.json');

const ARTIFACTS = ['manifest.json', 'main.js', 'main.js.map'];

function usage() {
  console.error(`Usage: npm run deploy -- "<vault-or-plugin-path>"

Examples:
  npm run deploy -- ~/Obsidian/TestVault
  npm run deploy -- "~/Obsidian/Test Vault"
  npm run deploy -- "~/Obsidian/Test Vault/.obsidian"
  npm run deploy -- "~/Obsidian/Test Vault/.obsidian/plugins"
  npm run deploy -- "~/Obsidian/Test Vault/.obsidian/plugins/ffhs-gkisw-obsidian-plugin"`);
}

function readManifestId() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (typeof manifest.id !== 'string' || manifest.id.length === 0) {
    throw new Error(`Invalid manifest id in ${manifestPath}`);
  }
  for (const field of ['name', 'version', 'minAppVersion']) {
    if (typeof manifest[field] !== 'string' || manifest[field].length === 0) {
      throw new Error(`Invalid manifest field "${field}" in ${manifestPath}`);
    }
  }
  return manifest.id;
}

function endsWithPathSegment(resolvedPath, ...segments) {
  const suffix = join(...segments);
  return resolvedPath === suffix || resolvedPath.endsWith(`${sep}${suffix}`);
}

function resolvePluginDir(inputPath, pluginId) {
  const resolved = resolve(inputPath);
  const baseName = basename(resolved);

  if (baseName === pluginId) {
    return resolved;
  }

  if (endsWithPathSegment(resolved, '.obsidian', 'plugins')) {
    return join(resolved, pluginId);
  }

  if (baseName === '.obsidian') {
    return join(resolved, 'plugins', pluginId);
  }

  return join(resolved, '.obsidian', 'plugins', pluginId);
}

function runBuild() {
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function copyArtifacts(targetDir) {
  mkdirSync(targetDir, { recursive: true });

  const copied = [];
  for (const file of ARTIFACTS) {
    const source = join(repoRoot, file);
    if (!existsSync(source)) {
      if (file.endsWith('.map')) {
        continue;
      }
      throw new Error(`Missing build artifact: ${source}. Run build first.`);
    }
    const dest = join(targetDir, file);
    copyFileSync(source, dest);
    if (!existsSync(dest)) {
      throw new Error(`Copy failed: ${dest}`);
    }
    copied.push(file);
    console.log(`copied ${file} → ${dest}`);
  }

  if (!copied.includes('manifest.json') || !copied.includes('main.js')) {
    throw new Error(`Deploy incomplete in ${targetDir}`);
  }
}

const rawArgs = process.argv.slice(2);
const targetArg = rawArgs.join(' ').trim();

if (!targetArg || targetArg === '--help' || targetArg === '-h') {
  usage();
  process.exit(targetArg ? 0 : 1);
}

if (rawArgs.length > 1) {
  console.warn(
    'Warning: multiple argv segments were joined. Quote paths with spaces, e.g. npm run deploy -- "/path/Test Vault/.obsidian"',
  );
}

const pluginId = readManifestId();
const pluginDir = resolvePluginDir(targetArg, pluginId);

console.log(`Building plugin in ${repoRoot}…`);
runBuild();

console.log(`Deploying to ${pluginDir}…`);
copyArtifacts(pluginDir);
console.log('Done.');
