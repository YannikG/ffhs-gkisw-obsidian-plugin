import { DEFAULT_CHUNK_OVERLAP, DEFAULT_CHUNK_SIZE } from './rag/chunking.js';
import { DEFAULT_OLLAMA_TIMEOUT_MS } from './ollama/types.js';

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
  /** Max characters for Ordner-Quellkorpus before chat (CONTEXT Kontextlimit). */
  contextLimit: number;
  /** Ollama chat timeout in milliseconds. */
  ollamaTimeoutMs: number;
  /** Chunk size in characters for RAG paragraph chunking. */
  chunkSize: number;
  /** Chunk overlap in characters for RAG paragraph chunking. */
  chunkOverlap: number;
  /** Number of top-K chunks to retrieve for RAG context. */
  retrievalTopK: number;
}

/** Default context limit (characters) for Phase 5 full-folder corpus. */
export const DEFAULT_CONTEXT_LIMIT = 32_000;

/** Defaults from SPEC.md §6 and P5-I06. */
export const DEFAULT_RETRIEVAL_TOP_K = 8;

export const DEFAULT_SETTINGS: PluginSettings = {
  ollamaBaseUrl: 'http://127.0.0.1:11434',
  generationModel: 'gemma4:e2b',
  embeddingModel: 'nomic-embed-text',
  contextLimit: DEFAULT_CONTEXT_LIMIT,
  ollamaTimeoutMs: DEFAULT_OLLAMA_TIMEOUT_MS,
  chunkSize: DEFAULT_CHUNK_SIZE,
  chunkOverlap: DEFAULT_CHUNK_OVERLAP,
  retrievalTopK: DEFAULT_RETRIEVAL_TOP_K,
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
      (result as Record<keyof PluginSettings, PluginSettings[keyof PluginSettings]>)[key] = value;
    }
  }
  return result;
}

type StringSettingKey = 'ollamaBaseUrl' | 'generationModel' | 'embeddingModel';
type NumberSettingKey =
  | 'contextLimit'
  | 'ollamaTimeoutMs'
  | 'chunkSize'
  | 'chunkOverlap'
  | 'retrievalTopK';

const PLUGIN_SETTINGS_STRING_KEYS: StringSettingKey[] = [
  'ollamaBaseUrl',
  'generationModel',
  'embeddingModel',
];

const PLUGIN_SETTINGS_NUMBER_KEYS: NumberSettingKey[] = [
  'contextLimit',
  'ollamaTimeoutMs',
  'chunkSize',
  'chunkOverlap',
  'retrievalTopK',
];

const NUMBER_SETTING_DEFAULTS: Pick<
  PluginSettings,
  'contextLimit' | 'ollamaTimeoutMs' | 'chunkSize' | 'chunkOverlap' | 'retrievalTopK'
> = {
  contextLimit: DEFAULT_CONTEXT_LIMIT,
  ollamaTimeoutMs: DEFAULT_OLLAMA_TIMEOUT_MS,
  chunkSize: DEFAULT_CHUNK_SIZE,
  chunkOverlap: DEFAULT_CHUNK_OVERLAP,
  retrievalTopK: DEFAULT_RETRIEVAL_TOP_K,
};

/**
 * Coerces persisted or user input to a positive integer setting.
 * @returns default when value is missing or invalid.
 */
export function coercePositiveIntSetting(value: unknown, defaultValue: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return defaultValue;
}

/**
 * Validates a positive integer setting field.
 * @returns Error message, or `null` when valid.
 */
export function validatePositiveIntSetting(value: string, fieldLabel: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return `${fieldLabel} darf nicht leer sein.`;
  }
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return `${fieldLabel} muss eine positive ganze Zahl sein.`;
  }
  return null;
}

function partialFromStored(stored: Record<string, unknown>): Partial<PluginSettings> {
  const partial: Partial<PluginSettings> = {};
  for (const key of PLUGIN_SETTINGS_STRING_KEYS) {
    const value = stored[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      partial[key] = value;
    }
  }
  for (const key of PLUGIN_SETTINGS_NUMBER_KEYS) {
    const value = stored[key];
    if (value !== undefined) {
      partial[key] = coercePositiveIntSetting(value, NUMBER_SETTING_DEFAULTS[key]);
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
 * Validates that a required setting field is non-empty.
 * @returns Error message, or `null` when valid.
 */
export function validateRequiredSetting(value: string, fieldLabel: string): string | null {
  if (value.trim().length === 0) {
    return `${fieldLabel} darf nicht leer sein.`;
  }
  return null;
}

/**
 * Validates Ollama base URL before persistence.
 * @returns Error message, or `null` when valid.
 */
export function validateOllamaBaseUrl(url: string): string | null {
  return validateRequiredSetting(url, 'Ollama Base URL');
}

/** Body text for the restore-value confirmation dialog. */
export function buildRestoreSettingDialogContent(
  fieldLabel: string,
  previousValue: string,
): string {
  return (
    `${fieldLabel} darf nicht leer bleiben.\n\n` +
    `Gespeicherter Wert:\n${previousValue}\n\n` +
    `Vorherigen Wert wiederherstellen?`
  );
}

/** Normalizes a validated Ollama base URL for persistence. */
export function normalizeOllamaBaseUrl(url: string): string {
  return url.trim();
}
