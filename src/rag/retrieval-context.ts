import type { RetrieveTopKChunk } from './retrieve-top-k.js';

export function buildRetrievalContext(chunks: RetrieveTopKChunk[]): string {
  return chunks
    .map((chunk) => {
      const heading =
        chunk.chunkIndex > 0
          ? `### \`${chunk.vaultPath}\` (chunk ${chunk.chunkIndex})`
          : `### \`${chunk.vaultPath}\``;
      return `${heading}\n${chunk.text ?? ''}`;
    })
    .join('\n---\n');
}
