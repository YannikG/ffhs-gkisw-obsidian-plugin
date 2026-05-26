/**
 * Paragraph-aware markdown chunking for RAG embeddings (P6-I01).
 * @see {@link ../../SPEC.md} §4.2, §6
 */

export const DEFAULT_CHUNK_SIZE = 1000;
export const DEFAULT_CHUNK_OVERLAP = 200;

const BLOCK_SEPARATOR = '\n\n';
const BLOCK_SEPARATOR_LENGTH = BLOCK_SEPARATOR.length;

export type MarkdownChunk = {
  chunkIndex: number;
  text: string;
};

export type ChunkMarkdownOptions = {
  size?: number;
  overlap?: number;
};

const HEADING_LINE = /^#{1,6}\s/;

function normalizeMarkdownText(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function splitIntoBlocks(text: string): string[] {
  const normalized = normalizeMarkdownText(text);
  if (normalized.length === 0) {
    return [];
  }

  const blocks: string[] = [];
  const lines = normalized.split('\n');
  let current: string[] = [];

  const flush = (): void => {
    if (current.length > 0) {
      blocks.push(current.join('\n'));
      current = [];
    }
  };

  for (const line of lines) {
    if (HEADING_LINE.test(line)) {
      flush();
      blocks.push(line);
      continue;
    }

    if (line.trim().length === 0) {
      flush();
      continue;
    }

    current.push(line);
  }

  flush();
  return blocks;
}

function joinedLength(blocks: readonly string[]): number {
  if (blocks.length === 0) {
    return 0;
  }

  return blocks.reduce(
    (total, block, index) => total + block.length + (index > 0 ? BLOCK_SEPARATOR_LENGTH : 0),
    0,
  );
}

function joinBlocks(blocks: readonly string[]): string {
  return blocks.join(BLOCK_SEPARATOR);
}

function selectTrailingOverlapBlocks(blocks: readonly string[], overlap: number): string[] {
  const selected: string[] = [];
  let length = 0;

  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const block = blocks[index]!;
    const separatorLength = selected.length > 0 ? BLOCK_SEPARATOR_LENGTH : 0;
    const nextLength = block.length + separatorLength + length;

    if (nextLength > overlap) {
      break;
    }

    selected.unshift(block);
    length = nextLength;
  }

  return selected;
}

function mergeBlocksWithOverlap(
  blocks: readonly string[],
  size: number,
  overlap: number,
): string[] {
  const chunks: string[] = [];
  let index = 0;
  let overlapBlocks: string[] = [];

  while (index < blocks.length) {
    const chunkBlocks: string[] = [...overlapBlocks];
    let currentLength = joinedLength(chunkBlocks);
    const overlapPrefixCount = overlapBlocks.length;

    while (index < blocks.length) {
      const block = blocks[index]!;
      const separatorLength = chunkBlocks.length > 0 ? BLOCK_SEPARATOR_LENGTH : 0;
      const nextLength = currentLength + separatorLength + block.length;

      if (nextLength <= size) {
        chunkBlocks.push(block);
        currentLength = nextLength;
        index += 1;
        continue;
      }

      if (chunkBlocks.length <= overlapPrefixCount) {
        chunkBlocks.push(block);
        currentLength = nextLength;
        index += 1;
      }

      break;
    }

    chunks.push(joinBlocks(chunkBlocks));
    overlapBlocks = selectTrailingOverlapBlocks(chunkBlocks, overlap);
  }

  return chunks;
}

function resolveChunkMarkdownOptions(options: ChunkMarkdownOptions): {
  size: number;
  overlap: number;
} {
  const rawSize = options.size ?? DEFAULT_CHUNK_SIZE;
  const rawOverlap = options.overlap ?? DEFAULT_CHUNK_OVERLAP;

  return {
    size: rawSize > 0 ? Math.floor(rawSize) : DEFAULT_CHUNK_SIZE,
    overlap: rawOverlap >= 0 ? Math.floor(rawOverlap) : DEFAULT_CHUNK_OVERLAP,
  };
}

/**
 * Splits markdown source text into ordered embedding chunks.
 * Invalid `size` (≤ 0) or negative `overlap` fall back to exported defaults.
 */
export function chunkMarkdown(text: string, options: ChunkMarkdownOptions = {}): MarkdownChunk[] {
  const { size, overlap } = resolveChunkMarkdownOptions(options);
  const blocks = splitIntoBlocks(text);
  const chunkTexts = mergeBlocksWithOverlap(blocks, size, overlap);

  return chunkTexts.map((chunkText, chunkIndex) => ({
    chunkIndex,
    text: chunkText,
  }));
}
