import type { Menu as ObsidianMenu, Plugin, TAbstractFile } from 'obsidian';
import { beforeEach, describe, expect, it } from 'vitest';
import { CREATE_SUMMARY_MENU_LABEL, CREATE_SUMMARY_STUB_NOTICE } from './create-summary-stub.js';
import {
  handleCreateSummaryFileMenu,
  registerCreateSummaryFileMenu,
  shouldOfferCreateSummaryMenu,
} from './create-summary-file-menu.js';
import {
  Menu,
  Plugin as PluginStub,
  TFile,
  TFolder,
  Workspace as TestWorkspace,
  noticeMessages,
  resetNoticeMessages,
} from '../test-utils/obsidian-stub.js';

function asAbstractFile(file: TFolder | TFile): TAbstractFile {
  return file as unknown as TAbstractFile;
}

function asObsidianMenu(menu: Menu): ObsidianMenu {
  return menu as unknown as ObsidianMenu;
}

describe('shouldOfferCreateSummaryMenu', () => {
  it('returns true for folders', () => {
    expect(shouldOfferCreateSummaryMenu(asAbstractFile(new TFolder()))).toBe(true);
  });

  it('returns false for files', () => {
    expect(shouldOfferCreateSummaryMenu(asAbstractFile(new TFile()))).toBe(false);
  });
});

describe('handleCreateSummaryFileMenu', () => {
  beforeEach(() => {
    resetNoticeMessages();
  });

  it('adds Create Summary for folders', () => {
    const menu = new Menu();

    handleCreateSummaryFileMenu(asObsidianMenu(menu), asAbstractFile(new TFolder()));

    expect(menu.items).toHaveLength(1);
    expect(menu.items[0]?.title).toBe(CREATE_SUMMARY_MENU_LABEL);
  });

  it('shows stub notice when the menu item is clicked', () => {
    const menu = new Menu();

    handleCreateSummaryFileMenu(asObsidianMenu(menu), asAbstractFile(new TFolder()));
    menu.items[0]?.click();

    expect(noticeMessages).toEqual([CREATE_SUMMARY_STUB_NOTICE]);
  });

  it('does not add a menu item for files', () => {
    const menu = new Menu();

    handleCreateSummaryFileMenu(asObsidianMenu(menu), asAbstractFile(new TFile()));

    expect(menu.items).toHaveLength(0);
    expect(noticeMessages).toHaveLength(0);
  });
});

describe('registerCreateSummaryFileMenu', () => {
  beforeEach(() => {
    resetNoticeMessages();
  });

  it('unregisters the file-menu handler when cleanup runs', () => {
    const plugin = new PluginStub() as unknown as Plugin;
    const workspace = plugin.app.workspace as unknown as TestWorkspace;
    const cleanup = registerCreateSummaryFileMenu(plugin);

    cleanup();

    expect(workspace.offrefCalls).toHaveLength(1);
  });

  it('routes workspace file-menu events through the stub handler', () => {
    const plugin = new PluginStub() as unknown as Plugin;
    const workspace = plugin.app.workspace as unknown as TestWorkspace;
    registerCreateSummaryFileMenu(plugin);

    const menu = new Menu();
    workspace.triggerFileMenu(menu, new TFolder());

    expect(menu.items).toHaveLength(1);
    expect(menu.items[0]?.title).toBe(CREATE_SUMMARY_MENU_LABEL);
  });
});
