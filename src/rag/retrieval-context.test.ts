import { describe, expect, it } from 'vitest';
import { buildRetrievalContext } from './retrieval-context.js';

describe('buildRetrievalContext', () => {
  it('formats single chunk with chunkIndex 0 — no chunk suffix', () => {
    expect(buildRetrievalContext([{ vaultPath: 'a.md', chunkIndex: 0, text: 'Hello' }])).toBe(
      '### `a.md`\nHello',
    );
  });

  it('formats two chunks with vault paths separated by ---', () => {
    const result = buildRetrievalContext([
      { vaultPath: 'course/a.md', chunkIndex: 0, text: 'Alpha' },
      { vaultPath: 'course/b.md', chunkIndex: 0, text: 'Beta' },
    ]);

    expect(result).toBe('### `course/a.md`\nAlpha\n---\n### `course/b.md`\nBeta');
  });

  it('appends (chunk N) in heading when chunkIndex > 0', () => {
    expect(
      buildRetrievalContext([{ vaultPath: 'a.md', chunkIndex: 2, text: 'Part three' }]),
    ).toBe('### `a.md` (chunk 2)\nPart three');
  });
});
