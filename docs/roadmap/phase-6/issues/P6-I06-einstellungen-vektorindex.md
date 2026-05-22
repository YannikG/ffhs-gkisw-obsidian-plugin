# [P6-I06] Einstellungen Vektorindex

```text
Phase: 6
Issue-ID: P6-I06
GitHub: #39
Blockiert von: P6-I03 (#36), P5-I07 (#25)
```

## Meta

- **Issue-ID:** P6-I06
- **GitHub:** #39
- **Blockiert von:** [P6-I03](./P6-I03-vectors-db-schema.md) (#36), [P5-I07](../../phase-5/issues/P5-I07-phase5-dokumentation.md) (#25)
- **Blockiert:** P6-I07

## Abhängigkeiten

- [P6-I03-vectors-db-schema.md](./P6-I03-vectors-db-schema.md)
- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)

## Ziel

Plugin-Einstellungen für **Chunk-Grösse** und **Chunk-Overlap** (Defaults 1000 / 200). UI-Aktion «Vektorindex zurücksetzen / neu aufbauen». Bei Wechsel des **Embedding-Modells:** Notice und vollständiger Re-Index via `truncateAll` auf derselben `vectors.db` (kein zweites DB-File).

## Testbare Akzeptanzkriterien

- [ ] `PluginSettings` um `chunkSize` und `chunkOverlap` erweitert; `mergeSettings` / Defaults in Tests (1000 / 200).
- [ ] Einstellungsseite: zwei Zahlfelder (oder Text mit Validierung) für Grösse und Overlap; Persistenz wie bestehende Felder.
- [ ] Button «Vektorindex zurücksetzen»: löst `truncateAll` + vault-weiten Re-Index aus (Hintergrund/Idle, keine blockierende Voll-UI).
- [ ] **Embedding-Modell-Wechsel:** beim Speichern eines neuen Tags → Notice + gleicher Ablauf wie Reset (`truncateAll` + Re-Index).
- [ ] **Generierungsmodell-Wechsel** allein löst **keinen** Re-Index (bestehendes Verhalten beibehalten).
- [ ] Unit-Tests für Settings-Merge; `npm test` grün.

## Dev-Lifecycle

1. TDD: Defaults und Merge der neuen Felder.
2. UI in `settings-tab.ts`; Reset/Embedding-Hook an Store-API aus P6-I03 anbinden.
3. Review gegen SPEC §6.

## Ausserhalb des Scopes

- **Retrieval Top-K**, **Kontextlimit** (P5 / Phase 7).
- On-Demand-Notice (P6-I07).
