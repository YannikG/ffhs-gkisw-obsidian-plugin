import { describe, expect, it } from 'vitest';
import {
  buildSummaryOutputVaultPath,
  resolveSummaryOutputFilename,
  writeSummaryMarkdown,
  type SummaryVaultWritePort,
  type SummaryWriteResult,
} from './summary-output.js';

describe('resolveSummaryOutputFilename', () => {
  it('returns the base summary filename when no summary output exists yet', () => {
    expect(resolveSummaryOutputFilename('GKISW', [])).toBe('GKISW_summary.md');
    expect(resolveSummaryOutputFilename('GKISW', ['other.md'])).toBe('GKISW_summary.md');
  });

  it('returns the next version when the base summary already exists', () => {
    expect(resolveSummaryOutputFilename('GKISW', ['GKISW_summary.md'])).toBe('GKISW_summary_2.md');
  });

  it('returns one above the highest existing version', () => {
    expect(
      resolveSummaryOutputFilename('GKISW', [
        'GKISW_summary.md',
        'GKISW_summary_2.md',
        'GKISW_summary_4.md',
      ]),
    ).toBe('GKISW_summary_5.md');
  });
});

describe('buildSummaryOutputVaultPath', () => {
  it('joins folder path and filename', () => {
    expect(buildSummaryOutputVaultPath('course/GKISW', 'GKISW_summary.md')).toBe(
      'course/GKISW/GKISW_summary.md',
    );
  });

  it('returns only the filename at vault root', () => {
    expect(buildSummaryOutputVaultPath('', 'GKISW_summary.md')).toBe('GKISW_summary.md');
  });
});

function makePort(opts: {
  basenames: string[];
  created?: string[];
  modified?: string[];
}): SummaryVaultWritePort {
  return {
    listMarkdownBasenamesInTree: () => opts.basenames,
    createFile: async (vaultPath) => {
      opts.created?.push(vaultPath);
    },
    modifyFile: async (vaultPath) => {
      opts.modified?.push(vaultPath);
    },
  };
}

describe('writeSummaryMarkdown', () => {
  it('writes to the resolved vault path via the port', async () => {
    const created: string[] = [];
    const port = makePort({ basenames: ['GKISW_summary.md'], created });

    const result = await writeSummaryMarkdown(port, 'course/GKISW', 'GKISW', '# Summary');

    expect(result).toEqual({
      vaultPath: 'course/GKISW/GKISW_summary_2.md',
      filename: 'GKISW_summary_2.md',
      wasOverwritten: false,
    });
    expect(created).toEqual(['course/GKISW/GKISW_summary_2.md']);
  });

  it('does not overwrite the base summary file on the first run', async () => {
    const created: string[] = [];
    const port = makePort({ basenames: [], created });

    const result = await writeSummaryMarkdown(port, 'course/GKISW', 'GKISW', 'body');

    expect(result.filename).toBe('GKISW_summary.md');
    expect(result.wasOverwritten).toBe(false);
    expect(created).toEqual(['course/GKISW/GKISW_summary.md']);
  });
});

describe('writeSummaryMarkdown overwriteBase=true', () => {
  it('modifies base file when base exists', async () => {
    const created: string[] = [];
    const modified: string[] = [];
    const port = makePort({ basenames: ['GKISW_summary.md'], created, modified });

    const result: SummaryWriteResult = await writeSummaryMarkdown(
      port,
      'course/GKISW',
      'GKISW',
      'body',
      true,
    );

    expect(result).toEqual({
      vaultPath: 'course/GKISW/GKISW_summary.md',
      filename: 'GKISW_summary.md',
      wasOverwritten: true,
    });
    expect(modified).toEqual(['course/GKISW/GKISW_summary.md']);
    expect(created).toEqual([]);
  });

  it('creates base file when no summaries exist', async () => {
    const created: string[] = [];
    const modified: string[] = [];
    const port = makePort({ basenames: [], created, modified });

    const result = await writeSummaryMarkdown(port, 'course/GKISW', 'GKISW', 'body', true);

    expect(result.filename).toBe('GKISW_summary.md');
    expect(result.wasOverwritten).toBe(false);
    expect(created).toEqual(['course/GKISW/GKISW_summary.md']);
    expect(modified).toEqual([]);
  });

  it('falls back to hybrid when only versions exist (no base)', async () => {
    const created: string[] = [];
    const modified: string[] = [];
    const port = makePort({ basenames: ['GKISW_summary_2.md'], created, modified });

    const result = await writeSummaryMarkdown(port, 'course/GKISW', 'GKISW', 'body', true);

    expect(result.filename).toBe('GKISW_summary_3.md');
    expect(result.wasOverwritten).toBe(false);
    expect(modified).toEqual([]);
  });

  it('overwrites only base when base and versions both exist', async () => {
    const created: string[] = [];
    const modified: string[] = [];
    const port = makePort({
      basenames: ['GKISW_summary.md', 'GKISW_summary_2.md'],
      created,
      modified,
    });

    const result = await writeSummaryMarkdown(port, 'course/GKISW', 'GKISW', 'body', true);

    expect(result.filename).toBe('GKISW_summary.md');
    expect(result.wasOverwritten).toBe(true);
    expect(modified).toEqual(['course/GKISW/GKISW_summary.md']);
    expect(created).toEqual([]);
  });
});
