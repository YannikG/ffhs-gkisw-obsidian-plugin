import { describe, expect, it } from 'vitest';
import { DEFAULT_OLLAMA_TIMEOUT_MS } from './ollama/types.js';
import {
  DEFAULT_CONTEXT_LIMIT,
  DEFAULT_SETTINGS,
  mergeSettings,
  resolvePluginSettings,
  buildRestoreSettingDialogContent,
  coercePositiveIntSetting,
  normalizeOllamaBaseUrl,
  validateOllamaBaseUrl,
  validatePositiveIntSetting,
  validateRequiredSetting,
  type PluginSettings,
} from './settings.js';

describe('DEFAULT_SETTINGS', () => {
  it('matches SPEC.md section 6 defaults', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      ollamaBaseUrl: 'http://127.0.0.1:11434',
      generationModel: 'gemma4:e2b',
      embeddingModel: 'nomic-embed-text',
      contextLimit: DEFAULT_CONTEXT_LIMIT,
      ollamaTimeoutMs: DEFAULT_OLLAMA_TIMEOUT_MS,
      chunkSize: 1000,
      chunkOverlap: 200,
    } satisfies PluginSettings);
  });
});

describe('mergeSettings', () => {
  it('keeps base values when partial is empty', () => {
    const base: PluginSettings = {
      ollamaBaseUrl: 'http://custom:11434',
      generationModel: 'gemma4:e4b',
      embeddingModel: 'custom-embed',
      contextLimit: 10_000,
      ollamaTimeoutMs: 60_000,
      chunkSize: 500,
      chunkOverlap: 50,
    };
    expect(mergeSettings(base, {})).toEqual(base);
  });

  it('overrides only provided keys', () => {
    const base: PluginSettings = { ...DEFAULT_SETTINGS };
    expect(mergeSettings(base, { generationModel: 'gemma4:e4b' })).toEqual({
      ...DEFAULT_SETTINGS,
      generationModel: 'gemma4:e4b',
    });
  });

  it('does not overwrite base when partial value is undefined', () => {
    const base: PluginSettings = { ...DEFAULT_SETTINGS };
    expect(
      mergeSettings(base, {
        generationModel: undefined,
      }),
    ).toEqual(base);
  });

  it('overrides chunkSize and chunkOverlap independently', () => {
    const base: PluginSettings = { ...DEFAULT_SETTINGS };
    expect(mergeSettings(base, { chunkSize: 500 })).toEqual({
      ...DEFAULT_SETTINGS,
      chunkSize: 500,
    });
    expect(mergeSettings(base, { chunkOverlap: 50 })).toEqual({
      ...DEFAULT_SETTINGS,
      chunkOverlap: 50,
    });
  });
});

describe('resolvePluginSettings', () => {
  it('returns defaults when stored value is null', () => {
    expect(resolvePluginSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it('returns defaults when stored value is not an object', () => {
    expect(resolvePluginSettings('invalid')).toEqual(DEFAULT_SETTINGS);
  });

  it('returns defaults when stored value is an array', () => {
    expect(resolvePluginSettings([])).toEqual(DEFAULT_SETTINGS);
  });

  it('merges only known string fields from stored object', () => {
    expect(
      resolvePluginSettings({
        generationModel: 'gemma4:e4b',
        ollamaBaseUrl: 'http://custom:11434',
      }),
    ).toEqual({
      ...DEFAULT_SETTINGS,
      generationModel: 'gemma4:e4b',
      ollamaBaseUrl: 'http://custom:11434',
    });
  });

  it('ignores empty string values in stored object', () => {
    expect(
      resolvePluginSettings({
        ollamaBaseUrl: '',
        generationModel: '   ',
        embeddingModel: 'nomic-embed-text',
      }),
    ).toEqual({
      ...DEFAULT_SETTINGS,
      embeddingModel: 'nomic-embed-text',
    });
  });

  it('ignores non-string values for known string keys', () => {
    expect(
      resolvePluginSettings({
        ollamaBaseUrl: 123,
        generationModel: true,
        embeddingModel: ['nomic-embed-text'],
      }),
    ).toEqual(DEFAULT_SETTINGS);
  });

  it('merges valid numeric fields from stored object', () => {
    expect(
      resolvePluginSettings({
        contextLimit: 40_000,
        ollamaTimeoutMs: 120_000,
      }),
    ).toEqual({
      ...DEFAULT_SETTINGS,
      contextLimit: 40_000,
      ollamaTimeoutMs: 120_000,
    });
  });

  it('falls back to defaults for invalid numeric fields', () => {
    expect(
      resolvePluginSettings({
        contextLimit: 0,
        ollamaTimeoutMs: -1,
      }),
    ).toEqual(DEFAULT_SETTINGS);
  });

  it('merges valid chunkSize and chunkOverlap from stored object', () => {
    expect(resolvePluginSettings({ chunkSize: 500, chunkOverlap: 50 })).toEqual({
      ...DEFAULT_SETTINGS,
      chunkSize: 500,
      chunkOverlap: 50,
    });
  });

  it('falls back to defaults for invalid chunkSize and chunkOverlap', () => {
    expect(resolvePluginSettings({ chunkSize: 0, chunkOverlap: -10 })).toEqual(DEFAULT_SETTINGS);
  });
});

describe('coercePositiveIntSetting', () => {
  it('returns default for invalid values', () => {
    expect(coercePositiveIntSetting(null, 100)).toBe(100);
    expect(coercePositiveIntSetting('abc', 100)).toBe(100);
  });

  it('parses positive integers from numbers and strings', () => {
    expect(coercePositiveIntSetting(42.9, 100)).toBe(42);
    expect(coercePositiveIntSetting(' 5000 ', 100)).toBe(5000);
  });
});

describe('validatePositiveIntSetting', () => {
  it('returns error for empty or non-positive values', () => {
    expect(validatePositiveIntSetting('', 'Kontextlimit')).toMatch(/Kontextlimit/);
    expect(validatePositiveIntSetting('0', 'Kontextlimit')).toMatch(/positive/i);
  });

  it('returns null for valid positive integers', () => {
    expect(validatePositiveIntSetting('32000', 'Kontextlimit')).toBeNull();
  });
});

describe('validateRequiredSetting', () => {
  it('returns error message for empty value', () => {
    expect(validateRequiredSetting('', 'Generierungsmodell')).toMatch(/Generierungsmodell/);
  });

  it('returns null for non-empty value', () => {
    expect(validateRequiredSetting('gemma4:e2b', 'Generierungsmodell')).toBeNull();
  });
});

describe('buildRestoreSettingDialogContent', () => {
  it('includes field label, previous value, and restore question', () => {
    const content = buildRestoreSettingDialogContent('Ollama Base URL', 'http://127.0.0.1:11434');
    expect(content).toContain('Ollama Base URL');
    expect(content).toContain('http://127.0.0.1:11434');
    expect(content).toMatch(/wiederherstellen/i);
  });
});

describe('validateOllamaBaseUrl', () => {
  it('returns error message for empty URL', () => {
    expect(validateOllamaBaseUrl('')).toMatch(/URL/i);
  });

  it('returns error message for whitespace-only URL', () => {
    expect(validateOllamaBaseUrl('   ')).toMatch(/URL/i);
  });

  it('returns null for non-empty URL', () => {
    expect(validateOllamaBaseUrl('http://127.0.0.1:11434')).toBeNull();
  });
});

describe('normalizeOllamaBaseUrl', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeOllamaBaseUrl('  http://127.0.0.1:11434  ')).toBe('http://127.0.0.1:11434');
  });
});
