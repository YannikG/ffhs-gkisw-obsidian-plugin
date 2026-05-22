import { describe, expect, it } from 'vitest';
import {
  buildSourceContext,
  collectFolderSourceCorpus,
  shouldIncludeMarkdownEntry,
  type FolderMarkdownEntry,
} from './folder-source-corpus.js';

describe('buildSourceContext', () => {
  it('joins two files with vault paths in headings and --- between them', () => {
    const entries: FolderMarkdownEntry[] = [
      { vaultPath: 'course/a.md', basename: 'a.md', content: 'Alpha' },
      { vaultPath: 'course/b.md', basename: 'b.md', content: 'Beta' },
    ];

    expect(buildSourceContext(entries)).toBe(
      '### `course/a.md`\nAlpha\n---\n### `course/b.md`\nBeta',
    );
  });
});

describe('shouldIncludeMarkdownEntry', () => {
  const entry = (vaultPath: string, basename = vaultPath.split('/').pop() ?? vaultPath): FolderMarkdownEntry => ({
    vaultPath,
    basename,
    content: 'x',
  });

  it('includes ordinary markdown sources', () => {
    expect(shouldIncludeMarkdownEntry(entry('course/lecture.md'))).toBe(true);
  });

  it('excludes plugin summary outputs and summary.md', () => {
    expect(shouldIncludeMarkdownEntry(entry('course/GKISW_summary.md', 'GKISW_summary.md'))).toBe(
      false,
    );
    expect(
      shouldIncludeMarkdownEntry(entry('course/GKISW_summary_2.md', 'GKISW_summary_2.md')),
    ).toBe(false);
    expect(shouldIncludeMarkdownEntry(entry('course/summary.md', 'summary.md'))).toBe(false);
  });

  it('excludes paths under .obsidian', () => {
    expect(shouldIncludeMarkdownEntry(entry('.obsidian/plugins/x.md'))).toBe(false);
    expect(shouldIncludeMarkdownEntry(entry('course/.obsidian/cache.md'))).toBe(false);
  });
});

describe('collectFolderSourceCorpus', () => {
  const entry = (
    vaultPath: string,
    content: string,
    basename = vaultPath.split('/').pop() ?? vaultPath,
  ): FolderMarkdownEntry => ({
    vaultPath,
    basename,
    content,
  });

  it('sorts included files by vault path ascending', () => {
    const result = collectFolderSourceCorpus([
      entry('course/z.md', 'Z'),
      entry('course/a.md', 'A'),
      entry('course/m.md', 'M'),
    ]);

    expect(result).toEqual({
      ok: true,
      sourceContext: '### `course/a.md`\nA\n---\n### `course/m.md`\nM\n---\n### `course/z.md`\nZ',
    });
  });

  it('returns empty_folder when there are no entries', () => {
    expect(collectFolderSourceCorpus([])).toEqual({ ok: false, error: { kind: 'empty_folder' } });
  });

  it('returns empty_folder when only excluded files remain', () => {
    const result = collectFolderSourceCorpus([
      entry('course/GKISW_summary.md', 'out'),
      entry('course/summary.md', 'legacy'),
      entry('.obsidian/x.md', 'meta'),
    ]);

    expect(result).toEqual({ ok: false, error: { kind: 'empty_folder' } });
  });

  it('filters excluded files and builds source context for included ones', () => {
    const result = collectFolderSourceCorpus([
      entry('course/note.md', 'Body'),
      entry('course/GKISW_summary.md', 'skip'),
      entry('course/sub/other.md', 'Other'),
    ]);

    expect(result).toEqual({
      ok: true,
      sourceContext:
        '### `course/note.md`\nBody\n---\n### `course/sub/other.md`\nOther',
    });
  });
});
