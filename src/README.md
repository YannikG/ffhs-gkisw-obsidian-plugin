# `src/` module map

Onboarding (Clone, Build, Vault, CI, Obsidian-Kurztest): [README.md](../README.md#entwicklung).

Layout for the Obsidian Summarizer plugin. Architecture overview: [SPEC.md §4](../SPEC.md#4-architektur) (Komponenten und Datenfluss).

## Modules

| Path | Role |
|------|------|
| `main.ts` | Obsidian entry: thin wiring only (`onload` / `onunload`). |
| `manifest.ts` | Build-time manifest validation (P4-I02). |
| `settings.ts` | `PluginSettings`, `DEFAULT_SETTINGS`, `mergeSettings`, `resolvePluginSettings` (SPEC §6). |
| `settings-tab.ts` | `ObsidianSummarizerSettingTab` — drei Eingabefelder, Persistenz via `saveData` (P4-I04). |
| `settings-restore-modal.ts` | Bestätigungsdialog zum Wiederherstellen leerer Pflichtfelder. |
| `summary/` | Summary filenames (US-03), folder corpus read, vault write adapter, prompts, menu (SPEC §1, US-03, §4.4). |
| `ollama/` | Ollama HTTP client: healthcheck (`/api/tags`) + chat (`/api/chat`, SPEC §5). |
| `rag/` | Vector index / retrieval stub (SPEC §4.1, §4.3). |

## Phase ownership (Phase 4)

| Module | Primary issue |
|--------|----------------|
| `main.ts`, `manifest.ts` | P4-I02 |
| `settings.ts`, `settings-tab.ts`, `settings-restore-modal.ts` | P4-I03 (types/defaults); P4-I04 (UI + persist) |
| `summary/`, `ollama/`, `rag/` skeleton | P4-I03 |
| Folder context menu | P4-I05 |
| Summary vault write (`summary-output`, `vault-write-summary`) | P5-I05 |
| Unit tests infra | P4-I09 |

## Import rules

- **No import cycles** between feature modules. Dependency direction: `main.ts` → feature modules; feature modules must not import `main.ts`.
- **Pure modules** (`settings`, `summary/*`, future helpers) must **not** import `obsidian`. Obsidian APIs stay in `main.ts` and thin adapters added in later issues.
- **Wired from `main.ts` today:** settings tab, folder **Create Summary** menu (P4-I05 stub). **Not yet wired:** `ollama/`, `rag/`, full summary orchestration beyond the menu stub.
- Prefer barrel imports from `summary/index.ts` for public summary exports.

## Tests

Colocated `src/**/*.test.ts`. Commands and Obsidian mocking: [README.md § Tests](../README.md#tests).

`vitest.config.ts` aliases `obsidian` → `src/test-utils/obsidian-stub.ts`.
