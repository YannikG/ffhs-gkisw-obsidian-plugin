import type { Menu as ObsidianMenu, Plugin, TAbstractFile } from 'obsidian';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CREATE_SUMMARY_MENU_LABEL } from './create-summary-stub.js';
import {
  handleCreateSummaryFileMenu,
  registerCreateSummaryFileMenu,
  shouldOfferCreateSummaryMenu,
  type CreateSummaryMenuHost,
} from './create-summary-file-menu.js';
import {
  Menu,
  Plugin as PluginStub,
  TFile,
  TFolder,
  Workspace as TestWorkspace,
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
  it('adds Create Summary for folders', () => {
    const menu = new Menu();
    const host: CreateSummaryMenuHost = { runCreateSummary: vi.fn() };

    handleCreateSummaryFileMenu(asObsidianMenu(menu), asAbstractFile(new TFolder()), host);

    expect(menu.items).toHaveLength(1);
    expect(menu.items[0]?.title).toBe(CREATE_SUMMARY_MENU_LABEL);
  });

  it('invokes runCreateSummary when the menu item is clicked', () => {
    const menu = new Menu();
    const folder = new TFolder();
    const runCreateSummary = vi.fn();
    const host: CreateSummaryMenuHost = { runCreateSummary };

    handleCreateSummaryFileMenu(asObsidianMenu(menu), asAbstractFile(folder), host);
    menu.items[0]?.click();

    expect(runCreateSummary).toHaveBeenCalledWith(folder);
  });

  it('does not add a menu item for files', () => {
    const menu = new Menu();
    const host: CreateSummaryMenuHost = { runCreateSummary: vi.fn() };

    handleCreateSummaryFileMenu(asObsidianMenu(menu), asAbstractFile(new TFile()), host);

    expect(menu.items).toHaveLength(0);
    expect(host.runCreateSummary).not.toHaveBeenCalled();
  });
});

describe('registerCreateSummaryFileMenu', () => {
  it('unregisters the file-menu handler when cleanup runs', () => {
    const plugin = new PluginStub() as unknown as Plugin;
    const workspace = plugin.app.workspace as unknown as TestWorkspace;
    const host: CreateSummaryMenuHost = { runCreateSummary: vi.fn() };
    const cleanup = registerCreateSummaryFileMenu(plugin, host);

    cleanup();

    expect(workspace.offrefCalls).toHaveLength(1);
  });

  it('routes workspace file-menu events through the handler', () => {
    const plugin = new PluginStub() as unknown as Plugin;
    const workspace = plugin.app.workspace as unknown as TestWorkspace;
    const runCreateSummary = vi.fn();
    registerCreateSummaryFileMenu(plugin, { runCreateSummary });

    const menu = new Menu();
    const folder = new TFolder();
    workspace.triggerFileMenu(menu, folder);

    expect(menu.items).toHaveLength(1);
    expect(menu.items[0]?.title).toBe(CREATE_SUMMARY_MENU_LABEL);
    menu.items[0]?.click();
    expect(runCreateSummary).toHaveBeenCalledWith(folder);
  });
});
