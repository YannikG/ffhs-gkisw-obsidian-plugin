import { App, Notice, Plugin, PluginSettingTab, Setting, type TextComponent } from 'obsidian';
import { promptRestoreSetting } from './settings-restore-modal.js';
import {
  DEFAULT_SETTINGS,
  normalizeOllamaBaseUrl,
  validateRequiredSetting,
  type PluginSettings,
} from './settings.js';

/** Plugin surface for {@link ObsidianSummarizerSettingTab} (no import from `main.ts`). */
export interface ObsidianSummarizerSettingsHost {
  settings: PluginSettings;
  saveSettings(): Promise<void>;
}

type RequiredTextFieldOptions = {
  label: string;
  desc: string;
  placeholder: string;
  getSavedValue: () => string;
  setSavedValue: (value: string) => void;
  normalize?: (value: string) => string;
};

export class ObsidianSummarizerSettingTab extends PluginSettingTab {
  plugin: ObsidianSummarizerSettingsHost;
  private readonly restorePromptInFlight = new Set<string>();

  constructor(app: App, plugin: ObsidianSummarizerSettingsHost & Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.addRequiredTextField(containerEl, {
      label: 'Ollama Base URL',
      desc: 'REST-Basis-URL der lokalen Ollama-Instanz.',
      placeholder: DEFAULT_SETTINGS.ollamaBaseUrl,
      getSavedValue: () => this.plugin.settings.ollamaBaseUrl,
      setSavedValue: (value) => {
        this.plugin.settings.ollamaBaseUrl = value;
      },
      normalize: normalizeOllamaBaseUrl,
    });

    this.addRequiredTextField(containerEl, {
      label: 'Generierungsmodell',
      desc: 'Ollama-Modell-Tag für Zusammenfassungen (z. B. gemma4:e2b).',
      placeholder: DEFAULT_SETTINGS.generationModel,
      getSavedValue: () => this.plugin.settings.generationModel,
      setSavedValue: (value) => {
        this.plugin.settings.generationModel = value;
      },
    });

    this.addRequiredTextField(containerEl, {
      label: 'Embedding-Modell',
      desc: 'Ollama-Modell-Tag für RAG-Embeddings.',
      placeholder: DEFAULT_SETTINGS.embeddingModel,
      getSavedValue: () => this.plugin.settings.embeddingModel,
      setSavedValue: (value) => {
        this.plugin.settings.embeddingModel = value;
      },
    });
  }

  private addRequiredTextField(containerEl: HTMLElement, options: RequiredTextFieldOptions): void {
    new Setting(containerEl)
      .setName(options.label)
      .setDesc(options.desc)
      .addText((text) => {
        text
          .setPlaceholder(options.placeholder)
          .setValue(options.getSavedValue())
          .onChange((value) => this.handleRequiredChange(value, options))
          .inputEl.addEventListener('blur', () => {
            void this.handleRequiredBlur(text, options);
          });
      });
  }

  private async handleRequiredChange(
    value: string,
    options: RequiredTextFieldOptions,
  ): Promise<void> {
    await this.commitRequiredValue(value, options);
  }

  private normalizeRequiredValue(value: string, options: RequiredTextFieldOptions): string {
    return options.normalize?.(value) ?? value.trim();
  }

  private async commitRequiredValue(
    value: string,
    options: RequiredTextFieldOptions,
  ): Promise<boolean> {
    if (validateRequiredSetting(value, options.label)) {
      return false;
    }
    const normalized = this.normalizeRequiredValue(value, options);
    if (normalized === options.getSavedValue()) {
      return true;
    }
    options.setSavedValue(normalized);
    await this.plugin.saveSettings();
    return true;
  }

  private async handleRequiredBlur(
    text: TextComponent,
    options: RequiredTextFieldOptions,
  ): Promise<void> {
    const { label } = options;
    if (this.restorePromptInFlight.has(label)) {
      return;
    }

    const value = text.getValue();
    const error = validateRequiredSetting(value, label);
    if (!error) {
      await this.commitRequiredValue(value, options);
      const normalized = this.normalizeRequiredValue(value, options);
      if (text.getValue() !== normalized) {
        text.setValue(normalized);
      }
      return;
    }

    const previousValue = options.getSavedValue();
    new Notice(error);

    this.restorePromptInFlight.add(label);
    try {
      const restore = await promptRestoreSetting(this.app, {
        fieldLabel: label,
        previousValue,
      });
      if (restore) {
        text.setValue(previousValue);
      }
    } finally {
      this.restorePromptInFlight.delete(label);
    }
  }
}
