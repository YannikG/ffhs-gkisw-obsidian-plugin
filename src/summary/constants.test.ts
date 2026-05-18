import { describe, expect, it } from 'vitest';
import { SUMMARY_OUTPUT_FILENAME } from './constants.js';

describe('SUMMARY_OUTPUT_FILENAME', () => {
  it('is the canonical summary output name per SPEC', () => {
    expect(SUMMARY_OUTPUT_FILENAME).toBe('summary.md');
  });
});
