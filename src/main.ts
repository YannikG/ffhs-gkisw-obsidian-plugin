import { Plugin, type TAbstractFile } from 'obsidian';
import { runCreateSummaryForFolder } from './summary/create-summary-for-folder.js';
import {
  registerCreateSummaryFileMenu,
  showCreateSummaryNotice,
} from './summary/create-summary-file-menu.js';
import { ObsidianSummarizerSettingTab } from './settings-tab.js';
import { DEFAULT_SETTINGS, resolvePluginSettings, type PluginSettings } from './settings.js';
import {
  openIndexForPlugin,
  closeIndex,
  startBackgroundIndex,
  disposeBackgroundIndex,
  resetIndex,
  type RagVaultPorts,
} from './rag/index.js';
import { shouldIndexVaultPath } from './sources/should-index.js';

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

    startBackgroundIndex(this.makeRagVaultPorts());
  }

  private makeRagVaultPorts(): RagVaultPorts {
    const vault = this.app.vault;
    return {
      getAllVaultPaths: () =>
        vault
          .getFiles()
          .map((f) => f.path)
          .filter(shouldIndexVaultPath),
      getFilesUnderFolder: async (folderPath: string) => {
        return vault
          .getFiles()
          .map((f) => f.path)
          .filter((p) => p.startsWith(folderPath + '/'))
          .filter(shouldIndexVaultPath);
      },
      onModify: (handler) => {
        const ref = vault.on('modify', (file: TAbstractFile) => handler(file.path));
        this.registerEvent(ref);
        return () => vault.offref(ref);
      },
      onDelete: (handler) => {
        const ref = vault.on('delete', (file: TAbstractFile) => handler(file.path));
        this.registerEvent(ref);
        return () => vault.offref(ref);
      },
      onCreate: (handler) => {
        const ref = vault.on('create', (file: TAbstractFile) => handler(file.path));
        this.registerEvent(ref);
        return () => vault.offref(ref);
      },
    };
  }

  onunload(): void {
    this.disposeCreateSummaryMenu?.();
    this.disposeCreateSummaryMenu = undefined;

    disposeBackgroundIndex();

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

  async resetVectorIndex(): Promise<void> {
    resetIndex();
  }
}
