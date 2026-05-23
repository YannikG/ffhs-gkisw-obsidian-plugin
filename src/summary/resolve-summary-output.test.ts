import { describe, expect, it } from 'vitest';
import { resolveSummaryOutputFilename } from './resolve-summary-output.js';

describe('resolveSummaryOutputFilename', () => {
  it('returns base summary filename when no summary output exists yet', () => {
    expect(resolveSummaryOutputFilename('GKISW', [])).toBe('GKISW_summary.md');
  });

  it('returns version 2 when only the base summary exists', () => {
    expect(resolveSummaryOutputFilename('GKISW', ['GKISW_summary.md'])).toBe('GKISW_summary_2.md');
  });

  it('returns the next free version above existing outputs', () => {
    expect(
      resolveSummaryOutputFilename('Test Vault', [
        'Test_Vault_summary.md',
        'Test_Vault_summary_2.md',
      ]),
    ).toBe('Test_Vault_summary_3.md');
  });
});
