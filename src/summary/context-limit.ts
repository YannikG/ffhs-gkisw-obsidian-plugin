/**
 * Kontextlimit check for Ordner-Quellkorpus (P5-I06).
 * @see {@link ../../CONTEXT.md} Kontextlimit
 */

/** True when source context length strictly exceeds the configured limit. */
export function isSourceContextOverLimit(sourceContext: string, contextLimit: number): boolean {
  return sourceContext.length > contextLimit;
}
