import { afterEach, describe, expect, it } from 'vitest';

import {
  disposeBackgroundIndex,
  getOrchestrator,
  indexFolderScopeWithNotice,
  resetIndex,
  startBackgroundIndex,
  type RagVaultPorts,
} from './background-index.js';

function makeNullPorts(): RagVaultPorts {
  return {
    getAllVaultPaths: () => [],
    getFilesUnderFolder: async () => [],
    onModify: () => () => {},
    onDelete: () => () => {},
    onCreate: () => () => {},
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
});
