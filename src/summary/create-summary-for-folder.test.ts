import { describe, expect, it } from 'vitest';
import * as mod from './create-summary-for-folder.js';

describe('create-summary-for-folder exports', () => {
  it('does not export runCreateSummaryForFolder (P5 full-corpus path removed)', () => {
    expect('runCreateSummaryForFolder' in mod).toBe(false);
  });
});
