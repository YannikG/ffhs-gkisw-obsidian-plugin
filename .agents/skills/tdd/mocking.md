# When to mock (this repo)

Mock at **system boundaries** only:

| Boundary | Examples |
|----------|----------|
| Obsidian API | `obsidian` package: `Plugin`, `App`, `Vault`, `Modal`, `Notice` |
| Network | `fetch` to Ollama or other HTTP (later phases) |
| Time / random | `vi.useFakeTimers()`, seeded RNG if needed |
| File system | Rare; prefer pure functions that accept strings/paths |

Do **not** mock:

- Your own `src/` modules (settings, chunk, merge helpers)
- Internal collaborators between pure modules
- Anything you control and can call for real in Node

## Obsidian boundary

Unit tests run in **Node**, not inside Obsidian. The `obsidian` package is an external boundary.

Minimal pattern:

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

// Import module under test *after* mock when it imports from 'obsidian'
const { createDefaultSettings } = await import('./settings');
```

Extend the mock object only with exports your module actually imports. Keep stubs dumb (return fixed data, no behavior assertions on Obsidian classes).

## Designing for testability

**1. Inject dependencies**

```typescript
// Easy to test: pass client in
export async function generateSummary(text: string, client: OllamaClient) {
  return client.generate(text);
}

// Hard to test: constructs client inside
export async function generateSummary(text: string) {
  const client = new OllamaClient(process.env.OLLAMA_URL!);
  return client.generate(text);
}
```

**2. Prefer pure functions**

```typescript
// Testable
export function applyTemperature(settings: Settings, value: number): Settings {
  return { ...settings, temperature: value };
}

// Harder: mutates plugin instance in place
export function applyTemperature(plugin: MyPlugin, value: number): void {
  plugin.settings.temperature = value;
}
```

**3. Small surface per module**

Fewer exports → fewer tests to maintain; hide complexity behind one clear function.

## Ollama / fetch (later)

When adding HTTP:

- Mock `fetch` or inject a thin `OllamaClient` interface
- Do not mock your own prompt-building or chunk assembly modules
- Assert on **returned** summary text or structured result, not `fetch` call order unless the contract is explicitly “must not call when disabled”

## Vitest reference

- Module mock: `vi.mock('obsidian', factory)`
- Spy on boundary only when necessary: `vi.spyOn(globalThis, 'fetch')`
- Reset between tests: `vi.clearAllMocks()` / `afterEach` as needed

Config and scripts: [P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md), root `README.md` once I07 is done.
