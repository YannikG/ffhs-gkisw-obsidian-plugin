/**
 * Orchestrator for idle-indexing and vault-events (P6-I04)
 *
 * Implementation is purposely small and testable by dependency injection:
 * - indexHandler(vaultPath) is invoked to index a single file
 * - deleteHandler(vaultPath) is invoked on delete events
 * - listFilesUnderFolder(folderPath) enumerates files for indexFolderScope
 *
 * Idle behaviour: process up to `idleBatchSize` files per tick. A tick can be
 * scheduled via requestIdleCallback when available; tests call processIdleTick()
 * directly to keep deterministic.
 */

export type IndexHandler = (vaultPath: string) => Promise<void>;
export type DeleteHandler = (vaultPath: string) => Promise<void> | void;
export type ListFilesUnderFolder = (folderPath: string) => Promise<string[]>;

export class Orchestrator {
  private idleQueue = new Set<string>();
  private scheduled = false;
  private readonly idleBatchSize: number;
  private readonly indexHandler: IndexHandler;
  private readonly deleteHandler: DeleteHandler;
  private readonly listFilesUnderFolder?: ListFilesUnderFolder;

  constructor(opts: {
    indexHandler: IndexHandler;
    deleteHandler: DeleteHandler;
    listFilesUnderFolder?: ListFilesUnderFolder;
    idleBatchSize?: number;
  }) {
    this.indexHandler = opts.indexHandler;
    this.deleteHandler = opts.deleteHandler;
    this.listFilesUnderFolder = opts.listFilesUnderFolder;
    this.idleBatchSize = opts.idleBatchSize ?? 3;
  }

  // Enqueue file paths for background (idle) processing
  addToIdleQueue(paths: string[] | string): void {
    const arr = Array.isArray(paths) ? paths : [paths];
    for (const p of arr) this.idleQueue.add(p);
    this.maybeScheduleIdle();
  }

  // Called by Obsidian event: file changed -> process immediately (priority)
  async handleFileChange(vaultPath: string): Promise<void> {
    // Ensure this change is processed now (event priority)
    // Remove from idle queue if present to avoid duplicate work
    this.idleQueue.delete(vaultPath);
    // Cancel scheduled idle tick; events have priority
    this.cancelScheduledIdle();
    await this.indexHandler(vaultPath);
    // Reschedule idle processing for remaining items
    this.maybeScheduleIdle();
  }

  // Called by Obsidian event: file deleted -> delegate to deleteHandler
  async handleFileDelete(vaultPath: string): Promise<void> {
    // Remove any queued entries
    this.idleQueue.delete(vaultPath);
    await this.deleteHandler(vaultPath);
  }

  // Blocking index of an entire folder-scope. Will enumerate via provided
  // listFilesUnderFolder and invoke indexHandler for each file synchronously.
  // Returns when the whole tree is indexed.
  async indexFolderScope(folderPath: string): Promise<void> {
    if (!this.listFilesUnderFolder) throw new Error('listFilesUnderFolder not provided');
    const files = await this.listFilesUnderFolder(folderPath);
    // Sort alphabetically ascending by vaultPath
    files.sort((a, b) => a.localeCompare(b));
    for (const f of files) {
      // Ensure immediate processing and remove from queue if present
      this.idleQueue.delete(f);
      await this.indexHandler(f);
    }
  }

  // Process one idle tick: take up to idleBatchSize entries and run indexHandler
  // Returns a Promise that resolves when the batch completes.
  async processIdleTick(): Promise<void> {
    const toProcess: string[] = [];
    for (const p of this.idleQueue) {
      if (toProcess.length >= this.idleBatchSize) break;
      toProcess.push(p);
    }

    for (const p of toProcess) {
      this.idleQueue.delete(p);
      // Call indexHandler but ensure errors do not abort remaining work
      try {
        await this.indexHandler(p);
      } catch {
        // ignore individual errors
      }
    }
  }

  // Internal: schedule an idle tick using requestIdleCallback when available
  private maybeScheduleIdle(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    const cb = async () => {
      this.scheduled = false;
      await this.processIdleTick();
      // If queue still has items, schedule next tick
      if (this.idleQueue.size > 0) this.maybeScheduleIdle();
    };

    if (typeof (globalThis as any).requestIdleCallback === 'function') {
      // avoid referencing DOM types like IdleRequestCallback to keep this
      // module testable in non-DOM environments — cast to any
      (globalThis as any).requestIdleCallback(cb as any);
    } else {
      // Fallback for environments without requestIdleCallback
      setTimeout(cb, 50);
    }
  }

  private cancelScheduledIdle(): void {
    // For simplicity just clear the scheduled flag; if a callback is already
    // enqueued it may still run — implementation could be extended to keep
    // a handle to the timer/requestIdleCallback id.
    this.scheduled = false;
  }
}

export default Orchestrator;
