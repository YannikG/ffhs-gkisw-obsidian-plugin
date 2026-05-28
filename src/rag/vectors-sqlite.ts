import fs from 'fs';
import path from 'path';

export type SqliteStoredChunk = {
  vault_path: string;
  chunk_index: number;
  embedding_model?: string | null;
  text?: string | null;
  embedding: number[];
  mtime?: number | null;
  content_hash?: string | null;
};

/**
 * Lightweight SQLite-backed vectors DB.
 *
 * This module intentionally tries to load `better-sqlite3` at runtime.
 * If not installed, construction will throw with a helpful message.
 *
 * It stores embeddings as JSON in a TEXT column for portability in this
 * prototype. For production the SPEC recommends a dedicated vector column
 * (e.g. sqlite-wasm-vec) and ANN support.
 */
export class SqliteVectorsDB {
  private db: any;

  constructor(filePath?: string) {
    const resolved = filePath ?? path.resolve(process.cwd(), 'vectors.db');

    let BetterSqlite3: any;
    try {
      // Try to require at runtime; optional dependency.

      BetterSqlite3 = require('better-sqlite3');
    } catch {
      throw new Error(
        'better-sqlite3 is not installed. Install as devDependency for SQLite-backed vectors (npm i -D better-sqlite3) or use the JSON fallback vectors implementation.',
      );
    }

    const dir = path.dirname(resolved);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    this.db = new BetterSqlite3(resolved);
    this.migrate();
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chunks (
        vault_path TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        embedding_model TEXT,
        text TEXT,
        embedding TEXT NOT NULL,
        mtime INTEGER,
        content_hash TEXT,
        PRIMARY KEY (vault_path, chunk_index)
      );
    `);
  }

  upsertChunks(
    vaultPath: string,
    chunks: Array<{
      chunkIndex: number;
      text?: string;
      embedding: number[];
      embedding_model?: string;
      mtime?: number;
      content_hash?: string;
    }>,
  ): void {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO chunks (vault_path, chunk_index, embedding_model, text, embedding, mtime, content_hash)
      VALUES (@vault_path, @chunk_index, @embedding_model, @text, @embedding, @mtime, @content_hash);
    `);
    const txn = this.db.transaction((items: any[]) => {
      for (const it of items) insert.run(it);
    });

    const rows = chunks.map((c) => ({
      vault_path: vaultPath,
      chunk_index: c.chunkIndex,
      embedding_model: c.embedding_model ?? null,
      text: c.text ?? null,
      embedding: JSON.stringify(c.embedding),
      mtime: c.mtime ?? null,
      content_hash: c.content_hash ?? null,
    }));

    txn(rows);
  }

  deleteByVaultPath(vaultPath: string): void {
    const stmt = this.db.prepare('DELETE FROM chunks WHERE vault_path = ?');
    stmt.run(vaultPath);
  }

  queryByFolderPrefix(folderPrefix: string): SqliteStoredChunk[] {
    const normalized = folderPrefix.endsWith('/') ? folderPrefix : folderPrefix + '/';
    const stmt = this.db.prepare('SELECT * FROM chunks WHERE vault_path LIKE ?');
    const rows = stmt.all(normalized + '%');
    return rows.map((r: any) => ({
      vault_path: r.vault_path,
      chunk_index: r.chunk_index,
      embedding_model: r.embedding_model,
      text: r.text,
      embedding: JSON.parse(r.embedding),
      mtime: r.mtime,
      content_hash: r.content_hash,
    }));
  }

  truncateAll(): void {
    this.db.exec('DELETE FROM chunks');
  }

  searchSimilarInFolder(
    embedding: number[],
    folderPrefix: string,
    k: number,
  ): Array<{ vaultPath: string; chunkIndex: number; text?: string; similarity: number }> {
    const candidates = this.queryByFolderPrefix(folderPrefix);
    const scored = candidates
      .map((c) => ({ c, sim: cosineSimilarity(embedding, c.embedding) }))
      .filter((x) => !Number.isNaN(x.sim) && Number.isFinite(x.sim))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, k)
      .map((x) => ({
        vaultPath: x.c.vault_path,
        chunkIndex: x.c.chunk_index,
        text: x.c.text ?? undefined,
        similarity: x.sim,
      }));

    return scored;
  }
}

function dot(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += a[i]! * b[i]!;
  return s;
}

function norm(a: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * a[i]!;
  return Math.sqrt(s);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const na = norm(a);
  const nb = norm(b);
  if (na === 0 || nb === 0) return NaN;
  return dot(a, b) / (na * nb);
}

export function createSqliteVectorsDB(filePath?: string): SqliteVectorsDB {
  return new SqliteVectorsDB(filePath);
}
