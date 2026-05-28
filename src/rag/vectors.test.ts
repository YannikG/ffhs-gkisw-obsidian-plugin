import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createVectorsDB } from './vectors.js';

const TMP_DIR = path.resolve(process.cwd(), 'tmp-test-vectors');
const DB_PATH = path.join(TMP_DIR, 'vectors.db');

beforeEach(() => {
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TMP_DIR, { recursive: true });
});

afterEach(() => {
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }
});

describe('VectorsDB basic lifecycle', () => {
  it('upsert -> query -> search -> delete roundtrip', () => {
    const db = createVectorsDB(DB_PATH);

    // Two chunks in same folder
    const fileA = 'notes/folder/fileA.md';
    const fileB = 'notes/folder/sub/fileB.md';

    const emb1 = [1, 0, 0];
    const emb2 = [0.9, 0.1, 0];

    db.upsertChunks(fileA, [
      { chunkIndex: 0, text: 'Hello A0', embedding: emb1, embedding_model: 'm1' },
    ]);

    db.upsertChunks(fileB, [
      { chunkIndex: 0, text: 'Hello B0', embedding: emb2, embedding_model: 'm1' },
    ]);

    // Query by folder prefix should return both when prefix is 'notes'
    const qAll = db.queryByFolderPrefix('notes');
    expect(qAll.length).toBeGreaterThanOrEqual(2);

    // searchSimilarInFolder with embedding close to emb1 should rank fileA first
    const res = db.searchSimilarInFolder([1, 0, 0], 'notes', 2);
    expect(res.length).toBeLessThanOrEqual(2);
    expect(res[0].vaultPath).toMatch(/fileA.md|fileA/);

    // deleteByVaultPath removes fileA chunks
    db.deleteByVaultPath(fileA);
    const afterDel = db.queryByFolderPrefix('notes');
    expect(afterDel.find((c) => c.vault_path === fileA)).toBeUndefined();

    // truncateAll empties DB
    db.truncateAll();
    const afterTrunc = db.queryByFolderPrefix('notes');
    expect(afterTrunc.length).toBe(0);
  });
});
