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

export class Plugin {
  app = {};
  async loadData(): Promise<unknown> {
    return {};
  }
  async saveData(_data: unknown): Promise<void> {}
}

export class Notice {
  constructor(_message: string) {}
}

export type App = object;
