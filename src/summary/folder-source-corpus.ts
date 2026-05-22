/**
 * Pure logic for assembling the Ordner-Quellkorpus (P5-I04).
 * @see {@link ../../CONTEXT.md} Ordner-Quellkorpus
 */

import { isExcludedSummarySource } from './filename.js';

export type FolderSourceErrorKind = 'empty_folder';

export type FolderSourceResult =
  | { ok: true; sourceContext: string }
  | { ok: false; error: { kind: FolderSourceErrorKind } };

export interface FolderMarkdownEntry {
  vaultPath: string;
  basename: string;
  content: string;
}

export function isPathUnderObsidianMeta(vaultPath: string): boolean {
  return vaultPath.split('/').includes('.obsidian');
}

export function shouldIncludeMarkdownEntry(entry: FolderMarkdownEntry): boolean {
  if (isPathUnderObsidianMeta(entry.vaultPath)) {
    return false;
  }
  return !isExcludedSummarySource(entry.vaultPath);
}

export function buildSourceContext(entries: readonly FolderMarkdownEntry[]): string {
  return entries.map((entry) => `### \`${entry.vaultPath}\`\n${entry.content}`).join('\n---\n');
}

export function collectFolderSourceCorpus(
  entries: readonly FolderMarkdownEntry[],
): FolderSourceResult {
  const included = entries
    .filter(shouldIncludeMarkdownEntry)
    .sort((a, b) => a.vaultPath.localeCompare(b.vaultPath));

  if (included.length === 0) {
    return { ok: false, error: { kind: 'empty_folder' } };
  }

  return { ok: true, sourceContext: buildSourceContext(included) };
}
