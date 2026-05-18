/**
 * Summary output filenames: `{folderBasename}_summary.md` or `{folderBasename}_summary_{n}.md`.
 * @see {@link ../../SPEC.md} sections 1, US-03, and 4.4 (Quellenfilter)
 */

/** Infix between sanitized folder basename and `.md` (SPEC US-03). */
export const SUMMARY_OUTPUT_INFIX = '_summary' as const;

const INVALID_FILENAME_CHARS = /[\\/:*?"<>|]/g;
const WHITESPACE_RUNS = /\s+/g;
const UNDERSCORE_RUNS = /_+/g;

const SUMMARY_OUTPUT_FILENAME_PATTERN =
  /^.+_summary(?:_\d+)?\.md$/i;

function lastPathSegment(raw: string): string {
  const trimmed = raw.trim();
  const parts = trimmed.split(/[/\\]/);
  return parts.pop() ?? trimmed;
}

/**
 * Sanitizes the last segment of a folder path for use in a vault filename.
 */
export function sanitizeFolderBasename(raw: string): string {
  const segment = lastPathSegment(raw);
  const sanitized = segment
    .replace(INVALID_FILENAME_CHARS, '_')
    .replace(WHITESPACE_RUNS, '_')
    .replace(UNDERSCORE_RUNS, '_')
    .replace(/^\.+/, '')
    .replace(/_+$/, '');

  return sanitized.length > 0 ? sanitized : 'folder';
}

/**
 * Builds the summary output filename for a folder.
 * @param folderBasename Last path segment or label of the target folder (sanitized internally).
 * @param version Omit or `1` for `{name}_summary.md`; `2+` for `{name}_summary_{n}.md`.
 */
export function buildSummaryOutputFilename(
  folderBasename: string,
  version?: number,
): string {
  const base = sanitizeFolderBasename(folderBasename);
  if (
    version === undefined ||
    !Number.isInteger(version) ||
    version <= 1
  ) {
    return `${base}${SUMMARY_OUTPUT_INFIX}.md`;
  }
  return `${base}${SUMMARY_OUTPUT_INFIX}_${version}.md`;
}

function basenameFromPath(pathOrName: string): string {
  return lastPathSegment(pathOrName);
}

/** Whether a vault file name matches plugin-generated summary outputs (SPEC §4.4). */
export function isSummaryOutputFilename(filename: string): boolean {
  return SUMMARY_OUTPUT_FILENAME_PATTERN.test(basenameFromPath(filename));
}

/** Whether a file must be skipped as summary output when reading corpus (SPEC §4.4). */
export function isExcludedSummarySource(filename: string): boolean {
  const name = basenameFromPath(filename);
  return name === 'summary.md' || isSummaryOutputFilename(name);
}

/**
 * Returns the version to use for the next summary file when not overwriting the base name.
 * `1` = write `{folder}_summary.md`; `2+` = versioned filename (SPEC US-03).
 */
export function nextSummaryOutputVersion(
  folderBasename: string,
  existingFilenames: readonly string[],
): number {
  const base = sanitizeFolderBasename(folderBasename);
  const baseName = `${base}${SUMMARY_OUTPUT_INFIX}.md`;
  const prefix = `${base}${SUMMARY_OUTPUT_INFIX}_`;
  let maxVersion = 0;

  for (const file of existingFilenames) {
    const name = basenameFromPath(file);
    if (name === baseName) {
      maxVersion = Math.max(maxVersion, 1);
      continue;
    }
    if (!name.startsWith(prefix) || !name.endsWith('.md')) {
      continue;
    }
    const suffix = name.slice(prefix.length, -3);
    if (!/^\d+$/.test(suffix)) {
      continue;
    }
    const parsed = Number.parseInt(suffix, 10);
    if (parsed >= 2) {
      maxVersion = Math.max(maxVersion, parsed);
    }
  }

  if (maxVersion === 0) {
    return 1;
  }
  return maxVersion + 1;
}
