# [P7-I01] Retrieval-Query-Text (Pure)

```text
Phase: 7
Issue-ID: P7-I01
Blockiert von: P5-I04, P5-I07
```

## Meta

- **Issue-ID:** P7-I01
- **Blockiert von:** [P5-I04-ordner-markdown-einlesen.md](../../phase-5/issues/P5-I04-ordner-markdown-einlesen.md), [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)
- **Blockiert:** P7-I02

## Abhängigkeiten

- [P5-I04-ordner-markdown-einlesen.md](../../phase-5/issues/P5-I04-ordner-markdown-einlesen.md) (Filter `shouldIncludeMarkdownEntry`)
- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)

## Ziel

Reine Funktion `buildRetrievalQueryText` für die **Retrieval-Query**: aus gefilterten Quell-`.md` des **Ordners** einen Text für das Query-Embedding (SPEC §4.2, semantisches Top-K in P7-I02).

## Testbare Akzeptanzkriterien

- [ ] Export `buildRetrievalQueryText(entries)` → String; Einträge alphabetisch nach `vaultPath`.
- [ ] **Roher Concat:** nur Dateiinhalte, zwischen Dateien eine Leerzeile; **kein** `###`-Pfad-Format (das ist **Retrieval-Kontext** im Chat, P7-I03).
- [ ] **Cap 8'000 Zeichen:** Dateien der Reihe nach anhängen bis Cap; Rest weglassen (kein Schnitt mitten in einer Datei).
- [ ] **Leerer Ordner** (keine eingeschlossenen Quellen): Result-Typ/Fehlercode für Orchestrator (wie P5-I04 `empty_folder`).
- [ ] Unit-Tests ohne Obsidian; `npm test` grün.

## Dev-Lifecycle

1. TDD: zwei Dateien unter Cap → erwarteter Query-String.
2. PR nur Pure-Modul; Reuse Filter aus `folder-source-corpus` ohne Duplikat der Regeln.
3. Review gegen diese Datei.

## Ausserhalb des Scopes

- Embedding, `retrieveTopK`, Prompt (P7-I02, P7-I03).
- Vault-Adapter (Orchestrator in P7-I04).
