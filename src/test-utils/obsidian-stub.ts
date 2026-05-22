import { vi } from 'vitest';

export type TestModalButton = { text: string; click: () => void };

export type TestModalSnapshot = {
  title: string;
  content: string;
  buttons: TestModalButton[];
};

export const testModalState: {
  current: TestModalSnapshot | null;
  lastInstance: { close: () => void } | null;
} = {
  current: null,
  lastInstance: null,
};

export function resetTestModalState(): void {
  testModalState.current = null;
  testModalState.lastInstance = null;
}

class ButtonComponent {
  text = '';
  private handler?: () => void;

  setButtonText(text: string): this {
    this.text = text;
    return this;
  }

  setCta(): this {
    return this;
  }

  onClick(handler: () => void): this {
    this.handler = handler;
    return this;
  }

  click(): void {
    this.handler?.();
  }
}

export class Setting {
  constructor(_containerEl: unknown) {}

  addButton(callback: (button: ButtonComponent) => void): this {
    const button = new ButtonComponent();
    callback(button);
    testModalState.current?.buttons.push({
      text: button.text,
      click: () => button.click(),
    });
    return this;
  }
}

export class Modal {
  contentEl = { empty: vi.fn() };

  constructor(_app: unknown) {
    testModalState.current = { title: '', content: '', buttons: [] };
  }

  setTitle(title: string): this {
    if (testModalState.current) {
      testModalState.current.title = title;
    }
    return this;
  }

  setContent(content: string): this {
    if (testModalState.current) {
      testModalState.current.content = content;
    }
    return this;
  }

  open(): void {
    testModalState.lastInstance = this;
    const self = this as Modal & { onOpen?: () => void };
    self.onOpen?.();
  }

  close(): void {
    const self = this as Modal & { onClose?: () => void };
    self.onClose?.();
  }
}

export class TAbstractFile {
  name = '';
  path = '';
}

export class TFolder extends TAbstractFile {
  children: TAbstractFile[] = [];
}

export class TFile extends TAbstractFile {
  extension = 'md';
}

export class Vault {
  private readonly contents = new Map<string, string>();

  setContent(path: string, content: string): void {
    this.contents.set(path, content);
  }

  async cachedRead(file: TFile): Promise<string> {
    return this.contents.get(file.path) ?? '';
  }
}

export type MenuItemSnapshot = { title: string; click: () => void };

class MenuItem {
  title = '';
  private handler?: () => void;

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setIcon(_icon: string): this {
    return this;
  }

  onClick(handler: () => void): this {
    this.handler = handler;
    return this;
  }

  click(): void {
    this.handler?.();
  }
}

export class Menu {
  items: MenuItemSnapshot[] = [];

  addItem(callback: (item: MenuItem) => void): void {
    const item = new MenuItem();
    callback(item);
    this.items.push({
      title: item.title,
      click: () => item.click(),
    });
  }
}

export const noticeMessages: string[] = [];

export function resetNoticeMessages(): void {
  noticeMessages.length = 0;
}

export class Notice {
  constructor(message: string) {
    noticeMessages.push(message);
  }
}

export type EventRef = { id: number };

type FileMenuHandler = (menu: Menu, file: TAbstractFile) => void;

export class Workspace {
  private readonly handlers = new Map<number, { event: string; handler: FileMenuHandler }>();
  private nextId = 1;
  offrefCalls: EventRef[] = [];

  on(event: 'file-menu', handler: FileMenuHandler): EventRef {
    const ref = { id: this.nextId++ };
    this.handlers.set(ref.id, { event, handler });
    return ref;
  }

  offref(ref: EventRef): void {
    this.offrefCalls.push(ref);
    this.handlers.delete(ref.id);
  }

  triggerFileMenu(menu: Menu, file: TAbstractFile): void {
    for (const entry of this.handlers.values()) {
      if (entry.event === 'file-menu') {
        entry.handler(menu, file);
      }
    }
  }
}

export class Plugin {
  app = { workspace: new Workspace() };

  async loadData(): Promise<unknown> {
    return {};
  }

  async saveData(_data: unknown): Promise<void> {}
}

export type App = { workspace: Workspace };
