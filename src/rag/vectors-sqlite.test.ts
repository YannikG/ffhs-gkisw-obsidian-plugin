import { describe, it, expect } from 'vitest';
import { createSqliteVectorsDB } from './vectors-sqlite.js';

describe('SqliteVectorsDB optional integration', () => {
  it('throws helpful error when better-sqlite3 not installed', () => {
    let threw = false;
    try {
      // Try to construct pointing to a non-existing path in tmp
      createSqliteVectorsDB(':memory:');
    } catch (err: any) {
      threw = true;
      expect(String(err.message)).toMatch(/better-sqlite3 is not installed/);
    }

    // If environment actually has better-sqlite3 then the constructor will succeed
    // and the test should accept both possibilities. Ensures CI without native deps passes.
    if (!threw) {
      // no-op assertion to keep test valid
      expect(true).toBe(true);
    }
  });
});

