import type { TFolder, Vault } from 'obsidian';
import { createOllamaClient } from '../ollama/client.js';
import { indexFolderScopeWithNotice } from '../rag/background-index.js';
import { retrieveTopKForFolder } from '../rag/retrieve-top-k.js';
import { getIndex } from '../rag/store.js';
import type { PluginSettings } from '../settings.js';
import { runCreateSummaryRag } from './create-summary-rag-run.js';
import { sanitizeFolderBasename } from './filename.js';
import { listFolderMarkdownEntries } from './vault-folder-sources.js';
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

export async function runCreateSummaryRagForFolder(
  vault: Vault,
  folder: TFolder,
  settings: PluginSettings,
  showNotice: CreateSummaryNoticeFn,
): Promise<void> {
  const folderLabel = sanitizeFolderBasename(folder.name);
  const client = createOllamaClient({
    baseUrl: settings.ollamaBaseUrl,
    generationModel: settings.generationModel,
    embeddingModel: settings.embeddingModel,
    timeoutMs: settings.ollamaTimeoutMs,
  });
  const guard = createRunGuard();

  await runCreateSummaryRag(
    {
      listSources: () => listFolderMarkdownEntries(vault, folder),
      indexFolderScope: () => indexFolderScopeWithNotice(folder.path, showNotice),
      retrieveTopK: (queryText) => {
        const store = getIndex();
        if (!store) {
          return Promise.resolve({
            ok: true as const,
            chunks: [],
          });
        }
        return retrieveTopKForFolder({
          folderPath: folder.path,
          queryText,
          k: settings.retrievalTopK,
          embed: (inputs) => client.embed(inputs),
          store: store as import('../rag/retrieve-top-k.js').RetrieveTopKStore,
        });
      },
      checkReachable: () => client.checkBothModelsReachable(),
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
