import { describe, expect, it } from 'vitest';
import {
  buildSummaryOutputFilename,
  isExcludedSummarySource,
  isSummaryOutputFilename,
  nextSummaryOutputVersion,
  sanitizeFolderBasename,
} from './filename.js';

describe('sanitizeFolderBasename', () => {
  it('uses last path segment and replaces invalid characters', () => {
    expect(sanitizeFolderBasename('notes/week 1')).toBe('week_1');
    expect(sanitizeFolderBasename('notes\\week 2')).toBe('week_2');
  });

  it('falls back when segment is empty after sanitization', () => {
    expect(sanitizeFolderBasename('...')).toBe('folder');
  });

  it('replaces whitespace in folder names with underscores', () => {
    expect(sanitizeFolderBasename('Test Vault')).toBe('Test_Vault');
    expect(sanitizeFolderBasename('  My Lecture Notes  ')).toBe('My_Lecture_Notes');
    expect(sanitizeFolderBasename('foo   bar')).toBe('foo_bar');
    expect(sanitizeFolderBasename('courses/semester 1/week 3')).toBe('week_3');
    expect(sanitizeFolderBasename('courses\\Test Vault\\week 3')).toBe('week_3');
  });
});

describe('buildSummaryOutputFilename', () => {
  it('builds base summary name per SPEC', () => {
    expect(buildSummaryOutputFilename('GKISW')).toBe('GKISW_summary.md');
  });

  it('builds versioned summary name from version 2 upward', () => {
    expect(buildSummaryOutputFilename('GKISW', 2)).toBe('GKISW_summary_2.md');
    expect(buildSummaryOutputFilename('GKISW', 3)).toBe('GKISW_summary_3.md');
  });

  it('treats version 1 like the base file', () => {
    expect(buildSummaryOutputFilename('GKISW', 1)).toBe('GKISW_summary.md');
  });

  it('treats non-integer version as base file', () => {
    expect(buildSummaryOutputFilename('GKISW', 2.5)).toBe('GKISW_summary.md');
  });

  it('sanitizes folder names with whitespace', () => {
    expect(buildSummaryOutputFilename('Test Vault')).toBe('Test_Vault_summary.md');
    expect(buildSummaryOutputFilename('My Lecture Notes', 2)).toBe(
      'My_Lecture_Notes_summary_2.md',
    );
    expect(buildSummaryOutputFilename('courses/semester 1')).toBe(
      'semester_1_summary.md',
    );
  });
});

describe('isSummaryOutputFilename', () => {
  it('matches plugin summary output patterns', () => {
    expect(isSummaryOutputFilename('lecture_summary.md')).toBe(true);
    expect(isSummaryOutputFilename('lecture_summary_2.md')).toBe(true);
    expect(isSummaryOutputFilename('notes/lecture_summary_3.md')).toBe(true);
  });

  it('rejects unrelated markdown files', () => {
    expect(isSummaryOutputFilename('summary.md')).toBe(false);
    expect(isSummaryOutputFilename('lecture-notes.md')).toBe(false);
  });
});

describe('isExcludedSummarySource', () => {
  it('includes legacy summary.md and plugin output patterns', () => {
    expect(isExcludedSummarySource('summary.md')).toBe(true);
    expect(isExcludedSummarySource('lecture_summary_2.md')).toBe(true);
    expect(isExcludedSummarySource('lecture-notes.md')).toBe(false);
  });
});

describe('nextSummaryOutputVersion', () => {
  it('returns 1 when no summary output exists yet', () => {
    expect(nextSummaryOutputVersion('GKISW', [])).toBe(1);
    expect(nextSummaryOutputVersion('GKISW', ['other.md'])).toBe(1);
  });

  it('returns 2 when only the base summary exists', () => {
    expect(
      nextSummaryOutputVersion('GKISW', ['GKISW_summary.md', 'other.md']),
    ).toBe(2);
  });

  it('returns one above the highest existing version', () => {
    expect(
      nextSummaryOutputVersion('GKISW', [
        'GKISW_summary.md',
        'GKISW_summary_2.md',
        'GKISW_summary_4.md',
      ]),
    ).toBe(5);
  });

  it('ignores malformed version suffixes', () => {
    expect(
      nextSummaryOutputVersion('GKISW', [
        'GKISW_summary.md',
        'GKISW_summary_2extra.md',
      ]),
    ).toBe(2);
  });

  it('matches existing outputs for sanitized whitespace folder names', () => {
    expect(
      nextSummaryOutputVersion('Test Vault', ['Test_Vault_summary.md']),
    ).toBe(2);
    expect(
      nextSummaryOutputVersion('My Lecture Notes', [
        'My_Lecture_Notes_summary.md',
        'My_Lecture_Notes_summary_2.md',
      ]),
    ).toBe(3);
  });
});
