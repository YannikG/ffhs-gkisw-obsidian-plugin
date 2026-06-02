import type { OllamaChatMessage, OllamaResult } from '../ollama/types.js';
import { buildRetrievalContext } from '../rag/retrieval-context.js';
import { buildRetrievalQueryText } from '../rag/retrieval-query-text.js';
import type { RetrieveTopKResult } from '../rag/retrieve-top-k.js';
import { buildSummaryMessages } from './build-summary-messages.js';
import {
  CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE,
  CREATE_SUMMARY_EMPTY_RETRIEVAL_NOTICE,
  CREATE_SUMMARY_GENERATING_NOTICE,
  CREATE_SUMMARY_NO_SOURCES_NOTICE,
  CREATE_SUMMARY_RUN_ALREADY_NOTICE,
  createSummarySuccessNotice,
} from './create-summary-notices.js';
import { mapOllamaErrorToNotice } from './create-summary-run.js';
import type { FolderMarkdownEntry } from './folder-source-corpus.js';
import type { SummaryWriteResult } from './summary-output.js';

export interface CreateSummaryRagRunPorts {
  listSources: () => Promise<readonly FolderMarkdownEntry[]>;
  indexFolderScope: () => Promise<void>;
  retrieveTopK: (queryText: string) => Promise<RetrieveTopKResult>;
  checkReachable: () => Promise<OllamaResult<void>>;
  chat: (messages: OllamaChatMessage[]) => Promise<OllamaResult<string>>;
  writeSummary: (content: string) => Promise<SummaryWriteResult>;
  showNotice: (message: string) => void;
  tryBeginRun: () => boolean;
  endRun: () => void;
}

export interface CreateSummaryRagRunInput {
  folderLabel: string;
  contextLimit: number;
}

export async function runCreateSummaryRag(
  ports: CreateSummaryRagRunPorts,
  input: CreateSummaryRagRunInput,
): Promise<void> {
  if (!ports.tryBeginRun()) {
    ports.showNotice(CREATE_SUMMARY_RUN_ALREADY_NOTICE);
    return;
  }

  try {
    const entries = await ports.listSources();
    const queryResult = buildRetrievalQueryText(entries);
    if (!queryResult.ok) {
      ports.showNotice(CREATE_SUMMARY_NO_SOURCES_NOTICE);
      return;
    }

    await ports.indexFolderScope();

    const retrievalResult = await ports.retrieveTopK(queryResult.queryText);
    if (!retrievalResult.ok) {
      ports.showNotice(mapOllamaErrorToNotice(retrievalResult.error));
      return;
    }

    if (retrievalResult.chunks.length === 0) {
      ports.showNotice(CREATE_SUMMARY_EMPTY_RETRIEVAL_NOTICE);
      return;
    }

    const sourceContext = buildRetrievalContext(retrievalResult.chunks);
    if (sourceContext.length > input.contextLimit) {
      ports.showNotice(CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE);
      return;
    }

    ports.showNotice(CREATE_SUMMARY_GENERATING_NOTICE);

    const reachable = await ports.checkReachable();
    if (!reachable.ok) {
      ports.showNotice(mapOllamaErrorToNotice(reachable.error));
      return;
    }

    const messages = buildSummaryMessages({ folderLabel: input.folderLabel, sourceContext });

    const chatResult = await ports.chat(messages);
    if (!chatResult.ok) {
      ports.showNotice(mapOllamaErrorToNotice(chatResult.error));
      return;
    }

    const writeResult = await ports.writeSummary(chatResult.value);
    ports.showNotice(createSummarySuccessNotice(writeResult.filename));
  } finally {
    ports.endRun();
  }
}
