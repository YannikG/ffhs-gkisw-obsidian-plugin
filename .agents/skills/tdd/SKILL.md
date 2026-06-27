---
name: tdd
description: >-
  TDD red-green-refactor, vertical slices. Triggers: TDD, test-first,
  red-green-refactor, behavior tests before impl.
---

# TDD

**Style:** write this skill caveman-compressed ([caveman](../caveman/SKILL.md) **full**). Code blocks normal.

## Philosophy

Tests hit **public interface**, not impl details. Code may change; tests should not.

**Good:** real paths via exports. Describe _what_, not _how_. Survive refactor.

**Bad:** mock internals, test private methods, assert call order. Refactor breaks test but behavior same → bad test.

→ [tests.md](tests.md), [mocking.md](mocking.md)

## Anti-pattern: horizontal slices

```
WRONG:  RED test1..5  →  GREEN impl1..5
RIGHT:  RED test1 → GREEN impl1 → RED test2 → GREEN impl2 → …
```

One test → minimal code → repeat.

## Workflow

### 1. Plan (this repo)

Before code:

- Read [AGENTS.md](../../AGENTS.md): `docs/roadmap/README.md`, phase README, GitHub issue + `docs/roadmap/**/issues/*.md` if linked. **Acceptance criteria = behaviors.**
- With user: pick **tracer bullet** first.
- Test **exports** in `src/`, not private `Plugin` methods.
- List behaviors (not impl steps). Ask if scope unclear.

Cannot test everything. Critical paths + non-trivial logic only.

| When | Skill |
|------|--------|
| Issue impl | [implement-plan-workflow](../implement-plan-workflow/SKILL.md) — same spec; TDD during S3 |
| Done | [review-and-fix](../review-and-fix/SKILL.md) |

### 2. Tracer bullet

```
RED:   one test, one behavior → fail
GREEN: minimal pass
```

### 3. Loop

```
RED → GREEN → RED → GREEN …
```

Rules: one test at a time; no speculative code; observable behavior only.

### 4. Refactor (GREEN only)

Never refactor on RED.

- Extract dup
- Small public API, complexity inside
- Simpler interfaces
- `npm test` after each step

### 5. Validate

- `npm test` or `npx vitest run path/to/file.test.ts`
- `npm run typecheck` / `npm run build` if types or bundle touched

**No `npm test` yet** (pre-P4-I09): do [P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md) first, or Vitest setup = first RED; note in PR.

Convention: `src/**/*.test.ts` next to source ([P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md)).

### 6. Exit

[review-and-fix](../review-and-fix/SKILL.md) against same spec as plan.

## Obsidian constraints

- **Unit TDD:** pure logic in Node/Vitest; `Plugin` = thin wire only.
- **Boundary:** `obsidian` → `vi.mock('obsidian', …)` → [mocking.md](mocking.md)
- **Out of scope:** E2E in Obsidian window, full UI clicks (later phases / manual in issues).
- **Security:** vault via APIs only; no secrets in tests ([SPEC.md](../../../SPEC.md) PRD-NF01/NF02).

## Per-cycle checklist

```
[ ] behavior not impl
[ ] public interface only
[ ] survives internal refactor
[ ] minimal code for this test
[ ] no speculative features
```

## Source

[mattpocock/skills engineering/tdd](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd).
