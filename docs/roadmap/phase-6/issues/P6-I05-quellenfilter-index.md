# [P6-I05] Quellenfilter im Vektorindex

```text
Phase: 6
Issue-ID: P6-I05
GitHub: #37
Blockiert von: P6-I01 (#34), P5-I07 (#25)
```

## Meta

- **Issue-ID:** P6-I05
- **GitHub:** #37
- **Blockiert von:** [P6-I01](./P6-I01-absatz-chunking.md) (#34), [P5-I07](../../phase-5/issues/P5-I07-phase5-dokumentation.md) (#25)
- **Blockiert:** P6-I04

## Abhängigkeiten

- [P6-I01-absatz-chunking.md](./P6-I01-absatz-chunking.md)
- [P5-I04-ordner-markdown-einlesen.md](../../phase-5/issues/P5-I04-ordner-markdown-einlesen.md) (Filter-Verhalten SPEC §4.4)
- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)

## Ziel

SPEC §4.4 im **Index**-Pfad: keine Plugin-**Summary**-Ausgaben, kein Legacy `summary.md`, kein `.obsidian` im Vektorindex. **Ein** Filter für Korpus (Phase 5) und Index (Phase 6), keine divergierende Logik.

## Testbare Akzeptanzkriterien

- [ ] Pfade mit `*_summary.md`, `*_summary_<Zahl>.md` (`<Zahl>` ≥ 2), `summary.md` werden nicht indexiert (gleiche Regeln wie P5-I04 / `isExcludedSummarySource`).
- [ ] Pfade mit Segment `.obsidian` werden nicht indexiert.
- [ ] Exportierte Pure-Funktion z. B. `shouldIndexVaultPath(path)` oder Wiederverwendung von `shouldIncludeMarkdownEntry` ohne Duplikat der Regeln (Refactor in gemeinsames Modul nur wenn importzyklusfrei).
- [ ] Unit-Tests: Summary-Dateiname und `.obsidian`-Pfad → ausgeschlossen; normale `.md` → eingeschlossen.
- [ ] `npm test` grün.

## Dev-Lifecycle

1. TDD: ausgeschlossene Pfade → `false`.
2. Optional kleiner Refactor `src/summary/` → gemeinsames `src/sources/` wenn nötig; in PR begründen.
3. Review gegen SPEC §4.4.

## Ausserhalb des Scopes

- Chunking-Algorithmus (P6-I01).
- Vault-Event-Wiring (P6-I04).
