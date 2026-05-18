# Good and bad tests (this repo)

Vitest in Node. Files: `src/**/*.test.ts` next to the module under test (see [P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md)).

## Good tests

Integration-style through **exported** APIs. Names describe capability, not internals.

```typescript
import { describe, expect, it } from 'vitest';
import { mergeSettings } from './settings';

describe('mergeSettings', () => {
  it('keeps defaults when partial is empty', () => {
    const result = mergeSettings({ model: 'llama' }, {});
    expect(result.model).toBe('llama');
  });

  it('overrides only provided keys', () => {
    const result = mergeSettings(
      { model: 'llama', temperature: 0.7 },
      { temperature: 0.2 },
    );
    expect(result).toEqual({ model: 'llama', temperature: 0.2 });
  });
});
```

```typescript
import { describe, expect, it } from 'vitest';
import { normalizeChunkText } from './chunk';

describe('normalizeChunkText', () => {
  it('collapses repeated blank lines', () => {
    expect(normalizeChunkText('a\n\n\n\nb')).toBe('a\n\nb');
  });
});
```

Characteristics:

- Tests behavior callers care about (settings, chunks, defaults)
- Uses public exports only
- Survives refactors inside the module
- One logical assertion focus per test

## Bad tests

```typescript
// BAD: tests private / internal wiring
import { plugin } from './main';
it('calls saveSettings on load', async () => {
  const spy = vi.spyOn(plugin as never, 'saveSettings');
  await plugin.onload();
  expect(spy).toHaveBeenCalled();
});
```

```typescript
// BAD: mocks own module instead of boundary
vi.mock('./settings', () => ({ mergeSettings: vi.fn() }));
import { mergeSettings } from './settings';
// … asserts on mock, not real merge behavior
```

```typescript
// BAD: name and assert describe HOW
it('mergeSettings calls Object.assign', () => {
  /* … */
});
```

Red flags:

- Mocking `src/` collaborators you own
- Testing private methods or `Plugin` lifecycle with spies
- Asserting call order/count on internals
- `expect(true)` with no domain behavior (forbidden as only example per P4-I09)

## What to test first in this plugin

Typical **tracer bullets** (pure modules, no Obsidian UI):

- Default settings factory
- Settings merge / validation
- String or path normalization helpers
- Chunk or context helpers without `App` / `Vault`

Defer to manual issue checklists or later phases: command palette, modals, real vault I/O, Ollama HTTP (mock boundary when you add client tests).
