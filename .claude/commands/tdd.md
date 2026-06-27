TDD red-green-refactor workflow. $ARGUMENTS

## Philosophie

Tests treffen **öffentliche Schnittstellen**, nicht Implementierungsdetails. Code darf sich ändern; Tests sollen es nicht.

**Gut:** echte Pfade via Exports. Beschreibt _was_, nicht _wie_. Überlebt Refactoring.
**Schlecht:** interne Mocks, private Methoden testen, Call-Reihenfolge prüfen.

## Anti-Pattern: horizontale Slices

```
FALSCH: RED test1..5  →  GREEN impl1..5
RICHTIG: RED test1 → GREEN impl1 → RED test2 → GREEN impl2 → …
```

Ein Test → minimaler Code → wiederholen.

## Workflow

**1. Plan**

- `docs/roadmap/README.md` + Phase-README + GitHub-Issue + verlinkte `issues/*.md` lesen
- Mit User: ersten **Tracer Bullet** wählen
- Tests auf Exports in `src/`, nicht auf `Plugin`-Methoden
- Verhalten auflisten (nicht Impl-Schritte)

**2. Tracer Bullet**

```
RED:   ein Test, ein Verhalten → fail
GREEN: minimaler Pass
```

**3. Loop**

```
RED → GREEN → RED → GREEN …
```

Regeln: ein Test auf einmal; kein spekulativer Code; nur beobachtbares Verhalten.

**4. Refactor (nur auf GREEN)**

- Duplikate extrahieren
- Kleine öffentliche API, Komplexität innen
- `npm test` nach jedem Schritt

**5. Validieren**

```
npm test
npx vitest run path/to/file.test.ts
npm run typecheck   # wenn Typen oder Build betroffen
```

**6. Exit:** `/review-and-fix` gegen dieselbe Spec wie Plan.

## Obsidian-Constraints

- **Unit TDD:** pure Logik in Node/Vitest; `Plugin` = dünne Verdrahtung
- **Boundary:** `obsidian` → `vi.mock('obsidian', …)` (Stub: `src/test-utils/obsidian-stub.ts`)
- **Out of scope:** E2E in Obsidian-Fenster, vollständige UI-Klicks

## Mock-Regeln

Mock nur **System-Boundaries**:

- `obsidian`: `Plugin`, `App`, `Vault`, `Modal`, `Notice`
- `fetch` → Ollama
- Zeit / RNG

**Nicht mocken:** eigene `src/`-Module, interne Collaborators.

## Pro-Zyklus-Checkliste

```
[ ] Verhalten, nicht Implementierung
[ ] Nur öffentliche Schnittstelle
[ ] Überlebt internen Refactor
[ ] Minimaler Code für diesen Test
[ ] Keine spekulativen Features
```
