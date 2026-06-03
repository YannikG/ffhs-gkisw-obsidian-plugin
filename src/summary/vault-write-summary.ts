import { TFile, TFolder, type Vault } from 'obsidian';
import { writeSummaryMarkdown, type SummaryWriteResult } from './summary-output.js';
import { collectMarkdownFilesUnderFolder } from './vault-folder-tree.js';

/** Markdown basenames under the folder tree; used for summary version detection (SPEC US-03). */
export function collectMarkdownBasenamesRecursive(folder: TFolder): string[] {
  return collectMarkdownFilesUnderFolder(folder).map((file) => file.name);
}

export async function writeSummaryMarkdownToFolder(
  vault: Vault,
  folder: TFolder,
  content: string,
  overwriteBase = false,
): Promise<SummaryWriteResult> {
  return writeSummaryMarkdown(
    {
      listMarkdownBasenamesInTree: () => collectMarkdownBasenamesRecursive(folder),
      createFile: async (vaultPath, body) => {
        await vault.create(vaultPath, body);
      },
      modifyFile: async (vaultPath, body) => {
        const file = vault.getAbstractFileByPath(vaultPath);
        if (file instanceof TFile) {
          await vault.modify(file, body);
          return true;
        }
        return false;
      },
    },
    folder.path,
    folder.name,
    content,
    overwriteBase,
  );
}
