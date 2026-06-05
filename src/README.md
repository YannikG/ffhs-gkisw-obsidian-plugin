# `src/` module map

Onboarding (Clone, Build, Vault, CI, Obsidian-Kurztest): [README.md](../README.md#entwicklung).

Layout for the Obsidian Summarizer plugin. Architecture overview: [docs/architecture.md](../docs/architecture.md). Product specification: [SPEC.md §4](../SPEC.md#4-architektur).

## Modules

| Path | Role |
|------|------|
| `main.ts` | Obsidian entry: thin wiring only (`onload` / `onunload`). |
| `manifest.ts` | Build-time manifest validation (P4-I02). |
| `settings.ts` | `PluginSettings`, `DEFAULT_SETTINGS`, `mergeSettings`, `resolvePluginSettings` (SPEC §6; inkl. Kontextlimit und Ollama-Timeout, P5-I06). |
| `settings-tab.ts` | `ObsidianSummarizerSettingTab` — drei Abschnitte (Ollama / Vektorindex / Zusammenfassung), Validierung, «Verbindung testen»-Button (P4-I04, P5-I06, P8-I01). |
| `settings-restore-modal.ts` | Bestätigungsdialog zum Wiederherstellen leerer Pflichtfelder. |
| `ollama/` | Ollama HTTP client: dual-check (`/api/tags`, gen + embed model), chat (`/api/chat`), embed (`/api/embed`) (SPEC §5, P5-I02, P8-I01). |
| `summary/build-summary-messages.ts` | System- und User-Messages für `/api/chat` (P5-I03). Prompt-Text hier iterieren. |
| `summary/folder-source-corpus.ts`, `summary/vault-folder-sources.ts` | Ordner-Quellkorpus lesen und formatieren (P5-I04). |
| `summary/filename.ts` | Summary-Dateinamen, Sanitisierung, Quellenfilter (US-03, SPEC §4.4). |
| `summary/summary-output.ts`, `summary/vault-write-summary.ts` | Summary ins Vault schreiben, Versionierung ohne Überschreiben (P5-I05). |
| `summary/create-summary-rag-run.ts` | RAG-Orchestrator: Listing → Query → Index → Retrieve → Kontext → Chat → Schreiben; port-injiziert für Tests (P7-I04). |
| `summary/create-summary-run.ts` | Nicht-RAG-Orchestrator (Vollkorpus-Pfad, P5-I06). |
| `summary/create-summary-for-folder.ts` | Obsidian-Adapter: verdrahtet Vault, Settings, Ollama-Client, RAG-Index mit `runCreateSummaryRag` (P5-I06, P7-I04). |
| `summary/create-summary-notices.ts`, `summary/context-limit.ts` | Notice-Texte und Kontextlimit-Prüfung (P5-I06). |
| `summary/create-summary-file-menu.ts` | Ordner-Kontextmenü **Create Summary** (P4-I05, P5-I06). |
| `rag/chunking.ts` | Absatz-Chunking für Embeddings: `chunkMarkdown`, Defaults 1000/200 (P6-I01). |
| `rag/store.ts` | Singleton-Verwaltung für VectorsStore und Orchestrator (`openIndex`, `getIndex`, `setOrchestrator`, `getOrchestrator`). |
| `rag/orchestrator.ts` | Idle-Queue und Vault-Event-Verarbeitung: `Orchestrator`, `indexFolderScope` (P6-I04). |
| rag/retrieval-query-text.ts | Kombiniert den gesamten Inhalt der Dateien bis zu einem Limit von 8'000 Zeichen für den Retrieval-Query-Text (P7-I01). |
| `rag/retrieval-context.ts` | Fügt Top-K-Chunks zu einem Kontext-String zusammen (P7-I03). |
| `rag/retrieve-top-k.ts` | Bettet Query ein, sucht in sqlite-vec, gibt Top-K Chunks zurück (P7-I02). |
| `rag/background-index.ts` | Öffentliche Fassade: `startBackgroundIndex`, `disposeBackgroundIndex`, `indexFolderScopeWithNotice`, `resetIndex` (P6-I07). |
| `rag/index.ts` | Barrel für alle RAG-Exporte. |

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
| P6-I01 | `rag/chunking.ts` |
| P6-I02 | `ollama/client.ts` (Embeddings-Endpunkt) |
| P6-I03 | `rag/vectors-sqlite.ts`, `rag/vectors-wasm.ts`, `rag/vectors.ts`, `rag/store.ts` |
| P6-I04 | `rag/orchestrator.ts` |
| P6-I05 | `sources/should-index.ts` |
| P6-I06 | `settings.ts` (chunkSize/chunkOverlap), `settings-tab.ts` |
| P6-I07 | `rag/background-index.ts`, `main.ts` (Idle + Events + onunload) |

## Phase ownership (Phase 7)

| Issue | Primary paths |
|-------|----------------|
| P7-I01 | `rag/retrieval-query-text.ts` |
| P7-I02 | `rag/retrieve-top-k.ts` |
| P7-I03 | `rag/retrieval-context.ts` |
| P7-I04 | `summary/create-summary-rag-run.ts`, `summary/create-summary-for-folder.ts` (RAG-Pfad) |

## Phase ownership (Phase 8)

| Issue | Primary paths |
|-------|----------------|
| P8-I01 | `ollama/client.ts` (dual-check), `settings-tab.ts` (drei Abschnitte, «Verbindung testen»-Button), `main.ts` (`checkOllama`) |
| P8-I02 | `settings.ts` (`summaryOverwriteBase`), `summary/create-summary-run.ts`, `summary/vault-write-summary.ts` (Überschreiben-Logik) |

## Entwicklung und manueller Test

**Ollama-Setup (P5-I01):** [README.md § Ollama](../README.md#ollama), Details [docs/ollama/README.md](../docs/ollama/README.md).

**Prompt-Iteration (P5-I03):** System- und User-Prompt in [`summary/build-summary-messages.ts`](summary/build-summary-messages.ts) anpassen (SPEC §7; Qualität manuell prüfen).

**Create Summary End-to-End mit RAG (P7-I04, aktueller Pfad):**

1. Ollama läuft; `gemma4:e2b` und `nomic-embed-text` verfügbar (Settings → «Verbindung testen» prüft beide).
2. Plugin in Obsidian laden; Einstellungen prüfen (Defaults SPEC §6).
3. Vault-Ordner mit mindestens einer eingeschlossenen `.md` (keine Summary-Ausgabedateien als Quelle).
4. Rechtsklick auf den Ordner → **Create Summary** → Notices für Indexierung und Generierung, danach Erfolgs-Notice mit Dateiname (`{Ordner}_summary.md`).
5. Zweiter Lauf, Toggle «Summary-Basisdatei überschreiben» aus → versionierte Datei (`{Ordner}_summary_2.md`, …).
6. Toggle an → Basisdatei wird überschrieben; Notice «Summary überschrieben: …».
7. Optional prüfen: leerer Ordner, Ollama nicht erreichbar → jeweilige Fehler-Notice, keine neue Summary.

## Import rules

- **No import cycles** between feature modules. Dependency direction: `main.ts` → feature modules; feature modules must not import `main.ts`.
- **Pure modules** (`settings`, `summary/*` ohne Obsidian-Import, `ollama/*`, `rag/chunking.ts`) must **not** import `obsidian`. Obsidian APIs stay in `main.ts` and thin adapters (`create-summary-for-folder.ts`, `vault-write-summary.ts`, `create-summary-file-menu.ts`).
- **Wired from `main.ts`:** settings tab; folder **Create Summary** → `runCreateSummaryRagForFolder` → `create-summary-rag-run` → RAG index + `ollama/` + vault write.
- **Wired in Phase 6:** `rag/background-index.ts` → `startBackgroundIndex` / `disposeBackgroundIndex` in `main.ts`.
- **Wired in Phase 7:** `retrieveTopK`, `buildRetrievalQueryText`, `buildRetrievalContext` fully connected via `runCreateSummaryRag`.
- Prefer barrel imports from `summary/index.ts` for public summary exports.

## Tests

Colocated `src/**/*.test.ts`. Commands and Obsidian mocking: [README.md § Tests](../README.md#tests).

Orchestrator-Verhalten: `summary/create-summary-run.test.ts` (injizierte Ports, kein echtes Ollama).

`vitest.config.ts` aliases `obsidian` → `src/test-utils/obsidian-stub.ts`.
