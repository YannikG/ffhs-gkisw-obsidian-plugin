# P9-I02 — Manuelle MVP-Klick-Checkliste: Ergebnisse

```text
Datum:     2026-06-04
Tester:    Gian Luca Tehrani
Branch:    67-p9-i02-manuelle-mvp-checkliste
Modell:    gemma4:e2b
Embedding: nomic-embed-text
```

## Ergebnisse

| # | Szenario | Erwartung | Resultat |
|---|----------|-----------|----------|
| 1 | Ordner mit indexierten Quellen → **Create Summary** | Notice mit `{Ordner}_summary.md` | **Pass** |
| 2 | Zweiter Lauf, Toggle **Summary-Überschreiben** aus | `{Ordner}_summary_2.md` erstellt | **Pass** |
| 3 | Toggle **Summary-Überschreiben** an, Basis existiert | Basis überschrieben; Notice «Summary überschrieben: …» | **Pass** |
| 4 | Leerer Quellordner | Notice «Keine Quellen…»; keine Summary | **Pass** |
| 5 | Ollama gestoppt oder falsche URL | Sichtbare Fehler-Notice | **Pass** |
| 6 | Button **Verbindung testen** | Erfolg- oder Fehler-Notice | **Fail** — Button existiert nicht in der Settings-UI |
| 7 | Einstellungen ändern, Plugin neu laden | Werte persistent | **Pass** |
| 8 | **Vektorindex zurücksetzen** | Re-Index startet ohne Crash | **Pass** |

## Findings

### F-01 — «Verbindung testen»-Button fehlt (Szenario 6)

**Schwere:** Minor  
**Bereich:** `src/settings-tab.ts`

Die Settings-UI enthält keinen Button zum manuellen Testen der Ollama-Verbindung. Laut SPEC soll bei Fehler oder fehlerhafter URL eine sichtbare Notice erscheinen (Kapitel 5). Der Verbindungstest via Button ist in der Spezifikation nicht explizit vorgeschrieben, entspricht aber einem erwartbaren UX-Muster und wurde in der Checkliste (P9-I02) gefordert.

**Massnahme:** Als Bug-Issue in P9-I03 erfassen oder als Follow-up nach Phase 9 zurückstellen.

### F-02 — Settings ohne Abschnittsüberschriften (Szenario 6, Beobachtung)

**Schwere:** Kosmetisch  
**Bereich:** `src/settings-tab.ts`

Nur ein `<h3>`-Abschnitt («Zusammenfassung») vorhanden. Ollama-Felder und Chunk-Felder sind ohne Gruppierung aufgelistet. Kein Blocking-Finding, aber Usability-Verbesserung empfehlenswert.

**Massnahme:** Optional in P9-I03 als Follow-up erfassen.

## Fazit

7 von 8 Szenarien bestanden. Ein funktionales Finding (F-01) und eine kosmetische Beobachtung (F-02) dokumentiert. Kein kritischer Defekt; MVP-Kernfunktionen gemäss SPEC US-01–US-03 funktionieren korrekt.
