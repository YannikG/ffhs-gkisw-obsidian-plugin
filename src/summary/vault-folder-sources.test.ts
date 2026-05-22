import type { TFolder, Vault } from 'obsidian';
import { describe, expect, it } from 'vitest';
import { readFolderMarkdownSources } from './vault-folder-sources.js';
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

describe('readFolderMarkdownSources', () => {
  it('reads markdown recursively, filters excluded files, and returns sorted source context', async () => {
    const vault = new StubVault() as unknown as Vault;
    const stubVault = vault as unknown as StubVault;
    stubVault.setContent('course/a.md', 'Alpha');
    stubVault.setContent('course/sub/b.md', 'Beta');
    stubVault.setContent('course/GKISW_summary.md', 'skip');

    const root = folder('course', 'course', [
      mdFile('course/a.md', 'a.md'),
      mdFile('course/GKISW_summary.md', 'GKISW_summary.md'),
      folder('course/sub', 'sub', [mdFile('course/sub/b.md', 'b.md')]),
    ]);

    const result = await readFolderMarkdownSources(vault, root);

    expect(result).toEqual({
      ok: true,
      sourceContext: '### `course/a.md`\nAlpha\n---\n### `course/sub/b.md`\nBeta',
    });
  });

  it('returns empty_folder when the folder tree has no includable markdown', async () => {
    const vault = new StubVault() as unknown as Vault;
    const root = folder('course', 'course', [
      mdFile('course/GKISW_summary.md', 'GKISW_summary.md'),
    ]);

    const result = await readFolderMarkdownSources(vault, root);

    expect(result).toEqual({ ok: false, error: { kind: 'empty_folder' } });
  });
});
