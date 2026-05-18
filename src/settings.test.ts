import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  mergeSettings,
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
