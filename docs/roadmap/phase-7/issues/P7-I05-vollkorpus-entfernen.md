# [P7-I05] Vollkorpus-Pfad aus Produktionsflow entfernen

```text
Phase: 7
Issue-ID: P7-I05
GitHub: #47
Blockiert von: P7-I04 (#46)
```

## Meta

- **Issue-ID:** P7-I05
- **GitHub:** #47
- **Blockiert von:** [P7-I04](./P7-I04-summary-orchestrator-rag.md) (#46)
- **Blockiert:** Phase 8

## Abhängigkeiten

- [P7-I04-summary-orchestrator-rag.md](./P7-I04-summary-orchestrator-rag.md)

## Ziel

Produktionsflow **Create Summary** nutzt ausschliesslich den RAG-Pfad (P7-I04). Der Phase-5-Pfad «gesamter **Ordner-Quellkorpus** → Chat» ist aus dem Menü und Orchestrator entfernt. `buildRetrievalQueryText` und Lese-Utilities bleiben für die Query.

## Testbare Akzeptanzkriterien

- [ ] Menü/Orchestrator ruft für Chat **nicht** mehr `buildSourceContext` / Vollkorpus-Korpus auf.
- [ ] `collectFolderSourceCorpus` bleibt exportiert, falls P7-I01/P5-Filter es brauchen; tote P5-only-Orchestrator-Zweige entfernt.
- [ ] Test oder Integrationstest: RAG-Orchestrator-Pfad ohne Vollkorpus-Chat.
- [ ] `src/README.md` Phase-7-Hinweis; `npm test` grün.

## Dev-Lifecycle

1. Nach P7-I04 merge: Refactor entfernen, Tests anpassen.
2. Review: kein stiller Volltext-Fallback.
3. Merge schliesst Phase-7-Kern ab.

## Ausserhalb des Scopes

- Löschen von `vault-folder-sources` / Filter-Modul.
- Phase-8-Settings-UX.
