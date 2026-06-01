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
  retrieveTopKForFolder,
  type RetrieveTopKChunk,
  type RetrieveTopKResult,
  type RetrieveTopKStore,
  type RetrieveTopKParams,
} from './retrieve-top-k.js';

export { buildRetrievalContext } from './retrieval-context.js';

export {
  startBackgroundIndex,
  disposeBackgroundIndex,
  indexFolderScopeWithNotice,
  resetIndex,
  getOrchestrator,
  type RagVaultPorts,
  type NoticePort,
} from './background-index.js';
