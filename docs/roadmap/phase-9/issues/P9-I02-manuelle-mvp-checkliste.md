# [P9-I02] Manuelle MVP-Klick-Checkliste

```text
Phase: 9
Issue-ID: P9-I02
GitHub: #67
Blockiert von: P9-I01 (#66)
```

## Meta

- **Issue-ID:** P9-I02
- **GitHub:** #67
- **Blockiert von:** [P9-I01](./P9-I01-review-and-fix.md) (#66)
- **Blockiert:** [P9-I03](./P9-I03-findings-triage.md) (#68)

## Abhängigkeiten

- [P9-I01-review-and-fix.md](./P9-I01-review-and-fix.md)

## Ziel

MVP in Obsidian per Klicktest gegen [SPEC.md](../../../../SPEC.md) prüfen; Ergebnisse dokumentieren.

## Testbare Akzeptanzkriterien

- [ ] Checkliste in PR abgearbeitet (Pass/Fail pro Zeile):

| # | Szenario | Erwartung |
|---|----------|-----------|
| 1 | Ordner mit indexierten Quellen → **Create Summary** | Erfolgs-Notice mit `{Ordner}_summary.md` oder Version |
| 2 | Zweiter Lauf, Toggle **Summary-Überschreiben** aus | `{Ordner}_summary_2.md` |
| 3 | Toggle **Summary-Überschreiben** an, Basis existiert | Basis überschrieben; Notice «Summary überschrieben: …» |
| 4 | Leerer Quellordner | Notice «Keine Quellen…» / «Keine Markdown-Quellen…»; keine Summary |
| 5 | Ollama gestoppt oder falsche URL | Sichtbare Fehler-Notice |
| 6 | Button «Verbindung testen» | Erfolg oder Fehler-Notice mit Modellhinweis |
| 7 | Einstellungen ändern, Plugin neu laden | Werte persistent |
| 8 | **Vektorindex zurücksetzen** (falls UI) | Re-Index startet ohne Crash |

- [ ] Abweichungen als Bug-Issue oder Fix in P9-I03 erfasst.
- [ ] Ollama mit `gemma4:e2b` (oder konfiguriertes Modell) und `nomic-embed-text` verfügbar dokumentiert.

## Dev-Lifecycle

1. Nach P9-I01-Merge oder auf gleichem Branch nach Review-Fixes.
2. PR: nur Doku/Kommentar oder kleine Fixes aus Checkliste.
3. Review gegen SPEC US-01–US-03.

## Ausserhalb des Scopes

- Evaluationskorpus und 80-Sekunden-Messung (Phase 11).
- Vollständige Architektur-Doku (Phase 10).
