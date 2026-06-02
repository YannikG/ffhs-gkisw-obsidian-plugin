import { App, Notice, Plugin, PluginSettingTab, Setting, type TextComponent } from 'obsidian';
import { createOllamaClient } from './ollama/client.js';
import { promptRestoreSetting } from './settings-restore-modal.js';
import { mapOllamaErrorToNotice } from './summary/create-summary-notices.js';
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
  resetVectorIndex(): Promise<void>;
}

type RequiredTextFieldOptions = {
  label: string;
  desc: string;
  placeholder: string;
  getSavedValue: () => string;
  setSavedValue: (value: string) => void;
  normalize?: (value: string) => string;
  /** Called once on blur after a valid value is confirmed. Callback decides whether to act. */
  onBlurChanged?: () => Promise<void>;
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

    containerEl.createEl('h3', { text: 'Ollama' });

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
      desc: 'Ollama-Modell-Tag für Zusammenfassungen. Empfohlen: gemma4:e2b oder gemma4:e4b.',
      placeholder: DEFAULT_SETTINGS.generationModel,
      getSavedValue: () => this.plugin.settings.generationModel,
      setSavedValue: (value) => {
        this.plugin.settings.generationModel = value;
      },
    });

    // Track the value at display time; onBlurChanged fires only when the model actually changed.
    let lastEmbeddingModel = this.plugin.settings.embeddingModel;
    this.addRequiredTextField(containerEl, {
      label: 'Embedding-Modell',
      desc: 'Ollama-Modell-Tag für RAG-Embeddings.',
      placeholder: DEFAULT_SETTINGS.embeddingModel,
      getSavedValue: () => this.plugin.settings.embeddingModel,
      setSavedValue: (value) => {
        this.plugin.settings.embeddingModel = value;
      },
      onBlurChanged: async () => {
        const current = this.plugin.settings.embeddingModel;
        if (current === lastEmbeddingModel) return;
        lastEmbeddingModel = current;
        await this.plugin.resetVectorIndex();
        new Notice('Embedding-Modell geändert — Vektorindex wird neu aufgebaut.');
      },
    });

    this.addPositiveIntField(containerEl, {
      label: 'Ollama-Timeout (Sekunden)',
      desc: 'Maximale Wartezeit für einen Chat-Aufruf. Default: 90 s.',
      placeholder: String(DEFAULT_SETTINGS.ollamaTimeoutMs / 1000),
      getSavedValue: () => this.plugin.settings.ollamaTimeoutMs,
      setSavedValue: (value) => {
        this.plugin.settings.ollamaTimeoutMs = value;
      },
      displaySeconds: true,
    });

    new Setting(containerEl)
      .setName('Verbindung testen')
      .setDesc('Prüft, ob Generierungs- und Embedding-Modell bei Ollama geladen sind.')
      .addButton((button) => {
        button.setButtonText('Verbindung testen').onClick(() => {
          const { settings } = this.plugin;
          const client = createOllamaClient({
            baseUrl: settings.ollamaBaseUrl,
            generationModel: settings.generationModel,
            embeddingModel: settings.embeddingModel,
            timeoutMs: settings.ollamaTimeoutMs,
          });
          void client.checkBothModelsReachable().then((result) => {
            if (result.ok) {
              new Notice(
                `Verbindung erfolgreich: ${settings.generationModel} und ${settings.embeddingModel} sind geladen.`,
              );
            } else {
              new Notice(mapOllamaErrorToNotice(result.error));
            }
          });
        });
      });

    containerEl.createEl('h3', { text: 'Vektorindex' });

    this.addPositiveIntField(containerEl, {
      label: 'Chunk-Grösse',
      desc: 'Maximale Zeichenanzahl pro Chunk für den Vektorindex. Default: 1000.',
      placeholder: String(DEFAULT_SETTINGS.chunkSize),
      getSavedValue: () => this.plugin.settings.chunkSize,
      setSavedValue: (value) => {
        this.plugin.settings.chunkSize = value;
      },
    });

    this.addPositiveIntField(containerEl, {
      label: 'Chunk-Overlap',
      desc: 'Überlappung in Zeichen zwischen aufeinanderfolgenden Chunks. Default: 200.',
      placeholder: String(DEFAULT_SETTINGS.chunkOverlap),
      getSavedValue: () => this.plugin.settings.chunkOverlap,
      setSavedValue: (value) => {
        this.plugin.settings.chunkOverlap = value;
      },
    });

    this.addPositiveIntField(containerEl, {
      label: 'Retrieval Top-K',
      desc: 'Anzahl der semantisch ähnlichsten Chunks für den RAG-Kontext. Default: 8.',
      placeholder: String(DEFAULT_SETTINGS.retrievalTopK),
      getSavedValue: () => this.plugin.settings.retrievalTopK,
      setSavedValue: (value) => {
        this.plugin.settings.retrievalTopK = value;
      },
    });

    new Setting(containerEl)
      .setName('Vektorindex zurücksetzen')
      .setDesc('Index leeren und vault-weit neu aufbauen (läuft im Hintergrund).')
      .addButton((button) => {
        button
          .setButtonText('Zurücksetzen')
          .setWarning()
          .onClick(() => {
            void this.plugin
              .resetVectorIndex()
              .then(() => new Notice('Vektorindex zurückgesetzt.'));
          });
      });

    containerEl.createEl('h3', { text: 'Zusammenfassung' });

    this.addPositiveIntField(containerEl, {
      label: 'Kontextlimit',
      desc: "Obergrenze für den Retrieval-Kontext (Chunk-Texte). Default: 32'000 Zeichen.",
      placeholder: String(DEFAULT_SETTINGS.contextLimit),
      getSavedValue: () => this.plugin.settings.contextLimit,
      setSavedValue: (value) => {
        this.plugin.settings.contextLimit = value;
      },
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
      await options.onBlurChanged?.();
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
