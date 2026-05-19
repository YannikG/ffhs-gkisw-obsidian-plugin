# [P5-I04] Markdown aus Ordner einlesen

```text
Phase: 5
Issue-ID: P5-I04
GitHub: #22
Blockiert von: P4-I03 (#5)
```

## Meta

- **Issue-ID:** P5-I04
- **GitHub:** #22
- **Blockiert von:** P4-I03 (#5)
- **Blockiert:** P5-I06

## Abhängigkeiten

- [P4-I03-modul-skelett-src.md](../../phase-4/issues/P4-I03-modul-skelett-src.md)

## Ziel

US-01: Alle Quell-`.md` unter dem gewählten **Ordner** (rekursiv) einlesen und zum **Ordner-Quellkorpus** zusammenführen (Pure-Logik + Vault-Adapter).

## Testbare Akzeptanzkriterien

- [ ] Rekursiver Scan; `.obsidian` ausgeschlossen (SPEC §4.4).
- [ ] `isExcludedSummarySource` für Summary-Ausgaben und `summary.md` angewendet ([`filename.ts`](../../../../src/summary/filename.ts)).
- [ ] Reihenfolge der Dateien: Vault-Pfad alphabetisch aufsteigend.
- [ ] **Leerer Quellordner:** Result-Typ/Fehlercode für Orchestrator (keine stillen leeren Strings).
- [ ] Unit-Tests für Pure-Logik ohne echtes Obsidian; Vault-Adapter testbar mit Stub.
- [ ] `npm test` grün.

## Dev-Lifecycle

1. TDD auf Pure-Sammlung und Filter.
2. Vault-Adapter dünn halten.
3. Review, Merge.

## Scope

**Kontextlimit**-Prüfung: P5-I06. Chunking für Embeddings: Phase 6.
