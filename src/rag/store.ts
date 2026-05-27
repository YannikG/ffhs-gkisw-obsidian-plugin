import path from 'path';

import { createVectorsDB } from './vectors.js';
import { createSqliteVectorsDB } from './vectors-sqlite.js';
import { createWasmVectorsDB } from './vectors-wasm.js';

export type VectorsStore =
  | ReturnType<typeof createVectorsDB>
  | ReturnType<typeof createSqliteVectorsDB>
  | ReturnType<typeof createWasmVectorsDB>
  | null;

let currentStore: VectorsStore = null;

/**
 * Open an index using the best available backend.
 * Tries WASM -> SQLite (better-sqlite3) -> JSON fallback.
 */
export function openIndex(filePath?: string): VectorsStore {
  if (currentStore) return currentStore;

  const resolved = filePath ?? path.resolve(process.cwd(), 'vectors.db');

  // Try WASM first
  try {
    currentStore = createWasmVectorsDB(resolved);
    return currentStore;
  } catch (_err) {
    // swallow and try next
  }

  // Try SQLite (better-sqlite3)
  try {
    currentStore = createSqliteVectorsDB(resolved);
    return currentStore;
  } catch (_err) {
    // swallow and fall back
  }

  // Fallback JSON file-based store
  currentStore = createVectorsDB(resolved);
  return currentStore;
}

/**
 * Try to derive a plugin-appropriate data path from a Plugin-like object and
 * open the index under that path. This helper is tolerant: if no path can be
 * derived the default openIndex() is used.
 */
export function openIndexForPlugin(pluginLike: unknown): VectorsStore {
  // Try common plugin properties in a defensive manner
  try {
    if (pluginLike && typeof pluginLike === 'object') {
      const p = pluginLike as Record<string, unknown>;

      // Known possible plugin-side data dir hints
      const candidates = [p['dataDir'], p['dataPath'], p['dataDirPath'], p['pluginPath']];

      // Manifest-based location (not always present in tests)
      if (
        p.manifest &&
        typeof p.manifest === 'object' &&
        typeof (p.manifest as any).id === 'string'
      ) {
        candidates.push(path.resolve(process.cwd(), String((p.manifest as any).id)));
      }

      for (const c of candidates) {
        if (typeof c === 'string' && c.length > 0) {
          const dbPath = path.join(c, 'vectors.db');
          return openIndex(dbPath);
        }
      }
    }
  } catch (_err) {
    // ignore and fallback to default
  }

  return openIndex();
}

export function getIndex(): VectorsStore {
  return currentStore;
}

export function closeIndex(): void {
  if (!currentStore) return;

  try {
    // attempt graceful close on known backends
    if (currentStore && typeof currentStore === 'object') {
      // Narrow via unknown first to satisfy TypeScript when union members
      // do not share an index signature. This preserves runtime behaviour
      // while keeping type assertions explicit.
      const asObj = currentStore as unknown as Record<string, unknown>;
      const closeFn = asObj['close'];
      if (typeof closeFn === 'function') {
        (closeFn as Function).call(asObj);
      }
      const db = asObj['db'];
      if (db && typeof (db as Record<string, unknown>)['close'] === 'function') {
        (db as Record<string, unknown>)['close'] as unknown;
        try {
          // call the db.close() if present
          (db as unknown as { close?: Function }).close?.();
        } catch (_e) {
          // ignore
        }
      }
    }
  } catch (_err) {
    // ignore errors during close
  } finally {
    currentStore = null;
  }
}
