import { TFolder, type Vault } from 'obsidian';
import {
  collectFolderSourceCorpus,
  type FolderMarkdownEntry,
  type FolderSourceResult,
} from './folder-source-corpus.js';
import { collectMarkdownFilesUnderFolder } from './vault-folder-tree.js';

export async function listFolderMarkdownEntries(
  vault: Vault,
  folder: TFolder,
): Promise<FolderMarkdownEntry[]> {
  const files = collectMarkdownFilesUnderFolder(folder);
  return Promise.all(
    files.map(async (file) => ({
      vaultPath: file.path,
      basename: file.name,
      content: await vault.cachedRead(file),
    })),
  );
}

export async function readFolderMarkdownSources(
  vault: Vault,
  folder: TFolder,
): Promise<FolderSourceResult> {
  const entries = await listFolderMarkdownEntries(vault, folder);
  return collectFolderSourceCorpus(entries);
}
