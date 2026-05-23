import { TFolder, type Vault } from 'obsidian';
import {
  collectFolderSourceCorpus,
  type FolderMarkdownEntry,
  type FolderSourceResult,
} from './folder-source-corpus.js';
import { collectMarkdownFilesUnderFolder } from './vault-folder-tree.js';

export async function readFolderMarkdownSources(
  vault: Vault,
  folder: TFolder,
): Promise<FolderSourceResult> {
  const files = collectMarkdownFilesUnderFolder(folder);
  const entries: FolderMarkdownEntry[] = await Promise.all(
    files.map(async (file) => ({
      vaultPath: file.path,
      basename: file.name,
      content: await vault.cachedRead(file),
    })),
  );
  return collectFolderSourceCorpus(entries);
}
