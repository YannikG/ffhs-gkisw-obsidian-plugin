# [P11-I03] Markdown-Checks und Inhalts-Checkliste

```text
Phase: 11
Issue-ID: P11-I03
GitHub: #73
Blockiert von: P11-I02 (#72)
```

## Meta

- **Issue-ID:** P11-I03
- **GitHub:** #73
- **Blockiert von:** [P11-I02](./P11-I02-laufzeit-messung.md) (#72)
- **Blockiert:** [P12-I01](../../phase-12/issues/P12-I01-freigabe-checkliste.md) (#74)

## Abhängigkeiten

- [P11-I02-laufzeit-messung.md](./P11-I02-laufzeit-messung.md)

## Ziel

SPEC §8 Format und Inhaltsabdeckung nachweisen: semi-automatische Markdown-Validierung der Summary-Ausgaben; manuelle Checkliste für Schlüsselpunkte und eingebaute Quellenfehler.

## Testbare Akzeptanzkriterien

- [ ] Automatisierter Check: Skript oder Vitest-Test prüft erzeugte Summary-`.md` auf parsebares Markdown (z. B. keine kaputten Code-Fences; `$`/`$$` nicht zerrissen — Stichprobe dokumentiert).
- [ ] `docs/evaluation/results/content-coverage.md`: Checkliste pro Korpus-Lauf — Schlüsselpunkte (Ziel ca. 80 %) und **eingebaute Fehler** in Summary sichtbar (Ja/Nein + Kurznotiz).
- [ ] Wikilinks und Math: Spot-Check in derselben Datei dokumentiert.
- [ ] `npm test` grün (falls neuer Test); Anleitung zum Ausführen des Markdown-Checks in `docs/evaluation/README.md` oder Korpus-README.
- [ ] [Phase-11-README](../README.md) DoD erfüllt.

## Dev-Lifecycle

1. Summary-Ausgaben aus P11-I02-Läufen verwenden.
2. Checkliste ausfüllen; optionalen Test/Skript hinzufügen.
3. PR + Review.

## Ausserhalb des Scopes

- ML-basierte Ähnlichkeitsmetriken.
- Community-Store-Freigabe (Phase 12).
