export {
  chunkMarkdown,
  DEFAULT_CHUNK_OVERLAP,
  DEFAULT_CHUNK_SIZE,
  type ChunkMarkdownOptions,
  type MarkdownChunk,
} from './chunking.js';

export { openIndex, openIndexForPlugin, closeIndex, getIndex, type VectorsStore } from './store.js';
export { Orchestrator } from './orchestrator.js';

export {
  startBackgroundIndex,
  disposeBackgroundIndex,
  indexFolderScopeWithNotice,
  resetIndex,
  getOrchestrator,
  type RagVaultPorts,
  type NoticePort,
} from './background-index.js';
