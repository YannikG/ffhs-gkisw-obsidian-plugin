import { TFile, TFolder, type Vault } from 'obsidian';
import { resolveSummaryOutputFilename } from './resolve-summary-output.js';

export type WriteSummaryMarkdownResult = {
  path: string;
  filename: string;
};

function listDirectChildFilenames(folder: TFolder): string[] {
  return folder.children
    .filter((child): child is TFile => child instanceof TFile)
    .map((file) => file.name);
}

function buildVaultPath(folder: TFolder, filename: string): string {
  return folder.path ? `${folder.path}/${filename}` : filename;
}

/**
 * Writes summary markdown into the target folder via the Obsidian Vault API (SPEC US-03).
 */
export async function writeSummaryMarkdownToFolder(
  vault: Vault,
  folder: TFolder,
  content: string,
): Promise<WriteSummaryMarkdownResult> {
  const filename = resolveSummaryOutputFilename(folder.name, listDirectChildFilenames(folder));
  const path = buildVaultPath(folder, filename);
  await vault.create(path, content);
  return { path, filename };
}
