import { describe, expect, it } from 'vitest';
import { buildRetrievalQueryText } from './retrieval-query-text.js';
import type { FolderMarkdownEntry } from '../summary/folder-source-corpus.js';

const entry = (vaultPath: string, content: string): FolderMarkdownEntry => ({
  vaultPath,
  basename: vaultPath.split('/').pop() ?? vaultPath,
  content,
});

describe('buildRetrievalQueryText', () => {
  it('concatenates two files under cap with a blank line, sorted by vaultPath', () => {
    const result = buildRetrievalQueryText([
      entry('course/b.md', 'Beta'),
      entry('course/a.md', 'Alpha'),
    ]);

    expect(result).toEqual({ ok: true, queryText: 'Alpha\n\nBeta' });
  });

  it('returns empty_folder when entries list is empty', () => {
    expect(buildRetrievalQueryText([])).toEqual({
      ok: false,
      error: { kind: 'empty_folder' },
    });
  });

  it('returns empty_folder when all entries are excluded by filter', () => {
    const result = buildRetrievalQueryText([
      entry('.obsidian/cache.md', 'meta'),
      entry('course/GKISW_summary.md', 'skip'),
    ]);

    expect(result).toEqual({ ok: false, error: { kind: 'empty_folder' } });
  });

  it('excludes filtered entries and concatenates only included ones', () => {
    const result = buildRetrievalQueryText([
      entry('course/note.md', 'Body'),
      entry('course/GKISW_summary.md', 'skip'),
    ]);

    expect(result).toEqual({ ok: true, queryText: 'Body' });
  });

  it('skips files that would exceed the 8000-char cap, without cutting mid-file', () => {
    const big = 'x'.repeat(7_000);
    const small = 'y'.repeat(500);

    // big (a.md) fits; small (b.md) would push total to 7000 + 2 + 500 = 7502 — still fits
    // extra (c.md) would push to 7502 + 2 + 5000 = 12504 — skipped
    const extra = 'z'.repeat(5_000);

    const result = buildRetrievalQueryText([
      entry('course/c.md', extra),
      entry('course/a.md', big),
      entry('course/b.md', small),
    ]);

    expect(result).toEqual({ ok: true, queryText: `${big}\n\n${small}` });
  });

  it('returns empty_folder when the single file content exceeds the cap on its own', () => {
    const result = buildRetrievalQueryText([entry('course/huge.md', 'x'.repeat(8_001))]);

    expect(result).toEqual({ ok: false, error: { kind: 'empty_folder' } });
  });

  it('stops appending after the first file that exceeds the cap, even if later files would fit', () => {
    // a.md (7500) fits; b.md (600) does not (7500+2+600=8102>8000) → stop;
    // c.md (50) would fit but must not be included — "Rest weglassen"
    const result = buildRetrievalQueryText([
      entry('course/a.md', 'x'.repeat(7_500)),
      entry('course/b.md', 'y'.repeat(600)),
      entry('course/c.md', 'z'.repeat(50)),
    ]);

    expect(result).toEqual({ ok: true, queryText: 'x'.repeat(7_500) });
  });
});
