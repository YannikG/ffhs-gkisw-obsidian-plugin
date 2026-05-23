import { buildSummaryOutputFilename, nextSummaryOutputVersion } from './filename.js';

/**
 * Picks the next summary output filename for a folder without overwriting the base file (SPEC US-03).
 */
export function resolveSummaryOutputFilename(
  folderBasename: string,
  existingFilenames: readonly string[],
): string {
  const version = nextSummaryOutputVersion(folderBasename, existingFilenames);
  if (version <= 1) {
    return buildSummaryOutputFilename(folderBasename);
  }
  return buildSummaryOutputFilename(folderBasename, version);
}
