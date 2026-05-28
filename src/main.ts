import { Plugin } from 'obsidian';
import { runCreateSummaryForFolder } from './summary/create-summary-for-folder.js';
import {
  registerCreateSummaryFileMenu,
  showCreateSummaryNotice,
} from './summary/create-summary-file-menu.js';
import { ObsidianSummarizerSettingTab } from './settings-tab.js';
import { DEFAULT_SETTINGS, resolvePluginSettings, type PluginSettings } from './settings.js';
import { openIndexForPlugin, closeIndex } from './rag/index.js';

export default class ObsidianSummarizerPlugin extends Plugin {
  settings: PluginSettings = { ...DEFAULT_SETTINGS };
  private disposeCreateSummaryMenu?: () => void;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new ObsidianSummarizerSettingTab(this.app, this));
    this.disposeCreateSummaryMenu = registerCreateSummaryFileMenu(this, {
      runCreateSummary: (folder) =>
        runCreateSummaryForFolder(this.app.vault, folder, this.settings, showCreateSummaryNotice),
    });

    // Open vectors index for the plugin lifecycle. The store chooses the best
    // available backend (WASM -> SQLite -> JSON fallback). The helper is
    // tolerant for test environments where no plugin data path is available.
    try {
      openIndexForPlugin(this as unknown);
    } catch (_err) {
      // Opening index is non-fatal for the rest of plugin features; log if available.
      console.warn('Could not open vectors index:', _err);
    }
  }

  onunload(): void {
    this.disposeCreateSummaryMenu?.();
    this.disposeCreateSummaryMenu = undefined;

    // Close vectors index when plugin unloads to free resources.
    try {
      closeIndex();
    } catch (_err) {
      console.warn('Error closing vectors index:', _err);
    }
  }

  async loadSettings(): Promise<void> {
    this.settings = resolvePluginSettings(await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
