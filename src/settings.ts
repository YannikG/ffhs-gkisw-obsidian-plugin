/**
 * Plugin configuration shape and defaults.
 * @see {@link ../SPEC.md} section 6 (Einstellungen)
 */
export interface PluginSettings {
  /** Ollama REST base URL. */
  ollamaBaseUrl: string;
  /** Chat/generate model tag. */
  generationModel: string;
  /** Embedding model tag for RAG chunks. */
  embeddingModel: string;
}

/** Defaults from SPEC.md §6. */
export const DEFAULT_SETTINGS: PluginSettings = {
  ollamaBaseUrl: 'http://127.0.0.1:11434',
  generationModel: 'gemma4:e2b',
  embeddingModel: 'nomic-embed-text',
};

/**
 * Merges persisted or partial settings onto a base object.
 * @see {@link ../SPEC.md} section 6
 */
export function mergeSettings(
  base: PluginSettings,
  partial: Partial<PluginSettings>,
): PluginSettings {
  const result = { ...base };
  for (const key of Object.keys(partial) as (keyof PluginSettings)[]) {
    const value = partial[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
