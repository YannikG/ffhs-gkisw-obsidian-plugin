import { Menu, Notice, Plugin, TAbstractFile, TFolder } from 'obsidian';
import { CREATE_SUMMARY_MENU_LABEL } from './create-summary-stub.js';

export function shouldOfferCreateSummaryMenu(file: TAbstractFile): boolean {
  return file instanceof TFolder;
}

export interface CreateSummaryMenuHost {
  runCreateSummary(folder: TFolder): void | Promise<void>;
}

export function handleCreateSummaryFileMenu(
  menu: Menu,
  file: TAbstractFile,
  host: CreateSummaryMenuHost,
): void {
  if (!(file instanceof TFolder)) {
    return;
  }

  const folder = file;
  menu.addItem((item) => {
    item.setTitle(CREATE_SUMMARY_MENU_LABEL).onClick(() => {
      void host.runCreateSummary(folder);
    });
  });
}

/**
 * Registers the folder context menu for Create Summary.
 * @returns Cleanup that removes the `file-menu` handler (call from `onunload`).
 */
export function registerCreateSummaryFileMenu(
  plugin: Plugin,
  host: CreateSummaryMenuHost,
): () => void {
  const handler = (menu: Menu, file: TAbstractFile) => handleCreateSummaryFileMenu(menu, file, host);
  const ref = plugin.app.workspace.on('file-menu', handler);
  return () => plugin.app.workspace.offref(ref);
}

/** Shows a notice via Obsidian (menu wiring default). */
export function showCreateSummaryNotice(message: string): void {
  new Notice(message);
}
