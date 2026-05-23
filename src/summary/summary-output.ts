import { buildSummaryOutputFilename, nextSummaryOutputVersion } from './filename.js';

export type SummaryWriteResult = {
  vaultPath: string;
  filename: string;
};

export type SummaryVaultWritePort = {
  listMarkdownBasenamesInTree(): readonly string[];
  createFile(vaultPath: string, content: string): Promise<void>;
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
): Promise<SummaryWriteResult> {
  const existingFilenames = port.listMarkdownBasenamesInTree();
  const filename = resolveSummaryOutputFilename(folderBasename, existingFilenames);
  const vaultPath = buildSummaryOutputVaultPath(folderPath, filename);
  await port.createFile(vaultPath, content);
  return { vaultPath, filename };
}
