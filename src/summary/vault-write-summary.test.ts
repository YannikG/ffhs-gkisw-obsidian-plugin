import type { TFile, TFolder, Vault } from 'obsidian';
import { describe, expect, it } from 'vitest';
import { writeSummaryMarkdownToFolder } from './vault-write-summary.js';
import { TFile as StubFile, TFolder as StubFolder, Vault as StubVault } from '../test-utils/obsidian-stub.js';

function mdFile(path: string, name: string): TFile {
  const file = new StubFile();
  file.path = path;
  file.name = name;
  file.extension = 'md';
  return file as unknown as TFile;
}

function folder(path: string, name: string, children: TFile[]): TFolder {
  const dir = new StubFolder();
  dir.path = path;
  dir.name = name;
  dir.children = children as unknown as StubFolder['children'];
  return dir as unknown as TFolder;
}

describe('writeSummaryMarkdownToFolder', () => {
  it('writes the base summary file on first run', async () => {
    const vault = new StubVault() as unknown as Vault;
    const stubVault = vault as unknown as StubVault;
    const root = folder('course', 'course', []);

    const result = await writeSummaryMarkdownToFolder(vault, root, '# Summary');

    expect(result).toEqual({
      path: 'course/course_summary.md',
      filename: 'course_summary.md',
    });
    expect(stubVault.getContent('course/course_summary.md')).toBe('# Summary');
  });

  it('writes a versioned file without overwriting the base summary', async () => {
    const vault = new StubVault() as unknown as Vault;
    const stubVault = vault as unknown as StubVault;
    stubVault.setContent('course/GKISW_summary.md', 'keep');
    const root = folder('course', 'GKISW', [mdFile('course/GKISW_summary.md', 'GKISW_summary.md')]);

    const result = await writeSummaryMarkdownToFolder(vault, root, '# v2');

    expect(result).toEqual({
      path: 'course/GKISW_summary_2.md',
      filename: 'GKISW_summary_2.md',
    });
    expect(stubVault.getContent('course/GKISW_summary.md')).toBe('keep');
    expect(stubVault.getContent('course/GKISW_summary_2.md')).toBe('# v2');
  });

  it('returns path and filename for the created summary', async () => {
    const vault = new StubVault() as unknown as Vault;
    const root = folder('course', 'GKISW', []);

    const result = await writeSummaryMarkdownToFolder(vault, root, 'text');

    expect(result).toEqual({
      path: 'course/GKISW_summary.md',
      filename: 'GKISW_summary.md',
    });
  });
});
