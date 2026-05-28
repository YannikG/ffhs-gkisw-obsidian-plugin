import { describe, it, expect, beforeEach } from 'vitest';
import { Orchestrator } from './orchestrator.js';

describe('Orchestrator (idle & events)', () => {
  let calls: string[];
  let indexHandler: (p: string) => Promise<void>;
  let deleteHandler: (p: string) => Promise<void>;
  let listFilesUnderFolder: (f: string) => Promise<string[]>;

  beforeEach(() => {
    calls = [];
    indexHandler = async (p: string) => {
      calls.push(`index:${p}`);
    };
    deleteHandler = async (p: string) => {
      calls.push(`delete:${p}`);
    };
    listFilesUnderFolder = async (f: string) => {
      // return unsorted list for assertions about sorting
      if (f === 'root') return ['zzz.md', 'aaa.md'];
      return [];
    };
  });

  it('file-delete event calls deleteHandler and removes from queue', async () => {
    const o = new Orchestrator({ indexHandler, deleteHandler });
    // add to queue then delete
    o.addToIdleQueue(['a.md', 'b.md']);
    await o.handleFileDelete('a.md');
    expect(calls).toEqual(['delete:a.md']);
    // process tick should only process b.md
    await o.processIdleTick();
    expect(calls).toEqual(['delete:a.md', 'index:b.md']);
  });

  it('idle processes at most 3 files per tick', async () => {
    const o = new Orchestrator({ indexHandler, deleteHandler, idleBatchSize: 3 });
    o.addToIdleQueue(['f1.md', 'f2.md', 'f3.md', 'f4.md', 'f5.md']);
    await o.processIdleTick();
    // only first 3 processed
    expect(calls.length).toBe(3);
    // next tick processes remaining 2
    await o.processIdleTick();
    expect(calls.length).toBe(5);
  });

  it('file-change event has priority over idle queue', async () => {
    const o = new Orchestrator({ indexHandler, deleteHandler, idleBatchSize: 3 });
    o.addToIdleQueue(['a.md', 'b.md', 'c.md']);

    // Now a change happens for 'x.md' which is not queued
    await o.handleFileChange('x.md');
    // 'x.md' must be indexed immediately
    expect(calls[0]).toBe('index:x.md');

    // Idle tick should still process queued items afterwards
    await o.processIdleTick();
    expect(calls).toContain('index:a.md');
    expect(calls).toContain('index:b.md');
    expect(calls).toContain('index:c.md');
  });

  it('indexFolderScope enumerates and indexes files in alphabetical order', async () => {
    const o = new Orchestrator({ indexHandler, deleteHandler, listFilesUnderFolder });
    await o.indexFolderScope('root');
    // should index 'aaa.md' then 'zzz.md'
    expect(calls[0]).toBe('index:aaa.md');
    expect(calls[1]).toBe('index:zzz.md');
  });
});
