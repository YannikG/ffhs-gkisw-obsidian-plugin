# [P5-I03] System-Prompt-Modul

```text
Phase: 5
Issue-ID: P5-I03
GitHub: #21
Blockiert von: P4-I03 (#5)
```

## Meta

- **Issue-ID:** P5-I03
- **GitHub:** #21
- **Blockiert von:** P4-I03 (#5)
- **Blockiert:** P5-I06

## Abhängigkeiten

- [P4-I03-modul-skelett-src.md](../../phase-4/issues/P4-I03-modul-skelett-src.md)

## Ziel

Prompt-Bau für Summary-Generierung: exportierte Funktion erzeugt Chat-Messages (system + user) aus Ordner-Label und Quelltext. Prompt-Text iterierbar (SPEC §7), nicht im Issue fixiert.

## Testbare Akzeptanzkriterien

- [ ] `buildSummaryMessages({ folderLabel, sourceContext })` liefert ein Messages-Array für `/api/chat`.
- [ ] System-Prompt fordert valides Obsidian-Markdown und Schweizer Konvention bei deutschsprachigen Quellen (SPEC §7).
- [ ] Unit-Tests prüfen Struktur und enthaltene Platzhalter/Regeln, nicht LLM-Qualität.
- [ ] Kurzer Kommentar im Code, wo der Prompt-Text angepasst wird.
- [ ] `npm test` grün; kein Import von `obsidian` im Pure-Modul.

## Dev-Lifecycle

1. Tests zuerst (Message-Form, Mindestinhalte).
2. PR mit Hinweis, dass finale Qualität manuell iteriert wird.
3. Merge.

## Scope

Keine RAG-Chunks (Phase 7). Keine Evaluations-80%-Metrik (Phase 11).
