# CLAUDE.md — ffhs-gkisw-obsidian-plugin

Obsidian plugin (TypeScript): génération de résumés de dossiers via LLM Ollama local.

## Docs zuerst (immer)

Vor Codeänderungen, projektbezogenen Shell-Befehlen oder inhaltlichen Bewertungen: **`docs/`** lesen.

**Pflichtlektüre (Reihenfolge):**

1. `docs/roadmap/overview.md` — vollständig
2. Passende Phase-README (`docs/roadmap/phase-N/README.md`)
3. Bei KI-Arbeit: `docs/roadmap/methodik-gkisw-prompt-patterns.md`
4. Phasenplan / Issue-Ketten: `docs/agents-docs/README.md`
5. Domänenglossar: `docs/agents-docs/domaenensprache.md` → `CONTEXT.md`
6. Team-Prozess: `docs/zusammenarbeit/README.md`

**Arbeit an einem Issue:** Zuerst das GitHub-Issue lesen (`gh issue view <nr>`). Enthält Body einen Permalink auf `docs/roadmap/…/issues/*.md` → diese Datei lesen und als Spezifikation verwenden. Ohne Link: Spezifikation = Issue-Titel + Body.

**PR und Review:** PR gegen dieselbe Issue-Nummer führen (`Fixes #n` / `Closes #n`). Review-Findings gegen Issue und verlinkte `.md` formulieren.

**`SPEC.md`** (Root): bei Plugin-Spezifikation oder Verhalten lesen, sobald `docs/`-Kontext klar.

## Keine Personalpronomen in schriftlichen Artefakten

Gilt für: `README.md`, `docs/**/*.md`, `CONTEXT.md`, `SPEC.md` und vergleichbare Texte sowie Agent-Antworten beim Formulieren von Doku oder PR-Beschreibungen auf Deutsch.

Keine direkte Anrede, keine Personalpronomen (du, dein, ihr, euer, Sie, Ihr).

- **Stattdessen Infinitiv oder Passiv:** «Ollama installieren», «der Alias wird erzeugt»
- **Sachlich:** «Erwartung: …», «Bei Fehlschlag: Version aktualisieren»
- **Neutral:** «die Plugin-Einstellungen» statt «deine Einstellungen»

Schweizer Hochdeutsch: **ss** nie ß, Umlaute ä/ö/ü.

## Tech Stack

| Tool      | Kommando                                              |
| --------- | ----------------------------------------------------- |
| Tests     | `npm test` oder `npx vitest run path/to/file.test.ts` |
| Typecheck | `npm run typecheck`                                   |
| Build     | `npm run build`                                       |
| Lint      | `npm run lint`                                        |
| Format    | `npm run format`                                      |

**Vor jedem Commit:** `npm run format && npm run lint && npm run typecheck && npm test` — alle vier müssen grün sein.

## Modulstruktur `src/`

| Pfad              | Rolle                                                    |
| ----------------- | -------------------------------------------------------- |
| `main.ts`         | Obsidian-Einstieg: nur Verdrahtung (`onload`/`onunload`) |
| `settings.ts`     | `PluginSettings`, Defaults, Merge, Resolve               |
| `settings-tab.ts` | Settings-UI, Persistenz via `saveData`                   |
| `summary/`        | Corpus-Lesen, Vault-Schreiben, Prompts, Menü             |
| `ollama/`         | HTTP-Client: Healthcheck + Chat                          |
| `rag/`            | Vektorindex-Stub                                         |

## Import-Regeln

- Kein Import-Zyklus zwischen Feature-Modulen
- `main.ts` → Feature-Module; Feature-Module importieren `main.ts` **nicht**
- Pure Module (`settings`, `summary/*`) importieren **kein** `obsidian`
- Barrel-Imports aus `summary/index.ts` für öffentliche Summary-Exporte

## Test-Konventionen

- Dateien: `src/**/*.test.ts` neben dem Quellmodul
- Nur öffentliche Exports testen — nicht interne Implementierung
- `obsidian` via `vi.mock` mocken; Stub: `src/test-utils/obsidian-stub.ts`
- Eigene `src/`-Module **nicht** mocken
- Test-Name = Verhalten, nicht Implementierungsdetail

## Verfügbare Slash Commands

| Command                 | Beschreibung                                          |
| ----------------------- | ----------------------------------------------------- |
| `/implement-plan`       | Issue implementieren (Branch → Code → Review)         |
| `/tdd`                  | TDD red-green-refactor Workflow                       |
| `/review-and-fix`       | Code-Review + Fix-Loop                                |
| `/grill`                | Plan-Stress-Test gegen Domänensprache und Docs        |
| `/caveman`              | Ultra-komprimierter Kommunikationsmodus               |
| `/github-issue-anlegen` | GitHub-Issue aus `docs/roadmap/…/issues/*.md` anlegen |
