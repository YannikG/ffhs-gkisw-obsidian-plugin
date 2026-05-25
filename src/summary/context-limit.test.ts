import { describe, expect, it } from 'vitest';
import { isSourceContextOverLimit } from './context-limit.js';

describe('isSourceContextOverLimit', () => {
  it('returns false when length equals the limit', () => {
    expect(isSourceContextOverLimit('a'.repeat(100), 100)).toBe(false);
  });

  it('returns true when length exceeds the limit', () => {
    expect(isSourceContextOverLimit('a'.repeat(101), 100)).toBe(true);
  });

  it('returns false for empty context within limit', () => {
    expect(isSourceContextOverLimit('', 32_000)).toBe(false);
  });
});
