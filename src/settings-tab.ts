import { App, Notice, Plugin, PluginSettingTab, Setting, type TextComponent } from 'obsidian';
import { promptRestoreSetting } from './settings-restore-modal.js';
import {
  DEFAULT_SETTINGS,
  normalizeOllamaBaseUrl,
  validatePositiveIntSetting,
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

type PositiveIntFieldOptions = {
  label: string;
  desc: string;
  placeholder: string;
  getSavedValue: () => number;
  setSavedValue: (value: number) => void;
  /** When true, UI shows seconds but storage is milliseconds. */
  displaySeconds?: boolean;
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

    this.addPositiveIntField(containerEl, {
      label: 'Kontextlimit',
      desc: 'Maximale Zeichenanzahl des Ordner-Quellkorpus vor dem Chat.',
      placeholder: String(DEFAULT_SETTINGS.contextLimit),
      getSavedValue: () => this.plugin.settings.contextLimit,
      setSavedValue: (value) => {
        this.plugin.settings.contextLimit = value;
      },
    });

    this.addPositiveIntField(containerEl, {
      label: 'Ollama-Timeout (Sekunden)',
      desc: 'Maximale Wartezeit für einen Chat-Aufruf.',
      placeholder: String(DEFAULT_SETTINGS.ollamaTimeoutMs / 1000),
      getSavedValue: () => this.plugin.settings.ollamaTimeoutMs,
      setSavedValue: (value) => {
        this.plugin.settings.ollamaTimeoutMs = value;
      },
      displaySeconds: true,
    });
  }

  private addPositiveIntField(containerEl: HTMLElement, options: PositiveIntFieldOptions): void {
    new Setting(containerEl)
      .setName(options.label)
      .setDesc(options.desc)
      .addText((text) => {
        const displayValue = options.displaySeconds
          ? String(Math.floor(options.getSavedValue() / 1000))
          : String(options.getSavedValue());
        text
          .setPlaceholder(options.placeholder)
          .setValue(displayValue)
          .onChange((value) => {
            void this.commitPositiveIntValue(value, options, text);
          });
      });
  }

  private async commitPositiveIntValue(
    value: string,
    options: PositiveIntFieldOptions,
    text: TextComponent,
  ): Promise<void> {
    const error = validatePositiveIntSetting(value, options.label);
    if (error) {
      return;
    }
    const parsed = Number.parseInt(value.trim(), 10);
    const stored = options.displaySeconds ? parsed * 1000 : parsed;
    if (stored === options.getSavedValue()) {
      return;
    }
    options.setSavedValue(stored);
    await this.plugin.saveSettings();
    const displayValue = options.displaySeconds ? String(parsed) : String(stored);
    if (text.getValue() !== displayValue) {
      text.setValue(displayValue);
    }
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
