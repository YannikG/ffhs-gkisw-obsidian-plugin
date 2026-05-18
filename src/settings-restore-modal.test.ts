import type { App } from 'obsidian';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildRestoreSettingDialogContent } from './settings.js';
import { promptRestoreSetting } from './settings-restore-modal.js';
import { resetTestModalState, testModalState } from './test-utils/obsidian-stub.js';

const app = {} as App;

const options = {
  fieldLabel: 'Ollama Base URL',
  previousValue: 'http://127.0.0.1:11434',
};

function getCurrentModal() {
  const modal = testModalState.current;
  if (!modal) {
    throw new Error('Expected modal to be opened');
  }
  return modal;
}

function getButton(text: string) {
  const button = getCurrentModal().buttons.find((entry) => entry.text === text);
  if (!button) {
    throw new Error(`Expected button "${text}"`);
  }
  return button;
}

describe('promptRestoreSetting', () => {
  beforeEach(() => {
    resetTestModalState();
  });

  it('shows title and dialog content from options', async () => {
    const promise = promptRestoreSetting(app, options);

    expect(getCurrentModal().title).toBe(`${options.fieldLabel}: Wert erforderlich`);
    expect(getCurrentModal().content).toBe(
      buildRestoreSettingDialogContent(options.fieldLabel, options.previousValue),
    );

    getButton('Abbrechen').click();
    await expect(promise).resolves.toBe(false);
  });

  it('resolves true when Wiederherstellen is clicked', async () => {
    const promise = promptRestoreSetting(app, options);

    getButton('Wiederherstellen').click();
    await expect(promise).resolves.toBe(true);
  });

  it('resolves false when Abbrechen is clicked', async () => {
    const promise = promptRestoreSetting(app, options);

    getButton('Abbrechen').click();
    await expect(promise).resolves.toBe(false);
  });

  it('resolves false when modal is closed without choosing a button', async () => {
    const promise = promptRestoreSetting(app, options);

    testModalState.lastInstance!.close();
    await expect(promise).resolves.toBe(false);
  });
});
