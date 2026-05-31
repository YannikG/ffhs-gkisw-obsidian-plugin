import { describe, expect, it } from 'vitest';
import { retrieveTopKForFolder } from './retrieve-top-k.js';

const mockEmbed = (vec: number[]) => async (_inputs: string[]) => ({
  ok: true as const,
  value: [vec],
});

const mockEmbedError = async (_inputs: string[]) => ({
  ok: false as const,
  error: { kind: 'connection' as const, message: 'offline' },
});

const storeChunk = (vaultPath: string, chunkIndex: number, text: string) => ({
  vaultPath,
  chunkIndex,
  text,
  similarity: 0.9,
});

const expectedChunk = (vaultPath: string, chunkIndex: number, text: string) => ({
  vaultPath,
  chunkIndex,
  text,
});

describe('retrieveTopKForFolder', () => {
  it('returns all 3 chunks when k=8 exceeds available count', async () => {
    const storeChunks = [
      storeChunk('folder/a.md', 0, 'Alpha'),
      storeChunk('folder/b.md', 0, 'Beta'),
      storeChunk('folder/c.md', 0, 'Gamma'),
    ];
    const store = { searchSimilarInFolder: () => storeChunks };

    const result = await retrieveTopKForFolder({
      folderPath: 'folder',
      queryText: 'query',
      k: 8,
      embed: mockEmbed([1, 0]),
      store,
    });

    expect(result).toEqual({
      ok: true,
      chunks: [
        expectedChunk('folder/a.md', 0, 'Alpha'),
        expectedChunk('folder/b.md', 0, 'Beta'),
        expectedChunk('folder/c.md', 0, 'Gamma'),
      ],
    });
  });

  it('propagates embed error when embedding fails', async () => {
    const store = { searchSimilarInFolder: () => [] };

    const result = await retrieveTopKForFolder({
      folderPath: 'folder',
      queryText: 'query',
      k: 8,
      embed: mockEmbedError,
      store,
    });

    expect(result).toEqual({
      ok: false,
      error: { kind: 'connection', message: 'offline' },
    });
  });

  it('returns ok with empty array when store has no chunks in scope', async () => {
    const store = { searchSimilarInFolder: () => [] };

    const result = await retrieveTopKForFolder({
      folderPath: 'folder',
      queryText: 'query',
      k: 8,
      embed: mockEmbed([1, 0]),
      store,
    });

    expect(result).toEqual({ ok: true, chunks: [] });
  });

  it('returns only k=2 chunks when store returns exactly 2', async () => {
    const storeChunks = [
      storeChunk('folder/a.md', 0, 'Alpha'),
      storeChunk('folder/b.md', 0, 'Beta'),
    ];
    const store = { searchSimilarInFolder: () => storeChunks };

    const result = await retrieveTopKForFolder({
      folderPath: 'folder',
      queryText: 'query',
      k: 2,
      embed: mockEmbed([1, 0]),
      store,
    });

    expect(result).toEqual({
      ok: true,
      chunks: [expectedChunk('folder/a.md', 0, 'Alpha'), expectedChunk('folder/b.md', 0, 'Beta')],
    });
  });
});
