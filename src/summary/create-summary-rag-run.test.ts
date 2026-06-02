import { describe, expect, it, vi } from 'vitest';
import type { OllamaResult } from '../ollama/types.js';
import type { RetrieveTopKResult } from '../rag/retrieve-top-k.js';
import {
  CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE,
  CREATE_SUMMARY_EMPTY_RETRIEVAL_NOTICE,
  CREATE_SUMMARY_GENERATING_NOTICE,
  CREATE_SUMMARY_NO_SOURCES_NOTICE,
  CREATE_SUMMARY_RUN_ALREADY_NOTICE,
} from './create-summary-notices.js';
import { runCreateSummaryRag, type CreateSummaryRagRunPorts } from './create-summary-rag-run.js';
import type { FolderMarkdownEntry } from './folder-source-corpus.js';
import type { SummaryWriteResult } from './summary-output.js';

const INPUT = { folderLabel: 'GKISW', contextLimit: 1000 };

const ENTRY: FolderMarkdownEntry = {
  vaultPath: 'course/a.md',
  basename: 'a.md',
  content: 'Lerninhalt A',
};

const CHUNK = { vaultPath: 'course/a.md', chunkIndex: 0, text: 'Lerninhalt A' };

function ok<T>(value: T): OllamaResult<T> {
  return { ok: true, value };
}

function err(kind: 'connection' | 'model' | 'timeout', message: string): OllamaResult<never> {
  return { ok: false, error: { kind, message } };
}

function okChunks(chunks = [CHUNK]): RetrieveTopKResult {
  return { ok: true, chunks };
}

function createPorts(overrides: Partial<CreateSummaryRagRunPorts> = {}): CreateSummaryRagRunPorts {
  const writeResult: SummaryWriteResult = {
    vaultPath: 'course/GKISW_summary.md',
    filename: 'GKISW_summary.md',
    wasOverwritten: false,
  };
  let runActive = false;

  return {
    listSources: vi.fn(async () => [ENTRY]),
    indexFolderScope: vi.fn(async () => undefined),
    retrieveTopK: vi.fn(async () => okChunks()),
    checkReachable: vi.fn(async () => ok(undefined)),
    chat: vi.fn(async () => ok('# Summary\n')),
    writeSummary: vi.fn(async () => writeResult),
    showNotice: vi.fn(),
    tryBeginRun: vi.fn(() => {
      if (runActive) return false;
      runActive = true;
      return true;
    }),
    endRun: vi.fn(() => {
      runActive = false;
    }),
    ...overrides,
  };
}

describe('runCreateSummaryRag', () => {
  it('shows run-already notice on concurrent run', async () => {
    const ports = createPorts({
      tryBeginRun: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
    });

    await runCreateSummaryRag(ports, INPUT);
    await runCreateSummaryRag(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_RUN_ALREADY_NOTICE);
    expect(ports.listSources).toHaveBeenCalledTimes(1);
  });

  it('shows no-sources notice and skips index when folder is empty', async () => {
    const ports = createPorts({
      listSources: vi.fn(async () => []),
    });

    await runCreateSummaryRag(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_NO_SOURCES_NOTICE);
    expect(ports.indexFolderScope).not.toHaveBeenCalled();
    expect(ports.retrieveTopK).not.toHaveBeenCalled();
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.endRun).toHaveBeenCalled();
  });

  it('indexes folder before retrieval', async () => {
    const callOrder: string[] = [];
    const ports = createPorts({
      indexFolderScope: vi.fn(async () => {
        callOrder.push('index');
      }),
      retrieveTopK: vi.fn(async () => {
        callOrder.push('retrieve');
        return okChunks();
      }),
    });

    await runCreateSummaryRag(ports, INPUT);

    expect(callOrder).toEqual(['index', 'retrieve']);
  });

  it('shows empty-retrieval notice and does not call chat when 0 chunks', async () => {
    const ports = createPorts({
      retrieveTopK: vi.fn(async () => okChunks([])),
    });

    await runCreateSummaryRag(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_EMPTY_RETRIEVAL_NOTICE);
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.writeSummary).not.toHaveBeenCalled();
    expect(ports.endRun).toHaveBeenCalled();
  });

  it('shows context-limit notice when decorated retrieval context exceeds limit', async () => {
    const ports = createPorts({
      retrieveTopK: vi.fn(async () =>
        okChunks([{ vaultPath: 'a.md', chunkIndex: 0, text: 'x'.repeat(101) }]),
      ),
    });

    await runCreateSummaryRag(ports, { ...INPUT, contextLimit: 100 });

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE);
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.endRun).toHaveBeenCalled();
  });

  it('shows Ollama connection notice when retrieval embed fails', async () => {
    const ports = createPorts({
      retrieveTopK: vi.fn(async () => ({
        ok: false as const,
        error: { kind: 'connection' as const, message: 'fail' },
      })),
    });

    await runCreateSummaryRag(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(expect.stringMatching(/nicht erreichbar/i));
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.endRun).toHaveBeenCalled();
  });

  it('shows connection notice when checkReachable fails', async () => {
    const ports = createPorts({
      checkReachable: vi.fn(async () => err('connection', 'fail')),
    });

    await runCreateSummaryRag(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(expect.stringMatching(/nicht erreichbar/i));
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.writeSummary).not.toHaveBeenCalled();
  });

  it('shows timeout notice when chat times out', async () => {
    const ports = createPorts({
      chat: vi.fn(async () => err('timeout', 'timeout')),
    });

    await runCreateSummaryRag(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(expect.stringMatching(/Zeitlimit/i));
    expect(ports.writeSummary).not.toHaveBeenCalled();
  });

  it('writes summary and shows success notice on happy path', async () => {
    const ports = createPorts();

    await runCreateSummaryRag(ports, INPUT);

    expect(ports.indexFolderScope).toHaveBeenCalled();
    expect(ports.retrieveTopK).toHaveBeenCalledWith(expect.any(String));
    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_GENERATING_NOTICE);
    expect(ports.checkReachable).toHaveBeenCalled();
    expect(ports.chat).toHaveBeenCalled();
    expect(ports.writeSummary).toHaveBeenCalledWith('# Summary\n');
    expect(ports.showNotice).toHaveBeenCalledWith('Summary erstellt: GKISW_summary.md');
    expect(ports.endRun).toHaveBeenCalled();
  });

  it('shows overwrite notice when wasOverwritten is true', async () => {
    const overwriteResult: SummaryWriteResult = {
      vaultPath: 'course/GKISW_summary.md',
      filename: 'GKISW_summary.md',
      wasOverwritten: true,
    };
    const ports = createPorts({ writeSummary: vi.fn(async () => overwriteResult) });

    await runCreateSummaryRag(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith('Summary überschrieben: GKISW_summary.md');
  });
});
