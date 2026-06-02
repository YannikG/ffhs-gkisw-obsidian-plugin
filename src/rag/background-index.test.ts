import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  disposeBackgroundIndex,
  getOrchestrator,
  indexFolderScopeWithNotice,
  resetIndex,
  startBackgroundIndex,
  type RagVaultPorts,
} from './background-index.js';

function makeNullPorts(overrides: Partial<RagVaultPorts> = {}): RagVaultPorts {
  return {
    getAllVaultPaths: () => [],
    getFilesUnderFolder: async () => [],
    onModify: () => () => {},
    onDelete: () => () => {},
    onCreate: () => () => {},
    readFile: async () => '',
    embed: async () => ({ ok: true, value: [] }),
    chunkSize: 1000,
    chunkOverlap: 200,
    embeddingModel: 'nomic-embed-text',
    ...overrides,
  };
}

describe('background-index', () => {
  afterEach(() => {
    disposeBackgroundIndex();
  });

  describe('startBackgroundIndex', () => {
    it('erstellt einen Orchestrator', () => {
      startBackgroundIndex(makeNullPorts());
      expect(getOrchestrator()).not.toBeNull();
    });
  });

  describe('disposeBackgroundIndex', () => {
    it('leert den Orchestrator', () => {
      startBackgroundIndex(makeNullPorts());
      disposeBackgroundIndex();
      expect(getOrchestrator()).toBeNull();
    });

    it('tut nichts wenn kein Orchestrator aktiv ist (idempotent)', () => {
      expect(() => disposeBackgroundIndex()).not.toThrow();
    });

    it('ruft alle Dispose-Funktionen der Event-Handler auf', () => {
      const disposed: string[] = [];
      const ports: RagVaultPorts = {
        ...makeNullPorts(),
        onModify: () => () => disposed.push('modify'),
        onDelete: () => () => disposed.push('delete'),
        onCreate: () => () => disposed.push('create'),
      };
      startBackgroundIndex(ports);
      disposeBackgroundIndex();
      expect(disposed).toEqual(expect.arrayContaining(['modify', 'delete', 'create']));
    });
  });

  describe('indexFolderScopeWithNotice', () => {
    it('ruft noticePort mit dem Ordnerpfad auf', async () => {
      startBackgroundIndex(makeNullPorts());
      const messages: string[] = [];
      await indexFolderScopeWithNotice('kurs/notizen', (msg) => messages.push(msg));
      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain('kurs/notizen');
    });

    it('tut nichts wenn kein Orchestrator aktiv ist', async () => {
      const messages: string[] = [];
      await indexFolderScopeWithNotice('kurs/notizen', (msg) => messages.push(msg));
      expect(messages).toHaveLength(0);
    });
  });

  describe('resetIndex', () => {
    it('wirft keinen Fehler wenn kein Store offen ist', () => {
      expect(() => resetIndex()).not.toThrow();
    });
  });

  describe('indexHandler', () => {
    it('ruft readFile und embed auf wenn eine Datei indexiert wird', async () => {
      const readFile = vi.fn(async () => 'Lerninhalt A\n\nLerninhalt B');
      const embed = vi.fn(async () => ({
        ok: true as const,
        value: [
          [0.1, 0.2],
          [0.3, 0.4],
        ],
      }));
      const ports = makeNullPorts({
        getFilesUnderFolder: async () => ['kurs/a.md'],
        readFile,
        embed,
      });
      startBackgroundIndex(ports);

      await indexFolderScopeWithNotice('kurs', () => {});

      expect(readFile).toHaveBeenCalledWith('kurs/a.md');
      expect(embed).toHaveBeenCalled();
    });

    it('überspringt die Datei wenn embed fehlschlägt', async () => {
      const embed = vi.fn(async () => ({
        ok: false as const,
        error: { kind: 'connection' as const, message: 'offline' },
      }));
      const ports = makeNullPorts({
        getFilesUnderFolder: async () => ['kurs/a.md'],
        readFile: async () => 'Inhalt',
        embed,
      });
      startBackgroundIndex(ports);

      await expect(indexFolderScopeWithNotice('kurs', () => {})).resolves.not.toThrow();
    });
  });
});
