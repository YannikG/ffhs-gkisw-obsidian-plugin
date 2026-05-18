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

const PLUGIN_SETTINGS_KEYS: (keyof PluginSettings)[] = [
  'ollamaBaseUrl',
  'generationModel',
  'embeddingModel',
];

function partialFromStored(stored: Record<string, unknown>): Partial<PluginSettings> {
  const partial: Partial<PluginSettings> = {};
  for (const key of PLUGIN_SETTINGS_KEYS) {
    const value = stored[key];
    if (typeof value === 'string') {
      partial[key] = value;
    }
  }
  return partial;
}

/**
 * Coerces persisted plugin data into {@link PluginSettings}.
 * @see {@link ../SPEC.md} section 6
 */
export function resolvePluginSettings(stored: unknown): PluginSettings {
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
    return { ...DEFAULT_SETTINGS };
  }
  return mergeSettings(DEFAULT_SETTINGS, partialFromStored(stored as Record<string, unknown>));
}

/**
 * Validates Ollama base URL before persistence.
 * @returns Error message, or `null` when valid.
 */
export function validateOllamaBaseUrl(url: string): string | null {
  if (url.trim().length === 0) {
    return 'Ollama Base URL darf nicht leer sein.';
  }
  return null;
}

/** Normalizes a validated Ollama base URL for persistence. */
export function normalizeOllamaBaseUrl(url: string): string {
  return url.trim();
}
