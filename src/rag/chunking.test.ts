import { describe, expect, it } from 'vitest';
import {
  chunkMarkdown,
  DEFAULT_CHUNK_OVERLAP,
  DEFAULT_CHUNK_SIZE,
  type MarkdownChunk,
} from './chunking.js';
import {
  chunkMarkdown as chunkMarkdownFromBarrel,
  DEFAULT_CHUNK_OVERLAP as defaultOverlapFromBarrel,
  DEFAULT_CHUNK_SIZE as defaultSizeFromBarrel,
} from './index.js';

describe('chunkMarkdown defaults', () => {
  it('exports default chunk size and overlap constants', () => {
    expect(DEFAULT_CHUNK_SIZE).toBe(1000);
    expect(DEFAULT_CHUNK_OVERLAP).toBe(200);
  });

  it('returns no chunks for empty input', () => {
    expect(chunkMarkdown('')).toEqual([]);
  });

  it('returns no chunks for whitespace-only input', () => {
    expect(chunkMarkdown('   \n\n  \n')).toEqual([]);
  });

  it('uses default size and overlap when options are omitted', () => {
    const chunks = chunkMarkdown('Short note.');

    expect(chunks).toEqual([{ chunkIndex: 0, text: 'Short note.' }]);
  });

  it('falls back to defaults for invalid size or overlap values', () => {
    const chunks = chunkMarkdown('Short note.', { size: 0, overlap: -1 });

    expect(chunks).toEqual([{ chunkIndex: 0, text: 'Short note.' }]);
  });
});

describe('chunkMarkdown block splitting', () => {
  it('merges short paragraphs separated by blank lines into one chunk', () => {
    const text = 'Alpha paragraph.\n\nBeta paragraph.';

    const chunks = chunkMarkdown(text, { size: 100, overlap: 0 });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual({
      chunkIndex: 0,
      text: 'Alpha paragraph.\n\nBeta paragraph.',
    });
  });

  it('starts a new block at markdown headings even without a blank line before', () => {
    const text = 'Intro line.\n## Section\n\nBody text.';

    const chunks = chunkMarkdown(text, { size: 200, overlap: 0 });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.text).toBe('Intro line.\n\n## Section\n\nBody text.');
  });

  it('normalizes CRLF line endings when splitting paragraphs', () => {
    const text = 'Alpha paragraph.\r\n\r\nBeta paragraph.';

    const chunks = chunkMarkdown(text, { size: 100, overlap: 0 });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.text).toBe('Alpha paragraph.\n\nBeta paragraph.');
  });

  it('treats CRLF headings as separate blocks', () => {
    const text = 'Intro line.\r\n## Section\r\n\r\nBody text.';

    const chunks = chunkMarkdown(text, { size: 200, overlap: 0 });

    expect(chunks[0]?.text).toBe('Intro line.\n\n## Section\n\nBody text.');
  });
});

describe('chunkMarkdown merging', () => {
  it('splits into multiple chunks when joined block text exceeds size', () => {
    const blockA = 'a'.repeat(30);
    const blockB = 'b'.repeat(30);
    const blockC = 'c'.repeat(30);
    const text = `${blockA}\n\n${blockB}\n\n${blockC}`;

    const chunks = chunkMarkdown(text, { size: 65, overlap: 0 });

    expect(chunks).toHaveLength(2);
    expect(chunks[0]?.text).toBe(`${blockA}\n\n${blockB}`);
    expect(chunks[1]?.text).toBe(blockC);
  });

  it('keeps an oversized block intact in its own chunk', () => {
    const oversized = 'x'.repeat(120);
    const text = `${oversized}\n\nTail paragraph.`;

    const chunks = chunkMarkdown(text, { size: 100, overlap: 0 });

    expect(chunks).toHaveLength(2);
    expect(chunks[0]?.text).toBe(oversized);
    expect(chunks[1]?.text).toBe('Tail paragraph.');
  });
});

describe('chunkMarkdown overlap', () => {
  it('repeats trailing blocks from chunk 1 at the start of chunk 2', () => {
    const blockA = 'a'.repeat(20);
    const blockB = 'b'.repeat(20);
    const blockC = 'c'.repeat(20);
    const blockD = 'd'.repeat(20);
    const text = `${blockA}\n\n${blockB}\n\n${blockC}\n\n${blockD}`;

    const chunks = chunkMarkdown(text, { size: 50, overlap: 30 });

    expect(chunks).toHaveLength(3);
    expect(chunks[0]?.text).toBe(`${blockA}\n\n${blockB}`);
    expect(chunks[1]?.text).toBe(`${blockB}\n\n${blockC}`);
    expect(chunks[2]?.text).toBe(`${blockC}\n\n${blockD}`);
  });

  it('skips overlap when the trailing block alone exceeds the overlap budget', () => {
    const blockA = 'a'.repeat(20);
    const blockB = 'b'.repeat(40);
    const blockC = 'c'.repeat(20);
    const text = `${blockA}\n\n${blockB}\n\n${blockC}`;

    const chunks = chunkMarkdown(text, { size: 65, overlap: 30 });

    expect(chunks).toHaveLength(2);
    expect(chunks[0]?.text).toBe(`${blockA}\n\n${blockB}`);
    expect(chunks[1]?.text).toBe(blockC);
  });

  it('assigns zero-based chunkIndex values in order', () => {
    const blockA = 'a'.repeat(20);
    const blockB = 'b'.repeat(20);
    const blockC = 'c'.repeat(20);
    const text = `${blockA}\n\n${blockB}\n\n${blockC}`;

    const chunks = chunkMarkdown(text, { size: 45, overlap: 0 });

    expect(chunks.map((chunk: MarkdownChunk) => chunk.chunkIndex)).toEqual([0, 1]);
  });
});

describe('rag index barrel', () => {
  it('re-exports chunkMarkdown from the rag module entry', () => {
    expect(chunkMarkdownFromBarrel('Note.')).toEqual([{ chunkIndex: 0, text: 'Note.' }]);
    expect(defaultSizeFromBarrel).toBe(1000);
    expect(defaultOverlapFromBarrel).toBe(200);
  });
});
