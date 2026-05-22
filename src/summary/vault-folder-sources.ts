import { TFile, TFolder, type Vault } from 'obsidian';
import {
  collectFolderSourceCorpus,
  type FolderMarkdownEntry,
  type FolderSourceResult,
} from './folder-source-corpus.js';

function collectMarkdownFilesUnderFolder(folder: TFolder): TFile[] {
  const files: TFile[] = [];

  for (const child of folder.children) {
    if (child instanceof TFolder) {
      files.push(...collectMarkdownFilesUnderFolder(child));
      continue;
    }
    if (child instanceof TFile && child.extension === 'md') {
      files.push(child);
    }
  }

  return files;
}

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
