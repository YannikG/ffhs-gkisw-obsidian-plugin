import { TFile, TFolder } from 'obsidian';

/** Collects all markdown files under a folder tree (recursive). */
export function collectMarkdownFilesUnderFolder(folder: TFolder): TFile[] {
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
