# `src/` module map

Onboarding (Clone, Build, Vault, CI, Obsidian-Kurztest): [README.md](../README.md#entwicklung).

Layout for the Obsidian Summarizer plugin. Architecture overview: [SPEC.md §4](../SPEC.md#4-architektur) (Komponenten und Datenfluss).

## Modules

| Path | Role |
|------|------|
| `main.ts` | Obsidian entry: thin wiring only (`onload` / `onunload`). |
| `manifest.ts` | Build-time manifest validation (P4-I02). |
| `settings.ts` | `PluginSettings`, `DEFAULT_SETTINGS`, `mergeSettings`, `resolvePluginSettings` (SPEC §6; inkl. Kontextlimit und Ollama-Timeout, P5-I06). |
| `settings-tab.ts` | `ObsidianSummarizerSettingTab` — fünf Eingabefelder, Persistenz via `saveData` (P4-I04, P5-I06). |
| `settings-restore-modal.ts` | Bestätigungsdialog zum Wiederherstellen leerer Pflichtfelder. |
| `ollama/` | Ollama HTTP client: healthcheck (`/api/tags`) + chat (`/api/chat`, SPEC §5, P5-I02). |
| `summary/build-summary-messages.ts` | System- und User-Messages für `/api/chat` (P5-I03). Prompt-Text hier iterieren. |
| `summary/folder-source-corpus.ts`, `summary/vault-folder-sources.ts` | Ordner-Quellkorpus lesen und formatieren (P5-I04). |
| `summary/filename.ts` | Summary-Dateinamen, Sanitisierung, Quellenfilter (US-03, SPEC §4.4). |
| `summary/summary-output.ts`, `summary/vault-write-summary.ts` | Summary ins Vault schreiben, Versionierung ohne Überschreiben (P5-I05). |
| `summary/create-summary-run.ts` | Orchestrator: Korpus → Kontextlimit → Ollama Chat → Schreiben; port-injiziert für Tests (P5-I06). |
| `summary/create-summary-for-folder.ts` | Obsidian-Adapter: Vault, Settings, Ollama-Client, Notices (P5-I06). |
| `summary/create-summary-notices.ts`, `summary/context-limit.ts` | Notice-Texte und Kontextlimit-Prüfung (P5-I06). |
| `summary/create-summary-file-menu.ts` | Ordner-Kontextmenü **Create Summary** (P4-I05, P5-I06). |
| `rag/chunking.ts` | Absatz-Chunking für Embeddings: `chunkMarkdown`, Defaults 1000/200 (P6-I01). |
| `rag/index.ts` | Barrel für RAG-Exports; Index/Retrieval folgen in späteren P6-Issues (SPEC §4.1, §4.3). |

Weitere Hilfsdateien unter `summary/` (z. B. `vault-folder-tree.ts`) sind Implementierungsdetails der genannten Module.

## Phase ownership (Phase 4)

| Module | Primary issue |
|--------|----------------|
| `main.ts`, `manifest.ts` | P4-I02 |
| `settings.ts`, `settings-tab.ts`, `settings-restore-modal.ts` | P4-I03 (types/defaults); P4-I04 (UI + persist) |
| `summary/`, `ollama/`, `rag/` skeleton | P4-I03 |
| Folder context menu | P4-I05 |
| Unit tests infra | P4-I09 |

## Phase ownership (Phase 5)

| Issue | Primary paths / docs |
|-------|----------------------|
| P5-I01 | Root-[README.md § Ollama](../README.md#ollama), [docs/ollama/README.md](../docs/ollama/README.md) |
| P5-I02 | `ollama/` (`client.ts`, `types.ts`) |
| P5-I03 | `summary/build-summary-messages.ts` |
| P5-I04 | `summary/folder-source-corpus.ts`, `summary/vault-folder-sources.ts` |
| P5-I05 | `summary/filename.ts`, `summary/summary-output.ts`, `summary/vault-write-summary.ts` |
| P5-I06 | `summary/create-summary-run.ts`, `summary/create-summary-for-folder.ts`, `summary/create-summary-notices.ts`, `summary/context-limit.ts`, Menü, Settings-Erweiterung |
| P5-I07 | `src/README.md` (dieses Dokument) |

## Phase ownership (Phase 6)

| Issue | Primary paths |
|-------|----------------|
| P6-I01 | `rag/chunking.ts`, `rag/index.ts` |

## Entwicklung und manueller Test

**Ollama-Setup (P5-I01):** [README.md § Ollama](../README.md#ollama), Details [docs/ollama/README.md](../docs/ollama/README.md).

**Prompt-Iteration (P5-I03):** System- und User-Prompt in [`summary/build-summary-messages.ts`](summary/build-summary-messages.ts) anpassen (SPEC §7; Qualität manuell prüfen).

**Create Summary End-to-End ohne RAG (P5-I06):**

1. Ollama läuft; Modelle laut Plugin-Einstellungen verfügbar.
2. Plugin in Obsidian laden; Einstellungen prüfen (Defaults SPEC §6, optional Kontextlimit / Timeout).
3. Vault-Ordner mit mindestens einer eingeschlossenen `.md` (keine Summary-Ausgabedateien als Quelle).
4. Rechtsklick auf den Ordner → **Create Summary** → Notice «Generiere…», danach Erfolgs-Notice mit Dateiname (`{Ordner}_summary.md`).
5. Zweiter Lauf im selben Ordner → versionierte Datei (`{Ordner}_summary_2.md`, …).
6. Optional prüfen: leerer Quellordner, Kontextlimit überschritten, Ollama nicht erreichbar → jeweilige Fehler-Notice, keine neue Summary.

Spezifikation der Akzeptanzkriterien: [P5-I06-create-summary-ohne-rag.md](../docs/roadmap/phase-5/issues/P5-I06-create-summary-ohne-rag.md). RAG-Pfad ab Phase 6.

## Import rules

- **No import cycles** between feature modules. Dependency direction: `main.ts` → feature modules; feature modules must not import `main.ts`.
- **Pure modules** (`settings`, `summary/*` ohne Obsidian-Import, `ollama/*`, `rag/chunking.ts`) must **not** import `obsidian`. Obsidian APIs stay in `main.ts` and thin adapters (`create-summary-for-folder.ts`, `vault-write-summary.ts`, `create-summary-file-menu.ts`).
- **Wired from `main.ts`:** settings tab; folder **Create Summary** → `runCreateSummaryForFolder` → `create-summary-run` → `ollama/` + Vault-Schreiben.
- **Not yet wired:** `rag/` (Retrieval und Index, Phase 6+).
- Prefer barrel imports from `summary/index.ts` for public summary exports.

## Tests

Colocated `src/**/*.test.ts`. Commands and Obsidian mocking: [README.md § Tests](../README.md#tests).

Orchestrator-Verhalten: `summary/create-summary-run.test.ts` (injizierte Ports, kein echtes Ollama).

`vitest.config.ts` aliases `obsidian` → `src/test-utils/obsidian-stub.ts`.
