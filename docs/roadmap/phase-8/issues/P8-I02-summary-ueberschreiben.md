# [P8-I02] Summary-Überschreiben

```text
Phase: 8
Issue-ID: P8-I02
GitHub: #65
Blockiert von: P5-I05 (#23), P7-I04 (#46), P8-I01 (#64)
```

## Meta

- **Issue-ID:** P8-I02
- **GitHub:** #65
- **Blockiert von:** [P5-I05](../../phase-5/issues/P5-I05-summary-datei-schreiben.md) (#23), [P7-I04](../../phase-7/issues/P7-I04-summary-orchestrator-rag.md) (#46), [P8-I01](./P8-I01-settings-ux-validierung.md) (#64)
- **Blockiert:** [P9-I01](../../phase-9/issues/P9-I01-review-and-fix.md) (#66)

## Abhängigkeiten

- [P5-I05-summary-datei-schreiben.md](../../phase-5/issues/P5-I05-summary-datei-schreiben.md)
- [P7-I04-summary-orchestrator-rag.md](../../phase-7/issues/P7-I04-summary-orchestrator-rag.md)
- [P8-I01-settings-ux-validierung.md](./P8-I01-settings-ux-validierung.md)

## Ziel

Optionale Einstellung **Summary-Überschreiben**: bei aktivem Toggle und existierender **Summary-Basisdatei** (`{Ordnername}_summary.md`) Inhalt per `vault.modify` ersetzen statt neue **Summary-Version** anzulegen (Default: aus, hybrid wie bisher).

## Testbare Akzeptanzkriterien

- [ ] `PluginSettings.summaryOverwriteBase: boolean`, Default `false`; `mergeSettings`-Test.
- [ ] Toggle im UI-Abschnitt **Zusammenfassung** mit sachlichem Hilfetext (nur Basisdatei).
- [ ] Toggle aus: unverändert `nextSummaryOutputVersion` (Basis → `_summary_2`, …).
- [ ] Toggle an + Basisdatei existiert → `modify` auf `{Ordnername}_summary.md`.
- [ ] Toggle an + keine Basisdatei → `create` der Basisdatei.
- [ ] Nur Versionen (`_summary_2+`), keine Basisdatei → hybrid unverändert; Toggle ohne Wirkung.
- [ ] Basisdatei + Versionen existieren, Toggle an → nur Basisdatei überschrieben; Versionen unverändert.
- [ ] Erfolgs-Notice: «Summary überschrieben: {filename}» bei Überschreiben; sonst «Summary erstellt: {filename}».
- [ ] Schreib-Port um `modifyFile` erweitert; `vault-write-summary.ts` nutzt `vault.modify`.
- [ ] Unit-Tests für Pfadwahl und modify vs. create; `npm test` grün.
- [ ] Manueller Klicktest (Einstellungen + ein Overwrite-Lauf) in PR-Beschreibung dokumentiert.

## Dev-Lifecycle

1. TDD: Pfadwahl mit Flag → modify-Port → Toggle-Persistenz.
2. Orchestrator übergibt Setting an Schreiblogik.
3. Review gegen [SPEC.md](../../../../SPEC.md) US-03 und [Phase-8-README](../README.md) DoD.

## Ausserhalb des Scopes

- Bestätigungsdialog vor Überschreiben.
- Überschreiben von **Summary-Versionen** (`_summary_2+`).
- Löschen alter Versionen.
