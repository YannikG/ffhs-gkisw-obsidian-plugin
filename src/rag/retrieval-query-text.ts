import {
  shouldIncludeMarkdownEntry,
  type FolderMarkdownEntry,
} from '../summary/folder-source-corpus.js';

export type RetrievalQueryErrorKind = 'empty_folder';

export type RetrievalQueryResult =
  | { ok: true; queryText: string }
  | { ok: false; error: { kind: RetrievalQueryErrorKind } };

const CAP = 8_000;

export function buildRetrievalQueryText(
  entries: readonly FolderMarkdownEntry[],
): RetrievalQueryResult {
  const included = entries
    .filter(shouldIncludeMarkdownEntry)
    .sort((a, b) => a.vaultPath.localeCompare(b.vaultPath));

  if (included.length === 0) {
    return { ok: false, error: { kind: 'empty_folder' } };
  }

  const parts: string[] = [];
  let total = 0;

  for (const entry of included) {
    const needed = parts.length === 0 ? entry.content.length : 2 + entry.content.length;
    if (total + needed > CAP) break;
    parts.push(entry.content);
    total += needed;
  }

  if (parts.length === 0) {
    return { ok: false, error: { kind: 'empty_folder' } };
  }

  return { ok: true, queryText: parts.join('\n\n') };
}
