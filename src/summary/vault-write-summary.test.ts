import type { TFolder, Vault } from 'obsidian';
import { describe, expect, it } from 'vitest';
import {
  collectMarkdownBasenamesRecursive,
  writeSummaryMarkdownToFolder,
} from './vault-write-summary.js';
import { TFile, TFolder as StubFolder, Vault as StubVault } from '../test-utils/obsidian-stub.js';

function mdFile(path: string, name: string): TFile {
  const file = new TFile();
  file.path = path;
  file.name = name;
  file.extension = 'md';
  return file as unknown as TFile;
}

function folder(path: string, name: string, children: (TFile | TFolder)[]): TFolder {
  const dir = new StubFolder();
  dir.path = path;
  dir.name = name;
  dir.children = children as unknown as StubFolder['children'];
  return dir as unknown as TFolder;
}

describe('collectMarkdownBasenamesRecursive', () => {
  it('collects markdown basenames from the folder tree recursively', () => {
    const root = folder('course/GKISW', 'GKISW', [
      mdFile('course/GKISW/a.md', 'a.md'),
      folder('course/GKISW/sub', 'sub', [
        mdFile('course/GKISW/sub/b.md', 'b.md'),
        mdFile('course/GKISW/sub/GKISW_summary_2.md', 'GKISW_summary_2.md'),
      ]),
    ]);

    expect(collectMarkdownBasenamesRecursive(root)).toEqual(['a.md', 'b.md', 'GKISW_summary_2.md']);
  });
});

describe('writeSummaryMarkdownToFolder', () => {
  it('creates the base summary file in the target folder on first run', async () => {
    const vault = new StubVault() as unknown as Vault;
    const stubVault = vault as unknown as StubVault;
    const root = folder('course/GKISW', 'GKISW', [mdFile('course/GKISW/a.md', 'a.md')]);

    const result = await writeSummaryMarkdownToFolder(vault, root, '# Summary body');

    expect(result).toEqual({
      vaultPath: 'course/GKISW/GKISW_summary.md',
      filename: 'GKISW_summary.md',
      wasOverwritten: false,
    });
    expect(stubVault.getContent('course/GKISW/GKISW_summary.md')).toBe('# Summary body');
  });

  it('sanitizes folder names with whitespace in output filenames', async () => {
    const vault = new StubVault() as unknown as Vault;
    const stubVault = vault as unknown as StubVault;
    const root = folder('courses/Test Vault', 'Test Vault', [
      mdFile('courses/Test Vault/a.md', 'a.md'),
    ]);

    const result = await writeSummaryMarkdownToFolder(vault, root, 'summary');

    expect(result).toEqual({
      vaultPath: 'courses/Test Vault/Test_Vault_summary.md',
      filename: 'Test_Vault_summary.md',
      wasOverwritten: false,
    });
    expect(stubVault.getContent('courses/Test Vault/Test_Vault_summary.md')).toBe('summary');
  });

  it('creates the next version when summaries exist in subfolders', async () => {
    const vault = new StubVault() as unknown as Vault;
    const stubVault = vault as unknown as StubVault;
    const root = folder('course/GKISW', 'GKISW', [
      mdFile('course/GKISW/a.md', 'a.md'),
      folder('course/GKISW/sub', 'sub', [
        mdFile('course/GKISW/sub/GKISW_summary.md', 'GKISW_summary.md'),
      ]),
    ]);

    const result = await writeSummaryMarkdownToFolder(vault, root, 'version 2');

    expect(result.filename).toBe('GKISW_summary_2.md');
    expect(result.wasOverwritten).toBe(false);
    expect(stubVault.getContent('course/GKISW/GKISW_summary_2.md')).toBe('version 2');
  });

  it('modifies base file via vault.modify when overwriteBase=true and base exists', async () => {
    const vault = new StubVault() as unknown as Vault;
    const stubVault = vault as unknown as StubVault;
    stubVault.setContent('course/GKISW/GKISW_summary.md', 'old content');
    const root = folder('course/GKISW', 'GKISW', [
      mdFile('course/GKISW/GKISW_summary.md', 'GKISW_summary.md'),
    ]);

    const result = await writeSummaryMarkdownToFolder(vault, root, 'new content', true);

    expect(result).toEqual({
      vaultPath: 'course/GKISW/GKISW_summary.md',
      filename: 'GKISW_summary.md',
      wasOverwritten: true,
    });
    expect(stubVault.getContent('course/GKISW/GKISW_summary.md')).toBe('new content');
  });
});
