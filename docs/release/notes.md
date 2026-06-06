# Release Notes — Obsidian Summarizer

## v1.0.0 — MVP Release (2026-06-04)

Erster stabiler Release des Obsidian Summarizer Plugins, entwickelt im Rahmen des FFHS-Moduls «Generative KI für Softwareentwickler» (GKISW).

### Features

**Create Summary (US-01, US-03)**
- Rechtsklick auf Ordner → **Create Summary** erzeugt eine strukturierte Zusammenfassung aller Markdown-Dateien im Ordner (inkl. Unterordner).
- Ausgabedatei: `{Ordnername}_summary.md` im gewählten Ordner.
- Weitere Läufe erzeugen versionierte Dateien (`_summary_2`, `_summary_3`, …).
- Toggle «Summary-Basisdatei überschreiben»: überschreibt statt versioniert.

**RAG-Pipeline (US-02)**
- Chunking der Quelltexte (Standard: 1 000 Zeichen, Overlap 200).
- Embeddings via `nomic-embed-text` (Ollama lokal).
- Vektorindex: SQLite + sqlite-wasm-vec.
- Semantisches Top-K-Retrieval vor dem LLM-Aufruf.
- Quellenfilter: Summary-Ausgabedateien werden nie als Quelle indexiert.

**Einstellungen**
- Drei Abschnitte: Ollama / Vektorindex / Zusammenfassung.
- Konfigurierbar: Base URL, Generierungsmodell, Embedding-Modell, Timeout, Chunk-Grösse, Chunk-Overlap, Retrieval Top-K, Kontextlimit.
- Button «Verbindung testen»: prüft beide Modelle via `/api/tags`.
- Button «Vektorindex zurücksetzen».

**Modelle (Standard)**
- Generierung: `gemma4:e2b`
- Embeddings: `nomic-embed-text`

### Evaluationsergebnisse

| Metrik | Ergebnis | Ziel (SPEC §8) |
|--------|----------|----------------|
| Generierungszeit | 15 s | < 80 s ✅ |
| Inhaltsabdeckung (eval-01, ML) | 100 % | ≥ 80 % ✅ |
| Inhaltsabdeckung (gesamt) | 67 % | ≥ 80 % ⚠️ |
| Markdown-Format | valide | valide ✅ |

### Bekannte Einschränkungen

- Inhaltsabdeckung bei mixed-topic Ordnern unter 80 % (Top-K-Retrieval deckt nicht alle Themen ab).
- Eingebaute Quellenfehler werden selten reproduziert (Knowledge Conflict, Modellgrösse).
- Referenzrechner: MacBook M4 Pro (SPEC); Messung auf Windows 11.

### Technischer Stack

- Obsidian Desktop Plugin API
- TypeScript, Node.js 20+, esbuild
- Ollama lokal (`http://127.0.0.1:11434`)
- SQLite + sqlite-wasm-vec
