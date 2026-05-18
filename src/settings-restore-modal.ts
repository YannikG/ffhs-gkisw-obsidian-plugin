import { App, Modal, Setting } from 'obsidian';
import { buildRestoreSettingDialogContent } from './settings.js';

export type RestoreSettingPromptOptions = {
  fieldLabel: string;
  previousValue: string;
};

/**
 * Asks whether to restore the last saved value after an invalid empty field.
 * @returns `true` if the user chose restore, `false` if cancelled.
 */
export function promptRestoreSetting(
  app: App,
  options: RestoreSettingPromptOptions,
): Promise<boolean> {
  return new Promise((resolve) => {
    new RestoreSettingModal(app, options, resolve).open();
  });
}

class RestoreSettingModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private readonly options: RestoreSettingPromptOptions,
    private readonly onCloseWithResult: (restore: boolean) => void,
  ) {
    super(app);
  }

  onOpen(): void {
    const { fieldLabel, previousValue } = this.options;
    this.setTitle(`${fieldLabel}: Wert erforderlich`);
    this.setContent(buildRestoreSettingDialogContent(fieldLabel, previousValue));

    new Setting(this.contentEl)
      .addButton((button) =>
        button
          .setButtonText('Wiederherstellen')
          .setCta()
          .onClick(() => this.closeWithResult(true)),
      )
      .addButton((button) =>
        button.setButtonText('Abbrechen').onClick(() => this.closeWithResult(false)),
      );
  }

  onClose(): void {
    if (!this.resolved) {
      this.finish(false);
    }
    this.contentEl.empty();
  }

  private closeWithResult(restore: boolean): void {
    this.finish(restore);
    this.close();
  }

  private finish(restore: boolean): void {
    if (this.resolved) {
      return;
    }
    this.resolved = true;
    this.onCloseWithResult(restore);
  }
}
