import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  type TextComponent,
} from 'obsidian';
import {
  DEFAULT_SETTINGS,
  normalizeOllamaBaseUrl,
  validateOllamaBaseUrl,
  type PluginSettings,
} from './settings.js';

/** Plugin surface for {@link ObsidianSummarizerSettingTab} (no import from `main.ts`). */
export interface ObsidianSummarizerSettingsHost {
  settings: PluginSettings;
  saveSettings(): Promise<void>;
}

export class ObsidianSummarizerSettingTab extends PluginSettingTab {
  plugin: ObsidianSummarizerSettingsHost;

  constructor(app: App, plugin: ObsidianSummarizerSettingsHost & Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.addTextField(containerEl, {
      name: 'Ollama Base URL',
      desc: 'REST-Basis-URL der lokalen Ollama-Instanz.',
      placeholder: DEFAULT_SETTINGS.ollamaBaseUrl,
      getValue: () => this.plugin.settings.ollamaBaseUrl,
      onChange: async (value, text) => {
        const error = validateOllamaBaseUrl(value);
        if (error) {
          new Notice(error);
          text.setValue(this.plugin.settings.ollamaBaseUrl);
          return;
        }
        this.plugin.settings.ollamaBaseUrl = normalizeOllamaBaseUrl(value);
        await this.plugin.saveSettings();
      },
    });

    this.addTextField(containerEl, {
      name: 'Generierungsmodell',
      desc: 'Ollama-Modell-Tag für Zusammenfassungen (z. B. gemma4:e2b).',
      placeholder: DEFAULT_SETTINGS.generationModel,
      getValue: () => this.plugin.settings.generationModel,
      onChange: async (value) => {
        this.plugin.settings.generationModel = value;
        await this.plugin.saveSettings();
      },
    });

    this.addTextField(containerEl, {
      name: 'Embedding-Modell',
      desc: 'Ollama-Modell-Tag für RAG-Embeddings.',
      placeholder: DEFAULT_SETTINGS.embeddingModel,
      getValue: () => this.plugin.settings.embeddingModel,
      onChange: async (value) => {
        this.plugin.settings.embeddingModel = value;
        await this.plugin.saveSettings();
      },
    });
  }

  private addTextField(
    containerEl: HTMLElement,
    options: {
      name: string;
      desc: string;
      placeholder: string;
      getValue: () => string;
      onChange: (value: string, text: TextComponent) => Promise<void>;
    },
  ): void {
    new Setting(containerEl)
      .setName(options.name)
      .setDesc(options.desc)
      .addText((text) => {
        text
          .setPlaceholder(options.placeholder)
          .setValue(options.getValue())
          .onChange((value) => options.onChange(value, text));
      });
  }
}
