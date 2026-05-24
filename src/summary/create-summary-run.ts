import type { OllamaChatMessage, OllamaError, OllamaResult } from '../ollama/types.js';
import { buildSummaryMessages } from './build-summary-messages.js';
import { isSourceContextOverLimit } from './context-limit.js';
import {
  CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE,
  CREATE_SUMMARY_EMPTY_FOLDER_NOTICE,
  CREATE_SUMMARY_GENERATING_NOTICE,
  CREATE_SUMMARY_RUN_ALREADY_NOTICE,
  createSummaryOllamaErrorNotice,
  createSummarySuccessNotice,
} from './create-summary-notices.js';
import type { FolderSourceResult } from './folder-source-corpus.js';
import type { SummaryWriteResult } from './summary-output.js';

export interface CreateSummaryRunPorts {
  readSources: () => Promise<FolderSourceResult>;
  checkReachable: () => Promise<OllamaResult<void>>;
  chat: (messages: OllamaChatMessage[]) => Promise<OllamaResult<string>>;
  writeSummary: (content: string) => Promise<SummaryWriteResult>;
  showNotice: (message: string) => void;
  tryBeginRun: () => boolean;
  endRun: () => void;
}

export interface CreateSummaryRunInput {
  folderLabel: string;
  contextLimit: number;
}

const OLLAMA_CONNECTION_NOTICE = 'Ollama ist nicht erreichbar.';
const OLLAMA_TIMEOUT_NOTICE = 'Ollama-Anfrage hat das Zeitlimit überschritten.';

export function mapOllamaErrorToNotice(error: OllamaError): string {
  if (error.kind === 'connection') {
    return OLLAMA_CONNECTION_NOTICE;
  }
  if (error.kind === 'timeout') {
    return OLLAMA_TIMEOUT_NOTICE;
  }
  return createSummaryOllamaErrorNotice(error.message);
}

/**
 * End-to-end Create Summary without RAG (P5-I06).
 * Orchestrates read → limit checks → Ollama chat → vault write.
 */
export async function runCreateSummary(
  ports: CreateSummaryRunPorts,
  input: CreateSummaryRunInput,
): Promise<void> {
  if (!ports.tryBeginRun()) {
    ports.showNotice(CREATE_SUMMARY_RUN_ALREADY_NOTICE);
    return;
  }

  try {
    const readResult = await ports.readSources();
    if (!readResult.ok) {
      if (readResult.error.kind === 'empty_folder') {
        ports.showNotice(CREATE_SUMMARY_EMPTY_FOLDER_NOTICE);
      }
      return;
    }

    const { sourceContext } = readResult;
    if (isSourceContextOverLimit(sourceContext, input.contextLimit)) {
      ports.showNotice(CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE);
      return;
    }

    ports.showNotice(CREATE_SUMMARY_GENERATING_NOTICE);

    const reachable = await ports.checkReachable();
    if (!reachable.ok) {
      ports.showNotice(mapOllamaErrorToNotice(reachable.error));
      return;
    }

    const messages = buildSummaryMessages({
      folderLabel: input.folderLabel,
      sourceContext,
    });
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
