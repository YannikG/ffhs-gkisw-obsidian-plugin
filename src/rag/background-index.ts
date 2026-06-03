import type { OllamaResult } from '../ollama/types.js';
import { chunkMarkdown } from './chunking.js';
import { Orchestrator } from './orchestrator.js';
import { getIndex, getOrchestrator, setOrchestrator } from './store.js';

export type RagVaultPorts = {
  getAllVaultPaths: () => string[];
  getFilesUnderFolder: (folderPath: string) => Promise<string[]>;
  onModify: (handler: (path: string) => void) => () => void;
  onDelete: (handler: (path: string) => void) => () => void;
  onCreate: (handler: (path: string) => void) => () => void;
  readFile: (vaultPath: string) => Promise<string>;
  embed: (inputs: string[]) => Promise<OllamaResult<number[][]>>;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
};

export type NoticePort = (message: string) => void;

let disposeHandlers: Array<() => void> = [];

async function indexFile(vaultPath: string, ports: RagVaultPorts): Promise<void> {
  const content = await ports.readFile(vaultPath);
  const chunks = chunkMarkdown(content, { size: ports.chunkSize, overlap: ports.chunkOverlap });
  if (chunks.length === 0) return;
  const embedResult = await ports.embed(chunks.map((c) => c.text));
  if (!embedResult.ok || embedResult.value.length !== chunks.length) return;
  const store = getIndex();
  if (!store) return;
  store.upsertChunks(
    vaultPath,
    chunks.map((chunk, i) => ({
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
      embedding: embedResult.value[i] ?? [],
      embedding_model: ports.embeddingModel,
    })),
  );
}

export function startBackgroundIndex(ports: RagVaultPorts): void {
  disposeBackgroundIndex();

  const orchestrator = new Orchestrator({
    indexHandler: (vaultPath) => indexFile(vaultPath, ports),
    deleteHandler: async (vaultPath) => {
      getIndex()?.deleteByVaultPath(vaultPath);
    },
    listFilesUnderFolder: (folderPath) => ports.getFilesUnderFolder(folderPath),
  });

  disposeHandlers = [
    ports.onModify((path) => void orchestrator.handleFileChange(path)),
    ports.onDelete((path) => void orchestrator.handleFileDelete(path)),
    ports.onCreate((path) => orchestrator.addToIdleQueue(path)),
  ];

  orchestrator.addToIdleQueue(ports.getAllVaultPaths());
  setOrchestrator(orchestrator);
}

export function disposeBackgroundIndex(): void {
  for (const dispose of disposeHandlers) dispose();
  disposeHandlers = [];
  setOrchestrator(null);
}

export { getOrchestrator } from './store.js';

export async function indexFolderScopeWithNotice(
  folderPath: string,
  noticePort: NoticePort,
): Promise<void> {
  const orch = getOrchestrator();
  if (!orch) return;
  noticePort(`Indexiere ${folderPath}…`);
  await orch.indexFolderScope(folderPath);
}

export function resetIndex(): void {
  getIndex()?.truncateAll();
}
