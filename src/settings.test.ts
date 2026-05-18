import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  mergeSettings,
  resolvePluginSettings,
  buildRestoreSettingDialogContent,
  normalizeOllamaBaseUrl,
  validateOllamaBaseUrl,
  validateRequiredSetting,
  type PluginSettings,
} from './settings.js';

describe('DEFAULT_SETTINGS', () => {
  it('matches SPEC.md section 6 defaults', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      ollamaBaseUrl: 'http://127.0.0.1:11434',
      generationModel: 'gemma4:e2b',
      embeddingModel: 'nomic-embed-text',
    } satisfies PluginSettings);
  });
});

describe('mergeSettings', () => {
  it('keeps base values when partial is empty', () => {
    const base: PluginSettings = {
      ollamaBaseUrl: 'http://custom:11434',
      generationModel: 'gemma4:e4b',
      embeddingModel: 'custom-embed',
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

  it('ignores non-string values for known keys', () => {
    expect(
      resolvePluginSettings({
        ollamaBaseUrl: 123,
        generationModel: true,
        embeddingModel: ['nomic-embed-text'],
      }),
    ).toEqual(DEFAULT_SETTINGS);
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
