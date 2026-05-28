import path from 'path';
import fs from 'fs';

/**
 * Prototype wrapper for a sqlite-wasm-vec backed vectors DB.
 *
 * This module intentionally does a runtime require/import of the wasm-backed
 * sqlite bundle. If not installed or not bundled, the constructor throws a
 * helpful error explaining next steps for the developer (install or build).
 */
export class WasmVectorsDB {
  private impl: unknown;

  constructor(filePath?: string) {
    // Try to load the wasm-backed module at runtime. Keep the error message
    // actionable for contributors: install package or use the JSON/SQLite fallbacks.
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const wasmModule = require('sqlite-wasm-vec');
      if (!wasmModule || typeof wasmModule.createDb !== 'function') {
        // Keep the error message unified so tests and users receive the same
        // actionable guidance whether the module is missing or its API differs.
        throw new Error(
          'sqlite-wasm-vec is not available or not bundled. To enable the WASM-backed vectors DB install and bundle `sqlite-wasm-vec` according to docs, or fall back to the JSON/SQLite adapter.',
        );
      }

      const resolved = filePath ?? path.resolve(process.cwd(), 'vectors.db');
      const dir = path.dirname(resolved);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // Initialize the wasm-backed DB (API details depend on package); adapt later.
      this.impl = wasmModule.createDb(resolved);
    } catch (err: unknown) {
      throw new Error(
        'sqlite-wasm-vec is not available or not bundled. To enable the WASM-backed vectors DB install and bundle `sqlite-wasm-vec` according to docs, or fall back to the JSON/SQLite adapter. See docs/roadmap/phase-6/issues/P6-I03-vectors-db-schema.md for guidance. Original error: ' +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  }

  // The methods below are placeholders delegating to the wasm implementation.
  upsertChunks(): void {
    if (!this.impl) throw new Error('WASM Vectors DB not initialized');
    // Implementation depends on sqlite-wasm-vec API; to be implemented when
    // the dependency and bundling strategy is selected.
    throw new Error('Not implemented: upsertChunks for WASM Vectors DB');
  }

  deleteByVaultPath(): void {
    throw new Error('Not implemented: deleteByVaultPath for WASM Vectors DB');
  }

  queryByFolderPrefix(): void {
    throw new Error('Not implemented: queryByFolderPrefix for WASM Vectors DB');
  }

  truncateAll(): void {
    throw new Error('Not implemented: truncateAll for WASM Vectors DB');
  }

  searchSimilarInFolder(): void {
    throw new Error('Not implemented: searchSimilarInFolder for WASM Vectors DB');
  }
}

export function createWasmVectorsDB(filePath?: string): WasmVectorsDB {
  return new WasmVectorsDB(filePath);
}
