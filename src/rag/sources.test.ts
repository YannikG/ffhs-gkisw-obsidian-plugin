import { describe, expect, it } from 'vitest';
import { shouldIndexVaultPath } from '../sources/should-index.js';

describe('shouldIndexVaultPath', () => {
  it('includes ordinary markdown files', () => {
    expect(shouldIndexVaultPath('course/lecture.md')).toBe(true);
  });

  it('excludes plugin summary outputs and summary.md', () => {
    expect(shouldIndexVaultPath('course/GKISW_summary.md')).toBe(false);
    expect(shouldIndexVaultPath('course/GKISW_summary_2.md')).toBe(false);
    expect(shouldIndexVaultPath('course/summary.md')).toBe(false);
  });

  it('excludes paths under .obsidian', () => {
    expect(shouldIndexVaultPath('.obsidian/plugins/x.md')).toBe(false);
    expect(shouldIndexVaultPath('course/.obsidian/cache.md')).toBe(false);
  });
});
