# `src/` module map

Layout for the Obsidian Summarizer plugin. Architecture overview: [SPEC.md §4](../SPEC.md#4-architektur) (Komponenten und Datenfluss).

## Modules

| Path                        | Role                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `main.ts`                   | Obsidian entry: thin wiring only (`onload` / `onunload`).                                                   |
| `manifest.ts`               | Build-time manifest validation (P4-I02).                                                                    |
| `settings.ts`               | `PluginSettings`, `DEFAULT_SETTINGS`, `mergeSettings`, `resolvePluginSettings` (SPEC §6).                   |
| `settings-tab.ts`           | `ObsidianSummarizerSettingTab` — drei Eingabefelder, Persistenz via `saveData` (P4-I04).                    |
| `settings-restore-modal.ts` | Bestätigungsdialog zum Wiederherstellen leerer Pflichtfelder.                                               |
| `summary/`                  | Summary output filenames (`buildSummaryOutputFilename`, …) and future orchestration (SPEC §1, US-03, §4.4). |
| `ollama/`                   | Local Ollama client stub (SPEC §5).                                                                         |
| `rag/`                      | Vector index / retrieval stub (SPEC §4.1, §4.3).                                                            |

## Phase ownership (Phase 4)

| Module                                                        | Primary issue                                  |
| ------------------------------------------------------------- | ---------------------------------------------- |
| `main.ts`, `manifest.ts`                                      | P4-I02                                         |
| `settings.ts`, `settings-tab.ts`, `settings-restore-modal.ts` | P4-I03 (types/defaults); P4-I04 (UI + persist) |
| `summary/`, `ollama/`, `rag/` skeleton                        | P4-I03                                         |
| Folder context menu                                           | P4-I05                                         |
| Unit tests infra                                              | P4-I09                                         |

## Import rules

- **No import cycles** between feature modules. Dependency direction: `main.ts` → feature modules; feature modules must not import `main.ts`.
- **Pure modules** (`settings`, `summary/*`, future helpers) must **not** import `obsidian`. Obsidian APIs stay in `main.ts` and thin adapters added in later issues.
- **Do not** wire `ollama/`, `rag/`, or `summary/` from `main.ts` until the matching issue; keep `onload` minimal for smoke tests.
- Prefer barrel imports from `summary/index.ts` for public summary exports.

## Tests

Colocated Vitest files: `**/*.test.ts` next to the module under test. Run: `npm test`.

Obsidian APIs are not loaded in unit tests: Vitest resolves `obsidian` to `src/test-utils/obsidian-stub.ts` (see `vitest.config.ts`).

## Quality before PR

Recommended order (same as CI):

1. `npm run format:check` — or `npm run format` to fix formatting
2. `npm run lint`
3. `npm test`
4. `npm run build`
