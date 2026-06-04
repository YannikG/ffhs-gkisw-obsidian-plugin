# Architecture — Obsidian Summarizer (MVP)

Describes the current implementation. Product specification: [SPEC.md](../SPEC.md). For setup and dev commands: [README.md](../README.md).

---

## Dataflow — Create Summary with RAG

```mermaid
flowchart LR
  User -->|right-click folder| Menu[Folder context menu\nCreate Summary]
  Menu --> Adapter[create-summary-for-folder\nOllama client + vault wiring]
  Adapter --> RagRun[create-summary-rag-run\nOrchestration]

  RagRun -->|1 listSources| Scan[vault-folder-sources\nrecursive .md scan\nexcludes summary files]
  RagRun -->|2 buildRetrievalQueryText| Query[retrieval-query-text\nquery string from filenames + headings]
  RagRun -->|3 indexFolderScope| Index[background-index\nchunk → embed → vector store]
  RagRun -->|4 retrieveTopK| Retrieve[retrieve-top-k\nembed query → sqlite-vec → top-K chunks]
  RagRun -->|5 buildRetrievalContext| Ctx[retrieval-context\njoin chunks ≤ contextLimit]
  RagRun -->|6 checkOllamaReachable| Check[ollama/client\n/api/tags dual-check\ngen + embed model]
  RagRun -->|7 chat| Chat[ollama/client\n/api/chat → summary text]
  RagRun -->|8 writeSummary| Write[vault-write-summary\n{folder}_summary.md\nor overwrite / version]
```

---

## Module Overview

| Path | Role |
|------|------|
| `main.ts` | Obsidian entry point — thin wiring only (`onload` / `onunload`) |
| `settings.ts` | `PluginSettings`, defaults, merge, resolve, validation helpers |
| `settings-tab.ts` | Settings UI — three sections (Ollama / Vektorindex / Zusammenfassung), validation, connection test button |
| `settings-restore-modal.ts` | Confirmation dialog when a required field is cleared |
| `ollama/client.ts` | HTTP client — `/api/tags` dual-check, `/api/chat`, `/api/embed` |
| `ollama/types.ts` | Shared types: `OllamaClient`, `OllamaResult`, `OllamaError` |
| `summary/create-summary-rag-run.ts` | RAG orchestrator — full Create Summary pipeline (port-injected, testable) |
| `summary/create-summary-for-folder.ts` | Obsidian adapter — wires vault, settings, Ollama client into `runCreateSummaryRag` |
| `summary/create-summary-run.ts` | Non-RAG orchestrator (full-corpus path, kept for reference) |
| `summary/build-summary-messages.ts` | Builds system + user messages for `/api/chat` |
| `summary/retrieval-query-text.ts` *(in `rag/`)* | Derives query string from folder entries |
| `summary/vault-folder-sources.ts` | Lists + reads markdown sources, excludes summary output files |
| `summary/filename.ts` | Filename sanitisation, source-filter patterns (SPEC §4.4) |
| `summary/vault-write-summary.ts` | Writes summary to vault — versioned or overwrite |
| `summary/summary-output.ts` | Resolves output path (base file vs. next version) |
| `rag/chunking.ts` | Paragraph chunker — `chunkMarkdown`, defaults 1 000 / 200 chars |
| `rag/retrieval-query-text.ts` | Query text from filenames + first heading |
| `rag/retrieval-context.ts` | Joins top-K chunks into context string |
| `rag/retrieve-top-k.ts` | Embeds query, searches vector store, returns top-K chunks |
| `rag/vectors.ts` / `vectors-sqlite.ts` / `vectors-wasm.ts` | Vector store backends — SQLite + sqlite-wasm-vec with JSON fallback |
| `rag/store.ts` | Singleton: holds `VectorsStore` and `Orchestrator` instances |
| `rag/orchestrator.ts` | Idle queue + vault-event routing (index / delete per file) |
| `rag/background-index.ts` | Public facade — `startBackgroundIndex`, `disposeBackgroundIndex`, `resetIndex`, `indexFolderScopeWithNotice` |
| `sources/should-index.ts` | Path filter — excludes `.obsidian/`, summary output files, non-`.md` paths |

---

## Index Policy

Three indexing triggers, in descending priority:

| Trigger | Mechanism | Notes |
|---------|-----------|-------|
| **Vault event** (modify / create) | `Orchestrator.handleFileChange` — indexes immediately, cancels scheduled idle tick | Highest priority |
| **On-demand** (Create Summary) | `indexFolderScopeWithNotice` → `Orchestrator.indexFolderScope` — synchronous, blocks until folder tree is indexed | Runs before retrieval |
| **Idle** (startup + residual) | `Orchestrator.addToIdleQueue` → `requestIdleCallback` (or `setTimeout 50 ms` fallback), batch size 3 | Background, lowest priority |

Delete events remove the file from the idle queue and call `deleteHandler` on the vector store.

Paths excluded from indexing (see `sources/should-index.ts`): `.obsidian/`, files matching `*_summary.md` / `*_summary_<N>.md`, `summary.md` (legacy), non-`.md` extensions.

---

## Summary Run — Step by Step

Entrypoint: `runCreateSummaryRag` in `create-summary-rag-run.ts`.

| Step | Code | What happens |
|------|------|--------------|
| 1 | `listSources()` | Recursively lists `.md` files under the folder; excludes summary output files (SPEC §4.4) |
| 2 | `buildRetrievalQueryText(entries)` | Extracts filenames + first headings to build a retrieval query; returns `ok: false` if folder is empty → notice shown, run aborted |
| 3 | `indexFolderScope()` | Chunks sources, embeds via `nomic-embed-text`, writes vectors to SQLite store |
| 4 | `retrieveTopK(queryText)` | Embeds query, runs ANN search in sqlite-vec, returns top-K chunks (K = `retrievalTopK` setting) |
| 5 | `buildRetrievalContext(chunks)` | Joins chunk texts into one context string; checked against `contextLimit` |
| 6 | `checkOllamaReachable()` | Calls `/api/tags`; verifies both `generationModel` and `embeddingModel` are loaded |
| 7 | `chat(messages)` | Posts to `/api/chat` with system prompt + retrieval context + folder label |
| 8 | `writeSummary(content)` | Writes `{folder}_summary.md`; creates `_summary_2`, `_summary_3` … if base exists and overwrite is off; overwrites base if `summaryOverwriteBase` is on |

Notice shown at each failure point; no silent errors (SPEC §5).

---

## Settings Overview

Configured via the plugin settings tab (three sections). Full field list: [SPEC.md §6](../SPEC.md#6-einstellungen-minimum).

| Section | Fields |
|---------|--------|
| **Ollama** | Base URL, generation model, embedding model, timeout, «Verbindung testen» button |
| **Vektorindex** | Context limit, chunk size, chunk overlap, retrieval top-K, «Zurücksetzen» button |
| **Zusammenfassung** | Summary-overwrite toggle (`summaryOverwriteBase`) |

**Implementation note:** `checkOllamaReachable` performs a dual-check — both the generation model and the embedding model must appear in `/api/tags`. This differs from SPEC §5 which only describes a generic reachability check; the dual-check ensures both models are available before starting a run.
