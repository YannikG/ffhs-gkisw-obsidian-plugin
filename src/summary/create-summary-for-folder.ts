import type { TFolder, Vault } from 'obsidian';
import { createOllamaClient } from '../ollama/client.js';
import type { PluginSettings } from '../settings.js';
import { runCreateSummary } from './create-summary-run.js';
import { sanitizeFolderBasename } from './filename.js';
import { readFolderMarkdownSources } from './vault-folder-sources.js';
import { writeSummaryMarkdownToFolder } from './vault-write-summary.js';

export type CreateSummaryNoticeFn = (message: string) => void;

let createSummaryRunInProgress = false;

function createRunGuard() {
  return {
    tryBeginRun: (): boolean => {
      if (createSummaryRunInProgress) {
        return false;
      }
      createSummaryRunInProgress = true;
      return true;
    },
    endRun: (): void => {
      createSummaryRunInProgress = false;
    },
  };
}

/**
 * Runs Create Summary for a vault folder using plugin settings (P5-I06).
 */
export async function runCreateSummaryForFolder(
  vault: Vault,
  folder: TFolder,
  settings: PluginSettings,
  showNotice: CreateSummaryNoticeFn,
): Promise<void> {
  const folderLabel = sanitizeFolderBasename(folder.name);
  const client = createOllamaClient({
    baseUrl: settings.ollamaBaseUrl,
    generationModel: settings.generationModel,
    timeoutMs: settings.ollamaTimeoutMs,
  });
  const guard = createRunGuard();

  await runCreateSummary(
    {
      readSources: () => readFolderMarkdownSources(vault, folder),
      checkReachable: () => client.checkOllamaReachable(),
      chat: (messages) => client.chat(messages),
      writeSummary: (content) => writeSummaryMarkdownToFolder(vault, folder, content),
      showNotice,
      tryBeginRun: guard.tryBeginRun,
      endRun: guard.endRun,
    },
    {
      folderLabel,
      contextLimit: settings.contextLimit,
    },
  );
}
