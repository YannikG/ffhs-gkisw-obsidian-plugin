# Mocking (this repo)

Mock **system boundaries** only:

| Boundary   | Examples                                                |
| ---------- | ------------------------------------------------------- |
| Obsidian   | `obsidian`: `Plugin`, `App`, `Vault`, `Modal`, `Notice` |
| Network    | `fetch` → Ollama (later)                                |
| Time / RNG | `vi.useFakeTimers()`, seeded RNG                        |
| FS         | Rare; prefer pure fns + string/path args                |

**Do not mock:** own `src/` modules, internal collaborators, anything you run for real in Node.

## Obsidian boundary

Tests run in **Node**, not Obsidian. `obsidian` = external.

```typescript
import { describe, expect, it, vi } from 'vitest';

vi.mock('obsidian', () => ({
  Plugin: class Plugin {
    app = {};
    async loadData() {
      return {};
    }
    async saveData() {}
  },
  Notice: class Notice {},
}));

// vi.mock hoisted; static import after mock OK
import { createDefaultSettings } from './settings';

describe('createDefaultSettings', () => {
  it('returns defaults without Vault', () => {
    expect(createDefaultSettings().model).toBeDefined();
  });
});
```

Mock only exports module imports. Stubs dumb — fixed data, no assert on Obsidian class behavior.

## Testability

**Inject deps**

```typescript
// OK: client in
export async function generateSummary(text: string, client: OllamaClient) {
  return client.generate(text);
}

// Bad: client inside
export async function generateSummary(text: string) {
  const client = new OllamaClient(process.env.OLLAMA_URL!);
  return client.generate(text);
}
```

**Prefer pure fns**

```typescript
export function applyTemperature(settings: Settings, value: number): Settings {
  return { ...settings, temperature: value };
}
```

**Small surface** — fewer exports → fewer tests.

## Ollama / fetch (later)

- Mock `fetch` or inject `OllamaClient`
- Do not mock prompt/chunk assembly you own
- Assert **return value**, not `fetch` order (unless contract says no call when disabled)

## Vitest

- `vi.mock('obsidian', factory)`
- `vi.spyOn(globalThis, 'fetch')` at boundary only
- `vi.clearAllMocks()` / `afterEach` as needed

Config: [P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md), root `README.md` after I07.
