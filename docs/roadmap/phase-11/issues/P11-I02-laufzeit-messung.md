# [P11-I02] Laufzeit-Messung dokumentieren

```text
Phase: 11
Issue-ID: P11-I02
GitHub: #72
Blockiert von: P11-I01 (#71)
```

## Meta

- **Issue-ID:** P11-I02
- **GitHub:** #72
- **Blockiert von:** [P11-I01](./P11-I01-evaluationskorpus.md) (#71)
- **Blockiert:** [P11-I03](./P11-I03-markdown-inhalt-evaluation.md) (#73)

## Abhängigkeiten

- [P11-I01-evaluationskorpus.md](./P11-I01-evaluationskorpus.md)

## Ziel

Generierungszeit für **Create Summary** gemäss SPEC §8 dokumentieren: Ziel **unter 80 Sekunden** auf Referenzrechner (MacBook M4 Pro, geringe Systemlast).

## Testbare Akzeptanzkriterien

- [ ] `docs/evaluation/results/generation-time.md` mit mindestens einem vollständigen Lauf pro Evaluations-Ordner (oder begründeter Fokus auf einen Repräsentativ-Ordner).
- [ ] Pro Eintrag: Datum, Modell (Gen), Ordner, Sekunden (Start Klick → Erfolgs-Notice mit Dateiname), Hardware, Ollama-Version optional.
- [ ] Mindestens ein Lauf **&lt; 80 s** oder dokumentierte Abweichung mit Begründung (Modell, Korpusgrösse).
- [ ] Messmethode im Dokument beschrieben (manuell, Stoppuhr oder vergleichbar).

## Dev-Lifecycle

1. Korpus in Vault; Index fertig; Messung durchführen.
2. Ergebnisse committen (nur `docs/evaluation/results/`).
3. PR verweist auf P11-I01-Korpus.

## Ausserhalb des Scopes

- CI-Performance-Test.
- Inhalts-80-%-Bewertung (P11-I03).
