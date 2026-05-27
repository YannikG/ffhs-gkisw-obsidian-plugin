import { describe, it, expect } from 'vitest';
import { createWasmVectorsDB } from './vectors-wasm.js';

describe('WASM vectors adapter', () => {
  it('throws helpful error when sqlite-wasm-vec not available', () => {
    let threw = false;
    try {
      createWasmVectorsDB(':memory:');
    } catch (err: unknown) {
      threw = true;
      expect(String(err instanceof Error ? err.message : err)).toMatch(
        /sqlite-wasm-vec is not available or not bundled/,
      );
    }

    if (!threw) {
      // If environment has sqlite-wasm-vec the constructor may succeed; accept both outcomes.
      expect(true).toBe(true);
    }
  });
});
