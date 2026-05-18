import { Menu, Notice, Plugin, TAbstractFile, TFolder } from 'obsidian';
import { CREATE_SUMMARY_MENU_LABEL, CREATE_SUMMARY_STUB_NOTICE } from './create-summary-stub.js';

export function shouldOfferCreateSummaryMenu(file: TAbstractFile): boolean {
  return file instanceof TFolder;
}

export function handleCreateSummaryFileMenu(menu: Menu, file: TAbstractFile): void {
  if (!shouldOfferCreateSummaryMenu(file)) {
    return;
  }

  menu.addItem((item) => {
    item.setTitle(CREATE_SUMMARY_MENU_LABEL).onClick(() => {
      new Notice(CREATE_SUMMARY_STUB_NOTICE);
    });
  });
}

/**
 * Registers the folder context-menu stub for Create Summary.
 * @returns Cleanup that removes the `file-menu` handler (call from `onunload`).
 */
export function registerCreateSummaryFileMenu(plugin: Plugin): () => void {
  const ref = plugin.app.workspace.on('file-menu', handleCreateSummaryFileMenu);
  return () => plugin.app.workspace.offref(ref);
}
