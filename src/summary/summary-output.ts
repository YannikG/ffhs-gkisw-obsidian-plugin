import { buildSummaryOutputFilename, nextSummaryOutputVersion } from './filename.js';

export type SummaryWriteResult = {
  vaultPath: string;
  filename: string;
  wasOverwritten: boolean;
};

export type SummaryVaultWritePort = {
  listMarkdownBasenamesInTree(): readonly string[];
  createFile(vaultPath: string, content: string): Promise<void>;
  modifyFile(vaultPath: string, content: string): Promise<void>;
};

/**
 * Resolves the next summary output filename for a folder (SPEC US-03).
 */
export function resolveSummaryOutputFilename(
  folderBasename: string,
  existingFilenames: readonly string[],
): string {
  const version = nextSummaryOutputVersion(folderBasename, existingFilenames);
  return buildSummaryOutputFilename(folderBasename, version);
}

/** Builds the vault-relative path for a summary output file in the target folder. */
export function buildSummaryOutputVaultPath(folderPath: string, filename: string): string {
  const normalized = folderPath.trim().replace(/[/\\]+$/, '');
  return normalized.length > 0 ? `${normalized}/${filename}` : filename;
}

export async function writeSummaryMarkdown(
  port: SummaryVaultWritePort,
  folderPath: string,
  folderBasename: string,
  content: string,
  overwriteBase = false,
): Promise<SummaryWriteResult> {
  const existingFilenames = port.listMarkdownBasenamesInTree();

  if (overwriteBase) {
    const baseName = buildSummaryOutputFilename(folderBasename, 1);
    if (existingFilenames.includes(baseName)) {
      const vaultPath = buildSummaryOutputVaultPath(folderPath, baseName);
      await port.modifyFile(vaultPath, content);
      return { vaultPath, filename: baseName, wasOverwritten: true };
    }
  }

  const filename = resolveSummaryOutputFilename(folderBasename, existingFilenames);
  const vaultPath = buildSummaryOutputVaultPath(folderPath, filename);
  await port.createFile(vaultPath, content);
  return { vaultPath, filename, wasOverwritten: false };
}
