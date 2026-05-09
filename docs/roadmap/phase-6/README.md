# Phase 6: Einbau RAG

[Zurück zur Roadmap-Übersicht](../overview.md)

**Status:** Geplant

RAG-Pipeline, Vektordatenbank auf SQLite. Pipeline beim Obsidian-Start ausführen, Obsidian-Event-Bus abonnieren, Datenbank aus Events pflegen.

Architektur: [SPEC.md](../../../SPEC.md). LLM-Anbindung vorher: [Phase 5](../phase-5/README.md).

## Arbeitsinhalt

- Indexing, Embeddings, Speicher in SQLite.
- Lifecycle: Plugin-Start, Event-Handler, inkrementelle Updates.

## Verweise

- [Roadmap-Übersicht](../overview.md)
- [SPEC.md](../../../SPEC.md)
- [Phase 5](../phase-5/README.md)
- [Phase 7 — Verknüpfung RAG mit LLM](../phase-7/README.md)
