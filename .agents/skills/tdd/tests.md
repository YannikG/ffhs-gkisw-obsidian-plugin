# Tests (this repo)

Vitest, Node. Files: `src/**/*.test.ts` beside module ([P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md)).

## Good

Exported APIs. Name = capability, not internals.

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

- Behavior callers care about (settings, chunks, defaults)
- Public exports only
- Survives refactor
- One logical focus per test

## Bad

```typescript
// BAD: private wiring
import { it, vi } from 'vitest';
import { plugin } from './main';
it('calls saveSettings on load', async () => {
  const spy = vi.spyOn(plugin as never, 'saveSettings');
  await plugin.onload();
  expect(spy).toHaveBeenCalled();
});
```

```typescript
// BAD: mock own module
vi.mock('./settings', () => ({ mergeSettings: vi.fn() }));
import { mergeSettings } from './settings';
```

```typescript
// BAD: HOW not WHAT
it('mergeSettings calls Object.assign', () => { /* … */ });
```

Red flags:

- Mock `src/` you own
- Spy `Plugin` lifecycle
- Assert internal call order/count
- Lone `expect(true)` (P4-I09 forbids as only example)

## Tracer bullets first

Pure modules, no Obsidian UI:

- Default settings factory
- Settings merge / validation
- String/path normalize
- Chunk helpers without `App` / `Vault`

Later / manual: palette, modals, real vault I/O. Ollama HTTP → mock boundary when added.
