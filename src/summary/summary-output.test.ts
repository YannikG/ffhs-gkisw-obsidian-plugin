import { describe, expect, it } from 'vitest';
import {
  buildSummaryOutputVaultPath,
  resolveSummaryOutputFilename,
  writeSummaryMarkdown,
  type SummaryVaultWritePort,
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

describe('writeSummaryMarkdown', () => {
  it('writes to the resolved vault path via the port', async () => {
    const created: { vaultPath: string; content: string }[] = [];
    const port: SummaryVaultWritePort = {
      listMarkdownBasenamesInTree: () => ['GKISW_summary.md'],
      createFile: async (vaultPath, content) => {
        created.push({ vaultPath, content });
      },
    };

    const result = await writeSummaryMarkdown(port, 'course/GKISW', 'GKISW', '# Summary');

    expect(result).toEqual({
      vaultPath: 'course/GKISW/GKISW_summary_2.md',
      filename: 'GKISW_summary_2.md',
    });
    expect(created).toEqual([
      { vaultPath: 'course/GKISW/GKISW_summary_2.md', content: '# Summary' },
    ]);
  });

  it('does not overwrite the base summary file on the first run', async () => {
    const created: string[] = [];
    const port: SummaryVaultWritePort = {
      listMarkdownBasenamesInTree: () => [],
      createFile: async (vaultPath) => {
        created.push(vaultPath);
      },
    };

    const result = await writeSummaryMarkdown(port, 'course/GKISW', 'GKISW', 'body');

    expect(result.filename).toBe('GKISW_summary.md');
    expect(created).toEqual(['course/GKISW/GKISW_summary.md']);
  });
});
