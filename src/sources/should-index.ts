/**
 * Shared helpers for deciding whether a vault path should be indexed or included
 * as source material. Kept pure and import-cycle free so both `summary/` and
 * `rag/` can reuse the same rules (P6-I05 Quellenfilter).
 */

import { isExcludedSummarySource } from '../summary/filename.js';

export function isPathUnderObsidianMeta(vaultPath: string): boolean {
  return vaultPath.split('/').includes('.obsidian');
}

/**
 * Returns true when a vault path should be indexed / included as source.
 * Rules:
 * - Paths that contain a `/.obsidian/` segment are excluded.
 * - Plugin-generated summary outputs (`*_summary.md`, `*_summary_{n}.md`) and
 *   legacy `summary.md` are excluded.
 */
export function shouldIndexVaultPath(vaultPath: string): boolean {
  if (isPathUnderObsidianMeta(vaultPath)) return false;
  return !isExcludedSummarySource(vaultPath);
}
