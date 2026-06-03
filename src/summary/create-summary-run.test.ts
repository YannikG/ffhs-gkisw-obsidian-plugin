import { describe, expect, it, vi } from 'vitest';
import type { OllamaResult } from '../ollama/types.js';
import {
  CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE,
  CREATE_SUMMARY_EMPTY_FOLDER_NOTICE,
  CREATE_SUMMARY_GENERATING_NOTICE,
  CREATE_SUMMARY_RUN_ALREADY_NOTICE,
} from './create-summary-notices.js';
import {
  mapOllamaErrorToNotice,
  runCreateSummary,
  type CreateSummaryRunPorts,
} from './create-summary-run.js';
import type { SummaryWriteResult } from './summary-output.js';

const INPUT = { folderLabel: 'GKISW', contextLimit: 100 };

function ok<T>(value: T): OllamaResult<T> {
  return { ok: true, value };
}

function err(kind: 'connection' | 'model' | 'timeout', message: string): OllamaResult<never> {
  return { ok: false, error: { kind, message } };
}

function createPorts(overrides: Partial<CreateSummaryRunPorts> = {}): CreateSummaryRunPorts {
  const writeResult: SummaryWriteResult = {
    vaultPath: 'course/GKISW_summary.md',
    filename: 'GKISW_summary.md',
    wasOverwritten: false,
  };
  let runActive = false;

  return {
    readSources: vi.fn(async () => ({
      ok: true as const,
      sourceContext: '### `a.md`\ncontent',
    })),
    checkReachable: vi.fn(async () => ok(undefined)),
    chat: vi.fn(async () => ok('# Summary\n')),
    writeSummary: vi.fn(async () => writeResult),
    showNotice: vi.fn(),
    tryBeginRun: vi.fn(() => {
      if (runActive) {
        return false;
      }
      runActive = true;
      return true;
    }),
    endRun: vi.fn(() => {
      runActive = false;
    }),
    ...overrides,
  };
}

describe('mapOllamaErrorToNotice', () => {
  it('maps connection errors to a fixed notice', () => {
    expect(mapOllamaErrorToNotice({ kind: 'connection', message: 'x' })).toMatch(
      /nicht erreichbar/i,
    );
  });

  it('maps timeout errors to a fixed notice', () => {
    expect(mapOllamaErrorToNotice({ kind: 'timeout', message: 'x' })).toMatch(/Zeitlimit/i);
  });

  it('uses the client message for model errors', () => {
    const message = 'Modell "gemma4:e2b" ist bei Ollama nicht geladen.';
    expect(mapOllamaErrorToNotice({ kind: 'model', message })).toBe(message);
  });
});

describe('runCreateSummary', () => {
  it('shows run-already notice when a second run starts', async () => {
    const ports = createPorts({
      tryBeginRun: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
    });

    await runCreateSummary(ports, INPUT);
    await runCreateSummary(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_RUN_ALREADY_NOTICE);
    expect(ports.readSources).toHaveBeenCalledTimes(1);
  });

  it('aborts with empty-folder notice and does not call chat', async () => {
    const ports = createPorts({
      readSources: vi.fn(async () => ({
        ok: false as const,
        error: { kind: 'empty_folder' as const },
      })),
    });

    await runCreateSummary(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_EMPTY_FOLDER_NOTICE);
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.writeSummary).not.toHaveBeenCalled();
    expect(ports.endRun).toHaveBeenCalled();
  });

  it('aborts with context-limit notice when corpus exceeds limit', async () => {
    const ports = createPorts({
      readSources: vi.fn(async () => ({
        ok: true as const,
        sourceContext: 'x'.repeat(101),
      })),
    });

    await runCreateSummary(ports, { ...INPUT, contextLimit: 100 });

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE);
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.endRun).toHaveBeenCalled();
  });

  it('shows Ollama connection notice when healthcheck fails', async () => {
    const ports = createPorts({
      checkReachable: vi.fn(async () => err('connection', 'fail')),
    });

    await runCreateSummary(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(expect.stringMatching(/nicht erreichbar/i));
    expect(ports.chat).not.toHaveBeenCalled();
    expect(ports.writeSummary).not.toHaveBeenCalled();
  });

  it('shows model notice when healthcheck reports missing model', async () => {
    const message = 'Modell fehlt';
    const ports = createPorts({
      checkReachable: vi.fn(async () => err('model', message)),
    });

    await runCreateSummary(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(message);
    expect(ports.chat).not.toHaveBeenCalled();
  });

  it('shows timeout notice when chat times out', async () => {
    const ports = createPorts({
      chat: vi.fn(async () => err('timeout', 'timeout')),
    });

    await runCreateSummary(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(expect.stringMatching(/Zeitlimit/i));
    expect(ports.writeSummary).not.toHaveBeenCalled();
  });

  it('writes summary and shows success notice with filename on happy path', async () => {
    const ports = createPorts();

    await runCreateSummary(ports, INPUT);

    expect(ports.showNotice).toHaveBeenCalledWith(CREATE_SUMMARY_GENERATING_NOTICE);
    expect(ports.checkReachable).toHaveBeenCalled();
    expect(ports.chat).toHaveBeenCalled();
    expect(ports.writeSummary).toHaveBeenCalledWith('# Summary\n');
    expect(ports.showNotice).toHaveBeenCalledWith('Summary erstellt: GKISW_summary.md');
    expect(ports.endRun).toHaveBeenCalled();
  });
});
