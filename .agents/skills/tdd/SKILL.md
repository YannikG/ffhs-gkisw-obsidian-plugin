---
name: tdd
description: >-
  Test-driven development (red-green-refactor), vertical slices. Use when user
  asks for TDD, test-first, red-green-refactor, or behavior tests before impl.
---

# Test-Driven Development

## Philosophy

**Core principle:** Tests verify behavior through **public interfaces**, not implementation details. Code can change entirely; tests should not.

**Good tests** exercise real code paths through exported APIs. They describe _what_ the system does. They survive refactors.

**Bad tests** mock internal collaborators, test private methods, or assert call order on internals. Warning sign: refactor without behavior change breaks tests.

See [tests.md](tests.md) and [mocking.md](mocking.md).

## Anti-pattern: horizontal slices

**Do not** write all tests first, then all implementation.

```
WRONG:  RED test1..5  →  GREEN impl1..5
RIGHT:  RED test1 → GREEN impl1 → RED test2 → GREEN impl2 → …
```

One test → minimal code → repeat. Each test responds to what you learned in the previous cycle.

## Workflow

### 1. Planning (this repo)

Before any code:

- Read [`.agents/AGENTS.md`](../../AGENTS.md): `docs/roadmap/overview.md`, affected phase/README, and if applicable the GitHub issue + `docs/roadmap/**/issues/*.md` (testable acceptance criteria = behaviors to test).
- With user: prioritize which acceptance criteria become the **tracer bullet** first.
- Prefer **testable surface**: exported functions/classes in `src/`, not private `Plugin` methods.
- List behaviors to test (not implementation steps). Get user approval when scope is unclear.

**You cannot test everything.** Focus on critical paths and non-trivial logic.

**Companion workflows**

| When | Skill |
|------|--------|
| Implement from GitHub issue | [`implement-plan-workflow`](../implement-plan-workflow/SKILL.md) — same spec source; user says TDD → use this skill during S3 |
| After cycles | [`review-and-fix`](../review-and-fix/SKILL.md) |

### 2. Tracer bullet

```
RED:   One test for first behavior → fails
GREEN: Minimal code to pass → passes
```

### 3. Incremental loop

For each remaining behavior:

```
RED:   Next test → fails
GREEN: Minimal code → passes
```

Rules: one test at a time; no speculative features; observable behavior only.

### 4. Refactor (only when GREEN)

Never refactor while RED.

Candidates:

- Extract duplication
- Deepen modules (small public API, complexity inside)
- Move logic behind simpler interfaces
- Run tests after each refactor step

### 5. Validate (this repo)

Per cycle or before PR:

- `npm test` (or `npx vitest run path/to/file.test.ts` for a single file)
- `npm run typecheck` / `npm run build` when types or bundle are affected

**If `npm test` is missing** (pre–P4-I09): either implement [P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md) first (Vitest tracer), or add minimal Vitest setup as the first RED step and document in the PR.

Convention once tooling exists: `src/**/*.test.ts` next to source ([P4-I09](../../../docs/roadmap/phase-4/issues/P4-I09-unit-tests-infrastruktur.md)).

### 6. Exit

Run [`review-and-fix`](../review-and-fix/SKILL.md). Findings against the same spec / acceptance criteria as planning.

## Obsidian plugin constraints

- **Unit TDD:** pure logic in Node/Vitest; keep `Plugin` subclass thin wiring.
- **System boundary:** `obsidian` package → `vi.mock('obsidian', …)`; see [mocking.md](mocking.md).
- **Out of scope for this skill:** E2E in a real Obsidian window, full UI click tests (later phases / manual checks in issues).
- **Security:** vault access only via APIs; no secrets in tests ([`SPEC.md`](../../../SPEC.md) NFR).

## Checklist per cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Attribution

Adapted from [mattpocock/skills – engineering/tdd](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd).
