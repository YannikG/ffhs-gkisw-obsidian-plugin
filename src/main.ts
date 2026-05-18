import { Plugin } from 'obsidian';
import { ObsidianSummarizerSettingTab } from './settings-tab.js';
import {
  DEFAULT_SETTINGS,
  resolvePluginSettings,
  type PluginSettings,
} from './settings.js';

export default class ObsidianSummarizerPlugin extends Plugin {
  settings: PluginSettings = { ...DEFAULT_SETTINGS };

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new ObsidianSummarizerSettingTab(this.app, this));
  }

  onunload(): void {}

  async loadSettings(): Promise<void> {
    this.settings = resolvePluginSettings(await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
