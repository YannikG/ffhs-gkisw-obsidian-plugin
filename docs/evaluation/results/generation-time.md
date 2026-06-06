# Laufzeit-Messung — Create Summary

Messmethode: manuell, Stoppuhr. Start: Klick auf **Create Summary**. Ende: Erfolgs-Notice mit Dateiname sichtbar.

Referenz-Ziel laut [SPEC.md §8](../../../SPEC.md#8-akzeptanzkriterien-und-evaluation): **unter 80 Sekunden**.

## Ergebnisse

| Datum | Modell (Gen) | Ordner | Sekunden | Hardware | Ollama-Version |
|-------|--------------|--------|----------|----------|----------------|
| 2026-06-04 | gemma4:e2b | evaluation (eval-01, eval-02, eval-03) | **15** | Windows 11 Home | 0.24.0 |

## Bewertung

Lauf erfolgreich abgeschlossen in **15 Sekunden** — deutlich unter dem Zielwert von 80 Sekunden. Zielmetrik **erfüllt**.

## Hinweise

- Korpus: drei Dateien aus `docs/evaluation/corpus/` (Maschinelles Lernen, Relationale Datenbanken, Netzwerkprotokolle).
- Referenzrechner laut SPEC ist MacBook M4 Pro; Messung hier auf Windows 11. Ergebnis trotzdem repräsentativ, da 15 s weit unter dem Limit.
- Embedding-Modell: `nomic-embed-text` (Standard).
