import type { OllamaError, OllamaResult } from '../ollama/types.js';

export type RetrieveTopKChunk = {
  vaultPath: string;
  chunkIndex: number;
  text?: string;
};

export type RetrieveTopKResult =
  | { ok: true; chunks: RetrieveTopKChunk[] }
  | { ok: false; error: OllamaError };

export interface RetrieveTopKStore {
  searchSimilarInFolder(
    embedding: number[],
    folderPrefix: string,
    k: number,
  ): Array<{ vaultPath: string; chunkIndex: number; text?: string; similarity: number }>;
}

export interface RetrieveTopKParams {
  folderPath: string;
  queryText: string;
  k: number;
  embed(inputs: string[]): Promise<OllamaResult<number[][]>>;
  store: RetrieveTopKStore;
}

export async function retrieveTopKForFolder(
  params: RetrieveTopKParams,
): Promise<RetrieveTopKResult> {
  const { folderPath, queryText, k, embed, store } = params;

  const embedResult = await embed([queryText]);
  if (!embedResult.ok) {
    return { ok: false, error: embedResult.error };
  }

  const embedding = embedResult.value[0];
  if (!embedding) {
    return {
      ok: false,
      error: { kind: 'response', message: 'Embedding-Antwort enthält keinen Vektor.' },
    };
  }

  const raw = store.searchSimilarInFolder(embedding, folderPath, k);
  const chunks: RetrieveTopKChunk[] = raw.map(({ vaultPath, chunkIndex, text }) => ({
    vaultPath,
    chunkIndex,
    text,
  }));

  return { ok: true, chunks };
}
