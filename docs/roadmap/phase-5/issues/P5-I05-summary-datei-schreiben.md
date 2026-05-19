# [P5-I05] Summary-Datei ins Vault schreiben

```text
Phase: 5
Issue-ID: P5-I05
GitHub: #23
Blockiert von: P4-I03 (#5)
```

## Meta

- **Issue-ID:** P5-I05
- **GitHub:** #23
- **Blockiert von:** P4-I03 (#5)
- **Blockiert:** P5-I06

## Abhängigkeiten

- [P4-I03-modul-skelett-src.md](../../phase-4/issues/P4-I03-modul-skelett-src.md)

## Ziel

US-03: Summary als Markdown im Zielordner schreiben: erster Lauf `{Ordnername}_summary.md`; weitere Läufe nächste `_summary_N.md` ohne Überschreiben der Basisdatei.

## Testbare Akzeptanzkriterien

- [ ] Erster Lauf ohne bestehende **Summary-Basisdatei:** `buildSummaryOutputFilename(basename)`.
- [ ] Folgelauf mit Basisdatei: `nextSummaryOutputVersion` + `buildSummaryOutputFilename(basename, n)`; Basisdatei wird nicht überschrieben.
- [ ] Schreiben nur über Obsidian Vault-API (Adapter testbar mit Mock).
- [ ] Unit-Tests für Dateinamenwahl und Schreibpfad.
- [ ] `npm test` grün.

## Dev-Lifecycle

1. TDD auf reine Schreibentscheidung (welcher Dateiname).
2. Vault-Adapter implementieren.
3. Review, Merge.

## Scope

Kein LLM-Aufruf. **Summary-Überschreiben**-Einstellung: Phase 8. Kein Bestätigungsdialog für Versionen in Phase 5.
