import { Orchestrator } from './orchestrator.js';
import { getIndex, getOrchestrator, setOrchestrator } from './store.js';

export type RagVaultPorts = {
  getAllVaultPaths: () => string[];
  getFilesUnderFolder: (folderPath: string) => Promise<string[]>;
  onModify: (handler: (path: string) => void) => () => void;
  onDelete: (handler: (path: string) => void) => () => void;
  onCreate: (handler: (path: string) => void) => () => void;
};

export type NoticePort = (message: string) => void;

let disposeHandlers: Array<() => void> = [];

export function startBackgroundIndex(ports: RagVaultPorts): void {
  disposeBackgroundIndex();

  const orchestrator = new Orchestrator({
    indexHandler: async () => {},
    deleteHandler: async () => {},
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
