import fs from 'fs';
import path from 'path';

export type StoredChunk = {
  vault_path: string;
  chunk_index: number;
  embedding_model?: string;
  text?: string;
  embedding: number[];
  mtime?: number;
  content_hash?: string;
};

export class VectorsDB {
  private filePath: string;
  private data: { chunks: StoredChunk[] };

  constructor(filePath?: string) {
    this.filePath = filePath ?? path.resolve(process.cwd(), 'vectors.db');
    this.data = { chunks: [] };
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.persist();
      }
    } catch (err) {
      // Corrupt file -> re-init
      this.data = { chunks: [] };
      this.persist();
    }
  }

  private persist(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(this.data), 'utf8');
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
    for (const c of chunks) {
      const existingIndex = this.data.chunks.findIndex(
        (s) => s.vault_path === vaultPath && s.chunk_index === c.chunkIndex,
      );

      const stored: StoredChunk = {
        vault_path: vaultPath,
        chunk_index: c.chunkIndex,
        text: c.text,
        embedding: c.embedding,
        embedding_model: c.embedding_model,
        mtime: c.mtime,
        content_hash: c.content_hash,
      };

      if (existingIndex >= 0) {
        this.data.chunks[existingIndex] = stored;
      } else {
        this.data.chunks.push(stored);
      }
    }

    this.persist();
  }

  deleteByVaultPath(vaultPath: string): void {
    this.data.chunks = this.data.chunks.filter((s) => s.vault_path !== vaultPath);
    this.persist();
  }

  queryByFolderPrefix(folderPrefix: string): StoredChunk[] {
    const normalized = folderPrefix.endsWith('/') ? folderPrefix : folderPrefix + '/';
    return this.data.chunks.filter((s) => s.vault_path.startsWith(normalized));
  }

  truncateAll(): void {
    this.data.chunks = [];
    this.persist();
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
        text: x.c.text,
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

export function createVectorsDB(filePath?: string): VectorsDB {
  return new VectorsDB(filePath);
}
