# [P7-I03] Retrieval-Kontext und Top-K-Einstellung

```text
Phase: 7
Issue-ID: P7-I03
GitHub: #45
Blockiert von: P7-I02 (#44)
```

## Meta

- **Issue-ID:** P7-I03
- **GitHub:** #45
- **Blockiert von:** [P7-I02](./P7-I02-retrieve-top-k.md) (#44)
- **Blockiert:** P7-I04

## Abhängigkeiten

- [P7-I02-retrieve-top-k.md](./P7-I02-retrieve-top-k.md)

## Ziel

**Retrieval-Kontext** für Ollama formatieren; **Retrieval Top-K** in Plugin-Einstellungen (Default 8, UI-Feld). `buildSummaryMessages` behält Feld `sourceContext` — Inhalt ist Retrieval-Kontext, nicht **Ordner-Quellkorpus**.

## Testbare Akzeptanzkriterien

- [ ] `buildRetrievalContext(chunks)` → String wie P5-Korpusformat: pro Chunk `### \`vault_path\`` (optional `(chunk n)`), Text, `---` zwischen Chunks.
- [ ] `PluginSettings.retrievalTopK`; Default **8**; `mergeSettings`-Test.
- [ ] Einstellungsseite: Zahlfeld «Retrieval Top-K» mit Persistenz.
- [ ] Unit-Test: zwei Chunks → formatierter String mit Pfaden; `npm test` grün.

## Dev-Lifecycle

1. TDD: Format-Test → Implementierung; Settings-Default-Test.
2. UI in `settings-tab.ts`.
3. Review; UX-Polish Phase 8.

## Ausserhalb des Scopes

- Orchestrator, On-Demand, Notices (P7-I04).
- Umbenennung `sourceContext` in `buildSummaryMessages` (optional; Verhalten dokumentieren reicht).
