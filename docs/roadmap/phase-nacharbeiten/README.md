# Phase Nacharbeiten

[Zurück zur Roadmap-Übersicht](../README.md)

**Status:** In Arbeit

Korrekturen und kleinere Verbesserungen nach der MVP-Freigabe ([Phase 12](../phase-12/README.md)). Kein neuer Funktionsumfang am Plugin-Verhalten.

## Einordnung

Phase 12 hat den MVP formal freigegeben. Im Anschluss zeigten sich Lücken in der Dokumentation und im Release-Prozess, die ohne Produktänderung behoben werden. Diese Phase bündelt diese Nacharbeiten, damit der Stand für Abgabe und eigenständige Installation sauber nachvollziehbar bleibt.

## Inhalt der Nacharbeiten

### Dokumentation

- Übergang von `docs/roadmap/overview.md` zu `docs/roadmap/README.md` als navigierbarer Einstieg pro Ordner.
- Architektur- und Modul-Dokumentation auf Deutsch und auf Konzepte statt Datei-für-Datei-Beschreibung ausgerichtet (`docs/architecture.md`, `docs/modules/`).
- Ethik, Governance und Schwachstellen aus der Gruppenarbeit als kanonische Repo-Doku überführt (`docs/ethik.md`).
- Benutzer-Handbuch ergänzt (`docs/benutzer.md`): Installation, Einstellungen, Create Summary.
- Architecture Decision Records nachgetragen (`docs/adr/0001`–`0003`).

### Kleinere Fixes

- `test-vault/`-Artefakt aus der Versionskontrolle entfernt und in `.gitignore` aufgenommen.
- Manifest-Metadaten in `manifest.meta.json` als Single Source of Truth zentralisiert; der Build erzeugt `manifest.json` daraus (inklusive `author`).

### Release-Automatisierung

- Workflow [`/.github/workflows/release.yml`](../../../.github/workflows/release.yml): baut beim Trigger `release` ein Zip zur eigenständigen Installation und hängt es zusammen mit `manifest.json` und `main.js` an den Release an.
- Skript [`scripts/set-release-version.mjs`](../../../scripts/set-release-version.mjs) (`npm run set-version`): schreibt die korrekte Release-Version aus dem Git-Tag in `manifest.meta.json`, bevor der Build läuft. Damit stimmt die Manifest-Version automatisch mit dem Release-Tag überein.
- Release-Prozess dokumentiert: [docs/release/prozess.md](../../release/prozess.md) (Versionsquelle, Workflow-Ablauf, manuelle Installation aus dem Zip).

## Definition of Done

- [x] Dokumentation auf Ist-Stand und Konzeptfokus angeglichen.
- [x] `test-vault/` entfernt; Manifest-Metadaten zentralisiert.
- [ ] Release-Workflow und Versions-Skript im Repository; erster Release `v1.0.0` ausgelöst.

## Verweise

- [Phase 12](../phase-12/README.md)
- [Release Notes](../../release/notes.md)
- [Release-Prozess](../../release/prozess.md)
- [Dokumentations-Hub](../../README.md)
