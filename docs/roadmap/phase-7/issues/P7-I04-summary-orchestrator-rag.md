# [P7-I04] Summary-Orchestrator (RAG-Pfad)

```text
Phase: 7
Issue-ID: P7-I04
Blockiert von: P7-I01, P7-I02, P7-I03, P6-I07, P5-I06
```

## Meta

- **Issue-ID:** P7-I04
- **Blockiert von:** [P7-I01](./P7-I01-retrieval-query-text.md), [P7-I02](./P7-I02-retrieve-top-k.md), [P7-I03](./P7-I03-retrieval-kontext-top-k-settings.md), [P6-I07](../../phase-6/issues/P6-I07-rag-modul-integration.md), [P5-I06-create-summary-ohne-rag.md](../../phase-5/issues/P5-I06-create-summary-ohne-rag.md)
- **Blockiert:** P7-I05

## Abhängigkeiten

- [P7-I01-retrieval-query-text.md](./P7-I01-retrieval-query-text.md)
- [P7-I02-retrieve-top-k.md](./P7-I02-retrieve-top-k.md)
- [P7-I03-retrieval-kontext-top-k-settings.md](./P7-I03-retrieval-kontext-top-k-settings.md)
- [P6-I07-rag-modul-integration.md](../../phase-6/issues/P6-I07-rag-modul-integration.md)
- [P5-I06-create-summary-ohne-rag.md](../../phase-5/issues/P5-I06-create-summary-ohne-rag.md)
- [P5-I05-summary-datei-schreiben.md](../../phase-5/issues/P5-I05-summary-datei-schreiben.md)

## Ziel

Menü **Create Summary** auf RAG umstellen: On-Demand-Index → Retrieval-Query → Top-K → **Kontextlimit** auf Summe der Chunk-Texte → Chat → Summary schreiben. Kein Volltext-**Ordner-Quellkorpus** im Chat.

## Testbare Akzeptanzkriterien

- [ ] Ablauf: `indexFolderScopeWithNotice` → Query-Text → `retrieveTopKForFolder` mit `retrievalTopK` aus Settings → `buildRetrievalContext` → `buildSummaryMessages` → Ollama → Schreiben (P5-I05).
- [ ] **Kontextlimit** (P5-I06): Summe der Chunk-**Texte** (ohne Markdown-Dekoration der Pfadzeilen optional in Spec festlegen: Empfehlung Summe `chunk.text`); Überschreitung → Notice + Abbruch.
- [ ] Notice **(A)** keine Quellen: «Keine Quellen in diesem Ordner.» — vor Index, kein Embed.
- [ ] Notice **(B)** **Leeres Retrieval:** «Keine indexierten Inhalte für die Zusammenfassung.» — kein Fallback auf Vollkorpus.
- [ ] Weitere Notices wie P5-I06: «Generiere…», Erfolg mit Dateiname, Ollama-Fehler, «Läuft bereits».
- [ ] Orchestrator-Unit-Tests mit injizierten Ports; 0 Chunks → kein `chat`-Aufruf.
- [ ] Manueller Test mit indexiertem Ordner dokumentiert; `npm test`, `npm run build` grün.

## Dev-Lifecycle

1. TDD: 0 Chunks → Abbruch.
2. Menü anbinden; manueller Obsidian-Test.
3. Review gegen [Phase-7-README](../README.md) DoD.

## Ausserhalb des Scopes

- Entfernen des alten Vollkorpus-Pfads aus dem Menü (P7-I05).
- E2E in CI.
